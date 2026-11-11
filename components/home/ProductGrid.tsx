'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag, Zap } from 'lucide-react'
import { Product } from '@/types'
import { useCurrency } from '@/hooks/useCurrency'
import { formatPrice } from '@/lib/utils/pricing'
import { getCanonicalUnitPrice, getPreorderLaunchPrice } from '@/lib/config/pricing'
import { PREORDER_CONFIG } from '@/lib/config/preorder'
import { getProductFlavors } from '@/lib/config/flavors'
import { getLocalizedField } from '@/types'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

interface ProductGridProps {
  products: Product[]
}

function ProductCard({ product }: { product: any }) {
  const { addItem, isLoading } = useCart()
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

  // Resolve active canister image from selected flavor or primary image
  const primary = activeFlavor?.imageUrl
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
    <div
      className="card-glass overflow-hidden hover:shadow-card-hover transition-all duration-500 group relative flex flex-col h-full rounded-2xl border border-white/5 hover:border-alien-green/40"
      style={{ '--product-color': color } as React.CSSProperties}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-70"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />

      {/* Image Container (overlay badges removed cleanly as requested) */}
      <Link
        href={`/products/${targetSlug}`}
        className="block relative aspect-square bg-space-900/50 overflow-hidden shrink-0"
      >
        {primary?.url ? (
          <Image
            src={primary.url}
            alt={name}
            fill
            className="object-contain p-2 sm:p-3 scale-[1.18] sm:scale-[1.14] md:scale-110 group-hover:scale-[1.24] transition-all duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-full opacity-30 animate-pulse"
              style={{ backgroundColor: color }}
            />
          </div>
        )}
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: `${color}1A` }}
        />
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        {/* Top text content container */}
        <div className="flex-grow">
          {/* Rating */}
          {product.total_reviews > 0 && (
            <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-2.5 h-2.5 sm:w-3 sm:h-3',
                    i < Math.round(product.avg_rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-transparent text-muted/30'
                  )}
                />
              ))}
              <span className="text-[10px] sm:text-xs text-muted ml-1">
                ({product.total_reviews})
              </span>
            </div>
          )}

          <Link href={`/products/${targetSlug}`}>
            <h3 className="font-display text-base sm:text-lg lg:text-xl tracking-wider text-white group-hover:text-alien-green mb-0.5 sm:mb-1 transition-colors line-clamp-2">
              {name}
            </h3>
            <p className="text-[11px] sm:text-xs text-muted leading-relaxed line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-3">
              {tagline}
            </p>
          </Link>

          {/* Interactive Flavor / Format Selector on Product Card */}
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

        {/* Price + CTA stacked */}
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

export default function ProductGrid({ products }: ProductGridProps) {
  // Deduplicate products by flavor family so customer sees 1 card per formulation with flavor selector
  const groupedProducts = useMemo(() => {
    const seenFamilies = new Set<string>()
    const result: any[] = []

    for (const p of products) {
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
  }, [products])

  return (
    <section className="section max-w-7xl mx-auto container-px">
      {/* Section header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-nebula-400" />
          <span className="text-nebula-400 font-mono tracking-widest uppercase text-xs">
            The Collection
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-wider text-white mb-4 uppercase">
          <span className="text-gradient-cosmic">STELLAR</span>
          <br />
          FORMULATIONS
        </h2>
        <p className="text-muted text-sm sm:text-base max-w-xl mx-auto">
          Precision-engineered Swiss supplements. Each formula built for cellular impact
          and maximum physiological results.
        </p>
      </div>

      {/* Stack Banner */}
      <div className="mb-10 max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-space-850 via-space-800 to-space-850 border border-alien-green/25 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-alien-green/15 border border-alien-green/30 flex items-center justify-center shrink-0">
            <span className="text-alien-green font-mono font-bold text-sm">15%</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-alien-green font-bold">
                Bundle Engine
              </span>
              <span className="text-[10px] bg-alien-green text-space-950 font-bold px-2 py-0.5 rounded-full font-mono">
                Save 10% – 15%
              </span>
            </div>
            <p className="text-white text-xs sm:text-sm font-semibold mt-0.5">
              Build your custom stack — pick any 2 products for 10% off, 3+ for 15% off.
            </p>
          </div>
        </div>
        <Link
          href="/build-your-stack"
          className="whitespace-nowrap px-4 py-2 rounded-xl bg-alien-green text-space-950 font-mono text-xs font-bold hover:bg-alien-green/90 transition-transform active:scale-95 shadow-[0_0_20px_rgba(0,255,136,0.2)]"
        >
          Build Your Stack →
        </Link>
      </div>

      {/* Grid: Responsive grid showing all formulations cleanly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {groupedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View all */}
      <div className="text-center mt-12">
        <Link
          href="/products"
          className="btn-outline border-nebula-600/30 hover:border-nebula-400/50 text-xs sm:text-sm font-mono uppercase tracking-wider px-6 py-3"
        >
          View All Formulations
        </Link>
      </div>
    </section>
  )
}
