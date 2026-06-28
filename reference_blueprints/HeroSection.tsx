'use client'
// components/home/HeroSection.tsx
import Link from 'next/link'
import { ArrowRight, Zap, Shield, FlaskConical } from 'lucide-react'

const PRODUCT_ORBS = [
  { color: '#00FF88', label: 'Alien Creatine',      delay: '0s',     top: '20%', right: '8%'  },
  { color: '#FF2244', label: 'Blast Pre Workout',   delay: '0.5s',   top: '55%', right: '3%'  },
  { color: '#FF8C00', label: 'Amino Fuel Mango',    delay: '1s',     top: '70%', left: '5%'   },
  { color: '#00CFFF', label: 'Amino Fuel Blue',     delay: '1.5s',   top: '30%', left: '3%'   },
  { color: '#9B30FF', label: 'Special Edition',     delay: '2s',     top: '80%', right: '12%' },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Starfield background */}
      <div className="absolute inset-0 bg-space-950">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 80% 10%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 50% 70%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.2) 0%, transparent 100%),
            radial-gradient(2px 2px at 35% 15%, rgba(0,255,136,0.6) 0%, transparent 100%),
            radial-gradient(2px 2px at 65% 85%, rgba(155,48,255,0.4) 0%, transparent 100%)
          `
        }} />
      </div>

      {/* Central glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #00FF88 0%, transparent 70%)' }} />
      </div>

      {/* Floating product orbs */}
      {PRODUCT_ORBS.map((orb) => (
        <div
          key={orb.label}
          className="absolute hidden lg:flex items-center gap-2 animate-float"
          style={{
            top:             orb.top,
            left:            orb.left,
            right:           orb.right,
            animationDelay:  orb.delay,
            animationDuration: '3s',
          }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: orb.color,
              boxShadow:       `0 0 12px ${orb.color}`,
            }}
          />
          <span className="text-xs font-mono text-muted/70 whitespace-nowrap">{orb.label}</span>
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-alien-green/30 bg-alien-green/5 mb-8 animate-fade-in-up">
          <div className="w-1.5 h-1.5 rounded-full bg-alien-green animate-pulse" />
          <span className="text-xs font-mono text-alien-green tracking-widest uppercase">
            Swiss Performance Supplements
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-display text-6xl sm:text-8xl md:text-9xl tracking-wider leading-none text-white mb-4 animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          ALIEN{' '}
          <span className="text-alien-green text-glow-green">GRADE</span>
          <br />
          PERFORMANCE
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          Five elite formulas. Zero compromises. Engineered in the galaxy's most
          advanced laboratory for athletes who demand more than Earth can offer.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          <Link
            href="/products"
            className="btn-primary text-base px-8 py-4 shadow-glow-green"
          >
            Shop the Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/products/astro-creatine"
            className="btn-outline text-base px-8 py-4"
          >
            Our Flagship Product
          </Link>
        </div>

        {/* Trust badges */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 mt-12 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          {[
            { icon: FlaskConical, text: 'Third-party tested' },
            { icon: Shield,       text: 'Swiss manufactured' },
            { icon: Zap,          text: 'Free shipping CHF 99+' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-muted text-sm">
              <Icon className="w-4 h-4 text-alien-green" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-gradient-to-b from-alien-green/60 to-transparent" />
        <span className="text-[10px] font-mono text-muted/50 uppercase tracking-widest">Scroll</span>
      </div>
    </section>
  )
}
