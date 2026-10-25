import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ── Temporary Coming Soon Flag ──────────────────────────────────────────
// Set this to `false` when you are ready to make the full website live.
const COMING_SOON = true

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = (request.headers.get('host') || request.nextUrl.hostname).toLowerCase()

  // 1. Handle mail subdomain (e.g. mail.ufolabz.com)
  if (host.startsWith('mail.')) {
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone()
      url.pathname = '/mail'
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }

  // 2. Always allow mail dashboard and mail API routes regardless of maintenance mode
  if (pathname.startsWith('/mail') || pathname.startsWith('/api/mail')) {
    return NextResponse.next()
  }

  if (!COMING_SOON) {
    return NextResponse.next()
  }

  // Allow admin portal, api endpoints, and static files
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Redirect any deep links or direct page visits (e.g. /checkout, /products, /cart, /login) to root
  if (pathname !== '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
