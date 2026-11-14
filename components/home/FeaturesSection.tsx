'use client'

import { FlaskConical, Zap, Truck, Users, Shield, Clock, Heart } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function FeaturesSection() {
  const { t } = useTranslation()

  const features = [
    {
      icon: FlaskConical,
      title: t('features.feat1_title'),
      description: t('features.feat1_desc'),
      color: '#00FF88',
    },
    {
      icon: Zap,
      title: t('features.feat2_title'),
      description: t('features.feat2_desc'),
      color: '#C850FF',
    },
    {
      icon: Truck,
      title: t('features.feat3_title'),
      description: t('features.feat3_desc'),
      color: '#00CFFF',
    },
  ]

  const stats = [
    { value: '100%', label: t('features.stat_swiss'), icon: Users, color: '#00FF88' },
    { value: '100%', label: t('features.stat_purity'), icon: Shield, color: '#C850FF' },
    { value: '24H', label: t('features.stat_delivery'), icon: Clock, color: '#00CFFF' },
    { value: '100%', label: t('features.stat_satisfaction'), icon: Heart, color: '#FF8C00' },
  ]

  return (
    <section className="bg-nebula-glow border-y border-white/5 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="font-display text-5xl md:text-6xl tracking-wider mb-4">
            <span className="text-white">{t('features.section_title_prefix')}</span>
            <span className="text-gradient-cosmic">{t('features.section_title_brand')}</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            {t('features.section_subtitle')}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card-glass p-8 text-center group hover:border-nebula-600/30 transition-all duration-300"
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{
                  backgroundColor: `${feature.color}15`,
                  border: `1px solid ${feature.color}30`,
                }}
              >
                <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
              </div>
              <h3 className="font-display text-xl tracking-wider text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6">
              <div
                className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
                style={{
                  backgroundColor: `${stat.color}15`,
                  border: `1px solid ${stat.color}30`,
                }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div className="font-display text-4xl tracking-wider text-white mt-4 mb-1">
                {stat.value}
              </div>
              <div className="text-xs font-mono text-muted uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
