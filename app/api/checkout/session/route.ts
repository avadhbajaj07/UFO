import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import {
  buildStripeLineItems,
  buildValidatedCheckoutTotals,
  toStripeAmount,
} from '@/lib/checkout/amounts'
import { isStripeConfigured, stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { PREORDER_CONFIG } from '@/lib/config/preorder'

function getBaseUrl(req: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL
  if (configuredUrl) return configuredUrl.replace(/\/$/, '')

  const origin = req.headers.get('origin')
  if (origin) return origin

  const host = req.headers.get('host')
  return host ? `https://${host}` : 'https://ufolabz.com'
}

export async function POST(req: NextRequest) {
  let requestedPaymentMethod: string | null = null

  try {
    const supabaseAdmin = createAdminClient()

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
      currency = 'CHF',
      deliveryMethod = 'shipping',
      country,
      items,
      shippingMethod,
      discountAmount,
      carbonOffset,
      couponCode,
    } = body

    requestedPaymentMethod = paymentMethod

    if (!orderNumber || !email || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required checkout information.' },
        { status: 400 }
      )
    }

    const normalizedCurrency = (currency || 'CHF').toUpperCase() === 'EUR' ? 'EUR' : 'CHF'

    if (!['twint', 'card'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Stripe Checkout supports Card (CHF & EUR) and TWINT (CHF only).' },
        { status: 400 }
      )
    }

    if (paymentMethod === 'twint' && normalizedCurrency === 'EUR') {
      return NextResponse.json(
        { error: 'TWINT payment is only available for Swiss Francs (CHF). Please select Card for EUR payments.' },
        { status: 400 }
      )
    }

    const totals = await buildValidatedCheckoutTotals(supabaseAdmin, {
      items,
      currency: normalizedCurrency,
      deliveryMethod,
      country,
      shippingMethod,
      discountAmount,
      couponCode,
      carbonOffset,
    })

    const stripeCurrency = totals.currency.toLowerCase()
    const discounts: { coupon: string }[] = []

    if (totals.discountAmount > 0) {
      const discountName =
        totals.appliedDiscountNote ||
        (totals.stackDiscountPercent > 0
          ? `UFO LABZ ${totals.stackDiscountPercent}% Stack Discount`
          : couponCode
          ? `UFO LABZ ${couponCode}`
          : 'UFO LABZ Checkout Discount')

      const coupon = await stripe.coupons.create({
        amount_off: toStripeAmount(totals.discountAmount),
        currency: stripeCurrency,
        duration: 'once',
        name: discountName,
      })
      discounts.push({ coupon: coupon.id })
    }

    const baseUrl = getBaseUrl(req)
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types:
        paymentMethod === 'twint' && stripeCurrency === 'chf' ? ['twint'] : ['card'],
      customer_email: email,
      line_items: buildStripeLineItems(totals),
      discounts,
      success_url: `${baseUrl}/checkout?stripe_status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?stripe_status=cancelled`,
      billing_address_collection: 'auto',
      metadata: {
        order_number: orderNumber,
        requested_payment_method: paymentMethod,
        currency: totals.currency,
        delivery_method: totals.deliveryMethod,
        preorder: 'true',
        preorder_mode: String(PREORDER_CONFIG.isPreorderMode),
        estimated_ship_date: PREORDER_CONFIG.estimatedShipDate,
        stack_tier_percent: String(totals.stackDiscountPercent),
        stack_discount_amount: String(totals.stackDiscountAmount),
        applied_discount_type: totals.appliedDiscountType,
        coupon_code: couponCode || '',
        stack_id: String(body.stackId || ''),
      },
      payment_intent_data: {
        metadata: {
          order_number: orderNumber,
          customer_name: fullName || '',
          requested_payment_method: paymentMethod,
          preorder: 'true',
          estimated_ship_date: PREORDER_CONFIG.estimatedShipDate,
          delivery_method: totals.deliveryMethod,
          stack_tier_percent: String(totals.stackDiscountPercent),
          stack_discount_amount: String(totals.stackDiscountAmount),
        },
      },
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[STRIPE CHECKOUT] Failed to create session:', err)

    const message = String(err?.message || '')
    if (
      requestedPaymentMethod === 'twint' &&
      message.toLowerCase().includes('twint') &&
      message.toLowerCase().includes('invalid')
    ) {
      return NextResponse.json(
        {
          error:
            'TWINT is not enabled for the Stripe key configured on this deployment. Enable TWINT in the matching Stripe Dashboard mode, or use a Swiss Stripe account/key that supports TWINT.',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: err?.message || 'Unable to start Stripe Checkout.' },
      { status: 500 }
    )
  }
}
