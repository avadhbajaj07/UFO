import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

interface CouponValidateRequest {
  code: string
  subtotal?: number
  currency?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: CouponValidateRequest = await req.json()
    const rawCode = (body.code || '').trim()
    const subtotal = Math.max(0, Number(body.subtotal || 0))
    const currency = (body.currency || 'CHF').toUpperCase()

    if (!rawCode) {
      return NextResponse.json({ valid: false, message: 'Please enter a coupon code.' }, { status: 400 })
    }

    const upperCode = rawCode.toUpperCase()
    const supabaseAdmin = createAdminClient()

    // 1. Check active database coupons
    const { data: dbCoupon, error: couponError } = await supabaseAdmin
      .from('coupons')
      .select('id, code, type, value, min_order_amount, max_uses, uses_count, is_active, affiliate_id, description')
      .ilike('code', upperCode)
      .eq('is_active', true)
      .maybeSingle()

    if (couponError) {
      console.warn('[COUPONS VALIDATE API] Coupons query error:', couponError)
    }

    if (dbCoupon) {
      const minOrder = Number(dbCoupon.min_order_amount || 0)
      if (minOrder > 0 && subtotal > 0 && subtotal < minOrder) {
        return NextResponse.json({
          valid: false,
          message: `Minimum order amount of ${currency} ${minOrder.toFixed(2)} required for code ${dbCoupon.code}.`,
        })
      }

      if (dbCoupon.max_uses && (dbCoupon.uses_count || 0) >= dbCoupon.max_uses) {
        return NextResponse.json({
          valid: false,
          message: `Coupon ${dbCoupon.code} has reached its maximum redemptions.`,
        })
      }

      const val = Number(dbCoupon.value || 0)
      let discount = 0
      let label = ''

      if (dbCoupon.type === 'percentage') {
        discount = Math.round(subtotal * (val / 100) * 100) / 100
        label = `${dbCoupon.code} (${val}% Off)`
      } else if (dbCoupon.type === 'fixed') {
        discount = Math.min(val, subtotal)
        label = `${dbCoupon.code} (${currency} ${val.toFixed(2)} Off)`
      } else {
        discount = 0
        label = `${dbCoupon.code} (Free Shipping)`
      }

      return NextResponse.json({
        valid: true,
        couponId: dbCoupon.id,
        code: dbCoupon.code,
        type: dbCoupon.type,
        value: val,
        discount,
        label,
        affiliateId: dbCoupon.affiliate_id || null,
        description: dbCoupon.description || '',
      })
    }

    // 2. Check approved affiliate athlete partner codes
    const { data: dbAff, error: affError } = await supabaseAdmin
      .from('affiliates')
      .select('id, code, status, commission_rate')
      .ilike('code', upperCode)
      .in('status', ['approved', 'APPROVED'])
      .maybeSingle()

    if (affError) {
      console.warn('[COUPONS VALIDATE API] Affiliate query error:', affError)
    }

    if (dbAff) {
      // Direct athlete promo: grants customer 10% discount and records affiliate referral
      const discount = Math.round(subtotal * 0.1 * 100) / 100
      return NextResponse.json({
        valid: true,
        couponId: null,
        code: dbAff.code,
        type: 'percentage',
        value: 10,
        discount,
        label: `${dbAff.code} (10% Athlete Discount)`,
        affiliateId: dbAff.id,
        isAffiliateCode: true,
      })
    }

    // 3. System fallback promo codes
    if (upperCode === 'UFO99' || upperCode === 'ALIEN99') {
      const discount = Math.round(subtotal * 0.99 * 100) / 100
      return NextResponse.json({
        valid: true,
        couponId: null,
        code: upperCode,
        type: 'percentage',
        value: 99,
        discount,
        label: `${upperCode} (99% Off)`,
        affiliateId: null,
      })
    }

    if (upperCode === 'ALIEN10' || upperCode === 'SWISS' || upperCode === 'UFOLABZ') {
      const discount = Math.round(subtotal * 0.1 * 100) / 100
      return NextResponse.json({
        valid: true,
        couponId: null,
        code: upperCode,
        type: 'percentage',
        value: 10,
        discount,
        label: `${upperCode} (10% Off)`,
        affiliateId: null,
      })
    }

    if (upperCode === 'WELCOME10') {
      const discount = Math.min(10, subtotal)
      return NextResponse.json({
        valid: true,
        couponId: null,
        code: 'WELCOME10',
        type: 'fixed',
        value: 10,
        discount,
        label: `WELCOME10 (${currency} 10.00 Off)`,
        affiliateId: null,
      })
    }

    return NextResponse.json({
      valid: false,
      message: `Invalid or inactive coupon code "${rawCode}".`,
    })
  } catch (err: any) {
    console.error('[COUPONS VALIDATE API] Error:', err)
    return NextResponse.json({ valid: false, error: err.message || 'Validation failed' }, { status: 500 })
  }
}
