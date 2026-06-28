'use client'
// app/(store)/account/page.tsx
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { useCart } from '@/hooks/useCart'
import { 
  User, Shield, ShoppingBag, Heart, RefreshCw, Award, 
  MapPin, Target, Calendar, BarChart2, Ticket, Download, 
  MessageCircle, Bell, Lock, LogOut, Check, Plus, Minus, 
  Send, Trash2, Edit2, Play, Info, Sparkles, CheckCircle2, ChevronRight
} from 'lucide-react'
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

// Mock digital downloads
const DOWNLOADS = [
  { title: '🛸 Space-Gain Nutrition E-Book', size: '4.2 MB', desc: 'Galactic diet guidelines for muscle synthesis' },
  { title: '🏋️ Alien Workout Plan (Intermediate)', size: '2.8 MB', desc: '8-week strength training schedule' },
  { title: '🍏 Macro-Nutrient Supplement Guide', size: '1.5 MB', desc: 'Dosage guidelines for peak performance' }
]

// Mock profile stats
const INITIAL_ADDRESSES = [
  { id: 'addr-1', label: 'Home', name: 'Shikha Swiss', line1: 'Bahnhofstrasse 100', city: 'Zürich', zip: '8001', canton: 'Zurich', country: 'Switzerland', isDefault: true },
  { id: 'addr-2', label: 'Office', name: 'Shikha Office', line1: 'Gerechtigkeitsgasse 15', city: 'Bern', zip: '3011', canton: 'Bern', country: 'Switzerland', isDefault: false }
]

// Default recommendation products by goal
const GOAL_PRODUCTS: Record<string, Array<{ name: string; desc: string; slug: string; price: number }>> = {
  'Muscle Gain': [
    { name: 'Astro Creatine', desc: 'Pure micronized monohydrate for maximum muscle gains.', slug: 'astro-creatine', price: 39.00 },
    { name: 'Amino Fuel Mango', desc: 'Complete BCAA recovery formula with electrolytes.', slug: 'amino-fuel-mango', price: 45.00 }
  ],
  'Weight Loss': [
    { name: 'Blast Pre-Workout', desc: 'Thermogentic energy driver with natural focus enhancers.', slug: 'blast-pre-workout', price: 49.00 },
    { name: 'Amino Fuel Blue', desc: 'Intra-workout hydration to support muscle preservation.', slug: 'amino-fuel-blue-raspberry', price: 45.00 }
  ],
  'Endurance': [
    { name: 'Amino Fuel Mango', desc: 'Complete BCAA recovery matrix with fast-hydration complex.', slug: 'amino-fuel-mango', price: 45.00 },
    { name: 'Special Edition', desc: 'Cognitive and physical performance booster containing ATP.', slug: 'special-edition', price: 69.00 }
  ],
  'Strength': [
    { name: 'Astro Creatine', desc: 'Micronized monohydrate for raw strength and power.', slug: 'astro-creatine', price: 39.00 },
    { name: 'Special Edition', desc: 'Premium strength and cognitive performance blend.', slug: 'special-edition', price: 69.00 }
  ]
}

