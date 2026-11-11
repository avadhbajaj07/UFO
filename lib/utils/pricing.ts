import {
  SupportedCurrency,
  formatCurrencyPrice,
  getCanonicalUnitPrice,
  getProductPricing,
  calculateNutrifitPickupDiscount,
  calculateShippingFee,
  CORE_PRODUCTS_PRICING,
  SHIPPING_CONFIG,
  NUTRIFIT_STORE_INFO,
  EUROPEAN_COUNTRY_CODES,
  isSwissCountry,
  isEuropeanCountry,
  getCurrencyForCountry,
} from '@/lib/config/pricing'

export {
  formatCurrencyPrice,
  getCanonicalUnitPrice,
  getProductPricing,
  calculateNutrifitPickupDiscount,
  calculateShippingFee,
  CORE_PRODUCTS_PRICING,
  SHIPPING_CONFIG,
  NUTRIFIT_STORE_INFO,
  EUROPEAN_COUNTRY_CODES,
  isSwissCountry,
  isEuropeanCountry,
  getCurrencyForCountry,
}
export type { SupportedCurrency }

export function formatPrice(price: number, currency: SupportedCurrency = 'CHF'): string {
  return formatCurrencyPrice(price, currency)
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
