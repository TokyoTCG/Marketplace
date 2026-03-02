import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { email, username } = await req.json()
  if (!email || !username) return NextResponse.json({ error: 'Ongeldige aanvraag' }, { status: 400 })

  // Check username is not taken
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('name', username)
    .single()

  if (existing) return NextResponse.json({ error: 'Gebruikersnaam is al bezet' }, { status: 400 })

  // Upsert user with username
  const { error } = await supabase
    .from('users')
    .upsert({ email, name: username }, { onConflict: 'email' })

  if (error) return NextResponse.json({ error: 'Er is iets misgegaan' }, { status: 500 })

  return NextResponse.json({ success: true })
}
