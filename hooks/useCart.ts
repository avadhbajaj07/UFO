import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cart'
import { useCurrencyStore } from '@/store/currency'
import { getPricedForQuantity } from '@/lib/utils/pricing'
import { SHIPPING_CONFIG, getCanonicalUnitPrice, SupportedCurrency } from '@/lib/config/pricing'
import { calculateStackDiscount } from '@/lib/config/stack'
import { isExcludedPublicProductSlug } from '@/lib/products/catalog'

export function useCart(overrideCurrency?: SupportedCurrency) {
  const store = useCartStore()
  const storeCurrency = useCurrencyStore((s) => s.currency)
  const currency: SupportedCurrency = overrideCurrency || storeCurrency || 'CHF'
  const [isHydrated, setIsHydrated] = useState(false)

  // Rehydrate store on mount to prevent SSR mismatch
  useEffect(() => {
    useCartStore.persist.rehydrate()
    setIsHydrated(true)
  }, [])

  const items = isHydrated
    ? store.items.filter((item) => !isExcludedPublicProductSlug((item.variant as any)?.product?.slug || ''))
    : []

  let subtotal = 0
  let originalSubtotal = 0

  const stackItemsForCalc: Array<{ slug: string; quantity: number; unitPrice: number }> = []

  items.forEach((item) => {
    if (!item?.variant) return
    const product = (item.variant as any).product
    const basePrice = getCanonicalUnitPrice(product?.slug || '', currency, item.variant.price || 0)
    const price = basePrice

    subtotal += price * item.quantity

    const comparePrice = item.variant.compare_at_price ?? basePrice
    originalSubtotal += comparePrice * item.quantity

    stackItemsForCalc.push({
      slug: product?.slug || item.variant.sku || '',
      quantity: item.quantity,
      unitPrice: price,
    })
  })

  // 1. 25% Pre-Order Launch Offer
  const preorder_discount = Math.round(subtotal * 0.25 * 100) / 100

  // 2. Stack volume discount (10% for 2 units, 15% for 3+ units)
  const stackCalc = calculateStackDiscount(stackItemsForCalc, currency)

  const coupon_discount = 0
  const loyalty_discount = 0
  const gift_card_amount = 0

  const subtotalAfterDiscounts = Math.max(0, subtotal - preorder_discount - stackCalc.discountAmount)

  const isEu = currency === 'EUR'
  const freeThreshold = isEu ? SHIPPING_CONFIG.eu.freeThreshold : SHIPPING_CONFIG.switzerland.freeThreshold
  const standardFee = isEu ? SHIPPING_CONFIG.eu.defaultStandardFee : SHIPPING_CONFIG.switzerland.standardFee

  const is_free_shipping = subtotalAfterDiscounts >= freeThreshold || subtotal === 0
  const shipping_amount = subtotal === 0 ? 0 : is_free_shipping ? 0 : standardFee

  const total = Math.max(
    0,
    subtotalAfterDiscounts - coupon_discount - loyalty_discount - gift_card_amount + shipping_amount
  )
  const tax_amount = total * (8.1 / 108.1) // 8.1% VAT included in price

  const savings_pct =
    subtotal > 0
      ? Math.round(((preorder_discount + stackCalc.discountAmount) / subtotal) * 100)
      : 25

  const breakdown = {
    currency,
    subtotal,
    preorder_discount,
    stack_discount: stackCalc.discountAmount,
    stack_discount_percent: stackCalc.discountPercent,
    discount_amount: preorder_discount + stackCalc.discountAmount,
    coupon_discount,
    loyalty_discount,
    gift_card_amount,
    shipping_amount,
    tax_amount,
    total,
    savings_pct,
    is_free_shipping,
    amount_until_free_shipping: Math.max(0, Math.round((freeThreshold - subtotalAfterDiscounts) * 100) / 100),
    free_shipping_threshold: freeThreshold,
    total_units: stackCalc.totalUnits,
    nudge_message: stackCalc.nudgeMessage,
    active_tier: stackCalc.activeTier,
    next_tier: stackCalc.nextTier,
    units_to_next_tier: stackCalc.unitsToNextTier,
  }

  return {
    items,
    breakdown,
    isOpen: store.isOpen,
    isLoading: store.isLoading,
    openCart: store.openCart,
    closeCart: store.closeCart,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
  }
}
