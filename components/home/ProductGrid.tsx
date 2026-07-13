'use client'
// components/home/ProductGrid.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag, Zap } from 'lucide-react'
import { formatPrice } from '@/lib/utils/pricing'
import { getLocalizedField } from '@/types'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: Record<string, string>
  slug: string
  tagline: Record<string, string>
  product_color: string | null
  color_name: string | null
  base_price: number
  compare_at_price: number | null
  avg_rating: number
  total_reviews: number
  is_new: boolean
  is_best_seller: boolean
  images: { url: string; is_primary: boolean; sort_order: number }[]
  variants: { id: string; price: number; compare_at_price: number | null; stock: number; is_default: boolean }[]
}

interface ProductGridProps {
  products: Product[]
}

function ProductCard({ product }: { product: Product }) {
  const { addItem, isLoading } = useCart()
  const color    = product.product_color ?? '#00FF88'
  const name     = getLocalizedField(product.name)
  const tagline  = getLocalizedField(product.tagline)
  const primary  = product.images?.find((i) => i.is_primary) ?? product.images?.[0]
  const secondary = product.images?.find((i) => !i.is_primary && i.sort_order === 2)
  const variant  = product.variants?.find((v) => v.is_default) ?? product.variants?.[0]
  const price    = variant?.price ?? product.base_price
  const compare  = variant?.compare_at_price ?? product.compare_at_price
  const inStock  = (variant?.stock ?? 0) > 0
  const savings  = compare ? Math.round(((compare - price) / compare) * 100) : 0

  return (
    <div
      className="card-glass overflow-hidden hover:shadow-card-hover transition-all duration-500 group relative flex flex-col h-full"
      style={{ '--product-color': color } as React.CSSProperties}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-70"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.is_new && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-nebula-400/15 border border-nebula-400/30 text-nebula-400 text-[10px] font-mono tracking-wider uppercase backdrop-blur-sm">
            New
          </span>
        )}
        {product.is_best_seller && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-nebula-600/15 border border-nebula-600/30 text-nebula-400 text-[10px] font-mono tracking-wider uppercase backdrop-blur-sm">
            Best Seller
          </span>
        )}
        {savings > 0 && (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider backdrop-blur-sm"
            style={{
              background: `${color}15`,
              border: `1px solid ${color}30`,
              color,
            }}
          >
            −{savings}%
          </span>
        )}
      </div>

      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-square bg-space-900/50 overflow-hidden shrink-0"
      >
        {primary?.url ? (
          <>
            {/* Primary product image - visible by default, hidden on hover */}
            <Image
              src={primary.url}
              alt={name}
              fill
              className={cn(
                "object-contain p-0 sm:p-2 md:p-3 scale-[1.24] sm:scale-[1.16] md:scale-110 transition-all duration-500",
                secondary?.url ? "group-hover:opacity-0 group-hover:scale-[1.16]" : "group-hover:scale-[1.3] sm:group-hover:scale-[1.22] md:group-hover:scale-[1.16]"
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
            {/* Secondary nutrition facts image - hidden by default, shown on hover */}
            {secondary?.url && (
              <Image
                src={secondary.url}
                alt={`${name} - Nutrition Facts`}
                fill
                className="object-contain p-1 sm:p-2 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            )}
          </>
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

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-display text-base sm:text-xl tracking-wider text-white group-hover:text-opacity-90 mb-0.5 sm:mb-1 transition-colors line-clamp-2">
              {name}
            </h3>
            <p className="text-[11px] sm:text-xs text-muted leading-relaxed line-clamp-1 sm:line-clamp-2 mb-2.5 sm:mb-4">
              {tagline}
            </p>
          </Link>
        </div>

        {/* Price + CTA stacked to prevent overlaps */}
        <div className="mt-auto pt-3 border-t border-white/[0.03] flex flex-col gap-2">
          <div className="flex items-baseline gap-1.5 flex-wrap min-h-[24px]">
            <span className="text-sm sm:text-base font-bold text-white">{formatPrice(price)}</span>
            {compare && (
              <span className="text-[10px] sm:text-xs text-muted/60 line-through">
                {formatPrice(compare)}
              </span>
            )}
          </div>

          <button
            onClick={() => variant && addItem(variant.id, 1, { product, variant })}
            disabled={!inStock || isLoading || !variant}
            className={cn(
              'w-full py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 font-mono text-[10px] sm:text-xs font-bold',
              inStock
                ? 'text-space-900 hover:shadow-lg active:scale-95'
                : 'bg-muted/20 text-muted cursor-not-allowed'
            )}
            style={inStock ? { backgroundColor: color, boxShadow: `0 4px 12px ${color}20` } : undefined}
            aria-label={inStock ? `Add ${name} to cart` : 'Out of stock'}
          >
            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductGrid({ products }: ProductGridProps) {
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
        <h2 className="font-display text-5xl md:text-6xl tracking-wider text-white mb-4">
          <span className="text-gradient-cosmic">STELLAR</span>
          <br />
          PRODUCTS
        </h2>
        <p className="text-muted max-w-xl mx-auto">
          Precision-engineered supplements. Each one designed for a specific mission.
          All of them built to take you beyond your limits.
        </p>
      </div>

      {/* Grid: Responsive grid showing up to 12 products */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {products.slice(0, 12).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View all */}
      <div className="text-center mt-10">
        <Link
          href="/products"
          className="btn-outline border-nebula-600/30 hover:border-nebula-400/50"
        >
          View All Products
        </Link>
      </div>
    </section>
  )
}
