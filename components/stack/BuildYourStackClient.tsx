'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Truck,
  ArrowRight,
  Shield,
  Layers,
  ChevronDown,
  X,
  Zap,
  Info,
  Check,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils/pricing'
import { getCanonicalUnitPrice, SHIPPING_CONFIG } from '@/lib/config/pricing'
import { PREORDER_CONFIG } from '@/lib/config/preorder'
import {
  calculateStackDiscount,
  DEFAULT_STACK_TIERS,
  DEFAULT_PRESET_STACKS,
  PresetStackDef,
} from '@/lib/config/stack'
import { getProductFlavors, FLAVOR_FAMILIES } from '@/lib/config/flavors'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

export interface StackProductCardItem {
  id: string
  slug: string
  name: string
  tagline: string
  category: string
  basePrice: number
  color: string
  imageUrl: string
  hasVariants: boolean
  flavors: Array<{
    slug: string
    flavorName: string
    color: string
    imageUrl: string
  }>
  variantId: string
  sku: string
}

interface BuildYourStackClientProps {
  products: StackProductCardItem[]
  initialTiers?: typeof DEFAULT_STACK_TIERS
  initialPresets?: PresetStackDef[]
}

export interface StackLineItem {
  id: string
  slug: string
  name: string
  flavorName?: string
  color: string
  imageUrl: string
  unitPrice: number
  quantity: number
  variantId: string
  sku: string
}

const FAQ_ITEMS = [
  {
    q: 'How does the stack discount work?',
    a: 'Our stack discount automatically rewards you for combining formulations. When you select 2 items, you immediately receive 10% off your entire stack subtotal. When you select 3 or more items, your discount automatically upgrades to 15% off. Discounts are applied in real time and verified server-side at checkout.',
  },
  {
    q: 'Can I mix and match any products and flavors?',
    a: 'Yes, 100%! You have complete freedom to mix any formulations (e.g. Creatine with EAA Mango, or BLAST Pre-Workout with Marine Collagen). Every single unit counts toward unlocking the 10% and 15% stack discount tiers.',
  },
  {
    q: 'Can I combine the stack discount with other promotional coupons?',
    a: 'Stack discounts provide our highest automatic volume pricing (up to 15% off). Because this is an all-inclusive volume tier, standard promotional discount coupons do not stack on top of stack savings.',
  },
  {
    q: 'Can I customize a preset stack or add more products later?',
    a: 'Absolutely. Clicking "Load This Stack" populates your stack with the preset items. You can then change flavors, adjust quantities, add additional formulas, or delete items freely from the stack panel.',
  },
  {
    q: 'What does Pre-Order mean and when will my stack ship?',
    a: 'Every UFO LABZ formula is currently in Swiss Batch 01 production. Pre-ordering reserves your batch allocation directly from our manufacturing laboratory. Batch 01 dispatch begins in Late March 2027. You may cancel your pre-order anytime prior to shipment for an instant 100% full refund.',
  },
]

