import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')
  if (!query) return NextResponse.json({ data: [] })

  try {
    const res = await fetch(
      `https://api.tcgdex.net/v2/en/cards?name=${query}&pageSize=20`
    )
    const data = await res.json()
    return NextResponse.json({ data: Array.isArray(data) ? data : [] })
  } catch (err) {
    console.error('TCGDex error:', err)
    return NextResponse.json({ data: [] })
  }
}
