import { FlaskConical, ShieldCheck, Truck, Users } from 'lucide-react'

const trustItems = [
  { icon: Users, label: 'Designed by Athletes & Bodybuilders' },
  { icon: FlaskConical, label: 'Swiss-Engineered Formulas' },
  { icon: ShieldCheck, label: 'Third-Party Purity Tested' },
  { icon: Truck, label: 'Shipping Across Switzerland & Europe' },
]

export default function MarqueeBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-space-800 via-nebula-900/40 to-space-800 border-y border-nebula-700/20">
      {/* Animated shimmer overlay */}
      <div
        className="pointer-events-none absolute inset-0 animate-shimmer"
        style={{
          backgroundImage:
            'linear-gradient(110deg, transparent 25%, rgba(200,80,255,0.06) 37%, rgba(255,255,255,0.04) 50%, rgba(200,80,255,0.06) 63%, transparent 75%)',
          backgroundSize: '200% 100%',
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-center gap-3 border-b border-white/5 px-5 py-5 sm:[&:nth-child(n+3)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
          >
            <item.icon className="h-5 w-5 shrink-0 text-alien-green" />
            <span className="text-center font-mono text-[11px] font-semibold uppercase tracking-wider text-white">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
