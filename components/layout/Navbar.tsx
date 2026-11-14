'use client'

import { usePathname } from 'next/navigation'
import { ShoppingBag, User, Search, Menu, X, Home, Compass, Zap, Globe, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useCartCount, useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { useTranslation, Link, LOCALES, LOCALE_METAS, Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import FxLink from '@/components/alien-fx/FxLink'
import { playAlienFx } from '@/components/alien-fx/alien-fx'

export default function Navbar() {
  const pathname = usePathname() || ''
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  const itemCount = useCartCount()
  const openCart = useCartStore((s) => s.openCart)
  const { user } = useAuthStore()
  const { t, locale, setLocale, currency, setCurrency } = useTranslation()

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { href: '/', label: t('navbar.home') },
    { href: '/build-your-stack', label: t('navbar.build_stack'), badge: t('navbar.save_stack_badge') },
    { href: '/products', label: t('navbar.shop') },
    { href: '/tools', label: t('navbar.tools'), badge: t('navbar.free_badge') },
    { href: '/pages/about', label: t('navbar.about') },
    { href: '/pages/faq', label: t('navbar.faq') },
    { href: '/pages/contact', label: t('navbar.contact') },
  ]

  const currentMeta = LOCALE_METAS[locale] || LOCALE_METAS.fr

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-space-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <img
                src="/images/ufo-logo-new.png"
                alt="UFO LABZ"
                className="h-7 sm:h-8 md:h-9 w-auto object-contain opacity-95 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_12px_rgba(31,255,107,0.25)]"
              />
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-alien-green/20 border border-alien-green/50 text-alien-green text-[10px] font-mono font-bold uppercase tracking-wider">
                {t('common.batch_badge')}
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium text-muted hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/[0.04] transition-all duration-200 group flex items-center gap-1.5"
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-full bg-alien-green/20 border border-alien-green/40 text-alien-green tracking-wider">
                      {link.badge}
                    </span>
                  )}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-nebula-600 to-alien-green rounded-full group-hover:w-2/3 transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Actions: Switchers & Icons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Language Switcher (Desktop & Mobile) */}
              <div className="relative" ref={langRef}>
                <button
                  type="button"
                  onClick={() => setLangOpen(!langOpen)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-alien-green/50 text-[11px] font-mono font-bold text-gray-300 hover:text-white transition-all"
                  aria-label="Select Language"
                >
                  <span>{currentMeta.flag}</span>
                  <span className="uppercase">{locale}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {langOpen && (
                  <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-space-900 border border-white/10 shadow-2xl py-1 z-50 backdrop-blur-xl animate-fade-in">
                    {LOCALES.map((loc) => {
                      const meta = LOCALE_METAS[loc]
                      const isActive = loc === locale
                      return (
                        <button
                          key={loc}
                          onClick={() => {
                            setLocale(loc)
                            setLangOpen(false)
                          }}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 text-xs font-mono transition-colors text-left',
                            isActive
                              ? 'bg-alien-green/10 text-alien-green font-bold'
                              : 'text-gray-300 hover:bg-white/5 hover:text-white'
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <span>{meta.flag}</span>
                            <span>{meta.nativeName}</span>
                          </span>
                          <span className="text-[10px] uppercase text-gray-500 font-bold">{loc}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Currency Switcher (🇨🇭 CHF | 🇪🇺 EUR) */}
              <button
                type="button"
                onClick={() => setCurrency(currency === 'CHF' ? 'EUR' : 'CHF')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-alien-green/50 text-[11px] font-mono font-bold text-gray-300 hover:text-white transition-all"
                title={`Active currency: ${currency}. Click to switch to ${currency === 'CHF' ? 'EUR' : 'CHF'}.`}
              >
                <span>{currency === 'CHF' ? '🇨🇭' : '🇪🇺'}</span>
                <span>{currency}</span>
              </button>

              {/* Desktop-only Action Buttons */}
              <Link
                href="/search"
                className="hidden md:flex p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
                aria-label={t('navbar.search')}
              >
                <Search className="w-5 h-5" />
              </Link>

              <Link
                href={user ? '/account' : '/login'}
                className="hidden md:flex p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
                aria-label={user ? t('navbar.account') : t('auth.sign_in_btn')}
              >
                <User className="w-5 h-5" />
              </Link>

              <button
                onClick={openCart}
                className="hidden md:flex relative p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
                aria-label={`${t('navbar.cart')} (${itemCount} items)`}
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-space-900 text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-scale-in"
                    style={{ background: 'linear-gradient(135deg, #C850FF 0%, #00FF88 100%)' }}
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-muted hover:text-white transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-space-900/95 backdrop-blur-xl animate-fade-in">
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-sm font-medium text-muted hover:text-white hover:bg-white/[0.04] rounded-lg transition-all"
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-alien-green/20 border border-alien-green/40 text-alien-green tracking-wider">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* Language Selection in Mobile Menu */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between px-4 py-2">
                <span className="text-xs text-muted font-mono flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Language
                </span>
                <div className="flex gap-1">
                  {LOCALES.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocale(loc)
                        setMobileOpen(false)
                      }}
                      className={cn(
                        'px-2 py-1 rounded text-xs font-mono font-bold transition-all',
                        locale === loc
                          ? 'bg-alien-green text-space-950'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      )}
                    >
                      {LOCALE_METAS[loc].flag} {loc.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency Selection in Mobile Menu */}
              <div className="border-t border-white/[0.06] flex items-center justify-between px-4 py-2">
                <span className="text-xs text-muted font-mono">Currency</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrency('CHF')}
                    className={cn(
                      'px-2.5 py-1 rounded text-xs font-mono font-bold transition-all',
                      currency === 'CHF'
                        ? 'bg-alien-green text-space-950'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    )}
                  >
                    🇨🇭 CHF
                  </button>
                  <button
                    onClick={() => setCurrency('EUR')}
                    className={cn(
                      'px-2.5 py-1 rounded text-xs font-mono font-bold transition-all',
                      currency === 'EUR'
                        ? 'bg-alien-green text-space-950'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    )}
                  >
                    🇪🇺 EUR
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href={user ? '/account' : '/login'}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium rounded-lg transition-all text-gradient-cosmic"
                >
                  {user ? t('account.title') : t('auth.sign_in_btn')}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ── Fixed Mobile Bottom App Navigation Stripe ── */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#06080D]/95 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-8px_30px_rgba(0,0,0,0.6)] before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-alien-green/35 before:to-transparent"
        style={{ paddingBottom: 'max(0.4rem, env(safe-area-inset-bottom))' }}
      >
        <div className="grid grid-cols-5 items-center justify-around px-2 pt-1.5 pb-1">
          {/* 1. Home */}
          <FxLink
            href="/"
            fx="lite"
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 py-1 text-center transition-all duration-200 group relative',
              pathname === '/' ? 'text-alien-green' : 'text-gray-400 hover:text-white'
            )}
          >
            <span data-afx-icon className="relative">
              <Home
                className={cn(
                  'w-4 h-4 sm:w-5 sm:h-5 stroke-[1.3] transition-all duration-200 group-hover:scale-110',
                  pathname === '/' && 'drop-shadow-[0_0_8px_rgba(31,255,107,0.7)]'
                )}
              />
              {pathname === '/' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-alien-green shadow-[0_0_6px_#1fff6b]" />
              )}
            </span>
            <span
              className={cn(
                'text-[9px] font-mono tracking-wider transition-colors',
                pathname === '/' ? 'font-bold text-alien-green' : 'font-normal group-hover:text-white'
              )}
            >
              {t('navbar.home')}
            </span>
          </FxLink>

          {/* 2. Shop */}
          <FxLink
            href="/products"
            fx="lite"
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 py-1 text-center transition-all duration-200 group relative',
              pathname.includes('/products') ? 'text-alien-green' : 'text-gray-400 hover:text-white'
            )}
          >
            <span data-afx-icon className="relative">
              <Compass
                className={cn(
                  'w-4 h-4 sm:w-5 sm:h-5 stroke-[1.3] transition-all duration-200 group-hover:scale-110',
                  pathname.includes('/products') && 'drop-shadow-[0_0_8px_rgba(31,255,107,0.7)]'
                )}
              />
              {pathname.includes('/products') && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-alien-green shadow-[0_0_6px_#1fff6b]" />
              )}
            </span>
            <span
              className={cn(
                'text-[9px] font-mono tracking-wider transition-colors',
                pathname.includes('/products') ? 'font-bold text-alien-green' : 'font-normal group-hover:text-white'
              )}
            >
              {t('navbar.shop')}
            </span>
          </FxLink>

          {/* 3. Stack */}
          <FxLink
            href="/build-your-stack"
            fx="lite"
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 py-1 text-center transition-all duration-200 group relative',
              pathname.includes('/build-your-stack') ? 'text-alien-green' : 'text-gray-400 hover:text-white'
            )}
          >
            <span data-afx-icon className="relative">
              <Zap
                className={cn(
                  'w-4 h-4 sm:w-5 sm:h-5 stroke-[1.3] transition-all duration-200 group-hover:scale-110',
                  pathname.includes('/build-your-stack') && 'drop-shadow-[0_0_8px_rgba(31,255,107,0.7)]'
                )}
              />
              {pathname.includes('/build-your-stack') && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-alien-green shadow-[0_0_6px_#1fff6b]" />
              )}
            </span>
            <span
              className={cn(
                'text-[9px] font-mono tracking-wider transition-colors',
                pathname.includes('/build-your-stack') ? 'font-bold text-alien-green' : 'font-normal group-hover:text-white'
              )}
            >
              Stack
            </span>
          </FxLink>

          {/* 4. Search */}
          <FxLink
            href="/search"
            fx="lite"
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 py-1 text-center transition-all duration-200 group relative',
              pathname.includes('/search') ? 'text-alien-green' : 'text-gray-400 hover:text-white'
            )}
          >
            <span data-afx-icon className="relative">
              <Search
                className={cn(
                  'w-4 h-4 sm:w-5 sm:h-5 stroke-[1.3] transition-all duration-200 group-hover:scale-110',
                  pathname.includes('/search') && 'drop-shadow-[0_0_8px_rgba(31,255,107,0.7)]'
                )}
              />
              {pathname.includes('/search') && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-alien-green shadow-[0_0_6px_#1fff6b]" />
              )}
            </span>
            <span
              className={cn(
                'text-[9px] font-mono tracking-wider transition-colors',
                pathname.includes('/search') ? 'font-bold text-alien-green' : 'font-normal group-hover:text-white'
              )}
            >
              {t('navbar.search')}
            </span>
          </FxLink>

          {/* 5. Cart */}
          <button
            onClick={(e) => {
              const icon = e.currentTarget.querySelector<HTMLElement>('[data-afx-icon]') ?? e.currentTarget
              const r = icon.getBoundingClientRect()
              playAlienFx(r.left + r.width / 2, r.top + r.height / 2, 'lite', icon)
              openCart()
            }}
            className="flex flex-col items-center justify-center gap-0.5 py-1 text-center transition-all duration-200 group relative text-gray-400 hover:text-alien-green active:scale-95"
            aria-label={`${t('navbar.cart')} (${itemCount} items)`}
          >
            <span data-afx-icon className="relative">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.3] transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(31,255,107,0.7)]" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 bg-alien-green text-space-950 text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(31,255,107,0.9)] animate-scale-in">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </span>
            <span className="text-[9px] font-mono tracking-wider transition-colors font-normal group-hover:text-alien-green">
              {t('navbar.cart')}
            </span>
          </button>
        </div>
      </nav>
    </>
  )
}
