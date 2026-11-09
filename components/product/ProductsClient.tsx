'use client'
// components/product/ProductsClient.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag, SlidersHorizontal, Layers } from 'lucide-react'
import { formatPrice } from '@/lib/utils/pricing'
import { getCanonicalUnitPrice } from '@/lib/config/pricing'
import { PREORDER_CONFIG } from '@/lib/config/preorder'
import { getProductFlavors } from '@/lib/config/flavors'
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
  heading?:       string
  intro?:         string
}

export default function ProductsClient({
  products,
  categories,
  activeCategory,
  activeSort = 'sort_order',
  heading = 'THE COLLECTION',
  intro,
}: Props) {
  const router = useRouter()
  const [displayProducts, setDisplayProducts] = useState(products)

  useEffect(() => {
    setDisplayProducts(products)
  }, [products])

  const setFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    if (value) params.set(key, value)
    else params.delete(key)
    const pathname = activeCategory ? `/products/category/${activeCategory}` : '/products'
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const { addItem, isLoading } = useCart()

  return (
    <div className="max-w-7xl mx-auto container-px py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-5xl tracking-wider text-white mb-2">{heading}</h1>
        {intro && <p className="text-muted max-w-3xl leading-relaxed mb-2">{intro}</p>}
        <p className="text-muted">{products.length} products</p>
      </div>

      {/* Build Your Stack Hero Banner */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-space-850 via-space-800 to-space-850 border border-alien-green/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-alien-green/20 border border-alien-green/40 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-alien-green" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-alien-green font-bold">Bundle Engine</span>
              <span className="text-[10px] bg-alien-green text-space-950 font-bold px-2 py-0.5 rounded-full font-mono">Save up to 15%</span>
            </div>
            <p className="text-white text-xs sm:text-sm font-semibold mt-0.5">
              Build your custom stack — pick any 2 products for 10% off, 3+ for 15% off.
            </p>
          </div>
        </div>
        <Link
          href="/build-your-stack"
          className="whitespace-nowrap px-4 py-2 rounded-xl bg-alien-green text-space-950 font-mono text-xs font-bold hover:bg-alien-green/90 transition-transform active:scale-95 shadow-[0_0_20px_rgba(0,255,136,0.25)]"
        >
          Build Your Stack →
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 items-center justify-between">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/products"
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium border transition-all',
              !activeCategory
                ? 'bg-alien-green text-space-900 border-alien-green'
                : 'bg-transparent text-muted border-muted/20 hover:border-alien-green/40 hover:text-white'
            )}
          >
            All
          </Link>
          {categories.map((cat: any) => (
            <Link
              key={cat.slug}
              href={`/products/category/${cat.slug}`}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium border transition-all',
                activeCategory === cat.slug
                  ? 'bg-alien-green text-space-900 border-alien-green'
                  : 'bg-transparent text-muted border-muted/20 hover:border-alien-green/40 hover:text-white'
              )}
            >
              {getLocalizedField(cat.name)}
            </Link>
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
          const canonicalPrice = getCanonicalUnitPrice(product.slug, 'CHF', variant?.price ?? product.base_price)
          const price   = canonicalPrice
          const compare = variant?.compare_at_price ?? product.compare_at_price
          const savings = compare && compare > price ? Math.round(((compare - price) / compare) * 100) : 0
          const { hasMultipleFlavors, flavors } = getProductFlavors(product.slug)

          return (
            <div
              key={product.id}
              className="group bg-space-800 border border-muted/10 rounded-2xl overflow-hidden hover:border-opacity-30 transition-all duration-300 flex flex-col h-full"
            >
              {/* Color bar */}
              <div className="h-0.5 opacity-50" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

              {/* Badges */}
              <div className="relative">
                <Link href={`/products/${product.slug}`} className="block aspect-square relative overflow-hidden bg-space-900">
                  {image?.url ? (
                    <Image src={image.url} alt={name} fill className="object-contain p-0 sm:p-2 md:p-3 scale-[1.24] sm:scale-[1.16] md:scale-110 group-hover:scale-[1.3] sm:group-hover:scale-[1.22] md:group-hover:scale-[1.16] transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: color }} />
                    </div>
                  )}
                </Link>

                {/* Badges overlay */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className="badge bg-alien-green/20 border border-alien-green/50 text-alien-green text-[9px] font-mono font-bold uppercase">Pre-order</span>
                  <Link
                    href="/build-your-stack"
                    className="badge bg-space-900/90 border border-alien-green/40 text-alien-green text-[9px] font-mono hover:bg-alien-green hover:text-space-950 transition-colors"
                  >
                    Stack & Save 15%
                  </Link>
                  {product.is_new && <span className="badge bg-alien-green/20 border border-alien-green/30 text-alien-green text-[9px]">New</span>}
                  {savings > 0 && <span className="badge text-[9px]" style={{ background: `${color}20`, border: `1px solid ${color}40`, color }}>−{savings}%</span>}
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4 flex flex-col flex-grow">
                <div className="flex-grow">
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
                </div>
                <div className="mt-auto pt-3 border-t border-white/[0.03] flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-1.5 flex-wrap min-h-[24px]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm sm:text-base font-bold text-white">{formatPrice(price)}</span>
                      {compare && <span className="text-[10px] sm:text-xs text-muted/60 line-through">{formatPrice(compare)}</span>}
                    </div>

                    {hasMultipleFlavors && (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400">
                        <div className="flex items-center -space-x-1">
                          {flavors.map((flv) => (
                            <span
                              key={flv.slug}
                              className="w-2.5 h-2.5 rounded-full border border-space-950 inline-block shrink-0"
                              style={{ backgroundColor: flv.color }}
                              title={flv.flavorName}
                            />
                          ))}
                        </div>
                        <span>{flavors.length} Flavors</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      variant &&
                      addItem(variant.id, 1, {
                        product,
                        variant: { ...variant, price: canonicalPrice },
                      })
                    }
                    disabled={isLoading || !variant}
                    className="w-full py-2.5 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 font-mono text-[10px] sm:text-xs font-bold text-space-900 active:scale-95 shrink-0"
                    style={{ backgroundColor: color, boxShadow: `0 4px 12px ${color}30` }}
                    aria-label={`Pre-order ${name}`}
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-space-900" />
                    <span>{PREORDER_CONFIG.actionButtonText}</span>
                  </button>

                  <button
                    onClick={() =>
                      variant &&
                      addItem(variant.id, 1, {
                        product,
                        variant: { ...variant, price: canonicalPrice },
                        source: 'stack',
                      })
                    }
                    disabled={isLoading || !variant}
                    className="w-full py-1.5 px-2.5 rounded-lg border border-alien-green/30 hover:border-alien-green/60 text-alien-green hover:bg-alien-green/10 text-center font-mono text-[10px] font-semibold transition-all flex items-center justify-center gap-1"
                    aria-label={`Add ${name} to stack`}
                  >
                    <span>⚡ Add to Custom Stack</span>
                  </button>
                  <p className="text-[9px] text-muted/70 text-center font-mono">
                    {PREORDER_CONFIG.estimatedShipDate}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {displayProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted text-lg">No products found.</p>
          <Link href="/products" className="btn-outline mt-4">Clear filters</Link>
        </div>
      )}
    </div>
  )
}
