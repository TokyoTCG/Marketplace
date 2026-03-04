import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const bypass = request.cookies.get('tcg_bypass')?.value
  const { pathname } = request.nextUrl

  if (pathname === '/coming-soon' || pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/logo') || pathname.includes('.')) {
    return NextResponse.next()
  }

  if (bypass !== 'true') {
    return NextResponse.redirect(new URL('/coming-soon', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
