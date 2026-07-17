import { createHmac, timingSafeEqual } from 'crypto'

export const MAIL_SESSION_COOKIE = 'ufo_mail_session'
const SESSION_LIFETIME_SECONDS = 60 * 60 * 12

function getSecret() {
  return process.env.MAIL_SESSION_SECRET || ''
}

function sign(payload: string) {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url')
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function mailAuthConfigured() {
  return Boolean(process.env.MAIL_DASHBOARD_PASSWORD && getSecret())
}

export function verifyMailPassword(password: string) {
  const expected = process.env.MAIL_DASHBOARD_PASSWORD
  if (!expected || !getSecret()) return false
  return safeEqual(
    createHmac('sha256', getSecret()).update(password).digest('hex'),
    createHmac('sha256', getSecret()).update(expected).digest('hex'),
  )
}

export function createMailSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_LIFETIME_SECONDS
  const payload = Buffer.from(JSON.stringify({ expiresAt })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function verifyMailSession(token?: string | null) {
  if (!token || !getSecret()) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return typeof parsed.expiresAt === 'number' && parsed.expiresAt > Date.now() / 1000
  } catch {
    return false
  }
}

export const mailSessionMaxAge = SESSION_LIFETIME_SECONDS
