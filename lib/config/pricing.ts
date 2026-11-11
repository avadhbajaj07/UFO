/**
 * Central Pricing Configuration for UFO LABZ
 * Single source of truth for all products, currencies, shipping rates, and NutriFit store discounts.
 */

export type SupportedCurrency = 'CHF' | 'EUR'

export interface ProductPricingDefinition {
  productKey: string
  name: string
  slugs: string[]
  skus: string[]
  retailPrice: {
    CHF: number
    EUR: number
  }
  nutrifitPickup: {
    firstUnitPrice: number
    secondUnitPrice: number
    pairTotal: number
    discountPerPair: number
  }
}

export const PREORDER_LAUNCH_DISCOUNT_PERCENT = 25

/**
 * Section 2: Online Retail Prices & NutriFit Geneva Store Pickup Prices
 * Current Catalog:
 * amino: 43.35 EUR / 39.90 CHF
 * blast: 43.35 EUR / 39.90 CHF
 * creatine: 32.49 EUR / 29.90 CHF
 * magnesium: 37.92 EUR / 34.90 CHF
 * collagen: 43.35 EUR / 39.90 CHF
 */
export const CORE_PRODUCTS_PRICING: Record<string, ProductPricingDefinition> = {
  creatine: {
    productKey: 'creatine',
    name: 'Creatine 300g',
    slugs: ['astro-creatine'],
    skus: ['ASTRO-300G'],
    retailPrice: { CHF: 29.90, EUR: 32.49 },
    nutrifitPickup: {
      firstUnitPrice: 29.90,
      secondUnitPrice: 29.90,
      pairTotal: 59.80,
      discountPerPair: 0,
    },
  },
  eaa: {
    productKey: 'eaa',
    name: 'EAA 300g',
    slugs: ['amino-fuel-mango', 'amino-fuel-blue-raspberry', 'amino-fuel-blue'],
    skus: ['AMNO-MANGO-300G', 'AMNO-BLUE-300G', 'AMINO-MANGO', 'var-ab1'],
    retailPrice: { CHF: 39.90, EUR: 43.35 },
    nutrifitPickup: {
      firstUnitPrice: 39.90,
      secondUnitPrice: 39.90,
      pairTotal: 79.80,
      discountPerPair: 0,
    },
  },
  blast: {
    productKey: 'blast',
    name: 'BLAST Pre-workout 300g',
    slugs: ['blast-pre-workout-energy', 'blast-pre-workout-blue'],
    skus: ['BLAST-ENERGY-300G', 'BLAST-BLUE-300G'],
    retailPrice: { CHF: 39.90, EUR: 43.35 },
    nutrifitPickup: {
      firstUnitPrice: 39.90,
      secondUnitPrice: 39.90,
      pairTotal: 79.80,
      discountPerPair: 0,
    },
  },
  collagen: {
    productKey: 'collagen',
    name: 'Marine Collagen 300g',
    slugs: ['astro-collagen-peptide', 'astro-collagen'],
    skus: ['COL-300G'],
    retailPrice: { CHF: 39.90, EUR: 43.35 },
    nutrifitPickup: {
      firstUnitPrice: 39.90,
      secondUnitPrice: 39.90,
      pairTotal: 79.80,
      discountPerPair: 0,
    },
  },
  magnesium: {
    productKey: 'magnesium',
    name: 'Magnesium 90 capsules',
    slugs: ['magnesium'],
    skus: ['SKU-MAGNESIUM-960'],
    retailPrice: { CHF: 34.90, EUR: 37.92 },
    nutrifitPickup: {
      firstUnitPrice: 34.90,
      secondUnitPrice: 34.90,
      pairTotal: 69.80,
      discountPerPair: 0,
    },
  },
}

/**
 * Fast lookup helper by slug or sku
 */
export function getProductPricing(identifier: string): ProductPricingDefinition | null {
  if (!identifier) return null
  const cleaned = identifier.toLowerCase().trim()

  for (const def of Object.values(CORE_PRODUCTS_PRICING)) {
    if (def.productKey.toLowerCase() === cleaned) return def
    if (def.slugs.some((s) => s.toLowerCase() === cleaned)) return def
    if (def.skus.some((s) => s.toLowerCase() === cleaned)) return def
  }
  return null
}

/**
 * Get retail unit price for product in given currency
 */
export function getCanonicalUnitPrice(
  identifier: string,
  currency: SupportedCurrency = 'CHF',
  fallbackPrice?: number
): number {
  const def = getProductPricing(identifier)
  if (def) {
    return def.retailPrice[currency] || def.retailPrice.CHF
  }
  return fallbackPrice ?? 0
}

/**
 * Get the 25% Pre-Order Launch Discounted Price
 */
export function getPreorderLaunchPrice(
  identifier: string,
  currency: SupportedCurrency = 'CHF',
  fallbackPrice?: number
): number {
  const base = getCanonicalUnitPrice(identifier, currency, fallbackPrice)
  return Math.round(base * (1 - PREORDER_LAUNCH_DISCOUNT_PERCENT / 100) * 100) / 100
}

/**
 * Get the 25% Pre-Order Launch Discount Amount
 */
