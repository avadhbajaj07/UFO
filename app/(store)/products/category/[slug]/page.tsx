import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductsClient from '@/components/product/ProductsClient'
import { createClient } from '@/lib/supabase/server'
import { sortPublicProducts } from '@/lib/products/catalog'
import { CATEGORY_SEO, SITE_URL } from '@/lib/seo/catalog'

export const revalidate = 3600

interface Props {
  params: { slug: string }
  searchParams?: { sort?: string }
}

async function getCategory(slug: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  return data as any
}

async function getProducts(categoryId: string, sort = 'sort_order') {
  const supabase = createClient()
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
    .eq('category_id', categoryId)

  if (sort === 'price_asc') query = query.order('base_price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('base_price', { ascending: false })
  else if (sort === 'rating') query = query.order('avg_rating', { ascending: false })
  else if (sort === 'newest') query = query.order('created_at', { ascending: false })
  else query = query.order('sort_order', { ascending: true })

  const { data } = await query
  return sortPublicProducts(data ?? [])
}

async function getCategories() {
  const supabase = createClient()
  const { data } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('sort_order')
  return data ?? []
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_SEO).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seo = CATEGORY_SEO[params.slug]
  if (!seo) return { title: 'Product Category Not Found', robots: { index: false } }
  const canonical = `${SITE_URL}/products/category/${params.slug}`
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical },
    openGraph: { title: seo.title, description: seo.description, url: canonical, type: 'website' },
    twitter: { card: 'summary_large_image', title: seo.title, description: seo.description },
  }
}

export default async function CategoryPage({ params, searchParams = {} }: Props) {
  const seo = CATEGORY_SEO[params.slug]
  const category = await getCategory(params.slug)
  if (!seo || !category) notFound()

  const [products, categories] = await Promise.all([
    getProducts(category.id, searchParams.sort),
    getCategories(),
  ])

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Supplements', item: `${SITE_URL}/products` },
      { '@type': 'ListItem', position: 3, name: seo.heading, item: `${SITE_URL}/products/category/${params.slug}` },
    ],
  }

  return (
    <div className="pt-20 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <ProductsClient
        products={products as any}
        categories={categories as any}
        activeCategory={params.slug}
        activeSort={searchParams.sort}
        heading={seo.heading}
        intro={seo.intro}
      />
    </div>
  )
}

