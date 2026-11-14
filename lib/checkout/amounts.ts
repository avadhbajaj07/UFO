import type Stripe from 'stripe'
import {
  SupportedCurrency,
  getCanonicalUnitPrice,
  calculateShippingFee,
  SHIPPING_CONFIG,
} from '@/lib/config/pricing'
import { PREORDER_CONFIG } from '@/lib/config/preorder'
import {
  calculateStackDiscount,
  StackDiscountResult,
} from '@/lib/config/stack'
import { getProductDisplayName } from '@/lib/products'

export type CheckoutShippingMethod = 'standard' | 'priority'
export type CheckoutDeliveryMethod = 'shipping' | 'pickup_nutrifit'

const CARBON_OFFSET_AMOUNT = 1.5

export interface CheckoutItemInput {
  productId?: string
  variantId?: string
  variant?: { id?: string; sku?: string; name?: string; price?: number; product?: any }
  slug?: string
  name?: string
  variantName?: string
  quantity?: number
  price?: number
}

export interface ValidatedOrderItem {
  product_id: string
  variant_id: string
  product_name: { en: string }
  variant_name: string
  sku: string
  quantity: number
  unit_price: number
  total: number
}

export interface CheckoutTotalsInput {
  items: CheckoutItemInput[]
  currency?: SupportedCurrency
  deliveryMethod?: CheckoutDeliveryMethod
  country?: string
  shippingMethod?: CheckoutShippingMethod
  discountAmount?: number
  couponCode?: string | null
  carbonOffset?: boolean
}

export interface CheckoutTotals {
  currency: SupportedCurrency
  deliveryMethod: CheckoutDeliveryMethod
  validatedSubtotal: number
  preorderDiscountAmount: number
  stackDiscountAmount: number
  stackDiscountPercent: number
  nutrifitDiscountAmount: number
  appliedDiscountType: 'none' | 'stack_tier' | 'nutrifit_pickup' | 'coupon' | 'preorder_launch'
  appliedDiscountNote: string
  couponDiscountAmount: number
  discountAmount: number
  shippingAmount: number
  carbonOffsetAmount: number
  total: number
  taxAmount: number
  orderItemsToInsert: ValidatedOrderItem[]
  stackCalc: StackDiscountResult
}

export function toStripeAmount(amount: number): number {
  return Math.round(Number(amount || 0) * 100)
}

function resolveCouponDiscountAmount(
  subtotal: number,
  requestedDiscountAmount?: number,
  couponCode?: string | null
): number {
  const code = couponCode?.trim().toUpperCase()

  if (code === 'UFO99' || code === 'ALIEN99') return subtotal * 0.99
  if (code === 'SWISS' || code === 'UFOLABZ') return subtotal * 0.9
  if (code === 'ALIEN10') return subtotal * 0.1
  if (code === 'WELCOME10') return Math.min(10, subtotal)
  if (code === 'WELCOME500') return Math.min(5, subtotal)

  return Number(requestedDiscountAmount || 0)
}

