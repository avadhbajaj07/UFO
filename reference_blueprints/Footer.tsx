// components/layout/Footer.tsx
import Link from 'next/link'

const links = {
  Shop: [
    { href: '/products', label: 'All Products' },
    { href: '/products?category=creatine', label: 'Creatine' },
    { href: '/products?category=pre-workout', label: 'Pre Workout' },
    { href: '/products?category=amino-acids', label: 'Amino Acids' },
    { href: '/products?category=special-edition', label: 'Special Edition' },
  ],
  Account: [
    { href: '/account', label: 'My Account' },
    { href: '/account/orders', label: 'Orders' },
    { href: '/account/subscriptions', label: 'Subscriptions' },
    { href: '/account/loyalty', label: 'Alien Points' },
    { href: '/account/affiliate', label: 'Affiliate Program' },
  ],
  Info: [
    { href: '/pages/about', label: 'About UFO LABZ' },
    { href: '/pages/shipping', label: 'Shipping & Returns' },
    { href: '/pages/faq', label: 'FAQ' },
    { href: '/blog', label: 'Blog' },
    { href: 'mailto:support@ufolabz.com', label: 'Contact Us' },
  ],
  Legal: [
    { href: '/pages/privacy', label: 'Privacy Policy' },
    { href: '/pages/terms', label: 'Terms of Service' },
    { href: '/pages/imprint', label: 'Imprint' },
    { href: '/pages/cookies', label: 'Cookie Policy' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-space-900 mt-24">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-full bg-alien-green/20 border border-alien-green/40 flex items-center justify-center">
                <span className="text-alien-green text-xs font-bold font-mono">U</span>
              </div>
              <span className="font-display text-lg tracking-wider text-white">UFO LABZ</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Alien Performance Technology. Premium supplements engineered for peak human performance.
            </p>
            <p className="text-xs text-muted/60">
              Manufactured in Switzerland.<br />
              Third-party tested for purity.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">{section}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted/60">
            © {new Date().getFullYear()} UFO LABZ GmbH. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted/60">
            <span>🇨🇭 Switzerland</span>
            <span>CHF</span>
            <span>VAT incl.</span>
            <div className="flex gap-2">
              {['Visa', 'MC', 'TWINT', 'SEPA'].map((m) => (
                <span key={m} className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-mono">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