export default function BuildYourStackClient({
  products,
  initialTiers = DEFAULT_STACK_TIERS,
  initialPresets = DEFAULT_PRESET_STACKS,
}: BuildYourStackClientProps) {
  const router = useRouter()
  const { addItem, openCart } = useCart()

  // ─── Stack Selection State ─────────────────────────────────────────────
  const [stackItems, setStackItems] = useState<StackLineItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [selectedFlavorsByFamily, setSelectedFlavorsByFamily] = useState<Record<string, string>>({
    eaa: 'amino-fuel-mango',
    blast: 'blast-pre-workout-energy',
  })
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // ─── FAQ Accordion State ───────────────────────────────────────────────
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  // ─── Email Capture State ───────────────────────────────────────────────
  const [emailInput, setEmailInput] = useState('')
  const [consentChecked, setConsentChecked] = useState(true)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [emailMessage, setEmailMessage] = useState('')

  // ─── Categories ────────────────────────────────────────────────────────
  const categories = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return ['ALL', ...Array.from(set)]
  }, [products])

  // ─── Filtered Products ─────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'ALL') return products
    return products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase())
  }, [products, selectedCategory])

  // ─── Live Calculation ──────────────────────────────────────────────────
  const calculation = useMemo(() => {
    return calculateStackDiscount(
      stackItems.map((item) => ({
        slug: item.slug,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      'CHF',
      initialTiers
    )
  }, [stackItems, initialTiers])

  const freeShippingThreshold = SHIPPING_CONFIG.switzerland.freeThreshold
  const shippingFee = calculation.isFreeShipping ? 0 : SHIPPING_CONFIG.switzerland.standardFee
  const estimatedTotal = calculation.discountedSubtotal + (calculation.totalUnits > 0 ? shippingFee : 0)

  // ─── Handlers ──────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3200)
  }

  const handleFlavorChange = (familyKey: string, flavorSlug: string) => {
    setSelectedFlavorsByFamily((prev) => ({
      ...prev,
      [familyKey]: flavorSlug,
    }))
  }

  const handleAddProductToStack = (product: StackProductCardItem) => {
    let targetSlug = product.slug
    let targetName = product.name
    let targetFlavor = 'Standard'
    let targetColor = product.color
    let targetImage = product.imageUrl
    let targetSku = product.sku
    let targetVariantId = product.variantId

    // If product has flavors, resolve chosen flavor
    if (product.hasVariants && product.flavors.length > 0) {
      const familyKey = product.slug.includes('amino')
        ? 'eaa'
        : product.slug.includes('blast')
        ? 'blast'
        : ''
      const chosenSlug = selectedFlavorsByFamily[familyKey] || product.flavors[0].slug
      const chosen = product.flavors.find((f) => f.slug === chosenSlug) || product.flavors[0]
      targetSlug = chosen.slug
      targetFlavor = chosen.flavorName
      targetColor = chosen.color
      targetImage = chosen.imageUrl
    }

    const canonicalPrice = getCanonicalUnitPrice(targetSlug, 'CHF', product.basePrice)

    setStackItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.slug === targetSlug)
      if (existingIdx > -1) {
        const next = [...prev]
        next[existingIdx].quantity += 1
        return next
      }
      return [
        ...prev,
        {
          id: `stack-${targetSlug}-${Date.now()}`,
          slug: targetSlug,
          name: targetName,
          flavorName: targetFlavor !== 'Standard' ? targetFlavor : undefined,
          color: targetColor,
          imageUrl: targetImage,
          unitPrice: canonicalPrice,
          quantity: 1,
          variantId: targetVariantId,
          sku: targetSku,
        },
      ]
    })

    showToast(`Added ${targetName} to your stack!`)
  }

  const handleUpdateQuantity = (slug: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(slug)
      return
    }
    setStackItems((prev) =>
      prev.map((item) => (item.slug === slug ? { ...item, quantity: newQty } : item))
    )
  }

  const handleRemoveItem = (slug: string) => {
    setStackItems((prev) => prev.filter((item) => item.slug !== slug))
  }

  const handleLoadPreset = (preset: PresetStackDef) => {
    const loadedItems: StackLineItem[] = preset.items.map((item) => {
      const price = getCanonicalUnitPrice(item.slug, 'CHF')
      return {
        id: `preset-${item.slug}-${Date.now()}`,
        slug: item.slug,
        name: item.name,
        flavorName: item.flavorName,
        color: item.color,
        imageUrl: item.imageUrl,
        unitPrice: price,
        quantity: item.quantity,
        variantId: item.sku || item.slug,
        sku: item.sku || item.slug,
      }
    })

    setStackItems(loadedItems)
    showToast(`Loaded ${preset.name}!`)

    // Scroll to the stack panel or open mobile drawer
    if (window.innerWidth < 1024) {
      setIsMobileDrawerOpen(true)
    } else {
      const panelEl = document.getElementById('stack-panel-desktop')
      if (panelEl) {
        panelEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }

  const handleCheckoutStack = async () => {
    if (stackItems.length === 0) return
    setIsSubmitting(true)

    try {
      // Add all stack items into the global cart
      for (const item of stackItems) {
        await addItem(item.variantId || item.slug, item.quantity, {
          product: { slug: item.slug, name: item.name },
          variant: {
            id: item.variantId || item.slug,
            sku: item.sku,
            price: item.unitPrice,
            product: { slug: item.slug, name: item.name },
          },
          source: 'stack',
          stack_id: `stack-${Date.now()}`,
        })
      }

      setIsMobileDrawerOpen(false)
      // Navigate to checkout directly
      router.push('/checkout')
    } catch (err) {
      console.error('Failed to add stack to cart:', err)
      showToast('Error transferring stack to checkout. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput || !emailInput.includes('@')) {
      setEmailStatus('error')
      setEmailMessage('Please enter a valid email address.')
      return
    }

    if (!consentChecked) {
      setEmailStatus('error')
      setEmailMessage('Please agree to receive UFO LABZ launch and restock notifications.')
      return
    }

    setEmailStatus('loading')
    try {
      const res = await fetch('/api/email/stack-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, consent: true }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to subscribe.')
      }
      setEmailStatus('success')
      setEmailMessage('Registration confirmed! Check your inbox for your batch welcome notice.')
      setEmailInput('')
    } catch (err: any) {
      setEmailStatus('error')
      setEmailMessage(err.message || 'Something went wrong. Please try again.')
    }
  }

  // Visual slot representations (default 3 slots)
  const slotCount = Math.max(3, stackItems.reduce((acc, i) => acc + i.quantity, 0))
  const flattenedUnits: Array<StackLineItem | null> = []
  stackItems.forEach((item) => {
    for (let q = 0; q < item.quantity; q++) {
      flattenedUnits.push(item)
    }
  })
  while (flattenedUnits.length < slotCount) {
    flattenedUnits.push(null)
  }

  return (
    <div className="min-h-screen bg-space-950 text-white selection:bg-alien-green selection:text-space-950 font-sans pb-24">
      {/* ─── Floating Toast Notification ─── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-space-900/90 border border-alien-green/40 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-glow-green animate-fade-in flex items-center gap-2.5 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-alien-green animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative pt-28 pb-16 overflow-hidden border-b border-white/5">
        {/* Cosmic Backdrop Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-alien-green/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto container-px relative z-10 text-center">
          {/* Top Breadcrumb & Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alien-green/10 border border-alien-green/30 text-alien-green text-xs font-mono font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Batch 01 Protocol · Volume Savings</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-white uppercase mb-6 leading-none">
            BUILD YOUR <span className="text-alien-green">STACK</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Curate your custom UFO LABZ performance system. Mix and match any Swiss formulations
            and flavors — bundle 2 to save 10%, or 3+ to unlock an automatic 15% discount.
          </p>

          {/* Interactive Tier Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-space-900 border border-white/10 text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-alien-green" />
              <span className="text-gray-400">Step 1:</span>
              <strong className="text-white">2 Items = 10% OFF</strong>
            </div>

            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-space-900 border border-alien-green/40 shadow-glow-green text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-alien-green animate-pulse" />
              <span className="text-alien-green font-bold">Step 2:</span>
              <strong className="text-white">3+ Items = 15% OFF</strong>
            </div>

            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-space-900 border border-white/10 text-xs font-mono">
              <Truck className="w-3.5 h-3.5 text-alien-green" />
              <span className="text-gray-400">Bonus:</span>
              <strong className="text-white">Free Swiss Delivery over CHF 50</strong>
            </div>
          </div>

          {/* CTA Scroll Anchor */}
          <a
            href="#picker-section"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-alien-green text-space-950 font-bold font-mono text-sm hover:shadow-glow-green transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Start Building Your Stack</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ─── 2. SCROLLING ANNOUNCEMENT STRIP ─── */}
      <div className="relative py-3 bg-alien-green text-space-950 overflow-hidden font-mono text-xs font-extrabold uppercase tracking-widest border-y border-space-950/20 select-none">
        <div className="flex whitespace-nowrap animate-marquee motion-reduce:animate-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 mx-4">
              <span>PICK 2 SAVE 10%</span>
              <span>·</span>
              <span>MIX ANY PRODUCTS &amp; FLAVORS</span>
              <span>·</span>
              <span>PICK 3+ SAVE 15%</span>
              <span>·</span>
              <span>AUTOMATICALLY APPLIED AT CHECKOUT</span>
              <span>·</span>
              <span>FREE SWISS POSTAGE FROM CHF 50</span>
              <span>·</span>
              <span>100% PRE-ORDER GUARANTEE</span>
              <span>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── 3. MAIN INTERACTIVE PICKER & STACK PANEL ─── */}
      <section id="picker-section" className="py-16 max-w-7xl mx-auto container-px">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── LEFT COLUMN: PRODUCT PICKER (7 cols) ── */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-alien-green font-bold">
                  STEP 01
                </span>
                <h2 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-wider">
                  SELECT YOUR FORMULAS
                </h2>
              </div>
              <span className="text-xs font-mono text-gray-400">
                {stackItems.reduce((acc, i) => acc + i.quantity, 0)} units added
              </span>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-200 uppercase',
                    selectedCategory === cat
                      ? 'bg-alien-green text-space-950 shadow-glow-green'
                      : 'bg-space-900 border border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                  )}
                >
                  {cat === 'ALL' ? 'All Formulations' : cat}
                </button>
              ))}
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((product) => {
                const familyKey = product.slug.includes('amino')
                  ? 'eaa'
                  : product.slug.includes('blast')
                  ? 'blast'
                  : ''
                const currentChosenFlavorSlug =
                  selectedFlavorsByFamily[familyKey] || product.flavors?.[0]?.slug || product.slug

                // Determine active flavor card data
                const activeFlavor =
                  product.flavors?.find((f) => f.slug === currentChosenFlavorSlug) || {
                    slug: product.slug,
                    flavorName: 'Pure Formula',
                    color: product.color,
                    imageUrl: product.imageUrl,
                  }

                const canonicalPrice = getCanonicalUnitPrice(
                  activeFlavor.slug || product.slug,
                  'CHF',
                  product.basePrice
                )

                // Check quantity currently in stack
                const inStackItem = stackItems.find(
                  (i) => i.slug === (activeFlavor.slug || product.slug)
                )
                const inStackQty = inStackItem ? inStackItem.quantity : 0

                return (
                  <div
                    key={product.id}
                    className="group card-glass p-4 rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-alien-green/20 border border-alien-green/40 text-alien-green uppercase">
                          PRE-ORDER
                        </span>
                        <span
                          className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${activeFlavor.color}15`,
                            color: activeFlavor.color,
                            border: `1px solid ${activeFlavor.color}40`,
                          }}
                        >
                          {product.category}
                        </span>
                      </div>

                      {/* Product Canister Visual */}
                      <div className="relative aspect-square w-full rounded-2xl bg-space-950/60 p-4 mb-3 flex items-center justify-center overflow-hidden border border-white/5">
                        <div
                          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity blur-2xl rounded-full"
                          style={{ backgroundColor: activeFlavor.color }}
                        />
                        <Image
                          src={activeFlavor.imageUrl || product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      </div>

                      {/* Product Titles */}
                      <h3 className="font-display text-lg text-white tracking-wide uppercase line-clamp-1 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 leading-snug line-clamp-2 mb-3">
                        {product.tagline}
                      </p>

                      {/* Flavor Selector (for multi-flavor products) */}
                      {product.hasVariants && product.flavors.length > 1 && (
                        <div className="mb-4 space-y-1.5">
                          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex justify-between">
                            <span>Flavor:</span>
                            <span className="font-bold text-white">
                              {activeFlavor.flavorName}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            {product.flavors.map((flv) => {
                              const isSelected = flv.slug === activeFlavor.slug
                              return (
                                <button
                                  key={flv.slug}
                                  type="button"
                                  onClick={() => handleFlavorChange(familyKey, flv.slug)}
                                  className={cn(
                                    'flex items-center gap-1.5 p-1.5 rounded-xl border text-[11px] font-mono transition-all text-left',
                                    isSelected
                                      ? 'bg-white/10 text-white font-bold'
                                      : 'bg-space-950/60 border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                                  )}
                                  style={isSelected ? { borderColor: flv.color } : {}}
                                >
                                  <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
                                    style={{ backgroundColor: flv.color }}
                                  />
                                  <span className="truncate">{flv.flavorName}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Pricing & Add Action */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-auto">
                      <div>
                        <div className="font-mono text-sm font-bold text-white">
                          {formatPrice(canonicalPrice)}
                        </div>
                        <span className="text-[9px] font-mono text-alien-green">
                          Save up to 15% in stack
                        </span>
                      </div>

                      {inStackQty > 0 ? (
                        <div className="flex items-center gap-2 bg-space-950 border border-alien-green/40 rounded-xl p-1 shadow-glow-green">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(activeFlavor.slug, inStackQty - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-xs font-bold text-alien-green px-1">
                            {inStackQty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(activeFlavor.slug, inStackQty + 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-alien-green text-space-950 hover:bg-alien-green/90 font-bold"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddProductToStack(product)}
                          className="px-4 py-2 rounded-xl bg-alien-green text-space-950 font-bold font-mono text-xs hover:shadow-glow-green transition-all active:scale-95 flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Stack</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── RIGHT COLUMN: STICKY STACK PANEL (5 cols) ── */}
          <div className="lg:col-span-5">
            <div
              id="stack-panel-desktop"
              className="hidden lg:block sticky top-24 bg-space-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 backdrop-blur-xl"
            >
              {/* Stack Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-alien-green" />
                  <h3 className="font-display text-2xl tracking-wider text-white uppercase">
                    YOUR STACK
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-alien-green/10 border border-alien-green/30 text-alien-green">
                  {calculation.totalUnits} {calculation.totalUnits === 1 ? 'Unit' : 'Units'}
                </span>
              </div>

              {/* Tier Progress Indicator */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-space-950 border border-white/5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-gray-400">Stack Savings Tier</span>
                  <span className="font-bold text-alien-green">
                    {calculation.discountPercent > 0
                      ? `${calculation.discountPercent}% Discount Applied`
                      : 'No Discount Yet'}
                  </span>
                </div>

                {/* Progress Visual Bar */}
                <div className="h-2 bg-space-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-alien-green transition-all duration-500 shadow-glow-green"
                    style={{
                      width:
                        calculation.totalUnits === 0
                          ? '5%'
                          : calculation.totalUnits === 1
                          ? '33%'
                          : calculation.totalUnits === 2
                          ? '66%'
                          : '100%',
                    }}
                  />
                </div>

                <div className="flex justify-between text-[10px] font-mono text-gray-500 pt-1">
                  <span>0 Units (0%)</span>
                  <span className={calculation.totalUnits >= 2 ? 'text-alien-green font-bold' : ''}>
                    2 Units (10%)
                  </span>
                  <span className={calculation.totalUnits >= 3 ? 'text-alien-green font-bold' : ''}>
                    3+ Units (15%)
                  </span>
                </div>

                {/* Live Nudge */}
                <div className="text-[11px] text-gray-300 font-mono flex items-center gap-1.5 pt-1">
                  <Sparkles className="w-3.5 h-3.5 text-alien-green shrink-0" />
                  <span>{calculation.nudgeMessage}</span>
                </div>
              </div>

              {/* 3 Visual Slots (Filling dynamic visual slots) */}
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase text-gray-400 tracking-wider">
                  Protocol Allocation Slots:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {flattenedUnits.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'relative aspect-square rounded-2xl border p-2 flex flex-col items-center justify-center text-center transition-all',
                        item
                          ? 'bg-space-950 border-white/20'
                          : 'border-dashed border-white/10 bg-space-950/40 text-gray-600'
                      )}
                    >
                      {item ? (
                        <>
                          <div className="relative w-full h-12 mb-1">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="text-[9px] font-bold text-white line-clamp-1">
                            {item.name}
                          </span>
                          <span className="text-[8px] font-mono text-alien-green">
                            {item.flavorName || 'Formula'}
                          </span>
                        </>
                      ) : (
                        <div className="space-y-1">
                          <Plus className="w-4 h-4 mx-auto text-gray-600" />
                          <span className="text-[9px] font-mono block">
                            Slot 0{idx + 1}
                          </span>
                          <span className="text-[8px] font-mono text-gray-500">
                            {idx === 1 ? '10% Tier' : idx === 2 ? '15% Tier' : 'Open'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Line Items List */}
              {stackItems.length > 0 ? (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 no-scrollbar border-t border-white/5 pt-3">
                  {stackItems.map((item) => (
                    <div
                      key={item.slug}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-space-950 border border-white/5 text-xs font-mono"
                    >
                      <div className="relative w-10 h-10 rounded-xl bg-space-900 border border-white/5 p-1 shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-white text-xs truncate">{item.name}</h4>
                        <div className="text-[10px] text-gray-400">
                          {item.flavorName && <span>{item.flavorName} · </span>}
                          <span>{formatPrice(item.unitPrice)}</span>
                        </div>
                      </div>

                      {/* Stepper + Delete */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.slug, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.slug, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.slug)}
                          className="w-6 h-6 rounded-lg text-gray-500 hover:text-red-400 ml-1 flex items-center justify-center"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-gray-500 text-xs font-mono border-t border-white/5">
                  Your stack is empty. Pick formulas from the left or select a curated preset below.
                </div>
              )}

              {/* Free Shipping Meter */}
              <div className="p-3.5 rounded-2xl bg-space-950/80 border border-white/5 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-gray-400">Swiss Cargo Postage</span>
                  {calculation.isFreeShipping ? (
                    <span className="text-alien-green font-bold">🚀 FREE SHIPPING EARNED</span>
                  ) : (
                    <span className="text-alien-green">
                      {formatPrice(calculation.amountUntilFreeShipping)} away from Free Shipping
                    </span>
                  )}
                </div>
                <div className="h-1.5 bg-space-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-alien-green transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        (calculation.discountedSubtotal / freeShippingThreshold) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Financial Totals */}
              <div className="space-y-2 pt-2 border-t border-white/5 text-sm font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>Stack Subtotal</span>
                  <span className="text-white">{formatPrice(calculation.rawSubtotal)}</span>
                </div>

                {calculation.discountAmount > 0 && (
                  <div className="flex justify-between text-alien-green font-bold">
                    <span>
                      Stack Volume Discount ({calculation.discountPercent}%)
                    </span>
                    <span>−{formatPrice(calculation.discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Estimated Shipping</span>
                  <span className="text-white">
                    {calculation.isFreeShipping ? 'FREE' : formatPrice(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-white/10">
                  <div>
                    <div className="font-display text-xl text-white uppercase">
                      TOTAL (INCL. VAT)
                    </div>
                    <span className="text-[10px] text-gray-500 font-sans">
                      Batch 01 Pre-Order Allocation
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-2xl font-bold text-alien-green">
                      {formatPrice(estimatedTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout CTA Button */}
              <button
                type="button"
                onClick={handleCheckoutStack}
                disabled={stackItems.length === 0 || isSubmitting}
                className={cn(
                  'w-full py-4 rounded-2xl font-mono text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all',
                  stackItems.length > 0 && !isSubmitting
                    ? 'bg-alien-green text-space-950 shadow-glow-green hover:shadow-glow-green-lg active:scale-98 cursor-pointer'
                    : 'bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed'
                )}
              >
                {isSubmitting ? (
                  <span>Reserving Protocol...</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Pre-order My Stack</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-[10px] text-gray-500 text-center flex items-center justify-center gap-1 font-mono">
                <Shield className="w-3.5 h-3.5 text-alien-green shrink-0" />
                <span>100% Risk-Free Guarantee · Cancel before dispatch anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. MOBILE FLOATING BOTTOM BAR & DRAWER ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-space-900/95 border-t border-white/10 backdrop-blur-xl p-4 flex items-center justify-between shadow-2xl">
        <div>
          <div className="text-xs font-mono text-gray-400">
            {calculation.totalUnits} {calculation.totalUnits === 1 ? 'item' : 'items'} in stack
          </div>
          <div className="font-mono text-lg font-bold text-alien-green">
            {formatPrice(estimatedTotal)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          className="px-6 py-3 rounded-xl bg-alien-green text-space-950 font-bold font-mono text-xs shadow-glow-green flex items-center gap-2"
        >
          <span>View Stack ({calculation.totalUnits})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mobile Drawer Slide-Up */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Overlay */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer Sheet */}
          <div className="relative bg-space-900 border-t border-white/15 rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 space-y-5 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-alien-green" />
                <h3 className="font-display text-xl text-white uppercase tracking-wider">
                  YOUR STACK
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Nudge */}
            <div className="p-3 rounded-2xl bg-space-950 border border-white/5 text-xs font-mono text-gray-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-alien-green shrink-0" />
              <span>{calculation.nudgeMessage}</span>
            </div>

            {/* Line items in Drawer */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {stackItems.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-space-950 border border-white/5 text-xs font-mono"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-white text-xs truncate">{item.name}</h4>
                    <span className="text-[10px] text-gray-400">
                      {item.flavorName && `${item.flavorName} · `}
                      {formatPrice(item.unitPrice)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(item.slug, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-300"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(item.slug, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.slug)}
                      className="w-7 h-7 rounded-lg text-gray-500 hover:text-red-400 ml-1 flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Financials */}
            <div className="space-y-2 pt-2 border-t border-white/5 text-xs font-mono">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(calculation.rawSubtotal)}</span>
              </div>
              {calculation.discountAmount > 0 && (
                <div className="flex justify-between text-alien-green font-bold">
                  <span>Stack Volume Discount ({calculation.discountPercent}%)</span>
                  <span>−{formatPrice(calculation.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Estimated Shipping</span>
                <span className="text-white">
                  {calculation.isFreeShipping ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>TOTAL DUE</span>
                <span className="text-alien-green font-mono">{formatPrice(estimatedTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckoutStack}
              disabled={stackItems.length === 0 || isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-alien-green text-space-950 font-bold font-mono text-sm uppercase shadow-glow-green flex items-center justify-center gap-2"
            >
              <span>Pre-order My Stack</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── 5. PRESET STACKS SECTION ─── */}
      <section className="py-20 bg-space-900 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto container-px">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-alien-green">
              CURATED PROTOCOLS
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-white uppercase tracking-wider mt-2 mb-4">
              PRESET STACKS
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Engineered by our Swiss laboratory for targeted goals. Load any preset into your
              stack with a single click, then customize flavors as desired.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {initialPresets.map((preset) => {
              // Calculate preset raw subtotal and discounted price
              const presetRawSubtotal = preset.items.reduce(
                (sum, item) => sum + getCanonicalUnitPrice(item.slug, 'CHF') * item.quantity,
                0
              )
              const presetDiscountAmount =
                Math.round(presetRawSubtotal * (preset.discountPercent / 100) * 100) / 100
              const presetFinalPrice = Math.round((presetRawSubtotal - presetDiscountAmount) * 100) / 100

              return (
                <div
                  key={preset.slug}
                  className="card-glass p-6 rounded-3xl border border-white/10 hover:border-alien-green/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-alien-green/15 border border-alien-green/30 text-alien-green uppercase">
                        {preset.badge}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {preset.items.length} Formulations
                      </span>
                    </div>

                    {/* Canister Visuals Collage */}
                    <div className="relative h-44 w-full bg-space-950/70 rounded-2xl p-4 flex items-center justify-center gap-2 overflow-hidden border border-white/5 mb-5">
                      {preset.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="relative h-full w-24 flex-1 hover:scale-105 transition-transform"
                        >
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ))}
                    </div>

                    <h3 className="font-display text-2xl text-white uppercase tracking-wider mb-1">
                      {preset.name}
                    </h3>
                    <p className="text-xs text-alien-green font-mono mb-2">
                      {preset.tagline}
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">
                      {preset.description}
                    </p>

                    {/* Included Items Checklist */}
                    <ul className="space-y-1.5 text-xs text-gray-300 mb-6 font-mono">
                      {preset.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-alien-green shrink-0" />
                          <span className="truncate">
                            {item.name} {item.flavorName ? `(${item.flavorName})` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing & Load CTA */}
                  <div className="pt-4 border-t border-white/5 space-y-3 mt-auto">
                    <div className="flex items-baseline justify-between font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(presetRawSubtotal)}
                        </span>
                        <span className="text-lg font-bold text-alien-green">
                          {formatPrice(presetFinalPrice)}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-alien-green bg-alien-green/10 border border-alien-green/20 px-2 py-0.5 rounded-full">
                        SAVE {preset.discountPercent}%
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLoadPreset(preset)}
                      className="w-full py-3 rounded-xl bg-space-950 hover:bg-white/10 text-white border border-white/15 hover:border-alien-green/50 font-mono text-xs font-bold uppercase transition-all duration-200 active:scale-98 flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-alien-green" />
                      <span>Load This Stack</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── 6. HOW IT WORKS FAQ ACCORDION ─── */}
      <section className="py-20 max-w-4xl mx-auto container-px">
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-alien-green">
            PROTOCOL INTEL
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-white uppercase tracking-wider mt-2 mb-3">
            HOW IT WORKS
          </h2>
          <p className="text-gray-400 text-sm">
            Everything you need to know about stacking, volume discounts, and pre-order shipping.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div
                key={idx}
                className="card-glass rounded-2xl border border-white/5 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-display text-lg text-white tracking-wide">
                    {faq.q}
                  </span>
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0 transition-transform duration-300',
                      isOpen && 'rotate-180 bg-alien-green/20 text-alien-green'
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-gray-300 leading-relaxed font-sans border-t border-white/5 pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── 7. EMAIL CAPTURE SECTION ─── */}
      <section className="py-20 bg-space-900 border-t border-white/5">
        <div className="max-w-3xl mx-auto container-px text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alien-green/10 border border-alien-green/30 text-alien-green text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Transmission Network</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl text-white uppercase tracking-wider mb-3">
            GET LAUNCH &amp; BATCH RESTOCK ALERTS
          </h2>

          <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Be the first to receive notifications when Swiss Batch 01 dispatches, plus exclusive
            access to future limited product drops and laboratory research releases.
          </p>

          <form onSubmit={handleEmailSignup} className="max-w-md mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address..."
                className="input flex-1 bg-space-950 border-white/10 text-xs px-4 py-3 rounded-xl focus:border-alien-green font-mono"
              />
              <button
                type="submit"
                disabled={emailStatus === 'loading'}
                className="px-6 py-3 rounded-xl bg-alien-green text-space-950 font-bold font-mono text-xs hover:shadow-glow-green transition-all uppercase shrink-0 disabled:opacity-50"
              >
                {emailStatus === 'loading' ? 'Transmitting...' : 'Join Orbit'}
              </button>
            </div>

            {/* Consent Checkbox conforming to Swiss nDSG & GDPR */}
            <label className="flex items-start gap-2.5 text-[11px] text-gray-400 text-left cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 rounded bg-space-950 border-white/20 text-alien-green focus:ring-0"
              />
              <span>
                I agree to receive UFO LABZ batch schedules and product updates. I can
                unsubscribe at any time. Protected under Swiss nDSG &amp; GDPR.
              </span>
            </label>

            {emailMessage && (
              <div
                className={cn(
                  'text-xs font-mono p-3 rounded-xl',
                  emailStatus === 'success'
                    ? 'bg-alien-green/10 border border-alien-green/30 text-alien-green'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                )}
              >
                {emailMessage}
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  )
}
