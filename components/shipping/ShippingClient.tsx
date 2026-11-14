'use client'

import { Truck, Globe, ShieldCheck, MapPin } from 'lucide-react'
import { useTranslation, Link } from '@/lib/i18n'

export default function ShippingClient() {
  const { t } = useTranslation()

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="pt-28 pb-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-nebula-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-nebula-800/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-alien-green mb-4">
            {t('shipping_page.badge')}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl tracking-wider text-white mb-4 uppercase">
            {t('shipping_page.title')}
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed">
            {t('shipping_page.subtitle')}
          </p>
        </div>
      </section>

      {/* Shipping Zones */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-display text-2xl sm:text-3xl text-white mb-8 text-center tracking-wider">
          {t('shipping_page.rates_heading')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Switzerland */}
          <div className="card-glass p-6 sm:p-8 relative border border-white/5 hover:border-alien-green/30 transition-all">
            <span className="absolute top-4 right-4 text-[10px] font-mono bg-alien-green/10 text-alien-green border border-alien-green/20 rounded-full px-2.5 py-0.5">
              {t('shipping_page.ch_badge')}
            </span>
            <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mb-4">
              <Truck className="w-5 h-5 text-alien-green" />
            </div>
            <h3 className="font-display text-xl text-white mb-3">
              {t('shipping_page.ch_rates_title')}
            </h3>
            <ul className="space-y-2.5">
              <li className="text-sm text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-alien-green shrink-0" />
                <strong className="text-white">{t('shipping_page.ch_free')}</strong>
              </li>
              <li className="text-sm text-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-alien-green shrink-0" />
                <span>{t('shipping_page.ch_standard')}</span>
              </li>
              <li className="text-sm text-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-alien-green shrink-0" />
                <span>{t('shipping_page.ch_carrier')}</span>
              </li>
            </ul>
          </div>

          {/* Europe */}
          <div className="card-glass p-6 sm:p-8 relative border border-white/5 hover:border-alien-green/30 transition-all">
            <span className="absolute top-4 right-4 text-[10px] font-mono bg-alien-green/10 text-alien-green border border-alien-green/20 rounded-full px-2.5 py-0.5">
              {t('shipping_page.eu_badge')}
            </span>
            <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mb-4">
              <Globe className="w-5 h-5 text-[#00CFFF]" />
            </div>
            <h3 className="font-display text-xl text-white mb-3">
              {t('shipping_page.eu_rates_title')}
            </h3>
            <ul className="space-y-2.5">
              <li className="text-sm text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00CFFF] shrink-0" />
                <strong className="text-white">{t('shipping_page.eu_free')}</strong>
              </li>
              <li className="text-sm text-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00CFFF] shrink-0" />
                <span>{t('shipping_page.eu_standard')}</span>
              </li>
              <li className="text-sm text-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00CFFF] shrink-0" />
                <span>{t('shipping_page.eu_carrier')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Store Pickup Geneva */}
        <div className="card-glass p-6 sm:p-8 rounded-2xl mb-12 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-alien-green" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg sm:text-xl text-white">
                {t('shipping_page.pickup_title')}
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-alien-green/20 text-alien-green border border-alien-green/40">
                {t('shipping_page.pickup_badge')}
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              {t('shipping_page.pickup_desc')}
            </p>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="card-glass p-8 rounded-2xl border border-alien-green/30 bg-space-900/90 shadow-glow-green text-center">
          <ShieldCheck className="w-10 h-10 text-alien-green mx-auto mb-3" />
          <h3 className="font-display text-xl text-white mb-2">
            {t('shipping_page.guarantee_title')}
          </h3>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('shipping_page.guarantee_desc')}
          </p>
        </div>
      </section>
    </div>
  )
}
