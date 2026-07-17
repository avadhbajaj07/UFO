import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { MAIL_SESSION_COOKIE, verifyMailSession } from '@/lib/mail/auth'
import { MAILBOXES, sendMailboxEmail } from '@/lib/mail/resend'

const emailList = z.array(z.string().trim().email()).max(20)
const schema = z.object({
  from: z.enum(MAILBOXES),
  to: emailList.min(1),
  cc: emailList.optional(),
  bcc: emailList.optional(),
  subject: z.string().trim().min(1).max(500),
  text: z.string().trim().min(1).max(100_000),
  inReplyTo: z.string().max(1_000).optional(),
})

export async function POST(request: NextRequest) {
  if (!verifyMailSession(request.cookies.get(MAIL_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid email details' }, { status: 400 })
  }

  try {
    const result = await sendMailboxEmail(parsed.data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Mail send error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not send email' }, { status: 502 })
  }
}
