'use client'
// app/pos/page.tsx
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  Search, Scan, Plus, Minus, Trash2, User, CreditCard, DollarSign, 
  Settings, Wifi, WifiOff, Share2, Printer, Check, ShoppingBag, 
  Sparkles, RefreshCw, Layers, Award, BarChart2, Shield, ArrowLeft,
  Users, CheckCircle2, AlertTriangle, FileText, Phone, Gift, Tag, Clock
} from 'lucide-react'
import { formatPrice } from '@/lib/utils/pricing'
import { cn } from '@/lib/utils'

// Seeded products for POS catalog matching storefront
const SEEDED_POS_PRODUCTS = [
  { id: 'prod-1', title: 'ASTRO CREATINE (500G)', sku: 'AST-CR-500', barcode: '764000111222', category: 'creatine', price: 39, base_price: 49, stock: 450, desc: 'Pure micronized creatine monohydrate.', image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=100', color: '#00E676', expiry: '2027-09-10' },
  { id: 'prod-2', title: 'BLAST PRE-WORKOUT (300G)', sku: 'BLA-PW-300', barcode: '764000333444', category: 'pre-workout', price: 49, base_price: 65, stock: 280, desc: 'High energy synergistic pre-workout formulation.', image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=100', color: '#FF3D00', expiry: '2027-08-15' },
  { id: 'prod-3', title: 'AMINO FUEL MANGO (300G)', sku: 'AMI-FL-300', barcode: '764000555666', category: 'amino', price: 45, base_price: 55, stock: 190, desc: 'Essential amino acids with natural mango flavor.', image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=100', color: '#FFD600', expiry: '2027-06-20' },
  { id: 'prod-4', title: 'ULTRA SHAKER BOTTLE (700ML)', sku: 'SHK-ULT-700', barcode: '764000777888', category: 'accessories', price: 15, base_price: 20, stock: 95, desc: 'Leak-proof premium shaker with steel mixing ball.', image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=100', color: '#00E5FF', expiry: '2029-12-31' },
  { id: 'prod-5', title: 'OMEGA MATRIX FISH OIL (90 CT)', sku: 'OMG-MAT-90', barcode: '764000999000', category: 'vitamins', price: 29, base_price: 39, stock: 15, desc: 'High potency molecularly distilled Swiss omega-3 fatty acids.', image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=100', color: '#FF007F', expiry: '2026-08-01' } // Low stock and soon expiring
]

const SEEDED_CUSTOMERS = [
  { id: 'cust-1', firstName: 'Shikha', lastName: 'Swiss', phone: '+41 79 123 45 67', email: 'shikha@ufolabz.ch', address: 'Bahnhofstrasse 12', city: 'Zurich', state: 'ZH', zip: '8001', loyaltyPoints: 2400, walletBalance: 150.00, avgSpend: 112.50 },
  { id: 'cust-2', firstName: 'John', lastName: 'Zurich', phone: '+41 79 987 65 43', email: 'john@zurich.ch', address: 'Rua de la Tour 4', city: 'Geneva', state: 'GE', zip: '1201', loyaltyPoints: 595, walletBalance: 0.00, avgSpend: 59.00 }
]

export default function PosDashboard() {
  // Telemetry status states
  const [activeStore, setActiveStore] = useState('Zurich Main Node')
  const [isOnline, setIsOnline] = useState(true)
  const [cashDrawerOpen, setCashDrawerOpen] = useState(false)
  const [cashierPin, setCashierPin] = useState('1004')
  const [isShiftActive, setIsShiftActive] = useState(true)
  const [openingCash, setOpeningCash] = useState(250.00)
  const [closingCash, setClosingCash] = useState(0.00)
  const [salesSummary, setSalesSummary] = useState({ totalSales: 0, salesCount: 0 })

  // Catalog & Filter states
  const [posProducts, setPosProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [barcodeInput, setBarcodeInput] = useState('')

  // Shopping Cart states
  const [cart, setCart] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null)
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false)
  const [customers, setCustomers] = useState<any[]>(SEEDED_CUSTOMERS)

  // New Customer Form inputs
  const [newCustFirstName, setNewCustFirstName] = useState('')
  const [newCustLastName, setNewCustLastName] = useState('')
  const [newCustPhone, setNewCustPhone] = useState('')
  const [newCustEmail, setNewCustEmail] = useState('')
  const [newCustAddress, setNewCustAddress] = useState('')
  const [newCustCity, setNewCustCity] = useState('')
  const [newCustZip, setNewCustZip] = useState('')
  const [newCustCanton, setNewCustCanton] = useState('Zurich')
  const [newCustVat, setNewCustVat] = useState('')

  // Pricing & Discounts
  const [priceTier, setPriceTier] = useState<'retail' | 'wholesale' | 'vip' | 'employee'>('retail')
  const [manualDiscountType, setManualDiscountType] = useState<'none' | 'percent' | 'fixed'>('none')
  const [manualDiscountVal, setManualDiscountVal] = useState(0)
  const [redeemPoints, redeemPointsToggle] = useState(false)
  const [giftCardVal, setGiftCardVal] = useState(0)

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'twint' | 'split'>('cash')
  const [cashReceived, setCashReceived] = useState(0)
  const [cardAmount, setCardAmount] = useState(0) // for splits
  const [cashAmount, setCashAmount] = useState(0) // for splits
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [lastReceipt, setLastReceipt] = useState<any | null>(null)
  const [autoDownloadInvoice, setAutoDownloadInvoice] = useState(true)

  // Invoice generator for downloads & printing
  const getInvoiceHtml = (receipt: any) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>UFO LABZ Invoice - ${receipt.invoiceId}</title>
  <style>
    body {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #06060F;
      color: #FFFFFF;
      padding: 40px;
      margin: 0;
    }
    .invoice-card {
      max-width: 600px;
      margin: 0 auto;
      background: #0E0E24;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 24px;
      margin-bottom: 24px;
    }
    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7B2FBE 0%, #00FF88 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #FFFFFF;
    }
    .brand-name {
      font-family: 'Orbitron', monospace;
      font-size: 20px;
      letter-spacing: 2px;
      font-weight: bold;
    }
    .invoice-title {
      font-size: 14px;
      color: #8888BB;
      text-align: right;
    }
    .invoice-id {
      font-size: 24px;
      font-weight: bold;
      color: #00FF88;
      margin-top: 4px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 32px;
      font-size: 13px;
      color: #8888BB;
    }
    .meta-value {
      color: #FFFFFF;
      font-weight: 500;
      margin-top: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }
    th {
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #8888BB;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 12px;
    }
    td {
      padding: 16px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 14px;
    }
    .text-right {
      text-align: right;
    }
    .summary-box {
      margin-left: auto;
      width: 250px;
      font-size: 13px;
      color: #8888BB;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
    }
    .total-row {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 12px;
      margin-top: 12px;
      color: #FFFFFF;
      font-size: 18px;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 11px;
      color: #8888BB;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      padding-top: 24px;
    }
    .green-glow {
      color: #00FF88;
    }
    @media print {
      body {
        background: #FFFFFF;
        color: #000000;
        padding: 0;
      }
      .invoice-card {
        border: none;
        box-shadow: none;
        background: #FFFFFF;
        color: #000000;
        max-width: 100%;
        padding: 0;
      }
      .meta-value, .brand-name, .invoice-id {
        color: #000000 !important;
      }
      td, th {
        border-bottom-color: #DDDDDD !important;
      }
      .total-row {
        border-top-color: #000000 !important;
        color: #000000 !important;
      }
      .green-glow {
        color: #000000 !important;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div class="logo-container">
        <div class="logo">U</div>
        <div class="brand-name">UFO LABZ</div>
      </div>
      <div class="invoice-title">
        <div>OFFICIAL INVOICE</div>
        <div class="invoice-id">${receipt.invoiceId}</div>
      </div>
    </div>
    
    <div class="meta-grid">
      <div>
        <div>DATE & TIME</div>
        <div class="meta-value">${receipt.date}</div>
      </div>
      <div>
        <div>ISSUED BY</div>
        <div class="meta-value">${receipt.store}</div>
      </div>
      <div>
        <div>CLIENT / GUEST</div>
        <div class="meta-value">${receipt.customer}</div>
      </div>
      <div>
        <div>CASHIER AGENT</div>
        <div class="meta-value">${receipt.cashier}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Product details</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Total Price</th>
        </tr>
      </thead>
      <tbody>
        ${receipt.cart.map((item: any) => `
          <tr>
            <td>
              <div style="font-weight: bold;">${item.product.title}</div>
              <div style="font-size: 11px; color: #8888BB; margin-top: 2px;">SKU: ${item.product.sku}</div>
            </td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">CHF ${(item.product.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="summary-box">
      <div class="summary-row">
        <span>Subtotal</span>
        <span>CHF ${receipt.subtotal.toFixed(2)}</span>
      </div>
      ${receipt.discount > 0 ? `
        <div class="summary-row" style="color: #00FF88; font-weight: bold;">
          <span>Discount Applied</span>
          <span>-CHF ${receipt.discount.toFixed(2)}</span>
        </div>
      ` : ''}
      <div class="summary-row">
        <span>Swiss VAT (8.1%)</span>
        <span>CHF ${receipt.tax.toFixed(2)}</span>
      </div>
      <div class="summary-row total-row">
        <span>Total Paid</span>
        <span class="green-glow">CHF ${receipt.total.toFixed(2)}</span>
      </div>
    </div>

    <div style="margin-top: 32px; font-size: 11px; color: #8888BB; border-top: 1px dashed rgba(255, 255, 255, 0.08); padding-top: 16px;">
      <div>Payment Method: <strong>${receipt.paymentMethod}</strong></div>
      <div>Amount Tendered: CHF ${receipt.received.toFixed(2)}</div>
      ${receipt.change > 0 ? `<div>Change Due: CHF ${receipt.change.toFixed(2)}</div>` : ''}
    </div>

    <div class="footer">
      <div>THANK YOU FOR SHOPPING WITH UFO LABZ GMBH</div>
      <div style="margin-top: 4px; font-size: 9px; color: #8888BB; letter-spacing: 1px;">SWISS LABS INTELLECTUAL PROPERTY</div>
    </div>
  </div>
</body>
</html>
    `
  }

  const downloadReceiptPdf = (receipt: any) => {
    const html = getInvoiceHtml(receipt)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `UFO-LABZ-INVOICE-${receipt.invoiceId}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // UI notifications
  const [alerts, setAlerts] = useState<string[]>([])
  
  // Load products list from localStorage (to merge custom ones) or seed
  useEffect(() => {
    const stored = localStorage.getItem('ufo_catalog_products')
    if (stored) {
      const parsed = JSON.parse(stored)
      const formatted = parsed.map((p: any) => ({
        id: p.id,
        title: p.title,
        sku: p.slug ? p.slug.toUpperCase() : `CUSTOM-${p.id}`,
        barcode: p.barcode || `764000${Math.floor(100000 + Math.random() * 900000)}`,
        category: p.category ? p.category.toLowerCase() : 'custom',
        price: p.price,
        base_price: p.base_price || p.price + 10,
        stock: p.stock,
        desc: p.desc || '',
        image: p.featuredImage || 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=100',
        color: p.product_color || '#00FF88',
        expiry: '2027-12-31'
      }))
      setPosProducts([...SEEDED_POS_PRODUCTS, ...formatted])
    } else {
      setPosProducts(SEEDED_POS_PRODUCTS)
    }

    // Trigger low stock/expiry alerts on load
    const lowStock = SEEDED_POS_PRODUCTS.filter(p => p.stock <= 15).map(p => `Low Stock: ${p.title} (${p.stock} left)`)
    const expiringSoon = SEEDED_POS_PRODUCTS.filter(p => p.expiry.startsWith('2026')).map(p => `Expiring Soon: ${p.title} on ${p.expiry}`)
    setAlerts([...lowStock, ...expiringSoon])
  }, [])

  // Simulating Barcode scan trigger
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcodeInput.trim()) return

    const product = posProducts.find(p => p.barcode === barcodeInput || p.sku.toUpperCase() === barcodeInput.toUpperCase())
    if (product) {
      handleAddToCart(product)
      setBarcodeInput('')
    } else {
      alert(`No product found matching barcode/SKU: "${barcodeInput}"`)
    }
  }

  // Cart operations
  const handleAddToCart = (product: any) => {
    // Expiry check
    if (product.expiry.startsWith('2026')) {
      alert(`⚠️ Expiry Warning: Product "${product.title}" expires on ${product.expiry}. Inspect batch before handoff!`)
    }

    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id)
      if (exists) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      } else {
        return [...prev, { product, quantity: 1, flavor: 'Standard', size: 'Default', note: '' }]
      }
    })
  }

  const handleUpdateQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId))
    } else {
      setCart(prev => prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQty } 
          : item
      ))
    }
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  // Get Pricing Tiers factor
  const getProductPrice = (product: any) => {
    let p = product.price
    if (priceTier === 'wholesale') p = Math.round(product.price * 0.8)
    if (priceTier === 'vip') p = Math.round(product.price * 0.9)
    if (priceTier === 'employee') p = Math.round(product.price * 0.7)
    return p
  }

  // Calculate totals
  const getCartTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (getProductPrice(item.product) * item.quantity), 0)
    
    // Auto Promotions detect
    // Buy 2 Get 1 Free on pre-workout
    let autoPromoDiscount = 0
    const preWorkoutItems = cart.filter(item => item.product.category === 'pre-workout')
    const preWorkoutQty = preWorkoutItems.reduce((sum, item) => sum + item.quantity, 0)
    if (preWorkoutQty >= 3) {
      const pwProduct = preWorkoutItems[0].product
      const price = getProductPrice(pwProduct)
      const freeUnitsCount = Math.floor(preWorkoutQty / 3)
      autoPromoDiscount = price * freeUnitsCount
    }

    // Manual Discounts
    let manualDiscount = 0
    if (manualDiscountType === 'percent') {
      manualDiscount = Math.round(subtotal * (manualDiscountVal / 100))
    } else if (manualDiscountType === 'fixed') {
      manualDiscount = manualDiscountVal
    }

    // Loyalty Points discount (100 points = 1 CHF)
    let loyaltyDiscount = 0
    if (redeemPoints && selectedCustomer) {
      loyaltyDiscount = Math.min(Math.floor(selectedCustomer.loyaltyPoints / 100), subtotal - autoPromoDiscount - manualDiscount)
    }

    const totalDiscount = autoPromoDiscount + manualDiscount + loyaltyDiscount + giftCardVal
    const tax = Math.round((subtotal - totalDiscount) * 0.081 * 100) / 100 // Swiss VAT 8.1%
    const grandTotal = Math.max(0, subtotal - totalDiscount + tax)

    return {
      subtotal,
      autoPromoDiscount,
      manualDiscount,
      loyaltyDiscount,
      totalDiscount,
      tax,
      grandTotal
    }
  }

  // Upsell AI recommendations
  const getAiRecommendations = () => {
    const recommendations: any[] = []
    const cartCategories = cart.map(item => item.product.category)

    if (cartCategories.includes('creatine') || cartCategories.includes('pre-workout')) {
      const shaker = posProducts.find(p => p.category === 'accessories')
      if (shaker && !cart.some(item => item.product.id === shaker.id)) {
        recommendations.push({ product: shaker, reason: 'Complementary shaker cup' })
      }
    }
    if (cartCategories.includes('pre-workout')) {
      const amino = posProducts.find(p => p.category === 'amino')
      if (amino && !cart.some(item => item.product.id === amino.id)) {
        recommendations.push({ product: amino, reason: 'Ideal intra-workout stack' })
      }
    }
    return recommendations.slice(0, 2)
  }

  // Create new customer submit
  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCustFirstName || !newCustPhone) {
      alert('First name and phone number are required!')
      return
    }

    const newCust = {
      id: `cust-${Date.now()}`,
      firstName: newCustFirstName,
      lastName: newCustLastName,
      phone: newCustPhone,
      email: newCustEmail || `${newCustFirstName.toLowerCase()}@guest.ch`,
      address: newCustAddress || 'Walk-in Address',
      city: newCustCity || 'Zurich',
      state: newCustCanton,
      zip: newCustZip || '8000',
      loyaltyPoints: 100, // welcome bonus points
      walletBalance: 0.00,
      avgSpend: 0.00
    }

    setCustomers(prev => [...prev, newCust])
    setSelectedCustomer(newCust)
    setIsNewCustomerModalOpen(false)

    // Clear inputs
    setNewCustFirstName('')
    setNewCustLastName('')
    setNewCustPhone('')
    setNewCustEmail('')
    setNewCustAddress('')
    setNewCustCity('')
    setNewCustZip('')
    setNewCustVat('')
  }

  // Complete checkout process
  const handleCompleteSale = () => {
    if (cart.length === 0) {
      alert('Cannot checkout an empty cart!')
      return
    }

    const { subtotal, totalDiscount, tax, grandTotal } = getCartTotals()

    // Deduct stock locally
    const updatedProducts = posProducts.map(p => {
      const cartItem = cart.find(item => item.product.id === p.id)
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) }
      }
      return p
    })
    setPosProducts(updatedProducts)
    localStorage.setItem('ufo_catalog_products', JSON.stringify(updatedProducts.filter(p => !SEEDED_POS_PRODUCTS.some(sp => sp.id === p.id))))

    // Credit loyalty points to customer (1 CHF spent = 1 point)
    if (selectedCustomer) {
      const addedPoints = Math.floor(grandTotal)
      const deductedPoints = redeemPoints ? Math.min(selectedCustomer.loyaltyPoints, Math.floor(grandTotal * 100)) : 0
      
      setCustomers(prev => prev.map(c => 
        c.id === selectedCustomer.id 
          ? { 
              ...c, 
              loyaltyPoints: c.loyaltyPoints - deductedPoints + addedPoints,
              avgSpend: Math.round(((c.avgSpend + grandTotal) / 2) * 100) / 100
            } 
          : c
      ))
    }

    // Build Receipt object
    const receipt = {
      invoiceId: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString(),
      store: activeStore,
      cashier: 'Beat Meier (Cashier #12)',
      customer: selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : 'Walk-in Guest',
      customerLoyalty: selectedCustomer ? selectedCustomer.loyaltyPoints : 0,
      cart: [...cart],
      subtotal,
      discount: totalDiscount,
      tax,
      total: grandTotal,
      paymentMethod: paymentMethod.toUpperCase(),
      received: paymentMethod === 'cash' ? (cashReceived || grandTotal) : grandTotal,
      change: paymentMethod === 'cash' ? Math.max(0, (cashReceived || grandTotal) - grandTotal) : 0
    }

    // Update sales totals
    setSalesSummary(prev => ({
      totalSales: prev.totalSales + grandTotal,
      salesCount: prev.salesCount + 1
    }))

    setLastReceipt(receipt)
    setIsReceiptModalOpen(true)

    // Auto download if checked
    if (autoDownloadInvoice) {
      downloadReceiptPdf(receipt)
    }
    
    // Clear cart and customer
    setCart([])
    setSelectedCustomer(null)
    setManualDiscountVal(0)
    setGiftCardVal(0)
    redeemPointsToggle(false)
  }

  // Filter products by category
  const filteredProducts = posProducts.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.barcode.includes(searchQuery)
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-space-950 text-white selection:bg-alien-green selection:text-space-950 flex flex-col font-sans">
      
      {/* ─── POS TOP NAVIGATION HEADER ─── */}
      <header className="border-b border-white/5 bg-space-900/90 backdrop-blur-xl px-6 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2 hover:text-alien-green transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-xs uppercase text-gray-400">Back to Cockpit</span>
          </Link>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-alien-green/10 border border-alien-green/20 flex items-center justify-center">
              <span className="text-alien-green text-sm font-bold font-mono">P</span>
            </div>
            <span className="font-display text-lg tracking-wider text-white">UFO POS</span>
            <span className="text-[9px] bg-alien-green/10 border border-alien-green/20 text-alien-green px-2 py-0.5 rounded font-mono uppercase tracking-wider font-bold">
              v1.2 Active
            </span>
          </div>
        </div>

        {/* Live System telemetry feeds */}
        <div className="flex items-center gap-6">
          {/* Active location dispatch */}
          <div className="hidden md:flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-gray-500" />
            <select 
              value={activeStore}
              onChange={(e) => setActiveStore(e.target.value)}
              className="bg-transparent border-none text-xs font-mono font-bold text-alien-green focus:outline-none focus:ring-0 cursor-pointer"
            >
              <option value="Zurich Main Node">Zurich Node (Main)</option>
              <option value="Geneva Depot">Geneva Depot (West)</option>
              <option value="Basel Node">Basel Node (North)</option>
            </select>
          </div>

          {/* Cash Drawer status */}
          <button 
            onClick={() => setCashDrawerOpen(!cashDrawerOpen)}
            className={cn(
              "px-3 py-1 rounded-lg border text-[10px] font-mono font-bold transition-all flex items-center gap-1.5",
              cashDrawerOpen ? "bg-alien-green text-space-950 border-alien-green" : "bg-white/5 border-white/10 text-gray-400"
            )}
          >
            <Shield className="w-3 h-3" />
            <span>DRAWER: {cashDrawerOpen ? 'OPEN' : 'LOCKED'}</span>
          </button>

          {/* Shift telemetry details */}
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-[10px] font-mono text-gray-400">
            <Clock className="w-3 h-3 text-alien-green" />
            <span>SHIFT TOTAL: CHF {salesSummary.totalSales.toFixed(2)} ({salesSummary.salesCount} sales)</span>
          </div>

          {/* Connection sync status */}
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white"
            title="Toggle Connection State simulation"
          >
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-alien-green" />
                <span className="text-[10px] text-alien-green font-bold">ONLINE</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span className="text-[10px] text-red-500 font-bold">OFFLINE SYNCING</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ─── POS MAIN DASHBOARD GRID ─── */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-4rem)]">
        
        {/* LEFT COLUMN: Catalog Grid, Search, Barcode scanners (7 cols) */}
        <div className="lg:col-span-7 flex flex-col border-r border-white/5 bg-space-950/20 overflow-y-auto no-scrollbar">
          
          {/* Top Panel controls */}
          <div className="p-4 bg-space-900 border-b border-white/5 space-y-3">
            {/* Search inputs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Text search */}
              <div className="md:col-span-8 relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, SKU, flavor, ingredients, category..."
                  className="input pl-9 pr-4 py-2 bg-space-950 border-white/10 text-xs w-full focus:border-alien-green/50"
                />
              </div>

              {/* Barcode scan input */}
              <form onSubmit={handleBarcodeSubmit} className="md:col-span-4 relative">
                <Scan className="w-4 h-4 text-alien-green absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Simulate scan..."
                  className="input pl-9 pr-4 py-2 bg-space-950 border-alien-green/30 focus:border-alien-green text-xs w-full text-alien-green font-mono"
                />
              </form>
            </div>

            {/* Category tabs filters */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {['all', 'creatine', 'pre-workout', 'amino', 'vitamins', 'accessories'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border font-mono text-[10px] uppercase font-bold tracking-wider transition-all whitespace-nowrap",
                    activeCategory === cat 
                      ? "bg-alien-green text-space-950 border-alien-green" 
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Active Product Alerts panel (Low stock/Expiring) */}
          {alerts.length > 0 && (
            <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2.5 flex items-center gap-2 text-[10px] text-yellow-500 font-mono overflow-x-auto no-scrollbar">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <div className="flex gap-4 whitespace-nowrap animate-pulse">
                {alerts.join('   |   ')}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((p) => {
              const inStock = p.stock > 0
              const isLowStock = p.stock <= 15
              const isExpiring = p.expiry.startsWith('2026')

              return (
                <div 
                  key={p.id}
                  onClick={() => inStock && handleAddToCart(p)}
                  className={cn(
                    "bg-space-900 border rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 select-none group text-left",
                    inStock ? "border-white/5 hover:border-white/20 active:scale-95" : "border-red-500/20 opacity-40 cursor-not-allowed"
                  )}
                >
                  <div className="space-y-2">
                    {/* Image and Badges */}
                    <div className="relative aspect-square bg-space-950 rounded-xl overflow-hidden flex items-center justify-center">
                      <img src={p.image} alt={p.title} className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform" />
                      
                      {/* Alert labels overlay */}
                      <div className="absolute top-1 left-1 flex flex-col gap-0.5">
                        {isLowStock && <span className="bg-red-500 text-white font-mono text-[7px] px-1 py-0.5 rounded font-bold uppercase">LOW STOCK</span>}
                        {isExpiring && <span className="bg-yellow-500 text-space-950 font-mono text-[7px] px-1 py-0.5 rounded font-bold uppercase">EXPIRY WARNING</span>}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-white leading-normal truncate">{p.title}</h4>
                      <span className="text-[8px] font-mono text-gray-500 uppercase mt-0.5 block">{p.sku}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5">
                    <span className="font-mono text-xs font-bold text-alien-green" style={{ color: p.color }}>
                      CHF {getProductPrice(p).toFixed(2)}
                    </span>
                    <span className="font-mono text-[9px] text-gray-400">
                      {inStock ? `${p.stock} units` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xs font-mono">No products match search criteria.</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Shopping Cart, Customer CRM, Checkout Drawer (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-space-900 border-l border-white/5">
          
          {/* 1. Customer Select Panel */}
          <div className="p-4 border-b border-white/5 bg-space-950/60 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-alien-green" />
                <span>CUSTOMER MANAGEMENT</span>
              </span>
              <button 
                onClick={() => setIsNewCustomerModalOpen(true)}
                className="text-[10px] text-alien-green underline flex items-center gap-1 hover:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Customer</span>
              </button>
            </div>

            <div className="flex gap-2">
              {/* Customer Selector dropdown */}
              <select
                value={selectedCustomer ? selectedCustomer.id : 'guest'}
                onChange={(e) => {
                  const val = e.target.value
                  if (val === 'guest') {
                    setSelectedCustomer(null)
                  } else {
                    const found = customers.find(c => c.id === val)
                    setSelectedCustomer(found || null)
                  }
                }}
                className="input focus:outline-none bg-space-900 border-white/5 text-xs text-white py-1 flex-grow font-mono"
              >
                <option value="guest">Walk-in Guest Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            {/* Display Customer History / Telemetry if selected */}
            {selectedCustomer && (
              <div className="bg-space-900 border border-white/5 rounded-2xl p-3 grid grid-cols-3 gap-2 text-[9px] font-mono text-left animate-fade-in">
                <div>
                  <span className="text-gray-500 block">Alien Points</span>
                  <span className="text-white font-bold text-xs">{selectedCustomer.loyaltyPoints} Pts</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Wallet Credit</span>
                  <span className="text-alien-green font-bold text-xs">CHF {selectedCustomer.walletBalance.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Avg. Order Value</span>
                  <span className="text-white font-bold text-xs">CHF {selectedCustomer.avgSpend.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Cart Items Drawer */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3 text-left">
            <span className="font-mono text-[10px] uppercase font-bold text-gray-400 block mb-1">
              CURRENT SHOPPING CART ({cart.length} items)
            </span>

            {cart.map((item) => {
              const price = getProductPrice(item.product)
              const itemTotal = price * item.quantity

              return (
                <div 
                  key={item.product.id}
                  className="bg-space-950 border border-white/5 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-space-900 overflow-hidden flex items-center justify-center flex-shrink-0">
                    <img src={item.product.image} alt="" className="object-contain w-full h-full p-0.5" />
                  </div>
                  
                  {/* Name and pricing */}
                  <div className="flex-grow min-w-0">
                    <div className="font-bold text-white truncate leading-tight">{item.product.title}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
                      CHF {price.toFixed(2)}/unit
                    </div>
                  </div>

                  {/* Quantity adjusters */}
                  <div className="flex items-center bg-space-900 border border-white/5 rounded-xl px-2 py-1">
                    <button 
                      onClick={() => handleUpdateQty(item.product.id, item.quantity - 1)}
                      className="text-gray-400 hover:text-white p-0.5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-white px-2.5 text-center min-w-[20px]">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => handleUpdateQty(item.product.id, item.quantity + 1)}
                      className="text-gray-400 hover:text-white p-0.5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-mono font-bold text-white min-w-[65px] text-right">
                    CHF {itemTotal.toFixed(2)}
                  </span>

                  <button 
                    onClick={() => handleRemoveFromCart(item.product.id)}
                    className="text-gray-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })}

            {cart.length === 0 && (
              <div className="text-center py-20 text-gray-500 space-y-2 flex flex-col items-center">
                <ShoppingBag className="w-8 h-8 stroke-[1.5] text-gray-600" />
                <span className="text-[11px] font-mono">Cart is currently empty.</span>
              </div>
            )}
          </div>

          {/* 3. AI Upsell recommendation box */}
          {cart.length > 0 && getAiRecommendations().length > 0 && (
            <div className="bg-alien-green/5 border-t border-b border-alien-green/10 p-3 text-xs space-y-2 animate-fade-in text-left">
              <span className="font-mono text-alien-green text-[9px] uppercase font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI UPSELL RECOMMENDATION</span>
              </span>
              
              <div className="flex gap-2">
                {getAiRecommendations().map((rec) => (
                  <div 
                    key={rec.product.id}
                    onClick={() => handleAddToCart(rec.product)}
                    className="bg-space-950 border border-alien-green/20 hover:border-alien-green/40 p-2.5 rounded-xl flex-grow cursor-pointer transition-all flex items-center gap-2 group"
                  >
                    <div className="w-6 h-6 rounded bg-space-900 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img src={rec.product.image} alt="" className="object-contain w-full h-full p-0.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-white truncate leading-tight group-hover:text-alien-green">{rec.product.title}</div>
                      <span className="text-[8px] text-gray-500 block font-mono">{rec.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Checkout pricing summaries, discounts, payment options */}
          <div className="p-4 border-t border-white/5 bg-space-950 space-y-3">
            
            {/* Price Tier & Discount inputs */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              {/* Tier selector */}
              <div>
                <label className="text-[9px] text-gray-500 mb-1 block uppercase">Pricing Tier</label>
                <select
                  value={priceTier}
                  onChange={(e: any) => setPriceTier(e.target.value)}
                  className="input bg-space-900 border-white/5 py-1 text-[10px]"
                >
                  <option value="retail">Retail Pricing</option>
                  <option value="vip">VIP Tier (-10%)</option>
                  <option value="wholesale">Wholesale (-20%)</option>
                  <option value="employee">Employee (-30%)</option>
                </select>
              </div>

              {/* Discount inputs */}
              <div>
                <label className="text-[9px] text-gray-500 mb-1 block uppercase">Manual Discount</label>
                <div className="flex gap-1.5">
                  <select 
                    value={manualDiscountType} 
                    onChange={(e: any) => {
                      setManualDiscountType(e.target.value)
                      setManualDiscountVal(0)
                    }}
                    className="bg-space-900 border border-white/5 text-[10px] text-white rounded-lg focus:outline-none"
                  >
                    <option value="none">None</option>
                    <option value="percent">%</option>
                    <option value="fixed">CHF</option>
                  </select>
                  {manualDiscountType !== 'none' && (
                    <input 
                      type="number"
                      value={manualDiscountVal}
                      onChange={(e) => setManualDiscountVal(parseInt(e.target.value) || 0)}
                      className="input bg-space-900 border-white/5 py-1 text-[10px] w-12 text-center"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Optional Loyalty points & Gift Card redemption */}
            {selectedCustomer && selectedCustomer.loyaltyPoints >= 100 && (
              <div className="flex items-center justify-between bg-white/5 px-3 py-1.5 rounded-lg text-[10px] font-mono">
                <span className="text-gray-400">Redeem Points (Max CHF {Math.floor(selectedCustomer.loyaltyPoints / 100)})</span>
                <input 
                  type="checkbox"
                  checked={redeemPoints}
                  onChange={(e) => redeemPointsToggle(e.target.checked)}
                  className="rounded bg-space-900 border-white/10 text-alien-green focus:ring-0"
                />
              </div>
            )}

            {/* Totals Summary */}
            <div className="space-y-1.5 text-xs text-gray-400 font-mono text-left">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">CHF {getCartTotals().subtotal.toFixed(2)}</span>
              </div>
              
              {getCartTotals().totalDiscount > 0 && (
                <div className="flex justify-between text-alien-green">
                  <span>Discounts Applied</span>
                  <span>-CHF {getCartTotals().totalDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Swiss VAT (8.1%)</span>
                <span>CHF {getCartTotals().tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/5">
                <span>GRAND TOTAL</span>
                <span className="text-alien-green">CHF {getCartTotals().grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Gateways */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {[
                { id: 'cash', label: 'Cash', icon: DollarSign },
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'twint', label: 'TWINT', icon: Sparkles },
                { id: 'split', label: 'Split', icon: Layers }
              ].map((pay) => (
                <button
                  key={pay.id}
                  type="button"
                  onClick={() => setPaymentMethod(pay.id as any)}
                  className={cn(
                    "flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all text-[9px] uppercase font-bold font-mono tracking-wider gap-1",
                    paymentMethod === pay.id 
                      ? "bg-alien-green border-alien-green text-space-950" 
                      : "bg-space-900 border-white/5 text-gray-400 hover:text-white"
                  )}
                >
                  <pay.icon className="w-3.5 h-3.5" />
                  <span>{pay.label}</span>
                </button>
              ))}
            </div>

            {/* Cash Received fields if Cash payment selected */}
            {paymentMethod === 'cash' && (
              <div className="flex gap-2 items-center bg-space-900/60 p-2.5 rounded-xl animate-fade-in">
                <span className="text-[10px] font-mono text-gray-400 uppercase">Cash Received:</span>
                <input 
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                  placeholder="CHF 100.00"
                  className="input bg-space-950 border-white/5 py-1 text-xs max-w-[120px] font-mono text-right"
                />
                {cashReceived > getCartTotals().grandTotal && (
                  <span className="text-[10px] font-mono text-alien-green ml-auto">
                    Change: CHF {(cashReceived - getCartTotals().grandTotal).toFixed(2)}
                  </span>
                )}
              </div>
            )}

            {/* Split amounts inputs */}
            {paymentMethod === 'split' && (
              <div className="grid grid-cols-2 gap-3 bg-space-900/60 p-2.5 rounded-xl animate-fade-in text-[10px] font-mono">
                <div>
                  <label className="text-gray-400 block mb-1">Cash Portion (CHF)</label>
                  <input 
                    type="number"
                    value={cashAmount}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0
                      setCashAmount(val)
                      setCardAmount(Math.max(0, getCartTotals().grandTotal - val))
                    }}
                    className="input bg-space-950 border-white/5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Card Portion (CHF)</label>
                  <input 
                    type="number"
                    value={cardAmount}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0
                      setCardAmount(val)
                      setCashAmount(Math.max(0, getCartTotals().grandTotal - val))
                    }}
                    className="input bg-space-950 border-white/5 py-1 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Auto-download Toggle */}
            <div className="flex items-center gap-2 mb-2 mt-4 px-1">
              <input
                id="autoDownloadCheck"
                type="checkbox"
                checked={autoDownloadInvoice}
                onChange={(e) => setAutoDownloadInvoice(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-space-950 text-alien-green focus:ring-0 cursor-pointer"
              />
              <label htmlFor="autoDownloadCheck" className="text-[10px] font-mono text-gray-400 select-none cursor-pointer">
                Auto-download invoice on checkout completion
              </label>
            </div>

            {/* Dispatch Checkout Complete button */}
            <button
              onClick={handleCompleteSale}
              disabled={cart.length === 0}
              className="w-full bg-alien-green text-space-950 font-bold h-12 rounded-xl text-xs uppercase tracking-wider font-mono hover:shadow-glow-green transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Transaction (Checkout)</span>
            </button>

          </div>

        </div>

      </div>

      {/* ─── MODAL 1: CREATE NEW CUSTOMER FORM ─── */}
      {isNewCustomerModalOpen && (
        <div className="fixed inset-0 bg-space-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-space-900 border border-white/10 p-6 rounded-3xl max-w-md w-full text-left space-y-4 animate-scale-up">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="font-display text-lg tracking-wide uppercase text-white">Create POS Customer Profile</h3>
              <button onClick={() => setIsNewCustomerModalOpen(false)} className="text-gray-400 hover:text-white font-mono text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-gray-400 mb-1 block">First Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={newCustFirstName} 
                    onChange={(e) => setNewCustFirstName(e.target.value)} 
                    placeholder="e.g. Elena"
                    className="input bg-space-950 border-white/5 py-1.5"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-400 mb-1 block">Last Name</label>
                  <input 
                    type="text" 
                    value={newCustLastName} 
                    onChange={(e) => setNewCustLastName(e.target.value)} 
                    placeholder="e.g. Keller"
                    className="input bg-space-950 border-white/5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 mb-1 block">Phone Number *</label>
                <input 
                  type="text" 
                  required 
                  value={newCustPhone} 
                  onChange={(e) => setNewCustPhone(e.target.value)} 
                  placeholder="+41 79 123 45 67"
                  className="input bg-space-950 border-white/5 py-1.5"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 mb-1 block">Email</label>
                <input 
                  type="email" 
                  value={newCustEmail} 
                  onChange={(e) => setNewCustEmail(e.target.value)} 
                  placeholder="name@domain.ch"
                  className="input bg-space-950 border-white/5 py-1.5"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 mb-1 block">Street Address</label>
                <input 
                  type="text" 
                  value={newCustAddress} 
                  onChange={(e) => setNewCustAddress(e.target.value)} 
                  placeholder="Industriestrasse 45"
                  className="input bg-space-950 border-white/5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[10px] font-mono text-gray-400 mb-1 block">City</label>
                  <input 
                    type="text" 
                    value={newCustCity} 
                    onChange={(e) => setNewCustCity(e.target.value)} 
                    placeholder="Zurich"
                    className="input bg-space-950 border-white/5 py-1.5"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-400 mb-1 block">ZIP Code</label>
                  <input 
                    type="text" 
                    value={newCustZip} 
                    onChange={(e) => setNewCustZip(e.target.value)} 
                    placeholder="8000"
                    className="input bg-space-950 border-white/5 py-1.5"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-alien-green text-space-950 font-bold h-10 rounded-xl uppercase font-mono text-xs tracking-wider hover:shadow-glow-green"
              >
                Save Profile to CRM Database
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: INVOICE RECEIPT PRINTER ─── */}
      {isReceiptModalOpen && lastReceipt && (
        <div className="fixed inset-0 bg-space-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-space-900 border border-white/10 p-6 rounded-3xl max-w-sm w-full text-left space-y-4 animate-scale-up">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="font-display text-sm tracking-wide uppercase text-white">Thermal Receipt Preview</h3>
              <button 
                onClick={() => setIsReceiptModalOpen(false)}
                className="text-gray-400 hover:text-white font-mono text-xs p-1"
              >
                ✕
              </button>
            </div>

            {/* Receipt body (Thermal styling) */}
            <div className="bg-white text-space-950 p-4 rounded-xl font-mono text-[10px] space-y-3 leading-normal border border-gray-200 shadow-inner">
              
              {/* Logo block */}
              <div className="text-center">
                <div className="font-bold text-sm tracking-widest font-sans">UFO LABZ</div>
                <div>Swiss Nutrition & Bioengineering</div>
                <div className="text-[9px] text-gray-500">{lastReceipt.store}</div>
              </div>

              {/* Ledger metadata */}
              <div className="border-t border-b border-dashed border-gray-300 py-1.5 space-y-0.5 text-[9px] text-gray-600">
                <div>Invoice ID: {lastReceipt.invoiceId}</div>
                <div>Date/Time: {lastReceipt.date}</div>
                <div>Cashier: {lastReceipt.cashier}</div>
                <div>Customer: {lastReceipt.customer}</div>
              </div>

              {/* Items Table */}
              <div className="space-y-1">
                <div className="grid grid-cols-12 gap-1 font-bold border-b border-gray-200 pb-1">
                  <span className="col-span-6">Item</span>
                  <span className="col-span-2 text-center">Qty</span>
                  <span className="col-span-4 text-right">Price</span>
                </div>
                {lastReceipt.cart.map((item: any, idx: number) => (
                  <div key={idx} className="grid grid-cols-12 gap-1 text-gray-700">
                    <span className="col-span-6 truncate">{item.product.title}</span>
                    <span className="col-span-2 text-center">{item.quantity}</span>
                    <span className="col-span-4 text-right">CHF {(getProductPrice(item.product) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Pricing Math */}
              <div className="border-t border-dashed border-gray-300 pt-2 space-y-0.5 text-right text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>CHF {lastReceipt.subtotal.toFixed(2)}</span>
                </div>
                {lastReceipt.discount > 0 && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>Discount</span>
                    <span>-CHF {lastReceipt.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Swiss VAT (8.1%)</span>
                  <span>CHF {lastReceipt.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-space-950 border-t border-gray-300 pt-1.5">
                  <span>TOTAL paid</span>
                  <span>CHF {lastReceipt.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment ledger math */}
              <div className="border-t border-dashed border-gray-300 pt-2 text-[9px] text-gray-500 space-y-0.5">
                <div>Payment Mode: {lastReceipt.paymentMethod}</div>
                <div>Cash Received: CHF {lastReceipt.received.toFixed(2)}</div>
                {lastReceipt.change > 0 && (
                  <div>Change Handed: CHF {lastReceipt.change.toFixed(2)}</div>
                )}
              </div>

              {/* Footer barcode stamp */}
              <div className="text-center pt-2 space-y-1">
                <div className="inline-block bg-black h-8 w-44 font-sans text-center text-white tracking-widest text-[8px] flex items-center justify-center font-mono">
                  |||||||||| {lastReceipt.invoiceId} ||||||||
                </div>
                <div className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">THANK YOU FOR RE-STRETCHING YOUR LIMITS</div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
              <button 
                onClick={() => {
                  const printWindow = window.open('', '_blank')
                  if (printWindow) {
                    printWindow.document.write(getInvoiceHtml(lastReceipt))
                    printWindow.document.close()
                    printWindow.focus()
                    setTimeout(() => {
                      printWindow.print()
                      printWindow.close()
                    }, 250)
                  }
                  setIsReceiptModalOpen(false)
                }}
                className="bg-alien-green text-space-950 py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:shadow-glow-green"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              
              <button 
                onClick={() => {
                  downloadReceiptPdf(lastReceipt)
                  setIsReceiptModalOpen(false)
                }}
                className="bg-white/5 border border-white/10 text-white py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-white/10"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Get PDF Invoice</span>
              </button>

              <button 
                onClick={() => {
                  alert(`Invoice shared successfully to ${selectedCustomer?.email || 'customer@guest.ch'}!`)
                  setIsReceiptModalOpen(false)
                }}
                className="bg-white/5 border border-white/10 text-white py-2.5 rounded-xl col-span-2 flex items-center justify-center gap-1.5 hover:bg-white/10"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share via Email & WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
