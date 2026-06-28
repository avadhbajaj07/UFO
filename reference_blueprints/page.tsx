// app/(store)/page.tsx
import { createClient } from '@/lib/supabase/server'
import { getLocalizedField } from '@/types'
import { formatPrice } from '@/lib/utils/pricing'
import HeroSection from '@/components/home/HeroSection'
import ProductGrid from '@/components/home/ProductGrid'
import FeaturesSection from '@/components/home/FeaturesSection'
import MarqueeBanner from '@/components/home/MarqueeBanner'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UFO LABZ — Alien Performance Technology',
  description: 'Premium science-backed supplements engineered for peak performance. Free delivery in Switzerland on orders over CHF 99.',
}

export const revalidate = 3600 // ISR: revalidate every hour

async function getFeaturedProducts() {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select(`
      id, name, slug, tagline, short_description,
      product_color, color_name, featured, is_new, is_best_seller,
      base_price, compare_at_price, avg_rating, total_reviews,
      images:product_images(url, alt, is_primary, sort_order),
      variants:product_variants(id, name, price, compare_at_price, stock, is_default, sort_order)
    `)
    .eq('status', 'active')
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(5)

  return data ?? []
}

export default async function HomePage() {
  const products = await getFeaturedProducts()

  return (
    <>
      <HeroSection />
      <MarqueeBanner />
      <ProductGrid products={products} />
      <FeaturesSection />
      <TestimonialsSection />
    </>
  )
}
