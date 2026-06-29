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
  ordersCount: number
  purchasedProducts: string[]
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

interface OrderItem {
  name: string
  qty: number
  price: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  date: string
  channel: 'Online' | 'POS Terminal'
  products: OrderItem[]
  subtotal: number
  vat: number
  discount: number
  total: number
  status: 'Pending' | 'Packed' | 'Ready for Pickup' | 'Completed'
  paymentMethod: 'Credit Card' | 'Twint' | 'Cash' | 'Invoice'
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

const INITIAL_ORDERS: Order[] = [
  {
    id: 'INV-883492',
    customerName: 'Shikha Swiss',
    customerEmail: 'shikha@ufolabz.ch',
    date: '2026-06-28 20:30',
    channel: 'Online',
    products: [
      { name: 'Blast Pre-Workout (300g)', qty: 2, price: 59.00 },
      { name: 'Astro Creatine (500g)', qty: 1, price: 39.00 }
    ],
    subtotal: 157.00,
    discount: 38.00,
    vat: 9.64,
    total: 119.00,
    status: 'Pending',
    paymentMethod: 'Twint'
  },
  {
    id: 'INV-883491',
    customerName: 'Walk-in Guest',
    customerEmail: 'pos@ufolabz.ch',
    date: '2026-06-28 19:15',
    channel: 'POS Terminal',
    products: [
      { name: 'Astro Creatine (500g)', qty: 1, price: 39.00 }
    ],
    subtotal: 39.00,
    discount: 0.00,
    vat: 3.16,
    total: 39.00,
    status: 'Completed',
    paymentMethod: 'Cash'
  },
  {
    id: 'INV-883490',
    customerName: 'John Zurich',
    customerEmail: 'john@zurich.ch',
    date: '2026-06-28 15:40',
    channel: 'Online',
    products: [
      { name: 'Amino Fuel Mango (300g)', qty: 1, price: 49.00 },
      { name: 'Astro Creatine (500g)', qty: 2, price: 39.00 }
    ],
    subtotal: 127.00,
    discount: 12.00,
    vat: 9.32,
    total: 149.00,
    status: 'Ready for Pickup',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'INV-883489',
    customerName: 'Marc Bern',
    customerEmail: 'marc@bern.ch',
    date: '2026-06-27 10:20',
    channel: 'Online',
    products: [
      { name: 'Blast Pre-Workout (300g)', qty: 1, price: 59.00 }
    ],
    subtotal: 59.00,
    discount: 0.00,
    vat: 4.78,
    total: 59.00,
    status: 'Completed',
    paymentMethod: 'Invoice'
  }
]

const INITIAL_CUSTOMERS: CustomerProfile[] = [
  { id: 'cust-1', name: 'Shikha Swiss', email: 'shikha@ufolabz.ch', spending: 480.00, ltv: 950.00, points: 2400, goals: 'Muscle Gain & Tone', status: 'VIP', purchaseFreq: 'Every 20 Days', ordersCount: 5, purchasedProducts: ['ASTRO CREATINE (500G)', 'BLAST PRE-WORKOUT (300G)'] },
  { id: 'cust-2', name: 'John Zurich', email: 'john@zurich.ch', spending: 119.00, ltv: 240.00, points: 595, goals: 'Fat Loss', status: 'Regular', purchaseFreq: 'Every 35 Days', ordersCount: 2, purchasedProducts: ['AMINO FUEL MANGO (300G)'] },
  { id: 'cust-3', name: 'Marc Bern', email: 'marc@bern.ch', spending: 39.00, ltv: 39.00, points: 150, goals: 'Strength Training', status: 'New', purchaseFreq: 'One-Time', ordersCount: 1, purchasedProducts: ['ASTRO CREATINE (500G)'] }
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (sessionStorage.getItem('ufo_admin_authed') === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === 'UFOLabzAdmin2026!') {
      setIsAuthenticated(true)
      sessionStorage.setItem('ufo_admin_authed', 'true')
      setAuthError('')
    } else {
      setAuthError('INVALID ACCESS DECREE. ACCESS DENIED.')
    }
  }

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'inventory' | 'pricing' | 'customers' | 'affiliates' | 'marketing' | 'reviews' | 'automations'>('dashboard')


  // Orders states
  const [ordersList, setOrdersList] = useState<Order[]>(INITIAL_ORDERS)
  const [selectedOrderId, setSelectedOrderId] = useState<string>('INV-883492')
  const [orderFilter, setOrderFilter] = useState<'All' | 'Online' | 'POS Terminal'>('All')
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | 'Pending' | 'Packed' | 'Ready for Pickup' | 'Completed'>('All')
  
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

  // CRM state
  const [customersList, setCustomersList] = useState<CustomerProfile[]>([])
  
  // CRM Form state
  const [newCustName, setNewCustName] = useState('')
  const [newCustEmail, setNewCustEmail] = useState('')
  const [newCustGoal, setNewCustGoal] = useState('Muscle Gain')
  const [newCustStatus, setNewCustStatus] = useState<'VIP' | 'Regular' | 'New'>('Regular')
  const [newCustSpend, setNewCustSpend] = useState(100)
  const [newCustLtv, setNewCustLtv] = useState(100)
  const [newCustFreq, setNewCustFreq] = useState('Every 30 Days')
  const [newCustOrdersCount, setNewCustOrdersCount] = useState(1)
  const [newCustProducts, setNewCustProducts] = useState('ASTRO CREATINE (500G)')

  // Email Template Manager states
  const [emailTargetCustomer, setEmailTargetCustomer] = useState<CustomerProfile | null>(null)
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState('win-back')
  const [emailSubject, setEmailSubject] = useState('')
  const [customEmailBody, setCustomEmailBody] = useState('')

  // Affiliate Tier states
  const [explorerCommission, setExplorerCommission] = useState(15)
  const [astronautCommission, setAstronautCommission] = useState(20)
  const [commanderCommission, setCommanderCommission] = useState(25)

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
    const storedCustomers = localStorage.getItem('ufo_admin_customers')

