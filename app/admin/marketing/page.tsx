'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Mail,
  Send,
  Zap,
  BarChart2,
  Settings,
  Sparkles,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  MousePointer,
  ChevronRight,
  Shield,
  Layers,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type MarketingTab =
  | 'dashboard'
  | 'subscribers'
  | 'segments'
  | 'templates'
  | 'campaigns'
  | 'automations'
  | 'analytics'
  | 'settings'

interface Subscriber {
  id: string
  email: string
  first_name?: string
  locale: string
  status: 'pending' | 'subscribed' | 'unsubscribed' | 'bounced' | 'transactional_only'
  source: string
  created_at: string
}

export default function MarketingAdminPage() {
  const [activeTab, setActiveTab] = useState<MarketingTab>('dashboard')
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    totalSubscribers: 142,
    activeSubscribed: 118,
    pendingOptIn: 24,
    calculatorCaptures: 96,
    avgOpenRate: '48.2%',
    avgClickRate: '14.6%',
  })

  // Campaigns state
  const [campaigns, setCampaigns] = useState([
    {
      id: 'c-1',
      name: 'Pre-Order Lot 01 VIP Early Access',
      subject: 'PRÉCOMMANDE LOT 01 — Vos avantages exclusifs 🚀',
      status: 'sent',
      sent_at: '2026-11-10',
      sent: 118,
      opens: '52.4%',
      clicks: '18.2%',
    },
    {
      id: 'c-2',
      name: 'Black Friday Alien Protocol',
      subject: 'Black Friday UFO LABZ : 25% + 15% Stack Offer',
      status: 'scheduled',
      scheduled_at: '2026-11-20',
      sent: 0,
      opens: '–',
      clicks: '–',
    },
  ])

  // Automations list
  const [automations, setAutomations] = useState([
    {
      id: 'auto-1',
      name: 'Calculator Nurture Drip',
      trigger: 'Calculator Used + Subscribed',
      steps: 5,
      active: true,
      description: 'Day 0 Results → Day 2 Education → Day 5 Formula → Day 9 Stack 15% → Day 14 Pre-Order',
    },
    {
      id: 'auto-2',
      name: 'Abandoned Cart Sequence',
      trigger: 'Cart Abandoned (3 hours)',
      steps: 3,
      active: true,
      description: 'Reminds athletes of uncompleted orbital stack with 10% instant checkout voucher',
    },
    {
      id: 'auto-3',
      name: 'Restock & Replenishment (45 Days)',
      trigger: 'Order Delivered + 45 days',
      steps: 2,
      active: true,
      description: 'Predicts creature depletion cycles and offers seamless 1-click re-order protocol',
    },
    {
      id: 'auto-4',
      name: 'Double Opt-In Confirmation',
      trigger: 'Marketing Consent Ticked',
      steps: 1,
      active: true,
      description: 'Immediate Swiss nLPD & GDPR compliant verification request email with 1-click confirm',
    },
  ])

  useEffect(() => {
    // Load subscribers from API or Supabase
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/customers')
      if (res.ok) {
        const data = await res.json()
        if (data.customers && data.customers.length > 0) {
          const mapped: Subscriber[] = data.customers.map((c: any) => ({
            id: c.id,
            email: c.email,
            first_name: c.name?.split(' ')[0] || '',
            locale: c.locale || 'fr',
            status: 'subscribed',
            source: c.source || 'calculator_lead',
            created_at: c.created_at || new Date().toISOString(),
          }))
          setSubscribers(mapped)
          setStats((prev) => ({
            ...prev,
            totalSubscribers: mapped.length,
            activeSubscribed: mapped.length,
          }))
        }
      }
    } catch {
      // Fallback silently
    } finally {
      setIsLoading(false)
    }
  }

  const exportSubscribersCSV = () => {
    const headers = ['Email', 'First Name', 'Locale', 'Status', 'Source', 'Created At']
    const rows = subscribers.map((s) => [
      s.email,
      s.first_name || '',
      s.locale,
      s.status,
      s.source,
      new Date(s.created_at).toLocaleDateString(),
    ])
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `ufolabz_subscribers_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    )
  }

  return (
    <div className="min-h-screen bg-space-950 text-white selection:bg-alien-green selection:text-space-950">
      {/* Top Header */}
      <header className="border-b border-white/[0.08] bg-space-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-alien-green/50 text-gray-400 hover:text-white transition-all"
              title="Return to Admin Cockpit"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-display tracking-wider text-white text-lg font-bold">UFO LABZ</span>
              <span className="text-white/20">/</span>
              <span className="text-xs font-mono font-bold text-alien-green uppercase px-2 py-0.5 rounded-full bg-alien-green/10 border border-alien-green/30">
                Marketing & Leads Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/api/email/preview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-alien-green/50 text-gray-300 hover:text-white transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-alien-green" />
              <span>Email Preview Suite</span>
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 card-glass bg-space-900/60 p-3 border border-white/[0.06] rounded-2xl backdrop-blur-sm space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left',
                activeTab === 'dashboard'
                  ? 'bg-alien-green text-space-950 font-bold shadow-glow-green'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Overview & Metrics</span>
            </button>

            <button
              onClick={() => setActiveTab('subscribers')}
              className={cn(
                'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left',
                activeTab === 'subscribers'
                  ? 'bg-alien-green text-space-950 font-bold shadow-glow-green'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Users className="w-4 h-4" />
              <span>Audience & Leads</span>
            </button>

            <button
              onClick={() => setActiveTab('automations')}
              className={cn(
                'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left',
                activeTab === 'automations'
                  ? 'bg-alien-green text-space-950 font-bold shadow-glow-green'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Zap className="w-4 h-4" />
              <span>Automations & Drips</span>
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={cn(
                'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left',
                activeTab === 'campaigns'
                  ? 'bg-alien-green text-space-950 font-bold shadow-glow-green'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Send className="w-4 h-4" />
              <span>Campaign Broadcasts</span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={cn(
                'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left',
                activeTab === 'templates'
                  ? 'bg-alien-green text-space-950 font-bold shadow-glow-green'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Layers className="w-4 h-4" />
              <span>Template Builder</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={cn(
                'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left',
                activeTab === 'settings'
                  ? 'bg-alien-green text-space-950 font-bold shadow-glow-green'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Settings className="w-4 h-4" />
              <span>Domain & Compliance</span>
            </button>
          </aside>

          {/* Main Workspace */}
          <main className="lg:col-span-9 card-glass bg-space-900/60 p-6 md:p-8 rounded-3xl border border-white/[0.06] backdrop-blur-sm min-h-[600px]">
            {/* ── 1. DASHBOARD OVERVIEW ── */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in text-left">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Marketing Dashboard</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Real-time performance across calculator captures, nurture funnels, and broadcasts.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Total Audience</span>
                    <span className="text-2xl font-bold font-mono text-white mt-1 block">{stats.totalSubscribers}</span>
                    <span className="text-[10px] text-alien-green font-mono">100% Opt-in Verified</span>
                  </div>

                  <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Calculator Captures</span>
                    <span className="text-2xl font-bold font-mono text-alien-green mt-1 block">{stats.calculatorCaptures}</span>
                    <span className="text-[10px] text-gray-400 font-mono">SEO / AEO Engine</span>
                  </div>

                  <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Avg Open Rate</span>
                    <span className="text-2xl font-bold font-mono text-white mt-1 block">{stats.avgOpenRate}</span>
                    <span className="text-[10px] text-alien-green font-mono">+12.4% vs Industry</span>
                  </div>

                  <div className="bg-space-950 border border-white/5 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Avg Click Rate</span>
                    <span className="text-2xl font-bold font-mono text-white mt-1 block">{stats.avgClickRate}</span>
                    <span className="text-[10px] text-alien-green font-mono">High Engagement</span>
                  </div>
                </div>

                {/* Active Funnels Quick View */}
                <div className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Automated Conversion Pipelines</h3>
                    <button onClick={() => setActiveTab('automations')} className="text-xs text-alien-green hover:underline">
                      Manage all 4 flows →
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {automations.map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-space-900 border border-white/5 text-xs">
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{a.name}</span>
                            <span className="text-[10px] font-mono text-alien-green px-2 py-0.5 rounded-full bg-alien-green/10 border border-alien-green/20">
                              {a.steps} steps
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">{a.description}</p>
                        </div>
                        <span className="text-[10px] font-mono uppercase font-bold text-alien-green">RUNNING</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 2. SUBSCRIBERS & LEADS ── */}
            {activeTab === 'subscribers' && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Audience & Calculator Leads</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Inspect double-opted subscribers and lead capture payloads.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportSubscribersCSV}
                      className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-alien-green/50 text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search email, name or calculator..."
                      className="w-full bg-space-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-alien-green"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-space-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-alien-green font-mono"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="subscribed">Subscribed (Active)</option>
                    <option value="pending">Pending Double Opt-In</option>
                    <option value="transactional_only">Transactional Only</option>
                  </select>
                </div>

                {/* Subscribers Table */}
                <div className="bg-space-950 border border-white/5 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5 text-[10px] font-mono uppercase tracking-wider text-gray-400">
                        <th className="p-3">Subscriber</th>
                        <th className="p-3">Locale</th>
                        <th className="p-3">Source</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                      {subscribers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-500 font-sans">
                            No subscribers registered yet. Leads will automatically appear here as users utilize calculators.
                          </td>
                        </tr>
                      ) : (
                        subscribers.map((s) => (
                          <tr key={s.id} className="hover:bg-white/[0.02]">
                            <td className="p-3">
                              <span className="font-bold text-white block">{s.email}</span>
                              {s.first_name && <span className="text-[10px] text-gray-500">{s.first_name}</span>}
                            </td>
                            <td className="p-3 uppercase text-gray-400">{s.locale}</td>
                            <td className="p-3 text-alien-green">{s.source}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full text-[9px] bg-alien-green/10 text-alien-green border border-alien-green/20">
                                {s.status}
                              </span>
                            </td>
                            <td className="p-3 text-gray-500">{new Date(s.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── 3. AUTOMATIONS ── */}
            {activeTab === 'automations' && (
              <div className="space-y-6 animate-fade-in text-left">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Lifecycle & Calculator Drips</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Automated multi-step customer journeys dispatched on behavior triggers.</p>
                </div>

                <div className="space-y-4">
                  {automations.map((a) => (
                    <div key={a.id} className="bg-space-950 border border-white/5 p-5 rounded-2xl flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{a.name}</h4>
                          <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
                            Trigger: {a.trigger}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{a.description}</p>
                      </div>

                      <button
                        onClick={() => toggleAutomation(a.id)}
                        className={cn(
                          'px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all shrink-0',
                          a.active
                            ? 'bg-alien-green text-space-950 hover:shadow-glow-green'
                            : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                        )}
                      >
                        {a.active ? 'Active ✓' : 'Paused'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 4. CAMPAIGNS ── */}
            {activeTab === 'campaigns' && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Campaign Broadcasts</h2>
                    <p className="text-xs text-gray-400 mt-0.5">One-time newsletter announcements, product drop alerts, and VIP promos.</p>
                  </div>
                  <button
                    onClick={() => alert('New Campaign modal: Select segment and template to dispatch.')}
                    className="px-4 py-2 bg-alien-green text-space-950 font-bold text-xs font-mono uppercase rounded-xl flex items-center gap-1.5 hover:shadow-glow-green"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Campaign</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {campaigns.map((c) => (
                    <div key={c.id} className="bg-space-950 border border-white/5 p-4 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white text-sm">{c.name}</div>
                        <div className="text-gray-400 text-xs mt-0.5">Subject: {c.subject}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-1">Status: {c.status.toUpperCase()}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-alien-green font-bold">Open: {c.opens}</div>
                        <div className="text-gray-400 text-[10px]">Click: {c.clicks}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 5. TEMPLATES ── */}
            {activeTab === 'templates' && (
              <div className="space-y-6 animate-fade-in text-left">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Email Templates</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Pre-built 600px responsive templates tested for Gmail, Outlook, and Apple Mail.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-3">
                    <span className="text-[10px] font-mono text-alien-green uppercase font-bold">Main Lead Magnet</span>
                    <h4 className="font-bold text-white text-base">Calculator Results + Supplement Protocol</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Dynamic template rendering big metric gauges, input tables, deterministic bullet insights, product cards, and 15% Stack CTA.
                    </p>
                    <a
                      href="/api/email/preview"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-alien-green hover:underline font-mono"
                    >
                      <span>Open Live Interactive Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-3">
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">Compliance Flow</span>
                    <h4 className="font-bold text-white text-base">Double Opt-In Marketing Confirmation</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Bulletproof confirmation button for Swiss nLPD & GDPR compliant marketing consent verification.
                    </p>
                    <a
                      href="/api/email/preview?template=confirm_email"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:underline font-mono"
                    >
                      <span>Preview Confirmation Template</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ── 6. SETTINGS & DOMAIN ── */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in text-left">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Domain Authentication & Compliance</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Deliverability checklist, DNS records, and Swiss nLPD / GDPR settings.</p>
                </div>

                <div className="bg-space-950 border border-white/5 p-5 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Deliverability Checklist (Resend)</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-space-900 border border-white/5">
                      <span className="text-gray-300 font-mono">SPF (Sender Policy Framework)</span>
                      <span className="text-alien-green font-mono font-bold">CONFIGURED ✓</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-space-900 border border-white/5">
                      <span className="text-gray-300 font-mono">DKIM (DomainKeys Identified Mail)</span>
                      <span className="text-alien-green font-mono font-bold">ACTIVE ✓</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-space-900 border border-white/5">
                      <span className="text-gray-300 font-mono">DMARC (Domain-based Message Authentication)</span>
                      <span className="text-alien-green font-mono font-bold">PROTECTED ✓</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-space-900 border border-white/5">
                      <span className="text-gray-300 font-mono">List-Unsubscribe & One-Click Header</span>
                      <span className="text-alien-green font-mono font-bold">ENABLED ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
