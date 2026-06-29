import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | UFO LABZ',
  description: 'Learn about the UFO LABZ Refund and Returns Policy. All sales are final with exceptions for damaged items.',
};

export default function RefundPage() {
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
            REFUND POLICY
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto">
            Please review our refund parameters. All sales are final.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
        <div className="card-glass p-8 space-y-6">
          <div>
            <h2 className="font-display text-2xl text-white mb-3">NO REFUNDS OR RETURNS</h2>
            <p className="text-sm text-muted leading-relaxed">
              We operate under a strict <strong>No Refunds and No Returns</strong> policy on all orders. All sales of supplement cargo are final.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-white mb-3">EXCEPTIONS FOR DAMAGE &amp; ISSUES</h2>
            <p className="text-sm text-muted leading-relaxed">
              The sole exception to this policy is if a product arrives <strong>damaged, defective, or incorrect</strong> (wrong item dispatched).
            </p>
            <p className="text-sm text-muted leading-relaxed mt-2">
              In these cases, the customer must contact our support center at <strong>support@ufolabz.com</strong> within 7 days of package delivery. You must include:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted">
              <li>Your order reference number (e.g. #UFO-CH-XXXXX).</li>
              <li>A clear photograph demonstrating the damage or the wrong item received.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-white mb-3">HYGIENE &amp; SAFETY PARAMETERS</h2>
            <p className="text-sm text-muted leading-relaxed">
              Products that have been opened, unsealed, or used cannot be returned or refunded under any circumstances due to strict health, safety, and hygiene standards.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-white mb-3">REFUND PROCESSING TIME</h2>
            <p className="text-sm text-muted leading-relaxed">
              If your claim for a damaged or incorrect item is approved, UFO LABZ will either ship a replacement unit or issue a refund. Refunds are credited back to the original payment method within 5–7 business days.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-16">
        <p className="text-muted mb-4">Need to report a delivery issue?</p>
        <Link href="/pages/contact" className="btn-outline">
          CONTACT SUPPORT
        </Link>
      </section>
    </div>
  );
}
