import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fetchSoldPrices(cardName: string, setName: string, marketplace: string) {
  const appId = process.env.EBAY_CLIENT_ID;
  const query = encodeURIComponent(`${cardName} ${setName} pokemon card japanese -PSA -BGS -CGC -graded`);

  const url = `https://svcs.ebay.com/services/search/FindingService/v1` +
    `?OPERATION-NAME=findCompletedItems` +
    `&SERVICE-VERSION=1.0.0` +
    `&SECURITY-APPNAME=${appId}` +
    `&RESPONSE-DATA-FORMAT=JSON` +
    `&GLOBAL-ID=${marketplace}` +
    `&keywords=${query}` +
    `&itemFilter(0).name=SoldItemsOnly` +
    `&itemFilter(0).value=true` +
    `&sortOrder=EndTimeSoonest` +
    `&paginationInput.entriesPerPage=50`;

  const res = await fetch(url);
  const data = await res.json();

  const items = data?.findCompletedItemsResponse?.[0]?.searchResult?.[0]?.item || [];

  return items.map((item: any) => ({
    title: item.title?.[0],
    price: parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__),
    currency: item.sellingStatus?.[0]?.currentPrice?.[0]?.['@currencyId'],
    date: item.listingInfo?.[0]?.endTime?.[0],
    marketplace,
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cardName = searchParams.get('card') || '';
  const setName = searchParams.get('set') || '';
  const cardSlug = searchParams.get('slug') || cardName.toLowerCase().replace(/\s+/g, '-');

  if (!cardName) {
    return NextResponse.json({ error: 'card parameter is required' }, { status: 400 });
  }

  try {
    // Fetch from eBay
    const [de, us, nl] = await Promise.all([
      fetchSoldPrices(cardName, setName, 'EBAY-DE'),
      fetchSoldPrices(cardName, setName, 'EBAY-US'),
      fetchSoldPrices(cardName, setName, 'EBAY-NL'),
    ]);

    const allPrices = [...de, ...us, ...nl]
      .filter(p => !isNaN(p.price) && p.price > 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Save to Supabase
    if (allPrices.length > 0) {
      await supabase.from('card_price_history').insert(
        allPrices.map(p => ({
          card_slug: cardSlug,
          card_name: cardName,
          set_name: setName,
          price: p.price,
          currency: p.currency,
          marketplace: p.marketplace,
          listing_title: p.title,
          sold_at: p.date,
        }))
      );
    }

    // Always return from Supabase so chart has full history
    const { data: history } = await supabase
      .from('card_price_history')
      .select('price, currency, sold_at, marketplace')
      .eq('card_slug', cardSlug)
      .order('sold_at', { ascending: true });

    return NextResponse.json({ prices: history || [] });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}
