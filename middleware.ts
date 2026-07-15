import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const hostname = (forwardedHost || request.headers.get('host') || '').split(':')[0]
  const isAdminHost = hostname === 'admin.ufolabz.com'
  const isAdminRoot = isAdminHost && request.nextUrl.pathname === '/'

  // Keep the clean subdomain URL visible while serving the existing admin route.
  const createResponse = () => {
    if (isAdminRoot) {
      const adminUrl = request.nextUrl.clone()
      adminUrl.pathname = '/admin'
      return NextResponse.rewrite(adminUrl, { request: { headers: request.headers } })
    }

    return NextResponse.next({ request: { headers: request.headers } })
  }

  let response = createResponse()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: any) {
          cookiesToSet.forEach(({ name, value }: any) => request.cookies.set(name, value))
          response = createResponse()
          cookiesToSet.forEach(({ name, value, options }: any) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 1. Admin Panel Access Guard
  const isAdminPath = request.nextUrl.pathname === '/admin'
    || request.nextUrl.pathname.startsWith('/admin/')
  const isAdminRequest = isAdminRoot || isAdminPath

  if (isAdminRequest) {
    if (!user) {
      const redirectPath = isAdminHost ? '/' : '/admin'
      const adminLoginFlag = isAdminHost ? '&admin=1' : ''
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(redirectPath)}${adminLoginFlag}`, request.url)
      )
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      return NextResponse.redirect(
        new URL('/', isAdminHost ? 'https://ufolabz.com' : request.url)
      )
    }
  }

  // 2. Affiliate Portal Access Guard
  if (request.nextUrl.pathname.startsWith('/affiliate')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirect=/affiliate', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
