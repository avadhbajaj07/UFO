import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cart'
import { getPricedForQuantity } from '@/lib/utils/pricing'
import { SHIPPING_CONFIG, getCanonicalUnitPrice } from '@/lib/config/pricing'
import { calculateStackDiscount } from '@/lib/config/stack'
import { isExcludedPublicProductSlug } from '@/lib/products/catalog'

export function useCart() {
  const store = useCartStore()
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
    const basePrice = getCanonicalUnitPrice(product?.slug || '', 'CHF', item.variant.price || 0)
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

  // Stack volume discount (10% for 2 units, 15% for 3+ units)
  const stackCalc = calculateStackDiscount(stackItemsForCalc, 'CHF')

  const coupon_discount = 0
  const loyalty_discount = 0
  const gift_card_amount = 0

  const subtotalAfterStackDiscount = stackCalc.discountedSubtotal

  const is_free_shipping =
    subtotalAfterStackDiscount >= SHIPPING_CONFIG.switzerland.freeThreshold || subtotal === 0
  const shipping_amount =
    subtotal === 0 ? 0 : is_free_shipping ? 0 : SHIPPING_CONFIG.switzerland.standardFee

  const total = Math.max(
    0,
    subtotalAfterStackDiscount - coupon_discount - loyalty_discount - gift_card_amount + shipping_amount
  )
  const tax_amount = total * (8.1 / 108.1) // 8.1% VAT included in price

  const savings_pct =
    originalSubtotal > 0
      ? Math.round(((originalSubtotal - (subtotal - stackCalc.discountAmount)) / originalSubtotal) * 100)
      : 0

  const breakdown = {
    subtotal,
    stack_discount: stackCalc.discountAmount,
    stack_discount_percent: stackCalc.discountPercent,
    discount_amount: stackCalc.discountAmount + (originalSubtotal - subtotal),
    coupon_discount,
    loyalty_discount,
    gift_card_amount,
    shipping_amount,
    tax_amount,
    total,
    savings_pct,
    is_free_shipping,
    amount_until_free_shipping: stackCalc.amountUntilFreeShipping,
    free_shipping_threshold: stackCalc.freeShippingThreshold,
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
