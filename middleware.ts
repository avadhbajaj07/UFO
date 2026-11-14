import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getCurrencyForCountry } from '@/lib/config/pricing'
import {
  DEFAULT_LOCALE,
  LOCALES,
  stripLocalePrefix,
  detectLocaleFromAcceptLanguage,
  isValidLocale,
  Locale,
} from '@/lib/i18n/config'

// ── Pre-launch Coming Soon Flag ──────────────────────────────────────────
const COMING_SOON = false

export async function middleware(request: NextRequest) {
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

  // 2. Always allow mail dashboard and mail API routes
  if (pathname.startsWith('/mail') || pathname.startsWith('/api/mail')) {
    return NextResponse.next()
  }

  // 3. Skip i18n rewrites for static assets, system routes & APIs
  const isStaticOrSystem =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/admin-icon') ||
    pathname.startsWith('/pos') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.includes('.')

  // 4. Handle default locale prefix cleanup: /fr/* -> /* (308 Permanent Redirect)
  if (!isStaticOrSystem && (pathname === '/fr' || pathname.startsWith('/fr/'))) {
    const cleanPath = stripLocalePrefix(pathname)
    const url = request.nextUrl.clone()
    url.pathname = cleanPath
    const redirectRes = NextResponse.redirect(url, 308)
    redirectRes.cookies.set('NEXT_LOCALE', 'fr', { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
    return redirectRes
  }

  // 5. First-time visit to root '/': check Accept-Language if no NEXT_LOCALE cookie exists
  const existingLocaleCookie = request.cookies.get('NEXT_LOCALE')?.value as Locale | undefined
  if (!isStaticOrSystem && pathname === '/' && !existingLocaleCookie) {
    const detected = detectLocaleFromAcceptLanguage(request.headers.get('accept-language'))
    if (detected !== DEFAULT_LOCALE && detected !== 'fr') {
      const url = request.nextUrl.clone()
      url.pathname = `/${detected}`
      const redirectRes = NextResponse.redirect(url, 307)
      redirectRes.cookies.set('NEXT_LOCALE', detected, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
      return redirectRes
    }
  }

  // 6. Determine active locale and target internal rewrite path
  let activeLocale: Locale = DEFAULT_LOCALE
  let rewriteUrl: URL | null = null

  if (!isStaticOrSystem) {
    const localePrefixMatch = pathname.match(/^\/(en|de|it)(\/|$)/)
    if (localePrefixMatch) {
      activeLocale = localePrefixMatch[1] as Locale

      // Tools already use app/(store)/[locale]/tools, so leave path intact
      const isToolsRoute = pathname === `/${activeLocale}/tools` || pathname.startsWith(`/${activeLocale}/tools/`)
      if (!isToolsRoute) {
        // Strip prefix internally for app router (e.g. /en/products -> /products)
        const stripped = stripLocalePrefix(pathname)
        rewriteUrl = request.nextUrl.clone()
        rewriteUrl.pathname = stripped
      }
    } else {
      activeLocale = 'fr'
    }
  }

  // Prepare base response (rewrite or next)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', activeLocale)

  let response: NextResponse
  if (rewriteUrl) {
    response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    })
  } else {
    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Set NEXT_LOCALE cookie if missing or changed
  if (!isStaticOrSystem && existingLocaleCookie !== activeLocale) {
    response.cookies.set('NEXT_LOCALE', activeLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }

  // 7. Refresh Supabase auth session token only when auth cookies exist or on protected paths
  const hasAuthCookie = request.cookies.getAll().some(c => c.name.includes('-auth-token') || c.name.startsWith('sb-'))
  const isProtectedPath = pathname.startsWith('/admin') || pathname.startsWith('/account') || pathname.startsWith('/affiliate')

  if (hasAuthCookie || isProtectedPath) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhwbmniqplygipszkhcb.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_lzpNvYE27E-8hXthNbNosQ_adMOOA8x'

    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      })

      await supabase.auth.getUser()
    } catch (err) {
      // Session refresh error handled gracefully
    }
  }

  // 8. Geo-IP Currency Detection
  const geoCountry = (
    (request as any).geo?.country ||
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code') ||
    ''
  ).toUpperCase().trim()

  const detectedCurrency = getCurrencyForCountry(geoCountry)

  const manualCookie = request.cookies.get('ufo_currency_manual')?.value
  const existingCurrencyCookie = request.cookies.get('ufo_currency')?.value

  const effectiveCurrency =
    manualCookie && (existingCurrencyCookie === 'CHF' || existingCurrencyCookie === 'EUR')
      ? existingCurrencyCookie
      : detectedCurrency || 'CHF'

  // Set response headers for server components & APIs
  response.headers.set('x-user-country', geoCountry || 'CH')
  response.headers.set('x-user-currency', effectiveCurrency)
  response.headers.set('x-locale', activeLocale)

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
