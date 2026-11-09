import type Stripe from 'stripe'
import {
  SupportedCurrency,
  getCanonicalUnitPrice,
  calculateNutrifitPickupDiscount,
  calculateShippingFee,
  SHIPPING_CONFIG,
  NUTRIFIT_STORE_INFO,
} from '@/lib/config/pricing'
import { PREORDER_CONFIG } from '@/lib/config/preorder'
import {
  calculateStackDiscount,
  resolveBestDiscount,
  StackDiscountResult,
} from '@/lib/config/stack'

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
  stackDiscountAmount: number
  stackDiscountPercent: number
  nutrifitDiscountAmount: number
  appliedDiscountType: 'none' | 'stack_tier' | 'nutrifit_pickup' | 'coupon'
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
  if (code === 'NUTRIFIT') return subtotal * 0.9
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
    const productName = item.name || dbProduct?.name?.en || 'UFO Supplement'
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

  // 2. NutriFit Geneva Pickup BOGO 50% discount on second identical units
  let nutrifitDiscountAmount = 0
  if (deliveryMethod === 'pickup_nutrifit') {
    const nutrifitCalc = calculateNutrifitPickupDiscount(
      orderItemsToInsert.map((item) => ({
        variantId: item.variant_id,
        sku: item.sku,
        name: item.product_name.en,
        quantity: item.quantity,
        unitPrice: item.unit_price,
      }))
    )
    nutrifitDiscountAmount = nutrifitCalc.discountTotal
  }

  // 3. Resolve best single discount between NutriFit Pickup 50% vs Stack Discount (no double-stacking)
  const bestDiscount = resolveBestDiscount({
    deliveryMethod,
    nutrifitDiscount: nutrifitDiscountAmount,
    stackDiscount: stackCalc.discountAmount,
  })

  // 4. Coupon discount (applied to remaining amount if any)
  const subtotalAfterBestDiscount = Math.max(0, validatedSubtotal - bestDiscount.appliedDiscount)
  const couponDiscountAmount = Math.min(
    Math.max(
      0,
      resolveCouponDiscountAmount(
        subtotalAfterBestDiscount,
        input.discountAmount,
        input.couponCode
      )
    ),
    subtotalAfterBestDiscount
  )

  const discountAmount =
    Math.round((bestDiscount.appliedDiscount + couponDiscountAmount) * 100) / 100

  // 5. Shipping fee (evaluated on subtotal AFTER discount as per pricing rules)
  const subtotalForShipping = Math.max(0, validatedSubtotal - discountAmount)
  let shippingAmount = 0
  if (deliveryMethod === 'pickup_nutrifit') {
    shippingAmount = 0.0
  } else if (input.shippingMethod === 'priority' && currency === 'CHF') {
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
    stackDiscountAmount: stackCalc.discountAmount,
    stackDiscountPercent: stackCalc.discountPercent,
    nutrifitDiscountAmount,
    appliedDiscountType: bestDiscount.appliedDiscountType,
    appliedDiscountNote: bestDiscount.appliedDiscountNote,
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
          name: `[PRE-ORDER] ${item.product_name.en} - ${item.variant_name}`,
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
