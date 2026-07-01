import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { emailService } from '@/lib/email/email';
import { buildValidatedCheckoutTotals, toStripeAmount } from '@/lib/checkout/amounts';
import { isStripeConfigured, stripe } from '@/lib/stripe';
import Stripe from 'stripe';

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      orderNumber,
      profileId: bodyProfileId,
      email,
      fullName,
      phone,
      shippingAddress,
      billingAddress,
      shippingMethod,
      paymentMethod,
      items,
      subtotal,
      discountAmount,
      shippingAmount,
      total,
      carbonOffset,
      couponCode,
      stripeSessionId,
    } = body;

    // Validate essential properties
    if (!orderNumber || !email || !items || !items.length) {
      return NextResponse.json(
        { error: 'Missing required checkout information.' },
        { status: 400 }
      );
    }

    // 1. Get authenticated user profile ID if logged in (supporting cookie vs payload)
    const supabaseUser = createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();
    let profileId = bodyProfileId || (user ? user.id : null);

    // Validate profile existence and auto-create if missing
    if (profileId) {
      const { data: profExists } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', profileId)
        .maybeSingle();

      if (!profExists) {
        console.log(`[CHECKOUT API] Profile ID ${profileId} not found in profiles. Attempting auto-creation.`);
        const { error: profInsertError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: profileId,
            email: email || user?.email || 'customer@ufolabz.ch',
            full_name: fullName || 'UFO Athlete',
            role: 'customer'
          });

        if (profInsertError) {
          console.error(`[CHECKOUT API] Failed to auto-create profile:`, profInsertError);
          console.log(`[CHECKOUT API] Falling back to guest checkout`);
          profileId = null;
        } else {
          // Profile created successfully, now create wishlist and loyalty account if missing
          try {
            await supabaseAdmin.from('wishlists').insert({ profile_id: profileId });

            // Get default loyalty tier
            const { data: defaultTier } = await supabaseAdmin
              .from('loyalty_tiers')
              .select('id')
              .order('sort_order', { ascending: true })
              .limit(1)
              .maybeSingle();

            if (defaultTier) {
              const { data: loyaltyAcc } = await supabaseAdmin
                .from('loyalty_accounts')
                .insert({
                  profile_id: profileId,
                  tier_id: defaultTier.id,
                  points: 100,
                  lifetime_points: 100
                })
                .select('id')
                .maybeSingle();

              if (loyaltyAcc) {
                await supabaseAdmin.from('loyalty_transactions').insert({
                  account_id: loyaltyAcc.id,
                  event: 'signup',
                  points: 100,
                  description: 'Signup Bonus Points'
                });
              }
            }
          } catch (e) {
            console.error('[CHECKOUT API] Error creating dependent loyalty tables:', e);
          }
        }
      }
    }

    // 2. Prevent duplicate insertions using supabaseAdmin to bypass guest RLS select constraints
    const { data: existingOrder } = await supabaseAdmin
      .from('orders')
      .select('id, order_number')
      .eq('order_number', orderNumber)
      .maybeSingle();

    if (existingOrder) {
      console.log(`[CHECKOUT API] Order already exists in DB: ${orderNumber}. Skipping insert.`);
      return NextResponse.json({
        success: true,
        orderId: existingOrder.id,
        orderNumber: existingOrder.order_number,
        message: 'Order already processed.',
      });
    }

    // 3. Resolve coupon code if present
    let couponId = null;
    if (couponCode) {
      const { data: couponData } = await supabaseAdmin
        .from('coupons')
        .select('id')
        .eq('code', couponCode.trim().toUpperCase())
        .maybeSingle();
      if (couponData) {
        couponId = couponData.id;
      }
    }

    // 3b. Resolve referral code from cookie if present
    const referralCookie = req.cookies.get('ufo_referral_code')?.value || null;
    let orderAffiliateId = null;
    let commissionRate = 0;

    if (referralCookie) {
      const { data: affiliateData } = await supabaseAdmin
        .from('affiliates')
        .select('id, commission_rate')
        .ilike('code', referralCookie.trim())
        .eq('status', 'active')
        .maybeSingle();

      if (affiliateData) {
        orderAffiliateId = affiliateData.id;
        commissionRate = Number(affiliateData.commission_rate || 10);
      }
    }

    // 4. Server-Side Price & Total Re-Validation
    const {
      validatedSubtotal,
      discountAmount: serverDiscountAmount,
      shippingAmount: serverShippingAmount,
      carbonOffsetAmount,
      total: serverTotal,
      taxAmount: serverTaxAmount,
      orderItemsToInsert,
    } = await buildValidatedCheckoutTotals(supabaseAdmin, {
      items,
      shippingMethod,
      discountAmount,
      couponCode,
      carbonOffset,
    });

    let stripePaymentIntentId: string | null = null;
    let stripeChargeId: string | null = null;
    let completedPaymentMethod = paymentMethod || 'twint';

    if (['twint', 'card'].includes(completedPaymentMethod)) {
      if (!stripeSessionId) {
        return NextResponse.json(
          { error: 'Stripe payment confirmation is required.' },
          { status: 400 }
        );
      }

      if (!isStripeConfigured()) {
        return NextResponse.json(
          { error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to the environment.' },
          { status: 500 }
        );
      }

      const session = await stripe.checkout.sessions.retrieve(stripeSessionId, {
        expand: ['payment_intent', 'payment_intent.latest_charge'],
      });

      if (session.payment_status !== 'paid') {
        return NextResponse.json(
          { error: 'Stripe payment has not been completed.' },
          { status: 400 }
        );
      }

      if (session.currency !== 'chf' || session.amount_total !== toStripeAmount(serverTotal)) {
        return NextResponse.json(
          { error: 'Stripe payment total does not match this order.' },
          { status: 400 }
        );
      }

      const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;
      stripePaymentIntentId = paymentIntent?.id || null;
      const latestCharge = paymentIntent?.latest_charge;
      stripeChargeId =
        typeof latestCharge === 'string' ? latestCharge : latestCharge?.id || null;
    }

    const newOrderId = crypto.randomUUID();
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(
      estimatedDeliveryDate.getDate() + (shippingMethod === 'priority' ? 1 : 3)
    );

    const orderInsertData = {
      id: newOrderId,
      order_number: orderNumber,
      profile_id: profileId, // Links order to authenticated dashboard history
      guest_email: email,
      status: 'confirmed',
      shipping_address: {
        fullName,
        phone,
        addressLine1: shippingAddress.addressLine1 || '',
        addressLine2: shippingAddress.addressLine2 || '',
        city: shippingAddress.city || '',
        zipCode: shippingAddress.zipCode || '',
        canton: shippingAddress.canton || '',
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
            addressLine1: shippingAddress.addressLine1 || '',
            addressLine2: shippingAddress.addressLine2 || '',
            city: shippingAddress.city || '',
            zipCode: shippingAddress.zipCode || '',
            canton: shippingAddress.canton || '',
          },
      subtotal: validatedSubtotal,
      discount_amount: serverDiscountAmount,
      shipping_amount: serverShippingAmount + carbonOffsetAmount,
      tax_amount: serverTaxAmount,
      total: serverTotal,
      stripe_payment_intent_id: stripePaymentIntentId,
      stripe_charge_id: stripeChargeId,
      payment_method: completedPaymentMethod,
      paid_at: completedPaymentMethod === 'invoice' ? null : new Date().toISOString(),
      coupon_id: couponId,
      coupon_code: couponCode || null,
      affiliate_id: orderAffiliateId,
      shipping_method: shippingMethod || 'standard',
      estimated_delivery: estimatedDeliveryDate.toISOString().split('T')[0],
      loyalty_points_earned: Math.round(serverTotal * 5),
      internal_note: carbonOffsetAmount > 0 ? 'Carbon-neutral offset selected.' : null,
      currency: 'CHF',
      locale: 'en',
    };

    // Insert order record
    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(orderInsertData);

    if (orderError) {
      console.error('❌ Error saving order to Supabase:', orderError);

      if (orderError.code === '23505') {
        const { data: duplicatedOrder } = await supabaseAdmin
          .from('orders')
          .select('id, order_number')
          .eq('order_number', orderNumber)
          .maybeSingle();

        if (duplicatedOrder) {
          return NextResponse.json({
            success: true,
            orderId: duplicatedOrder.id,
            orderNumber: duplicatedOrder.order_number,
            message: 'Order already processed.',
          });
        }
      }

      throw new Error(`Database error saving order: ${orderError.message}`);
    }

    // Insert order items
    const itemsToInsertWithOrderId = orderItemsToInsert.map((item) => ({
      ...item,
      order_id: newOrderId,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(itemsToInsertWithOrderId);

    if (itemsError) {
      console.error('❌ Error saving order items to Supabase:', itemsError);
      await supabaseAdmin.from('orders').delete().eq('id', newOrderId);
      throw new Error(`Database error saving order items: ${itemsError.message}`);
    }

    console.log(`[CHECKOUT API] Successfully persisted order: ${orderNumber} in database.`);

    // Record affiliate commission if referral cookie was matched
    if (orderAffiliateId) {
      const commissionAmount = Number((validatedSubtotal * (commissionRate / 100)).toFixed(2));
      const { error: commError } = await supabaseAdmin
        .from('affiliate_commissions')
        .insert({
          affiliate_id: orderAffiliateId,
          order_id: newOrderId,
          status: 'pending',
          order_total: validatedSubtotal,
          rate: commissionRate,
          amount: commissionAmount
        });

      if (commError) {
        console.error('❌ Error saving affiliate commission:', commError);
      } else {
        // Increment the affiliate totals in affiliates table
        const { data: currentAff } = await supabaseAdmin
          .from('affiliates')
          .select('total_orders, total_revenue, balance, total_commission, pending_commission')
          .eq('id', orderAffiliateId)
          .maybeSingle();

        if (currentAff) {
          await supabaseAdmin
            .from('affiliates')
            .update({
              total_orders: (currentAff.total_orders || 0) + 1,
              total_revenue: Number(currentAff.total_revenue || 0) + validatedSubtotal,
              balance: Number(currentAff.balance || 0) + commissionAmount,
              total_commission: Number(currentAff.total_commission || 0) + commissionAmount,
              pending_commission: Number(currentAff.pending_commission || 0) + commissionAmount
            })
            .eq('id', orderAffiliateId);
        }
      }
    }

    const emailOrderData = {
      ...orderInsertData,
      email: email,
      created_at: orderInsertData.paid_at,
    };

    // Send emails in background
    const emailPromises = [
      emailService.sendOrderConfirmation(emailOrderData, itemsToInsertWithOrderId).then((res) => {
        if (!res.success) console.error(`[CHECKOUT API] Customer confirmation fail: ${res.error}`);
      }),
      emailService.sendAdminNotification(emailOrderData, itemsToInsertWithOrderId).then((res) => {
        if (!res.success) console.error(`[CHECKOUT API] Admin notification fail: ${res.error}`);
      }),
    ];

    Promise.allSettled(emailPromises);

    return NextResponse.json({
      success: true,
      orderId: newOrderId,
      orderNumber: orderNumber,
      message: 'Order created and emails triggered.',
    });
  } catch (err: any) {
    console.error('❌ Error in checkout API handler:', err);
    return NextResponse.json(
      { error: 'An error occurred during order validation.' },
      { status: 500 }
    );
  }
}
