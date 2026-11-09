import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildValidatedCheckoutTotals } from '@/lib/checkout/amounts'
import { SupportedCurrency } from '@/lib/config/pricing'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      items = [],
      currency = 'CHF',
      deliveryMethod = 'shipping',
      country,
      shippingMethod = 'standard',
    } = body

    const normalizedCurrency: SupportedCurrency =
      String(currency).toUpperCase() === 'EUR' ? 'EUR' : 'CHF'

    let supabaseAdmin: any = null
    try {
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        supabaseAdmin = createAdminClient()
      }
    } catch {
      // Supabase admin fallback
    }

    if (!items.length) {
      return NextResponse.json({
        totalUnits: 0,
        subtotal: 0,
        discountPercent: 0,
        discountAmount: 0,
        shippingAmount: 0,
        total: 0,
        nudgeMessage: 'Add 2 formulas to unlock 10% stack savings.',
        isFreeShipping: false,
        amountUntilFreeShipping: normalizedCurrency === 'EUR' ? 60.0 : 50.0,
        orderItems: [],
      })
    }

    const totals = await buildValidatedCheckoutTotals(supabaseAdmin, {
      items,
      currency: normalizedCurrency,
      deliveryMethod,
      country,
      shippingMethod,
    })

    return NextResponse.json({
      currency: totals.currency,
      deliveryMethod: totals.deliveryMethod,
      totalUnits: totals.stackCalc.totalUnits,
      subtotal: totals.validatedSubtotal,
      discountPercent: totals.stackDiscountPercent,
      discountAmount: totals.discountAmount,
      appliedDiscountType: totals.appliedDiscountType,
      appliedDiscountNote: totals.appliedDiscountNote,
      shippingAmount: totals.shippingAmount,
      total: totals.total,
      taxAmount: totals.taxAmount,
      activeTier: totals.stackCalc.activeTier,
      nextTier: totals.stackCalc.nextTier,
      unitsToNextTier: totals.stackCalc.unitsToNextTier,
      nudgeMessage: totals.stackCalc.nudgeMessage,
      isFreeShipping: totals.stackCalc.isFreeShipping,
      amountUntilFreeShipping: totals.stackCalc.amountUntilFreeShipping,
      freeShippingThreshold: totals.stackCalc.freeShippingThreshold,
      orderItems: totals.orderItemsToInsert,
    })
  } catch (err: any) {
    console.error('Error calculating cart totals:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to calculate cart totals.' },
      { status: 400 }
    )
  }
}
