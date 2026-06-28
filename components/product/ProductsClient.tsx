'use client'
// components/product/ProductsClient.tsx
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag, SlidersHorizontal } from 'lucide-react'
import { formatPrice } from '@/lib/utils/pricing'
import { getLocalizedField } from '@/types'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'sort_order',  label: 'Featured' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'newest',     label: 'Newest' },
]

interface Props {
  products:       any[]
  categories:     any[]
  activeCategory?: string
  activeSort?:    string
}

export default function ProductsClient({ products, categories, activeCategory, activeSort = 'sort_order' }: Props) {
  const router = useRouter()
  const [displayProducts, setDisplayProducts] = useState(products)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ufo_catalog_products')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          const mapped = parsed.map((p: any) => ({
            id: p.id,
            name: { en: p.title, de: p.title },
            slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            tagline: { en: p.desc, de: p.desc },
            short_description: { en: p.desc, de: p.desc },
            product_color: p.product_color || '#00FF88',
            color_name: p.color_name || 'Alien Green',
            featured: true,
            is_new: true,
            is_best_seller: false,
            base_price: p.price,
            compare_at_price: p.base_price,
            avg_rating: 5.0,
            total_reviews: 1,
            images: [{ url: p.featuredImage || 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600', is_primary: true }],
            variants: [{
              id: `var-${p.id}`,
              name: 'Standard size',
              price: p.price,
              compare_at_price: p.base_price,
              stock: p.stock,
              status: p.stock > 0 ? 'active' : 'out_of_stock',
              is_default: true
            }]
          }))

          const filteredDb = products.filter(p => !mapped.some((m: any) => m.slug === p.slug))
          setDisplayProducts([...mapped, ...filteredDb])
          return
        }
      }
    } catch (e) {
      console.error('Failed to parse stored catalog products', e)
    }
    setDisplayProducts(products)
  }, [products])

  const setFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/products?${params.toString()}`)
  }

  const { addItem, isLoading } = useCart()

  return (
    <div className="max-w-7xl mx-auto container-px py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-5xl tracking-wider text-white mb-2">THE COLLECTION</h1>
        <p className="text-muted">{products.length} products</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 items-center justify-between">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('category', null)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium border transition-all',
              !activeCategory
                ? 'bg-alien-green text-space-900 border-alien-green'
                : 'bg-transparent text-muted border-muted/20 hover:border-alien-green/40 hover:text-white'
            )}
          >
            All
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.slug}
              onClick={() => setFilter('category', cat.slug)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium border transition-all',
                activeCategory === cat.slug
                  ? 'bg-alien-green text-space-900 border-alien-green'
                  : 'bg-transparent text-muted border-muted/20 hover:border-alien-green/40 hover:text-white'
              )}
            >
              {getLocalizedField(cat.name)}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted" />
          <select
            value={activeSort}
            onChange={(e) => setFilter('sort', e.target.value)}
            className="bg-space-800 border border-muted/20 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:border-alien-green/50"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {displayProducts.map((product: any) => {
          const color   = product.product_color ?? '#00FF88'
          const name    = getLocalizedField(product.name)
          const tagline = getLocalizedField(product.tagline)
          const image   = product.images?.find((i: any) => i.is_primary) ?? product.images?.[0]
          const variant = product.variants?.find((v: any) => v.is_default) ?? product.variants?.[0]
          const price   = variant?.price ?? product.base_price
          const compare = variant?.compare_at_price ?? product.compare_at_price
          const inStock = (variant?.stock ?? 0) > 0
          const savings = compare ? Math.round(((compare - price) / compare) * 100) : 0

          return (
            <div
              key={product.id}
              className="group bg-space-800 border border-muted/10 rounded-2xl overflow-hidden hover:border-opacity-30 transition-all duration-300"
            >
              {/* Color bar */}
              <div className="h-0.5 opacity-50" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

              {/* Badges */}
              <div className="relative">
                <Link href={`/products/${product.slug}`} className="block aspect-square relative overflow-hidden bg-space-900">
                  {image?.url ? (
                    <Image src={image.url} alt={name} fill className="object-contain p-4 sm:p-6 group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: color }} />
                    </div>
                  )}
                </Link>

                {/* Badges overlay */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.is_new && <span className="badge bg-alien-green/20 border border-alien-green/30 text-alien-green text-[9px]">New</span>}
                  {savings > 0 && <span className="badge text-[9px]" style={{ background: `${color}20`, border: `1px solid ${color}40`, color }}>−{savings}%</span>}
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4">
                {product.total_reviews > 0 && (
                  <div className="flex items-center gap-1 mb-1 sm:mb-1.5">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] sm:text-[11px] text-muted">{product.avg_rating.toFixed(1)} ({product.total_reviews})</span>
                  </div>
                )}
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-display text-base sm:text-lg tracking-wider text-white mb-0.5 sm:mb-1 line-clamp-2">{name}</h3>
                  <p className="text-[11px] sm:text-xs text-muted line-clamp-1 mb-2 sm:mb-3">{tagline}</p>
                </Link>
                <div className="flex items-end justify-between gap-1">
                  <div className="min-w-0">
                    <span className="text-sm sm:text-base font-bold text-white">{formatPrice(price)}</span>
                    {compare && <span className="hidden xs:inline ml-1 sm:ml-1.5 text-[10px] sm:text-xs text-muted/60 line-through">{formatPrice(compare)}</span>}
                  </div>
                  <button
                    onClick={() => variant && addItem(variant.id)}
                    disabled={!inStock || isLoading || !variant}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    style={inStock ? { backgroundColor: color } : { backgroundColor: 'rgba(119,119,170,0.2)' }}
                    aria-label={`Add ${name} to cart`}
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-space-900" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {displayProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted text-lg">No products found.</p>
          <button onClick={() => setFilter('category', null)} className="btn-outline mt-4">Clear filters</button>
        </div>
      )}
    </div>
  )
}
