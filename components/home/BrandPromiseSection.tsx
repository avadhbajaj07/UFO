'use client'

import { ShieldCheck, Beaker, CheckCircle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function BrandPromiseSection() {
  const { t } = useTranslation()

  return (
    <section className="section max-w-7xl mx-auto container-px">
      <div className="text-center mb-14">
        <h2 className="font-display text-5xl md:text-6xl tracking-wider mb-4">
          <span className="text-white">{t('brand_promise.title_prefix')} </span>
          <br />
          <span className="text-gradient-cosmic">{t('brand_promise.title_brand')}</span>
        </h2>
        <p className="text-muted max-w-2xl mx-auto">
          {t('brand_promise.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-glass p-8 text-center group hover:border-nebula-600/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-6 h-6 text-alien-green" />
          </div>
          <h3 className="text-xl font-display text-white mb-2 tracking-wider">
            {t('brand_promise.card1_title')}
          </h3>
          <p className="text-sm text-muted">
            {t('brand_promise.card1_desc')}
          </p>
        </div>

        <div className="card-glass p-8 text-center group hover:border-nebula-600/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mx-auto mb-5">
            <Beaker className="w-6 h-6 text-nebula-400" />
          </div>
          <h3 className="text-xl font-display text-white mb-2 tracking-wider">
            {t('brand_promise.card2_title')}
          </h3>
          <p className="text-sm text-muted">
            {t('brand_promise.card2_desc')}
          </p>
        </div>

        <div className="card-glass p-8 text-center group hover:border-nebula-600/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-6 h-6 text-[#00CFFF]" />
          </div>
          <h3 className="text-xl font-display text-white mb-2 tracking-wider">
            {t('brand_promise.card3_title')}
          </h3>
          <p className="text-sm text-muted">
            {t('brand_promise.card3_desc')}
          </p>
        </div>
      </div>
    </section>
  )
}
