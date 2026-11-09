// app/(store)/layout.tsx
import { Providers } from '@/components/providers'
import Navbar from '@/components/layout/Navbar'
import CartDrawer from '@/components/cart/CartDrawer'
import Footer from '@/components/layout/Footer'
import ComingSoon from '@/components/ComingSoon'

// ── Pre-launch Coming Soon Flag ──────────────────────────────────────────
// Set to `false` for LIVE PRE-ORDER store.
const COMING_SOON = false

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  if (COMING_SOON) {
    return <ComingSoon />
  }

  return (
    <Providers>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <CartDrawer />
      <Footer />
    </Providers>
  )
}
