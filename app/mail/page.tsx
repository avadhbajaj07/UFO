import { cookies } from 'next/headers'
import { MAIL_SESSION_COOKIE, mailAuthConfigured, verifyMailSession } from '@/lib/mail/auth'
import MailLogin from '@/components/mail/MailLogin'
import MailDashboard from '@/components/mail/MailDashboard'

export const dynamic = 'force-dynamic'

export default function MailPage() {
  const authenticated = verifyMailSession(cookies().get(MAIL_SESSION_COOKIE)?.value)

  if (!authenticated) {
    return <MailLogin configured={mailAuthConfigured()} />
  }

  return <MailDashboard />
}
