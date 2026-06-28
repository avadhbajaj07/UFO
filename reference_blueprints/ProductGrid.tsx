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
  const primary  = product.images.find((i) => i.is_primary) ?? product.images[0]
  const variant  = product.variants.find((v) => v.is_default) ?? product.variants[0]
  const price    = variant?.price ?? product.base_price
  const compare  = variant?.compare_at_price ?? product.compare_at_price
  const inStock  = (variant?.stock ?? 0) > 0
  const savings  = compare ? Math.round(((compare - price) / compare) * 100) : 0

  return (
    <div
      className="group relative bg-space-800 border border-muted/10 rounded-2xl overflow-hidden hover:border-opacity-40 transition-all duration-500"
      style={{ '--product-color': color } as React.CSSProperties}
    >
      {/* Color accent top bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.is_new && (
          <span className="badge bg-alien-green/20 border border-alien-green/40 text-alien-green text-[10px]">New</span>
        )}
        {product.is_best_seller && (
          <span className="badge bg-cosmic-purple/20 border border-cosmic-purple/40 text-cosmic-purple text-[10px]">Best Seller</span>
        )}
        {savings > 0 && (
          <span className="badge text-[10px]" style={{ background: `${color}22`, border: `1px solid ${color}44`, color }}>
            −{savings}%
          </span>
        )}
      </div>

      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-space-900">
        {primary?.url ? (
          <Image
            src={primary.url}
            alt={name}
            fill
            className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-24 h-24 rounded-full opacity-30 animate-pulse"
              style={{ backgroundColor: color }}
            />
          </div>
        )}
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{ backgroundColor: color }}
        />
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        {product.total_reviews > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted">
              {product.avg_rating.toFixed(1)} ({product.total_reviews})
            </span>
          </div>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-xl tracking-wider text-white group-hover:text-opacity-90 mb-1 transition-colors">
            {name}
          </h3>
          <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4">{tagline}</p>
        </Link>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-white">{formatPrice(price)}</span>
            {compare && (
              <span className="ml-2 text-sm text-muted/60 line-through">{formatPrice(compare)}</span>
            )}
          </div>

          <button
            onClick={() => variant && addItem(variant.id)}
            disabled={!inStock || isLoading || !variant}
            className={cn(
              'p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center',
              inStock
                ? 'text-space-900 hover:shadow-lg active:scale-95'
                : 'bg-muted/20 text-muted cursor-not-allowed'
            )}
            style={inStock ? { backgroundColor: color, boxShadow: `0 0 0 0 ${color}40` } : undefined}
            aria-label={inStock ? `Add ${name} to cart` : 'Out of stock'}
          >
            {inStock ? (
              <ShoppingBag className="w-4 h-4" />
            ) : (
              <span className="text-xs px-1">Out</span>
            )}
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
          <Zap className="w-4 h-4 text-alien-green" />
          <span className="text-xs font-mono text-alien-green tracking-widest uppercase">The Collection</span>
        </div>
        <h2 className="font-display text-5xl md:text-6xl tracking-wider text-white mb-4">
          CHOOSE YOUR<br />
          <span className="text-alien-green">FORMULA</span>
        </h2>
        <p className="text-muted max-w-xl mx-auto">
          Five precision-engineered supplements. Each one designed for a specific mission.
          All of them built to take you beyond your limits.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View all */}
      <div className="text-center mt-10">
        <Link href="/products" className="btn-outline">
          View All Products
        </Link>
      </div>
    </section>
  )
}
