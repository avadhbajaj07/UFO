'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Shield,
  CheckCircle2,
  ChevronRight,
  Lock,
  Trash2,
  ArrowLeft,
  Plus,
  Minus,
  Truck,
  MapPin,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import {
  SupportedCurrency,
  formatCurrencyPrice,
  getCanonicalUnitPrice,
  calculateNutrifitPickupDiscount,
  calculateShippingFee,
  SHIPPING_CONFIG,
  NUTRIFIT_STORE_INFO,
} from '@/lib/config/pricing'
import { calculateStackDiscount, resolveBestDiscount } from '@/lib/config/stack'
import { PREORDER_CONFIG } from '@/lib/config/preorder'
import { getLocalizedField } from '@/types'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import ComingSoon from '@/components/ComingSoon'

const CANTONS = [
  'Aargau', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden', 'Basel-Landschaft',
  'Basel-Stadt', 'Bern', 'Fribourg', 'Geneva', 'Glarus', 'Graubünden', 'Jura',
  'Luzern', 'Neuchâtel', 'Nidwalden', 'Obwalden', 'Schaffhausen', 'Schwyz',
  'Solothurn', 'St. Gallen', 'Thurgau', 'Ticino', 'Uri', 'Valais', 'Vaud', 'Zug', 'Zurich'
]

const EU_COUNTRIES = [
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'AT', name: 'Austria' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PL', name: 'Poland' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'IE', name: 'Ireland' },
]

const STRIPE_PENDING_ORDER_KEY = 'ufolabz_pending_stripe_order'
// Set to false for live production launch
const COMING_SOON = false

