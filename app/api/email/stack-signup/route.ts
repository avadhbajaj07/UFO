import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { emailService } from '@/lib/email/email'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, consent = true } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    if (!consent) {
      return NextResponse.json(
        { error: 'Consent to receive updates is required.' },
        { status: 400 }
      )
    }

    const cleanEmail = email.toLowerCase().trim()
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

    // Try storing in Supabase email_signups table
    try {
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const supabase = createAdminClient()
        await (supabase.from('email_signups') as any).insert({
          email: cleanEmail,
          source: 'build_your_stack',
          consent_given: true,
          ip_address: ip,
        })
      }
    } catch (dbErr) {
      console.warn('Could not insert into email_signups table, continuing:', dbErr)
    }

    // Send welcome confirmation via Resend
    try {
      await emailService.sendNewsletterWelcome(cleanEmail)
    } catch (mailErr) {
      console.warn('Could not dispatch welcome email:', mailErr)
    }

    return NextResponse.json({
      success: true,
      message: 'You have been registered for UFO LABZ Batch 01 pre-order dispatch & restock updates.',
    })
  } catch (err: any) {
    console.error('Stack signup error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to register subscription.' },
      { status: 500 }
    )
  }
}
