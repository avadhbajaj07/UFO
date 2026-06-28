// components/layout/Footer.tsx
import Link from 'next/link'

const shopLinks = [
  { href: '/products', label: 'All Products' },
  { href: '/products?category=creatine', label: 'Creatine' },
  { href: '/products?category=pre-workout', label: 'Pre Workout' },
  { href: '/products?category=amino-acids', label: 'Amino Acids' },
  { href: '/products?category=special-edition', label: 'Special Edition' },
]

const companyLinks = [
  { href: '/pages/about', label: 'About UFO LABZ' },
  { href: '/pages/shipping', label: 'Shipping & Returns' },
  { href: '/pages/faq', label: 'FAQ' },
  { href: '/blog', label: 'Blog' },
  { href: '/account/affiliate', label: 'Affiliate Program' },
]

const contactInfo = [
  { label: 'support@ufolabz.com', href: 'mailto:support@ufolabz.com' },
  { label: '+41 00 000 00 00', href: 'tel:+41000000000' },
  { label: 'Zurich, Switzerland', href: '#' },
]

const socials = [
  { label: 'Instagram', icon: 'IG' },
  { label: 'Facebook', icon: 'FB' },
  { label: 'Twitter', icon: 'X' },
  { label: 'YouTube', icon: 'YT' },
]

const legalLinks = [
  { href: '/pages/privacy', label: 'Privacy Policy' },
  { href: '/pages/terms', label: 'Terms of Service' },
  { href: '/pages/refund', label: 'Refund Policy' },
  { href: '/pages/shipping', label: 'Shipping Info' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-space-900 mt-24 relative overflow-hidden">
      {/* Ambient purple glow */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] rounded-full opacity-[0.04] pointer-events-none"
           style={{ background: 'radial-gradient(circle, #7B2FBE, transparent 70%)' }} />
      <div className="absolute top-0 right-1/4 w-[400px] h-[250px] rounded-full opacity-[0.03] pointer-events-none"
           style={{ background: 'radial-gradient(circle, #00FF88, transparent 70%)' }} />

      {/* Main footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 rounded-full flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #7B2FBE 0%, #00FF88 100%)' }}>
                <span className="text-white text-sm font-bold font-mono">U</span>
              </div>
              <span className="font-display text-xl tracking-wider text-white">UFO LABZ</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed mb-5">
              Alien Performance Technology. Premium supplements engineered in Swiss laboratories for peak human performance.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <button
                  key={s.label}
                  className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-muted hover:text-white hover:border-nebula-600/40 hover:bg-nebula-800/30 transition-all duration-200 text-xs font-mono"
                  aria-label={s.label}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-gradient-to-r from-nebula-600 to-transparent" />
              Shop
            </h4>
            <ul className="space-y-2.5">
              {shopLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted hover:text-white hover:pl-1 transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-gradient-to-r from-nebula-600 to-transparent" />
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted hover:text-white hover:pl-1 transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-gradient-to-r from-nebula-600 to-transparent" />
              Contact
            </h4>
            <ul className="space-y-2.5 mb-6">
              {contactInfo.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-muted hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 flex-wrap">
              {['Visa', 'MC', 'TWINT', 'SEPA'].map((m) => (
                <span key={m} className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[10px] font-mono text-muted">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted/60">
            © {new Date().getFullYear()} UFO LABZ GmbH. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted/50 hover:text-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
