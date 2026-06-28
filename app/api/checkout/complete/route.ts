import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { emailService } from '@/lib/email/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      orderNumber,
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
      couponCode,
    } = body;

    // Validate essential properties
    if (!orderNumber || !email || !items || !items.length) {
      return NextResponse.json(
        { error: 'Missing required checkout information.' },
        { status: 400 }
      );
    }

    const supabase = createClient() as any;

    // 1. Prevent duplicate insertions - check if the order number already exists
    const { data: existingOrder } = await supabase
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

    // 2. Resolve coupon code if present
    let couponId = null;
    if (couponCode) {
      const { data: couponData } = await supabase
        .from('coupons')
        .select('id')
        .eq('code', couponCode.trim().toUpperCase())
        .maybeSingle();
      if (couponData) {
        couponId = couponData.id;
      }
    }

    // 3. Generate UUID for the order on the server side to bypass RLS select-returning constraint
    const newOrderId = crypto.randomUUID();

    const estimatedDeliveryDate = new Date();
    // Default priority to 1 day delivery, standard to 3 days delivery
    estimatedDeliveryDate.setDate(
      estimatedDeliveryDate.getDate() + (shippingMethod === 'priority' ? 1 : 3)
    );

    const orderInsertData = {
      id: newOrderId,
      order_number: orderNumber,
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
      subtotal: Number(subtotal),
      discount_amount: Number(discountAmount),
      shipping_amount: Number(shippingAmount),
      total: Number(total),
      payment_method: paymentMethod || 'twint',
      paid_at: new Date().toISOString(),
      coupon_id: couponId,
      coupon_code: couponCode || null,
      shipping_method: shippingMethod || 'standard',
      estimated_delivery: estimatedDeliveryDate.toISOString().split('T')[0],
      currency: 'CHF',
      locale: 'en',
    };

    // Run plain insert without .select() or .single() to avoid RLS select restrictions on anon client
    const { error: orderError } = await supabase
      .from('orders')
      .insert(orderInsertData);

    if (orderError) {
      console.error('❌ Error saving order to Supabase:', orderError);
      throw new Error(`Database error saving order: ${orderError.message}`);
    }

    // 4. Insert order items
    const orderItemsToInsert = items.map((item: any) => ({
      order_id: newOrderId,
      product_id: item.productId || item.variant?.product_id || item.variant?.product?.id,
      variant_id: item.variantId || item.variant?.id,
      product_name: { en: item.name || item.variant?.product?.name?.en || 'UFO Supplement' },
      variant_name: item.variantName || item.variant?.name || 'Standard size',
      sku: item.sku || item.variant?.sku || 'N/A',
      quantity: Number(item.quantity || 1),
      unit_price: Number(item.price || item.variant?.price || 0),
      total: Number((item.price || item.variant?.price || 0) * (item.quantity || 1)),
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error('❌ Error saving order items to Supabase:', itemsError);
      // Delete the created order to maintain transactional integrity
      await supabase.from('orders').delete().eq('id', newOrderId);
      throw new Error(`Database error saving order items: ${itemsError.message}`);
    }

    console.log(`[CHECKOUT API] Successfully persisted order: ${orderNumber} in database.`);

    // Construct mock order object containing payload values to pass to emailService
    const emailOrderData = {
      ...orderInsertData,
      email: email,
      created_at: orderInsertData.paid_at,
    };

    // 5. Send emails in parallel asynchronously
    // Catch errors inside each to log them and not halt success response.
    const emailPromises = [
      emailService.sendOrderConfirmation(emailOrderData, orderItemsToInsert).then((res) => {
        if (!res.success) {
          console.error(`[CHECKOUT API] Failed to send customer confirmation: ${res.error}`);
        } else {
          console.log(`[CHECKOUT API] Customer confirmation sent: ${res.id}`);
        }
      }),
      emailService.sendAdminNotification(emailOrderData, orderItemsToInsert).then((res) => {
        if (!res.success) {
          console.error(`[CHECKOUT API] Failed to send admin notification: ${res.error}`);
        } else {
          console.log(`[CHECKOUT API] Admin notification sent: ${res.id}`);
        }
      }),
    ];

    // Trigger sending immediately in the background without blocking the client response
    Promise.allSettled(emailPromises).then(() => {
      console.log(`[CHECKOUT API] All email triggers resolved.`);
    });

    return NextResponse.json({
      success: true,
      orderId: newOrderId,
      orderNumber: orderNumber,
      message: 'Order created and emails triggered.',
    });
  } catch (err: any) {
    console.error('❌ Error in checkout API handler:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
