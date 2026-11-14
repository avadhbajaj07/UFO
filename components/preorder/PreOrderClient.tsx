'use client'

import { ShieldCheck, Truck, Clock, RefreshCw, CheckCircle2 } from 'lucide-react'
import { useTranslation, Link } from '@/lib/i18n'

export default function PreOrderClient() {
  const { t } = useTranslation()

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto container-px space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alien-green/15 border border-alien-green/40 text-alien-green font-mono text-xs font-bold uppercase tracking-wider">
            {t('preorder_page.badge')}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide uppercase">
            {t('preorder_page.title')}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {t('preorder_page.subtitle')}
          </p>
        </div>

        {/* Highlight Guarantee Box */}
        <div className="card-glass border border-alien-green/30 p-6 sm:p-8 rounded-3xl relative overflow-hidden bg-space-900/90 shadow-glow-green">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-alien-green/20 border border-alien-green/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8 text-alien-green" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-white tracking-wide">
                {t('preorder_page.box_title')}
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t('preorder_page.box_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6">
          {/* 1 */}
          <div className="bg-space-900 border border-white/5 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-alien-green font-mono text-xs font-bold">
                01
              </span>
              <h3 className="font-bold text-lg text-white">
                {t('preorder_page.sec1_title')}
              </h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed pl-10">
              {t('preorder_page.sec1_desc')}
            </p>
          </div>

          {/* 2 */}
          <div className="bg-space-900 border border-white/5 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-alien-green font-mono text-xs font-bold">
                02
              </span>
              <h3 className="font-bold text-lg text-white">
                {t('preorder_page.sec2_title')}
              </h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed pl-10">
              {t('preorder_page.sec2_desc')}
            </p>
          </div>

          {/* 3 */}
          <div className="bg-space-900 border border-white/5 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-alien-green font-mono text-xs font-bold">
                03
              </span>
              <h3 className="font-bold text-lg text-white">
                {t('preorder_page.sec3_title')}
              </h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed pl-10">
              {t('preorder_page.sec3_desc')}
            </p>
          </div>

          {/* 4 */}
          <div className="bg-space-900 border border-white/5 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-alien-green font-mono text-xs font-bold">
                04
              </span>
              <h3 className="font-bold text-lg text-white">
                {t('preorder_page.sec4_title')}
              </h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed pl-10">
              {t('preorder_page.sec4_desc')}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-6">
          <Link
            href="/products"
            className="py-3 px-8 rounded-xl font-mono text-xs sm:text-sm font-bold bg-alien-green text-space-950 hover:bg-alien-green/90 shadow-glow-green transition-all inline-block"
          >
            {t('common.preorder_now')}
          </Link>
        </div>
      </div>
    </div>
  )
}
