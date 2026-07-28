import Link from 'next/link'
import type { Metadata } from 'next'
import { AlertTriangle, CheckCircle2, Globe, Truck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shipping & Returns | UFO LABZ',
  description:
    'UFO LABZ shipping times, delivery costs, and return policy for orders across Europe.',
}

const shippingZones = [
  {
    icon: Truck,
    title: 'Switzerland',
    badge: 'FREE DELIVERY',
    details: ['Free delivery', 'Typically arrives within 24 hours of dispatch', 'Tracked delivery'],
  },
  {
    icon: Globe,
    title: 'Portugal & Spain',
    badge: 'FREE DELIVERY',
    details: ['Free delivery', '5-7 business days', 'Tracked delivery'],
  },
  {
    icon: Globe,
    title: 'Rest of Europe',
    details: ['Standard delivery from CHF 12.90', '5-7 business days', 'Tracked delivery'],
  },
]

export default function ShippingPage() {
  return (
    <div>
      <section className="relative overflow-hidden pb-12 pt-28 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-nebula-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute left-1/4 top-20 h-[300px] w-[300px] rounded-full bg-nebula-800/20 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.3em] text-alien-green">
            SHIPPING &amp; RETURNS
          </p>
          <h1 className="font-display text-5xl tracking-wider text-white md:text-7xl">
            SHIPPING &amp; RETURNS
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            We ship from our European facility across Europe, with orders typically
            arriving within 24 hours of dispatch in supported regions.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-display text-3xl text-white">
          SHIPPING INFORMATION
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {shippingZones.map((zone) => (
            <div key={zone.title} className="card-glass relative p-6">
              {zone.badge && (
                <span className="absolute right-4 top-4 rounded-full border border-alien-green/20 bg-alien-green/10 px-2.5 py-0.5 font-mono text-[10px] text-alien-green">
                  {zone.badge}
                </span>
              )}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-nebula-600/20 bg-nebula-800/30">
                <zone.icon className="h-5 w-5 text-nebula-400" />
              </div>
              <h3 className="mb-3 font-display text-xl text-white">{zone.title}</h3>
              <ul className="space-y-2">
                {zone.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-alien-green" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="card-glass p-8">
          <h2 className="mb-6 font-display text-xl text-white">DELIVERY DETAILS</h2>
          <div className="space-y-4">
            {[
              'Order tracking is sent by email once your package ships.',
              'Orders placed before 2:00 PM CET are shipped the same business day.',
              'We ship Monday through Friday, excluding local public holidays.',
            ].map((detail) => (
              <div key={detail} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-alien-green" />
                <p className="text-sm text-muted">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-display text-3xl text-white">
          RETURNS &amp; REFUNDS
        </h2>
        <div className="card-glass mx-auto max-w-3xl p-8 text-center">
          <h3 className="text-gradient-cosmic mb-4 font-display text-2xl">
            No Refunds or Returns Policy
          </h3>
          <p className="text-sm leading-relaxed text-muted">
            All sales are final. We do not accept returns or issue refunds except in the
            case of products that arrive damaged, defective, or incorrect. If this applies
            to your order, contact support@ufolabz.com within 7 days of delivery with your
            order number and a clear photo of the issue. We will review and respond within
            24-48 hours.
          </p>
        </div>
      </section>

      <section className="mx-auto mb-16 max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="card-glass border-nebula-600/20 p-8">
          <div className="mb-5 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-mango-orange" />
            <h2 className="font-display text-lg text-white">IMPORTANT INFORMATION</h2>
          </div>
          <div className="space-y-3">
            {[
              'Supplements are final sale items and cannot be returned or refunded once processed.',
              'Any issues with damaged or incorrect items must be reported within 7 days of package delivery.',
              'Please include a clear photo of the packaging and items received when contacting support.',
            ].map((note) => (
              <div key={note} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-nebula-400" />
                <p className="text-sm text-muted">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 text-center">
        <p className="mb-4 text-muted">Need help?</p>
        <Link href="/pages/contact" className="btn-outline">
          CONTACT OUR TEAM
        </Link>
      </section>
    </div>
  )
}
