'use client'
// components/layout/Navbar.tsx
import Link from 'next/link'
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCartCount, useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/products',   label: 'Shop' },
  { href: '/products?category=creatine', label: 'Creatine' },
  { href: '/products?category=pre-workout', label: 'Pre Workout' },
  { href: '/products?category=amino-acids', label: 'Aminos' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = useCartCount()
  const openCart  = useCartStore((s) => s.openCart)
  const { user }  = useAuthStore()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-space-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-alien-green/20 border border-alien-green/40 flex items-center justify-center group-hover:shadow-glow-green transition-all duration-300">
                <span className="text-alien-green text-xs font-bold font-mono">U</span>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-alien-green animate-pulse-glow" />
            </div>
            <span className="font-display text-xl tracking-wider text-white group-hover:text-alien-green transition-colors">
              UFO LABZ
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              href={user ? '/account' : '/login'}
              className="p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label={user ? 'Account' : 'Sign in'}
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label={`Cart (${itemCount} items)`}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-alien-green text-space-900 text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-scale-in">
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
        <div className="md:hidden border-t border-white/5 bg-space-900/95 backdrop-blur-xl">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-muted hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/5">
              <Link
                href={user ? '/account' : '/login'}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-alien-green rounded-lg hover:bg-alien-green/5 transition-all"
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
