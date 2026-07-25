import Link from 'next/link'
import { Rocket, ShieldCheck } from 'lucide-react'

export default function TestimonialsSection() {
  return (
    <>
      <section className="section max-w-5xl mx-auto container-px">
        <div className="card-glass border-alien-green/20 p-8 text-center md:p-12">
          <ShieldCheck className="mx-auto mb-5 h-12 w-12 text-alien-green" />
          <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.3em] text-alien-green">
            Built Without Compromise
          </p>
          <h2 className="font-display text-4xl tracking-wider text-white md:text-5xl">
            THE UFO LABZ PROMISE
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-muted leading-relaxed">
            No filler ingredients. No underdosed formulas. Every product is third-party
            tested and built to Swiss quality standards before it ever reaches your door.
          </p>
        </div>
      </section>

      <section className="section max-w-5xl mx-auto container-px pt-0">
        <div className="relative overflow-hidden rounded-2xl border border-nebula-600/20 bg-nebula-glow p-8 text-center md:p-14">
          <Rocket className="mx-auto mb-5 h-10 w-10 text-nebula-400" />
          <h2 className="font-display text-4xl tracking-wider text-white md:text-5xl">
            READY FOR LIFTOFF?
          </h2>
          <p className="mx-auto mb-7 mt-4 max-w-xl text-muted">
            Be among the first to fuel your training with Swiss-engineered, alien-grade supplements.
          </p>
          <Link
            href="mailto:support@ufolabz.com?subject=UFO%20LABZ%20Launch%20Notification"
            className="btn-primary inline-flex items-center gap-2"
          >
            NOTIFY ME AT LAUNCH
          </Link>
        </div>
      </section>
    </>
  )
}
