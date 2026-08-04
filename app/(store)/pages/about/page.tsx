import Link from 'next/link'
import type { Metadata } from 'next'
import { Shield, Beaker, CheckCircle, Users, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About UFO LABZ — Sports Nutrition Built by Athletes, Made in Europe',
  description:
    'UFO LABZ is a European sports nutrition brand designed by the athlete and bodybuilder community, built on third-party testing and European quality standards.',
}

const standards = [
  {
    icon: Shield,
    title: 'Third-Party Tested',
    description:
      'Every batch is independently verified for purity and potency before it reaches you.',
  },
  {
    icon: Beaker,
    title: 'Full-Dose Formulas',
    description:
      'No proprietary blends. Every ingredient is dosed at levels backed by sports nutrition research.',
  },
  {
    icon: CheckCircle,
    title: 'European Quality',
    description:
      'Manufactured and shipped from Europe, held to some of the strictest quality standards in the world.',
  },
  {
    icon: Users,
    title: 'Real Athletes, Real Feedback',
    description:
      'Our formulas are shaped by feedback from the athletes who actually use them daily.',
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
            OUR MISSION
          </p>
          <h1 className="font-display text-5xl md:text-7xl tracking-wider mb-6 leading-tight">
            BUILT BY ATHLETES.<br />ENGINEERED FOR ANOTHER WORLD.
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            UFO LABZ was founded on a simple idea: performance supplements should be designed by the people who actually use them. Developed with the athlete and bodybuilder community, manufactured to European quality standards, and shipped across Europe.
          </p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-glass p-8 md:p-12 text-center">
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-nebula-600 to-alien-green mb-8 mx-auto" />
            <h2 className="font-display text-3xl tracking-wider mb-8">
              THE MISSION BEHIND THE BRAND
            </h2>
            <div className="space-y-6 text-muted text-base leading-relaxed text-left md:text-center">
              <p>
                We started UFO LABZ because the supplement industry was full of noise — bold claims, underdosed formulas, and labels that hid more than they revealed. We wanted to build something different: a European brand shaped directly by athletes and bodybuilders, where every product is dosed at levels that actually work, tested by independent labs, and backed by real transparency.
              </p>
              <p>
                The &quot;alien performance&quot; identity isn&apos;t just branding — it reflects how we approach product development. We treat every formula like it needs to perform beyond what&apos;s normal. Because for the athletes who train with us, normal isn&apos;t the goal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Sets Us Apart (Standards) ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-5xl tracking-wider text-center mb-12">
            THE UFO LABZ STANDARD
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((s) => (
              <div
                key={s.title}
                className="card-glass p-6 hover:border-nebula-600/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-nebula-400" />
                </div>
                <h3 className="font-display text-xl tracking-wider mb-2">
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
          <div className="card-glass p-12 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl tracking-wider mb-3">
              JOIN THE CREW
            </h2>
            <p className="text-muted mb-6">
              Be among the first to experience European-engineered, alien-grade performance nutrition.
            </p>
            <Link
              href="/products"
              className="btn-primary inline-flex items-center gap-2"
            >
              EXPLORE THE COLLECTION
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
