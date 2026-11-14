import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json({ ok: false, error: 'Missing webhook payload' }, { status: 400 })
    }

    const resendId = data.email_id || data.id
    const recipientEmail = Array.isArray(data.to) ? data.to[0] : data.to

    console.log(`[RESEND WEBHOOK] Received event: ${type} for ${recipientEmail} (${resendId})`)

    try {
      const supabase = createAdminClient()

      // Log to email_events
      await supabase.from('email_events').insert({
        resend_id: resendId,
        type: type.replace('email.', ''),
        url: data.click?.link || null,
        metadata: data,
      })

      // If bounced or complained, auto-suppress and update subscriber
      if (type === 'email.bounced' || type === 'email.complained') {
        const reason = type === 'email.bounced' ? 'bounce' : 'complaint'
        if (recipientEmail) {
          await supabase.from('suppressions').upsert(
            { email: recipientEmail.toLowerCase().trim(), reason },
            { onConflict: 'email' }
          )
          await supabase
            .from('subscribers')
            .update({ status: reason === 'bounce' ? 'bounced' : 'complained' })
            .eq('email', recipientEmail.toLowerCase().trim())
        }
      }
    } catch (err: any) {
      console.warn('[RESEND WEBHOOK] DB storage warning:', err?.message)
    }

    return NextResponse.json({ ok: true, received: true })
  } catch (err: any) {
    console.error('[RESEND WEBHOOK] Handler error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 })
  }
}
