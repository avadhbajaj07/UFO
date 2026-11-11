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
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth'
import ComingSoon from '@/components/ComingSoon'

// Swiss Cantons for dropdown
const CANTONS = [
  'Aargau', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden', 'Basel-Landschaft', 
  'Basel-Stadt', 'Bern', 'Fribourg', 'Geneva', 'Glarus', 'Graubünden', 'Jura', 
  'Luzern', 'Neuchâtel', 'Nidwalden', 'Obwalden', 'Schaffhausen', 'Schwyz', 
  'Solothurn', 'St. Gallen', 'Thurgau', 'Ticino', 'Uri', 'Valais', 'Vaud', 'Zug', 'Zurich'
]

const COMING_SOON = false

export default function AffiliatePage() {
  if (COMING_SOON) {
    return <ComingSoon />
  }

  const { user, profile, setUser, isLoading, setIsLoading } = useAuthStore()
  const [affiliateRecord, setAffiliateRecord] = useState<any>(null)
  const [isCheckingRecord, setIsCheckingRecord] = useState(true)
  const [dbProducts, setDbProducts] = useState<any[]>([])
  const [googleLoading, setGoogleLoading] = useState(false)

  // Safety timeout: Never stay stuck on loading screen longer than 600ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingRecord(false)
      setIsLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [setIsLoading])

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
  const [customSlug, setCustomSlug] = useState('partner')
  const [deepLinkProduct, setDeepLinkProduct] = useState('astro-creatine')
  const [showQrCode, setShowQrCode] = useState(false)

  // Payout forms
  const [withdrawalMethod, setWithdrawalMethod] = useState<'twint' | 'bank' | 'paypal'>('twint')
  const [twintPhone, setTwintPhone] = useState('+41 79 123 45 67')
  const [bankIban, setBankIban] = useState('CH93 0000 0000 0000 0000 0')
  const [payoutsList, setPayoutsList] = useState<any[]>([])

  // Sync balances and lists
  const [walletBalance, setWalletBalance] = useState(0.00)
  const [commissionsList, setCommissionsList] = useState<any[]>([])
  const [couponsList, setCouponsList] = useState<any[]>([])
  const [newCouponCode, setNewCouponCode] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const res = await fetch('/api/affiliate/portal')
        const data = await res.json().catch(() => ({}))

        if (!isMounted) return

        if (data.authenticated) {
          if (data.user && !user) {
            setUser(data.user)
          }

          if (data.affiliate) {
            setAffiliateRecord(data.affiliate)
            setWalletBalance(Number(data.affiliate.balance || 0))
            setCustomSlug(data.affiliate.code || 'partner')

            if (data.affiliate.payoutMethod) setWithdrawalMethod(data.affiliate.payoutMethod)
            if (data.affiliate.payoutDetails?.twint_phone) setTwintPhone(data.affiliate.payoutDetails.twint_phone)
            if (data.affiliate.payoutDetails?.bank_iban) setBankIban(data.affiliate.payoutDetails.bank_iban)
            if (data.affiliate.payoutDetails?.website) setWebsite(data.affiliate.payoutDetails.website)
            if (data.affiliate.payoutDetails?.social_link) setSocialLink(data.affiliate.payoutDetails.social_link)
          } else {
            setAffiliateRecord(null)
          }

          if (data.coupons) setCouponsList(data.coupons)
          if (data.commissions) setCommissionsList(data.commissions)
          if (data.payouts) setPayoutsList(data.payouts)

          if (data.products && data.products.length > 0) {
            setDbProducts(data.products)
            setDeepLinkProduct(data.products[0].slug)
          }
        } else {
          setAffiliateRecord(null)
        }
      } catch (err) {
        console.warn('[AFFILIATE PAGE] Error syncing partner data:', err)
      } finally {
        if (isMounted) {
          setIsCheckingRecord(false)
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [setUser, setIsLoading])

  // Custom deep link outputs
  const referralBase = `https://ufolabz.com/?ref=${customSlug}`
  const deepLinkResult = `https://ufolabz.com/products/${deepLinkProduct}/?ref=${customSlug}`

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    try {
      const res = await fetch('/api/affiliate/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'apply',
          payload: {
            code: name || user.email?.split('@')[0],
            payoutMethod: withdrawalMethod,
            payoutDetails: { bank_iban: bankIban, twint_phone: twintPhone, website, canton, social_link: socialLink },
          },
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) {
        alert('Failed to register: ' + (data.error || 'Server error'))
      } else {
        setAffiliateRecord(data.affiliate)
        alert('Your UFO LABZ affiliate application has been submitted successfully! It is now pending admin approval.')
      }
    } catch (err: any) {
      alert('Network error submitting application: ' + err.message)
    }
  }

  // Auto-fill registration fields using active user info
  const handlePrefillRegister = () => {
    if (user) {
      setName(profile?.full_name || user.email?.split('@')[0] || '')
      setEmail(user.email || '')
      setPhone('+41 79 987 65 43')
      setWebsite('https://ufolabz.com')
      setSocialLink('instagram.com/' + (profile?.full_name || 'user').toLowerCase())
    }
  }

  // Request custom coupon
  const handleRequestCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = newCouponCode.trim().toUpperCase()
    if (!code || !affiliateRecord) return

    try {
      const res = await fetch('/api/affiliate/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_coupon',
          payload: {
            couponCode: code,
            affiliateId: affiliateRecord.id,
          },
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to request coupon')
        return
      }

      const mappedNewCoup = {
        id: data.coupon.id,
        code: data.coupon.code,
        affiliateId: data.coupon.affiliate_id,
        discountPct: Number(data.coupon.value || 10),
        commissionPct: Number(affiliateRecord.commission_rate || 15),
        status: data.coupon.is_active ? 'APPROVED' : 'PENDING',
        salesCount: 0,
        totalCommission: 0.00,
      }
      setCouponsList([mappedNewCoup, ...couponsList])
      setNewCouponCode('')
      alert(`Promo code "${code}" requested successfully! It is now pending admin approval.`)
    } catch (err: any) {
      alert('Error requesting coupon: ' + err.message)
    }
  }

  // Trigger real payouts
  const handleRequestPayout = async () => {
    if (!affiliateRecord || walletBalance <= 0) {
      alert('You do not have any available balance to withdraw.')
      return
    }
    const amount = walletBalance

    try {
      const res = await fetch('/api/affiliate/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_payout',
          payload: {
            affiliateId: affiliateRecord.id,
            amount,
            method: withdrawalMethod,
          },
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to request payout')
        return
      }

      setWalletBalance(0)
      setPayoutsList([{
        id: data.payout?.id,
        date: new Date().toISOString().split('T')[0],
        amount,
        method: withdrawalMethod.toUpperCase(),
        status: 'PENDING',
      }, ...payoutsList])
      alert('Withdrawal request registered! Payout is pending admin approval.')
    } catch (err: any) {
      alert('Error requesting payout: ' + err.message)
    }
  }

  if (isLoading || (user && isCheckingRecord)) {
    return (
      <div className="min-h-screen bg-space-950 text-white flex flex-col items-center justify-center font-mono text-xs gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-alien-green/20 border-t-alien-green animate-spin" />
        <span className="text-gray-400 tracking-wider text-[11px]">SYNCING ORBITAL PARTNER DATA...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-space-950 text-white flex items-center justify-center px-4 font-mono text-xs">
        <div className="bg-space-900 border border-alien-green/20 p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-glow-green relative overflow-hidden">
          <div className="absolute inset-0 bg-alien-green/5 blur-[50px] pointer-events-none" />
          <div className="w-16 h-16 rounded-full bg-alien-green/10 border border-alien-green/20 flex items-center justify-center mx-auto text-alien-green text-2xl relative z-10 animate-pulse">
            🔒
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-2xl tracking-wider text-white uppercase">PARTNER ZONE ACCESS</h2>
            <p className="text-gray-400 mt-2 text-[10px] leading-relaxed">
              Sign in with Google or your email to access your Orbital Affiliate Dashboard, commission logs, custom referral links, and TWINT payouts.
            </p>
          </div>
          <div className="relative z-10 pt-2 space-y-3">
            <button
              onClick={async () => {
                setGoogleLoading(true)
                const supabase = createClient()
                const callbackUrl = `${window.location.origin}/auth/callback?next=/affiliate`
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: callbackUrl,
                    queryParams: {
                      access_type: 'offline',
                      prompt: 'select_account',
                    },
                  },
                })
                if (error) {
                  alert(error.message)
                  setGoogleLoading(false)
                }
              }}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white text-space-950 font-bold text-xs hover:bg-gray-100 transition-all shadow-md disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleLoading ? 'Connecting to Google…' : 'Continue with Google'}</span>
            </button>

            <Link href="/login?redirect=/affiliate" className="btn-primary w-full justify-center py-3 shadow-glow-green block">
              Sign In with Email / Password
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Sidebar Dashboard Menu items
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'links', label: 'Referral Links', icon: QrCode },
    { id: 'coupons', label: 'Promo Coupons', icon: Percent },
    { id: 'commissions', label: 'Commissions', icon: DollarSign },
    { id: 'wallet', label: 'Wallet & Payouts', icon: Shield },
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
      {!affiliateRecord ? (
        
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
      ) : affiliateRecord.status !== 'approved' ? (
        
        // ─── STATE 1.5: APPLICATION PENDING REVIEW ───
        <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-8 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-3xl mx-auto animate-pulse">
            ⏳
          </div>
          
          <div className="space-y-3">
            <span className="text-xs text-yellow-400 font-mono uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full">
              Status: Pending Approval
            </span>
            <h2 className="font-display text-4xl tracking-wider text-white uppercase mt-2">
              APPLICATION UNDER REVIEW
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
              Welcome aboard, recruit! Your affiliate partner profile has been registered and is currently queueing for verification by the UFO command deck. We will notify you once your custom referral code and Tier permissions are activated.
            </p>
          </div>

          <div className="bg-space-900 border border-white/5 p-6 rounded-2xl text-left space-y-4 max-w-md mx-auto text-xs">
            <h4 className="font-mono text-white text-[10px] uppercase border-b border-white/5 pb-2 text-gray-400">Submitted Cargo Details</h4>
            <div className="space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-500 font-sans">Canton Location:</span>
                <span className="text-white font-bold">{affiliateRecord.payout_details?.canton || 'Zurich'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-sans">Withdrawal Method:</span>
                <span className="text-white font-bold uppercase">{affiliateRecord.payout_method || 'TWINT'}</span>
              </div>
              {affiliateRecord.payout_details?.social_link && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-sans">Social Media:</span>
                  <span className="text-white font-bold">{affiliateRecord.payout_details.social_link}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex gap-4 justify-center">
            <Link href="/" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors">
              Back to Store
            </Link>
          </div>
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
                  <div className="font-bold text-white max-w-[140px] truncate">{profile?.full_name || user?.email?.split('@')[0] || 'Partner'}</div>
                  <span className="text-[10px] text-alien-green font-mono uppercase font-bold">{affiliateRecord?.commission_tier ? `${affiliateRecord.commission_tier.toUpperCase()} PARTNER` : 'STANDARD PARTNER'}</span>
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

              <Link 
                href="/account"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono font-medium text-red-400 hover:text-red-500 hover:bg-red-500/5 whitespace-nowrap lg:w-full lg:mt-6 text-left"
              >
                <ArrowLeft className="w-4 h-4 flex-shrink-0" />
                <span>Go to My Account</span>
              </Link>
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
                                 <p className="text-xs text-gray-400">Welcome, {profile?.full_name || user?.email?.split('@')[0] || 'Partner'}. Your referral parameters are active.</p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Lifetime Earnings</span>
                        <div className="text-xl font-mono font-bold text-white mt-1">
                          {formatPrice(commissionsList.reduce((acc, c) => acc + c.comm, 0))}
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
                        <div className="text-xl font-mono font-bold text-white mt-1">{affiliateRecord?.total_clicks || 0} Clicks</div>
                        <span className="text-[9px] text-gray-500">Click tracking index</span>
                      </div>

                      <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Conversion Rate</span>
                        <div className="text-xl font-mono font-bold text-white mt-1">
                          {affiliateRecord?.total_clicks && affiliateRecord.total_clicks > 0
                            ? ((affiliateRecord.total_orders / affiliateRecord.total_clicks) * 100).toFixed(1)
                            : '0.0'}%
                        </div>
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
                            {dbProducts.length > 0 ? (
                              dbProducts.map((p) => (
                                <option key={p.id} value={p.slug}>
                                  {typeof p.name === 'object' ? (p.name.en || p.name.de || p.slug) : p.name}
                                </option>
                              ))
                            ) : (
                              <>
                                <option value="astro-creatine">Astro Creatine (500g)</option>
                                <option value="blast-pre-workout-energy">Blast Pre-Workout Energy</option>
                                <option value="amino-fuel-mango">Amino Fuel Mango (300g)</option>
                                <option value="astro-collagen">Astro Collagen Peptide</option>
                              </>
                            )}
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
                        When approved by Admin, customers using this code get **10% OFF** and you earn **15% COMMISSION** on their order.
                      </p>
                    </form>

                    {/* Coupons list */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">My Coupons</h4>
                      {couponsList.map((coup) => (
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
                        <div className="text-3xl font-mono font-bold text-alien-green mt-1">{formatPrice(walletBalance)}</div>
                        <span className="text-[9px] text-gray-500">Eligible for payouts</span>
                      </div>

                      <div className="bg-space-950 border border-white/5 p-4 rounded-2xl text-center">
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Pending Balance</span>
                        <div className="text-3xl font-mono font-bold text-yellow-500 mt-1">{formatPrice(Number(affiliateRecord?.pending_commission || 0))}</div>
                        <span className="text-[9px] text-gray-500">Awaiting validation</span>
                      </div>

                      <div className="bg-space-950 border border-white/5 p-4 rounded-2xl text-center">
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Lifetime Paid</span>
                        <div className="text-3xl font-mono font-bold text-white mt-1">{formatPrice(Number(affiliateRecord?.paid_commission || 0))}</div>
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

              </div>
            </main>

          </div>
        </div>
      )}

    </div>
  )
}
