import ShippingClient from '@/components/shipping/ShippingClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping & Delivery Rates | UFO LABZ Switzerland',
  description:
    'Free delivery across Switzerland on orders from CHF 75, and across Europe from €50. Learn about dispatch times and pre-order delivery policies.',
}

export default function ShippingPage() {
  return <ShippingClient />
}
