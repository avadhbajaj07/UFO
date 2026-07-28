'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Package,
  FlaskConical,
  RotateCcw,
  ChevronDown,
  HelpCircle,
} from 'lucide-react'

const faqData = [
  {
    category: 'Products',
    icon: FlaskConical,
    items: [
      {
        q: 'Are UFO LABZ supplements third-party tested?',
        a: 'Yes. Every batch goes through independent lab testing to verify purity and potency before it ships.',
      },
      {
        q: 'Do your products contain proprietary blends?',
        a: 'No. We list every ingredient and its exact dose on the label - full transparency, no hidden amounts.',
      },
      {
        q: 'Are your supplements suitable for daily use?',
        a: 'Yes, our core range - creatine, magnesium, aminos, and collagen - is formulated for daily use. Check individual product labels for specific usage guidance.',
      },
    ],
  },
  {
    category: 'Orders & Shipping',
    icon: Package,
    items: [
      {
        q: 'How fast is delivery in Europe?',
        a: 'Most orders arrive within 24 hours of dispatch in supported regions.',
      },
      {
        q: 'Is delivery free?',
        a: 'Yes - standard delivery is free in supported European regions.',
      },
      {
        q: 'Where do you ship?',
        a: 'We ship across supported regions of Europe.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Visa, Mastercard, TWINT, and SEPA.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    icon: RotateCcw,
    items: [
      {
        q: 'What is your return policy?',
        a: 'All sales are final. We do not accept returns or issue refunds except in the case of products that arrive damaged, defective, or incorrect. If this applies to your order, contact support@ufolabz.com within 7 days of delivery with your order number and a clear photo of the issue.',
      },
    ],
  },
]

export default function FAQPageClient() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggle = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="pt-24">
      {/* ── Hero ── */}
      <section className="pt-28 pb-12 text-center relative overflow-hidden">
        {/* Ambient nebula glows */}
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(200,80,255,0.5) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.08] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(0,255,136,0.4) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-alien-green mb-4">
            SUPPORT CENTER
          </p>
          <h1 className="font-display text-5xl md:text-7xl tracking-wider mb-6">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Everything you need to know before your first mission.
          </p>
        </div>
      </section>

      {/* ── FAQ Accordion ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqData.map((category) => (
            <div key={category.category} className="mb-10">
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <category.icon className="w-5 h-5 text-nebula-400" />
                <h2 className="font-display text-2xl tracking-wider">
                  {category.category}
                </h2>
              </div>

              {/* Items */}
              {category.items.map((item, idx) => {
                const key = `${category.category}-${idx}`
                const isOpen = !!openItems[key]

                return (
                  <div
                    key={key}
                    className="card-glass rounded-xl mb-3 overflow-hidden"
                  >
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex justify-between items-center p-5 text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="text-sm font-medium text-white">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted transition-transform duration-300 flex-shrink-0 ml-4 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5">
                        <div className="border-t border-white/[0.04] pt-4 text-sm text-muted leading-relaxed">
                          {item.a}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-3xl mx-auto mt-12 mb-16 px-4 sm:px-6 lg:px-8">
        <div className="card-glass p-8 text-center">
          <HelpCircle className="w-10 h-10 text-nebula-400 mx-auto mb-4" />
          <h2 className="font-display text-2xl tracking-wider mb-2">
            Still have questions?
          </h2>
          <p className="text-sm text-muted mb-6">
            Contact our team and we will help you prepare for your mission.
          </p>
          <Link
            href="/pages/contact"
            className="btn-primary inline-flex items-center gap-2"
          >
            CONTACT OUR TEAM
          </Link>
        </div>
      </section>
    </div>
  )
}
