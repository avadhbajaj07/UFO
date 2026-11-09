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
    retailPrice: { CHF: 32.37, EUR: 32.37 },
    nutrifitPickup: {
      firstUnitPrice: 32.37,
      secondUnitPrice: 16.19,
      pairTotal: 48.56,
      discountPerPair: 16.18, // 32.37 * 2 - 48.56 = 16.18 discount
    },
  },
  eaa: {
    productKey: 'eaa',
    name: 'EAA 300g',
    slugs: ['amino-fuel-mango', 'amino-fuel-blue-raspberry', 'amino-fuel-blue'],
    skus: ['AMNO-MANGO-300G', 'AMNO-BLUE-300G', 'AMINO-MANGO', 'var-ab1'],
    retailPrice: { CHF: 45.37, EUR: 45.37 },
    nutrifitPickup: {
      firstUnitPrice: 45.37,
      secondUnitPrice: 22.69,
      pairTotal: 68.06,
      discountPerPair: 22.68, // 45.37 * 2 - 68.06 = 22.68 discount
    },
  },
  blast: {
    productKey: 'blast',
    name: 'BLAST Pre-workout 300g',
    slugs: ['blast-pre-workout-energy', 'blast-pre-workout-blue'],
    skus: ['BLAST-ENERGY-300G', 'BLAST-BLUE-300G'],
    retailPrice: { CHF: 51.87, EUR: 51.87 },
    nutrifitPickup: {
      firstUnitPrice: 51.87,
      secondUnitPrice: 25.94,
      pairTotal: 77.81,
      discountPerPair: 25.93, // 51.87 * 2 - 77.81 = 25.93 discount
    },
  },
  collagen: {
    productKey: 'collagen',
    name: 'Marine Collagen 300g',
    slugs: ['astro-collagen-peptide', 'astro-collagen'],
    skus: ['COL-300G'],
    retailPrice: { CHF: 51.87, EUR: 51.87 },
    nutrifitPickup: {
      firstUnitPrice: 51.87,
      secondUnitPrice: 25.94,
      pairTotal: 77.81,
      discountPerPair: 25.93, // 51.87 * 2 - 77.81 = 25.93 discount
    },
  },
  magnesium: {
    productKey: 'magnesium',
    name: 'Magnesium 90 capsules',
    slugs: ['magnesium'],
    skus: ['SKU-MAGNESIUM-960'],
    retailPrice: { CHF: 25.87, EUR: 25.87 },
    nutrifitPickup: {
      firstUnitPrice: 25.87,
      secondUnitPrice: 12.94,
      pairTotal: 38.81,
      discountPerPair: 12.93, // 25.87 * 2 - 38.81 = 12.93 discount
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
  pickupNotice: 'Free In-Store Pickup + 50% Off 2nd Identical Unit',
}

/**
 * Calculate NutriFit Geneva 50% discount on second identical units
 * Rule: Per pair of identical units (same variant/product identifier),
 * the first unit is full price, and the second unit is 50% off (exact cents from table).
 * Mixed products do not qualify.
 */
export function calculateNutrifitPickupDiscount(
  items: Array<{
    variantId?: string
    sku?: string
    slug?: string
    name?: string
    quantity: number
    unitPrice: number
  }>
): { discountTotal: number; lineDiscounts: Array<{ itemKey: string; pairs: number; discount: number }> } {
  let discountTotal = 0
  const lineDiscounts: Array<{ itemKey: string; pairs: number; discount: number }> = []

  for (const item of items) {
    const qty = Math.max(0, Math.floor(item.quantity || 0))
    if (qty < 2) continue

    const pairs = Math.floor(qty / 2)
    const pricingDef =
      getProductPricing(item.slug || '') ||
      getProductPricing(item.sku || '') ||
      getProductPricing(item.variantId || '') ||
      getProductPricing(item.name || '')

    let discountPerPair = 0
    if (pricingDef) {
      discountPerPair = pricingDef.nutrifitPickup.discountPerPair
    } else {
      // Fallback exact 50% round
      discountPerPair = Math.round((item.unitPrice * 0.5) * 100) / 100
    }

    const itemDiscount = Math.round(pairs * discountPerPair * 100) / 100
    discountTotal += itemDiscount
    lineDiscounts.push({
      itemKey: item.slug || item.sku || item.variantId || 'unknown',
      pairs,
      discount: itemDiscount,
    })
  }

  return {
    discountTotal: Math.round(discountTotal * 100) / 100,
    lineDiscounts,
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
