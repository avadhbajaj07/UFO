'use client'
// app/admin/page.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Shield, User, Award, CheckCircle2, AlertCircle, XCircle, 
  ChevronRight, ArrowLeft, ArrowRight, DollarSign, BarChart2, 
  Trash2, QrCode, MessageCircle, Percent, Settings, RefreshCw, Key,
  Package, Sparkles, Building, Layers, Eye, Plus, Send, Zap, 
  FileText, Check, Search, Globe, Truck, CreditCard, Heart, ShoppingBag, Star, Edit
} from 'lucide-react'
import { formatPrice } from '@/lib/utils/pricing'
import { cn } from '@/lib/utils'

// Types
interface Supplier {
  id: string
  name: string
  contact: string
  rating: number
  leadTime: string
  terms: string
}

interface Warehouse {
  name: string
  manager: string
  location: string
  stockCount: number
  occupancy: number
}

interface Batch {
  batchNo: string
  product: string
  mfgDate: string
  expiryDate: string
  lotNo: string
  status: 'SAFE' | 'EXPIRED' | 'CRITICAL'
}

interface PricingRule {
  id: string
  trigger: string
  condition: string
  action: string
  status: 'ACTIVE' | 'INACTIVE'
}

interface CustomerProfile {
  id: string
  name: string
  email: string
  spending: number
  ltv: number
  points: number
  goals: string
  status: 'VIP' | 'Regular' | 'New'
  purchaseFreq: string
}

interface Review {
  id: string
  author: string
  product: string
  rating: number
  comment: string
  status: 'PENDING' | 'APPROVED' | 'SPAM'
}

interface AutomationFlow {
  id: string
  trigger: string
  action: string
  enabled: boolean
}

// Initial Data Seeds
const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup-1', name: 'Alps Nutrition Gmbh', contact: 'Marc Weber (+41 44 888 12 12)', rating: 4.8, leadTime: '5 Working Days', terms: 'Net 30 Days' },
  { id: 'sup-2', name: 'Bio-Formulations Basel', contact: 'Dr. Anna Keller (+41 61 777 90 00)', rating: 4.9, leadTime: '3 Working Days', terms: 'Net 14 Days' }
]

const INITIAL_WAREHOUSES: Warehouse[] = [
  { name: 'Zurich Cargo Node (Main)', manager: 'Beat Meier', location: 'Industriestrasse 12, Zurich', stockCount: 14500, occupancy: 78 },
  { name: 'Geneva Depot (West)', manager: 'Sophie Laurent', location: 'Rue du Rhone 45, Geneva', stockCount: 5200, occupancy: 42 }
]

const INITIAL_BATCHES: Batch[] = [
  { batchNo: 'BATCH-AC-2026-09', product: 'Astro Creatine (500g)', mfgDate: '2026-03-10', expiryDate: '2027-09-10', lotNo: 'L-442-A', status: 'SAFE' },
  { batchNo: 'BATCH-BP-2026-08', product: 'Blast Pre-Workout (300g)', mfgDate: '2026-02-15', expiryDate: '2027-08-15', lotNo: 'L-390-C', status: 'SAFE' }
]

const INITIAL_PRICING_RULES: PricingRule[] = [
  { id: 'rule-1', trigger: 'Stock depletion alert', condition: 'Inventory < 10 units', action: 'Increase price by 5%', status: 'ACTIVE' },
  { id: 'rule-2', trigger: 'Weekend schedule', condition: 'Day is Saturday or Sunday', action: 'Apply 10% auto-discount', status: 'ACTIVE' },
  { id: 'rule-3', trigger: 'Customer loyalty matching', condition: 'Customer tag is VIP', action: 'Extra 10% discount', status: 'INACTIVE' }
]

const INITIAL_CUSTOMERS: CustomerProfile[] = [
  { id: 'cust-1', name: 'Shikha Swiss', email: 'shikha@ufolabz.ch', spending: 480.00, ltv: 950.00, points: 2400, goals: 'Muscle Gain & Tone', status: 'VIP', purchaseFreq: 'Every 20 Days' },
  { id: 'cust-2', name: 'John Zurich', email: 'john@zurich.ch', spending: 119.00, ltv: 240.00, points: 595, goals: 'Fat Loss', status: 'Regular', purchaseFreq: 'Every 35 Days' }
]

const INITIAL_REVIEWS: Review[] = [
  { id: 'rev-1', author: 'Markus K.', product: 'Blast Pre-Workout (300g)', rating: 5, comment: 'Phenomenal focus! Best preworkout in Switzerland.', status: 'PENDING' },
  { id: 'rev-2', author: 'Elena S.', product: 'Astro Creatine (500g)', rating: 4, comment: 'Very fine powder, mixes instantly in coffee.', status: 'APPROVED' }
]

