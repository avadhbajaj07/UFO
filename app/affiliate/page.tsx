'use client'
// app/affiliate/page.tsx
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Shield, Award, CheckCircle2, ChevronRight, HelpCircle, DollarSign, 
  TrendingUp, MousePointer, Percent, Share2, Download, Play, 
  Send, Sparkles, User, Mail, Globe, Lock, ArrowLeft, ArrowRight, 
  Trash2, QrCode, MessageCircle, BarChart2, Plus, Phone
} from 'lucide-react'
import { formatPrice } from '@/lib/utils/pricing'
import { cn } from '@/lib/utils'

// Swiss Cantons for dropdown
const CANTONS = [
  'Aargau', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden', 'Basel-Landschaft', 
  'Basel-Stadt', 'Bern', 'Fribourg', 'Geneva', 'Glarus', 'Graubünden', 'Jura', 
  'Luzern', 'Neuchâtel', 'Nidwalden', 'Obwalden', 'Schaffhausen', 'Schwyz', 
  'Solothurn', 'St. Gallen', 'Thurgau', 'Ticino', 'Uri', 'Valais', 'Vaud', 'Zug', 'Zurich'
]

// Mock marketplace products
const MARKETPLACE_PRODUCTS = [
  { id: '1', name: 'Astro Creatine (500g)', slug: 'astro-creatine', rate: '15%', epc: 'CHF 1.42', convRate: '5.2%', isBest: true, isNew: false, price: 39.00 },
  { id: '2', name: 'Blast Pre-Workout (300g)', slug: 'blast-pre-workout', rate: '20%', epc: 'CHF 2.10', convRate: '4.8%', isBest: true, isNew: false, price: 49.00 },
  { id: '3', name: 'Amino Fuel Mango (300g)', slug: 'amino-fuel-mango', rate: '15%', epc: 'CHF 1.15', convRate: '3.9%', isBest: false, isNew: false, price: 45.00 },
  { id: '4', name: 'Special Edition Supplement', slug: 'special-edition', rate: '25%', epc: 'CHF 3.50', convRate: '6.1%', isBest: false, isNew: true, price: 69.00 }
]

// Mock Marketing Downloads
const MARKETING_ASSETS = [
  { title: 'Instagram Story Frame', type: 'IMAGE/PSD', size: '12.4 MB' },
  { title: 'Astro Creatine Reel Overlay', type: 'VIDEO/MP4', size: '24.1 MB' },
  { title: 'Blast Pre-Workout Banner (728x90)', type: 'IMAGE/PNG', size: '1.2 MB' },
  { title: 'UFO LABZ Logo Pack (Vector)', type: 'ZIP/SVG', size: '3.5 MB' }
]

