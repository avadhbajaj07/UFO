import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const hostname = (forwardedHost || request.headers.get('host') || '').split(':')[0]

  // Keep the clean admin subdomain URL visible. Authorization is enforced in
  // app/admin/layout.tsx, where failures cannot take down public storefronts.
  if (hostname === 'admin.ufolabz.com' && request.nextUrl.pathname === '/') {
    const adminUrl = request.nextUrl.clone()
    adminUrl.pathname = '/admin'
    return NextResponse.rewrite(adminUrl)
  }

  if (hostname === 'mail.ufolabz.com') {
    // Keep storefront pages from being exposed on the dedicated mail host.
    // Framework assets and protected mail APIs must retain their real paths.
    const pathname = request.nextUrl.pathname
    const isMailAssetOrApi = pathname.startsWith('/_next/') || pathname.startsWith('/api/mail/')

    if (!isMailAssetOrApi && pathname !== '/') {
      const rootUrl = request.nextUrl.clone()
      rootUrl.pathname = '/'
      rootUrl.search = ''
      return NextResponse.redirect(rootUrl)
    }

    if (pathname === '/') {
      const mailUrl = request.nextUrl.clone()
      mailUrl.pathname = '/mail'
      return NextResponse.rewrite(mailUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*'],
}
