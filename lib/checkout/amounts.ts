import type Stripe from 'stripe'

const STANDARD_SHIPPING_AMOUNT = 9
const PRIORITY_SHIPPING_AMOUNT = 15
const FREE_SHIPPING_THRESHOLD = 99
const CARBON_OFFSET_AMOUNT = 1.5

export type CheckoutShippingMethod = 'standard' | 'priority'

export interface CheckoutItemInput {
  variantId?: string
  variant?: { id?: string }
  name?: string
  variantName?: string
  quantity?: number
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
  shippingMethod?: CheckoutShippingMethod
  discountAmount?: number
  couponCode?: string | null
  carbonOffset?: boolean
}

export interface CheckoutTotals {
  validatedSubtotal: number
  discountAmount: number
  shippingAmount: number
  carbonOffsetAmount: number
  total: number
  taxAmount: number
  orderItemsToInsert: ValidatedOrderItem[]
}

export function toStripeAmount(amount: number) {
  return Math.round(Number(amount || 0) * 100)
}

function resolveDiscountAmount(
  subtotal: number,
  requestedDiscountAmount?: number,
  couponCode?: string | null
) {
  const code = couponCode?.trim().toUpperCase()

  if (code === 'NUTRIFIT') return subtotal * 0.9
  if (code === 'ALIEN10') return subtotal * 0.1
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

  let validatedSubtotal = 0
  const orderItemsToInsert: ValidatedOrderItem[] = []

  for (const item of input.items) {
    const variantId = item.variantId || item.variant?.id
    if (!variantId) {
      throw new Error('Product variant ID is missing.')
    }

    const { data: dbVariant, error: variantError } = await supabaseAdmin
      .from('product_variants')
      .select('price, sku, name, product_id')
      .eq('id', variantId)
      .single()

    if (variantError || !dbVariant) {
      throw new Error(`Invalid variant database lookup for ID: ${variantId}`)
    }

    const unitPrice = Number(dbVariant.price)
    const quantity = Math.max(1, Number(item.quantity || 1))
    const lineTotal = unitPrice * quantity
    validatedSubtotal += lineTotal

    orderItemsToInsert.push({
      product_id: dbVariant.product_id,
      variant_id: variantId,
      product_name: { en: item.name || 'UFO Supplement' },
      variant_name: item.variantName || dbVariant.name || 'Standard size',
      sku: dbVariant.sku || 'N/A',
      quantity,
      unit_price: unitPrice,
      total: lineTotal,
    })
  }

  const discountAmount = Math.min(
    Math.max(
      0,
      resolveDiscountAmount(
        validatedSubtotal,
        input.discountAmount,
        input.couponCode
      )
    ),
    validatedSubtotal
  )
  const shippingAmount =
    input.shippingMethod === 'priority'
      ? PRIORITY_SHIPPING_AMOUNT
      : validatedSubtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : STANDARD_SHIPPING_AMOUNT
  const carbonOffsetAmount = input.carbonOffset ? CARBON_OFFSET_AMOUNT : 0
  const total = Math.max(
    0,
    validatedSubtotal - discountAmount + shippingAmount + carbonOffsetAmount
  )
  const taxAmount = total * (8.1 / 108.1)

  return {
    validatedSubtotal,
    discountAmount,
    shippingAmount,
    carbonOffsetAmount,
    total,
    taxAmount,
    orderItemsToInsert,
  }
}

export function buildStripeLineItems(
  totals: CheckoutTotals
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    totals.orderItemsToInsert.map((item) => ({
      price_data: {
        currency: 'chf',
        product_data: {
          name: `${item.product_name.en} - ${item.variant_name}`,
        },
        unit_amount: toStripeAmount(item.unit_price),
      },
      quantity: item.quantity,
    }))

  if (totals.shippingAmount > 0) {
    lineItems.push({
      price_data: {
        currency: 'chf',
        product_data: {
          name: 'Swiss shipping',
        },
        unit_amount: toStripeAmount(totals.shippingAmount),
      },
      quantity: 1,
    })
  }

  if (totals.carbonOffsetAmount > 0) {
    lineItems.push({
      price_data: {
        currency: 'chf',
        product_data: {
          name: 'Carbon-neutral offset',
        },
        unit_amount: toStripeAmount(totals.carbonOffsetAmount),
      },
      quantity: 1,
    })
  }

  return lineItems
}
