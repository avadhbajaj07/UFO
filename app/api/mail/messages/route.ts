import { NextRequest, NextResponse } from 'next/server'
import { MAIL_SESSION_COOKIE, verifyMailSession } from '@/lib/mail/auth'
import { listReceivedEmails, listSentEmails, MAILBOXES } from '@/lib/mail/resend'

export async function GET(request: NextRequest) {
  if (!verifyMailSession(request.cookies.get(MAIL_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const folder = request.nextUrl.searchParams.get('folder') === 'sent' ? 'sent' : 'inbox'
  const mailbox = request.nextUrl.searchParams.get('mailbox') || MAILBOXES[0]

  try {
    const response = folder === 'sent' ? await listSentEmails() : await listReceivedEmails()
    const data = response.data.filter((email) => {
      const addresses = folder === 'sent' ? [email.from] : email.to
      return addresses.some((address) => address.toLowerCase().includes(mailbox.toLowerCase()))
    })
    return NextResponse.json({ data, hasMore: response.has_more })
  } catch (error) {
    console.error('Mail list error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not load mail' }, { status: 502 })
  }
}
