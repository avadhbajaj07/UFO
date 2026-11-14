'use client'

import { useTranslation } from '@/lib/i18n'
import { ShieldCheck } from 'lucide-react'

export default function RefundClient() {
  const { t } = useTranslation()

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="pt-28 pb-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-nebula-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-alien-green mb-4">
            {t('refund_page.badge')}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl tracking-wider text-white mb-4 uppercase">
            {t('refund_page.title')}
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed">
            {t('refund_page.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left mb-16">
        <div className="card-glass p-6 sm:p-8 space-y-6">
          {/* 100% Pre-order Box */}
          <div className="bg-alien-green/10 border border-alien-green/30 rounded-2xl p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-6 h-6 text-alien-green shrink-0" />
              <h2 className="font-display text-xl sm:text-2xl text-alien-green">
                {t('refund_page.box_title')}
              </h2>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              {t('refund_page.box_desc')}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-white mb-2">
              {t('refund_page.sec1_title')}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              {t('refund_page.sec1_desc')}
            </p>
          </div>

          <div className="border-t border-white/5 pt-6">
            <h2 className="font-display text-xl sm:text-2xl text-white mb-2">
              {t('refund_page.sec2_title')}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              {t('refund_page.sec2_desc')}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
