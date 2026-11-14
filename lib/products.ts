/**
 * Central Product Constants for UFO LABZ
 * Single source of truth for canonical product slugs and immutable display names.
 * Product names are NEVER translated into other languages.
 * Size/flavor must NEVER be appended to product titles.
 */

export const CANONICAL_PRODUCT_NAMES = {
  'astro-creatine': 'ASTRO CREATINE PURE',
  'amino-fuel-mango': 'AMINO FUEL EAA',
  'blast-pre-workout-energy': 'BLAST PRE-WORKOUT',
  'astro-collagen-peptide': 'NOVA MARINE PEPTIDES COLLAGEN',
  'magnesium': 'COSMIC MAGNESIUM GLYCINATE',
} as const

export type CanonicalProductSlug = keyof typeof CANONICAL_PRODUCT_NAMES

export const ALL_PRODUCT_NAME_MAP: Record<string, string> = {
  // Primary slugs
  'astro-creatine': 'ASTRO CREATINE PURE',
  'amino-fuel-mango': 'AMINO FUEL EAA',
  'blast-pre-workout-energy': 'BLAST PRE-WORKOUT',
  'astro-collagen-peptide': 'NOVA MARINE PEPTIDES COLLAGEN',
  'magnesium': 'COSMIC MAGNESIUM GLYCINATE',

  // Flavor variant & legacy alias slugs
  'amino-fuel-blue-raspberry': 'AMINO FUEL EAA',
  'amino-fuel-blue': 'AMINO FUEL EAA',
  'blast-pre-workout-blue': 'BLAST PRE-WORKOUT',
  'astro-collagen': 'NOVA MARINE PEPTIDES COLLAGEN',
}

/**
 * Returns the immutable, non-translated display name for any product slug.
 * Strips any residual weight or flavor suffix automatically.
 */
export function getProductDisplayName(slugOrIdentifier: string | null | undefined, fallback?: string): string {
  if (!slugOrIdentifier) return fallback || ''
  const clean = slugOrIdentifier.toLowerCase().trim()

  if (ALL_PRODUCT_NAME_MAP[clean]) {
    return ALL_PRODUCT_NAME_MAP[clean]
  }

  // Handle prefix matches for known product families
  if (clean.includes('creatine')) return 'ASTRO CREATINE PURE'
  if (clean.includes('amino-fuel') || clean.includes('eaa')) return 'AMINO FUEL EAA'
  if (clean.includes('blast') || clean.includes('pre-workout')) return 'BLAST PRE-WORKOUT'
  if (clean.includes('collagen')) return 'NOVA MARINE PEPTIDES COLLAGEN'
  if (clean.includes('magnesium')) return 'COSMIC MAGNESIUM GLYCINATE'

  // Strip any accidental "(300g)", "300g", or flavor in parentheses from fallback
  if (fallback) {
    return fallback
      .replace(/\s*\b(?:300g|500g|90\s*Caps|90\s*Capsules|90\s*Vegan\s*Caps)\b/gi, '')
      .replace(/\s*\([^)]*\)$/, '')
      .trim()
  }

  return clean.toUpperCase()
}

/**
 * Validates whether a slug corresponds to an active UFO LABZ product.
 */
export function isValidProductSlug(slug: string): boolean {
  if (!slug) return false
  return slug.toLowerCase().trim() in ALL_PRODUCT_NAME_MAP
}
