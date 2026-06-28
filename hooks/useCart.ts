import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cart'
import { getPricedForQuantity } from '@/lib/utils/pricing'
import { FREE_SHIPPING_THRESHOLD } from '@/config/client'

export function useCart() {
  const store = useCartStore()
  const [isHydrated, setIsHydrated] = useState(false)

  // Rehydrate store on mount to prevent SSR mismatch
  useEffect(() => {
    useCartStore.persist.rehydrate()
    setIsHydrated(true)
  }, [])

  const items = isHydrated ? store.items : []

  let subtotal = 0
  let originalSubtotal = 0

  items.forEach((item) => {
    if (!item?.variant) return
    const product = (item.variant as any).product
    const pricingRules = product?.pricing_rules ?? []
    const basePrice = item.variant.price || 0
    const { price } = getPricedForQuantity(basePrice, item.quantity, pricingRules)

    subtotal += price * item.quantity

    const comparePrice = item.variant.compare_at_price ?? basePrice
    originalSubtotal += comparePrice * item.quantity
  })

  const coupon_discount = 0
  const loyalty_discount = 0
  const gift_card_amount = 0

  const is_free_shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0
  const shipping_amount = subtotal === 0 ? 0 : (is_free_shipping ? 0 : 9.00) // 9.00 CHF standard shipping

  const total = Math.max(0, subtotal - coupon_discount - loyalty_discount - gift_card_amount + shipping_amount)
  const tax_amount = total * (8.1 / 108.1) // 8.1% VAT included in price

  const savings_pct = originalSubtotal > 0 ? Math.round(((originalSubtotal - subtotal) / originalSubtotal) * 100) : 0

  const breakdown = {
    subtotal,
    discount_amount: originalSubtotal - subtotal,
    coupon_discount,
    loyalty_discount,
    gift_card_amount,
    shipping_amount,
    tax_amount,
    total,
    savings_pct,
    is_free_shipping,
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
