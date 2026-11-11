import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { emailService } from '@/lib/email/email'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const supabaseUser = createClient()
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ authenticated: false, message: 'Not logged in' })
    }

    const supabaseAdmin = createAdminClient()

    // 1. Fetch user's affiliate record
    const { data: aff, error: affError } = await supabaseAdmin
      .from('affiliates')
      .select('*')
      .eq('profile_id', user.id)
      .maybeSingle()

    if (affError) {
      console.warn('[AFFILIATE PORTAL API] Affiliates lookup warning:', affError)
    }

    let coupons: any[] = []
    let commissions: any[] = []
    let payouts: any[] = []

    if (aff) {
      // 2. Fetch coupons requested by this partner
      const { data: coups } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('affiliate_id', aff.id)
        .order('created_at', { ascending: false })

      if (coups) {
        coupons = coups.map((c: any) => ({
          id: c.id,
          code: c.code,
          affiliateId: c.affiliate_id,
          discountPct: Number(c.value || 10),
          commissionPct: Number(aff.commission_rate || 15),
          status: c.is_active ? 'APPROVED' : 'PENDING',
          salesCount: c.uses_count || 0,
          totalCommission: Number(c.uses_count || 0) * (Number(aff.commission_rate || 15) / 100) * 45,
        }))
      }

      // 3. Fetch commissions
      const { data: comms } = await supabaseAdmin
        .from('affiliate_commissions')
        .select('*')
        .eq('affiliate_id', aff.id)
        .order('created_at', { ascending: false })

      if (comms) {
        commissions = comms.map((c: any) => ({
          id: c.id ? c.id.slice(0, 8) : 'N/A',
          name: 'Supplement Referral',
          sale: Number(c.order_total || (Number(c.amount || 0) * 100 / 15) || 0),
          comm: Number(c.amount || c.commission_amount || 0),
          status: (c.status || 'PENDING').toUpperCase(),
          date: c.created_at ? c.created_at.split('T')[0] : 'N/A',
        }))
      }

      // 4. Fetch payouts
      const { data: payList } = await supabaseAdmin
        .from('affiliate_payouts')
        .select('*')
        .eq('affiliate_id', aff.id)
        .order('created_at', { ascending: false })

      if (payList) {
        payouts = payList.map((p: any) => ({
          id: p.id,
          date: p.created_at ? p.created_at.split('T')[0] : 'N/A',
          amount: Number(p.amount || 0),
          method: (p.method || p.payout_method || 'TWINT').toUpperCase(),
          status: (p.status || 'PENDING').toUpperCase(),
        }))
      }
    }

    // 5. Fetch active products for link generator
    const { data: prods } = await supabaseAdmin
      .from('products')
      .select('id, name, slug, base_price, featured, is_new')
      .eq('status', 'active')

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name || user.user_metadata?.name || '',
      },
      affiliate: aff ? {
        id: aff.id,
        code: aff.code,
        status: (aff.status || 'pending').toUpperCase(),
        commissionRate: Number(aff.commission_rate || 15),
        balance: Number(aff.balance || 0),
        payoutMethod: aff.payout_method || 'twint',
        payoutDetails: aff.payout_details || {},
      } : null,
      coupons,
      commissions,
      payouts,
      products: prods || [],
    })
  } catch (err: any) {
    console.error('[AFFILIATE PORTAL API] GET Error:', err)
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabaseUser = createClient()
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const body = await req.json()
    const { action, payload } = body
    const supabaseAdmin = createAdminClient()

    if (action === 'apply') {
      const { code, payoutMethod, payoutDetails } = payload || {}
      const finalCode = (code || user.email?.split('@')[0] || 'UFO').toUpperCase().replace(/[^A-Z0-9]/g, '') + Math.floor(100 + Math.random() * 900)

      const { data: newAff, error: insertError } = await supabaseAdmin
        .from('affiliates')
        .insert({
          profile_id: user.id,
          code: finalCode,
          status: 'pending',
          payout_method: payoutMethod || 'twint',
          payout_details: payoutDetails || {},
          commission_rate: 15.00,
        })
        .select()
        .single()

      if (insertError) {
        return NextResponse.json({ success: false, error: insertError.message }, { status: 400 })
      }

      // Send athlete application confirmation and admin alert
      const athleteName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'UFO Partner'
      try {
        if (user.email) {
          await emailService.sendAffiliateApplicationReceived(user.email, athleteName)
        }
        await emailService.sendAffiliateApplicationAdminAlert(
          athleteName,
          user.email || 'N/A',
          payoutDetails?.canton || 'Zurich',
          payoutDetails?.social_link || 'N/A'
        )
      } catch (mailErr: any) {
        console.warn('[AFFILIATE PORTAL] Error sending application emails:', mailErr?.message)
      }

      return NextResponse.json({ success: true, affiliate: newAff })
    }

    if (action === 'request_coupon') {
      const { couponCode, affiliateId } = payload || {}
      const cleanCode = (couponCode || '').trim().toUpperCase()

      if (!cleanCode) {
        return NextResponse.json({ success: false, error: 'Coupon code is required.' }, { status: 400 })
      }

      // Check duplicate
      const { data: existing } = await supabaseAdmin
        .from('coupons')
        .select('id')
        .ilike('code', cleanCode)
        .maybeSingle()

      if (existing) {
        return NextResponse.json({ success: false, error: `Code "${cleanCode}" is already taken.` }, { status: 400 })
      }

      const { data: newCoupon, error: coupError } = await supabaseAdmin
        .from('coupons')
        .insert({
          code: cleanCode,
          type: 'percentage',
          value: 10,
          affiliate_id: affiliateId,
          is_active: false, // Requires admin approval
          description: `10% discount coupon requested by partner ${user.email}`,
        })
        .select()
        .single()

      if (coupError) {
        return NextResponse.json({ success: false, error: coupError.message }, { status: 400 })
      }

      // Send custom coupon submitted admin alert
      const athleteName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'UFO Partner'
      try {
        await emailService.sendCouponSubmittedAdminAlert(athleteName, cleanCode, '10%')
      } catch (mailErr: any) {
        console.warn('[AFFILIATE PORTAL] Error sending coupon submitted alert:', mailErr?.message)
      }

      return NextResponse.json({ success: true, coupon: newCoupon })
    }

    if (action === 'request_payout') {
      const { affiliateId, amount, method } = payload || {}

      if (!amount || amount <= 0) {
        return NextResponse.json({ success: false, error: 'Minimum payout balance required.' }, { status: 400 })
      }

      const { data: newPayout, error: payError } = await supabaseAdmin
        .from('affiliate_payouts')
        .insert({
          affiliate_id: affiliateId,
          amount,
          method: method || 'twint',
          status: 'pending',
        })
        .select()
        .single()

      if (payError) {
        return NextResponse.json({ success: false, error: payError.message }, { status: 400 })
      }

      // Reset affiliate wallet balance
      await supabaseAdmin
        .from('affiliates')
        .update({ balance: 0.00 })
        .eq('id', affiliateId)

      return NextResponse.json({ success: true, payout: newPayout })
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 })
  } catch (err: any) {
    console.error('[AFFILIATE PORTAL API] POST Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
