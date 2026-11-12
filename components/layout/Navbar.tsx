'use client'
// components/layout/Navbar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, User, Search, Menu, X, Home, Compass, Zap } from 'lucide-react'
import { useState } from 'react'
import { useCartCount, useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { useCurrency } from '@/hooks/useCurrency'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/build-your-stack', label: 'Build Your Stack', badge: 'Save 15%' },
  { href: '/products', label: 'Shop' },
  { href: '/pages/about', label: 'About' },
  { href: '/pages/faq', label: 'FAQ' },
  { href: '/pages/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname() || ''
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = useCartCount()
  const openCart  = useCartStore((s) => s.openCart)
  const { user }  = useAuthStore()
  const { currency, setCurrency } = useCurrency()

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
                Batch 01 Pre-order
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium text-muted hover:text-white px-4 py-2 rounded-lg hover:bg-white/[0.04] transition-all duration-200 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-nebula-600 to-alien-green rounded-full group-hover:w-2/3 transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Currency Switcher (Mobile & Desktop) */}
              <button
                onClick={() => setCurrency(currency === 'CHF' ? 'EUR' : 'CHF', true)}
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
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>

              <Link
                href={user ? '/account' : '/login'}
                className="hidden md:flex p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
                aria-label={user ? 'Account' : 'Sign in'}
              >
                <User className="w-5 h-5" />
              </Link>

              <button
                onClick={openCart}
                className="hidden md:flex relative p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-space-900 text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-scale-in"
                        style={{ background: 'linear-gradient(135deg, #C850FF 0%, #00FF88 100%)' }}>
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
                  className="block px-4 py-3 text-sm font-medium text-muted hover:text-white hover:bg-white/[0.04] rounded-lg transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between px-4 py-2">
                <span className="text-xs text-muted font-mono">Currency</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrency('CHF', true)}
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
                    onClick={() => setCurrency('EUR', true)}
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
                  {user ? 'My Account' : 'Sign In'}
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
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-1 text-center transition-all duration-200 group relative",
              pathname === '/'
                ? "text-alien-green"
                : "text-gray-400 hover:text-white"
            )}
          >
            <div className="relative">
              <Home className={cn(
                "w-4 h-4 sm:w-5 sm:h-5 stroke-[1.3] transition-all duration-200 group-hover:scale-110",
                pathname === '/' && "drop-shadow-[0_0_8px_rgba(31,255,107,0.7)]"
              )} />
              {pathname === '/' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-alien-green shadow-[0_0_6px_#1fff6b]" />
              )}
            </div>
            <span className={cn(
              "text-[9px] font-mono tracking-wider transition-colors",
              pathname === '/' ? "font-bold text-alien-green" : "font-normal group-hover:text-white"
            )}>
              Home
            </span>
          </Link>

          {/* 2. Shop */}
          <Link
            href="/products"
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-1 text-center transition-all duration-200 group relative",
              pathname.startsWith('/products')
                ? "text-alien-green"
                : "text-gray-400 hover:text-white"
            )}
          >
            <div className="relative">
              <Compass className={cn(
                "w-4 h-4 sm:w-5 sm:h-5 stroke-[1.3] transition-all duration-200 group-hover:scale-110",
                pathname.startsWith('/products') && "drop-shadow-[0_0_8px_rgba(31,255,107,0.7)]"
              )} />
              {pathname.startsWith('/products') && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-alien-green shadow-[0_0_6px_#1fff6b]" />
              )}
            </div>
            <span className={cn(
              "text-[9px] font-mono tracking-wider transition-colors",
              pathname.startsWith('/products') ? "font-bold text-alien-green" : "font-normal group-hover:text-white"
            )}>
              Shop
            </span>
          </Link>

          {/* 3. Stack */}
          <Link
            href="/build-your-stack"
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-1 text-center transition-all duration-200 group relative",
              pathname === '/build-your-stack'
                ? "text-alien-green"
                : "text-gray-400 hover:text-white"
            )}
          >
            <div className="relative">
              <Zap className={cn(
                "w-4 h-4 sm:w-5 sm:h-5 stroke-[1.3] transition-all duration-200 group-hover:scale-110",
                pathname === '/build-your-stack' && "drop-shadow-[0_0_8px_rgba(31,255,107,0.7)]"
              )} />
              {pathname === '/build-your-stack' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-alien-green shadow-[0_0_6px_#1fff6b]" />
              )}
            </div>
            <span className={cn(
              "text-[9px] font-mono tracking-wider transition-colors",
              pathname === '/build-your-stack' ? "font-bold text-alien-green" : "font-normal group-hover:text-white"
            )}>
              Stack
            </span>
          </Link>

          {/* 4. Search */}
          <Link
            href="/search"
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-1 text-center transition-all duration-200 group relative",
              pathname === '/search'
                ? "text-alien-green"
                : "text-gray-400 hover:text-white"
            )}
          >
            <div className="relative">
              <Search className={cn(
                "w-4 h-4 sm:w-5 sm:h-5 stroke-[1.3] transition-all duration-200 group-hover:scale-110",
                pathname === '/search' && "drop-shadow-[0_0_8px_rgba(31,255,107,0.7)]"
              )} />
              {pathname === '/search' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-alien-green shadow-[0_0_6px_#1fff6b]" />
              )}
            </div>
            <span className={cn(
              "text-[9px] font-mono tracking-wider transition-colors",
              pathname === '/search' ? "font-bold text-alien-green" : "font-normal group-hover:text-white"
            )}>
              Search
            </span>
          </Link>

          {/* 5. Cart */}
          <button
            onClick={openCart}
            className="flex flex-col items-center justify-center gap-0.5 py-1 text-center transition-all duration-200 group relative text-gray-400 hover:text-alien-green active:scale-95"
            aria-label={`Cart (${itemCount} items)`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.3] transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(31,255,107,0.7)]" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 bg-alien-green text-space-950 text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(31,255,107,0.9)] animate-scale-in">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-mono tracking-wider transition-colors font-normal group-hover:text-alien-green">
              Cart
            </span>
          </button>
        </div>
      </nav>
    </>
  )
}
