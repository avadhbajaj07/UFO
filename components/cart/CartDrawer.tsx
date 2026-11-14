'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight, Shield, Sparkles } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useTranslation, Link } from '@/lib/i18n'
import { SHIPPING_CONFIG } from '@/lib/config/pricing'
import { PREORDER_CONFIG } from '@/lib/config/preorder'
import { getLocalizedField } from '@/types'
import { getProductDisplayName } from '@/lib/products'
import { stripFlavorSuffix } from '@/lib/products/format'
import { cn } from '@/lib/utils'

export default function CartDrawer() {
  const { items, breakdown, isOpen, isLoading, closeCart, updateQuantity, removeItem } = useCart()
  const { t, locale, currency, formatPrice } = useTranslation()
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

  // Shipping threshold based on active currency/country: CH = CHF 75, Europe = €50
  const freeThreshold = currency === 'EUR' ? SHIPPING_CONFIG.eu.freeThreshold : SHIPPING_CONFIG.switzerland.freeThreshold
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
            <span className="font-semibold text-white">{t('cart.title')}</span>
            {items.length > 0 && (
              <span className="text-xs text-muted">({items.reduce((s, i) => s + i.quantity, 0)} {t('common.quantity').toLowerCase()})</span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-lg transition-all"
            aria-label={t('common.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pre-order notification */}
        <div className="px-5 py-2.5 bg-space-800/80 border-b border-muted/10 flex items-center justify-between text-[11px]">
          <span className="text-muted">{t('common.batch_badge')}</span>
          <span className="text-alien-green font-mono font-medium">{t('common.batch_ship_notice')}</span>
        </div>

        {/* Free shipping progress */}
        {remaining > 0 && items.length > 0 && (
          <div className="px-5 py-3 bg-alien-green/5 border-b border-alien-green/10">
            <p className="text-xs text-alien-green mb-2">
              {t('cart.free_shipping_progress', { amount: formatPrice(remaining, currency) })}
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
            <p className="text-xs text-alien-green">🚀 {t('cart.free_shipping_reached')}</p>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-alien-green/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-alien-green/50" />
              </div>
              <p className="text-muted mb-2">{t('cart.empty_title')}</p>
              <p className="text-xs text-muted/60 mb-6">{t('cart.empty_desc')}</p>
              <div className="flex flex-col gap-2.5 w-full max-w-xs">
                <Link
                  href="/build-your-stack"
                  onClick={closeCart}
                  className="btn-primary text-xs py-3 justify-center shadow-glow-green"
                >
                  {t('navbar.build_stack')} (Save 15%)
                </Link>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="btn-outline text-xs py-2.5 justify-center"
                >
                  {t('common.continue_shopping')}
                </Link>
              </div>
            </div>
          ) : (
            items.map((item) => {
              const variant = item.variant || ({} as any)
              const product = (item.variant?.product || (item as any).product || {}) as any
              const rawName = getLocalizedField(product.name, locale)
              const name = getProductDisplayName(product.slug, stripFlavorSuffix(rawName))
              const image = product.images?.[0]?.url || '/images/ufo-logo-new.png'
              const unitPrice = variant.price || product.base_price || 0

              return (
                <div
                  key={item.id}
                  className="flex gap-3 bg-space-850 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="relative w-16 h-16 rounded-lg bg-space-800 shrink-0 overflow-hidden">
                    <Image
                      src={image}
                      alt={name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={closeCart}
                      className="font-medium text-sm text-white hover:text-alien-green transition-colors line-clamp-1"
                    >
                      {name}
                    </Link>

                    {variant.name && variant.name !== 'Default' && (
                      <p className="text-xs text-muted/70">{variant.name}</p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm font-bold font-mono text-white">
                        {formatPrice(unitPrice * item.quantity, currency)}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-space-800">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={isLoading}
                            className="p-1 text-muted hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-medium text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isLoading}
                            className="p-1 text-muted hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={isLoading}
                          className="p-1 text-muted/50 hover:text-electric-red transition-colors"
                          aria-label={t('cart.remove_item')}
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
                {t('navbar.build_stack')} &rarr;
              </Link>
            </div>

            {/* Summary */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted">
                <span>{t('common.subtotal')}</span>
                <span>{formatPrice(breakdown.subtotal, currency)}</span>
              </div>
              {breakdown.coupon_discount > 0 && (
                <div className="flex justify-between text-alien-green font-semibold">
                  <span>Coupon</span>
                  <span>−{formatPrice(breakdown.coupon_discount, currency)}</span>
                </div>
              )}
              {breakdown.stack_discount > 0 && (
                <div className="flex justify-between text-alien-green font-semibold">
                  <span>{t('common.stack_discount')} ({breakdown.stack_discount_percent}%)</span>
                  <span>−{formatPrice(breakdown.stack_discount, currency)}</span>
                </div>
              )}
              {(breakdown as any).preorder_discount > 0 && (
                <div className="flex justify-between text-alien-green font-semibold">
                  <span>{t('common.launch_discount')}</span>
                  <span>−{formatPrice((breakdown as any).preorder_discount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>{t('common.shipping')}</span>
                <span>{breakdown.is_free_shipping ? t('common.free') : formatPrice(breakdown.shipping_amount, currency)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted/60">
                <span>{t('common.vat_included')}</span>
                <span>{formatPrice(breakdown.tax_amount, currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-white text-base pt-1.5 border-t border-muted/10">
                <span>{t('common.total')}</span>
                <span>{formatPrice(breakdown.total, currency)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full justify-center text-sm py-3.5 shadow-glow-green font-bold"
            >
              {t('cart.checkout_btn')} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="btn-ghost w-full justify-center text-xs py-2 text-muted hover:text-white"
            >
              {t('common.view_cart')}
            </Link>

            <div className="pt-1 text-[10px] text-gray-500 text-center flex items-center justify-center gap-1">
              <Shield className="w-3 h-3 text-alien-green shrink-0" />
              <span>100% Swiss Quality · </span>
              <Link href="/pages/pre-order" onClick={closeCart} className="text-alien-green hover:underline">
                {t('footer.preorder_policy')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
