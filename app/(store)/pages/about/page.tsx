import Link from 'next/link'
import type { Metadata } from 'next'
import { Shield, Sparkles, TrendingUp, Eye, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | UFO LABZ',
  description:
    'Learn about UFO LABZ — Swiss-engineered supplements designed for peak human performance. Our story, mission, and vision.',
}

const values = [
  {
    icon: Shield,
    title: 'Swiss Precision',
    description:
      'Every formula is developed and manufactured in Swiss GMP-certified laboratories.',
  },
  {
    icon: Sparkles,
    title: 'Alien Innovation',
    description:
      'We push the boundaries of sports nutrition with cutting-edge research.',
  },
  {
    icon: TrendingUp,
    title: 'Peak Performance',
    description:
      'Clinically-dosed ingredients designed for measurable results.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description:
      'Full ingredient transparency. No proprietary blends. No hidden fillers.',
  },
]

const milestones = [
  {
    year: '2022',
    title: 'THE LAUNCH',
    description:
      'Founded in Zurich with a vision to revolutionize sports nutrition.',
  },
  {
    year: '2023',
    title: 'FIRST FORMULA',
    description: 'Astro Creatine launched and sold out in 48 hours.',
  },
  {
    year: '2024',
    title: 'GOING VIRAL',
    description: 'Surpassed 100,000 customers across Switzerland.',
  },
  {
    year: '2025',
    title: 'GLOBAL EXPANSION',
    description:
      'Now available across Europe with next-day Swiss delivery.',
  },
]

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* ── Hero ── */}
      <section className="pt-28 pb-16 text-center relative overflow-hidden">
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
            OUR STORY
          </p>
          <h1 className="font-display text-5xl md:text-7xl tracking-wider mb-6">
            ENGINEERED BEYOND EARTH
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            UFO LABZ was born from the belief that human potential has no
            ceiling. We combine Swiss precision with futuristic innovation to
            create supplements that are truly out of this world.
          </p>
        </div>
      </section>

      {/* ── Mission / Vision ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="card-glass p-8">
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-nebula-600 to-alien-green mb-6" />
              <h2 className="font-display text-2xl mb-4 tracking-wider">
                OUR MISSION
              </h2>
              <p className="text-muted text-sm leading-relaxed">
                To deliver Swiss-engineered supplements that unlock peak human
                performance. Every ingredient is clinically dosed, every formula
                rigorously tested — because your body deserves nothing less than
                precision-grade nutrition built for the future.
              </p>
            </div>

            {/* Vision */}
            <div className="card-glass p-8">
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-nebula-600 to-alien-green mb-6" />
              <h2 className="font-display text-2xl mb-4 tracking-wider">
                OUR VISION
              </h2>
              <p className="text-muted text-sm leading-relaxed">
                To redefine the future of supplement science by merging
                cutting-edge research with uncompromising quality. We envision a
                world where every athlete — from weekend warriors to elite
                competitors — has access to the most advanced nutrition on the
                planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-5xl tracking-wider text-center mb-12">
            WHAT DRIVES US
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="card-glass p-6 hover:border-nebula-600/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-nebula-400" />
                </div>
                <h3 className="font-display text-xl tracking-wider mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-5xl tracking-wider text-center mb-12">
            THE UFO LABZ JOURNEY
          </h2>

          <div className="max-w-3xl mx-auto relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-nebula-600 via-alien-green/50 to-nebula-600" />

            <div className="space-y-12">
              {milestones.map((m, i) => {
                const isEven = i % 2 === 0
                return (
                  <div
                    key={m.year}
                    className={`relative ${
                      isEven
                        ? 'pl-[calc(50%+2rem)]'
                        : 'pr-[calc(50%+2rem)] text-right'
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute top-2 left-[calc(50%-6px)] w-3 h-3 rounded-full bg-alien-green" />

                    <p className="font-mono text-sm text-alien-green mb-1">
                      {m.year}
                    </p>
                    <h3 className="font-display text-xl tracking-wider mb-1">
                      {m.title}
                    </h3>
                    <p className="text-sm text-muted">{m.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-glass p-12 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl tracking-wider mb-3">
              READY TO ELEVATE?
            </h2>
            <p className="text-muted mb-6">
              Discover our range of premium supplements engineered for those who
              demand more.
            </p>
            <Link
              href="/products"
              className="btn-primary inline-flex items-center gap-2"
            >
              SHOP NOW
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