const INITIAL_AUTOMATION_FLOWS: AutomationFlow[] = [
  { id: 'auto-1', trigger: 'Stock drops below Reorder Point', action: 'Draft Purchase Order & notify Supplier', enabled: true },
  { id: 'auto-2', trigger: 'Abandon Cart detected (> 45 min)', action: 'Send recover sequence email with 5% discount code', enabled: true },
  { id: 'auto-3', trigger: 'Order successfully delivered', action: 'Trigger review request email (+ 100 points)', enabled: false }
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'inventory' | 'pricing' | 'customers' | 'affiliates' | 'marketing' | 'reviews' | 'automations'>('dashboard')
  
  // Storage synced states
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [coupons, setCoupons] = useState<any[]>([])

  // Live products catalog
  const [liveProducts, setLiveProducts] = useState<any[]>([])
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [manualTitle, setManualTitle] = useState('')
  const [manualCategory, setManualCategory] = useState('variable')
  const [manualPrice, setManualPrice] = useState(49)
  const [manualBasePrice, setManualBasePrice] = useState(59)
  const [manualStock, setManualStock] = useState(150)
  const [manualDesc, setManualDesc] = useState('')
  const [manualLongDesc, setManualLongDesc] = useState('')
  const [manualFeaturedImage, setManualFeaturedImage] = useState('')
  const [manualImageGallery, setManualImageGallery] = useState('')
  const [manualKeyBenefits, setManualKeyBenefits] = useState('')
  const [manualIngredients, setManualIngredients] = useState('')
  const [manualColorCode, setManualColorCode] = useState('#00FF88')

  // Operation rules states
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(INITIAL_PRICING_RULES)
  const [newRuleTrigger, setNewRuleTrigger] = useState('Stock drops < 5')
  const [newRuleCond, setNewRuleCond] = useState('Stock is critically low')
  const [newRuleAct, setNewRuleAct] = useState('Increase Price 10%')

  // AI Product builder states
  const [aiTitle, setAiTitle] = useState('')
  const [aiCategory, setAiCategory] = useState('variable')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiResult, setAiResult] = useState<any | null>(null)

  // AI Ad copywriter states
  const [adPromoCode, setAdPromoCode] = useState('MARUTI10')
  const [adChannel, setAdChannel] = useState('facebook')
  const [adOutput, setAdOutput] = useState('')
  const [isGeneratingAd, setIsGeneratingAd] = useState(false)

  // Sourcing PO states
  const [poSupplier, setPoSupplier] = useState('Bio-Formulations Basel')
  const [poItem, setPoItem] = useState('Pure Whey Isolate Raw')
  const [poQty, setPoQty] = useState(100)
  const [poList, setPoList] = useState<any[]>([
    { id: 'PO-1002', supplier: 'Alps Nutrition Gmbh', item: 'Micronized Creatine Monohydrate', qty: 500, status: 'RECEIVED', date: '2026-06-20' },
    { id: 'PO-1003', supplier: 'Bio-Formulations Basel', item: 'L-Glutamine powder', qty: 200, status: 'SENT', date: '2026-06-26' }
  ])

  // Customer Expand state
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null)

  // Reviews Moderation list
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS)

  // Automations list
  const [automations, setAutomations] = useState<AutomationFlow[]>(INITIAL_AUTOMATION_FLOWS)
  const [openAiApiKey, setOpenAiApiKey] = useState('')

  // Load localStorage data
  useEffect(() => {
    const storedAffs = localStorage.getItem('ufo_admin_affiliates')
    const storedCoupons = localStorage.getItem('ufo_admin_coupons')
    const storedProducts = localStorage.getItem('ufo_catalog_products')
    const storedApiKey = localStorage.getItem('ufo_openai_api_key')

    if (storedApiKey) {
      setOpenAiApiKey(storedApiKey)
    }

    if (storedAffs) {
      setAffiliates(JSON.parse(storedAffs))
    } else {
      const initialAffs = [
        { id: 'aff-1', name: 'Maruti Partner', email: 'maruti@affiliate.ch', phone: '+41 79 987 65 43', canton: 'Zurich', website: 'fitlife-switzerland.ch', social: 'instagram.com/fitlife_ch', status: 'APPROVED', joinedDate: '2026-05-10', salesCount: 12 }
      ]
      setAffiliates(initialAffs)
      localStorage.setItem('ufo_admin_affiliates', JSON.stringify(initialAffs))
    }

    if (storedCoupons) {
      setCoupons(JSON.parse(storedCoupons))
    } else {
      const initialCoups = [
        { code: 'MARUTI10', affiliateId: 'aff-1', affiliateName: 'Maruti Partner', discountPct: 10, commissionPct: 10, status: 'APPROVED', salesCount: 3, totalRevenue: 137.00, totalCommission: 13.70 }
      ]
      setCoupons(initialCoups)
      localStorage.setItem('ufo_admin_coupons', JSON.stringify(initialCoups))
    }

    if (storedProducts) {
      setLiveProducts(JSON.parse(storedProducts))
    } else {
      const initialProducts = [
        { id: 'prod-1', title: 'ASTRO CREATINE (500G)', category: 'VARIABLE', price: 39, stock: 450, desc: 'Pure micronized creatine monohydrate.' },
        { id: 'prod-2', title: 'BLAST PRE-WORKOUT (300G)', category: 'VARIABLE', price: 49, stock: 280, desc: 'High energy synergistic pre-workout formulation.' },
        { id: 'prod-3', title: 'AMINO FUEL MANGO (300G)', category: 'VARIABLE', price: 45, stock: 190, desc: 'Essential amino acids with natural mango flavor.' }
      ]
      setLiveProducts(initialProducts)
      localStorage.setItem('ufo_catalog_products', JSON.stringify(initialProducts))
    }
  }, [activeTab])

  // Save live products helper
  const saveProductsToStorage = (newProds: any[]) => {
    setLiveProducts(newProds)
    localStorage.setItem('ufo_catalog_products', JSON.stringify(newProds))
  }

  // Save AI generated product
  const handleSaveAiProductToCatalog = () => {
    if (!aiResult) return
    const exists = liveProducts.some(p => p.title === aiResult.title)
    if (exists) {
      alert('A product with this title already exists in the catalog!')
      return
    }

    const newProd = {
      id: `prod-${Math.floor(100 + Math.random() * 900)}`,
      title: aiResult.title,
      slug: aiResult.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: aiResult.category.replace(' PRODUCT', ''),
      price: 59,
      base_price: 69,
      stock: 100,
      desc: aiResult.shortDesc,
      longDesc: aiResult.longDesc,
      featuredImage: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600',
      imageGallery: ['https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600'],
      keyBenefits: ['Premium Bioavailability', 'Tested In Swiss Laboratory', 'Optimized Muscle Synthesis'],
      ingredients: aiResult.ingredients,
      product_color: '#00FF88',
      color_name: 'Alien Green'
    }

    const updated = [...liveProducts, newProd]
    saveProductsToStorage(updated)
    alert(`"${aiResult.title}" has been successfully saved to your live product catalog!`)
  }

  // Load product to form for editing
  const handleLoadProductForEditing = (prod: any) => {
    setEditingProduct(prod)
    setManualTitle(prod.title)
    setManualCategory(prod.category.toLowerCase())
    setManualPrice(prod.price)
    setManualBasePrice(prod.base_price || prod.price)
    setManualStock(prod.stock)
    setManualDesc(prod.desc || '')
    setManualLongDesc(prod.longDesc || '')
    setManualFeaturedImage(prod.featuredImage || '')
    setManualImageGallery(prod.imageGallery ? prod.imageGallery.join(', ') : '')
    setManualKeyBenefits(prod.keyBenefits ? prod.keyBenefits.join(', ') : '')
    setManualIngredients(prod.ingredients || '')
    setManualColorCode(prod.product_color || '#00FF88')
    alert(`Loaded "${prod.title}" details into the form above for editing.`)
  }

  // Cancel edit mode
  const handleCancelEditing = () => {
    setEditingProduct(null)
    setManualTitle('')
    setManualDesc('')
    setManualLongDesc('')
    setManualPrice(49)
    setManualBasePrice(59)
    setManualStock(150)
    setManualFeaturedImage('')
    setManualImageGallery('')
    setManualKeyBenefits('')
    setManualIngredients('')
    setManualColorCode('#00FF88')
  }

  // Quick Inline Stock Update
  const handleUpdateStockInline = (id: string, newStock: number) => {
    const updated = liveProducts.map(p => p.id === id ? { ...p, stock: Math.max(0, newStock) } : p)
    saveProductsToStorage(updated)
  }

  // Create or Update manual product
  const handleCreateManualProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualTitle) return

    if (editingProduct) {
      // Update Mode
      const updated = liveProducts.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            title: manualTitle.toUpperCase(),
            slug: manualTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            category: manualCategory.toUpperCase(),
            price: manualPrice,
            base_price: manualBasePrice,
            stock: manualStock,
            desc: manualDesc,
            longDesc: manualLongDesc || manualDesc,
            featuredImage: manualFeaturedImage,
            imageGallery: manualImageGallery ? manualImageGallery.split(',').map(url => url.trim()) : [manualFeaturedImage],
            keyBenefits: manualKeyBenefits ? manualKeyBenefits.split(',').map(b => b.trim()) : ['Premium Bioavailability', 'Tested In Swiss Laboratory', 'Optimized Muscle Synthesis'],
            ingredients: manualIngredients,
            product_color: manualColorCode || '#00FF88'
          }
        }
        return p
      })
      saveProductsToStorage(updated)
      setEditingProduct(null)
      alert(`Successfully updated product details for "${manualTitle.toUpperCase()}"!`)
    } else {
      // Create Mode
      const exists = liveProducts.some(p => p.title.toUpperCase() === manualTitle.toUpperCase())
      if (exists) {
        alert('A product with this title already exists in the catalog!')
        return
      }

      const newProd = {
        id: `prod-${Math.floor(100 + Math.random() * 900)}`,
        title: manualTitle.toUpperCase(),
        slug: manualTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        category: manualCategory.toUpperCase(),
        price: manualPrice,
        base_price: manualBasePrice,
        stock: manualStock,
        desc: manualDesc || 'No description provided.',
        longDesc: manualLongDesc || manualDesc || 'No description provided.',
        featuredImage: manualFeaturedImage || 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600',
        imageGallery: manualImageGallery ? manualImageGallery.split(',').map(url => url.trim()) : [manualFeaturedImage || 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600'],
        keyBenefits: manualKeyBenefits ? manualKeyBenefits.split(',').map(b => b.trim()) : ['Premium Bioavailability', 'Tested In Swiss Laboratory', 'Optimized Muscle Synthesis'],
        ingredients: manualIngredients || 'Micronized high-grade formulation',
        product_color: manualColorCode || '#00FF88',
        color_name: 'Alien Green'
      }

      const updated = [...liveProducts, newProd]
      saveProductsToStorage(updated)
      alert(`Successfully added product: "${newProd.title}"!`)
    }
    
    // Clear inputs
    setManualTitle('')
    setManualDesc('')
    setManualLongDesc('')
    setManualPrice(49)
    setManualBasePrice(59)
    setManualStock(150)
    setManualFeaturedImage('')
    setManualImageGallery('')
    setManualKeyBenefits('')
    setManualIngredients('')
    setManualColorCode('#00FF88')
  }

  // Delete product
  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product from the live catalog?')) {
      const updated = liveProducts.filter(p => p.id !== id)
      saveProductsToStorage(updated)
    }
  }

  // Save updates helper
  const saveCouponsToStorage = (newCoups: any[]) => {
    setCoupons(newCoups)
    localStorage.setItem('ufo_admin_coupons', JSON.stringify(newCoups))
  }

  const saveAffiliatesToStorage = (newAffs: any[]) => {
    setAffiliates(newAffs)
    localStorage.setItem('ufo_admin_affiliates', JSON.stringify(newAffs))
  }

  // Affiliate Actions
  const handleApproveAffiliate = (id: string) => {
    saveAffiliatesToStorage(affiliates.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a))
  }

  const handleSuspendAffiliate = (id: string) => {
    saveAffiliatesToStorage(affiliates.map(a => a.id === id ? { ...a, status: 'SUSPENDED' } : a))
  }

  // Coupon Actions
  const handleApproveCoupon = (code: string) => {
    saveCouponsToStorage(coupons.map(c => c.code === code ? { ...c, status: 'APPROVED' } : c))
  }

  const handleRejectCoupon = (code: string) => {
    saveCouponsToStorage(coupons.map(c => c.code === code ? { ...c, status: 'REJECTED' } : c))
  }

  const handleUpdateRates = (code: string, discount: number, commission: number) => {
    saveCouponsToStorage(coupons.map(c => c.code === code ? { ...c, discountPct: discount, commissionPct: commission } : c))
  }

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('ufo_openai_api_key', openAiApiKey)
    alert('OpenAI API Key successfully configured and saved in browser storage!')
  }

  // AI Product Builder simulation
  const handleGenerateAiProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiTitle) return
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)

    setAiResult({
      title: aiTitle.toUpperCase(),
      category: aiCategory.toUpperCase() + ' PRODUCT',
      shortDesc: `Premium formulation containing high-grade ingredients optimized specifically for Swiss athletes striving to unlock maximum energy output.`,
      longDesc: `Our advanced synthesis utilizes micronized active elements providing instantaneous bioavailability. Specifically designed to optimize training volume, cellular recovery ratios, and sustained focus indices.`,
      seoTitle: `Buy ${aiTitle} | UFO LABZ Swiss Supplement`,
      seoDesc: `Get premium ${aiTitle} with priority PostPac dispatch. Certified laboratory formulations engineered for Swiss endurance athletes.`,
      ingredients: `Micronized compounds, organic flavors, magnesium citrate, silicon dioxide.`,
      faqs: [
        { q: 'How should I stack this product?', a: 'We recommend stacking with Astro Creatine for optimal cellular energy replication.' },
        { q: 'Is this batch lab tested?', a: 'Yes, every batch undergoes independent microbiological screening at our Swiss testing facilities.' }
      ],
      deTranslation: {
        title: `${aiTitle} Premium Pulver`,
        shortDesc: `Premium-Formel mit hochwertigen Inhaltsstoffen, die speziell für Schweizer Athleten optimiert wurde.`
      }
    })
  }

  // AI Campaign Ad Generator
  const handleGenerateCampaignAd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGeneratingAd(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsGeneratingAd(false)

    let copy = ''
    if (adChannel === 'facebook') {
      copy = `🪐 COSMIC FORMULAS FOR Swiss Peak Performance. Reorder your supplement stack with an extra 10% discount using code ${adPromoCode} during checkout. 🇨🇭 FAST Priority PostPac shipping. Shop now at ufolabz.ch!`
    } else if (adChannel === 'instagram') {
      copy = `⚡️ LEVEL UP! Swiss-engineered pure performance supplements. Science-backed, lab-tested, sugar-free. Use my exclusive coupon code ${adPromoCode} to get 10% off your entire cart. 🛸 Link in bio! #ufolabz #swissfit`
    } else {
      copy = `Subject: Upgrade your athletic parameters 🛸\n\nDear Athlete,\n\nWe have unlocked high-impact stacks at UFO LABZ. Get 10% off your entire order by entering coupon code ${adPromoCode} during checkout. Click here to shop: https://ufolabz.ch`
    }
    setAdOutput(copy)
  }

  // Sourcing PO handler
  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault()
    const newPO = {
      id: `PO-${Math.floor(1004 + Math.random() * 1000)}`,
      supplier: poSupplier,
      item: poItem,
      qty: poQty,
      status: 'SENT',
      date: new Date().toISOString().split('T')[0]
    }
    setPoList([newPO, ...poList])
    alert(`Purchase Order ${newPO.id} successfully created and sent to ${newPO.supplier}!`)
  }

  // Pricing Rule handler
  const handleCreatePricingRule = (e: React.FormEvent) => {
    e.preventDefault()
    const newRule: PricingRule = {
      id: `rule-${pricingRules.length + 1}`,
      trigger: newRuleTrigger,
      condition: newRuleCond,
      action: newRuleAct,
      status: 'ACTIVE'
    }
    setPricingRules([...pricingRules, newRule])
    setNewRuleTrigger('')
    setNewRuleCond('')
    setNewRuleAct('')
  }

  const togglePricingRule = (id: string) => {
    setPricingRules(pricingRules.map(r => r.id === id ? { ...r, status: r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : r))
  }

  // Reviews moderation handlers
  const handleReviewAction = (id: string, action: 'APPROVED' | 'SPAM') => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: action } : r))
  }

  // Automations handler
  const toggleAutomation = (id: string) => {
    setAutomations(automations.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a))
  }

  return (
    <div className="min-h-screen bg-space-950 text-white selection:bg-alien-green selection:text-space-950 pb-20 font-sans text-left">
      
      {/* ─── SYSTEM HEADER ─── */}
      <header className="border-b border-white/5 bg-space-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-alien-green/20 border border-alien-green/40 flex items-center justify-center">
                <span className="text-alien-green text-xs font-bold font-mono">U</span>
              </div>
              <span className="font-display text-xl tracking-wider text-white">UFO LABZ</span>
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-xs font-mono text-alien-green flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>ENTERPRISE COCKPIT</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[10px] font-mono text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-alien-green animate-ping" />
              <span>Live Visitors: 14</span>
            </div>
            <Link href="/pos" className="text-xs font-mono text-alien-green hover:text-white flex items-center gap-1.5 bg-alien-green/10 border border-alien-green/20 px-3 py-1 rounded-full hover:bg-alien-green/20 transition-all font-bold">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>POS Terminal</span>
            </Link>
            <Link href="/affiliate" className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Affiliates</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── MAIN LAYOUT ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ─── SIDEBAR DIRECTORY navigation (3 cols) ─── */}
          <aside className="lg:col-span-3 bg-space-900 border border-white/5 rounded-3xl p-4 space-y-2 overflow-x-auto lg:overflow-x-visible no-scrollbar flex lg:flex-col gap-1 lg:gap-0">
            
            <div className="hidden lg:flex items-center gap-3 pb-4 mb-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-full bg-alien-green/10 border border-alien-green/20 flex items-center justify-center text-lg">
                ⚙️
              </div>
              <div>
                <div className="font-bold text-sm text-white">Command Deck</div>
                <span className="text-[9px] text-alien-green font-mono uppercase font-bold tracking-widest">Shopify Plus Engine</span>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap lg:w-full",
                activeTab === 'dashboard' ? "bg-alien-green text-space-950 font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <BarChart2 className="w-4 h-4 flex-shrink-0" />
              <span>Exec Dashboard</span>
            </button>

            <button 
              onClick={() => setActiveTab('products')}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap lg:w-full",
                activeTab === 'products' ? "bg-alien-green text-space-950 font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Package className="w-4 h-4 flex-shrink-0" />
              <span>AI Product Builder</span>
            </button>

            <button 
              onClick={() => setActiveTab('inventory')}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap lg:w-full",
                activeTab === 'inventory' ? "bg-alien-green text-space-950 font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Building className="w-4 h-4 flex-shrink-0" />
              <span>Sourcing & Warehousing</span>
            </button>

            <button 
              onClick={() => setActiveTab('pricing')}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap lg:w-full",
                activeTab === 'pricing' ? "bg-alien-green text-space-950 font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Percent className="w-4 h-4 flex-shrink-0" />
              <span>Dynamic Pricing Rules</span>
            </button>

            <button 
              onClick={() => setActiveTab('customers')}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap lg:w-full",
                activeTab === 'customers' ? "bg-alien-green text-space-950 font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <User className="w-4 h-4 flex-shrink-0" />
              <span>Customer CRM</span>
            </button>

            <button 
              onClick={() => setActiveTab('affiliates')}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap lg:w-full",
                activeTab === 'affiliates' ? "bg-alien-green text-space-950 font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Award className="w-4 h-4 flex-shrink-0" />
              <span>Affiliate Approvals</span>
            </button>

            <button 
              onClick={() => setActiveTab('marketing')}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap lg:w-full",
                activeTab === 'marketing' ? "bg-alien-green text-space-950 font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>Ad Campaigns</span>
            </button>

            <button 
              onClick={() => setActiveTab('reviews')}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap lg:w-full",
                activeTab === 'reviews' ? "bg-alien-green text-space-950 font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Star className="w-4 h-4 flex-shrink-0" />
              <span>Reviews Moderation</span>
            </button>

            <button 
              onClick={() => setActiveTab('automations')}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap lg:w-full",
                activeTab === 'automations' ? "bg-alien-green text-space-950 font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Zap className="w-4 h-4 flex-shrink-0" />
              <span>Automation Engine</span>
            </button>

          </aside>

          {/* ─── MAIN CONTROL CARD (9 cols) ─── */}
          <main className="lg:col-span-9 bg-space-900 border border-white/5 rounded-3xl p-6 md:p-8 min-h-[600px] relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient pointer-events-none rounded-3xl">
              <div className="absolute top-10 right-10 w-80 h-80 bg-alien-green/5 blur-[80px]" />
            </div>

            <div className="relative z-10 w-full">
              
              {/* 📊 TAB 1: EXECUTIVE DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-display text-3xl uppercase tracking-wide text-white">EXECUTIVE OVERVIEW</h2>
                    <p className="text-xs text-gray-400">Enterprise operational parameters across Swiss client domains.</p>
                  </div>

                  {/* Operational Telemetry Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                    <div className="bg-space-950 border border-white/5 p-4 rounded-2xl relative overflow-hidden">
                      <span className="text-[10px] text-gray-500 font-bold block uppercase">Today's Revenue</span>
                      <span className="text-xl font-bold text-white mt-1 block">CHF 1,840.50</span>
                      <span className="text-[9px] text-alien-green">+14.2% from yesterday</span>
                    </div>

                    <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                      <span className="text-[10px] text-gray-500 font-bold block uppercase">Net Profit Margin</span>
                      <span className="text-xl font-bold text-white mt-1 block">34.6%</span>
                      <span className="text-[9px] text-alien-green">CHF 636.80 net today</span>
                    </div>

                    <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                      <span className="text-[10px] text-gray-500 font-bold block uppercase">Average Order Value</span>
                      <span className="text-xl font-bold text-white mt-1 block">CHF 98.40</span>
                      <span className="text-[9px] text-gray-400">Target goal: CHF 100.00</span>
                    </div>

                    <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                      <span className="text-[10px] text-gray-500 font-bold block uppercase">Conversion Ratio</span>
                      <span className="text-xl font-bold text-white mt-1 block">4.92%</span>
                      <span className="text-[9px] text-alien-green">Top 10% in Supplement niche</span>
                    </div>
                  </div>

                  {/* Analytics charts simulation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* SVG Line Graph */}
                    <div className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">REVENUE TRAJECTORY (CHF)</span>
                        <span className="text-[10px] text-alien-green font-mono">LIVE FEED</span>
                      </div>
                      <div className="h-40 w-full relative flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <path 
                            d="M0 35 Q 20 20, 40 30 T 80 10 T 100 5" 
                            fill="none" 
                            stroke="#00E676" 
                            strokeWidth="2.5" 
                          />
                          <path 
                            d="M0 35 Q 20 20, 40 30 T 80 10 T 100 5 L 100 40 L 0 40 Z" 
                            fill="url(#gradient-green)" 
                            opacity="0.1" 
                          />
                          <defs>
                            <linearGradient id="gradient-green" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#00E676" />
                              <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="flex justify-between text-[8px] font-mono text-gray-500">
                        <span>08:00</span>
                        <span>12:00</span>
                        <span>16:00</span>
                        <span>20:00</span>
                        <span>24:00</span>
                      </div>
                    </div>

                    {/* Top Selling supplement stacks list */}
                    <div className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-4 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">TOP SELLING PRODUCTS</span>
                        <span className="text-[10px] text-gray-500 font-mono">By units sold</span>
                      </div>
                      
                      <div className="space-y-3 font-mono">
                        <div className="flex justify-between items-center">
                          <span className="text-white">1. Blast Pre-Workout</span>
                          <span className="text-alien-green font-bold">1,420 units (62%)</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-alien-green h-full rounded-full" style={{ width: '62%' }} />
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-white">2. Astro Creatine Pure</span>
                          <span className="text-blue-400 font-bold">890 units (38%)</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-400 h-full rounded-full" style={{ width: '38%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 📦 TAB 2: AI PRODUCT BUILDER */}
              {activeTab === 'products' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Two Column Layout: AI Creator & Manual Creator */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: AI Creator Form */}
                    <div className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-4">
                      <div>
                        <h3 className="font-display text-lg tracking-wide uppercase text-white">AI Product Generator</h3>
                        <p className="text-[10px] text-gray-400">Generate structured descriptions, SEO tags, and translations using AI.</p>
                      </div>

                      <form onSubmit={handleGenerateAiProduct} className="space-y-4 text-xs">
                        <div>
                          <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Supplement Title</label>
                          <input 
                            type="text" 
                            required
                            value={aiTitle}
                            onChange={(e) => setAiTitle(e.target.value)}
                            placeholder="e.g. Astro Beta-Alanine Pure"
                            className="input bg-space-900 border-white/5"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Product Category</label>
                          <select 
                            value={aiCategory}
                            onChange={(e) => setAiCategory(e.target.value)}
                            className="input focus:outline-none bg-space-900 border-white/5 text-white"
                          >
                            <option value="variable">Variable formulation (Flavors/Sizes)</option>
                            <option value="bundle">Product Bundle Stack</option>
                            <option value="subscription">Subscription Recurring Product</option>
                            <option value="digital">Digital Guides / E-Books</option>
                          </select>
                        </div>

                        <button 
                          type="submit" 
                          disabled={isGenerating}
                          className="w-full bg-alien-green text-space-950 font-bold h-10 rounded-xl flex items-center justify-center gap-1.5 hover:shadow-glow-green"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{isGenerating ? 'Synthesizing with AI...' : 'Generate with AI'}</span>
                        </button>
                      </form>
                    </div>

                    {/* Right: Manual Product Form */}
                    <div className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-display text-lg tracking-wide uppercase text-white">
                            {editingProduct ? 'Edit Product' : 'Manual Creator'}
                          </h3>
                          <p className="text-[10px] text-gray-400">
                            {editingProduct ? `Modifying details for "${editingProduct.title}".` : 'Specify comprehensive details to list custom products directly.'}
                          </p>
                        </div>
                        {editingProduct && (
                          <button 
                            type="button"
                            onClick={handleCancelEditing}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500 px-3 py-1 rounded-lg text-[10px] font-mono transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      <form onSubmit={handleCreateManualProduct} className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-mono text-gray-400 mb-1 block">Title *</label>
                            <input 
                              type="text" 
                              required
                              value={manualTitle}
                              onChange={(e) => setManualTitle(e.target.value)}
                              placeholder="e.g. Astro Creatine"
                              className="input bg-space-900 border-white/5 py-1 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-gray-400 mb-1 block">Category</label>
                            <select 
                              value={manualCategory}
                              onChange={(e) => setManualCategory(e.target.value)}
                              className="input focus:outline-none bg-space-900 border-white/5 text-white py-1 text-xs"
                            >
                              <option value="variable">Variable</option>
                              <option value="bundle">Bundle</option>
                              <option value="subscription">Subscription</option>
                              <option value="digital">Digital</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-[10px] font-mono text-gray-400 mb-1 block">Sale Price (CHF) *</label>
                            <input 
                              type="number" 
                              required
                              value={manualPrice}
                              onChange={(e) => setManualPrice(parseFloat(e.target.value) || 0)}
                              className="input bg-space-900 border-white/5 py-1 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-gray-400 mb-1 block">Actual Price *</label>
                            <input 
                              type="number" 
                              required
                              value={manualBasePrice}
                              onChange={(e) => setManualBasePrice(parseFloat(e.target.value) || 0)}
                              className="input bg-space-900 border-white/5 py-1 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-gray-400 mb-1 block">Stock Units *</label>
                            <input 
                              type="number" 
                              required
                              value={manualStock}
                              onChange={(e) => setManualStock(parseInt(e.target.value) || 0)}
                              className="input bg-space-900 border-white/5 py-1 text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-mono text-gray-400 mb-1 block">Featured Image URL</label>
                            <input 
                              type="text" 
                              value={manualFeaturedImage}
                              onChange={(e) => setManualFeaturedImage(e.target.value)}
                              placeholder="e.g. https://images.unsplash.com/..."
                              className="input bg-space-900 border-white/5 py-1 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-gray-400 mb-1 block">Color Hex Code</label>
                            <input 
                              type="text" 
                              value={manualColorCode}
                              onChange={(e) => setManualColorCode(e.target.value)}
                              placeholder="#00FF88"
                              className="input bg-space-900 border-white/5 py-1 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gray-400 mb-1 block">Image Gallery (Comma-separated URLs)</label>
                          <input 
                            type="text" 
                            value={manualImageGallery}
                            onChange={(e) => setManualImageGallery(e.target.value)}
                            placeholder="url1, url2, url3"
                            className="input bg-space-900 border-white/5 py-1 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gray-400 mb-1 block">Key Benefits (Comma-separated)</label>
                          <input 
                            type="text" 
                            value={manualKeyBenefits}
                            onChange={(e) => setManualKeyBenefits(e.target.value)}
                            placeholder="Tested In Swiss Labs, GMP Certified, 100% Vegan"
                            className="input bg-space-900 border-white/5 py-1 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gray-400 mb-1 block">Ingredients Matrix</label>
                          <input 
                            type="text" 
                            value={manualIngredients}
                            onChange={(e) => setManualIngredients(e.target.value)}
                            placeholder="Pure Micronized Beta-Alanine..."
                            className="input bg-space-900 border-white/5 py-1 text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-mono text-gray-400 mb-1 block">Short Description *</label>
                            <textarea 
                              required
                              value={manualDesc}
                              onChange={(e) => setManualDesc(e.target.value)}
                              placeholder="Brief product summary..."
                              rows={2}
                              className="input bg-space-900 border-white/5 py-1.5 h-12 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-gray-400 mb-1 block">Long Description</label>
                            <textarea 
                              value={manualLongDesc}
                              onChange={(e) => setManualLongDesc(e.target.value)}
                              placeholder="Detailed usage and specifications..."
                              rows={2}
                              className="input bg-space-900 border-white/5 py-1.5 h-12 text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          {editingProduct && (
                            <button 
                              type="button"
                              onClick={handleCancelEditing}
                              className="w-1/3 bg-white/5 border border-white/10 text-white font-bold h-10 rounded-xl flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors"
                            >
                              <span>Cancel</span>
                            </button>
                          )}
                          <button 
                            type="submit"
                            className={cn(
                              "font-bold h-10 rounded-xl flex items-center justify-center gap-1.5 transition-colors",
                              editingProduct ? "w-2/3 bg-alien-green text-space-950 hover:shadow-glow-green" : "w-full bg-white text-space-950 hover:bg-gray-100"
                            )}
                          >
                            {editingProduct ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            <span>{editingProduct ? 'Update Product' : 'Add to Live Catalog'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* AI Results Output Container */}
                  {aiResult && (
                    <div className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-6 text-xs animate-fade-in text-left">
                      <div className="flex justify-between items-start border-b border-white/5 pb-3 gap-4">
                        <div>
                          <span className="font-mono text-alien-green uppercase font-bold text-[10px]">AI-Generated Blueprint</span>
                          <h3 className="text-base font-bold text-white mt-1">{aiResult.title}</h3>
                          <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono text-gray-400 mt-2 inline-block">
                            {aiResult.category}
                          </span>
                        </div>
                        <button 
                          onClick={handleSaveAiProductToCatalog}
                          className="bg-alien-green text-space-950 font-bold px-4 py-2 rounded-xl flex items-center gap-1 hover:shadow-glow-green"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Generated Product</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-white font-mono text-[10px] uppercase text-gray-400">Short Description</h4>
                          <p className="text-gray-300 leading-relaxed mt-1">{aiResult.shortDesc}</p>
                        </div>

                        <div>
                          <h4 className="font-bold text-white font-mono text-[10px] uppercase text-gray-400">Long Description</h4>
                          <p className="text-gray-300 leading-relaxed mt-1">{aiResult.longDesc}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-space-900 border border-white/5 p-4 rounded-xl">
                          <div>
                            <span className="font-bold text-white font-mono text-[9px] uppercase text-alien-green">SEO Title Tag</span>
                            <div className="text-gray-300 mt-1 font-mono">{aiResult.seoTitle}</div>
                          </div>
                          <div>
                            <span className="font-bold text-white font-mono text-[9px] uppercase text-alien-green">SEO Meta Description</span>
                            <div className="text-gray-300 mt-1 font-mono">{aiResult.seoDesc}</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-white font-mono text-[10px] uppercase text-gray-400">Ingredients Matrix</h4>
                          <p className="text-gray-300 leading-relaxed mt-1 font-mono">{aiResult.ingredients}</p>
                        </div>

                        <div>
                          <h4 className="font-bold text-white font-mono text-[10px] uppercase text-gray-400">German Translation (AI Localized)</h4>
                          <div className="border border-white/5 p-3 rounded-lg bg-space-900/40">
                            <div className="font-bold text-white">{aiResult.deTranslation.title}</div>
                            <p className="text-gray-400 mt-1">{aiResult.deTranslation.shortDesc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Live Catalog Table */}
                  <div className="bg-space-950 border border-white/5 rounded-3xl overflow-hidden text-xs">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                      <span className="font-bold text-white font-mono uppercase text-[10px]">LIVE PRODUCT CATALOG</span>
                      <span className="text-[10px] text-gray-400 font-mono">Manage Active Offerings</span>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5 font-mono text-[9px] text-gray-400 uppercase">
                          <th className="p-3">Preview</th>
                          <th className="p-3">Product Info</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Actual Price</th>
                          <th className="p-3">Sale Price</th>
                          <th className="p-3">Live Stock</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {liveProducts.map((p) => (
                          <tr key={p.id}>
                            <td className="p-3">
                              <div className="w-10 h-10 rounded-lg bg-space-900 border border-white/5 overflow-hidden flex items-center justify-center relative flex-shrink-0">
                                <img 
                                  src={p.featuredImage || 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=100'} 
                                  alt="" 
                                  className="object-contain w-full h-full p-1"
                                />
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-white flex items-center gap-2">
                                <span>{p.title}</span>
                                {p.product_color && (
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.product_color }} />
                                )}
                              </div>
                              <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[280px]">{p.desc}</p>
                            </td>
                            <td className="p-3 font-mono uppercase text-gray-400">{p.category}</td>
                            <td className="p-3 font-mono text-gray-400 line-through">CHF {(p.base_price || p.price + 10).toFixed(2)}</td>
                            <td className="p-3 font-mono font-bold text-alien-green">CHF {p.price.toFixed(2)}</td>
                            <td className="p-3 font-mono">
                              <div className="flex items-center gap-1.5 font-mono">
                                <button 
                                  onClick={() => handleUpdateStockInline(p.id, p.stock - 10)}
                                  className="w-5 h-5 bg-white/5 border border-white/10 rounded flex items-center justify-center text-[10px] text-gray-400 hover:bg-white/10 hover:text-white"
                                  title="-10 units"
                                >
                                  -
                                </button>
                                <span className={cn(
                                  "font-bold min-w-[65px] text-center",
                                  p.stock < 50 ? "text-red-400" : "text-alien-green"
                                )}>{p.stock} units</span>
                                <button 
                                  onClick={() => handleUpdateStockInline(p.id, p.stock + 10)}
                                  className="w-5 h-5 bg-white/5 border border-white/10 rounded flex items-center justify-center text-[10px] text-gray-400 hover:bg-white/10 hover:text-white"
                                  title="+10 units"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center gap-2 justify-end">
                                <button 
                                  onClick={() => handleLoadProductForEditing(p)}
                                  className="text-alien-green hover:text-white font-mono text-[10px] flex items-center gap-1 hover:bg-alien-green/10 px-2 py-1 rounded border border-alien-green/20 transition-all"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="text-red-400 hover:text-red-500 font-mono text-[10px] flex items-center gap-1.5 hover:bg-red-500/5 px-2 py-1 rounded transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* 🏭 TAB 3: INVENTORY & SOURCING */}
              {activeTab === 'inventory' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-display text-3xl uppercase tracking-wide text-white">OPERATIONAL LOGISTICS</h2>
                    <p className="text-xs text-gray-400">Sourcing, Warehousing allocations, and Batch lot logs.</p>
                  </div>

                  {/* Warehouses lists */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">1. Multi-Warehouse Allocations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {INITIAL_WAREHOUSES.map((wh) => (
                        <div key={wh.name} className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-3 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white">{wh.name}</span>
                            <span className="text-[10px] font-mono text-alien-green">{wh.occupancy}% Cap.</span>
                          </div>
                          <div className="space-y-1 text-gray-400">
                            <div>Manager: <strong className="text-white">{wh.manager}</strong></div>
                            <div>Address: {wh.location}</div>
                            <div>Live Stock Units: <strong className="text-white font-mono">{wh.stockCount.toLocaleString()} units</strong></div>
                          </div>
                          {/* Occupancy bar */}
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-alien-green h-full rounded-full" style={{ width: `${wh.occupancy}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Supplier Database & PO Generator */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Suppliers List */}
                    <div className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-4 text-xs">
                      <h3 className="font-bold text-white font-mono text-[10px] uppercase text-gray-400">2. Active Raw Suppliers</h3>
                      <div className="space-y-3">
                        {INITIAL_SUPPLIERS.map((sup) => (
                          <div key={sup.id} className="border-b border-white/5 pb-2">
                            <div className="flex justify-between">
                              <span className="font-bold text-white">{sup.name}</span>
                              <span className="text-yellow-500 font-bold font-mono">★ {sup.rating}</span>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1">Lead Time: {sup.leadTime} · Terms: {sup.terms}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PO Generator Form */}
                    <form onSubmit={handleCreatePO} className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-3 text-xs">
                      <h3 className="font-bold text-white font-mono text-[10px] uppercase text-gray-400">3. Issue Purchase Order</h3>
                      
                      <div>
                        <label className="text-[9px] font-mono text-gray-400 block mb-1">Target Supplier</label>
                        <select 
                          value={poSupplier}
                          onChange={(e) => setPoSupplier(e.target.value)}
                          className="input focus:outline-none bg-space-900 border-white/5 py-1 text-xs"
                        >
                          <option value="Alps Nutrition Gmbh">Alps Nutrition Gmbh</option>
                          <option value="Bio-Formulations Basel">Bio-Formulations Basel</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-mono text-gray-400 block mb-1">Raw Ingredient</label>
                          <input 
                            type="text" 
                            value={poItem} 
                            onChange={(e) => setPoItem(e.target.value)}
                            className="input py-1 text-xs" 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono text-gray-400 block mb-1">Quantity (kg/units)</label>
                          <input 
                            type="number" 
                            value={poQty} 
                            onChange={(e) => setPoQty(parseInt(e.target.value) || 0)}
                            className="input py-1 text-xs" 
                          />
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-white text-space-950 font-bold h-9 rounded-lg text-[10px] uppercase">
                        Dispatch Purchase Order
                      </button>
                    </form>
                  </div>

                  {/* Batch Tracking Lot Ledger */}
                  <div className="bg-space-950 border border-white/5 rounded-2xl overflow-hidden text-xs">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center">
                      <span className="font-bold text-white">4. BATCH LOT LEDGER</span>
                      <span className="text-[10px] text-gray-400 font-mono">Lot numbers & Expirations</span>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5 font-mono text-[9px] text-gray-400 uppercase">
                          <th className="p-3">Batch Number</th>
                          <th className="p-3">Product Name</th>
                          <th className="p-3">Mfg Date</th>
                          <th className="p-3">Expiry Date</th>
                          <th className="p-3">Lot No.</th>
                          <th className="p-3">Safety status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {INITIAL_BATCHES.map((b) => (
                          <tr key={b.batchNo} className="font-mono">
                            <td className="p-3 text-white">{b.batchNo}</td>
                            <td className="p-3 font-sans font-bold text-white">{b.product}</td>
                            <td className="p-3 text-gray-400">{b.mfgDate}</td>
                            <td className="p-3 text-gray-400">{b.expiryDate}</td>
                            <td className="p-3 text-white">{b.lotNo}</td>
                            <td className="p-3">
                              <span className="bg-alien-green/10 border border-alien-green/20 text-alien-green px-2 py-0.5 rounded text-[8px] font-bold">
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* 🪙 TAB 4: DYNAMIC PRICING ENGINE */}
              {activeTab === 'pricing' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-display text-3xl uppercase tracking-wide text-white">DYNAMIC PRICING ENGINE</h2>
                    <p className="text-xs text-gray-400">Configure conditional rules based on inventory levels, time periods, and customer tier tags.</p>
                  </div>

                  {/* Active pricing rules list */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">1. Active Price Rule Matrices</h3>
                    
                    <div className="space-y-3 text-xs">
                      {pricingRules.map((rule) => (
                        <div key={rule.id} className="bg-space-950 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4">
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{rule.trigger}</span>
                              <span className={cn(
                                "px-1.5 py-0.5 rounded font-mono text-[8px] font-bold",
                                rule.status === 'ACTIVE' ? "bg-alien-green/10 text-alien-green" : "bg-white/5 text-gray-500"
                              )}>{rule.status}</span>
                            </div>
                            <div className="text-gray-400 mt-1 font-mono">Condition: {rule.condition} · Action: <strong className="text-alien-green">{rule.action}</strong></div>
                          </div>

                          <button 
                            onClick={() => togglePricingRule(rule.id)}
                            className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-1.5 px-3 rounded-lg border border-white/5"
                          >
                            Toggle Status
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* New Pricing Rule Form */}
                  <form onSubmit={handleCreatePricingRule} className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-4 text-xs">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">2. Establish Pricing Rule Node</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Trigger Event</label>
                        <input 
                          type="text" 
                          required
                          value={newRuleTrigger}
                          onChange={(e) => setNewRuleTrigger(e.target.value)}
                          placeholder="e.g. Stock drops < 10"
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Condition Scope</label>
                        <input 
                          type="text" 
                          required
                          value={newRuleCond}
                          onChange={(e) => setNewRuleCond(e.target.value)}
                          placeholder="e.g. Weekend Flash hours"
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Adjustment Action</label>
                        <input 
                          type="text" 
                          required
                          value={newRuleAct}
                          onChange={(e) => setNewRuleAct(e.target.value)}
                          placeholder="e.g. Increase price by 5%"
                          className="input"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="bg-alien-green text-space-950 font-bold h-11 rounded-xl w-full text-xs uppercase"
                    >
                      Save Pricing Rule
                    </button>
                  </form>
                </div>
              )}

              {/* 👥 TAB 5: CUSTOMER CRM */}
              {activeTab === 'customers' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-display text-3xl uppercase tracking-wide text-white">CUSTOMER PROFILE INDEX</h2>
                    <p className="text-xs text-gray-400">Database profiling showing lifetime values, points balances, and physical metrics.</p>
                  </div>

                  <div className="space-y-3">
                    {INITIAL_CUSTOMERS.map((c) => (
                      <div key={c.id} className="bg-space-950 border border-white/5 rounded-2xl overflow-hidden text-xs">
                        <div 
                          onClick={() => setExpandedCustomer(expandedCustomer === c.id ? null : c.id)}
                          className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-all"
                        >
                          <div>
                            <div className="font-bold text-sm text-white flex items-center gap-2">
                              <span>{c.name}</span>
                              <span className={cn(
                                "px-1.5 py-0.5 rounded font-mono text-[8px] font-bold",
                                c.status === 'VIP' ? "bg-alien-green/10 text-alien-green" : "bg-blue-500/10 text-blue-400"
                              )}>{c.status}</span>
                            </div>
                            <span className="text-gray-400 mt-1 block">{c.email}</span>
                          </div>

                          <div className="flex gap-6 font-mono text-right">
                            <div>
                              <span className="text-[9px] text-gray-500 block">Total Spend</span>
                              <span className="text-white font-bold">{formatPrice(c.spending)}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-gray-500 block">Lifetime Value (LTV)</span>
                              <span className="text-alien-green font-bold">{formatPrice(c.ltv)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Customer expanded detail card */}
                        {expandedCustomer === c.id && (
                          <div className="bg-space-900/60 border-t border-white/5 p-5 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in text-left">
                            <div>
                              <span className="text-[9px] text-gray-500 font-mono block">Loyalty Points Balance</span>
                              <span className="text-white font-bold font-mono mt-0.5 block">{c.points.toLocaleString()} Points</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-gray-500 font-mono block">Fitness Goals</span>
                              <span className="text-white font-bold mt-0.5 block">{c.goals}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-gray-500 font-mono block">Purchase Frequency</span>
                              <span className="text-white font-bold mt-0.5 block">{c.purchaseFreq}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-gray-500 font-mono block">Customer Actions</span>
                              <button 
                                onClick={() => alert(`Review points awarded successfully to ${c.name}!`)}
                                className="text-[10px] text-alien-green underline block mt-1 hover:text-white"
                              >
                                Reward 100 Points
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 🤝 TAB 6: AFFILIATE APPROVALS */}
              {activeTab === 'affiliates' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-display text-3xl uppercase tracking-wide text-white">AFFILIATE INTEGRATIONS</h2>
                    <p className="text-xs text-gray-400">Moderate affiliate signup requests, payout withdrawals, and custom discount coupons.</p>
                  </div>

                  {/* Requested Coupons moderation */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">1. Coupon Approvals Ledger</h3>
                    
                    {coupons.map((c) => (
                      <div key={c.code} className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-4 text-xs">
                        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-3 gap-2">
                          <div>
                            <span className="font-mono text-sm font-bold text-white bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                              {c.code}
                            </span>
                            <span className="text-[10px] text-gray-400 ml-3">Requested by: <strong className="text-white">{c.affiliateName}</strong></span>
                          </div>
                          <div>
                            <span className={cn(
                              "px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold",
                              c.status === 'APPROVED' ? "bg-alien-green/10 text-alien-green border border-alien-green/20" :
                              c.status === 'REJECTED' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                              "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                            )}>
                              {c.status}
                            </span>
                          </div>
                        </div>

                        {/* Edit rates panel */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                          <div>
                            <label className="text-[9px] font-mono text-gray-500 block mb-1">Customer Discount %</label>
                            <input 
                              type="number"
                              value={c.discountPct}
                              onChange={(e) => handleUpdateRates(c.code, parseInt(e.target.value) || 0, c.commissionPct)}
                              className="input text-xs font-mono py-1.5 bg-space-900 border-white/5 text-white max-w-[80px]"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-mono text-gray-500 block mb-1">Affiliate Commission %</label>
                            <input 
                              type="number"
                              value={c.commissionPct}
                              onChange={(e) => handleUpdateRates(c.code, c.discountPct, parseInt(e.target.value) || 0)}
                              className="input text-xs font-mono py-1.5 bg-space-900 border-white/5 text-white max-w-[80px]"
                            />
                          </div>

                          <div className="text-left font-mono">
                            <span className="text-[9px] text-gray-500 block">Earnings generated</span>
                            <span className="text-alien-green font-bold">{formatPrice(c.totalCommission)}</span>
                          </div>

                          <div className="text-right space-x-1.5">
                            {c.status !== 'APPROVED' && (
                              <button 
                                onClick={() => handleApproveCoupon(c.code)}
                                className="bg-alien-green text-space-950 font-bold px-3 py-1.5 rounded-lg text-[10px]"
                              >
                                Approve Code
                              </button>
                            )}
                            {c.status === 'APPROVED' && (
                              <button 
                                onClick={() => handleRejectCoupon(c.code)}
                                className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-1.5 rounded-lg text-[10px]"
                              >
                                Reject Code
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Affiliates List */}
                  <div className="bg-space-950 border border-white/5 rounded-2xl overflow-hidden text-xs pt-4 space-y-3">
                    <div className="px-4 flex justify-between items-center">
                      <span className="font-bold text-white font-mono text-[10px] uppercase text-gray-400">2. Affiliate Partner Directory</span>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5 font-mono text-[9px] text-gray-400 uppercase">
                          <th className="p-3">Name</th>
                          <th className="p-3">Email/Canton</th>
                          <th className="p-3">Social Link</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {affiliates.map((aff) => (
                          <tr key={aff.id}>
                            <td className="p-3">
                              <div className="font-bold text-white">{aff.name}</div>
                              <span className="text-[9px] text-gray-500 font-mono">Joined: {aff.joinedDate}</span>
                            </td>
                            <td className="p-3">
                              <div>{aff.email}</div>
                              <span className="text-[10px] text-gray-400 font-mono">{aff.canton}</span>
                            </td>
                            <td className="p-3">
                              <a href={`https://${aff.social}`} target="_blank" rel="noreferrer" className="text-alien-green hover:underline">
                                {aff.social}
                              </a>
                            </td>
                            <td className="p-3">
                              <span className={cn(
                                "px-2 py-0.5 rounded font-mono text-[8px] font-bold",
                                aff.status === 'APPROVED' ? "bg-alien-green/10 text-alien-green border border-alien-green/20" :
                                aff.status === 'SUSPENDED' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                                "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                              )}>
                                {aff.status}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1">
                              {aff.status !== 'APPROVED' && (
                                <button 
                                  onClick={() => handleApproveAffiliate(aff.id)}
                                  className="bg-alien-green text-space-950 font-bold px-2 py-1 rounded text-[10px]"
                                >
                                  Approve
                                </button>
                              )}
                              {aff.status === 'APPROVED' && (
                                <button 
                                  onClick={() => handleSuspendAffiliate(aff.id)}
                                  className="bg-red-500/10 border border-red-500/20 text-red-500 px-2 py-1 rounded text-[10px]"
                                >
                                  Suspend
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* 📈 TAB 7: CAMPAIGNS & MARKETING */}
              {activeTab === 'marketing' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-display text-3xl uppercase tracking-wide text-white">AI MARKETING SUITE</h2>
                    <p className="text-xs text-gray-400">Generate high-converting advertising copies for targeted channels instantly.</p>
                  </div>

                  <form onSubmit={handleGenerateCampaignAd} className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Affiliate Referral Code</label>
                        <input 
                          type="text" 
                          required
                          value={adPromoCode}
                          onChange={(e) => setAdPromoCode(e.target.value.toUpperCase())}
                          placeholder="e.g. MARUTI10"
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Target Marketing Channel</label>
                        <select 
                          value={adChannel}
                          onChange={(e) => setAdChannel(e.target.value)}
                          className="input focus:outline-none bg-space-900 border-white/5 text-white font-mono"
                        >
                          <option value="facebook">Facebook/Meta Ad copy</option>
                          <option value="instagram">Instagram Reel Caption text</option>
                          <option value="email">Email recovery sequence</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isGeneratingAd}
                      className="w-full bg-alien-green text-space-950 font-bold h-11 rounded-xl flex items-center justify-center gap-1.5 hover:shadow-glow-green"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isGeneratingAd ? 'Writing copy with AI...' : 'Generate Marketing Copies'}</span>
                    </button>
                  </form>

                  {/* Generated marketing copy */}
                  {adOutput && (
                    <div className="bg-space-950 border border-white/5 p-5 rounded-2xl text-xs space-y-3 animate-fade-in text-left">
                      <span className="font-mono text-alien-green uppercase font-bold text-[9px]">AI-Generated Copywriting</span>
                      <p className="text-gray-300 leading-relaxed font-sans bg-space-900 border border-white/5 p-4 rounded-xl whitespace-pre-wrap">{adOutput}</p>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(adOutput)
                          alert('Copywriting copied to clipboard!')
                        }}
                        className="text-[10px] text-white hover:text-alien-green underline block"
                      >
                        Copy text to clipboard
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ⭐ TAB 8: REVIEWS MODERATION */}
              {activeTab === 'reviews' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-display text-3xl uppercase tracking-wide text-white">REVIEWS MODERATION HUB</h2>
                    <p className="text-xs text-gray-400">Review, authorize, and filter verified customer reviews before publishing.</p>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="bg-space-950 border border-white/5 p-5 rounded-2xl text-xs space-y-3">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <div>
                            <span className="font-bold text-white">{r.author}</span>
                            <span className="text-[10px] text-gray-400 ml-2">Product: <strong className="text-white">{r.product}</strong></span>
                          </div>
                          <span className={cn(
                            "px-2 py-0.5 rounded font-mono text-[8px] font-bold",
                            r.status === 'APPROVED' ? "bg-alien-green/10 text-alien-green" :
                            r.status === 'SPAM' ? "bg-red-500/10 text-red-500" :
                            "bg-yellow-500/10 text-yellow-500"
                          )}>{r.status}</span>
                        </div>
                        
                        <p className="text-gray-300 italic">"{r.comment}"</p>

                        <div className="flex justify-end gap-2">
                          {r.status !== 'APPROVED' && (
                            <button 
                              onClick={() => handleReviewAction(r.id, 'APPROVED')}
                              className="bg-alien-green text-space-950 font-bold px-3 py-1.5 rounded text-[10px]"
                            >
                              Approve Review
                            </button>
                          )}
                          {r.status !== 'SPAM' && (
                            <button 
                              onClick={() => handleReviewAction(r.id, 'SPAM')}
                              className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-1.5 rounded text-[10px]"
                            >
                              Flag as Spam
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ⚡ TAB 9: AUTOMATION ENGINE */}
              {activeTab === 'automations' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-display text-3xl uppercase tracking-wide text-white">AUTOMATION ENGINE</h2>
                    <p className="text-xs text-gray-400">Trigger custom flows and integrate advanced AI assistant frameworks.</p>
                  </div>

                  {/* OpenAI API Key Integration card */}
                  <div className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-4 text-xs text-left">
                    <div>
                      <span className="font-mono text-alien-green uppercase font-bold text-[9px]">OpenAI GPT Integration</span>
                      <h4 className="text-sm font-bold text-white mt-0.5">Custom Live Chat AI Assistant API Key</h4>
                      <p className="text-gray-400 text-[10px] mt-1">
                        Input your custom ChatGPT API Key (`sk-...`) to connect your storefront's AI Live Chat widgets directly to real OpenAI models.
                        This will unlock fully personalized, dynamic supplement recommendation loops using real GPT completions.
                      </p>
                    </div>

                    <form onSubmit={handleSaveApiKey} className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="password"
                        value={openAiApiKey}
                        onChange={(e) => setOpenAiApiKey(e.target.value)}
                        placeholder="sk-proj-..."
                        className="input bg-space-900 border-white/5 flex-grow font-mono text-[11px]"
                      />
                      <button 
                        type="submit"
                        className="bg-alien-green text-space-950 font-bold px-5 h-10 rounded-xl hover:shadow-glow-green text-xs font-mono uppercase whitespace-nowrap"
                      >
                        Save API Key
                      </button>
                      {openAiApiKey && (
                        <button 
                          type="button"
                          onClick={() => {
                            localStorage.removeItem('ufo_openai_api_key')
                            setOpenAiApiKey('')
                            alert('OpenAI API Key removed successfully!')
                          }}
                          className="bg-red-500/10 border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500 px-4 h-10 rounded-xl text-xs font-mono uppercase"
                        >
                          Clear
                        </button>
                      )}
                    </form>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-mono text-gray-400 uppercase font-bold text-[9px] tracking-widest">1. Event Trigger Automations</h3>
                    {automations.map((a) => (
                      <div key={a.id} className="bg-space-950 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4 text-xs">
                        <div>
                          <div className="font-bold text-white">{a.trigger}</div>
                          <div className="text-gray-400 mt-1 font-mono">Action Node: <strong className="text-alien-green">{a.action}</strong></div>
                        </div>

                        <button 
                          onClick={() => toggleAutomation(a.id)}
                          className={cn(
                            "py-1.5 px-4 rounded-xl border font-mono font-bold transition-all text-[10px] uppercase",
                            a.enabled ? "bg-alien-green text-space-950 border-alien-green" : "border-white/5 text-gray-500"
                          )}
                        >
                          {a.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </main>

        </div>
      </div>

    </div>
  )
}
