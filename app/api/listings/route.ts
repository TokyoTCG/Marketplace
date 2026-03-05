import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getToken } from 'next-auth/jwt'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })
  if (!token?.email) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }

  const body = await req.json()
  const { cardSlug, cardName, cardSet, condition, price, quantity, notes, photos, graded, psaGrade, fromCamera } = body

  if (!cardSlug || !condition || !price) {
    return NextResponse.json({ error: 'Verplichte velden ontbreken' }, { status: 400 })
  }

  if (!photos || photos.length < 2) {
    return NextResponse.json({ error: "Minimaal 2 foto's vereist (voor- en achterkant)" }, { status: 400 })
  }

  const { data: user } = await supabase
    .from('users')
    .select('id, name, location')
    .eq('email', token.email)
    .single()

  if (!user) return NextResponse.json({ error: 'Gebruiker niet gevonden' }, { status: 404 })

  // Upload photos to Supabase Storage
  const uploadedUrls: string[] = []
  for (let i = 0; i < photos.length; i++) {
    const base64 = photos[i].replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64, 'base64')
    const filename = `${user.id}/${cardSlug}-${Date.now()}-${i}.jpg`

    const { error: uploadError } = await supabase.storage
      .from('listing-photos')
      .upload(filename, buffer, { contentType: 'image/jpeg', upsert: false })

    if (uploadError) {
      return NextResponse.json({ error: 'Foto upload mislukt: ' + uploadError.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('listing-photos').getPublicUrl(filename)
    uploadedUrls.push(urlData.publicUrl)
  }

  // Create listing
  const { data, error } = await supabase.from('listings').insert({
    card_slug: cardSlug,
    card_name: cardName,
    card_set: cardSet,
    condition: graded ? psaGrade : condition,
    price: parseFloat(price),
    quantity: parseInt(quantity),
    notes,
    user_id: user.id,
    username: user.name,
    location: user.location,
    photos: uploadedUrls,
    graded: graded || false,
    psa_grade: psaGrade || null,
    verified: fromCamera ? true : false,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send verification email if photos were uploaded (not camera)
  if (!fromCamera) {
    await resend.emails.send({
      from: 'noreply@tokyotcg.nl',
      to: 'info@tokyotcg.nl',
      subject: `📸 Verificatie vereist: ${cardName} (${graded ? psaGrade : condition})`,
      html: `
        <h2>Nieuwe listing ter verificatie</h2>
        <p><strong>Kaart:</strong> ${cardName} — ${cardSet}</p>
        <p><strong>Conditie:</strong> ${graded ? psaGrade : condition}</p>
        <p><strong>Prijs:</strong> €${price}</p>
        <p><strong>Verkoper:</strong> ${user.name || token.email}</p>
        <p><strong>Foto's:</strong></p>
        <p>Voorkant: <a href="${uploadedUrls[0]}">${uploadedUrls[0]}</a></p>
        <img src="${uploadedUrls[0]}" style="max-width:300px;border-radius:8px;" />
        <p>Achterkant: <a href="${uploadedUrls[1]}">${uploadedUrls[1]}</a></p>
        <img src="${uploadedUrls[1]}" style="max-width:300px;border-radius:8px;" />
        <br/>
        <p>Listing ID: ${data.id}</p>
      `
    })
  }

  return NextResponse.json({ success: true, listing: data })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cardSlug = searchParams.get('cardSlug')
  const graded = searchParams.get('graded')

  let query = supabase.from('listings').select('*').order('created_at', { ascending: false })
  if (cardSlug) query = query.eq('card_slug', cardSlug)
  if (graded === 'true') query = query.eq('graded', true)
  else if (graded === 'false') query = query.eq('graded', false)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ listings: data })
}
