/**
 * Product formatting, format/size pill helpers, and clean title utilities for UFO LABZ.
 */

export const PRODUCT_FORMAT_MAP: Record<string, string> = {
  'astro-creatine': '300g',
  'amino-fuel-mango': '300g',
  'amino-fuel-blue-raspberry': '300g',
  'blast-pre-workout-energy': '300g',
  'blast-pre-workout-blue': '300g',
  'astro-collagen-peptide': '300g',
  'astro-collagen': '300g',
  'magnesium': '90 Vegan Caps',
}

/**
 * Strips any flavor suffix in parentheses (e.g. "(MANGO)", "(ENERGY DRINK)") from a product title.
 */
export function stripFlavorSuffix(title: string | null | undefined): string {
  if (!title) return ''
  return title
    .replace(/\s*\((?:Mango|Blue Raspberry|Blaue Himbeere|Energy Drink|Tropical Fruits|90 Caps|90 Capsules|90 Vegan Caps)\)/gi, '')
    .replace(/\s*\([^)]*\)$/, '')
    .trim()
}

/**
 * Returns the standardized format / size pill label for a product (e.g. "300g" or "90 Vegan Caps").
 */
export function getProductFormat(product: { slug?: string; format?: string | null } | null | undefined): string {
  if (!product) return '300g'
  if (product.format && typeof product.format === 'string' && product.format.trim()) {
    return product.format.trim()
  }
  const slug = (product.slug || '').toLowerCase()
  if (slug.includes('magnesium')) {
    return '90 Vegan Caps'
  }
  return PRODUCT_FORMAT_MAP[slug] || '300g'
}

/**
 * Returns the localized tagline for a product, ensuring Magnesium always has its slogan.
 */
export function getCleanTagline(product: { slug?: string; tagline?: any } | null | undefined, locale: string = 'fr'): string {
  if (!product) return ''
  const slug = (product.slug || '').toLowerCase()
  if (slug.includes('magnesium')) {
    if (typeof product.tagline === 'object' && product.tagline) {
      const val = product.tagline[locale] || product.tagline.fr || product.tagline.en || product.tagline.de || product.tagline.it
      if (val) return val
    } else if (typeof product.tagline === 'string' && product.tagline.trim()) {
      return product.tagline.trim()
    }
    return locale === 'fr' ? 'Sommeil stellaire. Récupération profonde.' :
           locale === 'de' ? 'Stellarer Schlaf. Tiefe Erholung.' :
           locale === 'it' ? 'Sonno stellare. Recupero profondo.' :
           'Stellar sleep. Deep recovery.'
  }

  if (typeof product.tagline === 'object' && product.tagline) {
    return product.tagline[locale] || product.tagline.fr || product.tagline.en || product.tagline.de || product.tagline.it || ''
  }
  if (typeof product.tagline === 'string') {
    return product.tagline
  }
  return ''
}
