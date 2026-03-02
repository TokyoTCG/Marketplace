import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email vereist' }, { status: 400 })

  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  const isNewUser = !existingUser

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expires = new Date(Date.now() + 10 * 60 * 1000)

  await supabase.from('verification_tokens').delete().eq('identifier', email)
  await supabase.from('verification_tokens').insert({
    identifier: email,
    token: code,
    expires: expires.toISOString(),
  })

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: 'Jouw TokyoTCG verificatiecode',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; background: #1a1a1c; color: #fff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 800; color: #a67abf; margin: 0;">TokyoTCG ᯓ★</h1>
        </div>
        <p style="color: #aaa; margin-bottom: 8px;">Jouw verificatiecode is:</p>
        <div style="background: #2b2b2e; border: 1px solid #3a3a3d; border-radius: 12px; padding: 24px; text-align: center; margin: 16px 0;">
          <span style="font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #fff;">${code}</span>
        </div>
        <p style="color: #555; font-size: 13px; text-align: center;">Deze code is 10 minuten geldig.</p>
      </div>
    `,
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: 'Email kon niet worden verstuurd', details: error }, { status: 500 })
  }

  console.log('Email sent:', data)
  return NextResponse.json({ isNewUser })
}
