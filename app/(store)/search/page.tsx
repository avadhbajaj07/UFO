import { createClient } from '@/lib/supabase/server'
import SearchClient from '@/components/product/SearchClient'
import type { Metadata } from 'next'
import { sortPublicProducts } from '@/lib/products/catalog'

export const metadata: Metadata = {
  title: 'Search | UFO LABZ',
  description: 'Search the UFO LABZ collection for premium Swiss-engineered supplements.',
}

async function getProducts() {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select(`
      id, name, slug, tagline, short_description, product_color, color_name,
      featured, is_new, is_best_seller, base_price, compare_at_price,
      avg_rating, total_reviews, sort_order,
      images:product_images(url, is_primary, sort_order),
      variants:product_variants(id, name, price, compare_at_price, stock, status, is_default, sort_order)
    `)
    .eq('status', 'active')
    .order('sort_order', { ascending: true })

  return sortPublicProducts(data ?? [])
}

export default async function SearchPage() {
  const products = await getProducts()

  return (
    <div className="pt-20 min-h-screen">
      <SearchClient initialProducts={products as any} />
    </div>
  )
}
