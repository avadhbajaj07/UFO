import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'
import { buildStripeLineItems, buildValidatedCheckoutTotals, toStripeAmount } from '@/lib/checkout/amounts'
import { isStripeConfigured, stripe } from '@/lib/stripe'

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function getBaseUrl(req: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL
  if (configuredUrl) return configuredUrl.replace(/\/$/, '')

  const origin = req.headers.get('origin')
  if (origin) return origin

  const host = req.headers.get('host')
  return host ? `https://${host}` : 'http://localhost:3000'
}

export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to the environment.' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const {
      orderNumber,
      email,
      fullName,
      paymentMethod,
      items,
      shippingMethod,
      discountAmount,
      carbonOffset,
      couponCode,
    } = body

    if (!orderNumber || !email || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required checkout information.' },
        { status: 400 }
      )
    }

    if (!['twint', 'card'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Stripe Checkout only supports TWINT and card payments here.' },
        { status: 400 }
      )
    }

    const totals = await buildValidatedCheckoutTotals(supabaseAdmin, {
      items,
      shippingMethod,
      discountAmount,
      carbonOffset,
    })

    const discounts: { coupon: string }[] = []
    if (totals.discountAmount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: toStripeAmount(totals.discountAmount),
        currency: 'chf',
        duration: 'once',
        name: couponCode ? `UFO LABZ ${couponCode}` : 'UFO LABZ checkout discount',
      })
      discounts.push({ coupon: coupon.id })
    }

    const baseUrl = getBaseUrl(req)
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      customer_email: email,
      line_items: buildStripeLineItems(totals),
      discounts,
      success_url: `${baseUrl}/checkout?stripe_status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?stripe_status=cancelled`,
      billing_address_collection: 'auto',
      metadata: {
        order_number: orderNumber,
        requested_payment_method: paymentMethod,
        coupon_code: couponCode || '',
      },
      payment_intent_data: {
        metadata: {
          order_number: orderNumber,
          customer_name: fullName || '',
          requested_payment_method: paymentMethod,
        },
      },
    }

    if (paymentMethod === 'twint') {
      sessionParams.payment_method_types = ['twint', 'card']
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[STRIPE CHECKOUT] Failed to create session:', err)
    return NextResponse.json(
      { error: err?.message || 'Unable to start Stripe Checkout.' },
      { status: 500 }
    )
  }
}
