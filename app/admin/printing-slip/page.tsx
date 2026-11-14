import type { Metadata } from 'next'
import OrderPrintingSlip, { SAMPLE_REAL_ORDER_SLIP, OrderSlipData } from '@/components/OrderPrintingSlip'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProductDisplayName } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Admin Order Printing Slip | UFO LABZ',
  description: 'Official Swiss Post shipping manifest and packing slip.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminPrintingSlipPage({
  searchParams,
}: {
  searchParams?: { orderId?: string; mode?: 'a4' | 'thermal'; view?: 'slip' | 'box_label' }
}) {
  const mode = searchParams?.mode === 'thermal' ? 'thermal' : 'a4'
  const initialDocType = searchParams?.view === 'box_label' ? 'box_label' : 'slip'
  const requestedId = searchParams?.orderId

  let orderData: OrderSlipData = SAMPLE_REAL_ORDER_SLIP

  if (requestedId && requestedId !== 'sample' && requestedId !== SAMPLE_REAL_ORDER_SLIP.orderNumber) {
    try {
      const supabaseAdmin = createAdminClient()
      const { data: dbOrder } = await supabaseAdmin
        .from('orders')
        .select('*, order_items(*)')
        .or(`id.eq.${requestedId},order_number.eq.${requestedId}`)
        .maybeSingle()

      if (dbOrder) {
        const addr = dbOrder.shipping_address || {}
        const items = Array.isArray(dbOrder.order_items) && dbOrder.order_items.length > 0
          ? dbOrder.order_items.map((it: any, idx: number) => ({
              name: getProductDisplayName(it.product_slug || it.name, it.name || 'UFO LABZ SUPPLEMENT'),
              sku: it.sku || `SKU-0${idx + 1}`,
              format: it.variant_name || it.size || '300g Poudre',
              flavor: it.flavor || 'Pur Neutre',
              batch: it.batch_number || 'CH-B01-GENEVA',
              expiry: it.expiry_date || '11/2028',
              binLocation: `SHELF-${String.fromCharCode(65 + (idx % 5))}${idx + 1}`,
              qty: it.quantity || 1,
              unitPrice: Number(it.unit_price || it.price || 29.93),
              total: Number(it.total_price || (it.quantity || 1) * (it.unit_price || it.price || 29.93)),
            }))
          : SAMPLE_REAL_ORDER_SLIP.items

        const totalAmount = Number(dbOrder.total_amount || dbOrder.total || 152.68)
        const subtotalAmount = Number(dbOrder.subtotal || totalAmount)
        const discountAmount = Number(dbOrder.discount_amount || 0)
        const vatAmount = Number((totalAmount - totalAmount / 1.081).toFixed(2))

        orderData = {
          ...SAMPLE_REAL_ORDER_SLIP,
          orderId: dbOrder.order_number ? `#${dbOrder.order_number.replace(/^#/, '')}` : `#${dbOrder.id.slice(0, 8).toUpperCase()}`,
          orderNumber: dbOrder.order_number || dbOrder.id,
          date: new Date(dbOrder.created_at || Date.now()).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          time: new Date(dbOrder.created_at || Date.now()).toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' }) + ' CET',
          paymentStatus: dbOrder.payment_status === 'paid' ? 'Payé en totalité (Validé)' : dbOrder.payment_status || 'Payé en totalité',
          paymentRef: dbOrder.stripe_session_id || dbOrder.payment_intent_id || 'Stripe Authenticated',
          carrier: {
            ...SAMPLE_REAL_ORDER_SLIP.carrier,
            trackingNumber: dbOrder.tracking_number || SAMPLE_REAL_ORDER_SLIP.carrier.trackingNumber,
            trackingUrl: dbOrder.tracking_url || SAMPLE_REAL_ORDER_SLIP.carrier.trackingUrl,
          },
          recipient: {
            name: addr.fullName || addr.name || dbOrder.customer_name || SAMPLE_REAL_ORDER_SLIP.recipient.name,
            company: addr.company || undefined,
            street: addr.addressLine1 || addr.street || addr.address || SAMPLE_REAL_ORDER_SLIP.recipient.street,
            zip: addr.zipCode || addr.postalCode || addr.zip || SAMPLE_REAL_ORDER_SLIP.recipient.zip,
            city: addr.city || SAMPLE_REAL_ORDER_SLIP.recipient.city,
            country: addr.country || SAMPLE_REAL_ORDER_SLIP.recipient.country,
            countryCode: addr.countryCode || 'CH',
            email: dbOrder.customer_email || SAMPLE_REAL_ORDER_SLIP.recipient.email,
            phone: addr.phone || dbOrder.customer_phone || SAMPLE_REAL_ORDER_SLIP.recipient.phone,
          },
          items,
          financials: {
            subtotal: subtotalAmount,
            preorderDiscount: discountAmount > 0 ? discountAmount : SAMPLE_REAL_ORDER_SLIP.financials.preorderDiscount,
            bundleDiscount: 0,
            shippingFee: Number(dbOrder.shipping_fee || 0),
            vatRate: 8.1,
            vatAmount,
            netAmount: Number((totalAmount - vatAmount).toFixed(2)),
            grandTotal: totalAmount,
            currency: dbOrder.currency?.toUpperCase() || 'CHF',
          },
        }
      }
    } catch (err) {
      console.error('Failed to load order for printing slip, falling back to sample:', err)
    }
  }

  return <OrderPrintingSlip orderData={orderData} initialMode={mode} initialDocType={initialDocType} />
}
