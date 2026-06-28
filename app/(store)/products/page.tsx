// app/(store)/products/page.tsx
import { createClient } from '@/lib/supabase/server'
import ProductsClient from '@/components/product/ProductsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse all UFO LABZ supplements. Creatine, Pre Workout, BCAA, and Special Edition formulas.',
}

export const revalidate = 3600

async function getProducts(searchParams: Record<string, string> = {}) {
  const supabase  = createClient()
  const category  = searchParams?.category
  const sort      = searchParams?.sort ?? 'sort_order'

  let query = supabase
    .from('products')
    .select(`
      id, name, slug, tagline, short_description, product_color, color_name,
      featured, is_new, is_best_seller, base_price, compare_at_price,
      avg_rating, total_reviews, sort_order,
      category:categories(id, name, slug),
      images:product_images(url, is_primary, sort_order),
      variants:product_variants(id, name, price, compare_at_price, stock, status, is_default, sort_order)
    `)
    .eq('status', 'active')

  if (category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', category).single() as any
    if (cat) query = query.eq('category_id', cat.id)
  }

  switch (sort) {
    case 'price_asc':  query = query.order('base_price', { ascending: true });  break
    case 'price_desc': query = query.order('base_price', { ascending: false }); break
    case 'rating':     query = query.order('avg_rating', { ascending: false });  break
    case 'newest':     query = query.order('created_at', { ascending: false });  break
    default:           query = query.order('sort_order', { ascending: true });   break
  }

  const { data } = await query
  return data ?? []
}

async function getCategories() {
  const supabase = createClient()
  const { data } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  return data ?? []
}

export default async function ProductsPage({
  searchParams = {},
}: {
  searchParams?: Record<string, string>
}) {
  const params = searchParams || {}
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ])

  return (
    <div className="pt-20 min-h-screen">
      <ProductsClient
        products={products as any}
        categories={categories as any}
        activeCategory={params.category}
        activeSort={params.sort}
      />
    </div>
  )
}
