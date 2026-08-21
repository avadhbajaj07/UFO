// app/(store)/layout.tsx
import { Providers } from '@/components/providers'
import Navbar from '@/components/layout/Navbar'
import CartDrawer from '@/components/cart/CartDrawer'
import Footer from '@/components/layout/Footer'
import ComingSoon from '@/components/ComingSoon'

// ── Temporary Coming Soon Flag ──────────────────────────────────────────
// Set this to `false` when you are ready to make the full website live.
const COMING_SOON = true

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