export async function buildValidatedCheckoutTotals(
  supabaseAdmin: any,
  input: CheckoutTotalsInput
): Promise<CheckoutTotals> {
  if (!input.items?.length) {
    throw new Error('Checkout requires at least one item.')
  }

  const currency: SupportedCurrency = input.currency === 'EUR' ? 'EUR' : 'CHF'
  const deliveryMethod: CheckoutDeliveryMethod =
    input.deliveryMethod === 'pickup_nutrifit' ? 'pickup_nutrifit' : 'shipping'
  const country = input.country || (currency === 'EUR' ? 'FR' : 'CH')

  let validatedSubtotal = 0
  const orderItemsToInsert: ValidatedOrderItem[] = []

  for (const item of input.items) {
    const variantId = item.variantId || item.variant?.id
    if (!variantId) {
      throw new Error('Product variant ID is missing.')
    }

    let dbVariant: any = null
    let dbProduct: any = null

    if (supabaseAdmin) {
      const { data: vData } = await supabaseAdmin
        .from('product_variants')
        .select('price, sku, name, product_id, products(id, name, slug, base_price)')
        .eq('id', variantId)
        .maybeSingle()

      if (vData) {
        dbVariant = vData
        dbProduct = vData.products
      }
    }

    const slug = item.slug || (item.variant as any)?.product?.slug || dbProduct?.slug || ''
    const sku = item.variant?.sku || dbVariant?.sku || ''
    const productName = getProductDisplayName(slug, item.name || dbProduct?.name?.en || 'UFO Supplement')
    const variantName = item.variantName || dbVariant?.name || 'Standard size'

    // Canonical unit price strictly driven by central single source of truth
    const canonicalPrice = getCanonicalUnitPrice(
      slug || sku || variantId,
      currency,
      dbVariant?.price || item.price || 0
    )

    const quantity = Math.max(1, Math.floor(Number(item.quantity || 1)))
    const lineTotal = Math.round(canonicalPrice * quantity * 100) / 100
    validatedSubtotal += lineTotal

    orderItemsToInsert.push({
      product_id: dbVariant?.product_id || item.productId || 'canonical-prod',
      variant_id: variantId,
      product_name: { en: productName },
      variant_name: variantName,
      sku: sku || 'N/A',
      quantity,
      unit_price: canonicalPrice,
      total: lineTotal,
    })
  }

  // 1. Stack volume discount (10% for 2 units, 15% for 3+ units)
  const stackCalc = calculateStackDiscount(
    orderItemsToInsert.map((item) => ({
      slug: item.sku,
      quantity: item.quantity,
      unitPrice: item.unit_price,
    })),
    currency
  )

  // 2. Pre-Order Launching Offer: 25% discount guaranteed on preorder store
  const PREORDER_LAUNCH_PERCENT = 25
  const preorderDiscountAmount =
    Math.round(validatedSubtotal * (PREORDER_LAUNCH_PERCENT / 100) * 100) / 100

  // 3. Coupon discount (applied to subtotal after stack & launch discounts if coupon entered)
  const subtotalAfterLaunchAndStack = Math.max(
    0,
    validatedSubtotal - preorderDiscountAmount - stackCalc.discountAmount
  )

  let resolvedCouponDiscount = 0
  if (input.couponCode) {
    const code = input.couponCode.trim().toUpperCase()
    if (supabaseAdmin) {
      try {
        const { data: dbCoupon } = await supabaseAdmin
          .from('coupons')
          .select('*')
          .ilike('code', code)
          .eq('is_active', true)
          .maybeSingle()

        if (dbCoupon) {
          if (dbCoupon.type === 'percentage') {
            resolvedCouponDiscount =
              Math.round(subtotalAfterLaunchAndStack * (Number(dbCoupon.value) / 100) * 100) / 100
          } else if (dbCoupon.type === 'fixed') {
            resolvedCouponDiscount = Math.min(Number(dbCoupon.value), subtotalAfterLaunchAndStack)
          }
        } else {
          const { data: dbAff } = await supabaseAdmin
            .from('affiliates')
            .select('*')
            .ilike('code', code)
            .eq('status', 'approved')
            .maybeSingle()

          if (dbAff) {
            resolvedCouponDiscount =
              Math.round(subtotalAfterLaunchAndStack * 0.1 * 100) / 100
          }
        }
      } catch (err) {
        console.warn('Coupon lookup error in checkout totals:', err)
      }
    }

    if (resolvedCouponDiscount === 0) {
      resolvedCouponDiscount = resolveCouponDiscountAmount(
        subtotalAfterLaunchAndStack,
        input.discountAmount,
        input.couponCode
      )
    }
  }

  const couponDiscountAmount = Math.min(
    Math.max(0, resolvedCouponDiscount),
    subtotalAfterLaunchAndStack
  )

  const discountAmount =
    Math.round(
      Math.min(
        validatedSubtotal,
        preorderDiscountAmount + stackCalc.discountAmount + couponDiscountAmount
      ) * 100
    ) / 100

  // Build descriptive notes for the discount breakdown (Coupon -> Stack -> Pre-Order)
  const notes: string[] = []
  if (couponDiscountAmount > 0) {
    notes.push(`Coupon (${input.couponCode})`)
  }
  if (stackCalc.discountPercent > 0) {
    notes.push(`${stackCalc.discountPercent}% Stack Discount`)
  }
  notes.push('25% Pre-Order Launch Offer')
  const appliedDiscountNote = notes.join(' + ')
  const appliedDiscountType = stackCalc.discountPercent > 0 ? 'stack_tier' : 'preorder_launch'

  // 4. Shipping fee (evaluated on subtotal AFTER discount as per pricing rules: Free from 75 CHF/EUR)
  const subtotalForShipping = Math.max(0, validatedSubtotal - discountAmount)
  let shippingAmount = 0
  if (input.shippingMethod === 'priority' && currency === 'CHF') {
    shippingAmount = 15.0
  } else {
    shippingAmount = calculateShippingFee({
      deliveryMethod: 'shipping',
      country,
      subtotal: subtotalForShipping,
      currency,
    })
  }

  const carbonOffsetAmount = input.carbonOffset ? CARBON_OFFSET_AMOUNT : 0
  const total = Math.max(
    0,
    Math.round((validatedSubtotal - discountAmount + shippingAmount + carbonOffsetAmount) * 100) /
      100
  )

  // VAT (e.g. 8.1% for Swiss display)
  const taxAmount = Math.round(total * (8.1 / 108.1) * 100) / 100

  return {
    currency,
    deliveryMethod,
    validatedSubtotal: Math.round(validatedSubtotal * 100) / 100,
    preorderDiscountAmount,
    stackDiscountAmount: stackCalc.discountAmount,
    stackDiscountPercent: stackCalc.discountPercent,
    nutrifitDiscountAmount: 0,
    appliedDiscountType,
    appliedDiscountNote,
    couponDiscountAmount,
    discountAmount,
    shippingAmount,
    carbonOffsetAmount,
    total,
    taxAmount,
    orderItemsToInsert,
    stackCalc,
  }
}

export function buildStripeLineItems(
  totals: CheckoutTotals
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const stripeCurrency = totals.currency.toLowerCase()

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    totals.orderItemsToInsert.map((item) => ({
      price_data: {
        currency: stripeCurrency,
        product_data: {
          name: `[PRE-ORDER] ${getProductDisplayName(item.product_name.en)}`,
          description: `Laboratory formulation reserved. ${PREORDER_CONFIG.estimatedShipNotice}`,
        },
        unit_amount: toStripeAmount(item.unit_price),
      },
      quantity: item.quantity,
    }))

  if (totals.shippingAmount > 0) {
    lineItems.push({
      price_data: {
        currency: stripeCurrency,
        product_data: {
          name: totals.currency === 'CHF' ? 'Swiss Pre-Order Shipping' : 'EU Pre-Order Shipping',
          description: 'Insured laboratory delivery',
        },
        unit_amount: toStripeAmount(totals.shippingAmount),
      },
      quantity: 1,
    })
  }

  if (totals.carbonOffsetAmount > 0) {
    lineItems.push({
      price_data: {
        currency: stripeCurrency,
        product_data: {
          name: 'Carbon-Neutral Offset',
          description: '100% verified climate offset project',
        },
        unit_amount: toStripeAmount(totals.carbonOffsetAmount),
      },
      quantity: 1,
    })
  }

  return lineItems
}
