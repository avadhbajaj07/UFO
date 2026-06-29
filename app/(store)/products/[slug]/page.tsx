// app/(store)/products/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getLocalizedField } from '@/types'
import ProductDetail from '@/components/product/ProductDetail'
import type { Metadata } from 'next'

export const revalidate = 3600

interface Props {
  params: { slug: string }
}

async function getProduct(slug: string) {
  if (['astro-creatine', 'blast-pre-workout', 'amino-fuel-mango'].includes(slug)) {
    return null
  }
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      variants:product_variants(*, nutrition:nutrition_facts(*)),
      images:product_images(*),
      videos:product_videos(*),
      faqs:product_faqs(*),
      pricing_rules:pricing_rules(id, name, min_qty, max_qty, discount_type, discount_value, is_active),
      certificates:product_certificates(*),
      ingredients:product_ingredients(id, amount, is_key, sort_order, ingredient:ingredients(id, name, description, benefits, icon_url)),
      stacks:product_stacks!product_stacks_product_id_fkey(id, label, discount_pct, sort_order, stack_product:products!product_stacks_stack_product_id_fkey(id, name, slug, product_color, color_name, base_price, images:product_images(url, is_primary)))

    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .order('sort_order', { referencedTable: 'variants', ascending: true })
    .order('sort_order', { referencedTable: 'images', ascending: true })
    .order('sort_order', { referencedTable: 'faqs', ascending: true })
    .single()

  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug) as any
  if (!product) return { title: 'Product Not Found' }

  const name = getLocalizedField(product.name as Record<string, string>)
  const desc = getLocalizedField(product.seo_description as Record<string, string>)
    || getLocalizedField(product.short_description as Record<string, string>)

  return {
    title: name,
    description: desc,
    openGraph: {
      title: name,
      description: desc,
      images: product.og_image_url ? [product.og_image_url] : [],
    },
  }
}
import { createClient as createBrowserClient } from '@/lib/supabase/client'

export async function generateStaticParams() {
  const supabase = createBrowserClient()
  const { data } = await supabase.from('products').select('slug').eq('status', 'active')
  return (data as any[] ?? [])
    .filter((p) => !['astro-creatine', 'blast-pre-workout', 'amino-fuel-mango'].includes(p.slug))
    .map((p) => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug)
  if (!product) {
    notFound()
  }

  const prod = product as any
  const localizedName = typeof prod.name === 'object' ? (prod.name.en || prod.name.de) : prod.name
  const localizedDesc = typeof prod.description === 'object' ? (prod.description.en || prod.description.de) : prod.description

  const images = (prod.images as any[] ?? []).map((img) => img.url)
  const offersList = (prod.variants as any[] ?? []).map((v) => ({
    '@type': 'Offer',
    price: v.price,
    priceCurrency: 'CHF',
    itemCondition: 'https://schema.org/NewCondition',
    availability: v.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    sku: v.sku,
    url: `https://ufolabz.com/products/${prod.slug}`,
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: localizedName,
    description: localizedDesc,
    image: images.length > 0 ? images : ['https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO4_nuzyls.png'],
    sku: prod.variants?.[0]?.sku ?? prod.slug,
    brand: {
      '@type': 'Brand',
      name: 'UFO LABZ',
    },
    offers: offersList.length > 0 ? (offersList.length === 1 ? offersList[0] : offersList) : {
      '@type': 'Offer',
      price: prod.base_price,
      priceCurrency: 'CHF',
      availability: 'https://schema.org/InStock',
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product as any} slug={params.slug} />
    </>
  )
}
