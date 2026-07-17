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

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*'],
}
