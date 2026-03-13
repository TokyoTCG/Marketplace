import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MARKETPLACES = [
  "EBAY-US",
  "EBAY-GB",
  "EBAY-DE",
  "EBAY-AU",
  "EBAY-JP",
  "EBAY-SG",
];

async function getEurRates(): Promise<Record<string, number>> {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/EUR");
    const data = await res.json();
    return data.rates || {};
  } catch {
    return {
      USD: 1.08, GBP: 0.86, AUD: 1.65, JPY: 160.0,
      SGD: 1.45, EUR: 1.0,
    };
  }
}

function toEur(price: number, currency: string, rates: Record<string, number>): number {
  if (currency === "EUR") return price;
  const rate = rates[currency];
  if (!rate) return price;
  return price / rate;
}

async function fetchSoldPrices(
  cardName: string,
  setName: string,
  marketplace: string,
  graded: boolean,
  grade: string | undefined,
  eurRates: Record<string, number>
) {
  const appId = process.env.EBAY_CLIENT_ID;

  let queryStr = cardName + " " + setName + " pokemon japanese";
  if (graded && grade) {
    queryStr += " " + grade;
  } else if (graded) {
    queryStr += " PSA";
  } else {
    queryStr += " -PSA -BGS -CGC -graded";
  }

  const query = encodeURIComponent(queryStr);
  const url =
    "https://svcs.ebay.com/services/search/FindingService/v1" +
    "?OPERATION-NAME=findCompletedItems" +
    "&SERVICE-VERSION=1.0.0" +
    "&SECURITY-APPNAME=" + appId +
    "&RESPONSE-DATA-FORMAT=JSON" +
    "&GLOBAL-ID=" + marketplace +
    "&keywords=" + query +
    "&itemFilter(0).name=SoldItemsOnly" +
    "&itemFilter(0).value=true" +
    "&sortOrder=EndTimeSoonest" +
    "&paginationInput.entriesPerPage=50";

  try {
    const res = await fetch(url);
    const data = await res.json();
    const items = data?.findCompletedItemsResponse?.[0]?.searchResult?.[0]?.item || [];

    return items.map((item: any) => {
      const rawPrice = parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__);
      const currency = item.sellingStatus?.[0]?.currentPrice?.[0]?.["@currencyId"];
      return {
        title: item.title?.[0],
        price: toEur(rawPrice, currency, eurRates),
        currency: "EUR",
        date: item.listingInfo?.[0]?.endTime?.[0],
        marketplace,
      };
    });
  } catch {
    console.warn("Failed to fetch from " + marketplace);
    return [];
  }
}

async function fetchActivePrices(
  cardName: string,
  setName: string,
  marketplace: string,
  graded: boolean,
  grade: string | undefined,
  eurRates: Record<string, number>
) {
  const appId = process.env.EBAY_CLIENT_ID;

  let queryStr = cardName + " " + setName + " pokemon japanese";
  if (graded && grade) {
    queryStr += " " + grade;
  } else if (graded) {
    queryStr += " PSA";
  } else {
    queryStr += " -PSA -BGS -CGC -graded";
  }

  const query = encodeURIComponent(queryStr);
  const url =
    "https://svcs.ebay.com/services/search/FindingService/v1" +
    "?OPERATION-NAME=findItemsAdvanced" +
    "&SERVICE-VERSION=1.0.0" +
    "&SECURITY-APPNAME=" + appId +
    "&RESPONSE-DATA-FORMAT=JSON" +
    "&GLOBAL-ID=" + marketplace +
    "&keywords=" + query +
    "&sortOrder=PricePlusShippingLowest" +
    "&paginationInput.entriesPerPage=10";

  try {
    const res = await fetch(url);
    const data = await res.json();
    const items = data?.findItemsAdvancedResponse?.[0]?.searchResult?.[0]?.item || [];
    return items.map((item: any) => {
      const rawPrice = parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__);
      const currency = item.sellingStatus?.[0]?.currentPrice?.[0]?.["@currencyId"];
      return toEur(rawPrice, currency, eurRates);
    }).filter((p: number) => !isNaN(p) && p > 0);
  } catch {
    console.warn("Failed to fetch active from " + marketplace);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cardName = searchParams.get("card") || "";
  const setName = searchParams.get("set") || "";
  const cardSlug = searchParams.get("slug") || cardName.toLowerCase().replace(/\s+/g, "-");
  const graded = searchParams.get("graded") === "true";
  const grade = searchParams.get("grade") || undefined;

  if (!cardName) {
    return NextResponse.json({ error: "card parameter is required" }, { status: 400 });
  }

  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recentFetch } = await supabase
      .from("card_price_history")
      .select("sold_at")
      .eq("card_slug", cardSlug)
      .gte("created_at", since)
      .limit(1);

    const eurRates = await getEurRates();
    let lowestAsk: number | null = null;

    // Always fetch active listings
    const activeResults = await Promise.all(
      MARKETPLACES.map((m) => fetchActivePrices(cardName, setName, m, graded, grade, eurRates))
    );
    const allActive = activeResults.flat().filter((p) => p > 0);
    if (allActive.length > 0) lowestAsk = Math.min(...allActive);

    // Only fetch sold if no fresh cache
    if (!recentFetch || recentFetch.length === 0) {
      const results = await Promise.all(
        MARKETPLACES.map((m) => fetchSoldPrices(cardName, setName, m, graded, grade, eurRates))
      );

      const allPrices = results
        .flat()
        .filter((p) => !isNaN(p.price) && p.price > 0)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      if (allPrices.length > 0) {
        await supabase.from("card_price_history").insert(
          allPrices.map((p) => ({
            card_slug: cardSlug,
            card_name: cardName,
            set_name: setName,
            price: p.price,
            currency: "EUR",
            marketplace: p.marketplace,
            listing_title: p.title,
            sold_at: p.date,
            psa_grade: grade || null,
          }))
        );
      }
    }

    let query = supabase
      .from("card_price_history")
      .select("price, currency, sold_at, marketplace, psa_grade")
      .eq("card_slug", cardSlug)
      .order("sold_at", { ascending: true });

    if (grade) query = query.eq("psa_grade", grade);

    const { data: history } = await query;
    return NextResponse.json({ prices: history || [], lowestAsk });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}
