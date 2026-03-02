import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getToken } from 'next-auth/jwt'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })
  if (!token?.email) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }
  const { cardSlug, cardName, cardSet, condition, price, quantity, notes } = await req.json()
  if (!cardSlug || !condition || !price) {
    return NextResponse.json({ error: 'Verplichte velden ontbreken' }, { status: 400 })
  }
  const { data: user } = await supabase
    .from('users')
    .select('id, name, location')
    .eq('email', token.email)
    .single()
  if (!user) return NextResponse.json({ error: 'Gebruiker niet gevonden' }, { status: 404 })
  const { data, error } = await supabase.from('listings').insert({
    card_slug: cardSlug,
    card_name: cardName,
    card_set: cardSet,
    condition,
    price: parseFloat(price),
    quantity: parseInt(quantity),
    notes,
    user_id: user.id,
    username: user.name,
    location: user.location,
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, listing: data })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cardSlug = searchParams.get('cardSlug')
  let query = supabase.from('listings').select('*').order('created_at', { ascending: false })
  if (cardSlug) query = query.eq('card_slug', cardSlug)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ listings: data })
}
