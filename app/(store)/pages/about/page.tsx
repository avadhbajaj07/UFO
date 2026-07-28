import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Beaker, FlaskConical, ShieldCheck, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About UFO LABZ | Sports Nutrition Built by Athletes',
  description:
    'UFO LABZ is a European sports nutrition brand designed by the athlete and bodybuilder community, built on third-party testing and European quality standards.',
}

const standards = [
  {
    icon: ShieldCheck,
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
    icon: FlaskConical,
    title: 'European Quality',
    description:
      'Manufactured in Europe and held to rigorous quality standards before it reaches you.',
  },
  {
    icon: Users,
    title: 'Real Athletes, Real Feedback',
    description:
      'Our formulas are shaped by feedback from the athletes who actually use them daily.',
  },
]

const journey = [
  {
    marker: '2026',
    title: 'THE MISSION BEGINS',
    description:
      'UFO LABZ officially launched in Zürich with one goal: build honest, high-performance supplements with the athlete and bodybuilder community.',
  },
  {
    marker: 'NOW',
    title: 'OUR FIRST COLLECTION',
    description:
      'Our debut formulas are now available, bringing European-engineered performance nutrition to athletes across Europe.',
  },
  {
    marker: 'NEXT',
    title: 'BUILT WITH THE CREW',
    description:
      'We are listening to our first customers, gathering real training feedback, and using it to shape every formula and future release.',
  },
  {
    marker: 'FUTURE',
    title: 'EARNING YOUR TRUST',
    description:
      'Our journey is just beginning. We will grow through transparent formulas, independent testing, and products that prove themselves in the real world.',
  },
]

export default function AboutPage() {
  return (
    <div className="pt-24">
      <section className="relative overflow-hidden pb-16 pt-28 text-center">
        <div
          className="pointer-events-none absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, rgba(200,80,255,0.5) 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.4) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.3em] text-alien-green">
            OUR MISSION
          </p>
          <h1 className="font-display text-5xl tracking-wider text-white md:text-7xl">
            BUILT BY ATHLETES.
            <br />
            <span className="text-gradient-cosmic">ENGINEERED FOR ANOTHER WORLD.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted">
            UFO LABZ was founded on a simple idea: performance supplements should be
            designed by the people who actually use them. Developed with the athlete and
            bodybuilder community, manufactured to European quality standards, and shipped
            across Europe.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="card-glass p-8 md:p-12">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.25em] text-alien-green">
              OUR STORY
            </p>
            <h2 className="font-display text-3xl tracking-wider text-white md:text-5xl">
              THE MISSION BEHIND THE BRAND
            </h2>
            <div className="mt-7 space-y-5 text-muted leading-relaxed">
              <p>
                We started UFO LABZ because the supplement industry was full of noise -
                bold claims, underdosed formulas, and labels that hid more than they
                revealed. We wanted to build something different: a Zürich-based brand
                shaped directly by athletes and bodybuilders, where every product is dosed
                at levels that actually work, tested by independent labs, and backed by real
                transparency.
              </p>
              <p>
                The &quot;alien performance&quot; identity is not just branding - it reflects how
                we approach product development. We treat every formula like it needs to
                perform beyond what is normal. Because for the athletes who train with us,
                normal is not the goal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-nebula-glow border-y border-white/5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.25em] text-alien-green">
              WHAT SETS US APART
            </p>
            <h2 className="font-display text-3xl tracking-wider text-white md:text-5xl">
              THE UFO LABZ STANDARD
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {standards.map((standard) => (
              <div
                key={standard.title}
                className="card-glass p-6 transition-all duration-300 hover:border-nebula-600/30"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-nebula-600/20 bg-nebula-800/30">
                  <standard.icon className="h-6 w-6 text-nebula-400" />
                </div>
                <h3 className="font-display text-xl tracking-wider text-white">
                  {standard.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {standard.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.25em] text-alien-green">
              JUST GETTING STARTED
            </p>
            <h2 className="font-display text-3xl tracking-wider text-white md:text-5xl">
              THE UFO LABZ JOURNEY
            </h2>
          </div>

          <div className="relative mx-auto max-w-4xl">
            <div className="absolute bottom-0 left-3 top-0 w-px bg-gradient-to-b from-nebula-600 via-alien-green/70 to-nebula-600 md:left-1/2" />

            <div className="space-y-12 md:space-y-16">
              {journey.map((milestone, index) => {
                const alignLeft = index % 2 === 0

                return (
                  <div key={milestone.marker} className="relative md:grid md:grid-cols-2">
                    <div className="absolute left-3 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-alien-green shadow-glow-green md:left-1/2" />
                    <div
                      className={`pl-10 md:pl-0 ${
                        alignLeft
                          ? 'md:col-start-1 md:pr-12 md:text-right'
                          : 'md:col-start-2 md:pl-12'
                      }`}
                    >
                      <p className="mb-2 font-mono text-sm font-bold uppercase tracking-wider text-alien-green">
                        {milestone.marker}
                      </p>
                      <h3 className="font-display text-xl tracking-wider text-white">
                        {milestone.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="card-glass p-10 text-center md:p-12">
            <h2 className="font-display text-3xl tracking-wider text-white">JOIN THE CREW</h2>
            <p className="mb-6 mt-3 text-muted">
              Be among the first to experience European-engineered, alien-grade performance nutrition.
            </p>
            <Link href="/products" className="btn-primary inline-flex items-center gap-2">
              EXPLORE THE COLLECTION
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
