'use client'
// components/product/ProductDetail.tsx
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Star, ShoppingBag, Plus, Minus, ChevronDown, ChevronUp,
  Shield, FlaskConical, CheckCircle2, Heart, RefreshCw,
  Truck, ArrowRight, Award, Flame, Info, Check, MessageCircle, HelpCircle, Phone, Send
} from 'lucide-react'
import { formatPrice, getPricedForQuantity } from '@/lib/utils/pricing'
import { getLocalizedField } from '@/types'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface Props {
  product: any
}

const CERTIFICATIONS = [
  { name: 'GMP Certified', icon: Award, desc: 'Good Manufacturing Practices' },
  { name: 'ISO Certified', icon: Shield, desc: 'ISO 9001 quality standards' },
  { name: 'Lab Tested', icon: FlaskConical, desc: 'Third-party purity verified' },
  { name: 'Vegan', icon: Check, desc: '100% plant-based' },
  { name: 'Gluten Free', icon: Check, desc: 'No wheat or gluten' },
  { name: 'Non-GMO', icon: Check, desc: 'Genetically modified organism free' }
]

const TRUST_BADGES = [
  { text: 'Secure Checkout', icon: Shield, desc: 'SSL Encrypted payment systems' },
  { text: 'Final Sale', icon: RefreshCw, desc: 'No returns unless damaged' },
  { text: 'Fast Shipping', icon: Truck, desc: 'Next day Swiss dispatch' },
  { text: '100% Authentic', icon: Award, desc: 'Direct from UFO LABZ Swiss labs' }
]

