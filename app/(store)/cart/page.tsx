'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, 
  Truck, CornerUpLeft, Lock, ArrowLeft 
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils/pricing'
import { getLocalizedField } from '@/types'
import { cn } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD } from '@/config/client'

export default function CartPage() {
  const { items, breakdown, isLoading, updateQuantity, removeItem } = useCart()
  const [isMounted, setIsMounted] = useState(false)

  // Rehydrate store and handle title on mount
  useEffect(() => {
    setIsMounted(true)
    document.title = 'Your Cart — UFO LABZ'
  }, [])

  // Premium loading scanner state matching UFO Labz theme
  if (!isMounted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-20">
        <div className="relative w-16 h-16 rounded-full border border-alien-green/20 flex items-center justify-center animate-spin-slow">
          <div className="absolute top-0 w-3 h-3 rounded-full bg-alien-green shadow-glow-green" />
        </div>
        <p className="text-xs text-muted/60 mt-4 tracking-widest font-mono uppercase animate-pulse">Initializing Cargo...</p>
      </div>
    )
  }

  const shippingProgress = Math.min(100, (breakdown.subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - breakdown.subtotal)

  return (
    <div className="relative pt-28 pb-20 min-h-screen">
      {/* Background Nebulas */}
      <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] rounded-full bg-nebula-900/20 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/10 w-[400px] h-[400px] rounded-full bg-alien-green/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto container-px">
        {/* Title Area */}
        <div className="mb-10 flex items-center justify-between border-b border-white/5 pb-6">
          <div>
            <span className="font-mono text-xs text-alien-green tracking-widest uppercase">System Check / Cargo</span>
            <h1 className="font-display text-4xl sm:text-5xl tracking-wider text-white mt-1">
              YOUR CARGO BAY
            </h1>
          </div>
          <Link 
            href="/products" 
            className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted hover:text-alien-green transition-colors uppercase group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Continue shopping
          </Link>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="card-glass p-12 md:p-20 text-center max-w-2xl mx-auto space-y-6 mt-10">
            <div className="w-20 h-20 rounded-full bg-alien-green/10 flex items-center justify-center mx-auto border border-alien-green/20 relative">
              <ShoppingBag className="w-9 h-9 text-alien-green animate-float" />
              <div className="absolute inset-0 rounded-full border border-alien-green/30 scale-110 animate-pulse-glow" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl tracking-wide uppercase text-white">Your Cargo Bay is Empty</h2>
              <p className="text-sm text-muted max-w-sm mx-auto">
                No performance enhancements loaded. Power up your training with Swiss-engineered formulas.
              </p>
            </div>
            <div className="pt-4">
              <Link href="/products" className="btn-primary shadow-glow-green text-sm px-8 py-3.5">
                Explore Supplements <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Main Cart Content */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Items List (Left Column) */}
            <div className="lg:col-span-7 space-y-4">
              {items.map((item) => {
                if (!item?.variant) return null
                const product = item.variant.product as any
                const name = getLocalizedField(product?.name)
                const color = product?.product_color ?? '#00FF88'
                
                const unitPrice = item.variant.price
                const comparePrice = item.variant.compare_at_price ?? product?.compare_at_price
                const hasSavings = comparePrice && comparePrice > unitPrice
                const savingsPct = hasSavings ? Math.round(((comparePrice - unitPrice) / comparePrice) * 100) : 0

                return (
                  <div 
                    key={item.id} 
                    className="card-glass overflow-hidden hover:border-white/10 transition-colors duration-300 flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 relative"
                  >
                    {/* Color Glow accent strip */}
                    <div 
                      className="absolute top-0 bottom-0 left-0 w-1" 
                      style={{ backgroundColor: color }} 
                    />

                    {/* Image Area */}
                    <Link href={`/products/${product?.slug}`} className="relative w-full sm:w-24 h-24 bg-space-950 border border-white/5 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 group">
                      {product?.images?.[0]?.url || product?.og_image_url ? (
                        <Image 
                          src={product.images?.[0]?.url || product.og_image_url} 
                          alt={name} 
                          fill 
                          className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full opacity-20" style={{ backgroundColor: color }} />
                      )}
                    </Link>

                    {/* Details Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link href={`/products/${product?.slug}`}>
                            <h3 className="font-bold text-base text-white hover:text-alien-green transition-colors truncate">{name}</h3>
                          </Link>
                          <p className="text-xs text-muted mt-1 uppercase font-mono tracking-wider">{item.variant.name}</p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-muted/50 hover:text-electric-red hover:bg-white/5 rounded-lg transition-all"
                          aria-label="Remove item"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                        {/* Quantity Adjuster */}
                        <div className="flex items-center gap-3 bg-space-950 border border-white/5 rounded-xl p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={isLoading || item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center text-muted hover:text-white hover:bg-white/5 rounded-lg transition-all disabled:opacity-30"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-mono font-semibold text-white w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isLoading}
                            className="w-7 h-7 flex items-center justify-center text-muted hover:text-white hover:bg-white/5 rounded-lg transition-all disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Pricing values */}
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {hasSavings && (
                              <span className="text-xs text-muted/50 line-through">
                                {formatPrice(comparePrice * item.quantity)}
                              </span>
                            )}
                            <span className="font-mono font-bold text-white text-base">
                              {formatPrice(unitPrice * item.quantity)}
                            </span>
                          </div>
                          {hasSavings && (
                            <span className="text-[10px] font-mono text-alien-green">
                              Save {savingsPct}% ({formatPrice((comparePrice - unitPrice) * item.quantity)})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Order Summary & Meta (Right Column) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Shipping Status Meter */}
              <div className="card-glass p-5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted uppercase font-mono tracking-wider">Swiss Cargo Transit</span>
                  {remaining > 0 ? (
                    <span className="text-alien-green font-bold">CHF {remaining.toFixed(2)} to Free Delivery</span>
                  ) : (
                    <span className="text-alien-green font-bold font-mono">🚀 FREE SHIPPING EARNED</span>
                  )}
                </div>
                <div className="h-1.5 bg-space-950 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div 
                    className="h-full bg-alien-green rounded-full transition-all duration-500 shadow-glow-green"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted/60 leading-relaxed">
                  We ship directly from our Swiss performance laboratory. Free priority delivery on orders exceeding CHF {FREE_SHIPPING_THRESHOLD}.-
                </p>
              </div>

              {/* Summary details */}
              <div className="card-glass p-6 space-y-6">
                <h2 className="font-display text-xl tracking-wider text-white pb-3 border-b border-white/5 uppercase">
                  ORDER BRIEFING
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span className="font-mono text-white font-semibold">{formatPrice(breakdown.subtotal)}</span>
                  </div>
                  {breakdown.discount_amount > 0 && (
                    <div className="flex justify-between text-alien-green">
                      <span>Formula Discounts</span>
                      <span className="font-mono font-semibold">−{formatPrice(breakdown.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted">
                    <span>Standard Shipping</span>
                    <span className="font-mono text-white font-semibold">
                      {breakdown.is_free_shipping ? 'FREE' : formatPrice(breakdown.shipping_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted/50 pt-1">
                    <span>Includes 8.1% Swiss VAT</span>
                    <span className="font-mono">{formatPrice(breakdown.tax_amount)}</span>
                  </div>

                  <div className="flex justify-between font-display text-white text-2xl pt-4 border-t border-white/5">
                    <span>TOTAL DUE</span>
                    <span className="text-glow-green text-alien-green font-mono">{formatPrice(breakdown.total)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link 
                    href="/checkout"
                    className="btn-primary w-full justify-center text-lg py-4 shadow-glow-green group"
                  >
                    PROCEED TO CHECKOUT
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Brand Commitments / Badges */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="card-glass p-3 flex flex-col items-center justify-center space-y-1.5">
                  <Lock className="w-4 h-4 text-alien-green" />
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white font-bold">Secure</span>
                  <span className="text-[8px] text-muted/60">SSL Encrypted</span>
                </div>
                <div className="card-glass p-3 flex flex-col items-center justify-center space-y-1.5">
                  <Truck className="w-4 h-4 text-alien-green" />
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white font-bold">Swiss Post</span>
                  <span className="text-[8px] text-muted/60">Priority Delivery</span>
                </div>
                <div className="card-glass p-3 flex flex-col items-center justify-center space-y-1.5">
                  <CornerUpLeft className="w-4 h-4 text-alien-green" />
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white font-bold">Returns</span>
                  <span className="text-[8px] text-muted/60">14-Day Guarantee</span>
                </div>
              </div>

              {/* Back to catalog on mobile */}
              <div className="block sm:hidden text-center">
                <Link href="/products" className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-white transition-colors uppercase">
                  <ArrowLeft className="w-4 h-4" />
                  Or browse more formulas
                </Link>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  )
}
