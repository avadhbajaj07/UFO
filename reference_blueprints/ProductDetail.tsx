'use client'
// components/product/ProductDetail.tsx
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingBag, Plus, Minus, ChevronDown, ChevronUp, Shield, FlaskConical } from 'lucide-react'
import { formatPrice, getPricedForQuantity } from '@/lib/utils/pricing'
import { getLocalizedField } from '@/types'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

interface Props {
  product: any
}

export default function ProductDetail({ product }: Props) {
  const { addItem, isLoading } = useCart()
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants?.find((v: any) => v.is_default)?.id ?? product.variants?.[0]?.id
  )
  const [quantity, setQuantity]           = useState(1)
  const [activeImage, setActiveImage]     = useState(0)
  const [openFaq, setOpenFaq]             = useState<string | null>(null)

  const color     = product.product_color ?? '#00FF88'
  const name      = getLocalizedField(product.name)
  const tagline   = getLocalizedField(product.tagline)
  const desc      = getLocalizedField(product.description)
  const shortDesc = getLocalizedField(product.short_description)

  const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId)
  const inStock = (selectedVariant?.stock ?? 0) > 0

  const pricingRules = (product.pricing_rules ?? []).filter((r: any) => r.is_active)
  const { price, savingsPct } = selectedVariant
    ? getPricedForQuantity(selectedVariant.price, quantity, pricingRules)
    : { price: 0, savingsPct: 0 }

  const images = product.images ?? []

  const handleAddToCart = async () => {
    if (!selectedVariant || !inStock) return
    for (let i = 0; i < quantity; i++) {
      await addItem(selectedVariant.id, 1)
    }
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto container-px py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ── Left: Images ───────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Main image */}
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-space-800 border border-muted/10"
              style={{ boxShadow: `0 0 60px ${color}10` }}
            >
              {images[activeImage]?.url ? (
                <Image
                  src={images[activeImage].url}
                  alt={name}
                  fill
                  className="object-contain p-10"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: color }} />
                </div>
              )}
              {/* Color accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
                style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {images.map((img: any, idx: number) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      'relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all',
                      idx === activeImage ? 'border-opacity-100' : 'border-transparent hover:border-opacity-50'
                    )}
                    style={{ borderColor: idx === activeImage ? color : 'transparent' }}
                  >
                    <Image src={img.url} alt={`${name} view ${idx + 1}`} fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Details ─────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.is_new && <span className="badge bg-alien-green/10 border border-alien-green/30 text-alien-green text-xs">New</span>}
              {product.is_best_seller && <span className="badge bg-cosmic-purple/10 border border-cosmic-purple/30 text-cosmic-purple text-xs">Best Seller</span>}
              {product.category && (
                <span className="badge text-xs" style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}>
                  {getLocalizedField((product.category as any).name)}
                </span>
              )}
            </div>

            {/* Name & tagline */}
            <div>
              <h1 className="font-display text-5xl md:text-6xl tracking-wider text-white leading-tight mb-2">
                {name}
              </h1>
              <p className="text-muted text-lg">{tagline}</p>
            </div>

            {/* Rating */}
            {product.total_reviews > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star
                      key={s}
                      className={cn('w-4 h-4', s <= Math.round(product.avg_rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted/30')}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted">{product.avg_rating?.toFixed(1)} ({product.total_reviews} reviews)</span>
              </div>
            )}

            {/* Variant selector */}
            {product.variants?.length > 1 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={cn(
                        'px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all',
                        v.id === selectedVariantId
                          ? 'text-space-900 font-bold'
                          : 'bg-transparent text-muted border-muted/20 hover:border-opacity-50',
                        v.stock === 0 && 'opacity-40 cursor-not-allowed'
                      )}
                      style={v.id === selectedVariantId
                        ? { backgroundColor: color, borderColor: color }
                        : {}
                      }
                      disabled={v.stock === 0}
                    >
                      {v.name}
                      {v.stock === 0 && ' (Out)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bulk pricing hint */}
            {pricingRules.length > 0 && (
              <div className="bg-space-800 border border-muted/10 rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Volume Discounts</p>
                <div className="space-y-1.5">
                  {pricingRules.map((rule: any) => (
                    <div key={rule.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted">{rule.name}</span>
                      <span style={{ color }}>Save {rule.discount_value}{rule.discount_type === 'percentage' ? '%' : ' CHF'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price + quantity + CTA */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-white">{formatPrice(price * quantity)}</span>
                {selectedVariant?.compare_at_price && (
                  <span className="text-xl text-muted/60 line-through">{formatPrice(selectedVariant.compare_at_price * quantity)}</span>
                )}
                {savingsPct > 0 && (
                  <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{ color, background: `${color}20` }}>
                    −{savingsPct}%
                  </span>
                )}
              </div>
              <p className="text-xs text-muted">VAT included · Free shipping on orders over CHF 99</p>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-space-800 rounded-xl border border-muted/10 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-muted hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    className="w-9 h-9 flex items-center justify-center text-muted hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || isLoading}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all duration-200 text-space-900',
                    inStock
                      ? 'hover:shadow-lg active:scale-[0.98]'
                      : 'bg-muted/20 text-muted cursor-not-allowed'
                  )}
                  style={inStock ? { backgroundColor: color, boxShadow: `0 0 0 0 ${color}40` } : undefined}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {isLoading ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap gap-4 pt-2 border-t border-muted/10">
              {[
                { icon: FlaskConical, text: 'Third-party tested' },
                { icon: Shield, text: 'Swiss manufactured' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-muted">
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                  {text}
                </div>
              ))}
            </div>

            {/* Description */}
            {desc && (
              <div className="border-t border-muted/10 pt-6">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted mb-3">About</h2>
                <p className="text-muted/90 leading-relaxed text-sm">{desc}</p>
              </div>
            )}

            {/* FAQs */}
            {product.faqs?.length > 0 && (
              <div className="border-t border-muted/10 pt-6">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted mb-3">FAQ</h2>
                <div className="space-y-2">
                  {product.faqs.map((faq: any) => {
                    const q = getLocalizedField(faq.question)
                    const a = getLocalizedField(faq.answer)
                    return (
                      <div key={faq.id} className="border border-muted/10 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                          className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-white hover:bg-white/3 transition-colors"
                        >
                          {q}
                          {openFaq === faq.id ? <ChevronUp className="w-4 h-4 text-muted flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted flex-shrink-0" />}
                        </button>
                        {openFaq === faq.id && (
                          <div className="px-4 pb-4 text-sm text-muted leading-relaxed border-t border-muted/10 pt-3">
                            {a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
