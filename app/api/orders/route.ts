import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getToken } from 'next-auth/jwt';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET! });
  if (!token?.email) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
  }

  const { cart, shipping, total } = await request.json();

  if (!cart?.length) {
    return NextResponse.json({ error: 'Winkelwagen is leeg' }, { status: 400 });
  }

  // Get user from supabase
  const { data: userData } = await supabase
    .from('users')
    .select('id')
    .eq('email', token.email)
    .single();

  // Create order
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      buyer_id: userData?.id,
      total,
      status: 'pending',
      shipping_name: shipping.name,
      shipping_email: shipping.email,
      shipping_address: shipping.address,
      shipping_city: shipping.city,
      shipping_postal: shipping.postal,
      shipping_country: shipping.country,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create order items
  await supabase.from('order_items').insert(
    cart.map((item: any) => ({
      order_id: order.id,
      listing_id: item.listingId,
      card_name: item.cardName,
      card_set: item.cardSet,
      card_image: item.image,
      condition: item.condition,
      price: item.price,
      quantity: item.quantity,
    }))
  );

  return NextResponse.json({ orderId: order.id });
}
