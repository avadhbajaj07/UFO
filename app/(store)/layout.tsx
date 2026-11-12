// app/(store)/layout.tsx
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
    <>
      <Navbar />
      <main className="min-h-screen pb-16 md:pb-0">{children}</main>
      <CartDrawer />
      <Footer />
    </>
  )
}
