import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code
  const response = NextResponse.redirect(new URL('/', request.url))
  
  if (code) {
    response.cookies.set('ufo_referral_code', code, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      sameSite: 'lax'
    })
  }
  
  return response
}
