'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Truck,
  CornerUpLeft,
  Lock,
  ArrowLeft,
  Shield,
  Sparkles,
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useTranslation, Link } from '@/lib/i18n'
import { getCanonicalUnitPrice, SHIPPING_CONFIG } from '@/lib/config/pricing'
import { PREORDER_CONFIG } from '@/lib/config/preorder'
import { getProductDisplayName } from '@/lib/products'
import { stripFlavorSuffix } from '@/lib/products/format'
import { getLocalizedField } from '@/types'
import { cn } from '@/lib/utils'

export default function CartPage() {
  const { items, breakdown, isLoading, updateQuantity, removeItem } = useCart()
  const { t, locale, currency, formatPrice } = useTranslation()
  const [isMounted, setIsMounted] = useState(false)

  // Rehydrate store and handle title on mount
  useEffect(() => {
    setIsMounted(true)
    document.title = `${t('cart.title')} — UFO LABZ`
  }, [t])

  // Premium loading scanner state matching UFO Labz theme
  if (!isMounted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-20">
        <div className="relative w-16 h-16 rounded-full border border-alien-green/20 flex items-center justify-center animate-spin-slow">
          <div className="absolute top-0 w-3 h-3 rounded-full bg-alien-green shadow-glow-green" />
        </div>
        <p className="text-xs text-muted/60 mt-4 tracking-widest font-mono uppercase animate-pulse">
          {t('common.loading')}
        </p>
      </div>
    )
  }

  const freeThreshold =
    currency === 'EUR' ? SHIPPING_CONFIG.eu.freeThreshold : SHIPPING_CONFIG.switzerland.freeThreshold
  const discountedSubtotal = Math.max(0, breakdown.subtotal - (breakdown.stack_discount || 0))
  const shippingProgress = Math.min(100, (discountedSubtotal / freeThreshold) * 100)
  const remaining = Math.max(0, freeThreshold - discountedSubtotal)

  const totalUnits = items.reduce((acc, i) => acc + i.quantity, 0)
  const localizedNudge =
    totalUnits === 0
      ? t('stack.subtitle')
      : totalUnits === 1
      ? t('stack.add_more_nudge', { count: 1, percent: 10 })
      : totalUnits === 2
      ? t('stack.add_more_nudge', { count: 1, percent: 15 })
      : t('stack.max_unlocked')

  return (
    <div className="relative pt-28 pb-20 min-h-screen">
      {/* Background Nebulas */}
      <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] rounded-full bg-nebula-900/20 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/10 w-[400px] h-[400px] rounded-full bg-alien-green/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto container-px">
        {/* Title Area */}
        <div className="mb-10 flex items-center justify-between border-b border-white/5 pb-6">
          <div>
            <span className="font-mono text-xs text-alien-green tracking-widest uppercase">
              {t('common.batch_badge')}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl tracking-wider text-white mt-1 uppercase">
              {t('cart.title')}
            </h1>
            <p className="text-xs text-muted mt-1 font-mono">
              {t('common.batch_ship_notice')}
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted hover:text-alien-green transition-colors uppercase group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t('common.continue_shopping')}
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
              <h2 className="font-display text-2xl tracking-wide uppercase text-white">
                {t('cart.empty_title')}
              </h2>
              <p className="text-sm text-muted max-w-sm mx-auto">
                {t('cart.empty_desc')}
              </p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/products" className="btn-primary shadow-glow-green text-sm px-8 py-3.5">
                {t('common.continue_shopping')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/build-your-stack" className="btn-outline text-sm px-6 py-3.5">
                {t('navbar.build_stack')} ({t('navbar.save_stack_badge')})
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
                const rawName = getLocalizedField(product?.name, locale)
                const name = getProductDisplayName(product?.slug, stripFlavorSuffix(rawName))
                const color = product?.product_color ?? '#00FF88'

                const canonicalUnitPrice = getCanonicalUnitPrice(
                  product?.slug || '',
                  currency,
                  item.variant.price
                )
                const unitPrice = canonicalUnitPrice
                const comparePrice = item.variant.compare_at_price ?? product?.compare_at_price
                const hasSavings = comparePrice && comparePrice > unitPrice
                const savingsPct = hasSavings
                  ? Math.round(((comparePrice - unitPrice) / comparePrice) * 100)
                  : 0

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
                    <Link
                      href={`/products/${product?.slug}`}
                      className="relative w-full sm:w-24 h-24 bg-space-950 border border-white/5 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 group"
                    >
                      {product?.images?.[0]?.url || product?.og_image_url ? (
                        <Image
                          src={product.images?.[0]?.url || product.og_image_url}
                          alt={name}
                          fill
                          className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full opacity-20"
                          style={{ backgroundColor: color }}
                        />
                      )}
                    </Link>

                    {/* Details Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link href={`/products/${product?.slug}`}>
                            <h3 className="font-bold text-base text-white hover:text-alien-green transition-colors truncate">
                              {name}
                            </h3>
                          </Link>
                          {item.variant?.name && item.variant.name !== 'Default' && (
                            <p className="text-xs text-muted/70 mt-0.5">{item.variant.name}</p>
                          )}
                          <span className="inline-block text-[10px] text-alien-green font-mono uppercase font-bold tracking-wider mt-1">
                            {t('common.batch_badge')}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-muted/50 hover:text-electric-red hover:bg-white/5 rounded-lg transition-all"
                          aria-label={t('cart.remove_item')}
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
                          <span className="text-xs font-mono font-semibold text-white w-6 text-center">
                            {item.quantity}
                          </span>
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
                                {formatPrice(comparePrice * item.quantity, currency)}
                              </span>
                            )}
                            <span className="font-mono font-bold text-white text-base">
                              {formatPrice(unitPrice * item.quantity, currency)}
                            </span>
                          </div>
                          {hasSavings && (
                            <span className="text-[10px] font-mono text-alien-green">
                              {t('common.save')} {savingsPct}% ({formatPrice((comparePrice - unitPrice) * item.quantity, currency)})
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
                  <span className="text-muted uppercase font-mono tracking-wider">
                    {currency === 'EUR' ? 'European Cargo Transit' : 'Swiss Cargo Transit'}
                  </span>
                  {remaining > 0 ? (
                    <span className="text-alien-green font-bold">
                      {t('cart.free_shipping_progress', { amount: formatPrice(remaining, currency) })}
                    </span>
                  ) : (
                    <span className="text-alien-green font-bold font-mono">
                      🚀 {t('cart.free_shipping_reached')}
                    </span>
                  )}
                </div>
                <div className="h-1.5 bg-space-950 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div
                    className="h-full bg-alien-green rounded-full transition-all duration-500 shadow-glow-green"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted/60 leading-relaxed">
                  {currency === 'EUR' ? t('products.free_eu_shipping') : t('products.free_swiss_shipping')}
                </p>
              </div>

              {/* Summary details */}
              <div className="card-glass p-6 space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <h2 className="font-display text-xl tracking-wider text-white uppercase">
                    {t('checkout.order_summary')}
                  </h2>
                  <span className="text-[10px] font-mono bg-alien-green/20 text-alien-green border border-alien-green/40 px-2 py-0.5 rounded-full font-bold uppercase">
                    {t('common.batch_badge')}
                  </span>
                </div>

                {/* Stack volume discount banner / nudge */}
                <div className="bg-space-950/80 border border-white/10 rounded-xl p-3 text-xs text-gray-300 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <Sparkles className="w-4 h-4 text-alien-green shrink-0" />
                    <span className="font-mono text-[11px] truncate">{localizedNudge}</span>
                  </div>
                  <Link
                    href="/build-your-stack"
                    className="text-alien-green font-bold text-[10px] hover:underline uppercase shrink-0 font-mono ml-2"
                  >
                    {t('navbar.build_stack')} &rarr;
                  </Link>
                </div>

                <div className="bg-space-950/80 border border-alien-green/20 rounded-xl p-3 text-xs text-gray-300 space-y-1">
                  <div className="text-alien-green font-bold flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>{t('common.batch_ship_notice')}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {currency === 'EUR' ? t('products.free_eu_shipping') : t('products.free_swiss_shipping')}
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>{t('common.subtotal')}</span>
                    <span className="font-mono text-white font-semibold">
                      {formatPrice(breakdown.subtotal, currency)}
                    </span>
                  </div>
                  {breakdown.coupon_discount > 0 && (
                    <div className="flex justify-between text-alien-green font-semibold">
                      <span>Coupon</span>
                      <span className="font-mono font-semibold">
                        −{formatPrice(breakdown.coupon_discount, currency)}
                      </span>
                    </div>
                  )}
                  {breakdown.stack_discount > 0 && (
                    <div className="flex justify-between text-alien-green font-semibold">
                      <span>
                        {t('common.stack_discount')} ({breakdown.stack_discount_percent}%)
                      </span>
                      <span className="font-mono">
                        −{formatPrice(breakdown.stack_discount, currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted">
                    <span>{t('common.shipping')}</span>
                    <span className="font-mono text-white font-semibold">
                      {breakdown.is_free_shipping
                        ? t('common.free')
                        : formatPrice(breakdown.shipping_amount, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted/50 pt-1">
                    <span>{t('common.vat_included')}</span>
                    <span className="font-mono">{formatPrice(breakdown.tax_amount, currency)}</span>
                  </div>

                  <div className="flex justify-between font-display text-white text-2xl pt-4 border-t border-white/5">
                    <span>{t('common.total')}</span>
                    <span className="text-glow-green text-alien-green font-mono">
                      {formatPrice(breakdown.total, currency)}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/checkout"
                    className="btn-primary w-full justify-center text-lg py-4 shadow-glow-green group font-bold tracking-wide uppercase"
                  >
                    {t('cart.checkout_btn')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Pre-order guarantee notice */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-muted">
                  <Shield className="w-4 h-4 text-alien-green shrink-0" />
                  <span>
                    100% {t('products.guarantees')} ·{' '}
                    <Link href="/pages/pre-order" className="text-alien-green hover:underline">
                      {t('footer.preorder_policy')}
                    </Link>
                  </span>
                </div>
              </div>

              {/* Brand Commitments / Badges */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="card-glass p-3 flex flex-col items-center justify-center space-y-1.5">
                  <Lock className="w-4 h-4 text-alien-green" />
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white font-bold">
                    Secure
                  </span>
                  <span className="text-[8px] text-muted/60">SSL Encrypted</span>
                </div>
                <div className="card-glass p-3 flex flex-col items-center justify-center space-y-1.5">
                  <Truck className="w-4 h-4 text-alien-green" />
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white font-bold">
                    {currency === 'EUR' ? 'Colissimo' : 'Swiss Post'}
                  </span>
                  <span className="text-[8px] text-muted/60">Priority Delivery</span>
                </div>
                <div className="card-glass p-3 flex flex-col items-center justify-center space-y-1.5">
                  <CornerUpLeft className="w-4 h-4 text-alien-green" />
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white font-bold">
                    Returns
                  </span>
                  <span className="text-[8px] text-muted/60">14-Day Guarantee</span>
                </div>
              </div>

              {/* Back to catalog on mobile */}
              <div className="block sm:hidden text-center">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-white transition-colors uppercase"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('common.continue_shopping')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
