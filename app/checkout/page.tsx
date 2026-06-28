'use client'
// app/checkout/page.tsx
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Shield, CheckCircle2, ChevronRight, Lock, 
  HelpCircle, Trash2, ArrowLeft, Plus, Phone, AlertCircle
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils/pricing'
import { getLocalizedField } from '@/types'
import { cn } from '@/lib/utils'

// Swiss Cantons for dropdown
const CANTONS = [
  'Aargau', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden', 'Basel-Landschaft', 
  'Basel-Stadt', 'Bern', 'Fribourg', 'Geneva', 'Glarus', 'Graubünden', 'Jura', 
  'Luzern', 'Neuchâtel', 'Nidwalden', 'Obwalden', 'Schaffhausen', 'Schwyz', 
  'Solothurn', 'St. Gallen', 'Thurgau', 'Ticino', 'Uri', 'Valais', 'Vaud', 'Zug', 'Zurich'
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, breakdown, addItem, removeItem, updateQuantity, clearCart } = useCart()

  // States
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [canton, setCanton] = useState('Zurich')
  const [zip, setZip] = useState('')
  const [sameAsShipping, setSameAsShipping] = useState(true)
  
  // Billing Address
  const [billFullName, setBillFullName] = useState('')
  const [billAddress, setBillAddress] = useState('')
  const [billCity, setBillCity] = useState('')
  const [billCanton, setBillCanton] = useState('Zurich')
  const [billZip, setBillZip] = useState('')

  // Shipping & Payment Options
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'priority'>('standard')
  const [carbonOffset, setCarbonOffset] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'twint' | 'card' | 'invoice'>('twint')
  
  // Card Details
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  // Coupon
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')

  // UI state
  const [checkoutStep, setCheckoutStep] = useState<'info' | 'payment'>('info')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTwintModal, setShowTwintModal] = useState(false)
  const [twintTimer, setTwintTimer] = useState(60)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  // Countdown timer for reserved stock
  const [minutesLeft, setMinutesLeft] = useState(14)
  const [secondsLeft, setSecondsLeft] = useState(59)

  useEffect(() => {
    const timer = setInterval(() => {
      if (secondsLeft > 0) {
        setSecondsLeft(secondsLeft - 1)
      } else if (minutesLeft > 0) {
        setMinutesLeft(minutesLeft - 1)
        setSecondsLeft(59)
      } else {
        clearInterval(timer)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [minutesLeft, secondsLeft])

  // TWINT QR scan countdown simulation
  useEffect(() => {
    let timer: any
    if (showTwintModal && twintTimer > 0) {
      timer = setInterval(() => {
        setTwintTimer((t) => t - 1)
      }, 1000)
    } else if (twintTimer === 0) {
      handleCompletePurchase()
    }
    return () => clearInterval(timer)
  }, [showTwintModal, twintTimer])

  // Shipping rates calculations
  const shippingCost = shippingMethod === 'priority' 
    ? 15.00 
    : (breakdown.subtotal >= 99 ? 0 : 9.00)

  const offsetCost = carbonOffset ? 1.50 : 0
  const finalSubtotal = Math.max(0, breakdown.subtotal - couponDiscount)
  const finalTotal = finalSubtotal + shippingCost + offsetCost
  const taxAmount = finalTotal * (8.1 / 108.1) // 8.1% VAT included
  const loyaltyPoints = Math.round(finalTotal * 5)

  // Validate coupon codes
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError('')
    const code = couponCode.trim().toUpperCase()

    // 1. Check local storage for admin approved affiliate coupons
    const storedCouponsStr = localStorage.getItem('ufo_admin_coupons')
    if (storedCouponsStr) {
      const storedCoupons = JSON.parse(storedCouponsStr)
      const foundCoupon = storedCoupons.find((c: any) => c.code === code && c.status === 'APPROVED')
      if (foundCoupon) {
        const discountPct = foundCoupon.discountPct || 10
        const discount = breakdown.subtotal * (discountPct / 100)
        setCouponDiscount(discount)
        setAppliedCoupon(`${code} (${discountPct}% Affiliate Discount)`)
        setCouponCode('')
        return
      }
    }

    // 2. Fallback to standard coupons
    if (code === 'ALIEN10') {
      const discount = breakdown.subtotal * 0.10
      setCouponDiscount(discount)
      setAppliedCoupon('ALIEN10 (10% Off)')
      setCouponCode('')
    } else if (code === 'WELCOME500') {
      const discount = Math.min(5, breakdown.subtotal)
      setCouponDiscount(discount)
      setAppliedCoupon('WELCOME500 (CHF 5.00 Off)')
      setCouponCode('')
    } else if (code === 'FREESHIP') {
      setAppliedCoupon('FREESHIP (Free Standard Shipping)')
      setCouponCode('')
    } else {
      setCouponError('Invalid coupon code')
    }
  }

  // Clear Coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
  }

  // Pre-fill fields for easy demonstration
  const handlePrefill = () => {
    setEmail('shikha@ufolabz.ch')
    setFullName('Shikha Swiss')
    setPhone('+41 79 123 45 67')
    setAddress('Bahnhofstrasse 100')
    setCity('Zürich')
    setZip('8001')
    setCanton('Zurich')
  }

  const handleCompletePurchase = async () => {
    setIsSubmitting(true)
    
    // 1. Generate unique order ID
    const orderId = `UFO-CH-${Math.floor(100000 + Math.random() * 900000)}`

    // 2. Prepare order data for database and Resend
    const mappedItems = items.map((item) => ({
      productId: item.variant?.product_id || (item.variant as any).product?.id,
      variantId: item.variant?.id,
      name: getLocalizedField((item.variant as any).product?.name) || 'UFO Supplement',
      variantName: item.variant.name,
      sku: item.variant.sku,
      price: item.variant.price,
      quantity: item.quantity
    }))

    const orderPayload = {
      orderNumber: orderId,
      email,
      fullName,
      phone,
      shippingAddress: {
        addressLine1: address,
        addressLine2: address2 || '',
        city,
        zipCode: zip,
        canton,
      },
      billingAddress: sameAsShipping ? null : {
        fullName: billFullName,
        addressLine1: billAddress,
        city: billCity,
        zipCode: billZip,
        canton: billCanton,
      },
      shippingMethod,
      paymentMethod,
      items: mappedItems,
      subtotal: breakdown.subtotal,
      discountAmount: couponDiscount,
      shippingAmount: shippingCost,
      total: finalTotal,
      couponCode: appliedCoupon ? appliedCoupon.split(' ')[0] : null
    }

    try {
      const response = await fetch('/api/checkout/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('[CHECKOUT API ERROR] Failed to save order on server:', errorData)
      }
    } catch (err) {
      console.error('[CHECKOUT NETWORK ERROR] Failed to contact checkout complete route:', err)
    }

    setIsSubmitting(false)
    setShowTwintModal(false)

    // If affiliate coupon was applied, register affiliate commission locally (for frontend dashboard simulation)
    if (appliedCoupon) {
      const couponCodeUsed = appliedCoupon.split(' ')[0]
      const storedCouponsStr = localStorage.getItem('ufo_admin_coupons')
      if (storedCouponsStr) {
        const storedCoupons = JSON.parse(storedCouponsStr)
        const updatedCoupons = storedCoupons.map((c: any) => {
          if (c.code === couponCodeUsed) {
            const addedComm = breakdown.subtotal * (c.commissionPct / 100)
            return {
              ...c,
              salesCount: c.salesCount + 1,
              totalRevenue: c.totalRevenue + breakdown.subtotal,
              totalCommission: c.totalCommission + addedComm
            }
          }
          return c
        })
        localStorage.setItem('ufo_admin_coupons', JSON.stringify(updatedCoupons))

        // Also update local wallet/commission display for the dashboard simulation
        const matchedCoup = storedCoupons.find((c: any) => c.code === couponCodeUsed)
        if (matchedCoup) {
          const addedComm = breakdown.subtotal * (matchedCoup.commissionPct / 100)
          const storedCommStr = localStorage.getItem('ufo_affiliate_commissions')
          const currentComm = storedCommStr ? JSON.parse(storedCommStr) : []
          currentComm.unshift({
            id: orderId,
            name: matchedCoup.affiliateName,
            sale: breakdown.subtotal,
            comm: addedComm,
            status: 'APPROVED'
          })
          localStorage.setItem('ufo_affiliate_commissions', JSON.stringify(currentComm))

          // Add to wallet balance in localStorage too
          const currentBal = parseFloat(localStorage.getItem('ufo_affiliate_balance') || '850.00')
          localStorage.setItem('ufo_affiliate_balance', (currentBal + addedComm).toString())
        }
      }
    }

    setOrderNumber(orderId)
    setOrderSuccess(true)
    clearCart()
  }

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple verification
    if (!email || !fullName || !phone || !address || !city || !zip) return
    setCheckoutStep('payment')
  }

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (paymentMethod === 'twint') {
      setTwintTimer(10) // Simulate automatic scan success in 10 seconds
      setShowTwintModal(true)
    } else {
      handleCompletePurchase()
    }
  }

  // If order is completed successfully, render thank you screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-space-950 text-white flex items-center justify-center py-20 px-4">
        <div className="max-w-xl w-full bg-space-900 border border-white/5 p-8 rounded-3xl text-center space-y-6 shadow-glow-green relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-3xl">
            <div className="w-80 h-80 rounded-full bg-alien-green/5 blur-3xl" />
          </div>

          <div className="w-20 h-20 bg-alien-green/10 border border-alien-green/20 rounded-full flex items-center justify-center mx-auto text-4xl">
            🛸
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-4xl tracking-wider text-white">ORDER CONFIRMED</h1>
            <p className="text-sm font-mono text-alien-green">Order ID: {orderNumber}</p>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
            Your flight parameters have been locked. A secure transmission carrying your invoice and PostPac real-time tracking details has been sent to <strong className="text-white">{email || 'your email'}</strong>.
          </p>

          <div className="bg-space-950 border border-white/5 rounded-2xl p-4 text-xs space-y-2 text-left max-w-sm mx-auto">
            <div className="flex justify-between text-gray-400">
              <span>Delivery Method:</span>
              <span className="text-white font-bold">{shippingMethod === 'priority' ? 'PostPac Priority' : 'PostPac Standard'}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Estimated Delivery:</span>
              <span className="text-white font-bold">{shippingMethod === 'priority' ? 'Monday, June 29' : 'Tuesday, June 30'}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Loyalty Points Added:</span>
              <span className="text-alien-green font-bold">+{loyaltyPoints} Alien Points</span>
            </div>
          </div>

          <div className="pt-4">
            <Link href="/" className="btn-primary px-8 py-3 bg-alien-green text-space-950 font-bold rounded-xl shadow-glow-green">
              Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-space-950 text-white selection:bg-alien-green selection:text-space-950 pb-20 font-sans">
      
      {/* ─── MINI CHECKOUT HEADER ─── */}
      <header className="border-b border-white/5 bg-space-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-alien-green/20 border border-alien-green/40 flex items-center justify-center">
              <span className="text-alien-green text-xs font-bold font-mono">U</span>
            </div>
            <span className="font-display text-xl tracking-wider text-white">UFO LABZ</span>
          </Link>
          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-mono text-gray-400">
            <span className={cn(checkoutStep === 'info' ? "text-alien-green font-bold" : "text-white/60")}>01. Shipping</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={cn(checkoutStep === 'payment' ? "text-alien-green font-bold" : "text-white/60")}>02. Payment</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/20">03. Confirmation</span>
          </div>
        </div>
      </header>

      {/* ─── DYNAMIC STOCK RESERVATION TIMER ─── */}
      <div className="bg-alien-green/10 border-b border-alien-green/10 text-alien-green text-center py-2 text-xs font-mono">
        ⌛ QUANTUM RESERVATION: Products reserved for <strong className="text-white">{minutesLeft}:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}</strong> minutes.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {items.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="text-5xl">🛸</div>
            <h2 className="text-2xl font-display uppercase">YOUR CARGO BAY IS EMPTY</h2>
            <p className="text-muted text-sm">Add supplements to your cart before proceeding to checkout.</p>
            <Link href="/products" className="btn-primary bg-alien-green text-space-950 font-bold px-6 py-2.5 rounded-xl">Shop Supplements</Link>
          </div>
        ) : (
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ─── LEFT COLUMN: SHIPPING & BILLING FORMS (width: 7 cols) ─── */}
            <div className="lg:col-span-7 space-y-6">
              
              {checkoutStep === 'info' ? (
                <form onSubmit={handleSubmitInfo} className="space-y-6">
                  {/* Step Header */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="font-display text-2xl tracking-wide uppercase text-white">SHIPPING PARAMETERS</h2>
                    <button 
                      type="button" 
                      onClick={handlePrefill}
                      className="text-xs font-mono text-alien-green hover:underline"
                    >
                      [Auto-Fill Demo Info]
                    </button>
                  </div>

                  {/* Customer parameters */}
                  <div className="bg-space-900 border border-white/5 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">01. Customer Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-gray-400 mb-1.5 block">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Shikha Swiss"
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-gray-400 mb-1.5 block">Email address</label>
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="shikha@ufolabz.ch"
                          className="input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-mono text-gray-400 mb-1.5 block">Phone Number</label>
                      <input 
                        type="text" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+41 79 123 45 67"
                        className="input"
                      />
                    </div>
                  </div>

                  {/* Shipping address details */}
                  <div className="bg-space-900 border border-white/5 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">02. Shipping Address</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-xs font-mono text-gray-400 mb-1.5 block">Country</label>
                        <select className="input focus:outline-none bg-space-950 text-white">
                          <option value="CH">Switzerland (CH)</option>
                          <option value="LI">Liechtenstein (LI)</option>
                        </select>
                      </div>
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
                    </div>

                    <div>
                      <label className="text-xs font-mono text-gray-400 mb-1.5 block">Street Address</label>
                      <input 
                        type="text" 
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street address, house number"
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
                          placeholder="Zürich"
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-gray-400 mb-1.5 block">ZIP Code</label>
                        <input 
                          type="text" 
                          required
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          placeholder="8001"
                          className="input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Billing address Same as Shipping */}
                  <div className="bg-space-900 border border-white/5 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="sameBilling"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="w-4 h-4 rounded accent-alien-green cursor-pointer"
                      />
                      <label htmlFor="sameBilling" className="text-sm text-gray-200 cursor-pointer font-medium">Billing address same as shipping</label>
                    </div>

                    {!sameAsShipping && (
                      <div className="space-y-4 pt-4 border-t border-white/5 animate-fade-in">
                        <h4 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">03. Billing Details</h4>
                        <div>
                          <label className="text-xs font-mono text-gray-400 mb-1.5 block">Billing Name</label>
                          <input 
                            type="text" 
                            value={billFullName} 
                            onChange={(e) => setBillFullName(e.target.value)}
                            placeholder="Billing entity full name" 
                            className="input" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-gray-400 mb-1.5 block">Billing Street Address</label>
                          <input 
                            type="text" 
                            value={billAddress}
                            onChange={(e) => setBillAddress(e.target.value)}
                            placeholder="Billing address" 
                            className="input" 
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <label className="text-xs font-mono text-gray-400 mb-1.5 block">City</label>
                            <input 
                              type="text" 
                              value={billCity}
                              onChange={(e) => setBillCity(e.target.value)}
                              placeholder="City" 
                              className="input" 
                            />
                          </div>
                          <div>
                            <label className="text-xs font-mono text-gray-400 mb-1.5 block">ZIP Code</label>
                            <input 
                              type="text" 
                              value={billZip}
                              onChange={(e) => setBillZip(e.target.value)}
                              placeholder="ZIP" 
                              className="input" 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Shipping speed select */}
                  <div className="bg-space-900 border border-white/5 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">04. Delivery Method</h3>
                    <div className="space-y-3">
                      {/* Standard */}
                      <div 
                        onClick={() => setShippingMethod('standard')}
                        className={cn(
                          "border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all",
                          shippingMethod === 'standard' ? "border-alien-green bg-white/5" : "border-white/5 hover:border-white/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                            {shippingMethod === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-alien-green" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white">PostPac Standard Delivery</div>
                            <div className="text-xs text-gray-400">Delivered within 2-3 business days</div>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold">
                          {breakdown.subtotal >= 99 ? 'FREE' : 'CHF 9.00'}
                        </span>
                      </div>

                      {/* Priority */}
                      <div 
                        onClick={() => setShippingMethod('priority')}
                        className={cn(
                          "border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all",
                          shippingMethod === 'priority' ? "border-alien-green bg-white/5" : "border-white/5 hover:border-white/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                            {shippingMethod === 'priority' && <div className="w-2.5 h-2.5 rounded-full bg-alien-green" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white">PostPac Priority Delivery</div>
                            <div className="text-xs text-gray-400">Priority parcel delivery next working day</div>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold">CHF 15.00</span>
                      </div>

                      {/* Carbon Offset toggle */}
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs pt-4">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            id="carbon"
                            checked={carbonOffset}
                            onChange={(e) => setCarbonOffset(e.target.checked)}
                            className="w-4 h-4 rounded accent-alien-green cursor-pointer"
                          />
                          <label htmlFor="carbon" className="text-gray-300 cursor-pointer">
                            🌍 Add **Carbon-Neutral Offset** (+ CHF 1.50)
                          </label>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Submit button to payment step */}
                  <button
                    type="submit"
                    className="w-full h-14 bg-alien-green text-space-950 font-bold rounded-xl shadow-glow-green text-base flex items-center justify-center gap-2 hover:shadow-2xl active:scale-98 transition-all"
                  >
                    <span>Proceed to Payment</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                
                // ─── STEP 2: PAYMENT INTERFACES ───
                <form onSubmit={handlePlaceOrderSubmit} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="font-display text-2xl tracking-wide uppercase text-white">SECURE PAYMENT METHOD</h2>
                    <button 
                      type="button" 
                      onClick={() => setCheckoutStep('info')}
                      className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Back to Shipping</span>
                    </button>
                  </div>

                  {/* Payment selection list */}
                  <div className="bg-space-900 border border-white/5 rounded-2xl p-6 space-y-4">
                    
                    {/* TWINT */}
                    <div 
                      onClick={() => setPaymentMethod('twint')}
                      className={cn(
                        "border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all",
                        paymentMethod === 'twint' ? "border-alien-green bg-white/5" : "border-white/5 hover:border-white/10"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                          {paymentMethod === 'twint' && <div className="w-2.5 h-2.5 rounded-full bg-alien-green" />}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">TWINT (Swiss QR Code)</div>
                          <div className="text-xs text-gray-400">Instant scan with your TWINT app</div>
                        </div>
                      </div>
                      <div className="w-14 h-8 relative flex-shrink-0 bg-white border border-white/10 rounded px-1.5 py-0.5 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-blue-900 font-sans tracking-wide">TWINT</span>
                      </div>
                    </div>

                    {/* Credit Card */}
                    <div 
                      onClick={() => setPaymentMethod('card')}
                      className={cn(
                        "border-2 rounded-xl p-4 flex flex-col gap-4 cursor-pointer transition-all",
                        paymentMethod === 'card' ? "border-alien-green bg-white/5" : "border-white/5 hover:border-white/10"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                            {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-alien-green" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white">Credit / Debit Card</div>
                            <div className="text-xs text-gray-400">Secure card transaction (Stripe)</div>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <span className="text-[8px] bg-white text-gray-800 px-1 border rounded uppercase font-bold">Visa</span>
                          <span className="text-[8px] bg-white text-gray-800 px-1 border rounded uppercase font-bold">MC</span>
                        </div>
                      </div>

                      {paymentMethod === 'card' && (
                        <div className="space-y-3 pt-3 border-t border-white/5 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                          <div>
                            <label className="text-[10px] font-mono text-gray-400 mb-1 block">Card Number</label>
                            <input 
                              type="text" 
                              required
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4242 4242 4242 4242"
                              className="input"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-mono text-gray-400 mb-1 block">Expiry</label>
                              <input 
                                type="text" 
                                required
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                placeholder="MM/YY"
                                className="input"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono text-gray-400 mb-1 block">CVC</label>
                              <input 
                                type="password" 
                                required
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value)}
                                placeholder="123"
                                className="input"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pay on Invoice (Swiss invoice standard) */}
                    <div 
                      onClick={() => setPaymentMethod('invoice')}
                      className={cn(
                        "border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all",
                        paymentMethod === 'invoice' ? "border-alien-green bg-white/5" : "border-white/5 hover:border-white/10"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                          {paymentMethod === 'invoice' && <div className="w-2.5 h-2.5 rounded-full bg-alien-green" />}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">Swiss Invoice / Bill (Pay in 30 Days)</div>
                          <div className="text-xs text-gray-400">Receive parcel first, pay within 30 days</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono border border-white/10 px-2 py-0.5 rounded text-gray-400">BILL</span>
                    </div>

                  </div>

                  {/* Delivery Notes */}
                  <div className="bg-space-900 border border-white/5 rounded-2xl p-6 space-y-3">
                    <label className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">Order notes (Optional)</label>
                    <textarea 
                      placeholder="Special instructions for delivery (e.g., leave package in box, door code, gift note...)"
                      rows={3}
                      className="input py-3 h-24"
                    />
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start gap-3 p-1">
                    <input 
                      type="checkbox" 
                      id="terms"
                      required
                      className="w-4 h-4 rounded accent-alien-green mt-0.5 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-xs text-gray-400 cursor-pointer leading-normal">
                      I agree to the <Link href="/terms" className="text-alien-green hover:underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-alien-green hover:underline">Privacy Policy</Link> of UFO LABZ Swiss.
                    </label>
                  </div>

                  {/* Secure Place Order Action Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-alien-green text-space-950 font-bold rounded-xl shadow-glow-green text-base flex items-center justify-center gap-2 hover:shadow-2xl active:scale-98 transition-all"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isSubmitting ? 'SECUREING PAYMENTS...' : 'Complete Secure Checkout'}</span>
                  </button>
                </form>
              )}

            </div>

            {/* ─── RIGHT COLUMN: ORDER SUMMARY & TRUST (width: 5 cols) ─── */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              
              {/* Summary panel */}
              <div className="bg-space-900 border border-white/5 rounded-3xl p-6 space-y-4 shadow-xl">
                <h3 className="font-display text-xl tracking-wide uppercase text-white pb-3 border-b border-white/5">ORDER SUMMARY</h3>
                
                {/* List items */}
                <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar pr-1">
                  {items.map((item) => {
                    if (!item?.variant) return null
                    const itemName = getLocalizedField((item.variant as any).product?.name)
                    const itemImg = (item.variant as any).product?.images?.find((i: any) => i.is_primary)?.url ?? (item.variant as any).product?.images?.[0]?.url

                    return (
                      <div key={item.id} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 bg-space-950 border border-white/5 rounded-xl overflow-hidden flex-shrink-0">
                            {itemImg && <Image src={itemImg} alt={itemName} fill className="object-contain p-1.5" />}
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-xs text-white max-w-[180px] truncate">{itemName}</div>
                            <span className="text-[10px] text-gray-400">{item.variant.name} · Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-gray-200">
                          {formatPrice(item.variant.price * item.quantity)}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Coupon Code Panel */}
                <div className="pt-4 border-t border-white/5">
                  {appliedCoupon ? (
                    <div className="bg-alien-green/5 border border-alien-green/20 p-3 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-alien-green font-bold font-mono">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{appliedCoupon}</span>
                      </div>
                      <button 
                        onClick={handleRemoveCoupon}
                        className="text-gray-400 hover:text-white"
                        aria-label="Remove Coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="COUPON CODE (e.g. ALIEN10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="input text-xs font-mono py-2"
                      />
                      <button 
                        type="submit" 
                        className="bg-white hover:bg-gray-100 text-space-950 font-bold px-4 rounded-xl text-xs transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-[10px] text-red-500 font-mono mt-1">{couponError}</p>}
                </div>

                {/* Pricing summary */}
                <div className="pt-4 border-t border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(breakdown.subtotal)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-alien-green font-bold">
                      <span>Discount</span>
                      <span>−{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                  </div>
                  {carbonOffset && (
                    <div className="flex justify-between text-gray-400">
                      <span>Carbon offset</span>
                      <span>{formatPrice(offsetCost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-400/60 text-[10px]">
                    <span>VAT (8.1% incl.)</span>
                    <span>{formatPrice(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white text-base pt-3 border-t border-white/5">
                    <span>Grand Total</span>
                    <span className="text-lg text-alien-green">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Loyalty point notification */}
                <div className="bg-alien-green/5 border border-alien-green/10 p-3 rounded-xl text-[10px] flex items-center justify-between">
                  <span className="text-gray-400">Alien Points earned on checkout:</span>
                  <span className="font-mono font-bold text-alien-green">+{loyaltyPoints} pts</span>
                </div>
              </div>

              {/* Guarantees & trust panel */}
              <div className="bg-space-900/60 border border-white/5 rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">SWISS GUARANTEE</h4>
                <div className="space-y-3 text-xs text-gray-300">
                  <div className="flex gap-2.5">
                    <Shield className="w-4 h-4 text-alien-green flex-shrink-0" />
                    <p><strong>30-Day Money Back:</strong> Satisfaction guaranteed, or refund within 30 days.</p>
                  </div>
                  <div className="flex gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-alien-green flex-shrink-0" />
                    <p><strong>100% Authentic:</strong> Shipped directly from certified Swiss manufacturing labs.</p>
                  </div>
                </div>
              </div>

              {/* Secure logos */}
              <div className="flex flex-wrap justify-center items-center gap-4 py-2 border-t border-white/5 opacity-60">
                <span className="text-[10px] font-mono text-gray-400 uppercase">We accept:</span>
                <span className="text-xs font-bold text-white font-sans tracking-wide">TWINT</span>
                <span className="text-xs font-bold text-white">VISA</span>
                <span className="text-xs font-bold text-white">MASTERCARD</span>
                <span className="text-xs font-bold text-white">APPLE PAY</span>
                <span className="text-xs font-bold text-white">GOOGLE PAY</span>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ─── TWINT MODAL QR SCAN SIMULATION ─── */}
      {showTwintModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-space-900 border border-white/10 p-6 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl relative">
            <h3 className="font-display text-2xl tracking-wider text-white">PAY WITH TWINT</h3>
            
            <p className="text-xs text-gray-400">
              Open your **TWINT app** on your phone, scan the QR code below, and authorize the transaction of <strong className="text-white">{formatPrice(finalTotal)}</strong>.
            </p>

            {/* QR Mock */}
            <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center shadow-lg relative">
              <div className="w-full h-full border border-gray-100 relative">
                {/* Simulated QR block layout */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_2px,transparent_2px)] bg-[size:10px_10px]" />
                <div className="absolute top-2 left-2 w-8 h-8 border-[4px] border-blue-900 bg-white" />
                <div className="absolute top-2 right-2 w-8 h-8 border-[4px] border-blue-900 bg-white" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-[4px] border-blue-900 bg-white" />
                {/* TWINT center logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-900 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow">
                  TWINT
                </div>
              </div>
            </div>

            <div className="text-xs font-mono space-y-1 text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <span>Simulating QR scan confirmation...</span>
              </div>
              <p>Simulating success in: <strong className="text-white">{twintTimer}s</strong></p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowTwintModal(false)}
                className="btn-outline flex-1 py-2 text-xs"
              >
                Cancel
              </button>
              <button 
                onClick={handleCompletePurchase}
                className="btn-primary flex-1 py-2 bg-blue-600 text-white font-bold text-xs"
              >
                Skip Scan (Success)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
