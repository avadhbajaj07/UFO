/**
 * Central Stack Discount & Preset Configuration for UFO LABZ
 * Single source of truth for Stack Tiers (2 items = 10%, 3+ items = 15%),
 * curated presets, and live calculation helpers used across the storefront, cart, and checkout.
 */

import { getCanonicalUnitPrice, SupportedCurrency } from './pricing'

export interface StackTier {
  minUnits: number
  percent: number
  label: string
  badge: string
}

export const DEFAULT_STACK_TIERS: StackTier[] = [
  { minUnits: 2, percent: 10, label: '10% OFF', badge: 'Save 10%' },
  { minUnits: 3, percent: 15, label: '15% OFF', badge: 'Save 15% (Max)' },
]

export interface PresetStackItemDef {
  slug: string
  sku?: string
  quantity: number
  name: string
  flavorName?: string
  color: string
  imageUrl: string
}

export interface PresetStackDef {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  badge: string
  discountPercent: number
  items: PresetStackItemDef[]
}

export const DEFAULT_PRESET_STACKS: PresetStackDef[] = [
  {
    id: 'strength-duo',
    slug: 'strength-duo',
    name: 'Strength Duo',
    tagline: 'ATP Saturation & Lean Muscle Synthesis',
    description:
      'Pure micronized creatine monohydrate combined with fermented full-spectrum EAAs for explosive power and intra-workout endurance.',
    badge: 'Strength & Power',
    discountPercent: 10,
    items: [
      {
        slug: 'astro-creatine',
        sku: 'ASTRO-300G',
        quantity: 1,
        name: 'Astro Creatine Pure',
        flavorName: 'Natural Taste',
        color: '#00FF88',
        imageUrl:
          'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO4_nuzyls.png',
      },
      {
        slug: 'amino-fuel-mango',
        sku: 'AMNO-MANGO-300G',
        quantity: 1,
        name: 'Amino Fuel EAA',
        flavorName: 'Mango',
        color: '#FF8C00',
        imageUrl:
          'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO5_l42elt.png',
      },
    ],
  },
  {
    id: 'recovery-duo',
    slug: 'recovery-duo',
    name: 'Recovery Duo',
    tagline: 'Deep Rest, Tendon & Joint Longevity',
    description:
      'Chelated magnesium bisglycinate paired with bioactive marine collagen peptides to accelerate neuromuscular recovery and protect connective tissue.',
    badge: 'Deep Recovery',
    discountPercent: 10,
    items: [
      {
        slug: 'magnesium',
        sku: 'SKU-MAGNESIUM-960',
        quantity: 1,
        name: 'Magnesium',
        flavorName: '90 Vegan Caps',
        color: '#00FF88',
        imageUrl:
          'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/magnesium.png',
      },
      {
        slug: 'astro-collagen-peptide',
        sku: 'COL-300G',
        quantity: 1,
        name: 'Nova Marine Collagen',
        flavorName: 'Tropical Fruits',
        color: '#FF2244',
        imageUrl:
          'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/nova-marine-collagen.png',
      },
    ],
  },
  {
    id: 'full-orbit-stack',
    slug: 'full-orbit-stack',
    name: 'Full Orbit Stack',
    tagline: 'The Complete High-Performance Protocol',
    description:
      'Laser focus and vascular blood flow with BLAST Pre-Workout, cell volumization with Creatine, and zero-crash recovery with Amino Fuel EAAs.',
    badge: 'Maximum Value · 15% Off',
    discountPercent: 15,
    items: [
      {
        slug: 'blast-pre-workout-energy',
        sku: 'BLAST-ENERGY-300G',
        quantity: 1,
        name: 'Blast Pre-Workout',
        flavorName: 'Energy Drink',
        color: '#FF2244',
        imageUrl:
          'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO3_bfwhlr.png',
      },
      {
        slug: 'astro-creatine',
        sku: 'ASTRO-300G',
        quantity: 1,
        name: 'Astro Creatine Pure',
        flavorName: 'Natural Taste',
        color: '#00FF88',
        imageUrl:
          'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO4_nuzyls.png',
      },
      {
        slug: 'amino-fuel-mango',
        sku: 'AMNO-MANGO-300G',
        quantity: 1,
        name: 'Amino Fuel EAA',
        flavorName: 'Mango',
        color: '#FF8C00',
        imageUrl:
          'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO5_l42elt.png',
      },
    ],
  },
]

export interface StackCalculationItem {
  slug?: string
  quantity: number
  unitPrice?: number
}

