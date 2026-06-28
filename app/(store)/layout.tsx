// app/(store)/layout.tsx
import { Providers } from '@/components/providers'
import Navbar from '@/components/layout/Navbar'
import CartDrawer from '@/components/cart/CartDrawer'
import Footer from '@/components/layout/Footer'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <CartDrawer />
      <Footer />
    </Providers>
  )
}
