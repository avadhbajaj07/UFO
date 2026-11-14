import type { Metadata } from 'next'
import OrderPrintingSlip, { SAMPLE_REAL_ORDER_SLIP } from '@/components/OrderPrintingSlip'

export const metadata: Metadata = {
  title: 'Order Printing Slip | UFO LABZ SWISS',
  description: 'Official Swiss Post Priority packing slip and order manifest with real supplement products.',
  robots: { index: false, follow: false },
}

export default function PrintingSlipPage({
  searchParams,
}: {
  searchParams?: { mode?: 'a4' | 'thermal'; orderId?: string; view?: 'slip' | 'box_label' }
}) {
  const mode = searchParams?.mode === 'thermal' ? 'thermal' : 'a4'
  const initialDocType = searchParams?.view === 'box_label' ? 'box_label' : 'slip'

  return <OrderPrintingSlip orderData={SAMPLE_REAL_ORDER_SLIP} initialMode={mode} initialDocType={initialDocType} />
}
