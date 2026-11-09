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

/**
 * Section 2: Online Retail Prices & NutriFit Geneva Store Pickup Prices (BOGO 50%)
 */
export const CORE_PRODUCTS_PRICING: Record<string, ProductPricingDefinition> = {
  creatine: {
    productKey: 'creatine',
    name: 'Creatine 300g',
    slugs: ['astro-creatine'],
    skus: ['ASTRO-300G'],
    retailPrice: { CHF: 23.27, EUR: 23.27 },
    nutrifitPickup: {
      firstUnitPrice: 23.27,
      secondUnitPrice: 23.27,
      pairTotal: 46.54,
      discountPerPair: 0,
    },
  },
  eaa: {
    productKey: 'eaa',
    name: 'EAA 300g',
    slugs: ['amino-fuel-mango', 'amino-fuel-blue-raspberry', 'amino-fuel-blue'],
    skus: ['AMNO-MANGO-300G', 'AMNO-BLUE-300G', 'AMINO-MANGO', 'var-ab1'],
    retailPrice: { CHF: 32.37, EUR: 32.37 },
    nutrifitPickup: {
      firstUnitPrice: 32.37,
      secondUnitPrice: 32.37,
      pairTotal: 64.74,
      discountPerPair: 0,
    },
  },
  blast: {
    productKey: 'blast',
    name: 'BLAST Pre-workout 300g',
    slugs: ['blast-pre-workout-energy', 'blast-pre-workout-blue'],
    skus: ['BLAST-ENERGY-300G', 'BLAST-BLUE-300G'],
    retailPrice: { CHF: 38.87, EUR: 38.87 },
    nutrifitPickup: {
      firstUnitPrice: 38.87,
      secondUnitPrice: 38.87,
      pairTotal: 77.74,
      discountPerPair: 0,
    },
  },
  collagen: {
    productKey: 'collagen',
    name: 'Marine Collagen 300g',
    slugs: ['astro-collagen-peptide', 'astro-collagen'],
    skus: ['COL-300G'],
    retailPrice: { CHF: 38.87, EUR: 38.87 },
    nutrifitPickup: {
      firstUnitPrice: 38.87,
      secondUnitPrice: 38.87,
      pairTotal: 77.74,
      discountPerPair: 0,
    },
  },
  magnesium: {
    productKey: 'magnesium',
    name: 'Magnesium 90 capsules',
    slugs: ['magnesium'],
    skus: ['SKU-MAGNESIUM-960'],
    retailPrice: { CHF: 19.37, EUR: 19.37 },
    nutrifitPickup: {
      firstUnitPrice: 19.37,
      secondUnitPrice: 19.37,
      pairTotal: 38.74,
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
 * Section 3: Shipping Configuration
 */
export const SHIPPING_CONFIG = {
  switzerland: {
    currency: 'CHF' as SupportedCurrency,
    freeThreshold: 50.0, // Free from CHF 50
    standardFee: 10.0, // CHF 10 if under CHF 50
    pickupFee: 0.0, // Free pickup at NutriFit Geneva
  },
  eu: {
    currency: 'EUR' as SupportedCurrency,
    freeThreshold: 60.0, // Free from EUR 60
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