export default function AffiliatePage() {
  // Authentication state simulation
  const [isRegistered, setIsRegistered] = useState(false)
  
  // Registration Form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [socialLink, setSocialLink] = useState('')
  const [canton, setCanton] = useState('Zurich')

  // Dashboard state
  const [activeTab, setActiveTab] = useState('dashboard')

  // Link Generator states
  const [customSlug, setCustomSlug] = useState('maruti')
  const [deepLinkProduct, setDeepLinkProduct] = useState('astro-creatine')
  const [showQrCode, setShowQrCode] = useState(false)

  // AI Prompt copywriter
  const [aiProduct, setAiProduct] = useState('blast-pre-workout')
  const [aiChannel, setAiChannel] = useState('instagram')
  const [generatedCaption, setGeneratedCaption] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Payout forms
  const [withdrawalMethod, setWithdrawalMethod] = useState<'twint' | 'bank' | 'paypal'>('twint')
  const [twintPhone, setTwintPhone] = useState('+41 79 123 45 67')
  const [bankIban, setBankIban] = useState('CH93 0000 0000 0000 0000 0')
  const [payoutsList, setPayoutsList] = useState([
    { date: '2026-06-01', amount: 150.00, method: 'TWINT', status: 'PAID' },
    { date: '2026-05-01', amount: 240.00, method: 'Bank Transfer', status: 'PAID' }
  ])

  // Sync balances and lists
  const [walletBalance, setWalletBalance] = useState(850.00)
  const [commissionsList, setCommissionsList] = useState<any[]>([])
  const [couponsList, setCouponsList] = useState<any[]>([])
  const [newCouponCode, setNewCouponCode] = useState('')

  useEffect(() => {
    // 1. Balance
    const storedBal = localStorage.getItem('ufo_affiliate_balance')
    if (storedBal) {
      setWalletBalance(parseFloat(storedBal))
    } else {
      localStorage.setItem('ufo_affiliate_balance', '850.00')
    }

    // 2. Commissions List
    const storedComms = localStorage.getItem('ufo_affiliate_commissions')
    if (storedComms) {
      setCommissionsList(JSON.parse(storedComms))
    } else {
      const initial = [
        { id: 'UFO-CH-92812', name: 'Blast Pre-Workout (300g)', sale: 49.00, comm: 9.80, status: 'APPROVED' },
        { id: 'UFO-CH-91823', name: 'Astro Creatine (500g)', sale: 39.00, comm: 5.85, status: 'APPROVED' }
      ]
      setCommissionsList(initial)
      localStorage.setItem('ufo_affiliate_commissions', JSON.stringify(initial))
    }

    // 3. Coupons List
    const storedCoupons = localStorage.getItem('ufo_admin_coupons')
    if (storedCoupons) {
      setCouponsList(JSON.parse(storedCoupons))
    } else {
      const initialCoups = [
        { code: 'MARUTI10', affiliateId: 'aff-1', affiliateName: 'Maruti Partner', discountPct: 10, commissionPct: 10, status: 'APPROVED', salesCount: 3, totalRevenue: 137.00, totalCommission: 13.70 }
      ]
      setCouponsList(initialCoups)
      localStorage.setItem('ufo_admin_coupons', JSON.stringify(initialCoups))
    }
  }, [activeTab])

  // Custom deep link outputs
  const referralBase = `https://ufolabz.ch/?ref=${customSlug}`
  const deepLinkResult = `https://ufolabz.ch/products/${deepLinkProduct}/?ref=${customSlug}`

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return
    setIsRegistered(true)
  }

  // Auto-fill demo credentials
  const handlePrefillRegister = () => {
    setName('Maruti Partner')
    setEmail('maruti@affiliate.ch')
    setPhone('+41 79 987 65 43')
    setWebsite('https://fitlife-switzerland.ch')
    setSocialLink('instagram.com/fitlife_ch')
  }

  const handleGenerateAiCaption = async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsGenerating(false)

    let copy = ''
    if (aiProduct === 'blast-pre-workout') {
      copy = aiChannel === 'instagram' 
        ? '⚡ BLAST OFF! Reached new heights in training today with UFO LABZ Pre-Workout. Insane pump and zero crash. Use my code MARUTI10 to get 10% off your next energy boost! Link in bio. 🛸 #ufolabz #preworkout #fitswiss'
        : '📥 Hey team! Just released my review of the Blast Pre-Workout. The focus is unlike anything I’ve tested this year. 200mg Caffeine + L-Citrulline. Grab yours here for 10% off: https://ufolabz.ch/products/blast-pre-workout/?ref=maruti'
    } else {
      copy = aiChannel === 'instagram'
        ? '🪐 Clean strength synthesis. Astro Creatine is 100% pure micronized monohydrate. Easy mix, pure absorption. Support your recovery with CHF 5.- off using coupon code WELCOME500. Link in bio! 🏋️ #creatine #supplements #swissfit'
        : '📝 Muscle growth requires nutritional consistency. Astro Creatine monohydrate has been a game changer for ATP replenishment. Get it with 10% off: https://ufolabz.ch/products/astro-creatine/?ref=maruti'
    }
    setGeneratedCaption(copy)
  }

  // Request custom coupon
  const handleRequestCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const code = newCouponCode.trim().toUpperCase()
    if (!code) return

    const exists = couponsList.some(c => c.code === code)
    if (exists) {
      alert('This coupon code is already registered!')
      return
    }

    const created = {
      code,
      affiliateId: 'aff-1',
      affiliateName: name || 'Maruti Partner',
      discountPct: 10,
      commissionPct: 10,
      status: 'PENDING',
      salesCount: 0,
      totalRevenue: 0.00,
      totalCommission: 0.00
    }

    const updated = [...couponsList, created]
    setCouponsList(updated)
    localStorage.setItem('ufo_admin_coupons', JSON.stringify(updated))
    setNewCouponCode('')
    alert(`Promo code request for "${code}" successfully submitted to admin control panel for approval!`)
  }

  // Trigger simulated payouts
  const handleRequestPayout = () => {
    const amount = walletBalance // available withdrawal balance
    const methodLabel = withdrawalMethod === 'twint' ? 'TWINT' : (withdrawalMethod === 'paypal' ? 'PayPal' : 'Bank Transfer')
    const today = new Date().toISOString().split('T')[0]
    setPayoutsList([{ date: today, amount, method: methodLabel, status: 'PROCESSING' }, ...payoutsList])
    
    // Reset local storage balance
    setWalletBalance(0)
    localStorage.setItem('ufo_affiliate_balance', '0.00')
    alert('Withdrawal request successfully registered! Processing takes 1-2 Swiss business days.')
  }

  // Sidebar Dashboard Menu items
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'links', label: 'Referral Links', icon: QrCode },
    { id: 'coupons', label: 'Promo Coupons', icon: Percent },
    { id: 'marketplace', label: 'Marketplace', icon: Share2 },
    { id: 'commissions', label: 'Commissions', icon: DollarSign },
    { id: 'wallet', label: 'Wallet & Payouts', icon: Shield },
    { id: 'marketing', label: 'Assets Hub', icon: Download },
    { id: 'ai', label: 'AI Caption Writer', icon: Sparkles }
  ]

  return (
    <div className="min-h-screen bg-space-950 text-white selection:bg-alien-green selection:text-space-950 font-sans">
      
      {/* ─── HEADER ─── */}
      <header className="border-b border-white/5 bg-space-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-alien-green/20 border border-alien-green/40 flex items-center justify-center">
              <span className="text-alien-green text-xs font-bold font-mono">U</span>
            </div>
            <span className="font-display text-xl tracking-wider text-white">UFO LABZ</span>
          </Link>
          <span className="text-xs font-mono text-gray-400">PARTNER PORTAL</span>
        </div>
      </header>

      {/* ─── DUAL STATE LAYOUT ─── */}
      {!isRegistered ? (
        
        // ─── STATE 1: VISITOR LANDING & REGISTRATION ───
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          
          {/* Hero Section */}
          <section className="text-center space-y-6 max-w-3xl mx-auto relative pt-12">
            <div className="absolute inset-0 bg-space-950 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-90 h-90 rounded-full bg-alien-green/5 blur-3xl" />
            </div>

            <span className="text-xs text-alien-green font-mono uppercase tracking-widest bg-alien-green/10 border border-alien-green/20 px-3 py-1 rounded-full">
              UFO CREW INVITATION
            </span>
            <h1 className="font-display text-5xl md:text-7xl tracking-wider text-white leading-none uppercase">
              EARN UP TO 25% COMMISSION
            </h1>
            <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed">
              Partner with Switzerland's premium supplement brand. Promote science-backed performance formulas and earn payouts directly via TWINT or bank transfers.
            </p>
            <div className="pt-4">
              <a href="#apply" className="bg-alien-green text-space-950 font-bold px-8 py-3.5 rounded-xl hover:shadow-glow-green active:scale-98 transition-all inline-block">
                Apply to Program
              </a>
            </div>
          </section>

          {/* Program Features */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-space-900 border border-white/5 p-6 rounded-2xl space-y-3 text-left">
              <div className="w-12 h-12 bg-alien-green/10 border border-alien-green/20 rounded-xl flex items-center justify-center text-xl">
                🚀
              </div>
              <h3 className="font-bold text-lg text-white">High Payout Tiers</h3>
              <p className="text-xs text-gray-400 leading-relaxed">Earn 15% standard base commissions. Unlock up to 25% rates as your referral volume increases.</p>
            </div>

            <div className="bg-space-900 border border-white/5 p-6 rounded-2xl space-y-3 text-left">
              <div className="w-12 h-12 bg-alien-green/10 border border-alien-green/20 rounded-xl flex items-center justify-center text-xl">
                📱
              </div>
              <h3 className="font-bold text-lg text-white">TWINT Swiss Payouts</h3>
              <p className="text-xs text-gray-400 leading-relaxed">We support standard localized payments. Withdraw your earnings securely via TWINT or direct bank transfers.</p>
            </div>

            <div className="bg-space-900 border border-white/5 p-6 rounded-2xl space-y-3 text-left">
              <div className="w-12 h-12 bg-alien-green/10 border border-alien-green/20 rounded-xl flex items-center justify-center text-xl">
                📊
              </div>
              <h3 className="font-bold text-lg text-white">Quantum Link Builders</h3>
              <p className="text-xs text-gray-400 leading-relaxed">Use deep-link custom product creators and mobile QR Codes to track conversion rates in real time.</p>
            </div>
          </section>

          {/* How it works */}
          <section className="text-center space-y-12">
            <h2 className="font-display text-3xl uppercase tracking-wider text-white">HOW IT WORKS</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
              {[
                { step: '01', title: 'Submit Cargo Info', desc: 'Complete the short application form detailing your social channels.' },
                { step: '02', title: 'Recruit Athletes', desc: 'Share custom tracking referral links or product QR codes.' },
                { step: '03', title: 'Log Conversions', desc: 'Track clicks, sales, and pending credit inside your dashboard.' },
                { step: '04', title: 'Collect Commissions', desc: 'Receive secure payouts directly to your local bank or TWINT account.' }
              ].map((item) => (
                <div key={item.step} className="bg-space-900 border border-white/5 p-6 rounded-2xl space-y-4">
                  <div className="text-2xl font-mono font-bold text-alien-green">{item.step}.</div>
                  <h4 className="font-bold text-white text-base">{item.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Registration Section */}
          <section id="apply" className="max-w-xl mx-auto bg-space-900 border border-white/5 p-8 rounded-3xl space-y-6">
            <div className="text-center">
              <h2 className="font-display text-3xl tracking-wide uppercase text-white">PARTNER REGISTRATION</h2>
              <p className="text-xs text-gray-400 mt-1">Submit your details to activate your affiliate dashboard immediately.</p>
              <button 
                onClick={handlePrefillRegister}
                className="text-[10px] font-mono text-alien-green mt-2 hover:underline"
              >
                [Auto-Fill Demo Credentials]
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maruti Partner"
                    className="input"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maruti@affiliate.ch"
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Phone Number</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+41 79 987 65 43"
                    className="input"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Swiss Canton</label>
                  <select 
                    value={canton}
                    onChange={(e) => setCanton(e.target.value)}
                    className="input focus:outline-none bg-space-950"
                  >
                    {CANTONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Website / Blog (Optional)</label>
                <input 
                  type="url" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://fitlife-switzerland.ch"
                  className="input"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Social Media Links (e.g. Instagram, TikTok)</label>
                <input 
                  type="text" 
                  value={socialLink}
                  onChange={(e) => setSocialLink(e.target.value)}
                  placeholder="instagram.com/fitlife_ch"
                  className="input"
                />
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input 
                  type="checkbox" 
                  required
                  id="agree"
                  className="w-4 h-4 rounded accent-alien-green mt-0.5 cursor-pointer"
                />
                <label htmlFor="agree" className="text-[10px] text-gray-400 cursor-pointer leading-normal">
                  I agree to the UFO LABZ Affiliate Terms of Service, allowing commission verification, fraud protection limits, and secure Swiss payout guidelines.
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-alien-green text-space-950 font-bold rounded-xl shadow-glow-green text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-2xl transition-all"
              >
                <span>Create Partner Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </section>

        </div>
      ) : (
        
        // ─── STATE 2: PARTNER DASHBOARD VIEW ───
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left navigation sidebar (width: 3 cols) */}
            <aside className="lg:col-span-3 bg-space-900 border border-white/5 rounded-3xl p-4 space-y-2 overflow-x-auto lg:overflow-x-visible no-scrollbar flex lg:flex-col gap-1 lg:gap-0">
              <div className="hidden lg:flex items-center gap-3 pb-4 mb-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-full bg-alien-green/10 border border-alien-green/20 flex items-center justify-center text-base font-bold">
                  🤝
                </div>
                <div className="text-left text-xs">
                  <div className="font-bold text-white max-w-[140px] truncate">{name || 'Maruti Partner'}</div>
                  <span className="text-[10px] text-alien-green font-mono uppercase font-bold">GALAXY ELITE PARTNER</span>
                </div>
              </div>

              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap lg:w-full",
                      activeTab === item.id 
                        ? "bg-alien-green text-space-950 font-bold shadow-glow-green" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                )
              })}

              <button 
                onClick={() => setIsRegistered(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono font-medium text-red-400 hover:text-red-500 hover:bg-red-500/5 whitespace-nowrap lg:w-full lg:mt-6"
              >
                <ArrowLeft className="w-4 h-4 flex-shrink-0" />
                <span>Exit Dashboard</span>
              </button>
            </aside>

            {/* Right main display (width: 9 cols) */}
            <main className="lg:col-span-9 bg-space-900 border border-white/5 rounded-3xl p-6 md:p-8 min-h-[600px] relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[300px] h-[300px] rounded-full bg-alien-green/5 blur-[80px]" />
              </div>

              <div className="relative z-10 w-full text-left">
                
                {/* 🏠 DASHBOARD PANEL */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="font-display text-3xl tracking-wide uppercase text-white">CREW METRICS</h2>
                      <p className="text-xs text-gray-400">Welcome, {name || 'Maruti Partner'}. Your referral parameters are active.</p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Lifetime Earnings</span>
                        <div className="text-xl font-mono font-bold text-white mt-1">
                          {formatPrice(commissionsList.reduce((acc, c) => acc + c.comm, 0) + 390.00)}
                        </div>
                        <span className="text-[9px] text-gray-500">Paid + pending commissions</span>
                      </div>

                      <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Wallet Balance</span>
                        <div className="text-xl font-mono font-bold text-alien-green mt-1">{formatPrice(walletBalance)}</div>
                        <span className="text-[9px] text-gray-500">Available for withdrawal</span>
                      </div>

                      <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Today's Clicks</span>
                        <div className="text-xl font-mono font-bold text-white mt-1">142 Clicks</div>
                        <span className="text-[9px] text-gray-500">Click tracking index</span>
                      </div>

                      <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Conversion Rate</span>
                        <div className="text-xl font-mono font-bold text-white mt-1">4.8%</div>
                        <span className="text-[9px] text-gray-500">Average sales conversion</span>
                      </div>
                    </div>

                    {/* Quick overview link builder */}
                    <div className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">Default referral code</h4>
                        <span className="text-[10px] font-mono text-alien-green">Cookie Duration: 30 Days</span>
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          readOnly 
                          value={referralBase}
                          className="input text-xs font-mono py-2 bg-space-900 border-white/5"
                        />
                        <button 
                          onClick={() => navigator.clipboard.writeText(referralBase)}
                          className="bg-white hover:bg-gray-100 text-space-950 font-bold px-4 rounded-xl text-xs"
                        >
                          Copy Link
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 🔗 REFERRAL LINKS PANEL */}
                {activeTab === 'links' && (
                  <div className="space-y-6 animate-fade-in">
                    <h2 className="font-display text-3xl tracking-wide uppercase text-white">REFERRAL QUANTUM LINKS</h2>

                    {/* Slug selector */}
                    <div className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-3">
                      <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">1. Custom referral slug</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={customSlug}
                          onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                          placeholder="e.g. maruti"
                          className="input text-xs font-mono py-2 bg-space-900 border-white/5"
                        />
                      </div>
                      <p className="text-[10px] text-gray-500">Generates custom link slug matching your brand code.</p>
                    </div>

                    {/* Deep link builder */}
                    <div className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-4">
                      <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">2. Deep product link generator</label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-mono text-gray-500 block mb-1">Target Product</label>
                          <select 
                            value={deepLinkProduct}
                            onChange={(e) => setDeepLinkProduct(e.target.value)}
                            className="input focus:outline-none bg-space-900 border-white/5 text-xs py-2 text-white"
                          >
                            <option value="astro-creatine">Astro Creatine (500g)</option>
                            <option value="blast-pre-workout">Blast Pre-Workout (300g)</option>
                            <option value="amino-fuel-mango">Amino Fuel Mango (300g)</option>
                            <option value="special-edition">Special Edition</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[9px] font-mono text-gray-500 block mb-1">Output URL</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              readOnly 
                              value={deepLinkResult}
                              className="input text-xs font-mono py-2 bg-space-900 border-white/5"
                            />
                            <button 
                              onClick={() => navigator.clipboard.writeText(deepLinkResult)}
                              className="bg-white hover:bg-gray-100 text-space-950 font-bold px-3 rounded-lg text-xs"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2">
                        <button 
                          onClick={() => setShowQrCode(!showQrCode)}
                          className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-1.5 px-3 rounded-lg border border-white/5 flex items-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Generate QR Code</span>
                        </button>
                      </div>

                      {showQrCode && (
                        <div className="bg-white p-4 rounded-xl w-32 h-32 mx-auto flex items-center justify-center shadow-lg border-2 border-space-900 animate-fade-in">
                          <div className="w-full h-full border border-gray-100 relative">
                            <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_2px,transparent_2px)] bg-[size:6px_6px]" />
                            <div className="absolute top-1 left-1 w-5 h-5 border-2 border-blue-900 bg-white" />
                            <div className="absolute top-1 right-1 w-5 h-5 border-2 border-blue-900 bg-white" />
                            <div className="absolute bottom-1 left-1 w-5 h-5 border-2 border-blue-900 bg-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 🎟 PROMO COUPONS PANEL */}
                {activeTab === 'coupons' && (
                  <div className="space-y-6 animate-fade-in">
                    <h2 className="font-display text-3xl tracking-wide uppercase text-white">PROMO COUPONS</h2>
                    
                    {/* Request new Coupon */}
                    <form onSubmit={handleRequestCouponSubmit} className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">Request Custom Discount Code</h4>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          required
                          value={newCouponCode}
                          onChange={(e) => setNewCouponCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                          placeholder="e.g. MARUTI10"
                          className="input text-xs font-mono py-2 bg-space-900 border-white/5"
                        />
                        <button 
                          type="submit"
                          className="bg-alien-green text-space-950 font-bold px-6 rounded-xl text-xs"
                        >
                          Request Code
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        When approved by Admin, customers using this code get **10% OFF** and you earn **10% COMMISSION** on their order.
                      </p>
                    </form>

                    {/* Coupons list */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">My Coupons</h4>
                      {couponsList.filter(c => c.affiliateId === 'aff-1').map((coup) => (
                        <div key={coup.code} className="bg-space-950 border border-white/5 p-4 rounded-xl flex items-center justify-between text-xs font-mono">
                          <div>
                            <div className="font-bold text-sm text-white">{coup.code}</div>
                            <span className="text-[10px] text-gray-400">Discount: {coup.discountPct}% · Comm: {coup.commissionPct}%</span>
                          </div>
                          <div className="text-right">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[8px] font-bold",
                              coup.status === 'APPROVED' ? "bg-alien-green/10 text-alien-green border border-alien-green/20" :
                              coup.status === 'REJECTED' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                              "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                            )}>
                              {coup.status}
                            </span>
                            <div className="text-[10px] text-gray-400 mt-1">Orders: {coup.salesCount} · Earned: {formatPrice(coup.totalCommission)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 🛍 MARKETPLACE PANEL */}
                {activeTab === 'marketplace' && (
                  <div className="space-y-6 animate-fade-in">
                    <h2 className="font-display text-3xl tracking-wide uppercase text-white">COMMISSION MARKETPLACE</h2>
                    
                    <div className="space-y-4">
                      {MARKETPLACE_PRODUCTS.map((prod) => (
                        <div key={prod.id} className="bg-space-950 border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{prod.name}</span>
                              {prod.isBest && <span className="text-[8px] bg-alien-green/10 text-alien-green border border-alien-green/20 px-1.5 py-0.5 rounded font-mono">BEST SELLER</span>}
                              {prod.isNew && <span className="text-[8px] bg-blue-500/10 text-blue-500 border border-blue-500/20 px-1.5 py-0.5 rounded font-mono">NEW</span>}
                            </div>
                            <div className="text-gray-400 mt-1">Base Price: {formatPrice(prod.price)} · Est. EPC: {prod.epc}</div>
                          </div>

                          <div className="flex items-center gap-6 text-right">
                            <div>
                              <span className="text-[9px] font-mono text-gray-500 block">Commission Rate</span>
                              <span className="font-mono text-sm font-bold text-alien-green">{prod.rate}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono text-gray-500 block">Est. Payout</span>
                              <span className="font-mono text-sm font-bold text-white">{formatPrice(prod.price * parseFloat(prod.rate)/100)}</span>
                            </div>
                            <button 
                              onClick={() => {
                                const deepUrl = `https://ufolabz.ch/products/${prod.slug}/?ref=${customSlug}`
                                navigator.clipboard.writeText(deepUrl)
                                alert(`Deep link copied for ${prod.name}!`)
                              }}
                              className="bg-white hover:bg-gray-100 text-space-950 font-bold px-3 py-2 rounded-lg font-sans"
                            >
                              Share Link
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 💰 COMMISSIONS PANEL */}
                {activeTab === 'commissions' && (
                  <div className="space-y-6 animate-fade-in">
                    <h2 className="font-display text-3xl tracking-wide uppercase text-white">COMMISSION HISTORY</h2>
                    
                    <div className="bg-space-950 border border-white/5 rounded-2xl overflow-hidden text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white/5 border-b border-white/5 font-mono text-[9px] text-gray-400 uppercase">
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Product</th>
                            <th className="p-3">Total Sale</th>
                            <th className="p-3">Commission</th>
                            <th className="p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {commissionsList.map((item, idx) => (
                            <tr key={idx}>
                              <td className="p-3 font-mono text-gray-300">{item.id}</td>
                              <td className="p-3 font-bold text-white">{item.name}</td>
                              <td className="p-3 font-mono text-gray-300">{formatPrice(item.sale)}</td>
                              <td className="p-3 font-mono font-bold text-alien-green">{formatPrice(item.comm)}</td>
                              <td className="p-3">
                                <span className={cn(
                                  "px-2 py-0.5 rounded font-mono text-[8px] font-bold",
                                  item.status === 'APPROVED' ? "bg-alien-green/10 text-alien-green border border-alien-green/20" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                )}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 👛 WALLET & WITHDRAWALS */}
                {activeTab === 'wallet' && (
                  <div className="space-y-6 animate-fade-in">
                    <h2 className="font-display text-3xl tracking-wide uppercase text-white">PARTNER WALLET</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-space-950 border border-white/5 p-4 rounded-2xl text-center">
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Available Balance</span>
                        <div className="text-3xl font-mono font-bold text-alien-green mt-1">CHF 850.00</div>
                        <span className="text-[9px] text-gray-500">Eligible for payouts</span>
                      </div>

                      <div className="bg-space-950 border border-white/5 p-4 rounded-2xl text-center">
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Pending Balance</span>
                        <div className="text-3xl font-mono font-bold text-yellow-500 mt-1">CHF 17.25</div>
                        <span className="text-[9px] text-gray-500">Awaiting validation</span>
                      </div>

                      <div className="bg-space-950 border border-white/5 p-4 rounded-2xl text-center">
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Lifetime Paid</span>
                        <div className="text-3xl font-mono font-bold text-white mt-1">CHF 390.00</div>
                        <span className="text-[9px] text-gray-500">Total payouts processed</span>
                      </div>
                    </div>

                    {/* Withdrawal Form */}
                    <div className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-4">
                      <h3 className="text-sm font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">REQUEST PAYOUT</h3>
                      
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 block mb-1.5">Withdrawal Method</label>
                          <div className="flex gap-2">
                            {['twint', 'bank', 'paypal'].map((method) => (
                              <button
                                key={method}
                                type="button"
                                onClick={() => setWithdrawalMethod(method as any)}
                                className={cn(
                                  "py-2 px-4 rounded-xl border font-mono font-bold transition-all text-center flex-1 text-[10px] uppercase",
                                  withdrawalMethod === method 
                                    ? "bg-alien-green text-space-950 border-alien-green" 
                                    : "border-white/5 text-gray-400 hover:border-white/10"
                                )}
                              >
                                {method}
                              </button>
                            ))}
                          </div>
                        </div>

                        {withdrawalMethod === 'twint' && (
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 block mb-1">TWINT Phone Number</label>
                            <input 
                              type="text" 
                              value={twintPhone}
                              onChange={(e) => setTwintPhone(e.target.value)}
                              placeholder="+41 79 123 45 67"
                              className="input text-xs py-2 bg-space-900 border-white/5"
                            />
                          </div>
                        )}

                        {withdrawalMethod === 'bank' && (
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 block mb-1">Swiss IBAN Number</label>
                            <input 
                              type="text" 
                              value={bankIban}
                              onChange={(e) => setBankIban(e.target.value)}
                              placeholder="CH93 0000 0000 0000 0000 0"
                              className="input text-xs py-2 bg-space-900 border-white/5"
                            />
                          </div>
                        )}

                        <div className="pt-2 flex justify-between items-center text-xs">
                          <span className="text-gray-400">Minimum withdrawal limit: <strong className="text-white font-mono">CHF 50.00</strong></span>
                          <button 
                            type="button"
                            onClick={handleRequestPayout}
                            disabled={walletBalance < 50}
                            className="bg-alien-green text-space-950 font-bold px-6 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Withdraw {formatPrice(walletBalance)}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Payout Logs */}
                    <div className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">Payout history</h4>
                      <div className="space-y-2 text-xs">
                        {payoutsList.map((p, idx) => (
                          <div key={idx} className="flex justify-between p-3 bg-space-900 rounded-xl items-center font-mono">
                            <div>
                              <div className="font-bold text-white">{p.method}</div>
                              <span className="text-[10px] text-gray-500">{p.date}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-white">{formatPrice(p.amount)}</div>
                              <span className={cn(
                                "text-[9px] font-bold",
                                p.status === 'PAID' ? "text-alien-green" : "text-yellow-500"
                              )}>{p.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 🎓 TRAINING & ASSETS PANEL */}
                {activeTab === 'marketing' && (
                  <div className="space-y-6 animate-fade-in">
                    <h2 className="font-display text-3xl tracking-wide uppercase text-white">MARKETING ASSETS</h2>
                    
                    <div className="space-y-3">
                      {MARKETING_ASSETS.map((asset, idx) => (
                        <div key={idx} className="bg-space-950 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4 text-xs">
                          <div>
                            <div className="font-bold text-white">{asset.title}</div>
                            <span className="text-[10px] text-gray-500 font-mono">Format: {asset.type}</span>
                          </div>
                          <button onClick={() => alert('Download initialized!')} className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-2 px-3 rounded-lg border border-white/5 flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5" />
                            <span>Download ({asset.size})</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 🤖 AI CAPTION WRITER PANEL */}
                {activeTab === 'ai' && (
                  <div className="space-y-6 animate-fade-in">
                    <h2 className="font-display text-3xl tracking-wide uppercase text-white">AI PROMOTION CAPTION WRITER</h2>
                    
                    <div className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-4 text-xs">
                      <div>
                        <h4 className="font-bold text-white text-sm">Generate copy text for social promotion</h4>
                        <p className="text-[10px] text-gray-400">Select a product and media channel, and let our sports nutrition writer generate high-converting promotional copies.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 block mb-1">Target Product</label>
                          <select 
                            value={aiProduct}
                            onChange={(e) => setAiProduct(e.target.value)}
                            className="input focus:outline-none bg-space-900 border-white/5 text-xs py-2 text-white font-mono"
                          >
                            <option value="astro-creatine">Astro Creatine monohydrate</option>
                            <option value="blast-pre-workout">Blast Pre-Workout energy</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gray-500 block mb-1">Social Channel</label>
                          <select 
                            value={aiChannel}
                            onChange={(e) => setAiChannel(e.target.value)}
                            className="input focus:outline-none bg-space-900 border-white/5 text-xs py-2 text-white font-mono"
                          >
                            <option value="instagram">Instagram Frame / Reel copy</option>
                            <option value="email">Email Campaign pitch</option>
                          </select>
                        </div>
                      </div>

                      {/* Generated result */}
                      {generatedCaption && (
                        <div className="bg-space-900 border border-white/5 p-4 rounded-xl space-y-2 animate-fade-in">
                          <span className="text-[9px] font-mono text-alien-green font-bold">Suggested copy text:</span>
                          <p className="text-gray-200 leading-relaxed font-sans">{generatedCaption}</p>
                          <button 
                            type="button"
                            onClick={() => navigator.clipboard.writeText(generatedCaption)}
                            className="text-[10px] font-mono text-white hover:text-alien-green underline block"
                          >
                            Copy text to clipboard
                          </button>
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        <button 
                          onClick={handleGenerateAiCaption}
                          disabled={isGenerating}
                          className="bg-alien-green text-space-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 hover:shadow-glow-green"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{isGenerating ? 'Generating caption...' : 'Write Promotion Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </main>

          </div>
        </div>
      )}

    </div>
  )
}
