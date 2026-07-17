import { NextRequest, NextResponse } from 'next/server'
import {
  MAIL_SESSION_COOKIE,
  createMailSession,
  mailAuthConfigured,
  mailSessionMaxAge,
  verifyMailPassword,
} from '@/lib/mail/auth'

const attempts = new Map<string, { count: number; resetAt: number }>()

export async function POST(request: NextRequest) {
  if (!mailAuthConfigured()) {
    return NextResponse.json({ error: 'Mail dashboard password is not configured.' }, { status: 503 })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  const record = attempts.get(ip)
  if (record && record.resetAt > now && record.count >= 8) {
    return NextResponse.json({ error: 'Too many attempts. Please wait 15 minutes.' }, { status: 429 })
  }

  const body = await request.json().catch(() => ({}))
  if (typeof body.password !== 'string' || !verifyMailPassword(body.password)) {
    attempts.set(ip, record && record.resetAt > now
      ? { ...record, count: record.count + 1 }
      : { count: 1, resetAt: now + 15 * 60 * 1000 })
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  attempts.delete(ip)
  const response = NextResponse.json({ ok: true })
  response.cookies.set(MAIL_SESSION_COOKIE, createMailSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: mailSessionMaxAge,
  })
  return response
}
