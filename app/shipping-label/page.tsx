import type { Metadata } from 'next'
import SwissPostBoxLabel, { SAMPLE_REAL_BOX_LABEL } from '@/components/SwissPostBoxLabel'

export const metadata: Metadata = {
  title: 'Swiss Post Box Shipping Label | UFO LABZ SWISS',
  description: 'Official Swiss Post shipping box label with sorting QR code, tracking barcode and customer address.',
  robots: { index: false, follow: false },
}

export default function ShippingLabelPage({
  searchParams,
}: {
  searchParams?: { format?: 'thermal' | 'a4'; orderId?: string }
}) {
  const format = searchParams?.format === 'a4' ? 'a4' : 'thermal'

  return <SwissPostBoxLabel data={SAMPLE_REAL_BOX_LABEL} initialFormat={format} />
}