export interface StackDiscountResult {
  totalUnits: number
  rawSubtotal: number
  discountPercent: number
  discountAmount: number
  discountedSubtotal: number
  activeTier: StackTier | null
  nextTier: StackTier | null
  unitsToNextTier: number
  nudgeMessage: string
  freeShippingThreshold: number
  amountUntilFreeShipping: number
  isFreeShipping: boolean
}

/**
 * Computes stack volume discounts and next-tier progress.
 * Runs on integer cents / minor units internally to prevent floating point drift.
 */
export function calculateStackDiscount(
  itemsOrOptions:
    | StackCalculationItem[]
    | {
        items: StackCalculationItem[]
        currency?: SupportedCurrency
        tiers?: StackTier[]
      },
  currencyParam: SupportedCurrency = 'CHF',
  tiersParam: StackTier[] = DEFAULT_STACK_TIERS
): StackDiscountResult {
  let items: StackCalculationItem[]
  let currency: SupportedCurrency
  let tiers: StackTier[]

  if (Array.isArray(itemsOrOptions)) {
    items = itemsOrOptions
    currency = currencyParam
    tiers = tiersParam
  } else if (itemsOrOptions && typeof itemsOrOptions === 'object') {
    items = itemsOrOptions.items || []
    currency = itemsOrOptions.currency || currencyParam
    tiers = itemsOrOptions.tiers || tiersParam
  } else {
    items = []
    currency = currencyParam
    tiers = tiersParam
  }
  let totalUnits = 0
  let subtotalCents = 0

  for (const item of items) {
    const qty = Math.max(0, Math.floor(item.quantity || 0))
    if (qty <= 0) continue

    const unitPrice =
      item.unitPrice !== undefined
        ? item.unitPrice
        : getCanonicalUnitPrice(item.slug || '', currency)

    const unitCents = Math.round(unitPrice * 100)
    totalUnits += qty
    subtotalCents += unitCents * qty
  }

  // Sort tiers ascending by minUnits
  const sortedTiers = [...tiers].sort((a, b) => a.minUnits - b.minUnits)

  let activeTier: StackTier | null = null
  let nextTier: StackTier | null = null

  for (let i = sortedTiers.length - 1; i >= 0; i--) {
    if (totalUnits >= sortedTiers[i].minUnits) {
      activeTier = sortedTiers[i]
      break
    }
  }

  // Determine next tier
  for (const tier of sortedTiers) {
    if (totalUnits < tier.minUnits) {
      nextTier = tier
      break
    }
  }

  const discountPercent = activeTier ? activeTier.percent : 0
  const discountCents = Math.round((subtotalCents * discountPercent) / 100)
  const discountedCents = Math.max(0, subtotalCents - discountCents)

  const unitsToNextTier = nextTier ? Math.max(0, nextTier.minUnits - totalUnits) : 0

  let nudgeMessage = ''
  if (totalUnits === 0) {
    nudgeMessage = 'Add 2 formulas to unlock 10% stack savings.'
  } else if (unitsToNextTier > 0 && nextTier) {
    nudgeMessage = `Add ${unitsToNextTier} more ${
      unitsToNextTier === 1 ? 'formula' : 'formulas'
    } to unlock ${nextTier.percent}% off your entire stack!`
  } else {
    nudgeMessage = '🔥 Maximum 15% stack discount unlocked!'
  }

  // Free shipping rules evaluated AFTER stack discount: Free from 75 CHF / 75 EUR
  const freeShippingThreshold = 75.0
  const discountedSubtotal = discountedCents / 100
  const isFreeShipping = discountedSubtotal >= freeShippingThreshold || totalUnits === 0
  const amountUntilFreeShipping = Math.max(
    0,
    Math.round((freeShippingThreshold - discountedSubtotal) * 100) / 100
  )

  return {
    totalUnits,
    rawSubtotal: subtotalCents / 100,
    discountPercent,
    discountAmount: discountCents / 100,
    discountedSubtotal,
    activeTier,
    nextTier,
    unitsToNextTier,
    nudgeMessage,
    freeShippingThreshold,
    amountUntilFreeShipping,
    isFreeShipping,
  }
}

/**
 * Resolves the Stack Tier Volume Discount.
 */
export function resolveBestDiscount({
  stackDiscount,
}: {
  deliveryMethod?: string
  nutrifitDiscount?: number
  stackDiscount: number
}): {
  appliedDiscount: number
  appliedDiscountType: 'none' | 'stack_tier'
  appliedDiscountNote: string
} {
  if (stackDiscount > 0) {
    return {
      appliedDiscount: Math.round(stackDiscount * 100) / 100,
      appliedDiscountType: 'stack_tier',
      appliedDiscountNote: 'Volume Stack Discount',
    }
  }

  return {
    appliedDiscount: 0,
    appliedDiscountType: 'none',
    appliedDiscountNote: '',
  }
}
