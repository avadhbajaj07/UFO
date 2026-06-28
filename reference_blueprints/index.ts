import type { Database } from './database'

// ─── Database row shortcuts ────────────────────────────────────
export type Profile       = Database['public']['Tables']['profiles']['Row']
export type Address       = Database['public']['Tables']['addresses']['Row']
export type Product       = Database['public']['Tables']['products']['Row']
export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type Order         = Database['public']['Tables']['orders']['Row']
export type OrderItem     = Database['public']['Tables']['order_items']['Row']
export type Affiliate     = Database['public']['Tables']['affiliates']['Row']
export type Coupon        = Database['public']['Tables']['coupons']['Row']
export type Subscription  = Database['public']['Tables']['subscriptions']['Row']
export type Review        = Database['public']['Tables']['reviews']['Row']

// ─── Enriched types (with joins) ──────────────────────────────
export interface ProductWithDetails extends Product {
  variants: ProductVariant[]
  images: { id: string; url: string; alt: Record<string,string>; is_primary: boolean; sort_order: number }[]
  category: { id: string; name: Record<string,string>; slug: string } | null
  pricing_rules: { id: string; min_qty: number; max_qty: number | null; discount_type: string; discount_value: number }[]
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
  profile: Pick<Profile, 'id' | 'email' | 'full_name' | 'phone'> | null
}

export interface AffiliateWithProfile extends Affiliate {
  profile: Pick<Profile, 'id' | 'email' | 'full_name' | 'avatar_url'>
}

// ─── Cart ─────────────────────────────────────────────────────
export interface CartItem {
  id: string
  variant_id: string
  quantity: number
  variant: ProductVariant & { product: Product }
}

export interface Cart {
  id: string
  items: CartItem[]
  coupon: Coupon | null
  subtotal: number
  discount_amount: number
  shipping_amount: number
  tax_amount: number
  total: number
}

// ─── Checkout ─────────────────────────────────────────────────
export interface CheckoutPayload {
  cart_id: string
  shipping_address: AddressPayload
  billing_address?: AddressPayload
  coupon_code?: string
  gift_card_code?: string
  loyalty_points?: number
  subscription_plan_id?: string
  payment_method_id: string
  customer_note?: string
  locale?: string
}

export interface AddressPayload {
  full_name: string
  phone?: string
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

// ─── Pricing ──────────────────────────────────────────────────
export interface PriceBreakdown {
  subtotal: number
  discount_amount: number
  coupon_discount: number
  loyalty_discount: number
  gift_card_amount: number
  shipping_amount: number
  tax_amount: number
  total: number
  savings_pct: number
}

// ─── API responses ────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

// ─── Analytics ────────────────────────────────────────────────
export interface DashboardStats {
  revenue: { today: number; week: number; month: number; year: number }
  orders: { today: number; week: number; month: number; pending: number }
  customers: { total: number; new_this_month: number }
  affiliates: { total: number; pending_approval: number }
  inventory: { low_stock: number; out_of_stock: number }
  subscriptions: { active: number; mrr: number }
}

// ─── Affiliate ────────────────────────────────────────────────
export interface AffiliateStats {
  clicks: number
  orders: number
  conversion_rate: number
  total_revenue: number
  total_commission: number
  pending_commission: number
  balance: number
}

// ─── Email ────────────────────────────────────────────────────
export interface EmailPayload {
  to: string | string[]
  subject: string
  html: string
  from?: string
  reply_to?: string
}

// ─── POS ──────────────────────────────────────────────────────
export interface PosCartItem {
  variant_id: string
  product_name: string
  variant_name: string
  sku: string
  price: number
  quantity: number
  discount_amount: number
}

export interface PosTransactionPayload {
  session_id: string
  items: PosCartItem[]
  customer_id?: string
  customer_name?: string
  payment_method: 'cash' | 'card' | 'upi' | 'gift_card' | 'mixed'
  cash_given?: number
  coupon_code?: string
  gift_card_code?: string
  gift_card_amount?: number
}

// ─── Localization ─────────────────────────────────────────────
export type Locale = 'en' | 'hi' | 'de' | 'fr' | 'es'

export function getLocalizedField(
  field: Record<string, string> | null | undefined,
  locale: string,
  fallback = 'en'
): string {
  if (!field) return ''
  return field[locale] ?? field[fallback] ?? Object.values(field)[0] ?? ''
}
