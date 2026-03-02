import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { encode } from 'next-auth/jwt'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { email, code } = await req.json()
  if (!email || !code) return NextResponse.json({ error: 'Ongeldige aanvraag' }, { status: 400 })

  // Look up the token
  const { data: tokenRow } = await supabase
    .from('verification_tokens')
    .select('*')
    .eq('identifier', email)
    .eq('token', code)
    .single()

  if (!tokenRow) return NextResponse.json({ error: 'Ongeldige code' }, { status: 400 })

  // Check expiry
  if (new Date(tokenRow.expires) < new Date()) {
    await supabase.from('verification_tokens').delete().eq('identifier', email)
    return NextResponse.json({ error: 'Code is verlopen. Vraag een nieuwe aan.' }, { status: 400 })
  }

  // Delete used token
  await supabase.from('verification_tokens').delete().eq('identifier', email)

  // Generate a short-lived session token to confirm verification
  const token = await encode({
    token: { email, verified: true },
    secret: process.env.NEXTAUTH_SECRET!,
  })

  return NextResponse.json({ success: true, token })
}