export default function ProductDetail({ product: serverProduct, slug }: { product: any; slug?: string }) {
  const router = useRouter()
  const { addItem, isLoading } = useCart()

  // States
  const [product, setProduct] = useState<any>(serverProduct)
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    serverProduct?.variants?.find((v: any) => v.is_default)?.id ??
    serverProduct?.variants?.[0]?.id ??
    ''
  )
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user)
      }
    })
  }, [])

  useEffect(() => {
    if (serverProduct) {
      setProduct(serverProduct)
      setSelectedVariantId(serverProduct.variants?.find((v: any) => v.is_default)?.id ?? serverProduct.variants?.[0]?.id ?? '')
    }
  }, [serverProduct])

  const [quantity, setQuantity] = useState(1)
  const [activeSlide, setActiveSlide] = useState(0) // 0: Presentation, 1: Ingredients, 2: Flavors
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'nutrition' | 'faqs' | 'shipping'>('benefits')
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [frequency, setFrequency] = useState('monthly')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [compareList, setCompareList] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationText, setNotificationText] = useState('')
  const [showSupport, setShowSupport] = useState(false)

  // AI assistant overlay modal states
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([])
  const [aiInput, setAiInput] = useState('')
  const [isAiWidgetTyping, setIsAiWidgetTyping] = useState(false)

  // Countdown timer for delivery
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 22 })

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59 }
        } else {
          return { hours: 4, minutes: 22 } // reset
        }
      });
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Simulated purchase notifications
  useEffect(() => {
    const locations = ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Lugano', 'St. Gallen']
    const triggers = [
      'just purchased Astro Creatine!',
      'just subscribed to Blast Pre-Workout!',
      'bought Amino Fuel Mango & Pre-Workout Bundle!',
      'earned 250 Alien Points!'
    ]

    const runNotification = () => {
      const randomLoc = locations[Math.floor(Math.random() * locations.length)]
      const randomTrigger = triggers[Math.floor(Math.random() * triggers.length)]
      setNotificationText(`🛸 Someone from ${randomLoc} ${randomTrigger}`)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 5000)
    }

    const timer = setTimeout(runNotification, 7000)
    const interval = setInterval(runNotification, 25000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  const handleOpenAiModal = () => {
    setIsAiModalOpen(true)
    setShowSupport(false)
    if (aiMessages.length === 0) {
      setAiMessages([
        { sender: 'ai', text: `🛸 Welcome to UFO LABZ Mission Control! I am your AI Lab Assistant. Ask me anything about "${product?.name?.en || product?.title || 'this supplement'}", stack options, or dosage parameters!` }
      ])
    }
  }

  const handleSendAiWidgetMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiInput.trim()) return
    const userText = aiInput
    setAiMessages(prev => [...prev, { sender: 'user', text: userText }])
    setAiInput('')
    setIsAiWidgetTyping(true)

    const storedKey = localStorage.getItem('ufo_openai_api_key')
    let reply = ''
    let succeeded = false

    // Try calling server-side proxy route first
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userText,
          productName: product?.name?.en || product?.title,
          productDesc: product?.short_description?.en || product?.desc
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.choices && data.choices[0]) {
          reply = data.choices[0].message.content
          succeeded = true
        }
      }
    } catch (err) {
      console.warn('Server proxy failed, checking client fallback...', err)
    }

    // Fallback to client-side direct request if server-side key is missing or failed
    if (!succeeded) {
      if (storedKey) {
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedKey}`
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'system',
                  content: `You are an advanced UFO LABZ AI Lab Assistant, a premium sports nutrition specialist for a Swiss brand. Respond professionally and scientifically. You are assisting a client interested in the product: "${product?.name?.en || product?.title}". Short description: "${product?.short_description?.en || product?.desc}". Recommend stack details.`
                },
                { role: 'user', content: userText }
              ],
              temperature: 0.7
            })
          })
          const data = await response.json()
          if (data.choices && data.choices[0]) {
            reply = data.choices[0].message.content
            succeeded = true
          } else {
            reply = '🛰️ Connection error. Please verify the custom OpenAI API Key inside your Admin Automations panel.'
          }
        } catch (err) {
          reply = '🛰️ Could not connect to OpenAI API servers. Please check your internet connection or API Key parameters.'
        }
      } else {
        // Simulate offline response delay
        await new Promise(resolve => setTimeout(resolve, 1200))
        const lowerText = userText.toLowerCase()
        if (lowerText.includes('creatine') || lowerText.includes('kreatin')) {
          reply = '🛸 Astro Creatine monohydrate is best taken at 5g daily. Consistency is key! You can mix it with water, protein shakes, or juice. On workout days, consume it post-workout for optimal ATP synthesis.'
        } else if (lowerText.includes('pre-workout') || lowerText.includes('pre workout') || lowerText.includes('energy')) {
          reply = '⚡ Blast Pre-Workout should be consumed 15–30 minutes before your workout. Start with half a scoop to assess tolerance due to the high Beta-Alanine dosage (which causes a safe, tingling sensation!).'
        } else if (lowerText.includes('dosage') || lowerText.includes('how to take') || lowerText.includes('take')) {
          reply = '🪐 We recommend taking our premium formulations mixed with 3-4 dl of water. Do not exceed the daily recommended dosage listed on the packaging.'
        } else {
          reply = '🛰️ My database suggests prioritizing macro-nutritional consistency. UFO LABZ supplements are engineered to work synergistically. Let me know if you would like dosage advice on any specific product!'
        }
      }
    }

    setIsAiWidgetTyping(false)
    setAiMessages(prev => [...prev, { sender: 'ai', text: reply }])
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-space-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-alien-green border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-gray-400">Loading supplement parameters...</p>
        </div>
      </div>
    )
  }

  // Product Fields
  const color = product.product_color ?? '#00FF88'
  const name = getLocalizedField(product.name)
  const tagline = getLocalizedField(product.tagline)
  const desc = getLocalizedField(product.description)
  const shortDesc = getLocalizedField(product.short_description)
  const keyBenefits = Array.isArray(product.schema_markup?.key_benefits)
    ? product.schema_markup.key_benefits
    : [
        'Third-party purity tested in independent laboratories.',
        'Transparent active-ingredient matrix with clear serving guidance.',
        'Designed to support training performance, recovery, and daily consistency.',
        'Vegan, GMP, HACCP, and gluten-free positioning where shown on pack.'
      ]

  const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId)
  const inStock = (selectedVariant?.stock ?? 0) > 0
  const isLowStock = inStock && (selectedVariant?.stock ?? 0) < 50

  const pricingRules = (product.pricing_rules ?? []).filter((r: any) => r.is_active)

  // Subtotal calculations
  const { price: basePrice, savingsPct } = selectedVariant
    ? getPricedForQuantity(selectedVariant.price, quantity, pricingRules)
    : { price: 0, savingsPct: 0 }

  // 15% discount for subscriptions
  const subscriptionDiscount = 0.15
  const finalPricePerUnit = isSubscribed ? basePrice * (1 - subscriptionDiscount) : basePrice
  const totalOriginalPrice = (selectedVariant?.compare_at_price ?? selectedVariant?.price ?? 0) * quantity
  const totalFinalPrice = finalPricePerUnit * quantity

  // Alien points earn metric
  const pointsEarned = Math.round(totalFinalPrice * 10)

  // Bundles (Frequently Bought Together)
  const [bundleChecked, setBundleChecked] = useState([true, true]) // Stack item 1 & 2
  const stacks = product.stacks ?? []

  const getBundleTotal = () => {
    let priceSum = totalFinalPrice
    stacks.forEach((stack: any, idx: number) => {
      if (bundleChecked[idx]) {
        const stackPrice = stack.stack_product.base_price
        const discount = stack.discount_pct ? (1 - stack.discount_pct / 100) : 1
        priceSum += stackPrice * discount
      }
    })
    return priceSum
  }

  const handleAddToCart = async () => {
    if (!selectedVariant || !inStock) return
    await addItem(selectedVariant.id, quantity, { product, variant: selectedVariant })
  }

  const handleBuyNow = async () => {
    if (!selectedVariant || !inStock) return
    await addItem(selectedVariant.id, quantity, { product, variant: selectedVariant })
    router.push('/checkout')
  }

  const handleAddBundleToCart = async () => {
    // Add main item
    await addItem(selectedVariant.id, quantity, { product, variant: selectedVariant })
    // Add stack items
    for (let i = 0; i < stacks.length; i++) {
      if (bundleChecked[i]) {
        const stackItem = stacks[i]
        const stackVariant = stackItem.stack_product.variants?.[0] || { id: stackItem.stack_product.id, price: stackItem.stack_product.base_price }
        await addItem(stackVariant.id, 1, { product: stackItem.stack_product, variant: stackVariant })
      }
    }
  }

  // Get primary image url
  const mainImageUrl = product.images?.find((i: any) => i.is_primary)?.url ?? product.images?.[0]?.url

  return (
    <div className="pt-16 min-h-screen bg-space-950 text-white selection:bg-alien-green selection:text-space-950 overflow-x-hidden">

      {/* ─── 1. DYNAMIC NOTIFICATION TOAST ─── */}
      <div className={cn(
        "fixed bottom-6 left-6 z-50 max-w-sm bg-space-900/90 border border-white/10 backdrop-blur-xl p-4 rounded-xl shadow-glow-green transition-all duration-500 transform",
        showNotification ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-alien-green animate-ping flex-shrink-0" />
          <span className="text-xs font-mono text-muted text-gray-300 leading-normal">{notificationText}</span>
        </div>
      </div>

      {/* ─── 2. FLOATING SUPPORT WIDGET ─── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowSupport(!showSupport)}
          className="w-14 h-14 rounded-full flex items-center justify-center text-space-950 hover:shadow-2xl transition-all active:scale-95 duration-200"
          style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}40` }}
          aria-label="Support Desk"
        >
          <MessageCircle className="w-6 h-6" />
        </button>

        {showSupport && (
          <div className="absolute bottom-16 right-0 w-64 bg-space-900 border border-white/10 rounded-2xl p-4 shadow-2xl space-y-2 backdrop-blur-xl">
            <h4 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 mb-2 uppercase">MISSION SUPPORT</h4>

            <a
              href="https://wa.me/41790000000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-colors text-sm text-gray-200"
            >
              <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs">WhatsApp Dispatch</div>
                <div className="text-[10px] text-gray-400">Response time: ~5 mins</div>
              </div>
            </a>

            <div className="flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl cursor-pointer transition-colors text-sm text-gray-200">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs">Live Chat Desk</div>
                <div className="text-[10px] text-gray-400">Online now</div>
              </div>
            </div>

            <div
              onClick={handleOpenAiModal}
              className="flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl cursor-pointer transition-colors text-sm text-gray-200"
            >
              <div className="w-8 h-8 rounded-lg bg-alien-green/10 border border-alien-green/20 flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-alien-green" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs">AI Lab Assistant</div>
                <div className="text-[10px] text-gray-400">Instant AI response</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── 3. LANDING HERO (3-SLIDER LAYOUT) ─── */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden border-b border-white/5 pt-12">
        {/* Deep space glow */}
        <div className="absolute inset-0 bg-space-950 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[160px] opacity-15 transition-all duration-700"
            style={{ backgroundColor: color }}
          />
        </div>

        <div className="max-w-7xl mx-auto container-px py-12 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Slide left column (width: 7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">

              {/* Slider tabs */}
              <div className="flex items-center gap-2 bg-space-900 border border-white/5 p-1 rounded-xl w-fit">
                {['01. Formula Info', '02. Ingredient Stats', '03. Flavor Fusion'].map((tabLabel, idx) => (
                  <button
                    key={tabLabel}
                    onClick={() => setActiveSlide(idx)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all",
                      activeSlide === idx
                        ? "bg-white/10 text-white shadow-inner"
                        : "text-muted text-gray-400 hover:text-white"
                    )}
                  >
                    {tabLabel}
                  </button>
                ))}
              </div>

              {/* Slider content area */}
              <div className="min-h-[280px] flex flex-col justify-center">
                {activeSlide === 0 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-mono text-gray-300 font-bold">{product.avg_rating || '4.9'} rating</span>
                      <span className="text-white/20">|</span>
                      <span className="text-xs text-alien-green bg-alien-green/10 border border-alien-green/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Swiss engineered</span>
                    </div>

                    <h1 className="font-display text-5xl md:text-7xl tracking-wider text-white uppercase leading-none">
                      {name}
                    </h1>
                    <p className="text-xl text-alien-green font-mono font-semibold" style={{ color }}>{tagline}</p>
                    <p className="text-gray-300 text-sm max-w-xl leading-relaxed">{shortDesc || desc}</p>

                    <div className="flex flex-wrap gap-6 pt-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-alien-green" />
                        <span>Maximum bio-availability</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-alien-green" />
                        <span>Zero artificial fillers</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeSlide === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <span className="text-xs text-alien-green font-mono uppercase tracking-widest bg-alien-green/10 border border-alien-green/20 px-2 py-0.5 rounded-full">Formula transparency</span>
                    <h2 className="font-display text-4xl md:text-5xl text-white tracking-wide uppercase leading-tight">
                      THE LAB BLUEPRINT
                    </h2>
                    <p className="text-gray-300 text-sm max-w-lg leading-relaxed">
                      Every batch is verified in Switzerland. Engineered with high-dosage active key ingredients to provide peak physical performance.
                    </p>

                    <div className="grid grid-cols-2 gap-4 max-w-md pt-4">
                      {(product.ingredients || []).slice(0, 4).map((ing: any) => (
                        <div key={ing.id} className="bg-space-900 border border-white/5 p-3 rounded-xl">
                          <span className="text-[10px] font-mono text-gray-400 uppercase">Ingredient</span>
                          <div className="font-bold text-sm text-white">{getLocalizedField(ing.ingredient?.name)}</div>
                          <span className="text-xs font-mono text-alien-green font-semibold" style={{ color }}>{ing.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSlide === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <span className="text-xs text-alien-green font-mono uppercase tracking-widest bg-alien-green/10 border border-alien-green/20 px-2 py-0.5 rounded-full">Variant Selection</span>
                    <h2 className="font-display text-4xl md:text-5xl text-white tracking-wide uppercase leading-tight">
                      FLAVOR FUSION
                    </h2>
                    <p className="text-gray-300 text-sm max-w-lg leading-relaxed">
                      Engineered for premium performance without compromising on taste. Choose from our standard galactic sizes and refreshing flavors.
                    </p>

                    <div className="flex flex-col gap-2 max-w-sm pt-4">
                      {product.variants?.map((v: any) => (
                        <div
                          key={v.id}
                          onClick={() => setSelectedVariantId(v.id)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all",
                            v.id === selectedVariantId ? "border-alien-green bg-white/5" : "border-white/5 hover:border-white/10"
                          )}
                          style={v.id === selectedVariantId ? { borderColor: color } : {}}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-3.5 h-3.5 rounded-full border border-white/20 flex items-center justify-center">
                              {v.id === selectedVariantId && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />}
                            </div>
                            <span className="font-bold text-sm">{v.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold">{formatPrice(v.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Slide controls */}
              <div className="flex items-center gap-4 pt-6">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={cn(
                        "w-6 h-1.5 rounded-full transition-all duration-300",
                        activeSlide === idx ? "w-10" : "bg-white/20"
                      )}
                      style={activeSlide === idx ? { backgroundColor: color } : {}}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Slide right column: Image Showcase (width: 5 cols) */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-80 h-80 md:w-96 md:h-96">
                {/* Space portal circle behind the image */}
                <div className="absolute inset-0 rounded-full border border-white/5 animate-spin-slow scale-110 pointer-events-none" />
                <div
                  className="absolute inset-4 rounded-full filter blur-xl opacity-20 animate-pulse pointer-events-none"
                  style={{ backgroundColor: color, boxShadow: `0 0 100px ${color}` }}
                />

                {mainImageUrl ? (
                  <Image
                    src={mainImageUrl}
                    alt={name}
                    fill
                    className="object-contain p-4 drop-shadow-2xl animate-float"
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FlaskConical className="w-24 h-24 text-white/10" />
                  </div>
                )}

                {/* Hotspot triggers overlaying on Slide 1 */}
                {activeSlide === 1 && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[20%] left-[30%] pointer-events-auto group">
                      <div className="w-6 h-6 rounded-full bg-alien-green/20 border-2 border-alien-green flex items-center justify-center animate-ping absolute" />
                      <div className="w-6 h-6 rounded-full bg-space-950 border-2 border-alien-green flex items-center justify-center relative cursor-pointer text-xs font-bold text-alien-green">1</div>
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 bg-space-900 border border-white/10 rounded-xl p-2.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-20 shadow-2xl">
                        <div className="text-xs font-bold text-white mb-1">Ultra-Pure Catalyst</div>
                        <p className="text-[10px] text-gray-400">Micronized for immediate plasma absorption and cellular activation.</p>
                      </div>
                    </div>

                    <div className="absolute bottom-[30%] right-[25%] pointer-events-auto group">
                      <div className="w-6 h-6 rounded-full bg-alien-green/20 border-2 border-alien-green flex items-center justify-center animate-ping absolute" />
                      <div className="w-6 h-6 rounded-full bg-space-950 border-2 border-alien-green flex items-center justify-center relative cursor-pointer text-xs font-bold text-alien-green">2</div>
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 bg-space-900 border border-white/10 rounded-xl p-2.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-20 shadow-2xl">
                        <div className="text-xs font-bold text-white mb-1">Electrolyte Blend</div>
                        <p className="text-[10px] text-gray-400">Essential minerals to prevent cramping and maintain premium hydration.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 4. PURCHASE DRIVER & ACTION HUB ─── */}
      <section className="relative py-16 bg-space-900 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto container-px">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Purchase Options Selector */}
            <div className="space-y-6">
              <h3 className="font-display text-3xl tracking-wide uppercase text-white">CHOOSE FREQUENCY</h3>

              {/* Option cards */}
              <div className="space-y-3">
                {/* One time */}
                <div
                  onClick={() => setIsSubscribed(false)}
                  className={cn(
                    "border-2 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all",
                    !isSubscribed ? "border-alien-green bg-white/5" : "border-white/5 hover:border-white/10"
                  )}
                  style={!isSubscribed ? { borderColor: color } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                      {!isSubscribed && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">One-Time Purchase</div>
                      <div className="text-xs text-gray-400">Standard direct checkout</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-base text-white">{formatPrice(basePrice)}</div>
                  </div>
                </div>

                {/* Subscription */}
                <div
                  onClick={() => setIsSubscribed(true)}
                  className={cn(
                    "border-2 rounded-2xl p-4 flex flex-col gap-3 cursor-pointer transition-all",
                    isSubscribed ? "border-alien-green bg-white/5" : "border-white/5 hover:border-white/10"
                  )}
                  style={isSubscribed ? { borderColor: color } : {}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                        {isSubscribed && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">Subscribe & Save 15%</div>
                        <div className="text-xs text-gray-400">Cancel anytime, lock in discount</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-base text-alien-green" style={{ color }}>{formatPrice(basePrice * 0.85)}</div>
                      <div className="text-[10px] text-gray-400 line-through">{formatPrice(basePrice)}</div>
                    </div>
                  </div>

                  {isSubscribed && (
                    <div className="pt-2 border-t border-white/5 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs font-mono text-gray-400">Deliver every:</span>
                      <select
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="bg-space-950 border border-white/10 rounded-lg text-xs p-1.5 text-white focus:outline-none"
                      >
                        <option value="monthly">30 Days (Recommended)</option>
                        <option value="bimonthly">60 Days</option>
                        <option value="quarterly">90 Days</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Estimates */}
              <div className="bg-space-950 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-alien-green/10 border border-alien-green/20 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-alien-green" />
                </div>
                <div className="text-left text-xs">
                  <div className="font-bold text-white">Guaranteed Delivery Estimate</div>
                  <div className="text-gray-400">
                    Order in the next <strong className="text-white font-mono">{timeLeft.hours}h {timeLeft.minutes}m</strong> to receive it by Tuesday, June 30.
                  </div>
                </div>
              </div>
            </div>

            {/* Price Calculations and CTAs */}
            <div className="space-y-6 bg-space-950 border border-white/5 p-6 rounded-3xl">

              {/* Product Variant Details */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                  <h4 className="font-bold text-white text-lg">{name}</h4>
                  <p className="text-xs text-gray-400">Size: {selectedVariant?.name}</p>
                </div>
                {/* Stock indicator */}
                <div>
                  {isLowStock ? (
                    <span className="text-xs font-mono bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-1 rounded-full animate-pulse font-bold">
                      LOW STOCK (Only {selectedVariant.stock} left!)
                    </span>
                  ) : inStock ? (
                    <span className="text-xs font-mono bg-alien-green/10 border border-alien-green/20 text-alien-green px-3 py-1 rounded-full font-bold">
                      IN STOCK
                    </span>
                  ) : (
                    <span className="text-xs font-mono bg-white/5 border border-white/10 text-gray-400 px-3 py-1 rounded-full font-bold">
                      OUT OF STOCK
                    </span>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Unit Price</span>
                  <span>{formatPrice(finalPricePerUnit)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Quantity</span>
                  <span>{quantity}x</span>
                </div>
                <div className="flex justify-between font-bold text-white text-lg pt-3 border-t border-white/5">
                  <span>Total (incl. VAT)</span>
                  <div className="text-right">
                    <span className="text-xl text-white font-bold">{formatPrice(totalFinalPrice)}</span>
                    {totalOriginalPrice > totalFinalPrice && (
                      <div className="text-xs text-gray-400 line-through">{formatPrice(totalOriginalPrice)}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Loyalty Reward callout */}
              {user ? (
                <div className="bg-alien-green/5 border border-alien-green/10 p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-gray-400">Loyalty Rewards Points to Earn:</span>
                  <span className="font-mono font-bold text-alien-green" style={{ color }}>+{pointsEarned} Alien Points</span>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-gray-400">Join UFO Club to earn rewards:</span>
                  <Link href="/login" className="font-bold text-alien-green hover:underline" style={{ color }}>Earn {pointsEarned} Points</Link>
                </div>
              )}

              {/* Actions Grid */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center bg-space-900 border border-white/5 rounded-xl p-1 h-14">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-muted hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-white font-semibold w-10 text-center font-mono">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                      className="w-10 h-10 flex items-center justify-center text-muted hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={!inStock || isLoading}
                    className={cn(
                      "flex-1 h-14 flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 text-space-900 text-base",
                      inStock ? "hover:shadow-glow-green active:scale-98" : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                    )}
                    style={inStock ? { backgroundColor: color } : {}}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {isLoading ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>

                {/* Buy Now (Direct Checkout) */}
                {inStock && (
                  <button
                    onClick={handleBuyNow}
                    className="w-full h-14 bg-white hover:bg-gray-100 text-space-950 font-bold rounded-xl transition-all active:scale-98 flex items-center justify-center gap-2 text-base shadow-lg"
                  >
                    <span>Instant checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {/* Wishlist & Compare Toggles */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <Heart className={cn("w-4 h-4", isWishlisted ? "fill-red-500 text-red-500" : "")} />
                    <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
                  </button>
                  <span className="text-white/10">|</span>
                  <button
                    onClick={() => setCompareList(!compareList)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className={cn("w-4 h-4", compareList ? "animate-spin text-alien-green" : "")} />
                    <span>{compareList ? "Comparing" : "Add to Compare"}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 5. INFORMATION ACCORDIONS / TABS ─── */}
      <section className="py-16 max-w-4xl mx-auto container-px">

        {/* Tabs switcher headers */}
        <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar gap-8 mb-8">
          {[
            { id: 'benefits', label: 'Key Benefits' },
            { id: 'ingredients', label: 'Ingredients matrix' },
            { id: 'nutrition', label: 'Nutrition Facts' },
            { id: 'faqs', label: 'FAQs' },
            { id: 'shipping', label: 'Shipping & Returns' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "pb-4 text-sm font-mono uppercase tracking-widest border-b-2 font-bold whitespace-nowrap transition-all",
                activeTab === tab.id ? "text-white" : "text-gray-400 border-transparent hover:text-white"
              )}
              style={activeTab === tab.id ? { borderBottomColor: color } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab display contents */}
        <div className="min-h-[250px]">

          {/* Key Benefits */}
          {activeTab === 'benefits' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xl font-bold mb-4 uppercase font-display tracking-wider">Engineered Advantages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keyBenefits.map((benefitText: string) => (
                  <div key={benefitText} className="flex gap-3 bg-space-900 border border-white/5 p-4 rounded-xl items-start">
                    <CheckCircle2 className="w-5 h-5 text-alien-green flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-300 leading-relaxed">{benefitText}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients Matrix */}
          {activeTab === 'ingredients' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xl font-bold mb-2 uppercase font-display tracking-wider">LAB PROFILE MATRIX</h3>
              <p className="text-xs text-gray-400 mb-4">Complete ingredient breakdowns per dosage.</p>

              <div className="space-y-3">
                {product.ingredients?.map((ing: any) => {
                  const ingName = getLocalizedField(ing.ingredient?.name)
                  const ingDesc = getLocalizedField(ing.ingredient?.description)
                  return (
                    <div key={ing.id} className="bg-space-900 border border-white/5 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{ingName}</span>
                          {ing.is_key && <span className="text-[9px] bg-alien-green/10 text-alien-green border border-alien-green/20 px-1.5 py-0.5 rounded font-mono">KEY DRIVER</span>}
                        </div>
                        <p className="text-xs text-gray-400 leading-normal mt-1">{ingDesc}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-lg font-mono font-bold text-alien-green" style={{ color }}>{ing.amount}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Nutrition Facts Label */}
          {activeTab === 'nutrition' && (
            <div className="animate-fade-in bg-white text-space-950 p-6 rounded-2xl border-4 border-space-950 max-w-md mx-auto shadow-2xl font-mono text-xs">
              <div className="text-center pb-2 border-b-8 border-space-950">
                <h3 className="font-black text-2xl font-sans tracking-tight">Nutrition Facts</h3>
                <div className="flex justify-between text-[10px] mt-1">
                  <span>Serving Size: {selectedVariant?.serving_size || '5g'}</span>
                  <span>Servings Per Container: {selectedVariant?.servings || '40'}</span>
                </div>
              </div>

              <div className="flex justify-between py-1 border-b border-space-950 font-bold">
                <span>Amount Per Serving</span>
              </div>

              <div className="flex justify-between py-1.5 border-b-4 border-space-950 font-bold text-sm">
                <span>Calories</span>
                <span>{selectedVariant?.nutrition?.calories || '0'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-300">
                <span>Total Fat {selectedVariant?.nutrition?.total_fat ?? 0}g</span>
                <span className="font-bold">0%</span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-300">
                <span>Sodium {selectedVariant?.nutrition?.sodium ?? 0}mg</span>
                <span className="font-bold">0%</span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-300">
                <span>Total Carbohydrate {selectedVariant?.nutrition?.total_carbohydrate ?? 0}g</span>
                <span className="font-bold">0%</span>
              </div>

              <div className="flex justify-between py-1 border-b-4 border-space-950">
                <span>Protein {selectedVariant?.nutrition?.protein || '0'}g</span>
                <span className="font-bold">0%</span>
              </div>

              <div className="py-2 border-b border-space-950 font-bold text-[10px]">
                Active Supplement Compounds
              </div>

              {(product.ingredients || []).map((ing: any) => (
                <div key={ing.id} className="flex justify-between py-1 border-b border-gray-200">
                  <span>{getLocalizedField(ing.ingredient?.name)}</span>
                  <span className="font-bold">{ing.amount}</span>
                </div>
              ))}
            </div>
          )}

          {/* FAQs Accordion */}
          {activeTab === 'faqs' && (
            <div className="space-y-3 animate-fade-in">
              <h3 className="text-xl font-bold mb-4 uppercase font-display tracking-wider">FREQUENTLY ASKED QUESTIONS</h3>
              {product.faqs?.map((faq: any) => {
                const q = getLocalizedField(faq.question)
                const a = getLocalizedField(faq.answer)
                return (
                  <div key={faq.id} className="border border-white/5 bg-space-900 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left text-sm font-bold text-white hover:bg-white/5 transition-colors focus:outline-none"
                    >
                      <span>{q}</span>
                      {openFaq === faq.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    {openFaq === faq.id && (
                      <div className="px-4 pb-4 pt-2 text-xs text-gray-300 leading-relaxed border-t border-white/5 bg-space-950/40">
                        {a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Shipping & Returns */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xl font-bold mb-4 uppercase font-display tracking-wider">Swiss Logistical Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-space-900 border border-white/5 p-4 rounded-xl space-y-2">
                  <Truck className="w-6 h-6 text-alien-green" />
                  <div className="font-bold text-sm">Delivery Time</div>
                  <p className="text-xs text-gray-400">1-2 working days within Switzerland (PostPac Priority).</p>
                </div>

                <div className="bg-space-900 border border-white/5 p-4 rounded-xl space-y-2">
                  <Award className="w-6 h-6 text-alien-green" />
                  <div className="font-bold text-sm">Shipping Costs</div>
                  <p className="text-xs text-gray-400">Free delivery for orders above CHF 99. Otherwise CHF 9.00 flat.</p>
                </div>

                <div className="bg-space-900 border border-white/5 p-4 rounded-xl space-y-2">
                  <RefreshCw className="w-6 h-6 text-alien-green" />
                  <div className="font-bold text-sm">Returns Policy</div>
                  <p className="text-xs text-gray-400">14-day return cooling-off period on unopened items.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ─── 6. CERTIFICATIONS & TRUST BADGES ─── */}
      <section className="py-16 bg-space-900/60 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto container-px text-center">
          <h3 className="font-display text-2xl md:text-3xl tracking-widest text-muted text-gray-400 uppercase mb-10">SWISS QUALITY ASSURED</h3>

          {/* Certifications grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-12">
            {CERTIFICATIONS.map((cert) => {
              const Icon = cert.icon
              return (
                <div key={cert.name} className="flex flex-col items-center justify-center p-4 bg-space-950 border border-white/5 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-alien-green/10 border border-alien-green/20 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-alien-green" />
                  </div>
                  <div className="font-bold text-xs text-white mb-1">{cert.name}</div>
                  <span className="text-[9px] text-gray-400">{cert.desc}</span>
                </div>
              )
            })}
          </div>

          {/* Trust badges row */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 pt-6 border-t border-white/5">
            {TRUST_BADGES.map((badge) => {
              const Icon = badge.icon
              return (
                <div key={badge.text} className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-alien-green font-bold" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">{badge.text}</div>
                    <span className="text-[10px] text-gray-400">{badge.desc}</span>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ─── 7. SOCIAL PROOF STATISTICS ─── */}
      <section className="py-16 bg-space-950 text-center">
        <div className="max-w-4xl mx-auto container-px">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <div className="font-display text-4xl md:text-5xl text-white tracking-widest uppercase">50,000+</div>
              <p className="text-xs text-gray-400 font-mono">HAPPY ATHLETES SERVED</p>
            </div>
            <div className="space-y-1 border-t border-b md:border-t-0 md:border-b-0 md:border-l md:border-r border-white/10 py-6 md:py-0">
              <div className="font-display text-4xl md:text-5xl text-alien-green tracking-widest uppercase" style={{ color }}>4.9★ RATING</div>
              <p className="text-xs text-gray-400 font-mono">FROM 3,000+ VERIFIED REVIEWS</p>
            </div>
            <div className="space-y-1">
              <div className="font-display text-4xl md:text-5xl text-white tracking-widest uppercase">1M+ SERVINGS</div>
              <p className="text-xs text-gray-400 font-mono">SHIPPED AND CONSUMED</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. FREQUENTLY BOUGHT TOGETHER ─── */}
      {stacks.length > 0 && (
        <section className="py-16 bg-space-900 border-t border-white/5">
          <div className="max-w-4xl mx-auto container-px">
            <h3 className="font-display text-3xl tracking-wide uppercase mb-8 text-center text-white">FREQUENTLY BOUGHT TOGETHER</h3>

            <div className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-6">

              {/* Items row */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">

                {/* Main Product */}
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 bg-space-900 border border-white/5 rounded-xl flex-shrink-0">
                    {mainImageUrl && <Image src={mainImageUrl} alt={name} fill className="object-contain p-2" />}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white max-w-[150px] truncate">{name}</div>
                    <span className="text-xs text-alien-green font-mono font-bold">{formatPrice(finalPricePerUnit)}</span>
                  </div>
                </div>

                {/* Stack loop */}
                {stacks.map((stack: any, idx: number) => {
                  const stackName = getLocalizedField(stack.stack_product.name)
                  const stackImg = stack.stack_product.images?.find((i: any) => i.is_primary)?.url ?? stack.stack_product.images?.[0]?.url
                  const stackPrice = stack.stack_product.base_price
                  const discountedPrice = stack.discount_pct ? stackPrice * (1 - stack.discount_pct / 100) : stackPrice

                  return (
                    <div key={stack.id} className="flex items-center gap-3">
                      <span className="text-2xl text-gray-500 font-bold">+</span>
                      <div
                        onClick={() => setBundleChecked((prev) => {
                          const c = [...prev]
                          c[idx] = !c[idx]
                          return c
                        })}
                        className="relative w-16 h-16 bg-space-900 border border-white/5 rounded-xl flex-shrink-0 cursor-pointer"
                      >
                        {stackImg && <Image src={stackImg} alt={stackName} fill className="object-contain p-2" />}
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-alien-green text-space-950 flex items-center justify-center text-[10px] font-bold border border-space-950">
                          {bundleChecked[idx] ? <Check className="w-3 h-3" /> : null}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white max-w-[150px] truncate">{stackName}</div>
                        <span className="text-xs text-alien-green font-mono font-bold">{formatPrice(discountedPrice)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Checkout actions */}
              <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <div className="text-xs text-gray-400">Total Bundle Price:</div>
                  <span className="text-2xl font-mono font-bold text-white">{formatPrice(getBundleTotal())}</span>
                </div>
                <button
                  onClick={handleAddBundleToCart}
                  disabled={isLoading}
                  className="btn-primary px-8 py-3.5 h-12 justify-center text-sm font-bold text-space-950 font-sans shadow-glow-green"
                  style={{ backgroundColor: color }}
                >
                  Add Bundle to Cart
                </button>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ─── 9. RELATED PRODUCTS ─── */}
      {stacks.length > 0 && (
      <section className="py-16 bg-space-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto container-px">
          <h3 className="font-display text-3xl tracking-wide uppercase mb-10 text-center text-white">RECOMMENDED STACKS</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stacks.map((stack: any) => {
              const stackName = getLocalizedField(stack.stack_product.name)
              const stackTagline = getLocalizedField(stack.stack_product.tagline)
              const stackImg = stack.stack_product.images?.find((i: any) => i.is_primary)?.url ?? stack.stack_product.images?.[0]?.url
              const stackColor = stack.stack_product.product_color ?? '#00FF88'

              return (
                <div key={stack.id} className="bg-space-900 border border-white/5 p-4 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all">
                  <div className="space-y-3">
                    <div className="relative aspect-square bg-space-950 rounded-xl overflow-hidden flex items-center justify-center">
                      {stackImg && <Image src={stackImg} alt={stackName} fill className="object-contain p-4" />}
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-sm text-white truncate">{stackName}</h4>
                      <p className="text-[10px] text-gray-400 truncate">{stackTagline}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/5">
                    <span className="font-mono text-xs font-bold text-alien-green" style={{ color: stackColor }}>
                      {formatPrice(stack.stack_product.base_price)}
                    </span>
                    <Link
                      href={`/products/${stack.stack_product.slug}`}
                      className="text-[10px] uppercase font-bold tracking-wider hover:text-white transition-colors"
                      style={{ color: stackColor }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      )}

      {/* ─── 4. AI CHATBOT OVERLAY MODAL ─── */}
      {isAiModalOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-space-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 flex flex-col h-[500px] backdrop-blur-xl animate-fade-in text-left">
          {/* Header */}
          <div className="bg-space-950 border-b border-white/5 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-alien-green/10 border border-alien-green/20 flex items-center justify-center">
                <FlaskConical className="w-3.5 h-3.5 text-alien-green" />
              </div>
              <div>
                <div className="font-bold text-xs text-white">AI Lab Assistant</div>
                <div className="text-[8px] font-mono text-alien-green flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-alien-green animate-ping" />
                  <span>ONLINE IN ORBIT</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsAiModalOpen(false)}
              className="text-gray-400 hover:text-white font-mono text-xs p-1"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar text-xs font-sans">
            {aiMessages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "max-w-[80%] rounded-2xl p-3 leading-relaxed",
                  msg.sender === 'user'
                    ? "bg-white/5 border border-white/10 text-white ml-auto rounded-tr-none"
                    : "bg-alien-green/10 border border-alien-green/20 text-gray-200 mr-auto rounded-tl-none"
                )}
              >
                {msg.text}
              </div>
            ))}

            {/* AI is thinking/typing indicator */}
            {isAiWidgetTyping && (
              <div className="bg-alien-green/10 border border-alien-green/20 text-gray-200 mr-auto rounded-tl-none rounded-2xl p-3 max-w-[80%] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-alien-green animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-alien-green animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-alien-green animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>

          {/* Send Input Form */}
          <form onSubmit={handleSendAiWidgetMessage} className="p-3 border-t border-white/5 bg-space-950 flex gap-2">
            <input
              type="text"
              required
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask dosage stacking guidelines..."
              className="input bg-space-900 border-white/5 flex-grow py-1.5 px-3 text-xs"
            />
            <button
              type="submit"
              className="bg-alien-green text-space-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center hover:shadow-glow-green transition-shadow"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

    </div>
  )
}