    if (storedCustomers) {
      setCustomersList(JSON.parse(storedCustomers))
    } else {
      setCustomersList(INITIAL_CUSTOMERS)
      localStorage.setItem('ufo_admin_customers', JSON.stringify(INITIAL_CUSTOMERS))
    }

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
        { id: 'prod-col', title: 'Astro Collagen Peptide (300g)', category: 'special-edition', price: 34, stock: 500, desc: 'Premium hydrolyzed grass-fed collagen peptides optimized for rapid absorption, joint strength, and skin elasticity.', product_color: '#9B30FF', featuredImage: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667545/UFO1_ztlvyz.png', slug: 'astro-collagen' },
        { id: 'prod-blast-blue', title: 'Blast Pre-Workout (Blue Raspberry)', category: 'pre-workout', price: 24, stock: 350, desc: 'Extreme pre-workout energy and focus formula featuring an electric blue raspberry flavor profile.', product_color: '#00CFFF', featuredImage: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO2_hnupdu.png', slug: 'blast-pre-workout-blue' },
        { id: 'prod-amino-blue', title: 'Amino Fuel EAA (Blue Raspberry)', category: 'amino-acids', price: 17.90, stock: 350, desc: 'Full essential amino acids matrix paired with advanced electrolytes in a cold blue raspberry flavor.', product_color: '#00CFFF', featuredImage: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO6_uhxvep.png', slug: 'amino-fuel-blue-raspberry' }
      ]
      setLiveProducts(initialProducts)
      localStorage.setItem('ufo_catalog_products', JSON.stringify(initialProducts))
    }
  }, [activeTab])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-space-950 text-white flex items-center justify-center font-mono text-xs px-4 selection:bg-electric-red selection:text-white">
        <div className="bg-space-900 border border-electric-red/20 p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-glow-red relative overflow-hidden">
          <div className="absolute inset-0 bg-electric-red/5 blur-[50px] pointer-events-none" />
          <div className="w-16 h-16 rounded-full bg-electric-red/10 border border-electric-red/20 flex items-center justify-center mx-auto text-electric-red text-2xl relative z-10 animate-pulse">
            🔒
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-2xl tracking-wider text-white uppercase">RESTRICTED ZONE</h2>
            <p className="text-gray-400 mt-2 text-[10px] leading-relaxed">Admin access restricted to verified orbital commanders. Enter decryption password.</p>
          </div>
          <form onSubmit={handleAuthenticate} className="space-y-4 relative z-10">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Decryption Key"
              className="w-full bg-space-950 border border-white/10 rounded-xl px-4 py-3 text-center text-white focus:outline-none focus:border-electric-red/40 transition-colors"
            />
            {authError && <div className="text-electric-red font-bold uppercase text-[9px] tracking-wider animate-bounce">{authError}</div>}
            <button type="submit" className="w-full bg-electric-red hover:bg-electric-red/80 text-white font-bold py-3 rounded-xl transition-all shadow-glow-red hover:scale-[1.02] transform duration-150">
              DECRYPT CONTROL PANEL
            </button>
          </form>
        </div>
      </div>
    )
  }

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

  // Save CRM customers helper
  const saveCustomersToStorage = (newList: CustomerProfile[]) => {
    setCustomersList(newList)
    localStorage.setItem('ufo_admin_customers', JSON.stringify(newList))
  }

  // Add customer to CRM
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCustName || !newCustEmail) return
    const newCust: CustomerProfile = {
      id: `cust-${Math.floor(100 + Math.random() * 900)}`,
      name: newCustName,
      email: newCustEmail,
      spending: parseFloat(newCustSpend as any) || 0,
      ltv: parseFloat(newCustLtv as any) || 0,
      points: Math.floor((parseFloat(newCustSpend as any) || 0) * 5),
      goals: newCustGoal,
      status: newCustStatus,
      purchaseFreq: newCustFreq,
      ordersCount: parseInt(newCustOrdersCount as any) || 1,
      purchasedProducts: newCustProducts ? newCustProducts.split(',').map(s => s.trim()) : []
    }
    const updated = [...customersList, newCust]
    saveCustomersToStorage(updated)
    
    // Reset form
    setNewCustName('')
    setNewCustEmail('')
    setNewCustSpend(100)
    setNewCustLtv(100)
    setNewCustGoal('Muscle Gain')
    setNewCustStatus('Regular')
    setNewCustFreq('Every 30 Days')
    setNewCustOrdersCount(1)
    setNewCustProducts('ASTRO CREATINE (500G)')
    alert(`Customer profile for ${newCustName} successfully created in CRM!`)
  }

  // CRM Email template loader
  const handleTemplateChange = (templateKey: string, customer: CustomerProfile) => {
    setSelectedEmailTemplate(templateKey)
    const productsText = customer.purchasedProducts && customer.purchasedProducts.length > 0
      ? customer.purchasedProducts.join(', ')
      : 'UFO supplements'
      
    if (templateKey === 'win-back') {
      setEmailSubject(`We miss you, ${customer.name}! Get 15% off your next UFO order`)
      setCustomEmailBody(`Hi ${customer.name},\n\nIt's been a while since your last purchase of ${productsText} with us. We noticed you haven't restocked yet!\n\nTo help you fuel your training and stretch your limits, we've loaded a custom 15% discount code into your account: COMEBACK15.\n\nClaim it here: ufolabz.ch/shop\n\nBest,\nThe UFO LABZ Team`)
    } else if (templateKey === 'welcome') {
      setEmailSubject(`Welcome to the UFO LABZ Fleet, ${customer.name}!`)
      setCustomEmailBody(`Hi ${customer.name},\n\nWelcome to the elite league of Swiss high-performance athletes.\n\nUse code SYSTEM10 for a flat 10% discount on your next formula stack.\n\nBest,\nThe UFO LABZ Team`)
    } else if (templateKey === 'feedback') {
      setEmailSubject(`How is your performance, ${customer.name}?`)
      setCustomEmailBody(`Hi ${customer.name},\n\nWe would love to know how you are loving your recent purchase of ${productsText}.\n\nReply to this email with your review and we'll credit 200 Loyalty Points to your account instantly.\n\nBest,\nThe UFO LABZ Team`)
    } else if (templateKey === 'reward') {
      setEmailSubject(`A special loyalty boost for ${customer.name}!`)
      setCustomEmailBody(`Hi ${customer.name},\n\nWe have credited a special loyalty bonus to your Swiss Client Profile.\n\nYour loyalty points balance has been successfully increased by 500 points!\n\nBest,\nThe UFO LABZ Team`)
    }
  }

  const handleOpenEmailModal = (customer: CustomerProfile, templateType: string = 'win-back') => {
    setEmailTargetCustomer(customer)
    handleTemplateChange(templateType, customer)
  }

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Email successfully dispatched via SMTP gateway!\nTo: ${emailTargetCustomer?.email}\nSubject: ${emailSubject}`)
    setEmailTargetCustomer(null)
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

  // Sidebar button helper
  const getSidebarBtnClass = (tab: 'dashboard' | 'products' | 'orders' | 'inventory' | 'pricing' | 'customers' | 'affiliates' | 'marketing' | 'reviews' | 'automations') => {
    const isActive = activeTab === tab
    return cn(
      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-sans tracking-normal transition-all duration-300 whitespace-nowrap lg:w-full border",
      isActive 
        ? "bg-gradient-to-r from-alien-green to-emerald-500 text-space-950 font-bold shadow-glow-green border-alien-green/20 scale-[1.02]" 
        : "text-gray-400 border-transparent hover:text-white hover:bg-white/[0.04] hover:border-white/[0.05]"
    )
  }

  return (
    <div className="min-h-screen bg-space-950 text-white selection:bg-alien-green selection:text-space-950 pb-20 font-sans text-left">
      
      {/* ─── SYSTEM HEADER ─── */}
      <header className="border-b border-white/5 bg-space-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-alien-green/20 border border-alien-green/40 flex items-center justify-center">
                <span className="text-alien-green text-xs font-bold font-sans">U</span>
              </div>
              <span className="font-sans text-lg font-bold tracking-tight text-white">UFO LABZ</span>
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-xs font-sans text-alien-green flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>ENTERPRISE COCKPIT</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[10px] font-sans text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-alien-green animate-ping" />
              <span>Live Visitors: 14</span>
            </div>
            <Link href="/pos" className="text-xs font-sans text-alien-green hover:text-white flex items-center gap-1.5 bg-alien-green/10 border border-alien-green/20 px-3 py-1 rounded-full hover:bg-alien-green/20 transition-all font-bold">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>POS Terminal</span>
            </Link>
            <Link href="/affiliate" className="text-xs font-sans text-gray-400 hover:text-white flex items-center gap-1">
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
          <aside className="lg:col-span-3 card-glass bg-space-900/60 p-4 border border-white/[0.06] rounded-3xl backdrop-blur-sm space-y-2 overflow-x-auto lg:overflow-x-visible no-scrollbar flex lg:flex-col gap-1 lg:gap-0">
            
            <div className="hidden lg:flex items-center gap-3 pb-4 mb-4 border-b border-white/[0.06]">
              <div className="w-10 h-10 rounded-full bg-alien-green/10 border border-alien-green/20 flex items-center justify-center text-lg">
                ⚙️
              </div>
              <div>
                <div className="font-bold text-sm text-white font-sans font-semibold uppercase tracking-wide">Command Deck</div>
                <span className="text-[9px] text-alien-green font-sans font-semibold uppercase tracking-wider block mt-0.5">Shopify Plus Engine</span>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('dashboard')}
              className={getSidebarBtnClass('dashboard')}
            >
              <BarChart2 className="w-4 h-4 flex-shrink-0" />
              <span>Exec Dashboard</span>
            </button>

            <button 
              onClick={() => setActiveTab('products')}
              className={getSidebarBtnClass('products')}
            >
              <Package className="w-4 h-4 flex-shrink-0" />
              <span>AI Product Builder</span>
            </button>

            <button 
              onClick={() => setActiveTab('orders')}
              className={getSidebarBtnClass('orders')}
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span>Sales & Orders</span>
            </button>

            <button 
              onClick={() => setActiveTab('inventory')}
              className={getSidebarBtnClass('inventory')}
            >
              <Building className="w-4 h-4 flex-shrink-0" />
              <span>Sourcing & Warehousing</span>
            </button>

            <button 
              onClick={() => setActiveTab('pricing')}
              className={getSidebarBtnClass('pricing')}
            >
              <Percent className="w-4 h-4 flex-shrink-0" />
              <span>Dynamic Pricing Rules</span>
            </button>

            <button 
              onClick={() => setActiveTab('customers')}
              className={getSidebarBtnClass('customers')}
            >
              <User className="w-4 h-4 flex-shrink-0" />
              <span>Customer CRM</span>
            </button>

            <button 
              onClick={() => setActiveTab('affiliates')}
              className={getSidebarBtnClass('affiliates')}
            >
              <Award className="w-4 h-4 flex-shrink-0" />
              <span>Affiliate Approvals</span>
            </button>

            <button 
              onClick={() => setActiveTab('marketing')}
              className={getSidebarBtnClass('marketing')}
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>Ad Campaigns</span>
            </button>

            <button 
              onClick={() => setActiveTab('reviews')}
              className={getSidebarBtnClass('reviews')}
            >
              <Star className="w-4 h-4 flex-shrink-0" />
              <span>Reviews Moderation</span>
            </button>

            <button 
              onClick={() => setActiveTab('automations')}
              className={getSidebarBtnClass('automations')}
            >
              <Zap className="w-4 h-4 flex-shrink-0" />
              <span>Automation Engine</span>
            </button>

          </aside>

          {/* ─── MAIN CONTROL CARD (9 cols) ─── */}
          <main className="lg:col-span-9 card-glass bg-space-900/60 p-6 md:p-8 min-h-[600px] border border-white/[0.06] rounded-3xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient pointer-events-none rounded-3xl">
              <div className="absolute top-10 right-10 w-80 h-80 bg-alien-green/5 blur-[80px]" />
            </div>

            <div className="relative z-10 w-full">
              
              {/* 📊 TAB 1: EXECUTIVE DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div>
                    <h2 className="font-sans text-2xl font-bold tracking-tight text-white">Executive Control Overview</h2>
                    <p className="text-xs text-gray-400">Real-time telemetry and operational statistics across Swiss domains.</p>
                  </div>

                  {/* 1. CORE telemetry stats grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div className="card-glass bg-space-950/40 border border-white/[0.06] p-4 rounded-2xl relative overflow-hidden shadow-inner hover:border-alien-green/20 hover:scale-[1.01] transition-all duration-300">
                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Gross revenue</span>
                      <span className="text-2xl font-bold font-sans text-gradient-cosmic mt-1.5 block">CHF 124,840.50</span>
                      <span className="text-[9px] text-alien-green block mt-1">+14.2% from last month</span>
                    </div>

                    <div className="card-glass bg-space-950/40 border border-white/[0.06] p-4 rounded-2xl relative overflow-hidden shadow-inner hover:border-alien-green/20 hover:scale-[1.01] transition-all duration-300">
                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Total transactions</span>
                      <span className="text-2xl font-bold font-sans text-white mt-1.5 block">1,268 Orders</span>
                      <span className="text-[9px] text-alien-green block mt-1">Average value: CHF 98.45</span>
                    </div>

                    <div className="card-glass bg-space-950/40 border border-white/[0.06] p-4 rounded-2xl relative overflow-hidden shadow-inner hover:border-alien-green/20 hover:scale-[1.01] transition-all duration-300">
                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Website sales</span>
                      <span className="text-2xl font-bold font-sans text-white mt-1.5 block">CHF 84,320.00</span>
                      <span className="text-[9px] text-gray-400 block mt-1">67.5% of total sales</span>
                    </div>

                    <div className="card-glass bg-space-950/40 border border-white/[0.06] p-4 rounded-2xl relative overflow-hidden shadow-inner hover:border-alien-green/20 hover:scale-[1.01] transition-all duration-300">
                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Offline sales (POS)</span>
                      <span className="text-2xl font-bold font-sans text-alien-green mt-1.5 block">CHF 40,520.00</span>
                      <span className="text-[9px] text-alien-green block mt-1">32.5% of total sales</span>
                    </div>
                  </div>

                  {/* 2. Secondary telemetry parameters */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div className="card-glass bg-space-950/40 border border-white/[0.06] p-4 rounded-2xl shadow-inner hover:border-alien-green/10 transition-all duration-300">
                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Active users online</span>
                      <span className="text-xl font-bold font-sans text-white mt-1 block">42 Active</span>
                      <span className="text-[9px] text-alien-green block mt-1">Currently in checkout: 3</span>
                    </div>

                    <div className="card-glass bg-space-950/40 border border-white/[0.06] p-4 rounded-2xl shadow-inner hover:border-alien-green/10 transition-all duration-300">
                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Affiliates joined</span>
                      <span className="text-xl font-bold font-sans text-white mt-1 block">24 Affiliates</span>
                      <span className="text-[9px] text-alien-green block mt-1">+3 signups pending review</span>
                    </div>

                    <div className="card-glass bg-space-950/40 border border-white/[0.06] p-4 rounded-2xl shadow-inner hover:border-alien-green/10 transition-all duration-300">
                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Affiliate commission</span>
                      <span className="text-xl font-bold font-sans text-alien-green mt-1 block">CHF 4,820.00</span>
                      <span className="text-[9px] text-gray-400 block mt-1">Due for payout: CHF 430.00</span>
                    </div>

                    <div className="card-glass bg-space-950/40 border border-white/[0.06] p-4 rounded-2xl shadow-inner hover:border-red-500/20 transition-all duration-300">
                      <span className="text-[10px] text-red-400 font-bold block uppercase tracking-wider">⚠️ Inventory alerts</span>
                      <span className="text-xl font-bold font-sans text-red-400 mt-1 block">3 Critical items</span>
                      <span className="text-[9px] text-red-300 block mt-1">Expiring or low stock level</span>
                    </div>
                  </div>

                  {/* 3. Logistics, Packaging status & Demographics split */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sourcing & Pack Status */}
                    <div className="bg-space-950/60 border border-white/5 p-5 rounded-2xl space-y-4">
                      <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">📦 Logistics Fulfilment Ledger</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-space-900 border border-white/5 p-4 rounded-xl text-center">
                          <span className="text-[10px] text-gray-400 block uppercase">Need to Pack</span>
                          <span className="text-3xl font-bold font-sans text-white mt-1 block">14</span>
                          <span className="text-[8px] text-yellow-400 block mt-1">Pending PostPac Dispatch</span>
                        </div>
                        <div className="bg-space-900 border border-white/5 p-4 rounded-xl text-center">
                          <span className="text-[10px] text-gray-400 block uppercase">Ready for Pickup</span>
                          <span className="text-3xl font-bold font-sans text-alien-green mt-1 block">6</span>
                          <span className="text-[8px] text-alien-green block mt-1">Zurich Depot Cargo Node</span>
                        </div>
                      </div>
                    </div>

                    {/* Sales by Canton / City */}
                    <div className="bg-space-950/60 border border-white/5 p-5 rounded-2xl space-y-3">
                      <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">🇨🇭 Sales Demographics (City Share)</h3>
                      
                      <div className="space-y-2.5 font-sans text-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-gray-300">
                            <span>Zurich (ZH)</span>
                            <span className="font-semibold text-white">45% (CHF 56,178)</span>
                          </div>
                          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                            <div className="bg-alien-green h-full rounded-full" style={{ width: '45%' }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-gray-300">
                            <span>Geneva (GE)</span>
                            <span className="font-semibold text-white">25% (CHF 31,210)</span>
                          </div>
                          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                            <div className="bg-blue-400 h-full rounded-full" style={{ width: '25%' }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-gray-300">
                            <span>Basel (BS)</span>
                            <span className="font-semibold text-white">18% (CHF 22,471)</span>
                          </div>
                          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                            <div className="bg-purple-400 h-full rounded-full" style={{ width: '18%' }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-gray-300">
                            <span>Bern (BE)</span>
                            <span className="font-semibold text-white">12% (CHF 14,981)</span>
                          </div>
                          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                            <div className="bg-gray-400 h-full rounded-full" style={{ width: '12%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Products rank & Transactions list split */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Selling supplement stacks list */}
                    <div className="bg-space-950/60 border border-white/5 p-5 rounded-2xl space-y-4 text-xs">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="font-sans font-bold text-white uppercase tracking-wider">Top Selling Stacks</span>
                        <span className="text-[10px] text-gray-400 font-sans">By gross volume</span>
                      </div>
                      
                      <div className="space-y-3 font-sans">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">1. Blast Pre-Workout (300g)</span>
                          <span className="text-alien-green font-bold">620 units (CHF 30,380)</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                          <div className="bg-alien-green h-full rounded-full" style={{ width: '62%' }} />
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">2. Astro Creatine (500g)</span>
                          <span className="text-blue-400 font-bold">450 units (CHF 17,550)</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                          <div className="bg-blue-400 h-full rounded-full" style={{ width: '45%' }} />
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">3. Amino Fuel Mango (300g)</span>
                          <span className="text-purple-400 font-bold">280 units (CHF 12,600)</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                          <div className="bg-purple-400 h-full rounded-full" style={{ width: '28%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Recent Transactions list */}
                    <div className="bg-space-950/60 border border-white/5 p-5 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="font-sans font-bold text-white uppercase tracking-wider">Recent Transactions</span>
                        <span className="text-[9px] bg-alien-green/10 text-alien-green px-2 py-0.5 rounded font-sans">LIVE FEED</span>
                      </div>

                      <div className="space-y-2.5 text-xs text-left">
                        <div className="flex justify-between items-center p-2 rounded-xl bg-space-900 border border-white/5">
                          <div>
                            <div className="font-bold text-white">INV-883492</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">Shikha Swiss • Online Checkout</div>
                          </div>
                          <span className="font-sans text-alien-green font-bold">CHF 119.00</span>
                        </div>

                        <div className="flex justify-between items-center p-2 rounded-xl bg-space-900 border border-white/5">
                          <div>
                            <div className="font-bold text-white">INV-883491</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">Walk-in Guest • POS Terminal</div>
                          </div>
                          <span className="font-sans text-alien-green font-bold">CHF 39.00</span>
                        </div>

                        <div className="flex justify-between items-center p-2 rounded-xl bg-space-900 border border-white/5">
                          <div>
                            <div className="font-bold text-white">INV-883490</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">John Zurich • Online Checkout</div>
                          </div>
                          <span className="font-sans text-alien-green font-bold">CHF 149.00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5. Notifications control panel */}
                  <div className="bg-space-950/60 border border-white/5 p-5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider">🔔 Action Required Moderation Ledger</h3>
                      <span className="text-[9px] text-gray-400">Real-time alerts requiring review</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* Affiliate alert */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-space-900 border border-white/5 gap-2 text-left">
                        <div>
                          <span className="px-1.5 py-0.5 rounded font-sans text-[8px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">Affiliate Program</span>
                          <div className="font-bold text-white mt-1">New Affiliate Registration request received</div>
                          <p className="text-[10px] text-gray-400">Beat Keller (Fitness Zurich) requested referral code `BEATFIT10` in Canton Zurich.</p>
                        </div>
                        <button 
                          onClick={() => setActiveTab('affiliates')}
                          className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-sans text-[9px] px-3 py-1.5 rounded-lg shrink-0"
                        >
                          Moderate Affiliate
                        </button>
                      </div>

                      {/* Product review alert */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-space-900 border border-white/5 gap-2 text-left">
                        <div>
                          <span className="px-1.5 py-0.5 rounded font-sans text-[8px] font-bold bg-alien-green/10 text-alien-green border border-alien-green/20 uppercase">Product Review</span>
                          <div className="font-bold text-white mt-1">Unapproved product review submitted</div>
                          <p className="text-[10px] text-gray-400">Elena S. rated Astro Creatine 5 stars: "mixes instantly in coffee..."</p>
                        </div>
                        <button 
                          onClick={() => setActiveTab('reviews')}
                          className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-sans text-[9px] px-3 py-1.5 rounded-lg shrink-0"
                        >
                          Moderate Review
                        </button>
                      </div>

                      {/* Blog comment review alert */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-space-900 border border-white/5 gap-2 text-left">
                        <div>
                          <span className="px-1.5 py-0.5 rounded font-sans text-[8px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase">Blog Comment</span>
                          <div className="font-bold text-white mt-1">Pending blog comment submitted</div>
                          <p className="text-[10px] text-gray-400">Markus K. commented on "Post-workout windows": "super useful tips, ordered creatine..."</p>
                        </div>
                        <button 
                          onClick={() => alert('Blog comments ledger loaded! Comment approved.')}
                          className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-sans text-[9px] px-3 py-1.5 rounded-lg shrink-0"
                        >
                          Moderate Comment
                        </button>
                      </div>

                      {/* Inventory low stock alert */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-space-900 border border-red-500/20 bg-red-500/[0.02] gap-2 text-left">
                        <div>
                          <span className="px-1.5 py-0.5 rounded font-sans text-[8px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase">Inventory Alert</span>
                          <div className="font-bold text-white mt-1">Critical stock depletion threshold detected</div>
                          <p className="text-[10px] text-red-300">Omega Matrix Fish Oil has dropped below Reorder Level (15 units remaining in main warehouse Depot).</p>
                        </div>
                        <button 
                          onClick={() => setActiveTab('inventory')}
                          className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-sans text-[9px] px-3 py-1.5 rounded-lg shrink-0"
                        >
                          Manage Stock
                        </button>
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
                        <h3 className="font-sans text-base font-bold tracking-tight text-white">AI Product Generator</h3>
                        <p className="text-[10px] text-gray-400">Generate structured descriptions, SEO tags, and translations using AI.</p>
                      </div>

                      <form onSubmit={handleGenerateAiProduct} className="space-y-4 text-xs">
                        <div>
                          <label className="text-[10px] font-sans text-gray-400 mb-1.5 block">Supplement Title</label>
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
                          <label className="text-[10px] font-sans text-gray-400 mb-1.5 block">Product Category</label>
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
                          <h3 className="font-sans text-base font-bold tracking-tight text-white">
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
                            className="bg-red-500/10 border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500 px-3 py-1 rounded-lg text-[10px] font-sans transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      <form onSubmit={handleCreateManualProduct} className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-sans text-gray-400 mb-1 block">Title *</label>
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
                            <label className="text-[10px] font-sans text-gray-400 mb-1 block">Category</label>
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
                            <label className="text-[10px] font-sans text-gray-400 mb-1 block">Sale Price (CHF) *</label>
                            <input 
                              type="number" 
                              required
                              value={manualPrice}
                              onChange={(e) => setManualPrice(parseFloat(e.target.value) || 0)}
                              className="input bg-space-900 border-white/5 py-1 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-sans text-gray-400 mb-1 block">Actual Price *</label>
                            <input 
                              type="number" 
                              required
                              value={manualBasePrice}
                              onChange={(e) => setManualBasePrice(parseFloat(e.target.value) || 0)}
                              className="input bg-space-900 border-white/5 py-1 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-sans text-gray-400 mb-1 block">Stock Units *</label>
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
                            <label className="text-[10px] font-sans text-gray-400 mb-1 block">Featured Image URL</label>
                            <input 
                              type="text" 
                              value={manualFeaturedImage}
                              onChange={(e) => setManualFeaturedImage(e.target.value)}
                              placeholder="e.g. https://images.unsplash.com/..."
                              className="input bg-space-900 border-white/5 py-1 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-sans text-gray-400 mb-1 block">Color Hex Code</label>
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
                          <label className="text-[10px] font-sans text-gray-400 mb-1 block">Image Gallery (Comma-separated URLs)</label>
                          <input 
                            type="text" 
                            value={manualImageGallery}
                            onChange={(e) => setManualImageGallery(e.target.value)}
                            placeholder="url1, url2, url3"
                            className="input bg-space-900 border-white/5 py-1 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-sans text-gray-400 mb-1 block">Key Benefits (Comma-separated)</label>
                          <input 
                            type="text" 
                            value={manualKeyBenefits}
                            onChange={(e) => setManualKeyBenefits(e.target.value)}
                            placeholder="Tested In Swiss Labs, GMP Certified, 100% Vegan"
                            className="input bg-space-900 border-white/5 py-1 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-sans text-gray-400 mb-1 block">Ingredients Matrix</label>
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
                            <label className="text-[10px] font-sans text-gray-400 mb-1 block">Short Description *</label>
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
                            <label className="text-[10px] font-sans text-gray-400 mb-1 block">Long Description</label>
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
                          <span className="font-sans text-alien-green uppercase font-bold text-[10px]">AI-Generated Blueprint</span>
                          <h3 className="text-base font-bold text-white mt-1">{aiResult.title}</h3>
                          <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded font-sans text-gray-400 mt-2 inline-block">
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
                          <h4 className="font-bold text-white font-sans text-[10px] uppercase text-gray-400">Short Description</h4>
                          <p className="text-gray-300 leading-relaxed mt-1">{aiResult.shortDesc}</p>
                        </div>

                        <div>
                          <h4 className="font-bold text-white font-sans text-[10px] uppercase text-gray-400">Long Description</h4>
                          <p className="text-gray-300 leading-relaxed mt-1">{aiResult.longDesc}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-space-900 border border-white/5 p-4 rounded-xl">
                          <div>
                            <span className="font-bold text-white font-sans text-[9px] uppercase text-alien-green">SEO Title Tag</span>
                            <div className="text-gray-300 mt-1 font-sans">{aiResult.seoTitle}</div>
                          </div>
                          <div>
                            <span className="font-bold text-white font-sans text-[9px] uppercase text-alien-green">SEO Meta Description</span>
                            <div className="text-gray-300 mt-1 font-sans">{aiResult.seoDesc}</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-white font-sans text-[10px] uppercase text-gray-400">Ingredients Matrix</h4>
                          <p className="text-gray-300 leading-relaxed mt-1 font-sans">{aiResult.ingredients}</p>
                        </div>

                        <div>
                          <h4 className="font-bold text-white font-sans text-[10px] uppercase text-gray-400">German Translation (AI Localized)</h4>
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
                      <span className="font-bold text-white font-sans uppercase text-[10px]">LIVE PRODUCT CATALOG</span>
                      <span className="text-[10px] text-gray-400 font-sans">Manage Active Offerings</span>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5 font-sans text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
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
                            <td className="p-3 font-sans uppercase text-gray-400">{p.category}</td>
                            <td className="p-3 font-sans text-gray-400 line-through">CHF {(p.base_price || p.price + 10).toFixed(2)}</td>
                            <td className="p-3 font-sans font-bold text-alien-green">CHF {p.price.toFixed(2)}</td>
                            <td className="p-3 font-sans">
                              <div className="flex items-center gap-1.5 font-sans">
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
                                  className="text-alien-green hover:text-white font-sans text-[10px] flex items-center gap-1 hover:bg-alien-green/10 px-2 py-1 rounded border border-alien-green/20 transition-all"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="text-red-400 hover:text-red-500 font-sans text-[10px] flex items-center gap-1.5 hover:bg-red-500/5 px-2 py-1 rounded transition-all"
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

              {/* 🛒 TAB 10: SALES & ORDERS LEDGER */}
              {activeTab === 'orders' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div>
                    <h2 className="font-sans text-2xl font-bold tracking-tight text-white">Sales & Orders Ledger</h2>
                    <p className="text-xs text-gray-400">View real-time checkout metrics, transaction records, product parameters, and manage package packing or pickup states.</p>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-space-950/40 p-4 border border-white/[0.06] rounded-2xl">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button 
                        onClick={() => setOrderFilter('All')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg border font-medium transition-all",
                          orderFilter === 'All' ? "bg-alien-green text-space-950 border-alien-green/20" : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
                        )}
                      >
                        All Channels
                      </button>
                      <button 
                        onClick={() => setOrderFilter('Online')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg border font-medium transition-all",
                          orderFilter === 'Online' ? "bg-alien-green text-space-950 border-alien-green/20" : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
                        )}
                      >
                        Online Store
                      </button>
                      <button 
                        onClick={() => setOrderFilter('POS Terminal')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg border font-medium transition-all",
                          orderFilter === 'POS Terminal' ? "bg-alien-green text-space-950 border-alien-green/20" : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
                        )}
                      >
                        POS Terminal
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Status:</span>
                      <select 
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                        className="bg-space-900 border border-white/10 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-alien-green/50 text-xs"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Packed">Packed</option>
                        <option value="Ready for Pickup">Ready for Pickup</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* Two-Column split */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left: Orders Ledger Table */}
                    <div className="lg:col-span-7 bg-space-950/60 border border-white/5 rounded-3xl overflow-hidden">
                      <div className="p-4 border-b border-white/5 bg-white/5">
                        <span className="font-bold text-white font-sans uppercase text-[10px]">Transaction Ledger</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-white/5 border-b border-white/5 font-sans text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                              <th className="p-3">Order ID</th>
                              <th className="p-3">Customer</th>
                              <th className="p-3">Channel</th>
                              <th className="p-3">Grand Total</th>
                              <th className="p-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-sans">
                            {ordersList
                              .filter(o => orderFilter === 'All' || o.channel === orderFilter)
                              .filter(o => orderStatusFilter === 'All' || o.status === orderStatusFilter)
                              .map((ord) => (
                                <tr 
                                  key={ord.id}
                                  onClick={() => setSelectedOrderId(ord.id)}
                                  className={cn(
                                    "hover:bg-white/[0.02] cursor-pointer transition-all duration-150",
                                    selectedOrderId === ord.id ? "bg-white/[0.04] border-l-2 border-alien-green" : ""
                                  )}
                                >
                                  <td className="p-3">
                                    <div className="font-bold text-white">{ord.id}</div>
                                    <span className="text-[10px] text-gray-500">{ord.date}</span>
                                  </td>
                                  <td className="p-3">
                                    <div className="font-medium text-white">{ord.customerName}</div>
                                    <span className="text-[10px] text-gray-500">{ord.customerEmail}</span>
                                  </td>
                                  <td className="p-3">
                                    <span className={cn(
                                      "px-2 py-0.5 rounded text-[9px] font-semibold",
                                      ord.channel === 'Online' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-alien-green/10 text-alien-green border border-alien-green/20"
                                    )}>
                                      {ord.channel}
                                    </span>
                                  </td>
                                  <td className="p-3 font-semibold text-white">
                                    {formatPrice(ord.total)}
                                  </td>
                                  <td className="p-3">
                                    <span className={cn(
                                      "px-2 py-0.5 rounded text-[9px] font-semibold",
                                      ord.status === 'Completed' ? "bg-alien-green/10 text-alien-green" :
                                      ord.status === 'Ready for Pickup' ? "bg-blue-500/10 text-blue-400" :
                                      ord.status === 'Packed' ? "bg-purple-500/10 text-purple-400" :
                                      "bg-yellow-500/10 text-yellow-400"
                                    )}>
                                      {ord.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right: Selected Order Detail Card */}
                    <div className="lg:col-span-5 bg-space-950 border border-white/5 p-6 rounded-3xl space-y-6 text-left">
                      {(() => {
                        const order = ordersList.find(o => o.id === selectedOrderId) || ordersList[0]
                        if (!order) {
                          return (
                            <div className="text-center text-gray-500 py-20">
                              No matching order records found.
                            </div>
                          )
                        }

                        return (
                          <>
                            <div className="border-b border-white/5 pb-4 flex justify-between items-start">
                              <div>
                                <span className="text-[10px] text-alien-green font-semibold uppercase tracking-wider">Transaction Summary</span>
                                <h3 className="text-lg font-bold text-white mt-0.5">{order.id}</h3>
                                <span className="text-[10px] text-gray-400">{order.date} via {order.channel}</span>
                              </div>
                              <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-[10px] font-semibold",
                                order.status === 'Completed' ? "bg-alien-green/10 text-alien-green border border-alien-green/20" :
                                order.status === 'Ready for Pickup' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                order.status === 'Packed' ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                                "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              )}>
                                {order.status}
                              </span>
                            </div>

                            {/* Customer Profile card */}
                            <div className="bg-space-900 border border-white/5 p-4 rounded-2xl text-xs space-y-2">
                              <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Client Profile Details</span>
                              <div>
                                <div className="font-bold text-white text-sm">{order.customerName}</div>
                                <div className="text-gray-400 font-sans text-[10px]">{order.customerEmail}</div>
                              </div>
                              <div className="pt-1.5 flex justify-between text-[10px] text-gray-400">
                                <span>Payment Channel: <strong className="text-white">{order.paymentMethod}</strong></span>
                                <span>Sales channel: <strong className="text-white">{order.channel}</strong></span>
                              </div>
                            </div>

                            {/* Products Details List */}
                            <div className="space-y-3">
                              <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Purchased Formula Stacks</span>
                              
                              <div className="divide-y divide-white/5 space-y-2.5">
                                {order.products.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-xs pt-2">
                                    <div>
                                      <div className="font-bold text-white">{item.name}</div>
                                      <span className="text-[10px] text-gray-400 font-sans">{item.qty} units × {formatPrice(item.price)}</span>
                                    </div>
                                    <span className="font-semibold text-white">
                                      {formatPrice(item.qty * item.price)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Billing Overview */}
                            <div className="border-t border-white/5 pt-4 space-y-2 text-xs">
                              <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span>{formatPrice(order.subtotal)}</span>
                              </div>
                              <div className="flex justify-between text-gray-400">
                                <span>Discount</span>
                                <span className="text-red-400">-{formatPrice(order.discount)}</span>
                              </div>
                              <div className="flex justify-between text-gray-400">
                                <span>VAT (8.1%)</span>
                                <span>{formatPrice(order.vat)}</span>
                              </div>
                              <div className="flex justify-between font-bold text-white border-t border-white/5 pt-2 text-sm">
                                <span>Total Paid</span>
                                <span className="text-alien-green">{formatPrice(order.total)}</span>
                              </div>
                            </div>

                            {/* Action controls */}
                            <div className="border-t border-white/5 pt-4 space-y-3 text-xs">
                              <div>
                                <label className="text-[10px] text-gray-400 mb-1 block uppercase tracking-wider font-semibold">Update Shipment Status</label>
                                <select 
                                  value={order.status}
                                  onChange={(e) => {
                                    const nextStatus = e.target.value as any
                                    setOrdersList(ordersList.map(o => o.id === order.id ? { ...o, status: nextStatus } : o))
                                    alert(`Order status updated successfully to: ${nextStatus}`)
                                  }}
                                  className="input bg-space-900 border-white/5 py-1.5 text-white"
                                >
                                  <option value="Pending">Pending Fulfillment</option>
                                  <option value="Packed">Packed / Prepared</option>
                                  <option value="Ready for Pickup">Ready for Pickup</option>
                                  <option value="Completed">Completed (Fulfill)</option>
                                </select>
                              </div>

                              <button 
                                onClick={() => {
                                  // Mock Receipt Dispatcher / Print Trigger
                                  const win = window.open("", "_blank")
                                  if (win) {
                                    win.document.write(`
                                      <html>
                                        <head>
                                          <title>Print Invoice \${order.id}</title>
                                          <style>
                                            body { font-family: monospace; padding: 20px; color: #000; background: #fff; }
                                            .invoice-header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; }
                                            .line-items { width: 100%; border-bottom: 1px dashed #000; margin: 15px 0; padding-bottom: 10px; }
                                            .total-sec { text-align: right; font-weight: bold; }
                                          </style>
                                        </head>
                                        <body onload="window.print();">
                                          <div class="invoice-header">
                                            <h2>UFO LABZ SWISS</h2>
                                            <p>Enterprise Order Receipt</p>
                                            <p>ID: \${order.id} | Date: \${order.date}</p>
                                          </div>
                                          <div>
                                            <p><strong>Customer:</strong> \${order.customerName}</p>
                                            <p><strong>Email:</strong> \${order.customerEmail}</p>
                                            <p><strong>Channel:</strong> \${order.channel}</p>
                                          </div>
                                          <table class="line-items">
                                            <thead>
                                              <tr>
                                                <th align="left">Item</th>
                                                <th align="center">Qty</th>
                                                <th align="right">Price</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              \${order.products.map(p => \`
                                                <tr>
                                                  <td>\${p.name}</td>
                                                  <td align="center">\${p.qty}</td>
                                                  <td align="right">CHF \${p.price.toFixed(2)}</td>
                                                </tr>
                                              \`).join("")}
                                            </tbody>
                                          </table>
                                          <div class="total-sec">
                                            <p>Subtotal: CHF \${order.subtotal.toFixed(2)}</p>
                                            <p>Discount: -CHF \${order.discount.toFixed(2)}</p>
                                            <p>VAT (8.1%): CHF \${order.vat.toFixed(2)}</p>
                                            <h3>GRAND TOTAL: CHF \${order.total.toFixed(2)}</h3>
                                          </div>
                                        </body>
                                      </html>
                                    `)
                                    win.document.close()
                                  }
                                }}
                                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold h-9 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                              >
                                <FileText className="w-4 h-4" />
                                <span>Print Thermal Invoice</span>
                              </button>
                            </div>
                          </>
                        )
                      })()}
                    </div>

                  </div>
                </div>
              )}

              {/* 🏭 TAB 3: INVENTORY & SOURCING */}
              {activeTab === 'inventory' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-sans text-2xl font-bold tracking-tight text-white">Operational Logistics</h2>
                    <p className="text-xs text-gray-400">Sourcing, Warehousing allocations, and Batch lot logs.</p>
                  </div>

                  {/* Warehouses lists */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-sans font-bold tracking-widest text-muted text-gray-400 uppercase">1. Multi-Warehouse Allocations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {INITIAL_WAREHOUSES.map((wh) => (
                        <div key={wh.name} className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-3 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white">{wh.name}</span>
                            <span className="text-[10px] font-sans text-alien-green">{wh.occupancy}% Cap.</span>
                          </div>
                          <div className="space-y-1 text-gray-400">
                            <div>Manager: <strong className="text-white">{wh.manager}</strong></div>
                            <div>Address: {wh.location}</div>
                            <div>Live Stock Units: <strong className="text-white font-sans">{wh.stockCount.toLocaleString()} units</strong></div>
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
                      <h3 className="font-bold text-white font-sans text-[10px] uppercase text-gray-400">2. Active Raw Suppliers</h3>
                      <div className="space-y-3">
                        {INITIAL_SUPPLIERS.map((sup) => (
                          <div key={sup.id} className="border-b border-white/5 pb-2">
                            <div className="flex justify-between">
                              <span className="font-bold text-white">{sup.name}</span>
                              <span className="text-yellow-500 font-bold font-sans">★ {sup.rating}</span>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1">Lead Time: {sup.leadTime} · Terms: {sup.terms}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PO Generator Form */}
                    <form onSubmit={handleCreatePO} className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-3 text-xs">
                      <h3 className="font-bold text-white font-sans text-[10px] uppercase text-gray-400">3. Issue Purchase Order</h3>
                      
                      <div>
                        <label className="text-[9px] font-sans text-gray-400 block mb-1">Target Supplier</label>
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
                          <label className="text-[9px] font-sans text-gray-400 block mb-1">Raw Ingredient</label>
                          <input 
                            type="text" 
                            value={poItem} 
                            onChange={(e) => setPoItem(e.target.value)}
                            className="input py-1 text-xs" 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-sans text-gray-400 block mb-1">Quantity (kg/units)</label>
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
                      <span className="text-[10px] text-gray-400 font-sans">Lot numbers & Expirations</span>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5 font-sans text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
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
                          <tr key={b.batchNo} className="font-sans">
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

              {/* 🪙 TAB 4: Dynamic Pricing Rules */}
              {activeTab === 'pricing' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-sans text-2xl font-bold tracking-tight text-white">Dynamic Pricing Rules</h2>
                    <p className="text-xs text-gray-400">Configure conditional rules based on inventory levels, time periods, and customer tier tags.</p>
                  </div>

                  {/* Active pricing rules list */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-sans font-bold tracking-widest text-muted text-gray-400 uppercase">1. Active Price Rule Matrices</h3>
                    
                    <div className="space-y-3 text-xs">
                      {pricingRules.map((rule) => (
                        <div key={rule.id} className="bg-space-950 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4">
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{rule.trigger}</span>
                              <span className={cn(
                                "px-1.5 py-0.5 rounded font-sans text-[8px] font-bold",
                                rule.status === 'ACTIVE' ? "bg-alien-green/10 text-alien-green" : "bg-white/5 text-gray-500"
                              )}>{rule.status}</span>
                            </div>
                            <div className="text-gray-400 mt-1 font-sans">Condition: {rule.condition} · Action: <strong className="text-alien-green">{rule.action}</strong></div>
                          </div>

                          <button 
                            onClick={() => togglePricingRule(rule.id)}
                            className="bg-white/5 hover:bg-white/10 text-white font-sans text-[10px] py-1.5 px-3 rounded-lg border border-white/5"
                          >
                            Toggle Status
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* New Pricing Rule Form */}
                  <form onSubmit={handleCreatePricingRule} className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-4 text-xs">
                    <h3 className="text-xs font-sans font-bold tracking-widest text-muted text-gray-400 uppercase">2. Establish Pricing Rule Node</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-sans text-gray-400 mb-1.5 block">Trigger Event</label>
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
                        <label className="text-[10px] font-sans text-gray-400 mb-1.5 block">Condition Scope</label>
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
                        <label className="text-[10px] font-sans text-gray-400 mb-1.5 block">Adjustment Action</label>
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
                    <h2 className="font-sans text-2xl font-bold tracking-tight text-white">Customer CRM Ledger</h2>
                    <p className="text-xs text-gray-400">Manage client profiles, analyze online purchase logs, segment one-time buyers, and trigger direct template email broadcasts.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Register Client Profile form */}
                    <div className="lg:col-span-4 bg-space-950 border border-white/5 p-5 rounded-3xl space-y-4">
                      <div>
                        <h3 className="font-sans text-base font-bold tracking-tight text-white">Register Client</h3>
                        <p className="text-[9px] text-gray-400">Add a custom customer profile to the CRM database.</p>
                      </div>

                      <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
                        <div>
                          <label className="text-[9px] font-sans text-gray-400 mb-1 block">Full Name *</label>
                          <input 
                            type="text" 
                            required
                            value={newCustName}
                            onChange={(e) => setNewCustName(e.target.value)}
                            placeholder="e.g. Elena Keller"
                            className="input bg-space-900 border-white/5 py-1.5"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] font-sans text-gray-400 mb-1 block">Email Address *</label>
                          <input 
                            type="email" 
                            required
                            value={newCustEmail}
                            onChange={(e) => setNewCustEmail(e.target.value)}
                            placeholder="elena@keller.ch"
                            className="input bg-space-900 border-white/5 py-1.5"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-sans text-gray-400 mb-1 block">Spend (CHF)</label>
                            <input 
                              type="number" 
                              value={newCustSpend}
                              onChange={(e) => setNewCustSpend(parseFloat(e.target.value) || 0)}
                              className="input bg-space-900 border-white/5 py-1.5"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-sans text-gray-400 mb-1 block">LTV (CHF)</label>
                            <input 
                              type="number" 
                              value={newCustLtv}
                              onChange={(e) => setNewCustLtv(parseFloat(e.target.value) || 0)}
                              className="input bg-space-900 border-white/5 py-1.5"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-sans text-gray-400 mb-1 block">Status</label>
                            <select 
                              value={newCustStatus}
                              onChange={(e) => setNewCustStatus(e.target.value as any)}
                              className="input bg-space-900 border-white/5 py-1.5 text-white"
                            >
                              <option value="VIP">VIP</option>
                              <option value="Regular">Regular</option>
                              <option value="New">New</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-sans text-gray-400 mb-1 block">Frequency</label>
                            <input 
                              type="text" 
                              value={newCustFreq}
                              onChange={(e) => setNewCustFreq(e.target.value)}
                              placeholder="Every 30 Days"
                              className="input bg-space-900 border-white/5 py-1.5"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-sans text-gray-400 mb-1 block">Orders Count</label>
                            <input 
                              type="number" 
                              value={newCustOrdersCount}
                              onChange={(e) => setNewCustOrdersCount(parseInt(e.target.value) || 1)}
                              className="input bg-space-900 border-white/5 py-1.5"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-sans text-gray-400 mb-1 block">Fitness Goal</label>
                            <input 
                              type="text" 
                              value={newCustGoal}
                              onChange={(e) => setNewCustGoal(e.target.value)}
                              placeholder="Fat Loss"
                              className="input bg-space-900 border-white/5 py-1.5"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] font-sans text-gray-400 mb-1 block">Purchased Products (Comma-separated)</label>
                          <input 
                            type="text" 
                            value={newCustProducts}
                            onChange={(e) => setNewCustProducts(e.target.value)}
                            placeholder="ASTRO CREATINE (500G), BLAST PRE-WORKOUT (300G)"
                            className="input bg-space-900 border-white/5 py-1.5"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-white text-space-950 font-bold h-10 rounded-xl hover:bg-gray-100 mt-2"
                        >
                          Create Client Profile
                        </button>
                      </form>
                    </div>

                    {/* Right: Client ledger list */}
                    <div className="lg:col-span-8 space-y-3">
                      {customersList.map((c) => (
                        <div key={c.id} className="bg-space-950 border border-white/5 rounded-2xl overflow-hidden text-xs">
                          <div 
                            onClick={() => setExpandedCustomer(expandedCustomer === c.id ? null : c.id)}
                            className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-all"
                          >
                            <div className="space-y-1.5 text-left">
                              <div className="font-bold text-sm text-white flex items-center gap-2 flex-wrap">
                                <span>{c.name}</span>
                                <span className={cn(
                                  "px-1.5 py-0.5 rounded font-sans text-[8px] font-bold",
                                  c.status === 'VIP' ? "bg-alien-green/10 text-alien-green border border-alien-green/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                )}>{c.status}</span>
                                
                                {c.ordersCount === 1 ? (
                                  <span className="px-1.5 py-0.5 rounded font-sans text-[8px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                    One-Time Buyer
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded font-sans text-[8px] font-bold bg-green-500/10 text-alien-green border border-green-500/20">
                                    Repeat Customer ({c.ordersCount} Orders)
                                  </span>
                                )}
                              </div>
                              <span className="text-gray-400 block font-sans text-[10px]">{c.email}</span>
                            </div>

                            <div className="flex gap-6 font-sans text-right justify-between md:justify-end">
                              <div>
                                <span className="text-[8px] text-gray-500 block uppercase">Total Spend</span>
                                <span className="text-white font-bold">{formatPrice(c.spending)}</span>
                              </div>
                              <div>
                                <span className="text-[8px] text-gray-500 block uppercase">LTV (CHF)</span>
                                <span className="text-alien-green font-bold">{formatPrice(c.ltv)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Customer expanded details */}
                          {expandedCustomer === c.id && (
                            <div className="bg-space-900/60 border-t border-white/5 p-4 space-y-4 animate-fade-in text-left">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <span className="text-[8px] text-gray-500 font-sans block uppercase">Loyalty Points</span>
                                  <span className="text-white font-bold font-sans mt-0.5 block">{c.points.toLocaleString()} pts</span>
                                </div>
                                <div>
                                  <span className="text-[8px] text-gray-500 font-sans block uppercase">Fitness Goals</span>
                                  <span className="text-white font-bold mt-0.5 block">{c.goals}</span>
                                </div>
                                <div>
                                  <span className="text-[8px] text-gray-500 font-sans block uppercase">Purchase Frequency</span>
                                  <span className="text-white font-bold mt-0.5 block">{c.purchaseFreq}</span>
                                </div>
                                <div>
                                  <span className="text-[8px] text-gray-500 font-sans block uppercase">Quick Action</span>
                                  <button 
                                    onClick={() => {
                                      const updated = customersList.map(item => item.id === c.id ? { ...item, points: item.points + 100 } : item)
                                      saveCustomersToStorage(updated)
                                      alert(`Rewarded 100 Loyalty Points to ${c.name}!`)
                                    }}
                                    className="text-[10px] text-alien-green underline block mt-1 hover:text-white"
                                  >
                                    Reward 100 Points
                                  </button>
                                </div>
                              </div>

                              <div className="border-t border-white/5 pt-3">
                                <span className="text-[8px] text-gray-500 font-sans block uppercase mb-1.5">Purchased Products log</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {c.purchasedProducts && c.purchasedProducts.length > 0 ? (
                                    c.purchasedProducts.map((p, idx) => (
                                      <span key={idx} className="bg-space-950 border border-white/5 px-2.5 py-1 rounded-lg text-white font-sans text-[9px] uppercase">
                                        📦 {p}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-gray-500 italic text-[10px]">No catalog purchase logged online yet</span>
                                  )}
                                </div>
                              </div>

                              <div className="border-t border-white/5 pt-3 flex flex-wrap gap-2 items-center justify-between">
                                <span className="text-[9px] text-gray-400 font-sans">Select a direct email template action:</span>
                                <div className="flex gap-2">
                                  {c.ordersCount === 1 && (
                                    <button 
                                      onClick={() => handleOpenEmailModal(c, 'win-back')}
                                      className="bg-alien-green text-space-950 font-bold px-3 py-1.5 rounded-xl hover:shadow-glow-green text-[10px] uppercase font-sans flex items-center gap-1"
                                    >
                                      <Send className="w-3 h-3" />
                                      <span>Send Win-Back Email</span>
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => handleOpenEmailModal(c, 'welcome')}
                                    className="bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-xl hover:bg-white/10 text-[10px] uppercase font-sans flex items-center gap-1"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>Welcome discount</span>
                                  </button>
                                  <button 
                                    onClick={() => handleOpenEmailModal(c, 'feedback')}
                                    className="bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-xl hover:bg-white/10 text-[10px] uppercase font-sans flex items-center gap-1"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>Feedback request</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 🤝 TAB 6: AFFILIATE APPROVALS */}
              {activeTab === 'affiliates' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-sans text-2xl font-bold tracking-tight text-white">Affiliate Partner Control</h2>
                    <p className="text-xs text-gray-400">Moderate affiliate signup requests, payout withdrawals, custom discount coupons, and program commission tier structures.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tier Commission Settings Card */}
                    <div className="bg-space-950 border border-white/5 p-6 rounded-3xl text-left space-y-4">
                      <div>
                        <span className="font-sans text-alien-green uppercase font-bold text-[9px]">Global Program Parameter Control</span>
                        <h4 className="text-sm font-bold text-white mt-0.5">Program Commission Tiers</h4>
                        <p className="text-gray-400 text-[10px] mt-1">Configure default commission structures for affiliate partner brackets based on monthly referred sales volumes.</p>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="text-[10px] font-sans text-gray-400 mb-1 block">Explorer Tier Commission (%)</label>
                          <input 
                            type="number"
                            value={explorerCommission}
                            onChange={(e) => setExplorerCommission(parseInt(e.target.value) || 0)}
                            className="input bg-space-900 border-white/5 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-sans text-gray-400 mb-1 block">Astronaut Tier Commission (%)</label>
                          <input 
                            type="number"
                            value={astronautCommission}
                            onChange={(e) => setAstronautCommission(parseInt(e.target.value) || 0)}
                            className="input bg-space-900 border-white/5 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-sans text-gray-400 mb-1 block">Commander Tier Commission (%)</label>
                          <input 
                            type="number"
                            value={commanderCommission}
                            onChange={(e) => setCommanderCommission(parseInt(e.target.value) || 0)}
                            className="input bg-space-900 border-white/5 py-1 text-xs"
                          />
                        </div>
                        <button 
                          onClick={() => alert(`Global affiliate commission tiers successfully updated:\nExplorer: ${explorerCommission}%\nAstronaut: ${astronautCommission}%\nCommander: ${commanderCommission}%`)}
                          className="w-full bg-alien-green text-space-950 font-bold h-9 rounded-xl text-xs uppercase"
                        >
                          Save Tier Parameters
                        </button>
                      </div>
                    </div>

                    {/* Requested Coupons moderation (2 cols) */}
                    <div className="lg:col-span-2 space-y-4 text-left">
                      <h3 className="text-xs font-sans font-bold tracking-widest text-gray-400 uppercase">1. Coupon Approvals Ledger</h3>
                      
                      {coupons.map((c) => (
                        <div key={c.code} className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-4 text-xs">
                          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-3 gap-2">
                            <div>
                              <span className="font-sans text-sm font-bold text-white bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                                {c.code}
                              </span>
                              <span className="text-[10px] text-gray-400 ml-3">Requested by: <strong className="text-white">{c.affiliateName}</strong></span>
                            </div>
                            <div>
                              <span className={cn(
                                "px-2.5 py-0.5 rounded-full font-sans text-[9px] font-semibold",
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
                              <label className="text-[9px] font-sans text-gray-500 block mb-1">Customer Discount %</label>
                              <input 
                                type="number"
                                value={c.discountPct}
                                onChange={(e) => handleUpdateRates(c.code, parseInt(e.target.value) || 0, c.commissionPct)}
                                className="input text-xs font-sans py-1.5 bg-space-900 border-white/5 text-white max-w-[80px]"
                              />
                            </div>

                            <div>
                              <label className="text-[9px] font-sans text-gray-500 block mb-1">Affiliate Commission %</label>
                              <input 
                                type="number"
                                value={c.commissionPct}
                                onChange={(e) => handleUpdateRates(c.code, c.discountPct, parseInt(e.target.value) || 0)}
                                className="input text-xs font-sans py-1.5 bg-space-900 border-white/5 text-white max-w-[80px]"
                              />
                            </div>

                            <div className="text-left font-sans">
                              <span className="text-[9px] text-gray-500 block font-bold">Earnings generated</span>
                              <span className="text-alien-green font-bold">{formatPrice(c.totalCommission)}</span>
                            </div>

                            <div className="text-right space-x-1.5">
                              {c.status !== 'APPROVED' && (
                                <button 
                                  onClick={() => handleApproveCoupon(c.code)}
                                  className="bg-alien-green text-space-950 font-bold px-3 py-1.5 rounded-lg text-[10px]"
                                >
                                  Approve
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
                  </div>

                  {/* Affiliates List */}
                  <div className="bg-space-950 border border-white/5 rounded-2xl overflow-hidden text-xs pt-4 space-y-3">
                    <div className="px-4 flex justify-between items-center text-left">
                      <span className="font-bold text-white font-sans text-[10px] uppercase text-gray-400">2. Affiliate Partner Directory</span>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5 font-sans text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
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
                              <span className="text-[9px] text-gray-500 font-sans">Joined: {aff.joinedDate}</span>
                            </td>
                            <td className="p-3">
                              <div>{aff.email}</div>
                              <span className="text-[10px] text-gray-400 font-sans">{aff.canton}</span>
                            </td>
                            <td className="p-3">
                              <a href={`https://${aff.social}`} target="_blank" rel="noreferrer" className="text-alien-green hover:underline">
                                {aff.social}
                              </a>
                            </td>
                            <td className="p-3">
                              <span className={cn(
                                "px-2 py-0.5 rounded font-sans text-[8px] font-bold",
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
                    <h2 className="font-sans text-2xl font-bold tracking-tight text-white">AI Campaigns & Marketing</h2>
                    <p className="text-xs text-gray-400">Generate high-converting advertising copies for targeted channels instantly.</p>
                  </div>

                  <form onSubmit={handleGenerateCampaignAd} className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-sans text-gray-400 mb-1.5 block">Affiliate Referral Code</label>
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
                        <label className="text-[10px] font-sans text-gray-400 mb-1.5 block">Target Marketing Channel</label>
                        <select 
                          value={adChannel}
                          onChange={(e) => setAdChannel(e.target.value)}
                          className="input focus:outline-none bg-space-900 border-white/5 text-white font-sans"
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
                      <span className="font-sans text-alien-green uppercase font-bold text-[9px]">AI-Generated Copywriting</span>
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
                    <h2 className="font-sans text-2xl font-bold tracking-tight text-white">Reviews Moderation Hub</h2>
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
                            "px-2 py-0.5 rounded font-sans text-[8px] font-bold",
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

              {/* ⚡ TAB 9: Automation Engine Workflow */}
              {activeTab === 'automations' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-sans text-2xl font-bold tracking-tight text-white">Automation Engine Workflow</h2>
                    <p className="text-xs text-gray-400">Trigger custom flows and integrate advanced AI assistant frameworks.</p>
                  </div>

                  {/* OpenAI API Key Integration card */}
                  <div className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-4 text-xs text-left">
                    <div>
                      <span className="font-sans text-alien-green uppercase font-bold text-[9px]">OpenAI GPT Integration</span>
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
                        className="input bg-space-900 border-white/5 flex-grow font-sans text-[11px]"
                      />
                      <button 
                        type="submit"
                        className="bg-alien-green text-space-950 font-bold px-5 h-10 rounded-xl hover:shadow-glow-green text-xs font-sans uppercase whitespace-nowrap"
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
                          className="bg-red-500/10 border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500 px-4 h-10 rounded-xl text-xs font-sans uppercase"
                        >
                          Clear
                        </button>
                      )}
                    </form>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-sans text-gray-400 uppercase font-bold text-[9px] tracking-widest">1. Event Trigger Automations</h3>
                    {automations.map((a) => (
                      <div key={a.id} className="bg-space-950 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4 text-xs">
                        <div>
                          <div className="font-bold text-white">{a.trigger}</div>
                          <div className="text-gray-400 mt-1 font-sans">Action Node: <strong className="text-alien-green">{a.action}</strong></div>
                        </div>

                        <button 
                          onClick={() => toggleAutomation(a.id)}
                          className={cn(
                            "py-1.5 px-4 rounded-xl border font-sans font-bold transition-all text-[10px] uppercase",
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

      {/* 📧 MODAL: CRM EMAIL SENDER */}
      {emailTargetCustomer && (
        <div className="fixed inset-0 bg-space-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-space-900 border border-white/10 p-6 rounded-3xl max-w-lg w-full text-left space-y-4 animate-scale-up">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="font-sans text-base font-bold tracking-tight text-white">Send CRM Email Template</h3>
              <button 
                onClick={() => setEmailTargetCustomer(null)}
                className="text-gray-400 hover:text-white font-sans text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-sans text-gray-400 mb-1.5 block">Recipient</label>
                <div className="bg-space-950 border border-white/5 px-4 py-2.5 rounded-xl text-white font-medium">
                  {emailTargetCustomer.name} ({emailTargetCustomer.email})
                </div>
              </div>

              <div>
                <label className="text-[10px] font-sans text-gray-400 mb-1.5 block">Choose Email Template</label>
                <select 
                  value={selectedEmailTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value, emailTargetCustomer)}
                  className="input bg-space-950 border-white/5 text-white"
                >
                  <option value="win-back">Win-Back Sequence (Come Back Email)</option>
                  <option value="welcome">Welcome Discount Stack</option>
                  <option value="feedback">Product Review / Feedback Request</option>
                  <option value="reward">Special Loyalty Points Bonus</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-sans text-gray-400 mb-1.5 block">Email Subject</label>
                <input 
                  type="text" 
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="input bg-space-950 border-white/5 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-sans text-gray-400 mb-1.5 block">Email Body Message</label>
                <textarea 
                  required
                  value={customEmailBody}
                  onChange={(e) => setCustomEmailBody(e.target.value)}
                  rows={8}
                  className="input bg-space-950 border-white/5 font-sans leading-relaxed whitespace-pre-wrap h-40"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-alien-green text-space-950 font-bold h-11 rounded-xl flex items-center justify-center gap-1.5 hover:shadow-glow-green"
              >
                <Send className="w-4 h-4" />
                <span>Send Email Campaign</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