export default function AccountPage() {
  const router = useRouter()
  const color = '#00FF88'

  const { user, profile, logout } = useAuthStore()
  const { addItem } = useCart()

  // Guest/Demo Mode check
  const [isDemoMode, setIsDemoMode] = useState(false)
  const displayProfile = isDemoMode || user ? {
    full_name: user?.full_name || 'Commander Shikha Swiss',
    email: user?.email || 'shikha@ufolabz.ch',
    membership: 'VIP Galaxy Elite',
    points: 1240,
    credit: 45.00,
    avatar: ''
  } : null

  // Ensure default demo profile active if user not logged in
  useEffect(() => {
    if (!user) {
      setIsDemoMode(true)
    }
  }, [user])

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard')

  // Section States
  const [goal, setGoal] = useState<string>('Muscle Gain')
  const [weightLogs, setWeightLogs] = useState<Array<{ date: string; val: number }>>([
    { date: '2026-06-20', val: 78.5 },
    { date: '2026-06-22', val: 78.2 },
    { date: '2026-06-25', val: 77.9 }
  ])
  const [weightInput, setWeightInput] = useState('')
  const [streakCount, setStreakCount] = useState(5)
  const [waterGlasses, setWaterGlasses] = useState(4)

  // Supplement Checklist
  const [scheduleLogs, setScheduleLogs] = useState<Record<string, boolean>>({
    'creatine-morning': true,
    'amino-afternoon': false,
    'pre-workout-evening': false
  })

  // Address book states
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: 'Home', name: '', line1: '', city: '', zip: '', canton: 'Zurich' })

  // Active Subscriptions
  const [subStatus, setSubStatus] = useState<'active' | 'paused' | 'skipped'>('active')
  const [subFlavor, setSubFlavor] = useState('Mango')
  const [subFreq, setSubFreq] = useState('30 Days')

  // AI Chatbot states
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: '🪐 Greetings, Commander! I am your AI Health Assistant. Ask me anything about stacks, dosages, or how to reach your fitness goals.' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isAiTyping, setIsAiTyping] = useState(false)

  // Handle Logout
  const handleLogoutClick = async () => {
    await logout()
    router.push('/login')
  }

  // Handle Add Address
  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddress.name || !newAddress.line1 || !newAddress.city || !newAddress.zip) return
    const created = {
      id: `addr-${Date.now()}`,
      ...newAddress,
      country: 'Switzerland',
      isDefault: false
    }
    setAddresses([...addresses, created])
    setShowAddressForm(false)
    setNewAddress({ label: 'Home', name: '', line1: '', city: '', zip: '', canton: 'Zurich' })
  }

  // Set Default Address
  const handleSetDefaultAddress = (id: string) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })))
  }

  // Delete Address
  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id))
  }

  // Add weight log
  const handleAddWeightLog = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(weightInput)
    if (isNaN(val) || val <= 0) return
    const today = new Date().toISOString().split('T')[0]
    setWeightLogs([...weightLogs, { date: today, val }])
    setWeightInput('')
  }

  // AI bot answers
  const handleAiSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    const userText = chatInput
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }])
    setChatInput('')
    setIsAiTyping(true)

    const storedKey = localStorage.getItem('ufo_openai_api_key')
    let reply = ''

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
                content: `You are an advanced UFO LABZ AI Lab Assistant, a premium sports nutrition specialist for a Swiss brand. Respond professionally and scientifically. Recommend products like Astro Creatine or Blast Pre-Workout. The user is Shikha Swiss with goals: "${goal}".` 
              },
              { role: 'user', content: userText }
            ],
            temperature: 0.7
          })
        })
        const data = await response.json()
        if (data.choices && data.choices[0]) {
          reply = data.choices[0].message.content
        } else {
          reply = '🛰️ Connection error. Please check your OpenAI API key settings in the Admin Cockpit.'
        }
      } catch (err) {
        reply = '🛰️ Connection error. Could not query OpenAI servers.'
      }
    } else {
      // Simulate offline AI response delay
      await new Promise((resolve) => setTimeout(resolve, 1200))
      const lowerText = userText.toLowerCase()
      if (lowerText.includes('creatine') || lowerText.includes('kreatin')) {
        reply = '🛸 Astro Creatine monohydrate is best taken at 5g daily. Consistency is key! You can mix it with water, protein shakes, or juice. On workout days, consume it post-workout for optimal ATP synthesis.'
      } else if (lowerText.includes('pre-workout') || lowerText.includes('pre workout') || lowerText.includes('energy')) {
        reply = '⚡ Blast Pre-Workout should be consumed 15–30 minutes before your workout. Start with half a scoop to assess tolerance due to the high Beta-Alanine dosage (which causes a safe, tingling sensation!).'
      } else if (lowerText.includes('goal') || lowerText.includes('muscle') || lowerText.includes('weight')) {
        reply = `🪐 Based on your ${goal} targets, I recommend combining Astro Creatine with Amino Fuel. This stack supports rapid cellular recovery and maximizes clean muscle growth.`
      } else if (lowerText.includes('points') || lowerText.includes('rewards')) {
        reply = '🎁 You currently hold 1,240 Alien Points! You can redeem them in the "Rewards" tab for discount codes (500 pts = CHF 5.00 off; 1,000 pts = CHF 10.00 off).'
      } else {
        reply = '🛰️ My database suggests prioritizing macro-nutritional consistency. UFO LABZ supplements are engineered to work synergistically. Let me know if you would like dosage advice on any specific product!'
      }
    }

    setIsAiTyping(false)
    setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }])
  }

  // Sidebar Tabs Config
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCw },
    { id: 'rewards', label: 'Rewards', icon: Award },
    { id: 'referrals', label: 'Refer & Earn', icon: Sparkles },
    { id: 'wallet', label: 'Wallet', icon: Shield },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'goals', label: 'My Goals', icon: Target },
    { id: 'schedule', label: 'Supplement Intake', icon: Calendar },
    { id: 'progress', label: 'Progress Tracker', icon: BarChart2 },
    { id: 'coupons', label: 'Coupons', icon: Ticket },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'support', label: 'Support & Help', icon: MessageCircle },
    { id: 'security', label: 'Security', icon: Lock }
  ]

  return (
    <div className="pt-20 min-h-screen bg-space-950 text-white selection:bg-alien-green selection:text-space-950 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Banner notifying user about Demo Mode */}
        {isDemoMode && (
          <div className="bg-alien-green/10 border border-alien-green/20 text-alien-green p-4 rounded-2xl mb-8 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 animate-pulse flex-shrink-0" />
              <span>
                <strong>DEMO PANEL ACTIVE:</strong> You are currently viewing the panel in demo mode. Sign in to sync real user parameters.
              </span>
            </div>
            <Link href="/login" className="bg-alien-green text-space-950 px-4 py-1.5 rounded-xl font-bold font-sans hover:shadow-glow-green transition-all">
              Sign In
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ─── LEFT: SIDEBAR NAVIGATION (width: 3 cols) ─── */}
          <aside className="lg:col-span-3 bg-space-900 border border-white/5 rounded-3xl p-4 space-y-2 overflow-x-auto lg:overflow-x-visible no-scrollbar flex lg:flex-col gap-1 lg:gap-0 select-none">
            <div className="hidden lg:flex items-center gap-3 pb-4 mb-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-full bg-alien-green/10 border border-alien-green/20 flex items-center justify-center text-xl font-bold">
                👽
              </div>
              <div className="text-left">
                <div className="font-bold text-sm text-white max-w-[140px] truncate">{displayProfile?.full_name}</div>
                <span className="text-[10px] text-alien-green font-mono uppercase font-bold">{displayProfile?.membership}</span>
              </div>
            </div>

            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap lg:w-full",
                    activeTab === tab.id 
                      ? "bg-alien-green text-space-950 font-bold shadow-glow-green" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              )}
            )}

            <button 
              onClick={handleLogoutClick}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono font-medium text-red-400 hover:text-red-500 hover:bg-red-500/5 whitespace-nowrap lg:w-full lg:mt-6"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </aside>

          {/* ─── RIGHT: DETAILED TAB CONTENT (width: 9 cols) ─── */}
          <main className="lg:col-span-9 bg-space-900 border border-white/5 rounded-3xl p-6 md:p-8 min-h-[600px] relative overflow-hidden">
            
            {/* Background ambient portal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[300px] h-[300px] rounded-full bg-alien-green/5 blur-[80px]" />
            </div>

            <div className="relative z-10 w-full">
              
              {/* 🏠 DASHBOARD PANEL */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div>
                    <h2 className="font-display text-4xl tracking-wider text-white">COMMAND CENTER</h2>
                    <p className="text-sm text-gray-400">Welcome back, {displayProfile?.full_name}. Systems operational.</p>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                      <span className="text-[10px] font-mono text-gray-400 uppercase">Loyalty Points</span>
                      <div className="text-2xl font-mono font-bold text-alien-green mt-1">{displayProfile?.points}</div>
                      <span className="text-[9px] text-gray-500">Redeemable for coupons</span>
                    </div>

                    <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                      <span className="text-[10px] font-mono text-gray-400 uppercase">Wallet Balance</span>
                      <div className="text-2xl font-mono font-bold text-white mt-1">{formatPrice(displayProfile?.credit || 0)}</div>
                      <span className="text-[9px] text-gray-500">Available store credit</span>
                    </div>

                    <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                      <span className="text-[10px] font-mono text-gray-400 uppercase">Subscriptions</span>
                      <div className="text-2xl font-mono font-bold text-white mt-1">1 Active</div>
                      <span className="text-[9px] text-gray-500">Astro Creatine monohydrate</span>
                    </div>

                    <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                      <span className="text-[10px] font-mono text-gray-400 uppercase">Member Level</span>
                      <div className="text-base font-bold text-alien-green mt-2 font-mono uppercase">{displayProfile?.membership.replace('VIP ', '')}</div>
                      <span className="text-[9px] text-gray-500">2x points multiplier</span>
                    </div>
                  </div>

                  {/* Profile and Quick Links */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">Core Parameters</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-gray-400"><span>Email:</span><span className="text-white font-bold">{displayProfile?.email}</span></div>
                        <div className="flex justify-between text-gray-400"><span>Fitness Target:</span><span className="text-alien-green font-bold font-mono uppercase">{goal}</span></div>
                        <div className="flex justify-between text-gray-400"><span>Supplement Streak:</span><span className="text-white font-bold">{streakCount} Days</span></div>
                      </div>
                    </div>

                    <div className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setActiveTab('schedule')} className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-2 px-3 rounded-lg text-left transition-colors border border-white/5">📋 Log Supplement</button>
                        <button onClick={() => setActiveTab('rewards')} className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-2 px-3 rounded-lg text-left transition-colors border border-white/5">🎁 Redeem Rewards</button>
                        <button onClick={() => setActiveTab('subscriptions')} className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-2 px-3 rounded-lg text-left transition-colors border border-white/5">🔁 Manage Sub</button>
                        <button onClick={() => setActiveTab('goals')} className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-2 px-3 rounded-lg text-left transition-colors border border-white/5">🎯 Modify Fitness Goal</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 📦 ORDERS PANEL */}
              {activeTab === 'orders' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <h2 className="font-display text-3xl tracking-wide uppercase text-white">ORDER LEDGER</h2>
                  
                  <div className="space-y-4">
                    {/* Live Order 1 */}
                    <div className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-3 gap-2 text-xs">
                        <div>
                          <div className="font-bold text-white font-mono">Order #UFO-CH-82741</div>
                          <span className="text-gray-400 text-[10px]">Placed on: June 26, 2026</span>
                        </div>
                        <span className="font-mono bg-blue-500/10 border border-blue-500/20 text-blue-500 px-3 py-1 rounded-full font-bold">
                          SHIPPED (PostPac Priority)
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="w-12 h-12 bg-space-900 border border-white/5 rounded-xl relative flex-shrink-0">
                          <Image src="/Product1.jpeg" alt="Astro Creatine" fill className="object-contain p-1.5" />
                        </div>
                        <div>
                          <div className="font-bold text-white">Astro Creatine (500g)</div>
                          <div className="text-gray-400">Qty: 1 · Price: CHF 39.00</div>
                        </div>
                      </div>

                      {/* Order tracking timeline */}
                      <div className="pt-2">
                        <div className="text-[10px] font-mono text-gray-400 mb-2 uppercase">TRACK SHIPMENT</div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 max-w-md">
                          <span className="text-alien-green font-bold">Confirmed</span>
                          <ChevronRight className="w-3 h-3" />
                          <span className="text-alien-green font-bold">Processed</span>
                          <ChevronRight className="w-3 h-3" />
                          <span className="text-alien-green font-bold">Shipped</span>
                          <ChevronRight className="w-3 h-3" />
                          <span>Out for Delivery</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden max-w-md">
                          <div className="bg-alien-green h-full w-[75%]" />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 text-xs">
                        <button className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-1.5 px-3 rounded-lg border border-white/5">Download Invoice (PDF)</button>
                        <button className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-1.5 px-3 rounded-lg border border-white/5">Track Shipment</button>
                      </div>
                    </div>

                    {/* Past Order 2 */}
                    <div className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-3 gap-2 text-xs">
                        <div>
                          <div className="font-bold text-white font-mono">Order #UFO-CH-71829</div>
                          <span className="text-gray-400 text-[10px]">Placed on: May 12, 2026</span>
                        </div>
                        <span className="font-mono bg-alien-green/10 border border-alien-green/20 text-alien-green px-3 py-1 rounded-full font-bold">
                          DELIVERED
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="w-12 h-12 bg-space-900 border border-white/5 rounded-xl relative flex-shrink-0">
                          <Image src="/Product2.jpeg" alt="Blast Pre-Workout" fill className="object-contain p-1.5" />
                        </div>
                        <div>
                          <div className="font-bold text-white">Blast Pre-Workout (300g)</div>
                          <div className="text-gray-400">Qty: 1 · Price: CHF 49.00</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 text-xs">
                        <button onClick={() => addItem('BLAST-300G')} className="bg-alien-green text-space-950 font-bold font-mono text-[10px] py-1.5 px-4 rounded-lg">Buy Again</button>
                        <button className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-1.5 px-3 rounded-lg border border-white/5">Download Receipt</button>
                        <button className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-1.5 px-3 rounded-lg border border-white/5">Write Review</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 🔁 SUBSCRIPTION MANAGER */}
              {activeTab === 'subscriptions' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <h2 className="font-display text-3xl tracking-wide uppercase text-white">RECURRING PLANS</h2>
                  
                  <div className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-2 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-space-900 border border-white/5 rounded-xl relative flex-shrink-0">
                          <Image src="/Product1.jpeg" alt="Astro Creatine" fill className="object-contain p-1.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">Astro Creatine (500g)</h4>
                          <p className="text-gray-400 text-xs">Next billing: July 15, 2026</p>
                        </div>
                      </div>
                      <div>
                        {subStatus === 'active' && (
                          <span className="font-mono bg-alien-green/10 border border-alien-green/20 text-alien-green px-3 py-1 rounded-full font-bold">
                            ACTIVE
                          </span>
                        )}
                        {subStatus === 'paused' && (
                          <span className="font-mono bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full font-bold">
                            PAUSED
                          </span>
                        )}
                        {subStatus === 'skipped' && (
                          <span className="font-mono bg-blue-500/10 border border-blue-500/20 text-blue-500 px-3 py-1 rounded-full font-bold">
                            NEXT SHIPMENT SKIPPED
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Frequency</span>
                        <div className="font-bold mt-1 text-white">Every {subFreq}</div>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Pricing</span>
                        <div className="font-bold mt-1 text-alien-green">CHF 33.15 <span className="text-gray-500 line-through text-[10px]">CHF 39.00</span></div>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Payment</span>
                        <div className="font-bold mt-1 text-white">TWINT (Direct Charge)</div>
                      </div>
                    </div>

                    {/* Subscription Actions */}
                    <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2">
                      {subStatus === 'active' ? (
                        <>
                          <button onClick={() => setSubStatus('paused')} className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 font-mono text-[10px] py-2 px-4 rounded-xl border border-yellow-500/20">Pause subscription</button>
                          <button onClick={() => setSubStatus('skipped')} className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-mono text-[10px] py-2 px-4 rounded-xl border border-blue-500/20">Skip next shipment</button>
                        </>
                      ) : (
                        <button onClick={() => setSubStatus('active')} className="bg-alien-green text-space-950 font-bold font-mono text-[10px] py-2 px-4 rounded-xl">Resume subscription</button>
                      )}

                      <select 
                        value={subFreq} 
                        onChange={(e) => setSubFreq(e.target.value)}
                        className="bg-space-900 border border-white/10 rounded-xl text-[10px] p-2 text-white focus:outline-none font-mono"
                      >
                        <option value="30 Days">Every 30 Days</option>
                        <option value="60 Days">Every 60 Days</option>
                        <option value="90 Days">Every 90 Days</option>
                      </select>

                      <button onClick={() => alert('Flavor changed!')} className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-2 px-4 rounded-xl border border-white/5">Change flavor/variant</button>
                    </div>
                  </div>
                </div>
              )}

              {/* 🎁 REWARDS & LOYALTY */}
              {activeTab === 'rewards' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <h2 className="font-display text-3xl tracking-wide uppercase text-white">ALIEN POINTS</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-space-950 border border-white/5 p-4 rounded-2xl text-center">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Available Points</div>
                      <div className="text-4xl font-mono font-bold text-alien-green mt-2">{displayProfile?.points}</div>
                      <span className="text-[9px] text-gray-500">Accumulated balance</span>
                    </div>

                    <div className="bg-space-950 border border-white/5 p-4 rounded-2xl text-center">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Lifetime Points</div>
                      <div className="text-4xl font-mono font-bold text-white mt-2">2,500</div>
                      <span className="text-[9px] text-gray-500">Total earned points</span>
                    </div>

                    <div className="bg-space-950 border border-white/5 p-4 rounded-2xl text-center">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">VIP Tier Status</div>
                      <div className="text-base font-bold text-alien-green mt-4 font-mono uppercase">{displayProfile?.membership}</div>
                    </div>
                  </div>

                  {/* Redeem awards */}
                  <div className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-4">
                    <h3 className="text-sm font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">Redeem vouchers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-space-900 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white">CHF 5.00 Off Voucher</div>
                          <span className="text-gray-400">Cost: 500 Alien Points</span>
                        </div>
                        <button className="bg-alien-green text-space-950 font-bold font-mono text-[10px] py-1.5 px-3 rounded-lg">Redeem</button>
                      </div>

                      <div className="bg-space-900 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white">CHF 10.00 Off Voucher</div>
                          <span className="text-gray-400">Cost: 1,000 Alien Points</span>
                        </div>
                        <button className="bg-alien-green text-space-950 font-bold font-mono text-[10px] py-1.5 px-3 rounded-lg">Redeem</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 👥 REFER & EARN */}
              {activeTab === 'referrals' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <h2 className="font-display text-3xl tracking-wide uppercase text-white">REFERRAL MATRIX</h2>
                  
                  <div className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div className="space-y-4">
                        <h4 className="font-bold text-white text-base">Invite your friends to UFO LABZ</h4>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          Share your personalized code. Friends get **10% off** on their first order, and you earn **CHF 10.00** store credit for every successful crew recruitment.
                        </p>

                        <div>
                          <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Your Referral Link</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              readOnly 
                              value={`https://ufolabz.ch/ref/shikha123`}
                              className="input text-xs font-mono py-2 bg-space-900 border-white/5"
                            />
                            <button 
                              onClick={() => navigator.clipboard.writeText('https://ufolabz.ch/ref/shikha123')}
                              className="bg-white hover:bg-gray-100 text-space-950 font-bold px-4 rounded-xl text-xs"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* QR mock */}
                      <div className="bg-white p-4 rounded-2xl w-40 h-40 mx-auto flex items-center justify-center shadow-lg relative border-4 border-space-900">
                        <div className="w-full h-full border border-gray-100 relative">
                          <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_2px,transparent_2px)] bg-[size:8px_8px]" />
                          <div className="absolute top-1 left-1 w-6 h-6 border-2 border-blue-900 bg-white" />
                          <div className="absolute top-1 right-1 w-6 h-6 border-2 border-blue-900 bg-white" />
                          <div className="absolute bottom-1 left-1 w-6 h-6 border-2 border-blue-900 bg-white" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 text-center text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Recruits</span>
                        <div className="font-bold text-lg text-white mt-1">3 Athletes</div>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Earned Credit</span>
                        <div className="font-bold text-lg text-alien-green mt-1">CHF 30.00</div>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Clicks</span>
                        <div className="font-bold text-lg text-white mt-1">42 clicks</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 🎯 FITNESS GOALS */}
              {activeTab === 'goals' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <h2 className="font-display text-3xl tracking-wide uppercase text-white">FITNESS TARGETS</h2>
                  
                  <div className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-6">
                    <div>
                      <h4 className="font-bold text-white text-base mb-1">Select your primary fitness goal</h4>
                      <p className="text-xs text-gray-400">Our system will customize product recommendations and supplement schedules according to your target.</p>
                    </div>

                    {/* Goal selectors */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Muscle Gain', 'Weight Loss', 'Endurance', 'Strength', 'Wellness'].map((g) => (
                        <button
                          key={g}
                          onClick={() => setGoal(g)}
                          className={cn(
                            "py-3 px-4 rounded-xl text-xs font-mono font-bold border-2 transition-all text-center",
                            goal === g 
                              ? "text-space-950 border-alien-green" 
                              : "border-white/5 text-gray-400 hover:border-white/10 hover:text-white"
                          )}
                          style={goal === g ? { backgroundColor: color, borderColor: color } : {}}
                        >
                          {g}
                        </button>
                      ))}
                    </div>

                    {/* Recommended products based on goal */}
                    <div className="pt-6 border-t border-white/5 space-y-4">
                      <h4 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">RECOMMENDED TARGET STACK</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {GOAL_PRODUCTS[goal]?.map((p) => (
                          <div key={p.slug} className="bg-space-900 border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
                            <div>
                              <div className="font-bold text-sm text-white">{p.name}</div>
                              <p className="text-[11px] text-gray-400 mt-1 leading-normal">{p.desc}</p>
                            </div>
                            <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/5 text-xs">
                              <span className="font-mono font-bold text-alien-green">{formatPrice(p.price)}</span>
                              <button onClick={() => alert(`${p.name} added!`)} className="bg-white hover:bg-gray-100 text-space-950 font-bold px-3 py-1.5 rounded-lg font-sans">Quick Add</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* 📅 SUPPLEMENT SCHEDULE */}
              {activeTab === 'schedule' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-3xl tracking-wide uppercase text-white">Supplement Schedule</h2>
                    <span className="text-xs font-mono bg-alien-green/10 border border-alien-green/20 text-alien-green px-3 py-1 rounded-full font-bold">
                      🔥 Streak: {streakCount} Days
                    </span>
                  </div>

                  <div className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-6">
                    <div>
                      <h4 className="font-bold text-white text-base mb-1">Today's Intake Schedule</h4>
                      <p className="text-xs text-gray-400">Log your daily supplement intake to maintain your streak and maximize performance.</p>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* morning */}
                      <div className="bg-space-900 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            id="creatine-morning"
                            checked={scheduleLogs['creatine-morning']}
                            onChange={(e) => setScheduleLogs({ ...scheduleLogs, 'creatine-morning': e.target.checked })}
                            className="w-4 h-4 rounded accent-alien-green cursor-pointer"
                          />
                          <div>
                            <label htmlFor="creatine-morning" className="font-bold text-white cursor-pointer">🌅 Morning: Astro Creatine (5g)</label>
                            <p className="text-[10px] text-gray-400 mt-0.5">Recommended with water post-breakfast</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">08:00 AM</span>
                      </div>

                      {/* afternoon */}
                      <div className="bg-space-900 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            id="amino-afternoon"
                            checked={scheduleLogs['amino-afternoon']}
                            onChange={(e) => setScheduleLogs({ ...scheduleLogs, 'amino-afternoon': e.target.checked })}
                            className="w-4 h-4 rounded accent-alien-green cursor-pointer"
                          />
                          <div>
                            <label htmlFor="amino-afternoon" className="font-bold text-white cursor-pointer">☀️ Afternoon: Amino Fuel Mango (10g)</label>
                            <p className="text-[10px] text-gray-400 mt-0.5">Hydration support between lunch and training</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">02:00 PM</span>
                      </div>

                      {/* evening */}
                      <div className="bg-space-900 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            id="pre-workout-evening"
                            checked={scheduleLogs['pre-workout-evening']}
                            onChange={(e) => setScheduleLogs({ ...scheduleLogs, 'pre-workout-evening': e.target.checked })}
                            className="w-4 h-4 rounded accent-alien-green cursor-pointer"
                          />
                          <div>
                            <label htmlFor="pre-workout-evening" className="font-bold text-white cursor-pointer">🌙 Pre-Workout: Blast Pre-Workout (10g)</label>
                            <p className="text-[10px] text-gray-400 mt-0.5">Explosive focus catalyst 20 mins before training</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">06:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 📊 PROGRESS TRACKER */}
              {activeTab === 'progress' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <h2 className="font-display text-3xl tracking-wide uppercase text-white">PROGRESS TRACKER</h2>
                  
                  <div className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Weight log form */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-white text-sm uppercase font-mono tracking-wider">Weight logs</h4>
                        <form onSubmit={handleAddWeightLog} className="flex gap-2">
                          <input 
                            type="number" 
                            step="0.1"
                            value={weightInput}
                            onChange={(e) => setWeightInput(e.target.value)}
                            placeholder="Current weight (kg)"
                            className="input text-xs py-2"
                          />
                          <button 
                            type="submit" 
                            className="bg-alien-green text-space-950 font-bold px-4 rounded-xl text-xs"
                          >
                            Log
                          </button>
                        </form>

                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                          {weightLogs.map((log, idx) => (
                            <div key={idx} className="flex justify-between p-2 bg-space-900 rounded-lg text-xs font-mono">
                              <span className="text-gray-400">{log.date}</span>
                              <span className="font-bold text-white">{log.val} kg</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Water intake tracker */}
                      <div className="bg-space-900 border border-white/5 p-5 rounded-2xl text-center space-y-4">
                        <h4 className="font-bold text-white text-sm uppercase font-mono tracking-wider">Water Intake</h4>
                        <div className="text-4xl">💧</div>
                        <div className="text-2xl font-mono font-bold text-white">{waterGlasses} / 8 Glasses</div>
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => setWaterGlasses((w) => Math.max(0, w - 1))}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white hover:bg-white/10"
                          >
                            -
                          </button>
                          <button 
                            onClick={() => setWaterGlasses((w) => Math.min(20, w + 1))}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white hover:bg-white/10"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ❤️ WISHLIST PANEL */}
              {activeTab === 'wishlist' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <h2 className="font-display text-3xl tracking-wide uppercase text-white">SAVED CARGO</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-space-950 border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-space-900 border border-white/5 rounded-xl relative flex-shrink-0">
                          <Image src="/Product1.jpeg" alt="Astro Creatine" fill className="object-contain p-1.5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">Astro Creatine</div>
                          <span className="text-xs text-alien-green font-mono font-bold">CHF 39.00</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => alert('Moved to cart!')} className="bg-alien-green text-space-950 font-bold px-3 py-1.5 rounded-lg text-xs">Add</button>
                        <button className="text-gray-400 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 📍 ADDRESSES PANEL */}
              {activeTab === 'addresses' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="font-display text-3xl tracking-wide uppercase text-white">ADDRESS DIRECTORY</h2>
                    <button 
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="text-xs font-mono text-alien-green hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Address</span>
                    </button>
                  </div>

                  {showAddressForm && (
                    <form onSubmit={handleAddAddressSubmit} className="bg-space-950 border border-white/5 p-6 rounded-2xl space-y-4 animate-fade-in">
                      <h4 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase">New Address Details</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-[10px] font-mono text-gray-400 mb-1 block">Label</label>
                          <input 
                            type="text" 
                            required
                            value={newAddress.label}
                            onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                            placeholder="Home / Office"
                            className="input py-2"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-400 mb-1 block">Recipient Name</label>
                          <input 
                            type="text" 
                            required
                            value={newAddress.name}
                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                            placeholder="Recipient full name"
                            className="input py-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div className="col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 mb-1 block">Street address</label>
                          <input 
                            type="text" 
                            required
                            value={newAddress.line1}
                            onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                            placeholder="Line 1"
                            className="input py-2"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-400 mb-1 block">ZIP Code</label>
                          <input 
                            type="text" 
                            required
                            value={newAddress.zip}
                            onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                            placeholder="ZIP"
                            className="input py-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-[10px] font-mono text-gray-400 mb-1 block">City</label>
                          <input 
                            type="text" 
                            required
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            placeholder="City"
                            className="input py-2"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-400 mb-1 block">Canton</label>
                          <select 
                            value={newAddress.canton}
                            onChange={(e) => setNewAddress({ ...newAddress, canton: e.target.value })}
                            className="input py-2 focus:outline-none bg-space-950"
                          >
                            {CANTONS.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setShowAddressForm(false)} className="btn-outline px-4 py-2 text-xs">Cancel</button>
                        <button type="submit" className="bg-alien-green text-space-950 font-bold px-4 py-2 rounded-xl text-xs">Save</button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="bg-space-950 border border-white/5 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{addr.label}</span>
                            {addr.isDefault && <span className="text-[9px] bg-alien-green/10 text-alien-green border border-alien-green/20 px-2 py-0.5 rounded font-mono">DEFAULT</span>}
                          </div>
                          <div className="text-gray-300">{addr.name}</div>
                          <p className="text-gray-400">{addr.line1}, {addr.city} {addr.zip} ({addr.canton}), {addr.country}</p>
                        </div>

                        <div className="flex gap-2">
                          {!addr.isDefault && (
                            <button onClick={() => handleSetDefaultAddress(addr.id)} className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-1.5 px-3 rounded-lg border border-white/5">Set Default</button>
                          )}
                          <button onClick={() => handleDeleteAddress(addr.id)} className="text-gray-400 hover:text-white p-1.5"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 👤 PROFILE EDIT */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <h2 className="font-display text-3xl tracking-wide uppercase text-white">PROFILE DATA</h2>
                  
                  <form onSubmit={(e) => { e.preventDefault(); alert('Saved!'); }} className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Full Name</label>
                        <input type="text" defaultValue={displayProfile?.full_name} className="input" />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Email address</label>
                        <input type="email" defaultValue={displayProfile?.email} className="input" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Phone Number</label>
                        <input type="text" defaultValue="+41 79 123 45 67" className="input" />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Birthday</label>
                        <input type="date" defaultValue="1995-06-15" className="input" />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button type="submit" className="bg-alien-green text-space-950 font-bold font-mono px-6 py-2.5 rounded-xl">Save Parameters</button>
                    </div>
                  </form>
                </div>
              )}

              {/* 🎟 AVAILABLE COUPONS */}
              {activeTab === 'coupons' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <h2 className="font-display text-3xl tracking-wide uppercase text-white">RESERVED COUPONS</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-space-950 border border-white/5 p-5 rounded-2xl border-l-4 border-l-alien-green space-y-2">
                      <div className="flex justify-between font-mono font-bold text-white">
                        <span>10% OFF TOTAL</span>
                        <span className="text-alien-green">Active</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Save 10% on your next supplement cargo dispatch.</p>
                      <div className="flex items-center justify-between pt-3">
                        <span className="font-mono text-white bg-white/5 border border-white/10 px-3 py-1 rounded-lg">ALIEN10</span>
                        <button onClick={() => navigator.clipboard.writeText('ALIEN10')} className="text-xs text-alien-green hover:underline">Copy Code</button>
                      </div>
                    </div>

                    <div className="bg-space-950 border border-white/5 p-5 rounded-2xl border-l-4 border-l-alien-green space-y-2">
                      <div className="flex justify-between font-mono font-bold text-white">
                        <span>FREE POSTPAC SHIPPING</span>
                        <span className="text-alien-green">Active</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Free priority Standard Shipping on all orders.</p>
                      <div className="flex items-center justify-between pt-3">
                        <span className="font-mono text-white bg-white/5 border border-white/10 px-3 py-1 rounded-lg">FREESHIP</span>
                        <button onClick={() => navigator.clipboard.writeText('FREESHIP')} className="text-xs text-alien-green hover:underline">Copy Code</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 📥 DIGITAL DOWNLOADS */}
              {activeTab === 'downloads' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <h2 className="font-display text-3xl tracking-wide uppercase text-white">NUTRITIONAL DOWNLOADS</h2>
                  
                  <div className="space-y-3">
                    {DOWNLOADS.map((doc, idx) => (
                      <div key={idx} className="bg-space-950 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4 text-xs">
                        <div>
                          <div className="font-bold text-white">{doc.title}</div>
                          <p className="text-[10px] text-gray-400 mt-0.5">{doc.desc}</p>
                        </div>
                        <button onClick={() => alert('Download starting...')} className="bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-2 px-3 rounded-lg border border-white/5 flex items-center gap-1.5">
                          <Download className="w-3.5 h-3.5" />
                          <span>Download ({doc.size})</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 💬 SUPPORT HELP */}
              {activeTab === 'support' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <h2 className="font-display text-3xl tracking-wide uppercase text-white">SUPPORT CENTER</h2>
                  
                  <div className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-6 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <a href="https://wa.me/41790000000" target="_blank" rel="noreferrer" className="bg-space-900 border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:border-white/10 transition-colors text-white">
                        <MessageCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-sm">WhatsApp Dispatch</div>
                          <p className="text-gray-400 mt-0.5">Logistical updates or order changes</p>
                        </div>
                      </a>

                      <div onClick={() => setActiveTab('support')} className="bg-space-900 border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:border-white/10 transition-colors cursor-pointer">
                        <Sparkles className="w-8 h-8 text-alien-green flex-shrink-0" />
                        <div>
                          <div className="font-bold text-sm">AI Health Chatbot</div>
                          <p className="text-gray-400 mt-0.5">Instant supplement schedule guidance</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <h4 className="text-xs font-mono font-bold tracking-widest text-muted text-gray-400 uppercase mb-4">AI Supplement Assistant</h4>
                      
                      {/* Chat desk container */}
                      <div className="bg-space-900 border border-white/5 rounded-2xl overflow-hidden flex flex-col h-80">
                        {/* Messages window */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3 no-scrollbar text-xs">
                          {chatMessages.map((msg, idx) => (
                            <div 
                              key={idx} 
                              className={cn(
                                "max-w-[75%] p-3 rounded-xl leading-normal",
                                msg.sender === 'ai' 
                                  ? "bg-white/5 text-gray-200 self-start mr-auto border border-white/5" 
                                  : "bg-alien-green text-space-950 font-medium self-end ml-auto"
                              )}
                            >
                              {msg.text}
                            </div>
                          ))}
                          {isAiTyping && (
                            <div className="bg-white/5 border border-white/5 text-gray-400 p-2.5 rounded-xl w-16 text-center animate-pulse">
                              ...
                            </div>
                          )}
                        </div>

                        {/* Input line */}
                        <form onSubmit={handleAiSendMessage} className="p-3 border-t border-white/5 bg-space-950 flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Ask the AI Supplement Assistant..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            className="input py-2 flex-1 text-xs"
                          />
                          <button type="submit" className="bg-alien-green text-space-950 font-bold p-2.5 rounded-xl">
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 🔒 SECURITY */}
              {activeTab === 'security' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <h2 className="font-display text-3xl tracking-wide uppercase text-white">SECURITY ACCESS</h2>
                  
                  <div className="bg-space-950 border border-white/5 p-6 rounded-3xl space-y-4 text-xs">
                    <div>
                      <h4 className="font-bold text-white text-sm">Quantized Access parameters</h4>
                      <p className="text-[10px] text-gray-400">Configure parameters relative to system logins.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">New Password</label>
                        <input type="password" placeholder="••••••••" className="input" />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 mb-1.5 block">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="input" />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button onClick={() => alert('Password reset triggered!')} className="bg-alien-green text-space-950 font-bold font-mono px-6 py-2.5 rounded-xl">Update Access Credentials</button>
                    </div>
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
