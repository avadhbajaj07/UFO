import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PRODUCTS } from '@/lib/mock-data'
import type { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (variantId: string, qty?: number, itemData?: { product: any; variant: any }) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, qty: number) => Promise<void>
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: async (variantId, qty = 1, itemData) => {
        set({ isLoading: true })
        // Simulate minor async lag
        await new Promise((resolve) => setTimeout(resolve, 300))

        const items = [...get().items]
        const existingIdx = items.findIndex((i) => i.variant_id === variantId)

        if (existingIdx > -1) {
          items[existingIdx].quantity += qty
        } else {
          let foundProduct: any = itemData?.product
          let foundVariant: any = itemData?.variant

          if (!foundProduct || !foundVariant) {
            // Find the product and variant in mock data
            for (const product of PRODUCTS) {
              const variant = product.variants?.find((v) => v.id === variantId)
              if (variant) {
                foundProduct = product
                foundVariant = variant
                break
              }
            }
          }

          // Fallback to fetch from Supabase dynamically if still not resolved
          if (!foundProduct || !foundVariant) {
            try {
              const { createClient } = await import('@/lib/supabase/client')
              const supabase = createClient() as any
              
              const { data: vData } = await supabase
                .from('product_variants')
                .select('*')
                .eq('id', variantId)
                .maybeSingle()
              
              if (vData) {
                foundVariant = vData
                const { data: pData } = await supabase
                  .from('products')
                  .select(`
                    *,
                    images:product_images(*)
                  `)
                  .eq('id', vData.product_id)
                  .maybeSingle()
                
                if (pData) {
                  foundProduct = {
                    ...pData,
                    variants: [vData]
                  }
                }
              }
            } catch (err) {
              console.error('Failed to resolve product/variant from Supabase:', err)
            }
          }

          if (foundVariant && foundProduct) {
            items.push({
              id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              variant_id: variantId,
              quantity: qty,
              variant: {
                ...foundVariant,
                product: foundProduct,
              },
            })
          }
        }

        set({ items, isLoading: false, isOpen: true })
      },
      removeItem: async (itemId) => {
        set({ isLoading: true })
        await new Promise((resolve) => setTimeout(resolve, 150))
        set({
          items: get().items.filter((i) => i.id !== itemId),
          isLoading: false,
        })
      },
      updateQuantity: async (itemId, qty) => {
        if (qty <= 0) {
          await get().removeItem(itemId)
          return
        }
        set({ isLoading: true })
        await new Promise((resolve) => setTimeout(resolve, 150))
        set({
          items: get().items.map((i) => (i.id === itemId ? { ...i, quantity: qty } : i)),
          isLoading: false,
        })
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'ufolabz-cart-storage',
      skipHydration: true, // We will hydrate manually to avoid SSR mismatch
    }
  )
)

// Derived selector for navbar badge to avoid unnecessary re-renders
export const useCartCount = () => {
  const items = useCartStore((s) => s.items)
  return items.reduce((total, item) => total + item.quantity, 0)
}
