import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { isExcludedPublicProductSlug } from '@/lib/products/catalog'
import { CATEGORY_SEO } from '@/lib/seo/catalog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ufolabz.com'

  // Fetch all active products
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('status', 'active')

  const productUrls = (products as any[] ?? [])
    .filter((product) => !isExcludedPublicProductSlug(product.slug))
    .map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  const categoryUrls = Object.keys(CATEGORY_SEO).map((slug) => ({
    url: `${baseUrl}/products/category/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  const staticPages = [
    '',
    '/products',
    '/pages/about',
    '/pages/shipping',
    '/pages/faq',
    '/pages/contact',
    '/pages/affiliate',
    '/pages/privacy',
    '/pages/terms',
    '/pages/refund',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.6,
  }))

  return [...staticPages, ...categoryUrls, ...productUrls]
}
