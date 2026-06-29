'use client'
// components/layout/Navbar.tsx
import Link from 'next/link'
import { ShoppingBag, User, Search, Menu, X, Globe, Settings } from 'lucide-react'
import { useState } from 'react'
import { useCartCount, useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/',         label: 'Home' },
  { href: '/products', label: 'Shop' },
  { href: '/pages/about', label: 'About' },
  { href: '/pages/faq',   label: 'FAQ' },
  { href: '/pages/contact', label: 'Contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = useCartCount()
  const openCart  = useCartStore((s) => s.openCart)
  const { user }  = useAuthStore()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-space-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782711478/UFO_logo_horizontal_kr0e7j.jpg"
              alt="UFO LABZ"
              className="h-10 w-auto object-contain rounded-lg border border-white/5 opacity-90 group-hover:opacity-100 transition-opacity"
            />
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
          <div className="flex items-center gap-1">
            {/* Language */}
            <button
              className="hidden sm:flex items-center gap-1 px-2.5 py-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/[0.04] text-xs font-mono"
              aria-label="Language"
            >
              <Globe className="w-4 h-4" />
              <span>EN</span>
            </button>

            <Link
              href="/search"
              className="p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              href={user ? '/account' : '/login'}
              className="p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
              aria-label={user ? 'Account' : 'Sign in'}
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-space-900/95 backdrop-blur-xl">
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
            <div className="pt-2 border-t border-white/[0.06]">
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
  )
}
