import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient()

    // 1. Fetch all affiliates with profile details
    const { data: affs, error: affsError } = await supabase
      .from('affiliates')
      .select(`
        id,
        code,
        status,
        commission_rate,
        total_orders,
        total_revenue,
        balance,
        total_commission,
        pending_commission,
        paid_commission,
        payout_method,
        payout_details,
        bio,
        created_at,
        approved_at,
        profile_id,
        profile:profiles!profile_id(id, email, full_name, phone)
      `)
      .order('created_at', { ascending: false })

    if (affsError) {
      console.error('[ADMIN AFFILIATES API] Error fetching affiliates:', affsError)
    }

    // 2. Fetch all coupons
    const { data: coups, error: coupsError } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })

    if (coupsError) {
      console.error('[ADMIN AFFILIATES API] Error fetching coupons:', coupsError)
    }

    // 3. Fetch all commissions with order info
    const { data: comms, error: commsError } = await supabase
      .from('affiliate_commissions')
      .select(`
        id,
        affiliate_id,
        order_id,
        status,
        order_total,
        rate,
        amount,
        created_at,
        order:orders(order_number, guest_email, shipping_address, created_at)
      `)
      .order('created_at', { ascending: false })

    if (commsError) {
      console.error('[ADMIN AFFILIATES API] Error fetching commissions:', commsError)
    }

    // 4. Fetch all payouts
    const { data: payouts, error: payoutsError } = await supabase
      .from('affiliate_payouts')
      .select('*')
      .order('created_at', { ascending: false })

    if (payoutsError) {
      console.error('[ADMIN AFFILIATES API] Error fetching payouts:', payoutsError)
    }

    // Build lookup map for affiliate metadata
    const affMap = new Map<string, any>()
    for (const a of affs || []) {
      const p = Array.isArray(a.profile) ? a.profile[0] : a.profile
      affMap.set(a.id, {
        id: a.id,
        code: a.code,
        commissionRate: Number(a.commission_rate || 15),
        name: p?.full_name || p?.email?.split('@')[0] || 'Partner Athlete',
        email: p?.email || 'N/A',
        phone: p?.phone || a.payout_details?.twint_phone || 'N/A',
        canton: a.payout_details?.canton || 'Zurich',
        website: a.payout_details?.website || 'N/A',
        social: a.payout_details?.social_link || 'N/A',
        status: (a.status || 'pending').toUpperCase(),
        joinedDate: a.created_at ? a.created_at.split('T')[0] : 'N/A',
        salesCount: Number(a.total_orders || 0),
        balance: Number(a.balance || 0),
        totalCommission: Number(a.total_commission || 0),
        pendingCommission: Number(a.pending_commission || 0),
        paidCommission: Number(a.paid_commission || 0),
        payoutMethod: a.payout_method || 'TWINT',
        payoutDetails: a.payout_details || {},
      })
    }

    // Map coupons with affiliate athlete details
    const mappedCoupons = (coups || []).map((c: any) => {
      const linkedAff = c.affiliate_id ? affMap.get(c.affiliate_id) : null
      return {
        id: c.id,
        code: c.code,
        affiliateId: c.affiliate_id || 'SYSTEM',
        affiliateName: linkedAff?.name || (c.affiliate_id ? 'Affiliate Partner' : 'System Storewide'),
        affiliateEmail: linkedAff?.email || 'N/A',
        discountPct: Number(c.value || 0),
        commissionPct: linkedAff ? Number(linkedAff.commissionRate || 15) : 0,
        status: c.is_active ? 'APPROVED' : 'PENDING',
        salesCount: Number(c.uses_count || 0),
        totalRevenue: Number(c.uses_count || 0) * 80, // estimated
        totalCommission: Number(c.uses_count || 0) * (Number(linkedAff?.commissionRate || 15) / 100) * 80,
        type: c.type || 'percentage',
        description: c.description || '',
        createdAt: c.created_at ? c.created_at.split('T')[0] : 'N/A',
      }
    })

    // Map commissions with athlete details
    const mappedCommissions = (comms || []).map((comm: any) => {
      const linkedAff = affMap.get(comm.affiliate_id)
      const ord = Array.isArray(comm.order) ? comm.order[0] : comm.order
      return {
        id: comm.id,
        orderId: comm.order_id,
        orderNumber: ord?.order_number || comm.order_id?.slice(0, 8) || 'N/A',
        affiliateId: comm.affiliate_id,
        affiliateName: linkedAff?.name || 'Partner',
        affiliateCode: linkedAff?.code || 'N/A',
        customerEmail: ord?.guest_email || ord?.shipping_address?.email || 'Customer',
        orderTotal: Number(comm.order_total || 0),
        rate: Number(comm.rate || 15),
        amount: Number(comm.amount || 0),
        status: (comm.status || 'pending').toUpperCase(),
        date: comm.created_at ? comm.created_at.split('T')[0] : 'N/A',
      }
    })

    // Map payouts with athlete details
    const mappedPayouts = (payouts || []).map((p: any) => {
      const linkedAff = affMap.get(p.affiliate_id)
      return {
        id: p.id,
        affiliateId: p.affiliate_id,
        affiliateName: linkedAff?.name || 'Partner',
        affiliateCode: linkedAff?.code || 'N/A',
        amount: Number(p.amount || 0),
        method: (p.method || linkedAff?.payoutMethod || 'TWINT').toUpperCase(),
        details: linkedAff?.payoutDetails || {},
        status: (p.status || 'pending').toUpperCase(),
        reference: p.reference || 'N/A',
        notes: p.notes || '',
        date: p.created_at ? p.created_at.split('T')[0] : 'N/A',
        processedAt: p.processed_at ? p.processed_at.split('T')[0] : null,
      }
    })

    return NextResponse.json({
      success: true,
      affiliates: Array.from(affMap.values()),
      coupons: mappedCoupons,
      commissions: mappedCommissions,
      payouts: mappedPayouts,
    })
  } catch (err: any) {
    console.error('[ADMIN AFFILIATES API] GET Fatal error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await req.json()
    const { action, payload } = body

    if (!action) {
      return NextResponse.json({ error: 'Missing action parameter' }, { status: 400 })
    }

    switch (action) {
      case 'approve_coupon': {
        const { code } = payload
        const { error } = await supabase
          .from('coupons')
          .update({ is_active: true })
          .eq('code', code)
        if (error) throw error
        return NextResponse.json({ success: true, message: `Coupon ${code} approved.` })
      }

      case 'reject_coupon': {
        const { code } = payload
        const { error } = await supabase
          .from('coupons')
          .update({ is_active: false })
          .eq('code', code)
        if (error) throw error
        return NextResponse.json({ success: true, message: `Coupon ${code} deactivated.` })
      }

      case 'update_coupon_rate': {
        const { code, discount } = payload
        const { error } = await supabase
          .from('coupons')
          .update({ value: Number(discount) })
          .eq('code', code)
        if (error) throw error
        return NextResponse.json({ success: true, message: `Coupon ${code} discount rate updated.` })
      }

      case 'approve_affiliate': {
        const { id } = payload
        const { error } = await supabase
          .from('affiliates')
          .update({ status: 'approved', approved_at: new Date().toISOString() })
          .eq('id', id)
        if (error) throw error
        return NextResponse.json({ success: true, message: 'Affiliate approved successfully.' })
      }

      case 'suspend_affiliate': {
        const { id } = payload
        const { error } = await supabase
          .from('affiliates')
          .update({ status: 'suspended' })
          .eq('id', id)
        if (error) throw error
        return NextResponse.json({ success: true, message: 'Affiliate suspended successfully.' })
      }

      case 'update_affiliate_rate': {
        const { id, rate } = payload
        const { error } = await supabase
          .from('affiliates')
          .update({ commission_rate: Number(rate) })
          .eq('id', id)
        if (error) throw error
        return NextResponse.json({ success: true, message: 'Affiliate commission rate updated.' })
      }

      case 'approve_payout': {
        const { id, affiliateId, amount } = payload
        const { error: pErr } = await supabase
          .from('affiliate_payouts')
          .update({ status: 'completed', processed_at: new Date().toISOString() })
          .eq('id', id)
        if (pErr) throw pErr

        // Deduct from balance and add to paid_commission
        if (affiliateId && amount) {
          const { data: aff } = await supabase
            .from('affiliates')
            .select('balance, paid_commission')
            .eq('id', affiliateId)
            .maybeSingle()
          if (aff) {
            const currentBal = Number(aff.balance || 0)
            const currentPaid = Number(aff.paid_commission || 0)
            await supabase
              .from('affiliates')
              .update({
                balance: Math.max(0, currentBal - Number(amount)),
                paid_commission: currentPaid + Number(amount),
              })
              .eq('id', affiliateId)
          }
        }
        return NextResponse.json({ success: true, message: 'Payout marked as completed.' })
      }

      case 'reject_payout': {
        const { id } = payload
        const { error } = await supabase
          .from('affiliate_payouts')
          .update({ status: 'rejected' })
          .eq('id', id)
        if (error) throw error
        return NextResponse.json({ success: true, message: 'Payout marked as rejected.' })
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }
  } catch (err: any) {
    console.error('[ADMIN AFFILIATES API] POST error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
