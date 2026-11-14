'use client'

import { useState } from 'react'
import {
  Package,
  FlaskConical,
  CreditCard,
  RotateCcw,
  Users,
  ChevronDown,
  HelpCircle,
} from 'lucide-react'
import { useTranslation, Link } from '@/lib/i18n'

export default function FAQPageClient() {
  const { t } = useTranslation()
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'orders-0': true,
    'preorders-0': true,
  })

  const toggle = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const faqData = [
    {
      id: 'preorders',
      category: t('faq_page.cat_preorders'),
      icon: Package,
      items: [
        {
          q: t('faq_page.q_preorder_cancel'),
          a: t('faq_page.a_preorder_cancel'),
        },
        {
          q: t('faq_page.q_preorder_dispatch'),
          a: t('faq_page.a_preorder_dispatch'),
        },
      ],
    },
    {
      id: 'orders',
      category: t('faq_page.cat_orders'),
      icon: Package,
      items: [
        {
          q: t('faq_page.q_shipping_time'),
          a: t('faq_page.a_shipping_time'),
        },
        {
          q: t('faq_page.q_intl_shipping'),
          a: t('faq_page.a_intl_shipping'),
        },
        {
          q: t('faq_page.q_track_order'),
          a: t('faq_page.a_track_order'),
        },
      ],
    },
    {
      id: 'products',
      category: t('faq_page.cat_products'),
      icon: FlaskConical,
      items: [
        {
          q: t('faq_page.q_lab_testing'),
          a: t('faq_page.a_lab_testing'),
        },
        {
          q: t('faq_page.q_vegan'),
          a: t('faq_page.a_vegan'),
        },
        {
          q: t('faq_page.q_what_makes_diff'),
          a: t('faq_page.a_what_makes_diff'),
        },
      ],
    },
    {
      id: 'payments',
      category: t('faq_page.cat_payments'),
      icon: CreditCard,
      items: [
        {
          q: t('faq_page.q_payment_methods'),
          a: t('faq_page.a_payment_methods'),
        },
      ],
    },
  ]

  return (
    <div className="pt-24">
      {/* ── Hero ── */}
      <section className="pt-28 pb-12 text-center relative overflow-hidden">
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
            SUPPORT & FAQ
          </p>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl tracking-wider mb-6 text-white uppercase">
            {t('faq_page.title')}
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            {t('faq_page.subtitle')}
          </p>
        </div>
      </section>

      {/* ── FAQ Accordion ── */}
      <section className="py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqData.map((category) => (
            <div key={category.id} className="mb-10">
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <category.icon className="w-5 h-5 text-alien-green" />
                <h2 className="font-display text-xl sm:text-2xl tracking-wider text-white">
                  {category.category}
                </h2>
              </div>

              {/* Items */}
              {category.items.map((item, idx) => {
                const key = `${category.id}-${idx}`
                const isOpen = !!openItems[key]

                return (
                  <div
                    key={key}
                    className="card-glass rounded-xl mb-3 overflow-hidden border border-white/5 hover:border-alien-green/30 transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      className="w-full flex justify-between items-center p-5 text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="text-sm font-medium text-white pr-4">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted transition-transform duration-300 flex-shrink-0 ${
                          isOpen ? 'rotate-180 text-alien-green' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 animate-fade-in">
                        <div className="border-t border-white/[0.04] pt-4 text-sm text-gray-300 leading-relaxed">
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
      <section className="max-w-3xl mx-auto mb-20 px-4 sm:px-6 lg:px-8">
        <div className="card-glass p-8 sm:p-10 text-center">
          <HelpCircle className="w-10 h-10 text-alien-green mx-auto mb-4" />
          <h2 className="font-display text-2xl tracking-wider mb-2 text-white">
            {t('contact_page.title')}
          </h2>
          <p className="text-sm text-muted mb-6 max-w-md mx-auto">
            {t('contact_page.subtitle')}
          </p>
          <Link
            href="/pages/contact"
            className="py-3 px-6 rounded-xl font-mono text-xs sm:text-sm font-bold bg-alien-green text-space-950 hover:bg-alien-green/90 shadow-glow-green transition-all inline-flex items-center gap-2"
          >
            <span>{t('navbar.contact')}</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