export default function CheckoutPage() {
  if (COMING_SOON) {
    return <ComingSoon />
  }

  const { items, clearCart } = useCart()
  const { user } = useAuthStore()

  // Delivery method and currency
  const [deliveryMethod, setDeliveryMethod] = useState<'shipping_ch' | 'pickup_nutrifit' | 'shipping_eu'>('shipping_ch')
  const [manualCurrency, setManualCurrency] = useState<SupportedCurrency | null>(null)
  const [euCountry, setEuCountry] = useState('FR')

  // Auto-detect currency by destination unless manually overridden
  const currency: SupportedCurrency = useMemo(() => {
    if (manualCurrency) return manualCurrency
    if (deliveryMethod === 'shipping_eu') return 'EUR'
    return 'CHF'
  }, [manualCurrency, deliveryMethod])

  // Customer Contact States
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (user) {
      if (!email && user.email) setEmail(user.email)
      if (!fullName && user.full_name) setFullName(user.full_name)
    }
  }, [user])

  // Address States
  const [address, setAddress] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [canton, setCanton] = useState('Geneva')
  const [zip, setZip] = useState('')
  const [sameAsShipping, setSameAsShipping] = useState(true)

  // Billing Address
  const [billFullName, setBillFullName] = useState('')
  const [billAddress, setBillAddress] = useState('')
  const [billCity, setBillCity] = useState('')
  const [billCanton, setBillCanton] = useState('Zurich')
  const [billZip, setBillZip] = useState('')

  // Shipping & Payment Options
  const [shippingSpeed, setShippingSpeed] = useState<'standard' | 'priority'>('standard')
  const [carbonOffset, setCarbonOffset] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'twint' | 'card'>('twint')

  // Auto switch payment method if TWINT selected in EUR
  useEffect(() => {
    if (currency === 'EUR' && paymentMethod === 'twint') {
      setPaymentMethod('card')
    }
  }, [currency, paymentMethod])

  // Coupon
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')

  // UI state
  const [checkoutStep, setCheckoutStep] = useState<'info' | 'payment'>('info')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stripeError, setStripeError] = useState('')
  const [hasHandledStripeReturn, setHasHandledStripeReturn] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  // Canonical calculations
  const mappedItems = useMemo(() => {
    return items.map((item) => {
      const product = (item.variant as any)?.product
      const slug = product?.slug || ''
      const canonicalPrice = getCanonicalUnitPrice(slug, currency, item.variant?.price || 0)
      return {
        ...item,
        slug,
        name: getLocalizedField(product?.name) || 'UFO Supplement',
        variantName: item.variant?.name || '300g',
        sku: item.variant?.sku || 'N/A',
        canonicalPrice,
        lineTotal: Math.round(canonicalPrice * item.quantity * 100) / 100,
      }
    })
  }, [items, currency])

  const subtotal = useMemo(() => {
    return mappedItems.reduce((acc, i) => acc + i.lineTotal, 0)
  }, [mappedItems])

  // NutriFit Geneva Pickup BOGO 50% discount
  const nutrifitCalc = useMemo(() => {
    if (deliveryMethod !== 'pickup_nutrifit') {
      return { discountTotal: 0, lineDiscounts: [] }
    }
    return calculateNutrifitPickupDiscount(
      mappedItems.map((item) => ({
        variantId: item.variant_id,
        sku: item.sku,
        slug: item.slug,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.canonicalPrice,
      }))
    )
  }, [deliveryMethod, mappedItems])

  const nutrifitDiscount = nutrifitCalc.discountTotal

  // Stack Volume Tier Discount (2 items = 10%, 3+ items = 15%)
  const stackCalc = useMemo(() => {
    return calculateStackDiscount({
      items: mappedItems.map((item) => ({
        slug: item.slug,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.canonicalPrice,
      })),
      currency,
    })
  }, [mappedItems, currency])

  // Resolve best discount between NutriFit 50% pickup and Stack Volume discount (they do not stack)
  const discountResolution = useMemo(() => {
    return resolveBestDiscount({
      deliveryMethod: deliveryMethod === 'pickup_nutrifit' ? 'pickup_nutrifit' : 'shipping',
      nutrifitDiscount,
      stackDiscount: stackCalc.discountAmount,
    })
  }, [deliveryMethod, nutrifitDiscount, stackCalc.discountAmount])

  const primaryDiscount = discountResolution.appliedDiscount
  const discountedSubtotal = Math.max(0, subtotal - primaryDiscount)

  // Shipping Fee calculation (evaluated on discountedSubtotal)
  const shippingCost = useMemo(() => {
    if (deliveryMethod === 'pickup_nutrifit') return 0.0
    if (deliveryMethod === 'shipping_ch') {
      if (shippingSpeed === 'priority') return 15.0
      return discountedSubtotal >= SHIPPING_CONFIG.switzerland.freeThreshold ? 0.0 : SHIPPING_CONFIG.switzerland.standardFee
    }
    // EU shipping
    return calculateShippingFee({
      deliveryMethod: 'shipping',
      country: euCountry,
      subtotal: discountedSubtotal,
      currency,
    })
  }, [deliveryMethod, shippingSpeed, discountedSubtotal, euCountry, currency])

  const offsetCost = carbonOffset ? 1.5 : 0
  const finalDiscount = Math.min(discountedSubtotal, couponDiscount)
  const finalTotal = Math.max(
    0,
    Math.round((discountedSubtotal - finalDiscount + shippingCost + offsetCost) * 100) / 100
  )
  const taxAmount = Math.round(finalTotal * (8.1 / 108.1) * 100) / 100
  const loyaltyPoints = Math.round(finalTotal * 5)

  // Validate coupon codes
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError('')
    const code = couponCode.trim().toUpperCase()

    if (code === 'UFO99' || code === 'ALIEN99') {
      const discount = discountedSubtotal * 0.99
      setCouponDiscount(discount)
      setAppliedCoupon(`${code} (99% Off)`)
      setCouponCode('')
    } else if (code === 'ALIEN10') {
      const discount = discountedSubtotal * 0.1
      setCouponDiscount(discount)
      setAppliedCoupon('ALIEN10 (10% Off)')
      setCouponCode('')
    } else if (code === 'WELCOME10') {
      const discount = Math.min(10, discountedSubtotal)
      setCouponDiscount(discount)
      setAppliedCoupon(`WELCOME10 (${currency} 10.00 Off)`)
      setCouponCode('')
    } else {
      setCouponError('Invalid coupon code')
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
  }

  const buildOrderPayload = (orderId: string) => {
    const isPickup = deliveryMethod === 'pickup_nutrifit'
    const isEu = deliveryMethod === 'shipping_eu'

    return {
      orderNumber: orderId,
      profileId: user?.id || null,
      email,
      fullName,
      phone,
      currency,
      deliveryMethod: isPickup ? 'pickup_nutrifit' : 'shipping',
      country: isPickup ? 'CH' : isEu ? euCountry : 'CH',
      shippingAddress: {
        addressLine1: isPickup ? NUTRIFIT_STORE_INFO.address : address,
        addressLine2: isPickup ? 'NutriFit Store Pickup' : address2 || '',
        city: isPickup ? 'Genève' : city,
        zipCode: isPickup ? '1200' : zip,
        canton: isPickup ? 'Geneva' : isEu ? euCountry : canton,
      },
      billingAddress: sameAsShipping
        ? null
        : {
            fullName: billFullName,
            addressLine1: billAddress,
            city: billCity,
            zipCode: billZip,
            canton: billCanton,
          },
      shippingMethod: isPickup ? 'pickup_nutrifit' : shippingSpeed,
      paymentMethod,
      items: mappedItems.map((item) => ({
        productId: (item.variant as any)?.product?.id,
        variantId: item.variant_id,
        name: item.name,
        variantName: item.variantName,
        sku: item.sku,
        price: item.canonicalPrice,
        quantity: item.quantity,
      })),
      subtotal,
      discountAmount: primaryDiscount + couponDiscount,
      stackDiscountAmount: stackCalc.discountAmount,
      stackDiscountPercent: stackCalc.discountPercent,
      appliedDiscountType: discountResolution.appliedDiscountType,
      appliedDiscountNote: discountResolution.appliedDiscountNote,
      shippingAmount: shippingCost,
      total: finalTotal,
      carbonOffset,
      couponCode: appliedCoupon ? appliedCoupon.split(' ')[0] : null,
    }
  }

  const completeOrder = async (orderPayload: any, stripeSessionId?: string) => {
    try {
      const response = await fetch('/api/checkout/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderPayload,
          stripeSessionId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Unable to complete your pre-order.')
      }

      setOrderNumber(orderPayload.orderNumber)
      setOrderSuccess(true)
      clearCart()
    } catch (err: any) {
      console.error('[CHECKOUT COMPLETE ERROR]', err)
      throw err
    }
  }

  const handleStripeCheckout = async () => {
    setIsSubmitting(true)
    setStripeError('')

    try {
      const orderPrefix = currency === 'EUR' ? 'UFO-EU' : 'UFO-CH'
      const orderPayload = buildOrderPayload(`${orderPrefix}-${Math.floor(100000 + Math.random() * 900000)}`)
      localStorage.setItem(STRIPE_PENDING_ORDER_KEY, JSON.stringify(orderPayload))

      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Unable to start Stripe Checkout.')
      }

      window.location.href = data.url
    } catch (err: any) {
      localStorage.removeItem(STRIPE_PENDING_ORDER_KEY)
      setStripeError(err?.message || 'Unable to start Stripe Checkout.')
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const stripeStatus = params.get('stripe_status')
    const sessionId = params.get('session_id')

    if (stripeStatus === 'cancelled') {
      setStripeError('Payment was cancelled. Your pre-order cart is still ready.')
      window.history.replaceState({}, '', '/checkout')
      return
    }

    if (stripeStatus !== 'success' || !sessionId || hasHandledStripeReturn) {
      return
    }

    const finalizeStripeOrder = async () => {
      setHasHandledStripeReturn(true)
      setIsSubmitting(true)
      setStripeError('')

      try {
        const storedPayload = localStorage.getItem(STRIPE_PENDING_ORDER_KEY)
        if (!storedPayload) {
          throw new Error('We could not find the pending order details for this Stripe payment.')
        }

        const orderPayload = JSON.parse(storedPayload)
        await completeOrder(orderPayload, sessionId)
        localStorage.removeItem(STRIPE_PENDING_ORDER_KEY)
        window.history.replaceState({}, '', '/checkout')
      } catch (err: any) {
        setStripeError(err?.message || 'Unable to verify the Stripe payment.')
      } finally {
        setIsSubmitting(false)
      }
    }

    finalizeStripeOrder()
  }, [hasHandledStripeReturn])

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !fullName || !phone) return
    if (deliveryMethod !== 'pickup_nutrifit') {
      if (!address || !city || !zip) return
    }
    setCheckoutStep('payment')
  }

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleStripeCheckout()
  }

  // Success Screen
  if (orderSuccess) {
    return (
      <div className="pt-28 pb-20 min-h-screen">
        <div className="max-w-2xl mx-auto container-px text-center space-y-6">
          <div className="w-20 h-20 bg-alien-green/10 border-2 border-alien-green/40 rounded-full flex items-center justify-center mx-auto shadow-glow-green animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-alien-green" />
          </div>
          <div>
            <span className="font-mono text-xs text-alien-green tracking-widest uppercase">
              Batch 01 Pre-Order Confirmed
            </span>
            <h1 className="font-display text-4xl sm:text-5xl text-white mt-1">RESERVATION SECURED</h1>
            <p className="text-gray-400 text-sm mt-2">
              Order #{orderNumber} has been logged in UFO LABZ manufacturing queue.
            </p>
          </div>

          <div className="bg-space-900 border border-alien-green/20 rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs text-gray-400 font-mono uppercase">Estimated Dispatch</span>
              <span className="text-sm font-bold text-alien-green font-mono">{PREORDER_CONFIG.estimatedShipDate}</span>
            </div>
            {deliveryMethod === 'pickup_nutrifit' && (
              <div className="flex items-start justify-between pb-3 border-b border-white/5 text-xs">
                <span className="text-gray-400 font-mono uppercase">Pickup Store</span>
                <span className="text-right text-white font-medium">
                  {NUTRIFIT_STORE_INFO.name}
                  <br />
                  <span className="text-gray-400 text-[11px]">{NUTRIFIT_STORE_INFO.address}</span>
                </span>
              </div>
            )}
            <div className="text-xs text-gray-400 leading-relaxed">
              A detailed confirmation email has been dispatched to <strong className="text-white">{email}</strong>.
              You will receive real-time updates as your batch enters synthesis and packaging.
            </div>
          </div>

          <div className="pt-4">
            <Link href="/" className="btn-primary shadow-glow-green text-sm px-8 py-3.5">
              Return to UFO LABZ Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-20 min-h-screen relative">
      <div className="max-w-7xl mx-auto container-px">
        {/* Header with Currency Switcher */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-alien-green/20 border border-alien-green/50 text-alien-green font-mono text-[10px] font-bold uppercase tracking-wider">
                PRE-ORDER RESERVATION
              </span>
              <span className="text-xs text-gray-400 font-mono">Batch 01 Dispatch: {PREORDER_CONFIG.estimatedShipDate}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-white">SECURE PRE-ORDER CHECKOUT</h1>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-2 bg-space-900 border border-white/10 rounded-xl p-1 self-start md:self-auto">
            <span className="text-[11px] font-mono text-gray-400 px-2 uppercase">Currency:</span>
            <button
              type="button"
              onClick={() => setManualCurrency('CHF')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all',
                currency === 'CHF'
                  ? 'bg-alien-green text-space-950 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              CHF (Switzerland)
            </button>
            <button
              type="button"
              onClick={() => setManualCurrency('EUR')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all',
                currency === 'EUR'
                  ? 'bg-alien-green text-space-950 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              EUR (European Union)
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="card-glass p-12 text-center max-w-xl mx-auto space-y-4">
            <h2 className="font-display text-2xl text-white">Your pre-order cart is empty</h2>
            <p className="text-sm text-gray-400">Add alien-grade supplements to reserve your laboratory batch.</p>
            <Link href="/products" className="btn-primary inline-flex text-sm mt-2">
              Browse Formulas
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ─── LEFT COLUMN: CHECKOUT STEPS (7 cols) ─── */}
            <div className="lg:col-span-7 space-y-6">
              {checkoutStep === 'info' ? (
                <form onSubmit={handleSubmitInfo} className="space-y-6">
                  {/* Contact info */}
                  <div className="bg-space-900 border border-white/5 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase">
                      01. Athlete Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-gray-400 mb-1.5 block">Full Name</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="First and last name"
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-gray-400 mb-1.5 block">Email Address</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-mono text-gray-400 mb-1.5 block">Mobile Phone (for tracking SMS)</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+41 79 123 45 67"
                        className="input"
                      />
                    </div>
                  </div>

                  {/* Delivery destination selector */}
                  <div className="bg-space-900 border border-white/5 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase">
                      02. Select Delivery Mode
                    </h3>
                    <div className="space-y-3">
                      {/* Option A: Switzerland Home Delivery */}
                      <div
                        onClick={() => {
                          setDeliveryMethod('shipping_ch')
                          if (!manualCurrency) setManualCurrency('CHF')
                        }}
                        className={cn(
                          'border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all',
                          deliveryMethod === 'shipping_ch'
                            ? 'border-alien-green bg-white/5 shadow-sm'
                            : 'border-white/5 hover:border-white/10'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                            {deliveryMethod === 'shipping_ch' && <div className="w-2.5 h-2.5 rounded-full bg-alien-green" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white flex items-center gap-2">
                              <span>Switzerland Home Delivery</span>
                              <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-gray-300">CH</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              CHF 10 if under CHF 50 · Free shipping for orders CHF 50+
                            </div>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-alien-green">
                          {subtotal >= SHIPPING_CONFIG.switzerland.freeThreshold ? 'FREE' : 'CHF 10.00'}
                        </span>
                      </div>

                      {/* Option B: NutriFit Geneva Store Pickup (50% Off 2nd Unit!) */}
                      <div
                        onClick={() => {
                          setDeliveryMethod('pickup_nutrifit')
                          if (!manualCurrency) setManualCurrency('CHF')
                        }}
                        className={cn(
                          'border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all relative overflow-hidden',
                          deliveryMethod === 'pickup_nutrifit'
                            ? 'border-alien-green bg-alien-green/5 shadow-glow-green'
                            : 'border-white/5 hover:border-white/10'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                            {deliveryMethod === 'pickup_nutrifit' && <div className="w-2.5 h-2.5 rounded-full bg-alien-green" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white flex items-center gap-2">
                              <span>NutriFit Geneva Store Pickup</span>
                              <span className="text-[10px] font-mono bg-alien-green/30 text-alien-green px-1.5 py-0.5 rounded font-bold">
                                2nd UNIT 50% OFF
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-alien-green shrink-0" />
                              <span>{NUTRIFIT_STORE_INFO.address}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-alien-green block">FREE PICKUP</span>
                          {nutrifitDiscount > 0 && (
                            <span className="text-[10px] font-mono text-alien-green">
                              −{formatCurrencyPrice(nutrifitDiscount, currency)} saved
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Option C: EU Home Delivery */}
                      <div
                        onClick={() => {
                          setDeliveryMethod('shipping_eu')
                          if (!manualCurrency) setManualCurrency('EUR')
                        }}
                        className={cn(
                          'border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all',
                          deliveryMethod === 'shipping_eu'
                            ? 'border-alien-green bg-white/5 shadow-sm'
                            : 'border-white/5 hover:border-white/10'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                            {deliveryMethod === 'shipping_eu' && <div className="w-2.5 h-2.5 rounded-full bg-alien-green" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white flex items-center gap-2">
                              <span>European Union Home Delivery</span>
                              <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">EU</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              Free EU shipping from €60 · Tracked laboratory dispatch
                            </div>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-alien-green">
                          {subtotal >= SHIPPING_CONFIG.eu.freeThreshold ? 'FREE' : `€${SHIPPING_CONFIG.eu.defaultStandardFee.toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Address fields (only needed when home delivery is selected) */}
                  {deliveryMethod !== 'pickup_nutrifit' && (
                    <div className="bg-space-900 border border-white/5 rounded-2xl p-6 space-y-4">
                      <h3 className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase">
                        03. Shipping Address
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="text-xs font-mono text-gray-400 mb-1.5 block">Destination Country</label>
                          {deliveryMethod === 'shipping_eu' ? (
                            <select
                              value={euCountry}
                              onChange={(e) => setEuCountry(e.target.value)}
                              className="input focus:outline-none bg-space-950 text-white"
                            >
                              {EU_COUNTRIES.map((c) => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                              ))}
                            </select>
                          ) : (
                            <select className="input focus:outline-none bg-space-950 text-white" disabled>
                              <option value="CH">Switzerland (CH)</option>
                            </select>
                          )}
                        </div>
                        {deliveryMethod === 'shipping_ch' && (
                          <div>
                            <label className="text-xs font-mono text-gray-400 mb-1.5 block">Canton</label>
                            <select
                              value={canton}
                              onChange={(e) => setCanton(e.target.value)}
                              className="input focus:outline-none bg-space-950 text-white"
                            >
                              {CANTONS.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-mono text-gray-400 mb-1.5 block">Street Address</label>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Street name and house number"
                          className="input mb-2"
                        />
                        <input
                          type="text"
                          value={address2}
                          onChange={(e) => setAddress2(e.target.value)}
                          placeholder="Apartment, suite, unit (optional)"
                          className="input"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono text-gray-400 mb-1.5 block">City</label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                            className="input"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-gray-400 mb-1.5 block">Postal Code</label>
                          <input
                            type="text"
                            required
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            placeholder="Postal code"
                            className="input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Speed & Carbon options for Swiss delivery */}
                  {deliveryMethod === 'shipping_ch' && (
                    <div className="bg-space-900 border border-white/5 rounded-2xl p-6 space-y-4">
                      <h3 className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase">
                        04. Swiss Post Options
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                          onClick={() => setShippingSpeed('standard')}
                          className={cn(
                            'border-2 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all',
                            shippingSpeed === 'standard' ? 'border-alien-green bg-white/5' : 'border-white/5'
                          )}
                        >
                          <div>
                            <div className="font-bold text-xs text-white">PostPac Standard</div>
                            <div className="text-[11px] text-gray-400">Regular batch dispatch</div>
                          </div>
                          <span className="font-mono text-xs font-bold text-alien-green">
                            {subtotal >= SHIPPING_CONFIG.switzerland.freeThreshold ? 'FREE' : 'CHF 10.00'}
                          </span>
                        </div>
                        <div
                          onClick={() => setShippingSpeed('priority')}
                          className={cn(
                            'border-2 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all',
                            shippingSpeed === 'priority' ? 'border-alien-green bg-white/5' : 'border-white/5'
                          )}
                        >
                          <div>
                            <div className="font-bold text-xs text-white">PostPac Priority</div>
                            <div className="text-[11px] text-gray-400">Next-day courier on release</div>
                          </div>
                          <span className="font-mono text-xs font-bold text-alien-green">CHF 15.00</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl text-xs">
                        <input
                          type="checkbox"
                          id="carbon"
                          checked={carbonOffset}
                          onChange={(e) => setCarbonOffset(e.target.checked)}
                          className="w-4 h-4 rounded accent-alien-green cursor-pointer"
                        />
                        <label htmlFor="carbon" className="text-gray-300 cursor-pointer">
                          Add Carbon-Neutral Climate Offset (+ CHF 1.50)
                        </label>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full h-14 bg-alien-green text-space-950 font-bold rounded-xl shadow-glow-green text-base flex items-center justify-center gap-2 hover:shadow-2xl active:scale-98 transition-all"
                  >
                    <span>Continue to Payment Selection</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                // ─── STEP 2: PAYMENT METHOD ───
                <form onSubmit={handlePlaceOrderSubmit} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="font-display text-2xl text-white">SELECT PAYMENT METHOD</h2>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('info')}
                      className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Back to Address</span>
                    </button>
                  </div>

                  <div className="bg-space-900 border border-white/5 rounded-2xl p-6 space-y-4">
                    {/* TWINT option (Swiss Francs only) */}
                    {currency === 'CHF' ? (
                      <div
                        onClick={() => setPaymentMethod('twint')}
                        className={cn(
                          'border-2 rounded-xl p-4 flex flex-col gap-3 cursor-pointer transition-all',
                          paymentMethod === 'twint' ? 'border-alien-green bg-white/5' : 'border-white/5 hover:border-white/10'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                              {paymentMethod === 'twint' && <div className="w-2.5 h-2.5 rounded-full bg-alien-green" />}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-white">TWINT (Swiss QR / App)</div>
                              <div className="text-xs text-gray-400">Instant direct pre-order payment via Swiss TWINT</div>
                            </div>
                          </div>
                          <span className="text-xs font-bold bg-white text-blue-900 px-2 py-1 rounded">TWINT</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400">
                        Notice: TWINT is only available for Swiss Francs (CHF). You are checking out in EUR.
                      </div>
                    )}

                    {/* Credit / Debit Card (Stripe) */}
                    <div
                      onClick={() => setPaymentMethod('card')}
                      className={cn(
                        'border-2 rounded-xl p-4 flex flex-col gap-3 cursor-pointer transition-all',
                        paymentMethod === 'card' ? 'border-alien-green bg-white/5' : 'border-white/5 hover:border-white/10'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                            {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-alien-green" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white">Credit / Debit Card</div>
                            <div className="text-xs text-gray-400">Visa, Mastercard, American Express, Apple Pay, Google Pay</div>
                          </div>
                        </div>
                        <div className="flex gap-1 text-[9px] font-bold">
                          <span className="bg-white text-gray-900 px-1 rounded">VISA</span>
                          <span className="bg-white text-gray-900 px-1 rounded">MC</span>
                          <span className="bg-white text-gray-900 px-1 rounded">AMEX</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pre-Order Terms Checkbox */}
                  <div className="bg-space-900/60 border border-white/5 rounded-2xl p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="preorderTerms"
                        required
                        className="w-4 h-4 rounded accent-alien-green mt-0.5 cursor-pointer"
                      />
                      <label htmlFor="preorderTerms" className="text-xs text-gray-300 leading-relaxed cursor-pointer">
                        I understand this is a <strong>Pre-Order reservation (Batch 01)</strong>. My card or TWINT is charged at checkout to reserve laboratory formulation. I can cancel for a <strong>100% full refund at any time</strong> before batch dispatch by contacting support@ufolabz.com.
                      </label>
                    </div>
                  </div>

                  {stripeError && (
                    <div className="border border-red-500/30 bg-red-500/10 text-red-200 rounded-xl p-4 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{stripeError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-alien-green text-space-950 font-bold rounded-xl shadow-glow-green text-base flex items-center justify-center gap-2 hover:shadow-2xl active:scale-98 transition-all"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? 'Initiating Secure Reservation...'
                        : `Pre-order Now · ${formatCurrencyPrice(finalTotal, currency)}`}
                    </span>
                  </button>
                </form>
              )}
            </div>

            {/* ─── RIGHT COLUMN: PRE-ORDER SUMMARY (5 cols) ─── */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="bg-space-900 border border-white/5 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <h3 className="font-display text-xl text-white uppercase">PRE-ORDER SUMMARY</h3>
                  <span className="text-[10px] font-mono bg-alien-green/20 text-alien-green px-2 py-0.5 rounded font-bold uppercase">
                    BATCH 01
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3.5 max-h-64 overflow-y-auto no-scrollbar pr-1">
                  {mappedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-space-950 border border-white/5 rounded-xl overflow-hidden flex-shrink-0">
                          {((item.variant as any)?.product?.images?.[0]?.url || (item.variant as any)?.product?.og_image_url) && (
                            <Image
                              src={(item.variant as any)?.product?.images?.[0]?.url || (item.variant as any)?.product?.og_image_url}
                              alt={item.name}
                              fill
                              className="object-contain p-1"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white max-w-[170px] truncate">{item.name}</div>
                          <div className="text-[10px] text-gray-400">
                            Qty: {item.quantity} · <span className="text-alien-green">Pre-order</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-white">
                        {formatCurrencyPrice(item.lineTotal, currency)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Discount callout: Stack or NutriFit Geneva */}
                {discountResolution.appliedDiscountType === 'nutrifit_pickup' && primaryDiscount > 0 && (
                  <div className="bg-alien-green/10 border border-alien-green/30 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-alien-green font-bold">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>NutriFit Geneva 2nd Unit 50% Off:</span>
                    </div>
                    <span className="font-mono font-bold text-alien-green">
                      −{formatCurrencyPrice(primaryDiscount, currency)}
                    </span>
                  </div>
                )}

                {discountResolution.appliedDiscountType === 'stack_tier' && primaryDiscount > 0 && (
                  <div className="bg-alien-green/10 border border-alien-green/30 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-alien-green font-bold">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>Stack Volume Discount ({stackCalc.discountPercent}% Off):</span>
                    </div>
                    <span className="font-mono font-bold text-alien-green">
                      −{formatCurrencyPrice(primaryDiscount, currency)}
                    </span>
                  </div>
                )}

                {deliveryMethod === 'pickup_nutrifit' && discountResolution.appliedDiscountNote && (
                  <p className="text-[10px] text-gray-400 font-mono italic">
                    ℹ️ {discountResolution.appliedDiscountNote}
                  </p>
                )}

                {/* Coupon input */}
                <div className="pt-3 border-t border-white/5">
                  {appliedCoupon ? (
                    <div className="bg-alien-green/5 border border-alien-green/20 p-2.5 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-alien-green font-mono font-bold">{appliedCoupon}</span>
                      <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-white">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon code (e.g. ALIEN10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="input text-xs font-mono py-2"
                      />
                      <button type="submit" className="bg-white hover:bg-gray-100 text-space-950 font-bold px-3 rounded-xl text-xs">
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-[10px] text-red-400 font-mono mt-1">{couponError}</p>}
                </div>

                {/* Financial Summary */}
                <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatCurrencyPrice(subtotal, currency)}</span>
                  </div>

                  {discountResolution.appliedDiscountType === 'stack_tier' && primaryDiscount > 0 && (
                    <div className="flex justify-between text-alien-green font-semibold">
                      <span>Stack Volume Discount ({stackCalc.discountPercent}%)</span>
                      <span>−{formatCurrencyPrice(primaryDiscount, currency)}</span>
                    </div>
                  )}

                  {discountResolution.appliedDiscountType === 'nutrifit_pickup' && primaryDiscount > 0 && (
                    <div className="flex justify-between text-alien-green font-semibold">
                      <span>NutriFit Store Pickup Discount</span>
                      <span>−{formatCurrencyPrice(primaryDiscount, currency)}</span>
                    </div>
                  )}

                  {finalDiscount > 0 && (
                    <div className="flex justify-between text-alien-green font-semibold">
                      <span>Coupon Discount</span>
                      <span>−{formatCurrencyPrice(finalDiscount, currency)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-400">
                    <span>
                      {deliveryMethod === 'pickup_nutrifit' ? 'NutriFit Geneva Store Pickup' : 'Shipping'}
                    </span>
                    <span className={shippingCost === 0 ? 'text-alien-green font-bold' : ''}>
                      {shippingCost === 0 ? 'FREE' : formatCurrencyPrice(shippingCost, currency)}
                    </span>
                  </div>

                  {carbonOffset && (
                    <div className="flex justify-between text-gray-400">
                      <span>Carbon Offset</span>
                      <span>{formatCurrencyPrice(offsetCost, currency)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-500 text-[10px]">
                    <span>VAT (incl.)</span>
                    <span>{formatCurrencyPrice(taxAmount, currency)}</span>
                  </div>

                  <div className="flex justify-between font-bold text-white text-base pt-3 border-t border-white/5">
                    <span>TOTAL DUE TODAY</span>
                    <span className="text-xl text-alien-green font-mono">{formatCurrencyPrice(finalTotal, currency)}</span>
                  </div>
                </div>

                <div className="bg-space-950 border border-white/5 p-3 rounded-xl text-[10px] text-gray-400 flex items-center justify-between">
                  <span>Alien Points earned:</span>
                  <span className="font-mono font-bold text-alien-green">+{loyaltyPoints} pts</span>
                </div>
              </div>

              {/* Policy & Trust Guarantee */}
              <div className="bg-space-900/60 border border-white/5 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                  <Shield className="w-4 h-4 text-alien-green" />
                  <span>100% Risk-Free Pre-Order Guarantee</span>
                </div>
                <div className="space-y-2 text-xs text-gray-300">
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    • <strong>Full Refund Guarantee:</strong> Modify or cancel your pre-order anytime prior to dispatch with zero cancellation fees.
                  </p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    • <strong>Batch Dispatch:</strong> Expected late March 2027. Full tracking will be provided.
                  </p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    • <strong>NutriFit Geneva Collection:</strong> Present your confirmation email at NutriFit store counter when ready.
                  </p>
                </div>
                <Link href="/pages/pre-order" className="text-[11px] text-alien-green hover:underline inline-block font-mono">
                  Read complete Pre-Order Policy &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
