// components/home/BrandPromiseSection.tsx
import { ShieldCheck, Beaker, CheckCircle } from 'lucide-react'

export default function BrandPromiseSection() {
  return (
    <section className="section max-w-7xl mx-auto container-px">
      <div className="text-center mb-14">
        <h2 className="font-display text-5xl md:text-6xl tracking-wider mb-4">
          <span className="text-white">THE UFO LABZ</span>
          <br />
          <span className="text-gradient-cosmic">PROMISE</span>
        </h2>
        <p className="text-muted max-w-2xl mx-auto">
          No filler ingredients. No underdosed formulas. Every product is third-party tested and built to European quality standards before it ever reaches your door.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-glass p-8 text-center group hover:border-nebula-600/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-6 h-6 text-alien-green" />
          </div>
          <h3 className="text-xl font-display text-white mb-2 tracking-wider">Third-Party Tested</h3>
          <p className="text-sm text-muted">Every batch is independently verified for purity and potency.</p>
        </div>

        <div className="card-glass p-8 text-center group hover:border-nebula-600/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mx-auto mb-5">
            <Beaker className="w-6 h-6 text-nebula-400" />
          </div>
          <h3 className="text-xl font-display text-white mb-2 tracking-wider">Full-Dose Formulas</h3>
          <p className="text-sm text-muted">No proprietary blends. Every ingredient is dosed at clinical levels.</p>
        </div>

        <div className="card-glass p-8 text-center group hover:border-nebula-600/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-6 h-6 text-[#00CFFF]" />
          </div>
          <h3 className="text-xl font-display text-white mb-2 tracking-wider">European Quality</h3>
          <p className="text-sm text-muted">Manufactured and shipped from Europe with the strictest standards.</p>
        </div>
      </div>
    </section>
  )
}
