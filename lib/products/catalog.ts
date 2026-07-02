export const PUBLIC_PRODUCT_ORDER = [
  'astro-creatine',
  'amino-fuel-mango',
  'amino-fuel-blue-raspberry',
  'blast-pre-workout-energy',
  'blast-pre-workout-blue',
  'magnesium',
]

export const EXCLUDED_PUBLIC_PRODUCT_SLUGS = ['iso-whey-zero-907g']

const publicProductRank = new Map(
  PUBLIC_PRODUCT_ORDER.map((slug, index) => [slug, index])
)

export function isExcludedPublicProductSlug(slug: string) {
  return EXCLUDED_PUBLIC_PRODUCT_SLUGS.includes(slug)
}

export function sortPublicProducts<T extends { slug: string; sort_order?: number | null }>(
  products: T[]
) {
  return [...products]
    .filter((product) => !isExcludedPublicProductSlug(product.slug))
    .sort((a, b) => {
      const rankA = publicProductRank.get(a.slug) ?? Number.MAX_SAFE_INTEGER
      const rankB = publicProductRank.get(b.slug) ?? Number.MAX_SAFE_INTEGER

      if (rankA !== rankB) return rankA - rankB
      return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)
    })
}
