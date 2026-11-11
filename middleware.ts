import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCurrencyForCountry } from '@/lib/config/pricing'

// ── Pre-launch Coming Soon Flag ──────────────────────────────────────────
// Set to `false` for LIVE PRE-ORDER store.
const COMING_SOON = false

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

  if (COMING_SOON) {
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

    // Redirect any deep links or direct page visits to root
    if (pathname !== '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // 3. Geo-IP Currency Detection
  // Extract country from Vercel edge geo, CF-IPCountry header, or x-vercel-ip-country
  const geoCountry = (
    (request as any).geo?.country ||
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code') ||
    ''
  ).toUpperCase().trim()

  const detectedCurrency = getCurrencyForCountry(geoCountry)

  // Check manual override cookie
  const manualCookie = request.cookies.get('ufo_currency_manual')?.value
  const existingCurrencyCookie = request.cookies.get('ufo_currency')?.value

  const effectiveCurrency =
    manualCookie && (existingCurrencyCookie === 'CHF' || existingCurrencyCookie === 'EUR')
      ? existingCurrencyCookie
      : detectedCurrency || 'CHF'

  const response = NextResponse.next()

  // Set response headers for server components & APIs
  response.headers.set('x-user-country', geoCountry || 'CH')
  response.headers.set('x-user-currency', effectiveCurrency)

  // Set cookies for client hydration if missing or out of sync (unless manual override)
  if (!existingCurrencyCookie || (!manualCookie && existingCurrencyCookie !== effectiveCurrency)) {
    response.cookies.set('ufo_currency', effectiveCurrency, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    })
  }

  if (geoCountry && request.cookies.get('ufo_country')?.value !== geoCountry) {
    response.cookies.set('ufo_country', geoCountry, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    })
  }

  return response
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
