import RefundClient from '@/components/legal/RefundClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund & Returns Policy | UFO LABZ Switzerland',
  description: '100% full money-back guarantee on all Batch 01 pre-orders prior to dispatch. Learn about our hygienic dietary supplement policies.',
}

export default function RefundPage() {
  return <RefundClient />
}
