import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | UFO LABZ',
  description: 'UFO LABZ Privacy Policy in compliance with Swiss DSG and General Data Protection Regulations.',
};

export default function PrivacyPage() {
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
            PRIVACY POLICY
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto">
            Your privacy is crucial to us. Learn how we handle your personal data.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
        <div className="card-glass p-8 space-y-6">
          <div>
            <h2 className="font-display text-2xl text-white mb-3">1. WHAT PERSONAL DATA WE COLLECT</h2>
            <p className="text-sm text-muted leading-relaxed">
              We collect information to provide better services to all our users. The types of personal data we collect include:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted">
              <li>Identity data: full name, contact information.</li>
              <li>Transaction data: shipping address, billing address, order details.</li>
              <li>Payment details: processed securely via Stripe (we do not store credit card details).</li>
              <li>Technical data: IP address, device specifications, cookie identifiers.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-white mb-3">2. WHY IT IS COLLECTED</h2>
            <p className="text-sm text-muted leading-relaxed">
              We process your data based on Swiss data protection laws (DSG) and General Data Protection Regulations:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted">
              <li>To execute contract obligations (fulfill orders, deliver supplements, process transactions).</li>
              <li>To improve our website performance, user experience, and product recommendations.</li>
              <li>To communicate order updates, shipping notifications, and marketing communications if opted-in.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-white mb-3">3. WHO WE SHARE DATA WITH</h2>
            <p className="text-sm text-muted leading-relaxed">
              We only share your information with trusted third-party services necessary for store operation:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted">
              <li><strong>Payment Processors:</strong> Stripe for secure transactions.</li>
              <li><strong>Logistics Partners:</strong> Swiss Post and DHL for priority shipping.</li>
              <li><strong>Hosting & Analytics:</strong> Vercel and Google Analytics.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-white mb-3">4. DATA RETENTION PERIOD</h2>
            <p className="text-sm text-muted leading-relaxed">
              We store transaction records and account details as required by Swiss tax law for up to 10 years. Marketing contact information is kept until you opt-out or request deletion.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-white mb-3">5. COOKIE USAGE</h2>
            <p className="text-sm text-muted leading-relaxed">
              We use cookies to maintain cart sessions, recognize logged-in states, and perform analytical statistics. You can configure your browser to reject cookies, though some features of the shop might be disabled.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-white mb-3">6. YOUR RIGHTS UNDER THE SWISS DSG</h2>
            <p className="text-sm text-muted leading-relaxed">
              You possess rights regarding your data: to request access, correction, transfer, or complete deletion of records. Direct all privacy inquiries and deletion requests to <strong>support@ufolabz.com</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-16">
        <p className="text-muted mb-4">Have questions about your data?</p>
        <Link href="/pages/contact" className="btn-outline">
          CONTACT SUPPORT
        </Link>
      </section>
    </div>
  );
}
