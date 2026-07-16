import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email/email';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Authorization Guard
    const authHeader = req.headers.get('authorization');
    const isDev = process.env.NODE_ENV === 'development';
    const cronSecret = process.env.CRON_SECRET || 'local_development_secret';

    if (!isDev && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    if (!isDev && !process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Cron is not configured.' }, { status: 503 });
    }

    const supabaseAdmin = createAdminClient();

    const report: any = {
      abandonedCartsSent: 0,
      replenishmentsSent: 0,
      feedbacksSent: 0,
      errors: [],
    };

    // ─── FLOW 1: ABANDONED CART AUTOMATIONS ───────────────────────
    // Query cart sessions updated between 1 hour and 75 hours ago
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const seventyFiveHoursAgo = new Date(Date.now() - 75 * 60 * 60 * 1000).toISOString();

    const { data: abandonedSessions, error: cartError } = await supabaseAdmin
      .from('cart_sessions')
      .select(`
        id,
        profile_id,
        session_token,
        updated_at,
        profile:profiles(id, email, full_name),
        items:cart_items(
          quantity,
          variant:product_variants(
            id,
            name,
            price,
            product:products(name)
          )
        )
      `)
      .gt('updated_at', seventyFiveHoursAgo)
      .lt('updated_at', oneHourAgo);

    if (cartError) {
      console.error('Error fetching cart sessions:', cartError);
      report.errors.push(`Cart Sessions Fetch: ${cartError.message}`);
    } else if (abandonedSessions) {
      for (const session of abandonedSessions) {
        // Skip empty carts
        if (!session.items || session.items.length === 0) continue;

        // Determine customer contact details
        const profileObj = Array.isArray(session.profile) ? session.profile[0] : (session.profile as any);
        const email = profileObj?.email;
        const name = profileObj?.full_name || 'Athlete';
        const profileId = session.profile_id;

        if (!email) continue;

        // Check if they placed an order since updating their cart
        const { data: recentOrders } = await supabaseAdmin
          .from('orders')
          .select('id')
          .eq('profile_id', profileId || '00000000-0000-0000-0000-000000000000') // or guest check
          .gt('created_at', session.updated_at);

        if (recentOrders && recentOrders.length > 0) continue; // Converted!

        // Determine step index based on age
        const ageHours = (Date.now() - new Date(session.updated_at).getTime()) / (1000 * 60 * 60);
        let step = 0;
        let subject = '';
        let discountCode: string | undefined = undefined;

        if (ageHours >= 72) {
          step = 3;
          discountCode = 'UFO10';
        } else if (ageHours >= 24) {
          step = 2;
        } else if (ageHours >= 1) {
          step = 1;
        }

        if (step === 0) continue;

        // Check if we already sent this step
        const { data: alreadySent } = await supabaseAdmin
          .from('automation_state')
          .select('id')
          .eq('profile_id', profileId)
          .eq('flow_name', 'abandoned_cart')
          .eq('step_number', step)
          .maybeSingle();

        if (alreadySent) continue; // Already processed!

        // Map items for template
        const mappedItems = session.items.map((i: any) => ({
          name: i.variant?.product?.name || 'UFO Supplement',
          variantName: i.variant?.name || 'Standard',
          price: Number(i.variant?.price || 0),
          quantity: i.quantity
        }));

        // Send Abandoned Cart email
        const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout?session=${session.session_token || ''}`;
        const sendResult = await emailService.sendAbandonedCart(email, name, mappedItems, checkoutUrl, discountCode);

        if (sendResult.success) {
          // Log state
          await supabaseAdmin
            .from('automation_state')
            .insert({
              profile_id: profileId,
              flow_name: 'abandoned_cart',
              step_number: step,
              status: 'sent'
            });
          report.abandonedCartsSent++;
        }
      }
    }

    // ─── FLOW 2: POST-PURCHASE REPLENISHMENT AUTOMATIONS ─────────
    // Query orders created between 25 days and 30 days ago
    const twentyFiveDaysAgo = new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: replenishmentOrders, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        profile_id,
        created_at,
        guest_email,
        shipping_address,
        profile:profiles(id, email, full_name),
        items:order_items(
          product_name,
          quantity
        )
      `)
      .gt('created_at', thirtyDaysAgo)
      .lt('created_at', twentyFiveDaysAgo);

    if (orderError) {
      console.error('Error fetching replenishment orders:', orderError);
      report.errors.push(`Replenishment Orders Fetch: ${orderError.message}`);
    } else if (replenishmentOrders) {
      for (const order of replenishmentOrders) {
        const profileObj = Array.isArray(order.profile) ? order.profile[0] : (order.profile as any);
        const email = order.guest_email || profileObj?.email;
        const name = (order.shipping_address as any)?.fullName || profileObj?.full_name || 'Athlete';
        const profileId = order.profile_id;

        if (!email) continue;

        // Check if they placed an order since then
        const { data: newOrders } = await supabaseAdmin
          .from('orders')
          .select('id')
          .eq('profile_id', profileId || '00000000-0000-0000-0000-000000000000')
          .gt('created_at', order.created_at);

        if (newOrders && newOrders.length > 0) continue; // Already ordered!

        // Check if we already sent replenishment step 1
        const { data: alreadySent } = await supabaseAdmin
          .from('automation_state')
          .select('id')
          .eq('profile_id', profileId)
          .eq('flow_name', 'replenishment')
          .eq('step_number', 1)
          .maybeSingle();

        if (alreadySent) continue;

        const mainProduct = order.items?.[0]?.product_name || 'UFO Supplements';
        const reorderUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products`;

        const sendResult = await emailService.sendReplenishment(email, name, mainProduct, reorderUrl);

        if (sendResult.success) {
          await supabaseAdmin
            .from('automation_state')
            .insert({
              profile_id: profileId,
              flow_name: 'replenishment',
              step_number: 1,
              status: 'sent'
            });
          report.replenishmentsSent++;
        }
      }
    }

    // ─── FLOW 3: PRODUCT FEEDBACK AUTOMATIONS (7 DAYS POST) ──────
    // Query orders created between 7 days and 8 days ago
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();

    const { data: feedbackOrders, error: fbError } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        order_number,
        profile_id,
        created_at,
        guest_email,
        shipping_address,
        profile:profiles(id, email, full_name),
        items:order_items(
          product_name,
          quantity
        )
      `)
      .gt('created_at', eightDaysAgo)
      .lt('created_at', sevenDaysAgo);

    if (fbError) {
      console.error('Error fetching feedback orders:', fbError);
      report.errors.push(`Feedback Orders Fetch: ${fbError.message}`);
    } else if (feedbackOrders) {
      for (const order of feedbackOrders) {
        const profileObj = Array.isArray(order.profile) ? order.profile[0] : (order.profile as any);
        const email = order.guest_email || profileObj?.email;
        const name = (order.shipping_address as any)?.fullName || profileObj?.full_name || 'Athlete';
        const profileId = order.profile_id;

        if (!email) continue;

        // Check if we already sent feedback step 1
        const { data: alreadySent } = await supabaseAdmin
          .from('automation_state')
          .select('id')
          .eq('profile_id', profileId)
          .eq('flow_name', 'feedback')
          .eq('step_number', 1)
          .maybeSingle();

        if (alreadySent) continue;

        const mainProduct = order.items?.[0]?.product_name || 'UFO Supplements';
        const sendResult = await emailService.sendReviewRequest(order, mainProduct);

        if (sendResult.success) {
          await supabaseAdmin
            .from('automation_state')
            .insert({
              profile_id: profileId,
              flow_name: 'feedback',
              step_number: 1,
              status: 'sent'
            });
          report.feedbacksSent++;
        }
      }
    }

    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    console.error('Error in email-automations API handler:', err);
    return NextResponse.json({ error: 'Internal server error.', details: err.message }, { status: 500 });
  }
}
