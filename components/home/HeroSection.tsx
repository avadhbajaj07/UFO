'use client';

import Link from 'next/link';
import {
  Rocket,
  ArrowRight,
  FlaskConical,
  Shield,
  Truck,
  Award,
} from 'lucide-react';

const trustBadges = [
  { icon: FlaskConical, label: 'Lab Tested', color: 'text-nebula-400' },
  { icon: Shield, label: 'Premium Quality', color: 'text-alien-green' },
  { icon: Truck, label: 'Free Shipping', color: 'text-nebula-400' },
  { icon: Award, label: 'Made for Athletes', color: 'text-alien-green' },
];

const productOrbs = [
  {
    name: 'Alien Creatine',
    color: '#00FF88',
    top: '8%',
    left: '55%',
    size: 'w-24 h-24 lg:w-28 lg:h-28',
    delay: '0s',
  },
  {
    name: 'Blast Pre',
    color: '#FF2244',
    top: '22%',
    left: '18%',
    size: 'w-20 h-20 lg:w-24 lg:h-24',
    delay: '0.4s',
  },
  {
    name: 'Amino Mango',
    color: '#FF8C00',
    top: '50%',
    left: '60%',
    size: 'w-22 h-22 lg:w-26 lg:h-26',
    delay: '0.8s',
  },
  {
    name: 'Amino Blue',
    color: '#00CFFF',
    top: '65%',
    left: '25%',
    size: 'w-18 h-18 lg:w-22 lg:h-22',
    delay: '1.2s',
  },
  {
    name: 'Special Edition',
    color: '#9B30FF',
    top: '38%',
    left: '40%',
    size: 'w-26 h-26 lg:w-32 lg:h-32',
    delay: '0.6s',
  },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-starfield overflow-hidden">
      {/* ── Nebula Background Glows ── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(123,47,190,0.2), transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 40% 30% at 70% 60%, rgba(0,255,136,0.08), transparent 70%)',
        }}
      />

      {/* ── Main Content ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:py-0">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12">
          {/* ─── Left Column – Text ─── */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: '0s' }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-nebula-600/40 bg-nebula-700/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-nebula-400">
                <Rocket className="h-3.5 w-3.5" />
                FUEL FROM SPACE
              </span>
            </div>

            {/* Headline */}
            <h1
              className="animate-fade-in-up font-display text-5xl leading-none tracking-wider text-white sm:text-6xl lg:text-7xl xl:text-8xl"
              style={{ animationDelay: '0.15s' }}
            >
              UNLEASH YOUR
              <br />
              <span className="text-gradient-cosmic">COSMIC POWER</span>
            </h1>

            {/* Description */}
            <p
              className="animate-fade-in-up max-w-lg text-base leading-relaxed text-muted lg:text-lg"
              style={{ animationDelay: '0.3s' }}
            >
              Experience the next evolution in sports nutrition. Our
              cutting-edge formulas, engineered in Swiss laboratories, are
              designed to elevate your performance beyond earthly limits.
            </p>

            {/* CTAs */}
            <div
              className="animate-fade-in-up flex flex-wrap items-center gap-4"
              style={{ animationDelay: '0.45s' }}
            >
              <Link
                href="/products"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base shadow-glow-green"
              >
                Explore the Universe
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="btn-outline inline-flex items-center gap-2 border-nebula-600/30 px-8 py-4 text-base hover:border-nebula-400/50"
              >
                View Products
              </Link>
            </div>

            {/* Trust Badges */}
            <div
              className="animate-fade-in-up mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4"
              style={{ animationDelay: '0.6s' }}
            >
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2.5"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 ${badge.color}`}
                  >
                    <badge.icon className="h-4 w-4" />
                  </span>
                  <span className="text-xs leading-tight text-muted">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Right Column – Product Orbs ─── */}
          <div
            className="animate-fade-in-up relative hidden min-h-[500px] lg:block lg:min-h-[600px]"
            style={{ animationDelay: '0.3s' }}
          >
            {/* Central glowing circle */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(circle, rgba(155,48,255,0.15) 0%, rgba(0,255,136,0.06) 50%, transparent 80%)',
              }}
            />

            {/* Floating orbs */}
            {productOrbs.map((orb) => (
              <div
                key={orb.name}
                className={`animate-float absolute flex flex-col items-center gap-2 ${orb.size}`}
                style={{
                  top: orb.top,
                  left: orb.left,
                  animationDelay: orb.delay,
                }}
              >
                {/* Orb sphere */}
                <div
                  className="flex h-full w-full items-center justify-center rounded-full"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${orb.color}44, ${orb.color}22 60%, transparent 80%)`,
                    border: `1.5px solid ${orb.color}55`,
                    boxShadow: `0 0 30px ${orb.color}33, 0 0 60px ${orb.color}18, inset 0 0 20px ${orb.color}11`,
                  }}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      background: orb.color,
                      boxShadow: `0 0 12px ${orb.color}`,
                    }}
                  />
                </div>
                {/* Label */}
                <span
                  className="whitespace-nowrap font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: orb.color, opacity: 0.7 }}
                >
                  {orb.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Scroll Indicator ── */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted/50">
          SCROLL
        </span>
        <div className="h-10 w-px bg-gradient-to-b from-nebula-600/60 to-transparent" />
      </div>
    </section>
  );
}
