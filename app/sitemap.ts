import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ufolabz.com'

  // Fetch all active products
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('status', 'active')
    .not('slug', 'in', '("astro-creatine","blast-pre-workout-energy","amino-fuel-mango")')

  const productUrls = (products as any[] ?? []).map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
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

  return [...staticPages, ...productUrls]
}
