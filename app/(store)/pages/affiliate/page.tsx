import Link from 'next/link';
import type { Metadata } from 'next';
import {
  UserPlus,
  Share2,
  DollarSign,
  Percent,
  BarChart2,
  Gift,
  Clock,
  CreditCard,
  Headphones,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Affiliate Program | UFO LABZ',
  description:
    'Join the UFO LABZ Affiliate Program and earn up to 25% commission on every sale. Sign up, share your referral link, and start earning today.',
};

const steps = [
  {
    icon: UserPlus,
    title: 'SIGN UP',
    description:
      'Apply for our affiliate program. Get approved within 24 hours and access your personal dashboard.',
  },
  {
    icon: Share2,
    title: 'SHARE & PROMOTE',
    description:
      'Use your unique referral link, custom coupons, and our marketing materials to promote UFO LABZ.',
  },
  {
    icon: DollarSign,
    title: 'EARN COMMISSIONS',
    description:
      'Earn 15-25% commission on every sale. Track earnings in real-time and get paid monthly.',
  },
];

const benefits = [
  {
    icon: Percent,
    title: 'HIGH COMMISSION RATES',
    description:
      'Earn 15-25% on every referred sale, with bonus tiers for top performers',
  },
  {
    icon: BarChart2,
    title: 'REAL-TIME DASHBOARD',
    description:
      'Track clicks, conversions, and earnings with our advanced affiliate dashboard',
  },
  {
    icon: Gift,
    title: 'EXCLUSIVE PERKS',
    description:
      'Get free product samples, early access to launches, and exclusive discount codes',
  },
  {
    icon: Clock,
    title: '30-DAY COOKIE',
    description:
      'Our 30-day cookie window means you earn commissions even on delayed purchases',
  },
  {
    icon: CreditCard,
    title: 'FLEXIBLE PAYOUTS',
    description:
      'Get paid via TWINT, bank transfer, or PayPal with a low CHF 50 minimum',
  },
  {
    icon: Headphones,
    title: 'DEDICATED SUPPORT',
    description:
      'Access a dedicated affiliate manager and priority support channel',
  },
];

const stats = [
  { value: '25%', label: 'Max Commission' },
  { value: '30 Days', label: 'Cookie Duration' },
  { value: 'CHF 850+', label: 'Avg Monthly Earnings' },
  { value: '500+', label: 'Active Affiliates' },
];

const tiers = [
  {
    name: 'EXPLORER',
    sales: '0 — 10 sales',
    commission: '15%',
    bonus: '—',
    highlighted: false,
  },
  {
    name: 'ASTRONAUT',
    sales: '11 — 50 sales',
    commission: '20%',
    bonus: 'Free product monthly',
    highlighted: false,
  },
  {
    name: 'COMMANDER',
    sales: '51+ sales',
    commission: '25%',
    bonus: 'Free products + VIP support',
    highlighted: true,
  },
];

export default function AffiliatePage() {
  return (
    <div className="pt-28">
      {/* ── Hero ── */}
      <section className="pb-16 text-center relative overflow-hidden">
        {/* Ambient nebula glows */}
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(200,80,255,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] translate-x-1/2 translate-y-1/2 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(0,255,136,0.1) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <span className="card-glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono text-alien-green border border-alien-green/20 mb-6">
            💰 EARN UP TO 25% COMMISSION
          </span>

          <h1 className="font-display text-5xl md:text-7xl tracking-wider max-w-4xl mx-auto">
            JOIN THE UFO LABZ AFFILIATE PROGRAM
          </h1>

          <p className="text-lg text-muted max-w-2xl mx-auto mt-5 mb-8">
            Turn your audience into income. Share what you love, earn generous
            commissions, and grow alongside the most futuristic supplement brand
            in the galaxy.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/affiliate"
              className="btn-primary inline-flex items-center gap-2"
            >
              APPLY NOW
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="btn-outline inline-flex items-center gap-2"
            >
              LEARN MORE
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card-glass p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl md:text-4xl text-gradient-cosmic">
                  {stat.value}
                </div>
                <div className="text-xs font-mono text-muted uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        id="how-it-works"
        className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="font-display text-3xl md:text-5xl mb-12 text-center">
          HOW IT WORKS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="card-glass p-8 text-center relative">
                {/* Step badge */}
                <span className="absolute top-4 right-4 w-8 h-8 rounded-full bg-nebula-800/50 border border-nebula-600/30 flex items-center justify-center font-mono text-xs text-nebula-400">
                  {idx + 1}
                </span>

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{
                    background:
                      'linear-gradient(135deg, #7B2FBE 0%, #00FF88 100%)',
                  }}
                >
                  <Icon className="w-6 h-6 text-space-950" />
                </div>

                <h3 className="font-display text-xl tracking-wider mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl md:text-5xl mb-12 text-center">
          WHY PARTNER WITH US
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="card-glass p-6 hover:border-nebula-600/30 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-nebula-400 group-hover:text-alien-green transition-colors" />
                </div>
                <h3 className="font-display text-lg tracking-wider mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Commission Tiers ── */}
      <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl md:text-5xl mb-12 text-center">
          COMMISSION TIERS
        </h2>

        <div className="card-glass p-1 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-space-800/80">
              <tr>
                <th className="text-xs font-mono uppercase tracking-wider text-muted py-4 px-6">
                  Tier
                </th>
                <th className="text-xs font-mono uppercase tracking-wider text-muted py-4 px-6">
                  Monthly Sales
                </th>
                <th className="text-xs font-mono uppercase tracking-wider text-muted py-4 px-6">
                  Commission
                </th>
                <th className="text-xs font-mono uppercase tracking-wider text-muted py-4 px-6">
                  Bonus
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {tiers.map((tier) => (
                <tr
                  key={tier.name}
                  className={tier.highlighted ? 'bg-nebula-800/20' : ''}
                >
                  <td className="py-4 px-6 font-mono text-sm text-white">
                    <span className="inline-flex items-center gap-1.5">
                      {tier.name}
                      {tier.highlighted && (
                        <Sparkles className="w-4 h-4 text-nebula-400" />
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-muted">{tier.sales}</td>
                  <td className="py-4 px-6 text-sm text-alien-green font-mono">
                    {tier.commission}
                  </td>
                  <td className="py-4 px-6 text-sm text-muted">{tier.bonus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 md:py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="card-glass p-12 text-center relative overflow-hidden">
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(200,80,255,0.1) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10">
            <h2 className="font-display text-4xl md:text-5xl tracking-wider mb-4">
              READY TO START EARNING?
            </h2>
            <p className="text-muted mb-8">
              Join hundreds of affiliates already earning with UFO LABZ
            </p>
            <Link
              href="/affiliate"
              className="btn-primary inline-flex items-center text-lg px-8 py-4 gap-2"
            >
              BECOME AN AFFILIATE
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
