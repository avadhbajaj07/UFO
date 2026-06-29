import Link from 'next/link';
import type { Metadata } from 'next';
import { Truck, Globe, Send, CheckCircle2, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Returns | UFO LABZ',
  description:
    'Learn about UFO LABZ shipping zones, delivery times, and our final sale returns policy.',
};

export default function ShippingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-28 pb-12 text-center relative overflow-hidden">
        {/* Nebula glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-nebula-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-nebula-800/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-alien-green mb-4">
            POLICIES
          </p>
          <h1 className="font-display text-5xl md:text-7xl tracking-wider text-white mb-4">
            SHIPPING &amp; RETURNS
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto">
            Fast, reliable shipping across the globe — and a hassle-free return
            policy so you can shop with confidence.
          </p>
        </div>
      </section>

      {/* Shipping Zones */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-3xl text-white mb-8 text-center">
          SHIPPING INFORMATION
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Switzerland */}
          <div className="card-glass p-6 relative">
            <span className="absolute top-4 right-4 text-[10px] font-mono bg-alien-green/10 text-alien-green border border-alien-green/20 rounded-full px-2.5 py-0.5">
              MOST POPULAR
            </span>
            <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mb-4">
              <Truck className="w-5 h-5 text-nebula-400" />
            </div>
            <h3 className="font-display text-xl text-white mb-3">Switzerland</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-alien-green shrink-0" />
                Free over CHF 99
              </li>
              <li className="text-sm text-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-alien-green shrink-0" />
                CHF 7.90 flat rate
              </li>
              <li className="text-sm text-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-alien-green shrink-0" />
                2–3 business days
              </li>
            </ul>
          </div>

          {/* EU Countries */}
          <div className="card-glass p-6">
            <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mb-4">
              <Globe className="w-5 h-5 text-nebula-400" />
            </div>
            <h3 className="font-display text-xl text-white mb-3">EU Countries</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-alien-green shrink-0" />
                From CHF 12.90
              </li>
              <li className="text-sm text-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-alien-green shrink-0" />
                5–7 business days
              </li>
              <li className="text-sm text-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-alien-green shrink-0" />
                Tracked delivery
              </li>
            </ul>
          </div>

          {/* International */}
          <div className="card-glass p-6">
            <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mb-4">
              <Send className="w-5 h-5 text-nebula-400" />
            </div>
            <h3 className="font-display text-xl text-white mb-3">International</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-alien-green shrink-0" />
                From CHF 19.90
              </li>
              <li className="text-sm text-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-alien-green shrink-0" />
                7–14 business days
              </li>
              <li className="text-sm text-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-alien-green shrink-0" />
                Express available
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Delivery Details */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-glass p-8">
          <h3 className="font-display text-xl text-white mb-6">DELIVERY DETAILS</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-alien-green shrink-0 mt-0.5" />
              <p className="text-sm text-muted">
                Orders placed before 2:00 PM CET are shipped the same business day
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-alien-green shrink-0 mt-0.5" />
              <p className="text-sm text-muted">
                All orders include tracking via Swiss Post or DHL
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-alien-green shrink-0 mt-0.5" />
              <p className="text-sm text-muted">
                Signature may be required for orders over CHF 200
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-alien-green shrink-0 mt-0.5" />
              <p className="text-sm text-muted">
                We ship Monday through Friday, excluding Swiss public holidays
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Returns Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-3xl text-white mb-8 text-center">
          RETURNS &amp; REFUNDS
        </h2>
        <div className="card-glass p-8 text-center max-w-3xl mx-auto">
          <h3 className="text-gradient-cosmic font-display text-2xl mb-4">
            No Refunds or Returns Policy
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-4">
            All sales are final. We do not accept returns or issue refunds except in the case of products that arrive damaged, defective, or incorrect. If this applies to your order, contact support@ufolabz.com within 7 days of delivery with your order number and a clear photo of the issue. We will review and respond within 24–48 hours.
          </p>
        </div>
      </section>

      {/* Important Notes */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
        <div className="card-glass p-8 border-nebula-600/20">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="w-5 h-5 text-mango-orange" />
            <h3 className="font-display text-lg text-white">
              IMPORTANT INFORMATION
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-nebula-400 shrink-0 mt-1.5" />
              <p className="text-sm text-muted">
                Supplements are final sale items and cannot be returned or refunded once processed.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-nebula-400 shrink-0 mt-1.5" />
              <p className="text-sm text-muted">
                Any issues with damaged or incorrect items must be reported within 7 days of package delivery.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-nebula-400 shrink-0 mt-1.5" />
              <p className="text-sm text-muted">
                Please include a clear photo of the packaging and items received when contacting support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-16">
        <p className="text-muted mb-4">Need help with a return?</p>
        <Link href="/pages/contact" className="btn-outline">
          CONTACT SUPPORT
        </Link>
      </section>
    </div>
  );
}