export function getPreorderDiscountAmount(
  identifier: string,
  currency: SupportedCurrency = 'CHF',
  fallbackPrice?: number
): number {
  const base = getCanonicalUnitPrice(identifier, currency, fallbackPrice)
  const discounted = getPreorderLaunchPrice(identifier, currency, fallbackPrice)
  return Math.round((base - discounted) * 100) / 100
}

/**
 * Section 3: Shipping Configuration
 */
export const SHIPPING_CONFIG = {
  switzerland: {
    currency: 'CHF' as SupportedCurrency,
    freeThreshold: 75.0, // Free delivery from CHF 75
    standardFee: 10.0, // CHF 10 if under CHF 75
    pickupFee: 0.0, // Free pickup at NutriFit Geneva
  },
  eu: {
    currency: 'EUR' as SupportedCurrency,
    freeThreshold: 75.0, // Free delivery from EUR 75
    defaultStandardFee: 9.9, // Configurable placeholder
    countryRates: {
      FR: 9.9,
      DE: 9.9,
      IT: 9.9,
      AT: 9.9,
      ES: 10.9,
      NL: 9.9,
      BE: 9.9,
      PT: 11.9,
      PL: 10.9,
      SE: 12.9,
      DK: 11.9,
      FI: 12.9,
      IE: 11.9,
      LU: 9.9,
      CZ: 10.9,
      GR: 12.9,
      RO: 11.9,
      HU: 10.9,
    } as Record<string, number>,
  },
}

/**
 * European ISO 3166-1 alpha-2 country codes
 * All EU-27 member states plus European neighbors
 */
export const EUROPEAN_COUNTRY_CODES = new Set([
  // EU Member States
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  // Non-EU European nations / territories
  'GB', 'UK', 'NO', 'IS', 'LI', 'MC', 'AD', 'SM', 'VA', 'ME', 'XK', 'RS', 'BA', 'MK', 'AL', 'MD', 'UA', 'BY',
])

export function isSwissCountry(countryCode?: string | null): boolean {
  if (!countryCode) return false
  const c = countryCode.trim().toUpperCase()
  return c === 'CH' || c === 'CHE' || c === 'SWITZERLAND'
}

export function isEuropeanCountry(countryCode?: string | null): boolean {
  if (!countryCode) return false
  const c = countryCode.trim().toUpperCase()
  return EUROPEAN_COUNTRY_CODES.has(c)
}

export function getCurrencyForCountry(countryCode?: string | null): SupportedCurrency {
  if (!countryCode) return 'CHF'
  if (isSwissCountry(countryCode)) return 'CHF'
  if (isEuropeanCountry(countryCode)) return 'EUR'
  return 'CHF'
}

export const NUTRIFIT_STORE_INFO = {
  name: 'NutriFit Geneva Store',
  address: 'Rue de Genève, 1200 Genève, Switzerland',
  city: 'Geneva',
  country: 'Switzerland',
  hours: 'Mon-Sat: 10:00 - 19:00',
  pickupNotice: 'Free In-Store Pickup at NutriFit Geneva Store',
}

/**
 * NutriFit Geneva Store Pickup Discount
 * NOTE: 50% discount on second unit has been removed per updated pricing strategy.
 * Always returns 0 discount (pickup remains 100% free with no shipping fee).
 */
export function calculateNutrifitPickupDiscount(
  _items: Array<{
    variantId?: string
    sku?: string
    slug?: string
    name?: string
    quantity: number
    unitPrice: number
  }>
): { discountTotal: number; lineDiscounts: Array<{ itemKey: string; pairs: number; discount: number }> } {
  return {
    discountTotal: 0,
    lineDiscounts: [],
  }
}

/**
 * Resolve shipping fee based on delivery method, destination country, subtotal, and currency
 */
export function calculateShippingFee({
  deliveryMethod,
  country = 'CH',
  subtotal,
  currency = 'CHF',
}: {
  deliveryMethod: 'shipping' | 'pickup_nutrifit'
  country?: string
  subtotal: number
  currency?: SupportedCurrency
}): number {
  if (deliveryMethod === 'pickup_nutrifit') {
    return 0.0 // Free pickup at NutriFit Geneva
  }

  const cleanCountry = (country || 'CH').toUpperCase().trim()

  if (cleanCountry === 'CH' || cleanCountry === 'SWITZERLAND' || cleanCountry === 'CHE') {
    if (subtotal >= SHIPPING_CONFIG.switzerland.freeThreshold) {
      return 0.0
    }
    return SHIPPING_CONFIG.switzerland.standardFee
  }

  // EU shipping
  if (subtotal >= SHIPPING_CONFIG.eu.freeThreshold) {
    return 0.0
  }

  return SHIPPING_CONFIG.eu.countryRates[cleanCountry] ?? SHIPPING_CONFIG.eu.defaultStandardFee
}

/**
 * Format currency price
 */
export function formatCurrencyPrice(
  amount: number,
  currency: SupportedCurrency = 'CHF',
  locale?: string
): string {
  const safeLocale = locale || (currency === 'EUR' ? 'de-DE' : 'de-CH')
  return new Intl.NumberFormat(safeLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
