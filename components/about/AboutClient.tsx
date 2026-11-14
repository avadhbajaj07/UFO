'use client'

import { useTranslation, Link } from '@/lib/i18n'
import { Shield, Beaker, CheckCircle, Users, ArrowRight } from 'lucide-react'

export default function AboutClient() {
  const { t } = useTranslation()

  const standards = [
    {
      icon: Shield,
      title: t('about_page.std1_title'),
      description: t('about_page.std1_desc'),
    },
    {
      icon: Beaker,
      title: t('about_page.std2_title'),
      description: t('about_page.std2_desc'),
    },
    {
      icon: CheckCircle,
      title: t('about_page.std3_title'),
      description: t('about_page.std3_desc'),
    },
    {
      icon: Users,
      title: t('about_page.std4_title'),
      description: t('about_page.std4_desc'),
    },
  ]

  return (
    <div className="pt-24">
      {/* ── Hero ── */}
      <section className="pt-28 pb-16 text-center relative overflow-hidden">
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
            {t('about_page.badge')}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl tracking-wider mb-6 leading-tight text-white uppercase">
            {t('about_page.hero_title')}
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            {t('about_page.hero_subtitle')}
          </p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-glass p-8 md:p-12 text-center">
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-nebula-600 to-alien-green mb-8 mx-auto" />
            <h2 className="font-display text-2xl sm:text-3xl tracking-wider mb-8 text-white">
              {t('about_page.story_title')}
            </h2>
            <div className="space-y-6 text-muted text-base leading-relaxed text-left md:text-center">
              <p>{t('about_page.story_p1')}</p>
              <p>{t('about_page.story_p2')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Sets Us Apart (Standards) ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-5xl tracking-wider text-center mb-12 text-white">
            {t('about_page.standards_title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((s) => (
              <div
                key={s.title}
                className="card-glass p-6 hover:border-alien-green/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-alien-green" />
                </div>
                <h3 className="font-display text-lg sm:text-xl tracking-wider mb-2 text-white">
                  {s.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-glass p-10 sm:p-12 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl tracking-wider mb-3 text-white">
              {t('about_page.cta_title')}
            </h2>
            <p className="text-muted mb-6 text-sm sm:text-base">
              {t('about_page.subtitle')}
            </p>
            <Link
              href="/products"
              className="py-3 px-6 rounded-xl font-mono text-xs sm:text-sm font-bold bg-alien-green text-space-950 hover:bg-alien-green/90 shadow-glow-green transition-all inline-flex items-center gap-2"
            >
              <span>{t('about_page.cta_btn')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
