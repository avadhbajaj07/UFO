'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag, Search } from 'lucide-react'
import { useCurrency } from '@/hooks/useCurrency'
import { formatPrice } from '@/lib/utils/pricing'
import { getCanonicalUnitPrice, getPreorderLaunchPrice } from '@/lib/config/pricing'
import { PREORDER_CONFIG } from '@/lib/config/preorder'
import { getProductFlavors } from '@/lib/config/flavors'
import { getLocalizedField } from '@/types'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

interface Props {
  initialProducts: any[]
}

function SearchProductCard({
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
  const name = getLocalizedField(product.name)
  const tagline = getLocalizedField(product.tagline)

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

      {/* Image container without overlay badges */}
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
              sizes="(max-width: 640px) 50vw, 33vw"
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
          {product.total_reviews > 0 && (
            <div className="flex items-center gap-1 mb-1 sm:mb-1.5">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] sm:text-[11px] text-muted">
                {product.avg_rating.toFixed(1)} ({product.total_reviews})
              </span>
            </div>
          )}
          <Link href={`/products/${targetSlug}`}>
            <h3 className="font-display text-base sm:text-lg tracking-wider text-white mb-0.5 sm:mb-1 line-clamp-2 hover:text-alien-green transition-colors">
              {name}
            </h3>
            <p className="text-[11px] sm:text-xs text-muted line-clamp-1 mb-2 sm:mb-2.5">
              {tagline}
            </p>
          </Link>

          {/* Interactive Flavor Selector */}
          {/* Interactive Flavor / Format Selector */}
          {flavors.length > 0 && (
            <div className="my-2.5 space-y-1.5">
              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex justify-between items-center">
                <span>{product.slug.includes('magnesium') ? 'Format:' : 'Flavor:'}</span>
                <span className="font-bold text-white text-[11px]">
                  {product.slug.includes('magnesium')
                    ? '90 CAPS'
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
                        'flex items-center gap-1.5 py-1 px-2 rounded-xl border text-[10px] sm:text-[11px] font-mono transition-all text-left',
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
          <p className="text-[9px] text-muted/70 text-center font-mono">
            {PREORDER_CONFIG.estimatedShipDate}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SearchClient({ initialProducts }: Props) {
  const [query, setQuery] = useState('')
  const { addItem, isLoading } = useCart()

  // Filter products by query
  const filteredProducts = initialProducts.filter((product) => {
    const name = getLocalizedField(product.name)?.toLowerCase() || ''
    const tagline = getLocalizedField(product.tagline)?.toLowerCase() || ''
    const desc = getLocalizedField(product.short_description)?.toLowerCase() || ''
    const searchQuery = query.toLowerCase()

    return (
      name.includes(searchQuery) ||
      tagline.includes(searchQuery) ||
      desc.includes(searchQuery)
    )
  })

  return (
    <div className="max-w-7xl mx-auto container-px py-10">
      {/* Header */}
      <div className="mb-8 text-center max-w-xl mx-auto">
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-wider text-white mb-4 uppercase">
          Orbital Search
        </h1>
        <p className="text-muted text-sm sm:text-base mb-6">
          Scan the galaxy for high-performance Swiss formulations and stacks.
        </p>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted" />
          </div>
          <input
            type="text"
            placeholder="Search products by formula, flavor, or goal..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-space-900 border border-white/10 rounded-xl text-white placeholder-muted focus:outline-none focus:border-alien-green/50 focus:ring-1 focus:ring-alien-green/20 transition-all text-sm font-sans shadow-inner"
            autoFocus
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-mono text-muted">
          Showing {filteredProducts.length} formulations
          {query ? ` for "${query}"` : ''}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product: any) => (
          <SearchProductCard
            key={product.id}
            product={product}
            addItem={addItem}
            isLoading={isLoading}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted text-lg">No formulations matched your search.</p>
          <p className="text-xs text-muted/60 mt-1 font-mono">
            Try searching for &quot;Creatine&quot;, &quot;EAA&quot;, &quot;Pre-Workout&quot;, &quot;Collagen&quot; or &quot;Magnesium&quot;.
          </p>
        </div>
      )}
    </div>
  )
}
