import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { emailService } from '@/lib/email/email'
import { buildValidatedCheckoutTotals, toStripeAmount } from '@/lib/checkout/amounts'
import { isStripeConfigured, stripe } from '@/lib/stripe'
import { PREORDER_CONFIG } from '@/lib/config/preorder'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = createAdminClient()
    const body = await req.json()

    const {
      orderNumber,
      email,
      fullName,
      phone,
      shippingAddress,
      billingAddress,
      shippingMethod,
      deliveryMethod,
      currency,
      paymentMethod,
      items,
      subtotal,
      discountAmount,
      shippingAmount,
      total,
      carbonOffset,
      couponCode,
      stripeSessionId,
    } = body

    // Validate essential properties
    if (!orderNumber || !email || !items || !items.length) {
      return NextResponse.json(
        { error: 'Missing required checkout information.' },
        { status: 400 }
      )
    }

    // 1. Only the authenticated session may own an order. Never trust a profile ID from request body.
    const supabaseUser = createClient()
    const {
      data: { user },
    } = await supabaseUser.auth.getUser()
    let profileId = user?.id ?? null

    // Validate profile existence and auto-create if missing
    if (profileId) {
      const { data: profExists } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', profileId)
        .maybeSingle()

      if (!profExists) {
        console.log(
          `[CHECKOUT API] Profile ID ${profileId} not found in profiles. Attempting auto-creation.`
        )
        const { error: profInsertError } = await supabaseAdmin.from('profiles').insert({
          id: profileId,
          email: email || user?.email || 'customer@ufolabz.com',
          full_name: fullName || 'UFO Athlete',
          role: 'customer',
        })

        if (profInsertError) {
          console.error(`[CHECKOUT API] Failed to auto-create profile:`, profInsertError)
          profileId = null
        } else {
          try {
            await supabaseAdmin.from('wishlists').insert({ profile_id: profileId })
            const { data: defaultTier } = await supabaseAdmin
              .from('loyalty_tiers')
              .select('id')
              .order('sort_order', { ascending: true })
              .limit(1)
              .maybeSingle()

            if (defaultTier) {
              const { data: loyaltyAcc } = await supabaseAdmin
                .from('loyalty_accounts')
                .insert({
                  profile_id: profileId,
                  tier_id: defaultTier.id,
                  points: 100,
                  lifetime_points: 100,
                })
                .select('id')
                .maybeSingle()

              if (loyaltyAcc) {
                await supabaseAdmin.from('loyalty_transactions').insert({
                  account_id: loyaltyAcc.id,
                  event: 'signup',
                  points: 100,
                  description: 'Signup Bonus Points',
                })
              }
            }
          } catch (e) {
            console.error('[CHECKOUT API] Error creating dependent loyalty tables:', e)
          }
        }
      }
    }

    // 2. Prevent duplicate insertions
    const { data: existingOrder } = await supabaseAdmin
      .from('orders')
      .select('id, order_number')
      .eq('order_number', orderNumber)
      .maybeSingle()

    if (existingOrder) {
      console.log(`[CHECKOUT API] Order already exists in DB: ${orderNumber}. Skipping insert.`)
      return NextResponse.json({
        success: true,
        orderId: existingOrder.id,
        orderNumber: existingOrder.order_number,
        message: 'Order already processed.',
      })
    }

    // 3. Resolve coupon code if present
    let couponId = null
    if (couponCode) {
      const { data: couponData } = await supabaseAdmin
        .from('coupons')
        .select('id')
        .eq('code', couponCode.trim().toUpperCase())
        .maybeSingle()
      if (couponData) {
        couponId = couponData.id
      }
    }

    // 3b. Resolve referral code from cookie if present
    const referralCookie = req.cookies.get('ufo_referral_code')?.value || null
    let orderAffiliateId = null
    let commissionRate = 0

    if (referralCookie) {
      const { data: affiliateData } = await supabaseAdmin
        .from('affiliates')
        .select('id, commission_rate')
        .ilike('code', referralCookie.trim())
        .eq('status', 'active')
        .maybeSingle()

      if (affiliateData) {
        orderAffiliateId = affiliateData.id
        commissionRate = Number(affiliateData.commission_rate || 15)
      }
    }

    // 4. Server-Side Price & Total Re-Validation
    const normalizedCurrency = (currency || 'CHF').toUpperCase() === 'EUR' ? 'EUR' : 'CHF'
    const country =
      shippingAddress?.canton ||
      shippingAddress?.country ||
      (normalizedCurrency === 'EUR' ? 'FR' : 'CH')

    const serverTotals = await buildValidatedCheckoutTotals(supabaseAdmin, {
      items,
      currency: normalizedCurrency,
      deliveryMethod: 'shipping',
      country,
      shippingMethod,
      discountAmount,
      couponCode,
      carbonOffset,
    })

    let stripePaymentIntentId: string | null = null
    let stripeChargeId: string | null = null
    let completedPaymentMethod = paymentMethod || 'twint'

    if (['twint', 'card'].includes(completedPaymentMethod)) {
      if (!stripeSessionId) {
        return NextResponse.json(
          { error: 'Stripe payment confirmation is required.' },
          { status: 400 }
        )
      }

      if (!isStripeConfigured()) {
        return NextResponse.json(
          { error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to the environment.' },
          { status: 500 }
        )
      }

      const session = await stripe.checkout.sessions.retrieve(stripeSessionId, {
        expand: ['payment_intent', 'payment_intent.latest_charge'],
      })

      if (session.payment_status !== 'paid') {
        return NextResponse.json(
          { error: 'Stripe payment has not been completed.' },
          { status: 400 }
        )
      }

      const expectedStripeCurrency = serverTotals.currency.toLowerCase()
      if (
        session.currency?.toLowerCase() !== expectedStripeCurrency ||
        session.amount_total !== toStripeAmount(serverTotals.total)
      ) {
        return NextResponse.json(
          { error: 'Stripe payment total or currency does not match this order.' },
          { status: 400 }
        )
      }

      const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null
      stripePaymentIntentId = paymentIntent?.id || null
      const latestCharge = paymentIntent?.latest_charge
      stripeChargeId =
        typeof latestCharge === 'string' ? latestCharge : latestCharge?.id || null
    }

    const newOrderId = crypto.randomUUID()

    let internalNote = `Pre-order batch allocation confirmed. Expected dispatch: ${PREORDER_CONFIG.estimatedShipDate}.`
    if (serverTotals.stackDiscountAmount > 0) {
      internalNote += ` [Stack Volume Discount: -${serverTotals.stackDiscountAmount.toFixed(2)} ${serverTotals.currency} (${serverTotals.stackDiscountPercent}%)]`
    }
    if (serverTotals.carbonOffsetAmount > 0) {
      internalNote += ' (Carbon-neutral offset selected)'
    }

    const orderInsertData: any = {
      id: newOrderId,
      order_number: orderNumber,
      profile_id: profileId,
      guest_email: email,
      status: PREORDER_CONFIG.orderStatus, // 'preorder_confirmed'
      shipping_address: {
        fullName,
        phone,
        addressLine1: shippingAddress?.addressLine1 || '',
        addressLine2: shippingAddress?.addressLine2 || '',
        city: shippingAddress?.city || '',
        zipCode: shippingAddress?.zipCode || '',
        canton: shippingAddress?.canton || '',
      },
      billing_address: billingAddress
        ? {
            fullName: billingAddress.fullName || fullName,
            addressLine1: billingAddress.addressLine1 || '',
            addressLine2: billingAddress.addressLine2 || '',
            city: billingAddress.city || '',
            zipCode: billingAddress.zipCode || '',
            canton: billingAddress.canton || '',
          }
        : {
            fullName,
            addressLine1: shippingAddress?.addressLine1 || '',
            addressLine2: shippingAddress?.addressLine2 || '',
            city: shippingAddress?.city || '',
            zipCode: shippingAddress?.zipCode || '',
            canton: shippingAddress?.canton || '',
          },
      subtotal: serverTotals.validatedSubtotal,
      discount_amount: serverTotals.discountAmount,
      shipping_amount: serverTotals.shippingAmount + serverTotals.carbonOffsetAmount,
      tax_amount: serverTotals.taxAmount,
      total: serverTotals.total,
      stripe_payment_intent_id: stripePaymentIntentId,
      stripe_charge_id: stripeChargeId,
      payment_method: completedPaymentMethod,
      paid_at: completedPaymentMethod === 'invoice' ? null : new Date().toISOString(),
      coupon_id: couponId,
      coupon_code: couponCode || null,
      affiliate_id: orderAffiliateId,
      shipping_method: shippingMethod || 'standard',
      estimated_delivery: null, // Pre-order mode has batch estimated date stored in notes & meta
      loyalty_points_earned: Math.round(serverTotals.total * 5),
      internal_note: internalNote,
      currency: serverTotals.currency,
      locale: 'en',
    }

    // Insert order record with graceful enum fallback
    let { error: orderError } = await supabaseAdmin.from('orders').insert(orderInsertData)

    if (orderError && orderError.code === '22P02') {
      console.warn(
        `[CHECKOUT API] Enum order_status does not yet include '${PREORDER_CONFIG.orderStatus}'. Saving as 'confirmed' with preorder flag.`
      )
      orderInsertData.status = 'confirmed'
      const retryResult = await supabaseAdmin.from('orders').insert(orderInsertData)
      orderError = retryResult.error
    }

    if (orderError) {
      console.error('❌ Error saving order to Supabase:', orderError)

      if (orderError.code === '23505') {
        const { data: duplicatedOrder } = await supabaseAdmin
          .from('orders')
          .select('id, order_number')
          .eq('order_number', orderNumber)
          .maybeSingle()

        if (duplicatedOrder) {
          return NextResponse.json({
            success: true,
            orderId: duplicatedOrder.id,
            orderNumber: duplicatedOrder.order_number,
            message: 'Order already processed.',
          })
        }
      }

      throw new Error(`Database error saving order: ${orderError.message}`)
    }

    // Insert order items
    const itemsToInsertWithOrderId = serverTotals.orderItemsToInsert.map((item) => ({
      ...item,
      order_id: newOrderId,
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(itemsToInsertWithOrderId)

    if (itemsError) {
      console.error('❌ Error saving order items to Supabase:', itemsError)
      await supabaseAdmin.from('orders').delete().eq('id', newOrderId)
      throw new Error(`Database error saving order items: ${itemsError.message}`)
    }

    console.log(`[CHECKOUT API] Successfully persisted pre-order: ${orderNumber} in database.`)

    // Record affiliate commission if referral cookie was matched
    if (orderAffiliateId) {
      const commissionAmount = Number(
        (serverTotals.validatedSubtotal * (commissionRate / 100)).toFixed(2)
      )
      const { error: commError } = await supabaseAdmin.from('affiliate_commissions').insert({
        affiliate_id: orderAffiliateId,
        order_id: newOrderId,
        status: 'pending',
        order_total: serverTotals.validatedSubtotal,
        rate: commissionRate,
        amount: commissionAmount,
      })

      if (commError) {
        console.error('❌ Error saving affiliate commission:', commError)
      } else {
        const { data: currentAff } = await supabaseAdmin
          .from('affiliates')
          .select('total_orders, total_revenue, balance, total_commission, pending_commission')
          .eq('id', orderAffiliateId)
          .maybeSingle()

        if (currentAff) {
          await supabaseAdmin
            .from('affiliates')
            .update({
              total_orders: (currentAff.total_orders || 0) + 1,
              total_revenue:
                Number(currentAff.total_revenue || 0) + serverTotals.validatedSubtotal,
              balance: Number(currentAff.balance || 0) + commissionAmount,
              total_commission: Number(currentAff.total_commission || 0) + commissionAmount,
              pending_commission:
                Number(currentAff.pending_commission || 0) + commissionAmount,
            })
            .eq('id', orderAffiliateId)
        }
      }
    }

    const emailOrderData = {
      ...orderInsertData,
      email: email,
      created_at: orderInsertData.paid_at || new Date().toISOString(),
      is_preorder: true,
      estimated_ship_date: PREORDER_CONFIG.estimatedShipDate,
      delivery_method: 'shipping',
    }

    const [customerEmailResult, adminEmailResult] = await Promise.all([
      emailService.sendOrderConfirmation(emailOrderData, itemsToInsertWithOrderId),
      emailService.sendAdminNotification(emailOrderData, itemsToInsertWithOrderId),
    ])

    if (!customerEmailResult.success) {
      console.error(`[CHECKOUT API] Customer confirmation failed: ${customerEmailResult.error}`)
    }

    if (!adminEmailResult.success) {
      console.error(`[CHECKOUT API] Admin notification failed: ${adminEmailResult.error}`)
    }

    return NextResponse.json({
      success: true,
      orderId: newOrderId,
      orderNumber: orderNumber,
      status: orderInsertData.status,
      message: 'Pre-order created and email delivery queued.',
    })
  } catch (err: any) {
    console.error('❌ Error in checkout API handler:', err)
    return NextResponse.json(
      { error: 'An error occurred during order validation.' },
      { status: 500 }
    )
  }
}
