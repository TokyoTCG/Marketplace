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
    const deleteUrl = `https://www.tokyotcg.nl/api/listings?id=${data.id}&secret=${process.env.ADMIN_SECRET}`
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: 'info@tokyotcg.nl',
      subject: `Nieuwe listing: ${cardName} (${graded ? psaGrade : condition}) — verificatie vereist`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#1a1a1c;color:#fff;padding:32px;border-radius:16px">
          <h1 style="color:#a67abf;font-size:20px;margin:0 0 24px">TokyoTCG — Nieuwe listing</h1>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr><td style="color:#888;padding:6px 0;font-size:13px">Kaart</td><td style="color:#fff;font-weight:700;font-size:13px">${cardName} — ${cardSet}</td></tr>
            <tr><td style="color:#888;padding:6px 0;font-size:13px">Conditie</td><td style="color:#fff;font-weight:700;font-size:13px">${graded ? psaGrade : condition}</td></tr>
            <tr><td style="color:#888;padding:6px 0;font-size:13px">Prijs</td><td style="color:#fff;font-weight:700;font-size:13px">€${price}</td></tr>
            <tr><td style="color:#888;padding:6px 0;font-size:13px">Verkoper</td><td style="color:#fff;font-weight:700;font-size:13px">${user.name || token.email}</td></tr>
            <tr><td style="color:#888;padding:6px 0;font-size:13px">Listing ID</td><td style="color:#555;font-size:12px">${data.id}</td></tr>
          </table>
          <div style="display:flex;gap:16px;margin-bottom:24px">
            <div style="flex:1;text-align:center">
              <p style="color:#888;font-size:11px;font-weight:700;letter-spacing:1px;margin:0 0 8px">VOORKANT</p>
              <img src="${uploadedUrls[0]}" style="width:100%;max-width:240px;border-radius:10px;border:1px solid #2e2e31" />
            </div>
            <div style="flex:1;text-align:center">
              <p style="color:#888;font-size:11px;font-weight:700;letter-spacing:1px;margin:0 0 8px">ACHTERKANT</p>
              <img src="${uploadedUrls[1]}" style="width:100%;max-width:240px;border-radius:10px;border:1px solid #2e2e31" />
            </div>
          </div>
          <a href="${deleteUrl}" style="display:block;background:#ef4444;color:#fff;text-decoration:none;text-align:center;padding:14px;border-radius:10px;font-weight:700;font-size:14px;letter-spacing:1px">
            LISTING VERWIJDEREN
          </a>
          <p style="color:#555;font-size:11px;text-align:center;margin-top:12px">Klik alleen als de fotos incorrect of frauduleus zijn</p>
        </div>
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

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const secret = searchParams.get('secret')

  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase.from('listings').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return new Response('<html><body style="font-family:sans-serif;text-align:center;padding:60px;background:#1a1a1c;color:#fff"><h2 style="color:#4ade80">Listing verwijderd</h2><p style="color:#888">Je kunt dit venster sluiten.</p></body></html>', {
    headers: { 'Content-Type': 'text/html' }
  })
}
