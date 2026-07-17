import { NextResponse } from 'next/server'
import { MAIL_SESSION_COOKIE } from '@/lib/mail/auth'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(MAIL_SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
  return response
}
