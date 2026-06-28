// components/home/FeaturesSection.tsx
import { FlaskConical, Shield, Truck, Star, RotateCcw, CreditCard } from 'lucide-react'

const features = [
  {
    icon: FlaskConical,
    title: 'Lab Certified',
    description: 'Every batch third-party tested for purity, potency, and heavy metal safety.',
    color: '#00FF88',
  },
  {
    icon: Shield,
    title: 'Swiss Made',
    description: 'Manufactured in GMP-certified Swiss facilities under the strictest quality controls.',
    color: '#00CFFF',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free delivery across Switzerland on all orders over CHF 99.',
    color: '#FF8C00',
  },
  {
    icon: Star,
    title: 'No Proprietary Blends',
    description: 'Full transparency. Every ingredient and dose clearly listed on the label.',
    color: '#9B30FF',
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    description: "Not satisfied? Return within 30 days for a full refund, no questions asked.",
    color: '#FF2244',
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Pay with card, TWINT, or SEPA. All transactions encrypted and PCI compliant.',
    color: '#00FF88',
  },
]

export default function FeaturesSection() {
  return (
    <section className="section bg-space-900 border-y border-white/5">
      <div className="max-w-7xl mx-auto container-px">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl md:text-5xl tracking-wider text-white mb-3">
            WHY UFO LABZ
          </h2>
          <p className="text-muted">The standards that set us apart from the rest of the galaxy.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-6 bg-space-800 border border-muted/10 rounded-2xl hover:border-opacity-30 transition-all duration-300"
              style={{ '--feature-color': f.color } as React.CSSProperties}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${f.color}18`, border: `1px solid ${f.color}30` }}
              >
                <f.icon className="w-5 h-5" style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
