'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag, Search } from 'lucide-react'
import { formatPrice } from '@/lib/utils/pricing'
import { getLocalizedField } from '@/types'
import { useCart } from '@/hooks/useCart'

interface Props {
  initialProducts: any[]
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
        <h1 className="font-display text-4xl md:text-5xl tracking-wider text-white mb-4 uppercase">
          Orbital Search
        </h1>
        <p className="text-muted mb-6">
          Scan the galaxy for high-performance supplements and stacks.
        </p>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 h-5 text-muted" />
          </div>
          <input
            type="text"
            placeholder="Search products by name, formula, or tagline..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-space-900 border border-white/10 rounded-xl text-white placeholder-muted focus:outline-none focus:border-alien-green/50 focus:ring-1 focus:ring-alien-green/20 transition-all text-sm font-sans shadow-inner"
            autoFocus
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-12">
        {filteredProducts.map((product: any) => {
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
                    <Image
                      src={image.url}
                      alt={name}
                      fill
                      className="object-contain p-4 sm:p-6 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
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
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex items-baseline gap-1.5 flex-wrap min-h-[24px]">
                    <span className="text-sm sm:text-base font-bold text-white">{formatPrice(price)}</span>
                    {compare && <span className="text-[10px] sm:text-xs text-muted/60 line-through">{formatPrice(compare)}</span>}
                  </div>
                  <button
                    onClick={() => variant && addItem(variant.id, 1, { product, variant })}
                    disabled={!inStock || isLoading || !variant}
                    className="w-full py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 font-mono text-[10px] sm:text-xs font-bold text-space-900 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    style={inStock ? { backgroundColor: color, boxShadow: `0 4px 12px ${color}20` } : { backgroundColor: 'rgba(119,119,170,0.2)' }}
                    aria-label={`Add ${name} to cart`}
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-space-900" />
                    <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted text-lg">No products found matching &quot;{query}&quot;.</p>
        </div>
      )}
    </div>
  )
}
