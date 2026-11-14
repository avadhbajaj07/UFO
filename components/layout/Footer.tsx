'use client'

import { useTranslation, Link } from '@/lib/i18n'

export default function Footer() {
  const { t, locale } = useTranslation()

  const shopLinks = [
    { href: '/products', label: t('navbar.shop') },
    { href: '/build-your-stack', label: `${t('navbar.build_stack')} (${t('navbar.save_stack_badge')})` },
    { href: '/products/category/creatine', label: 'Creatine' },
    { href: '/products/category/pre-workout', label: 'Pre-Workout' },
    { href: '/products/category/amino-acids', label: 'Amino Acids' },
    { href: '/products/category/magnesium', label: 'Magnesium' },
    { href: '/products/category/marine-collagen', label: 'Marine Collagen' },
  ]

  const companyLinks = [
    { href: '/pages/about', label: t('footer.about_link') },
    { href: '/pages/shipping', label: t('footer.shipping_link') },
    { href: '/pages/faq', label: t('footer.faq_link') },
    { href: '/pages/contact', label: t('footer.contact_link') },
    { href: '/affiliate', label: 'Ambassador Team' },
  ]

  // Complete list of ALL 10 science-backed calculators
  const toolsLinks = [
    { href: '/tools', label: t('footer.all_calculators') },
    { href: '/tools/protein-calculator', label: t('footer.protein_calc') },
    { href: '/tools/tdee-calculator', label: t('footer.tdee_calc') },
    { href: '/tools/macro-calculator', label: t('footer.macro_calc') },
    { href: '/tools/bmi-calculator', label: t('footer.bmi_calc') },
    { href: '/tools/body-fat-calculator', label: t('footer.bodyfat_calc') },
    { href: '/tools/lean-body-mass-calculator', label: t('footer.lbm_calc') },
    { href: '/tools/one-rep-max-calculator', label: t('footer.orm_calc') },
    { href: '/tools/water-intake-calculator', label: t('footer.water_calc') },
    { href: '/tools/calorie-deficit-calculator', label: t('footer.deficit_calc') },
    { href: '/tools/creatine-calculator', label: t('footer.creatine_calc') },
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
    { href: '/pages/pre-order', label: t('footer.preorder_policy') },
    { href: '/pages/privacy', label: t('footer.privacy_policy') },
    { href: '/pages/terms', label: t('footer.terms_policy') },
    { href: '/pages/refund', label: t('footer.refund_policy') },
    { href: '/pages/shipping', label: t('footer.shipping_link') },
  ]

  return (
    <footer className="border-t border-white/[0.06] bg-space-900 mt-24 relative overflow-hidden pb-16 md:pb-0">
      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-1/4 w-[500px] h-[300px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7B2FBE, transparent 70%)' }}
      />
      <div
        className="absolute top-0 right-1/4 w-[400px] h-[250px] rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00FF88, transparent 70%)' }}
      />

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
              {t('footer.tagline')}
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
              {t('footer.shop_heading')}
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

          {/* All 10 Calculators Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-alien-green mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-gradient-to-r from-alien-green to-transparent" />
              {t('footer.tools_heading')}
            </h4>
            <ul className="space-y-2">
              {toolsLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs text-muted hover:text-white hover:pl-1 transition-all duration-200"
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
              {t('footer.company_heading')}
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
              {t('navbar.contact')}
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
                <span
                  key={m}
                  className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[10px] font-mono text-muted"
                >
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
            {t('footer.copyright', { year: new Date().getFullYear() })}
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
