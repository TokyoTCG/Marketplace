import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderId, total, items } = await req.json();

    const response = await fetch("https://confirmo.net/api/v3/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CONFIRMO_API_KEY}`,
      },
      body: JSON.stringify({
        invoice: {
          currencyFrom: "EUR",
          amount: total,
          currencyTo: null,
          description: `TokyoTCG Order #${orderId.slice(0, 8).toUpperCase()}`,
        },
        settlement: {
          currency: "EUR",
        },
        notificationUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/confirmo/webhook`,
        returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/success?order=${orderId}`,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/payment`,
        reference: orderId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Confirmo error:", data);
      return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
    }

    return NextResponse.json({ url: data.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
