import { NextRequest, NextResponse } from 'next/server'
import { MAIL_SESSION_COOKIE, verifyMailSession } from '@/lib/mail/auth'
import { getReceivedEmail, getSentEmail } from '@/lib/mail/resend'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyMailSession(request.cookies.get(MAIL_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!/^[a-zA-Z0-9-]{8,80}$/.test(params.id)) {
    return NextResponse.json({ error: 'Invalid message ID' }, { status: 400 })
  }

  try {
    const message = request.nextUrl.searchParams.get('folder') === 'sent'
      ? await getSentEmail(params.id)
      : await getReceivedEmail(params.id)
    return NextResponse.json(message)
  } catch (error) {
    console.error('Mail retrieve error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not load message' }, { status: 502 })
  }
}
