const RESEND_API = 'https://api.resend.com'

export const MAILBOXES = ['info@ufolabz.com', 'support@ufolabz.com', 'sales@ufolabz.com'] as const
export type MailboxAddress = (typeof MAILBOXES)[number]

export interface MailSummary {
  id: string
  to: string[]
  from: string
  created_at: string
  subject: string
  bcc?: string[] | null
  cc?: string[] | null
  reply_to?: string[] | null
  message_id?: string
  last_event?: string
  attachments?: MailAttachment[]
}

export interface MailAttachment {
  id: string
  filename: string
  size: number
  content_type: string
  content_disposition?: string
  download_url?: string
  expires_at?: string
}

export interface MailMessage extends MailSummary {
  html?: string | null
  text?: string | null
  headers?: Record<string, string>
}

function apiKey() {
  const value = process.env.RESEND_API_KEY
  if (!value) throw new Error('RESEND_API_KEY is not configured')
  return value
}

async function resendFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${RESEND_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    cache: 'no-store',
  })

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = body?.message || body?.error || `Resend request failed (${response.status})`
    throw new Error(message)
  }
  return body as T
}

export async function listReceivedEmails() {
  return resendFetch<{ object: string; has_more: boolean; data: MailSummary[] }>('/emails/receiving?limit=100')
}

export async function listSentEmails() {
  return resendFetch<{ object: string; has_more: boolean; data: MailSummary[] }>('/emails?limit=100')
}

export async function getReceivedEmail(id: string) {
  const message = await resendFetch<MailMessage>(`/emails/receiving/${encodeURIComponent(id)}`)
  if (message.attachments?.length) {
    const attachments = await resendFetch<{ data: MailAttachment[] }>(
      `/emails/receiving/${encodeURIComponent(id)}/attachments`,
    )
    message.attachments = attachments.data
  }
  return message
}

export async function getSentEmail(id: string) {
  return resendFetch<MailMessage>(`/emails/${encodeURIComponent(id)}`)
}

export async function sendMailboxEmail(input: {
  from: MailboxAddress
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  text: string
  inReplyTo?: string
}) {
  if (!MAILBOXES.includes(input.from)) throw new Error('Invalid sender address')
  const headers = input.inReplyTo ? { 'In-Reply-To': input.inReplyTo, References: input.inReplyTo } : undefined

  return resendFetch<{ id: string }>('/emails', {
    method: 'POST',
    headers: { 'Idempotency-Key': `mail-dashboard-${crypto.randomUUID()}` },
    body: JSON.stringify({
      from: `UFO LABZ <${input.from}>`,
      to: input.to,
      cc: input.cc?.length ? input.cc : undefined,
      bcc: input.bcc?.length ? input.bcc : undefined,
      reply_to: input.from,
      subject: input.subject,
      text: input.text,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#151515;white-space:pre-wrap">${escapeHtml(input.text)}</div>`,
      headers,
      tags: [{ name: 'source', value: 'mail_dashboard' }],
    }),
  })
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
