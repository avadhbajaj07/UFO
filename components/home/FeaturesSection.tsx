import { FlaskConical, Zap, Truck, Users } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Built by the Community',
    description:
      'Every formula is developed with input from real athletes and bodybuilders - not a marketing team guessing what lifters want.',
    color: '#00FF88',
  },
  {
    icon: FlaskConical,
    title: 'Extraterrestrial Purity',
    description:
      'Every batch is third-party tested for purity and potency - no fillers, no shortcuts, no compromises on what goes into your body.',
    color: '#C850FF',
  },
  {
    icon: Zap,
    title: 'Maximum Power',
    description:
      'Formulas engineered by sports nutrition science to help you train harder, recover faster, and push past plateaus.',
    color: '#00CFFF',
  },
  {
    icon: Truck,
    title: 'Europe-Wide Delivery',
    description:
      'European fulfillment with fast shipping across Europe.',
    color: '#FF8C00',
  },
]

export default function FeaturesSection() {
  return (
    <section className="bg-nebula-glow border-y border-white/5 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="font-display text-5xl md:text-6xl tracking-wider mb-4">
            <span className="text-white">WHY </span>
            <span className="text-gradient-cosmic">UFOLABZ?</span>
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
    </section>
  )
}
