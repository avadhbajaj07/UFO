import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'
import { renderCalculatorResultsEmail } from '@/lib/email/calculator-results-email'
import { Locale, DEFAULT_LOCALE } from '@/lib/i18n/config'
import { SupportedCurrency } from '@/lib/config/pricing'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const EmailResultsSchema = z.object({
  email: z.string().email().max(200),
  calculatorSlug: z.string().min(1).max(100),
  calculatorName: z.string().min(1).max(100),
  heroNumber: z.string().min(1).max(50),
  heroUnit: z.string().default(''),
  heroInterpretation: z.string().default(''),
  progressPercent: z.number().min(0).max(100).optional(),
  inputs: z.record(z.union([z.string(), z.number()])).default({}),
  locale: z.enum(['fr', 'en', 'de', 'it']).default('fr'),
  currency: z.enum(['CHF', 'EUR']).default('CHF'),
  marketingConsent: z.boolean().default(false),
  honeypot: z.string().optional(),
  utm: z.record(z.string()).optional(),
  referrer: z.string().optional(),
})

// In-memory rate limiting (5 requests per 10 minutes per IP/email)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>()

function isRateLimited(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.expiresAt) {
    rateLimitMap.set(key, { count: 1, expiresAt: now + windowMs })
    return false
  }

  if (record.count >= limit) {
    return true
  }

  record.count += 1
  return false
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}))

    // Honeypot bot check (pretend success silently)
    if (rawBody.honeypot && String(rawBody.honeypot).length > 0) {
      return NextResponse.json({ ok: true, message: 'Processed' })
    }

    const parseResult = EmailResultsSchema.safeParse(rawBody)
    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, error: 'invalid_payload', details: parseResult.error.flatten() },
        { status: 400 }
      )
    }

    const {
      email,
      calculatorSlug,
      calculatorName,
      heroNumber,
      heroUnit,
      heroInterpretation,
      progressPercent,
      inputs,
      locale,
      currency,
      marketingConsent,
      utm = {},
      referrer = '',
    } = parseResult.data

    const normalizedEmail = email.trim().toLowerCase()
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'

    // Rate limiting per IP and per normalized email
    if (isRateLimited(`ip:${ip}`) || isRateLimited(`email:${normalizedEmail}`)) {
      return NextResponse.json(
        { ok: false, error: 'rate_limited', message: 'Too many requests. Please wait a few minutes.' },
        { status: 429 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ufolabz.com'
    const doubleOptInToken = marketingConsent
      ? crypto.randomBytes(24).toString('hex')
      : undefined

    // 1. Supabase Storage (Subscribers & Calculator Leads)
    let subscriberId: string | null = null
    try {
      const supabase = createAdminClient()

      // A. Upsert into subscribers table
      const subscriberStatus = marketingConsent ? 'pending' : 'transactional_only'
      const { data: subData, error: subError } = await supabase
        .from('subscribers')
        .upsert(
          {
            email: normalizedEmail,
            locale,
            currency,
            status: subscriberStatus,
            source: `calculator_${calculatorSlug}`,
            consent_at: marketingConsent ? new Date().toISOString() : null,
            consent_ip: ip,
            double_optin_token: doubleOptInToken || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'email' }
        )
        .select('id')
        .single()

      if (!subError && subData?.id) {
        subscriberId = subData.id
      }

      // B. Insert into calculator_leads
      const { error: leadErr } = await supabase.from('calculator_leads').insert({
        subscriber_id: subscriberId,
        calculator_slug: calculatorSlug,
        locale,
        inputs,
        results: {
          heroNumber,
          heroUnit,
          heroInterpretation,
          progressPercent,
        },
        utm,
        referrer,
        ip_address: ip,
        user_agent: req.headers.get('user-agent') || '',
      })

      if (leadErr) {
        // Fallback to legacy tool_leads if calculator_leads is not yet migrated
        await supabase.from('tool_leads').insert({
          email: normalizedEmail,
          tool: calculatorSlug.replace('-calculator', ''),
          locale,
          consent: marketingConsent,
          result: { ...inputs, heroNumber, heroUnit },
          source_site: 'ufolabz',
        })
      }
    } catch (dbErr: any) {
      console.warn('[EMAIL_RESULTS_API] DB storage notice:', dbErr?.message)
    }

    // 2. Render & Send Email via Resend
    const { subject, html } = renderCalculatorResultsEmail({
      calculatorSlug,
      calculatorName,
      heroNumber,
      heroUnit,
      heroInterpretation,
      progressPercent,
      inputs,
      locale,
      currency,
      doubleOptInToken,
      appUrl,
    })

    const resendApiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'UFO LABZ <support@ufolabz.com>'

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey)
        const { error: mailErr } = await resend.emails.send({
          from: fromEmail,
          to: normalizedEmail,
          subject,
          html,
          headers: {
            'List-Unsubscribe': `<${appUrl}/unsubscribe>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        })

        if (mailErr) {
          console.warn('[EMAIL_RESULTS_API] Resend warning:', mailErr.message)
        }
      } catch (err: any) {
        console.warn('[EMAIL_RESULTS_API] Resend dispatch failed:', err?.message)
      }
    } else {
      console.log(`[MOCK EMAIL RESULTS] To: ${normalizedEmail} | Subject: "${subject}"`)
    }

    return NextResponse.json({
      ok: true,
      message: 'Results email dispatched successfully',
      doubleOptInPending: !!marketingConsent,
    })
  } catch (err: any) {
    console.error('[EMAIL_RESULTS_API] Internal error:', err)
    return NextResponse.json(
      { ok: false, error: 'internal_error', message: err?.message || 'Server error' },
      { status: 500 }
    )
  }
}
