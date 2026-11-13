// components/layout/Footer.tsx
import Link from 'next/link'

const shopLinks = [
  { href: '/products', label: 'All Products' },
  { href: '/build-your-stack', label: 'Build Your Stack (Save 15%)' },
  { href: '/products/category/creatine', label: 'Creatine' },
  { href: '/products/category/pre-workout', label: 'Pre Workout' },
  { href: '/products/category/amino-acids', label: 'Amino Acids' },
  { href: '/products/category/magnesium', label: 'Magnesium' },
  { href: '/products/category/marine-collagen', label: 'Marine Collagen' },
]

const companyLinks = [
  { href: '/pages/about', label: 'About UFO LABZ' },
  { href: '/pages/shipping', label: 'Shipping & Returns' },
  { href: '/pages/faq', label: 'FAQ' },
  { href: '/pages/contact', label: 'Contact' },
]

const toolsLinks = [
  { href: '/tools', label: 'All 10 Calculators' },
  { href: '/tools/protein-calculator', label: 'Protein Calculator' },
  { href: '/tools/tdee-calculator', label: 'TDEE & Calories' },
  { href: '/tools/macro-calculator', label: 'Macronutrient Split' },
  { href: '/tools/bmi-calculator', label: 'BMI Calculator' },
  { href: '/tools/body-fat-calculator', label: 'Body Fat %' },
  { href: '/tools/one-rep-max-calculator', label: '1RM Calculator' },
  { href: '/tools/creatine-calculator', label: 'Creatine Dosage' },
]

const contactInfo = [
  { label: 'support@ufolabz.com', href: 'mailto:support@ufolabz.com' },
]

const socials = [
  { label: 'Instagram', icon: 'IG', href: 'https://www.instagram.com/ufolabz_official?igsi=NGR1YWNzcDBhdGx3' },
  { label: 'Facebook', icon: 'FB', href: 'https://facebook.com/ufolabz' },
  { label: 'YouTube', icon: 'YT', href: 'https://youtube.com/@ufolabz' },
]

const legalLinks = [
  { href: '/pages/pre-order', label: 'Pre-Order Policy' },
  { href: '/pages/privacy', label: 'Privacy Policy' },
  { href: '/pages/terms', label: 'Terms of Service' },
  { href: '/pages/refund', label: 'Refund Policy' },
  { href: '/pages/shipping', label: 'Shipping Info' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-space-900 mt-24 relative overflow-hidden pb-16 md:pb-0">
      {/* Ambient purple glow */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] rounded-full opacity-[0.04] pointer-events-none"
           style={{ background: 'radial-gradient(circle, #7B2FBE, transparent 70%)' }} />
      <div className="absolute top-0 right-1/4 w-[400px] h-[250px] rounded-full opacity-[0.03] pointer-events-none"
           style={{ background: 'radial-gradient(circle, #00FF88, transparent 70%)' }} />

      {/* Main footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-1">
            <Link href="/" className="inline-flex items-center mb-5 group">
              <img
                src="/images/ufo-logo-new.png"
                alt="UFO LABZ"
                className="h-8 sm:h-9 md:h-10 w-auto object-contain opacity-95 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_15px_rgba(31,255,107,0.2)]"
              />
            </Link>
            <p className="text-sm text-muted leading-relaxed mb-5">
              Alien Performance Technology. Premium supplements engineered in Swiss laboratories for peak human performance.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-muted hover:text-white hover:border-nebula-600/40 hover:bg-nebula-800/30 transition-all duration-200 text-xs font-mono"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
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

          {/* Calculators & Tools Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-alien-green mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-gradient-to-r from-alien-green to-transparent" />
              Calculators
            </h4>
            <ul className="space-y-2.5">
              {toolsLinks.map((item) => (
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-muted/60 order-1 md:order-none">
            © {new Date().getFullYear()} UFO LABZ GmbH. All rights reserved.
          </p>

          <p className="text-xs text-muted/70 flex items-center justify-center gap-1.5 font-mono order-2 md:order-none">
            <span>Architected on Earth by</span>
            <a
              href="https://avadhbajaj.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-alien-green font-medium transition-all duration-200 inline-flex items-center gap-1 group hover:drop-shadow-[0_0_8px_rgba(31,255,107,0.6)]"
            >
              <span className="underline decoration-white/20 group-hover:decoration-alien-green underline-offset-4">
                Avadh Bajaj
              </span>
              <span className="text-sm transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 inline-block">
                🛸
              </span>
            </a>
          </p>

          <div className="flex items-center gap-6 flex-wrap justify-center order-3 md:order-none">
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
