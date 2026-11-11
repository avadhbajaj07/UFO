'use client'
// components/product/ProductsClient.tsx
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag, SlidersHorizontal, Layers } from 'lucide-react'
import { useCurrency } from '@/hooks/useCurrency'
import { formatPrice } from '@/lib/utils/pricing'
import { getCanonicalUnitPrice, getPreorderLaunchPrice } from '@/lib/config/pricing'
import { PREORDER_CONFIG } from '@/lib/config/preorder'
import { getProductFlavors } from '@/lib/config/flavors'
import { getLocalizedField } from '@/types'
import { stripFlavorSuffix, getProductFormat, getCleanTagline } from '@/lib/products/format'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'sort_order', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
]

interface Props {
  products: any[]
  categories: any[]
  activeCategory?: string
  activeSort?: string
  heading?: string
  intro?: string
}

function ProductLoopCard({
  product,
  addItem,
  isLoading,
}: {
  product: any
  addItem: any
  isLoading: boolean
}) {
  const { currency } = useCurrency()
  const { flavors } = getProductFlavors(product.slug)
  const [selectedFlavorSlug, setSelectedFlavorSlug] = useState<string>(
    flavors[0]?.slug ?? product.slug
  )

  const activeFlavor =
    flavors.find((f) => f.slug === selectedFlavorSlug) ?? flavors[0] ?? null

  const color = activeFlavor?.color ?? product.product_color ?? '#00FF88'
  const rawName = getLocalizedField(product.name)
  const name = stripFlavorSuffix(rawName)
  const tagline = getCleanTagline(product)
  const formatPill = getProductFormat(product)

  // Resolve active image from selected flavor or primary product image
  const image = activeFlavor?.imageUrl
    ? { url: activeFlavor.imageUrl }
    : product.images?.find((i: any) => i.is_primary) ?? product.images?.[0]

  const targetSlug = activeFlavor?.slug ?? product.slug
  const variant =
    product.variants?.find((v: any) => v.is_default) ?? product.variants?.[0]
  const canonicalPrice = getCanonicalUnitPrice(
    targetSlug,
    currency,
    variant?.price ?? product.base_price
  )
  const launchPrice = getPreorderLaunchPrice(targetSlug, currency, canonicalPrice)

  return (
    <div className="group bg-space-800 border border-muted/10 rounded-2xl overflow-hidden hover:border-alien-green/40 transition-all duration-300 flex flex-col h-full shadow-lg">
      {/* Color accent bar */}
      <div
        className="h-0.5 opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />

      {/* Image container (badges overlay removed cleanly as requested) */}
      <div className="relative">
        <Link
          href={`/products/${targetSlug}`}
          className="block aspect-square relative overflow-hidden bg-space-900"
        >
          {image?.url ? (
            <Image
              src={image.url}
              alt={name}
              fill
              className="object-contain p-2 sm:p-3 scale-[1.18] sm:scale-[1.14] md:scale-110 group-hover:scale-[1.24] transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-16 h-16 rounded-full opacity-20 animate-pulse"
                style={{ backgroundColor: color }}
              />
            </div>
          )}
        </Link>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          {/* Format / Size Pill + Rating Row */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-alien-green/40 bg-alien-green/10 text-alien-green font-mono text-[10px] font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-alien-green shrink-0" />
              <span>{formatPill}</span>
            </span>

            {product.total_reviews > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-[10px] sm:text-[11px] text-muted">
                  {product.avg_rating.toFixed(1)} ({product.total_reviews})
                </span>
              </div>
            )}
          </div>

          <Link href={`/products/${targetSlug}`}>
            <h3 className="font-display text-base sm:text-lg lg:text-xl tracking-wider text-white mb-0.5 sm:mb-1 line-clamp-2 hover:text-alien-green transition-colors">
              {name}
            </h3>
            <p className="text-[11px] sm:text-xs text-muted line-clamp-1 mb-2 sm:mb-2.5">
              {tagline}
            </p>
          </Link>

          {/* Interactive Flavor / Format Selector on Product Loop Card */}
          {flavors.length > 0 && (
            <div className="my-2.5 space-y-1.5">
              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex justify-between items-center">
                <span>{flavors.length > 1 ? 'Flavor:' : (product.slug.includes('magnesium') ? 'Format:' : 'Flavor:')}</span>
                <span className="font-bold text-white text-[11px]">
                  {product.slug.includes('magnesium')
                    ? formatPill.toUpperCase()
                    : activeFlavor?.flavorName?.toUpperCase() || 'NATURAL TASTE'}
                </span>
              </div>
              <div className={cn('grid gap-1.5', flavors.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}>
                {flavors.map((flv) => {
                  const isSelected = flv.slug === (activeFlavor?.slug ?? product.slug)
                  return (
                    <button
                      key={flv.slug}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setSelectedFlavorSlug(flv.slug)
                      }}
                      className={cn(
                        'flex items-center gap-1.5 py-1.5 px-2 rounded-xl border text-[10px] sm:text-[11px] font-mono transition-all text-left',
                        isSelected
                          ? 'bg-white/10 text-white font-bold border-alien-green shadow-sm'
                          : 'bg-space-950/60 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                      )}
                      style={isSelected ? { borderColor: flv.color } : {}}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
                        style={{ backgroundColor: flv.color }}
                      />
                      <span className="truncate">{flv.flavorName}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Price & Actions */}
        <div className="mt-auto pt-3 border-t border-white/[0.04] flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-1.5 flex-wrap min-h-[24px]">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold font-mono text-white">
                {formatPrice(launchPrice, currency)}
              </span>
              <span className="text-xs font-mono text-gray-500 line-through">
                {formatPrice(canonicalPrice, currency)}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-alien-green/20 border border-alien-green/40 text-alien-green">
              25% OFF LAUNCH
            </span>
          </div>

          <button
            onClick={() =>
              variant &&
              addItem(variant.id, 1, {
                product: { ...product, slug: targetSlug },
                variant: { ...variant, price: canonicalPrice },
              })
            }
            disabled={isLoading || !variant}
            className="w-full py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 font-mono text-[11px] sm:text-xs font-bold text-space-950 active:scale-95 bg-alien-green hover:bg-alien-green/90 shadow-glow-green"
            aria-label={`Pre-order ${name}`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-space-950" />
            <span>{PREORDER_CONFIG.actionButtonText}</span>
          </button>

          <Link
            href="/build-your-stack"
            className="w-full py-1.5 px-2.5 rounded-xl border border-alien-green/30 hover:border-alien-green/60 text-alien-green hover:bg-alien-green/10 text-center font-mono text-[10px] sm:text-[11px] font-semibold transition-all flex items-center justify-center gap-1"
          >
            <span>⚡ Add to Custom Stack (Save up to 15%)</span>
          </Link>
          <p className="text-[9px] text-muted/70 text-center font-mono">
            {PREORDER_CONFIG.estimatedShipDate}
          </p>
        </div>
      </div>
    </div>
  )
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
    const params = new URLSearchParams(
      typeof window !== 'undefined' ? window.location.search : ''
    )
    if (value) params.set(key, value)
    else params.delete(key)
    const pathname = activeCategory
      ? `/products/category/${activeCategory}`
      : '/products'
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const { addItem, isLoading } = useCart()

  // Deduplicate products by flavor family so customer sees 1 card per formulation with flavor selector
  const groupedProducts = useMemo(() => {
    const seenFamilies = new Set<string>()
    const result: any[] = []

    for (const p of displayProducts) {
      const { familyTitle, hasMultipleFlavors } = getProductFlavors(p.slug)
      if (hasMultipleFlavors && familyTitle) {
        if (!seenFamilies.has(familyTitle)) {
          seenFamilies.add(familyTitle)
          result.push(p)
        }
      } else {
        result.push(p)
      }
    }
    return result
  }, [displayProducts])

  return (
    <div className="max-w-7xl mx-auto container-px py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-wider text-white mb-2 uppercase">
          {heading}
        </h1>
        {intro && (
          <p className="text-muted text-sm sm:text-base max-w-3xl leading-relaxed mb-2">
            {intro}
          </p>
        )}
        <p className="text-muted text-xs sm:text-sm font-mono">
          {groupedProducts.length} formulations available for Pre-order
        </p>
      </div>

      {/* Build Your Stack Hero Banner */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-space-850 via-space-800 to-space-850 border border-alien-green/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-alien-green/20 border border-alien-green/40 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-alien-green" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-alien-green font-bold">
                Bundle Engine
              </span>
              <span className="text-[10px] bg-alien-green text-space-950 font-bold px-2 py-0.5 rounded-full font-mono">
                Save up to 15%
              </span>
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

      {/* Filters: Category pills horizontally scrollable on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <Link
            href="/products"
            className={cn(
              'px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold uppercase whitespace-nowrap border transition-all shrink-0',
              !activeCategory
                ? 'bg-alien-green text-space-900 border-alien-green shadow-glow-green'
                : 'bg-space-900 text-muted border-white/5 hover:border-alien-green/40 hover:text-white'
            )}
          >
            All Formulations
          </Link>
          {categories.map((cat: any) => (
            <Link
              key={cat.slug}
              href={`/products/category/${cat.slug}`}
              className={cn(
                'px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold uppercase whitespace-nowrap border transition-all shrink-0',
                activeCategory === cat.slug
                  ? 'bg-alien-green text-space-900 border-alien-green shadow-glow-green'
                  : 'bg-space-900 text-muted border-white/5 hover:border-alien-green/40 hover:text-white'
              )}
            >
              {getLocalizedField(cat.name)}
            </Link>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-muted shrink-0" />
          <select
            value={activeSort}
            onChange={(e) => setFilter('sort', e.target.value)}
            className="bg-space-800 border border-muted/20 text-xs sm:text-sm text-white rounded-xl px-3 py-2 focus:outline-none focus:border-alien-green/50 font-mono"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {groupedProducts.map((product: any) => (
          <ProductLoopCard
            key={product.id}
            product={product}
            addItem={addItem}
            isLoading={isLoading}
          />
        ))}
      </div>

      {groupedProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted text-lg">No formulations found.</p>
          <Link href="/products" className="btn-outline mt-4">
            Clear filters
          </Link>
        </div>
      )}
    </div>
  )
}
