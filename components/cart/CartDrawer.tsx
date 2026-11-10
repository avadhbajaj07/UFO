'use client'
// components/cart/CartDrawer.tsx
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight, Shield, Truck, Sparkles, Layers } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils/pricing'
import { getCanonicalUnitPrice, SHIPPING_CONFIG } from '@/lib/config/pricing'
import { PREORDER_CONFIG } from '@/lib/config/preorder'
import { getLocalizedField } from '@/types'
import { cn } from '@/lib/utils'

export default function CartDrawer() {
  const { items, breakdown, isOpen, isLoading, closeCart, updateQuantity, removeItem } = useCart()
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [closeCart])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const freeThreshold = SHIPPING_CONFIG.switzerland.freeThreshold
  const discountedSubtotal = Math.max(0, breakdown.subtotal - (breakdown.stack_discount || 0))
  const shippingProgress = Math.min(100, (discountedSubtotal / freeThreshold) * 100)
  const remaining = Math.max(0, freeThreshold - discountedSubtotal)

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={closeCart}
        className={cn(
          'fixed inset-0 z-50 bg-black/60 transition-all duration-300',
          isOpen ? 'opacity-100 backdrop-blur-sm pointer-events-auto' : 'opacity-0 pointer-events-none invisible'
        )}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          'fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-space-900 border-l border-muted/10 shadow-2xl flex flex-col transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-muted/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-alien-green" />
            <span className="font-semibold text-white">Pre-order Cart</span>
            {items.length > 0 && (
              <span className="text-xs text-muted">({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-lg transition-all"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pre-order notification */}
        <div className="px-5 py-2.5 bg-space-800/80 border-b border-muted/10 flex items-center justify-between text-[11px]">
          <span className="text-muted">Batch 01 Pre-order</span>
          <span className="text-alien-green font-mono font-medium">{PREORDER_CONFIG.estimatedShipDate}</span>
        </div>

        {/* Free shipping progress */}
        {remaining > 0 && items.length > 0 && (
          <div className="px-5 py-3 bg-alien-green/5 border-b border-alien-green/10">
            <p className="text-xs text-alien-green mb-2">
              Add {formatPrice(remaining)} more for free shipping
            </p>
            <div className="h-1 bg-space-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-alien-green rounded-full transition-all duration-500"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}
        {remaining === 0 && items.length > 0 && (
          <div className="px-5 py-3 bg-alien-green/5 border-b border-alien-green/10">
            <p className="text-xs text-alien-green">🚀 You qualify for free shipping!</p>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-alien-green/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-alien-green/50" />
              </div>
              <p className="text-muted mb-2">Your cart is empty</p>
              <p className="text-xs text-muted/60 mb-6">Build your custom stack or shop individual formulas</p>
              <div className="flex flex-col gap-2.5 w-full max-w-xs">
                <Link
                  href="/build-your-stack"
                  onClick={closeCart}
                  className="btn-primary text-xs py-3 justify-center shadow-glow-green"
                >
                  <Sparkles className="w-4 h-4" /> Build Your Stack (Save 15%)
                </Link>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="btn-ghost text-xs py-2 text-muted hover:text-white justify-center border border-white/5"
                >
                  Browse All Products <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            items.map((item) => {
              if (!item?.variant) return null
              const product = item.variant.product as any
              const name    = getLocalizedField(product?.name)
              const color   = product?.product_color ?? '#00FF88'

              return (
                <div key={item.id} className="flex gap-3">
                  {/* Image */}
                  <Link href={`/products/${product?.slug}`} onClick={closeCart}>
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-space-800 border border-muted/10 flex-shrink-0">
                      {product?.images?.[0]?.url || product?.og_image_url ? (
                        <Image 
                          src={product.images?.[0]?.url || product.og_image_url} 
                          alt={name} 
                          fill 
                          className="object-contain p-2" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full opacity-30" style={{ backgroundColor: color }} />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${product?.slug}`} onClick={closeCart}>
                      <p className="text-sm font-medium text-white truncate">{name}</p>
                    </Link>
                    <span className="inline-block text-[10px] text-alien-green font-mono uppercase font-bold mb-2">
                      PRE-ORDER ONLY
                    </span>

                    <div className="flex items-center justify-between">
                      {/* Qty controls */}
                      <div className="flex items-center gap-2 bg-space-800 rounded-lg border border-muted/10 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading}
                          className="w-6 h-6 flex items-center justify-center text-muted hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium text-white w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading}
                          className="w-6 h-6 flex items-center justify-center text-muted hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {formatPrice(
                            getCanonicalUnitPrice(product?.slug || '', 'CHF', item.variant.price) * item.quantity
                          )}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-muted/50 hover:text-electric-red transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-muted/10 px-5 py-4 space-y-3">
            {/* Stack tier discount nudge banner */}
            <div className="bg-space-800/90 border border-white/10 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span className="text-gray-300 font-mono text-[11px] flex items-center gap-1.5 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-alien-green shrink-0" />
                <span className="truncate">{breakdown.nudge_message}</span>
              </span>
              <Link
                href="/build-your-stack"
                onClick={closeCart}
                className="text-alien-green font-bold text-[10px] hover:underline uppercase shrink-0 font-mono ml-2"
              >
                Stack Page &rarr;
              </Link>
            </div>

            {/* Summary */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>{formatPrice(breakdown.subtotal)}</span>
              </div>
              {(breakdown as any).preorder_discount > 0 && (
                <div className="flex justify-between text-alien-green font-semibold">
                  <span>Pre-Order Launch Offer (25%)</span>
                  <span>−{formatPrice((breakdown as any).preorder_discount)}</span>
                </div>
              )}
              {breakdown.stack_discount > 0 && (
                <div className="flex justify-between text-alien-green font-semibold">
                  <span>Stack Volume Discount ({breakdown.stack_discount_percent}%)</span>
                  <span>−{formatPrice(breakdown.stack_discount)}</span>
                </div>
              )}
              {breakdown.coupon_discount > 0 && (
                <div className="flex justify-between text-alien-green">
                  <span>Coupon discount</span>
                  <span>−{formatPrice(breakdown.coupon_discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>Estimated Shipping</span>
                <span>{breakdown.is_free_shipping ? 'FREE' : formatPrice(breakdown.shipping_amount)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted/60">
                <span>VAT (incl.)</span>
                <span>{formatPrice(breakdown.tax_amount)}</span>
              </div>
              <div className="flex justify-between font-bold text-white text-base pt-1.5 border-t border-muted/10">
                <span>Estimated Total</span>
                <span>{formatPrice(breakdown.total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full justify-center text-sm py-3.5 shadow-glow-green font-bold"
            >
              Pre-order Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="btn-ghost w-full justify-center text-xs py-2 text-muted hover:text-white"
            >
              View Pre-order Cart
            </Link>

            <div className="pt-1 text-[10px] text-gray-500 text-center flex items-center justify-center gap-1">
              <Shield className="w-3 h-3 text-alien-green shrink-0" />
              <span>100% Refundable before dispatch · </span>
              <Link href="/pages/pre-order" onClick={closeCart} className="text-alien-green hover:underline">
                Pre-Order Policy
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
