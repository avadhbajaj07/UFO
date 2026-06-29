import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | UFO LABZ',
  description: 'Terms of Service for UFO LABZ online supplement store under Swiss jurisdiction.',
};

export default function TermsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-28 pb-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-nebula-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-alien-green mb-4">
            LEGAL
          </p>
          <h1 className="font-display text-5xl md:text-7xl tracking-wider text-white mb-4">
            TERMS OF SERVICE
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto">
            Please read these Terms of Service carefully before utilizing our orbital platform.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
        <div className="card-glass p-8 space-y-6">
          <div>
            <h2 className="font-display text-2xl text-white mb-3">1. COMPANY PROFILE &amp; JURISDICTION</h2>
            <p className="text-sm text-muted leading-relaxed">
              This website is operated by <strong>UFO LABZ GmbH</strong>, registered in Zurich, Switzerland. All relations are governed exclusively under Swiss Law. The place of jurisdiction is Zurich, Switzerland.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-white mb-3">2. ORDER PROCESS &amp; CONTRACT</h2>
            <p className="text-sm text-muted leading-relaxed">
              By placing an order via our online platform, you present a binding offer to purchase the selected supplements. The contract is officially executed only when we transmit an order dispatch confirmation or ship the products.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-white mb-3">3. PAYMENT OPTIONS &amp; CURRENCY</h2>
            <p className="text-sm text-muted leading-relaxed">
              All prices are listed in Swiss Francs (CHF) and include the legal value-added tax (VAT) of 8.1%. We accept Visa, Mastercard, TWINT, and other secure payment methods supported at checkout. Payments are securely encrypted and processed by Stripe.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-white mb-3">4. SHILLING &amp; DISPATCH ESTIMATES</h2>
            <p className="text-sm text-muted leading-relaxed">
              Deliveries within Switzerland generally take 2–3 business days. While we strive to meet all estimated shipping dates, delays from logistics providers (Swiss Post or DHL) are outside of our immediate control.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-white mb-3">5. NO-REFUNDS POLICY &amp; RETURNS</h2>
            <p className="text-sm text-muted leading-relaxed">
              All supplement sales are final. We do not accept returns or refunds unless an item arrives damaged, defective, or incorrect. For full return exceptions, consult our <Link href="/pages/refund" className="text-alien-green hover:underline">Refund Policy</Link>.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-white mb-3">6. DISCLAIMER OF WARRANTIES</h2>
            <p className="text-sm text-muted leading-relaxed">
              Our products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease. The details on this website are not medical advice. Consult a healthcare provider before starting any nutrition stack.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-white mb-3">7. LIMITATION OF LIABILITY</h2>
            <p className="text-sm text-muted leading-relaxed">
              To the fullest extent permitted by Swiss law, UFO LABZ GmbH excludes all liability for any direct, indirect, incidental, or consequential damages resulting from the use of our products or website.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-16">
        <p className="text-muted mb-4">Have questions about our terms?</p>
        <Link href="/pages/contact" className="btn-outline">
          CONTACT SUPPORT
        </Link>
      </section>
    </div>
  );
}
