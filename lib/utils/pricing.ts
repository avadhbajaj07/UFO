export function formatPrice(price: number): string {
  // Swiss Franc formatting, e.g. "CHF 49.00" or similar
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(price)
}

export interface PricingRule {
  id: string
  min_qty: number
  max_qty: number | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  is_active?: boolean
}

export function getPricedForQuantity(
  basePrice: number,
  quantity: number,
  pricingRules: PricingRule[]
): { price: number; savingsPct: number } {
  // Find a pricing rule that applies to this quantity
  const rule = pricingRules.find(
    (r) => quantity >= r.min_qty && (r.max_qty === null || quantity <= r.max_qty)
  )

  if (!rule) {
    return { price: basePrice, savingsPct: 0 }
  }

  let price = basePrice
  let savingsPct = 0

  if (rule.discount_type === 'percentage') {
    savingsPct = rule.discount_value
    price = basePrice * (1 - rule.discount_value / 100)
  } else if (rule.discount_type === 'fixed') {
    price = Math.max(0, basePrice - rule.discount_value)
    savingsPct = basePrice > 0 ? Math.round((rule.discount_value / basePrice) * 100) : 0
  }

  return { price, savingsPct }
}
