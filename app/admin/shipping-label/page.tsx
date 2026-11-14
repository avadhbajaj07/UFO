import type { Metadata } from 'next'
import SwissPostBoxLabel, { SAMPLE_REAL_BOX_LABEL, BoxLabelData } from '@/components/SwissPostBoxLabel'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata: Metadata = {
  title: 'Admin Box Shipping Label | UFO LABZ SWISS',
  description: 'Swiss Post Priority external carton shipping label with post office QR and customer address.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminShippingLabelPage({
  searchParams,
}: {
  searchParams?: { orderId?: string; format?: 'thermal' | 'a4'; service?: 'PRI' | 'ECO' }
}) {
  const format = searchParams?.format === 'a4' ? 'a4' : 'thermal'
  const requestedId = searchParams?.orderId

  let labelData: BoxLabelData = SAMPLE_REAL_BOX_LABEL

  if (requestedId && requestedId !== 'sample' && requestedId !== SAMPLE_REAL_BOX_LABEL.orderNumber) {
    try {
      const supabaseAdmin = createAdminClient()
      const { data: dbOrder } = await supabaseAdmin
        .from('orders')
        .select('*')
        .or(`id.eq.${requestedId},order_number.eq.${requestedId}`)
        .maybeSingle()

      if (dbOrder) {
        const addr = dbOrder.shipping_address || {}
        const trackingNum = dbOrder.tracking_number || SAMPLE_REAL_BOX_LABEL.trackingNumber

        labelData = {
          ...SAMPLE_REAL_BOX_LABEL,
          orderId: dbOrder.order_number ? `#${dbOrder.order_number.replace(/^#/, '')}` : `#${dbOrder.id.slice(0, 8).toUpperCase()}`,
          orderNumber: dbOrder.order_number || dbOrder.id,
          date: new Date(dbOrder.created_at || Date.now()).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          time: new Date(dbOrder.created_at || Date.now()).toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' }) + ' CET',
          weightKg: Number(dbOrder.package_weight || 1.45),
          serviceCode: (dbOrder.shipping_service || 'PRI') as 'PRI' | 'ECO',
          trackingNumber: trackingNum,
          trackingUrl: dbOrder.tracking_url || `https://service.post.ch/tracking?formattedParcelCodes=${trackingNum}`,
          recipient: {
            name: addr.fullName || addr.name || dbOrder.customer_name || SAMPLE_REAL_BOX_LABEL.recipient.name,
            company: addr.company || undefined,
            street: addr.addressLine1 || addr.street || addr.address || SAMPLE_REAL_BOX_LABEL.recipient.street,
            addressLine2: addr.addressLine2 || undefined,
            zip: addr.zipCode || addr.postalCode || addr.zip || SAMPLE_REAL_BOX_LABEL.recipient.zip,
            city: addr.city || SAMPLE_REAL_BOX_LABEL.recipient.city,
            canton: addr.canton || undefined,
            country: addr.country || SAMPLE_REAL_BOX_LABEL.recipient.country,
            phone: addr.phone || dbOrder.customer_phone || SAMPLE_REAL_BOX_LABEL.recipient.phone,
            email: dbOrder.customer_email || SAMPLE_REAL_BOX_LABEL.recipient.email,
          },
        }
      }
    } catch (err) {
      console.error('Failed to load order for box shipping label, falling back to sample:', err)
    }
  }

  return <SwissPostBoxLabel data={labelData} initialFormat={format} />
}
