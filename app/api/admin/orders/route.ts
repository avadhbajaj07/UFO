import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { data: ords, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[ADMIN ORDERS API] Error fetching orders:', error)
      return NextResponse.json({ success: false, error: error.message, orders: [] }, { status: 500 })
    }

    return NextResponse.json({ success: true, orders: ords || [] })
  } catch (err: any) {
    console.error('[ADMIN ORDERS API] GET error:', err)
    return NextResponse.json({ success: false, error: err.message, orders: [] }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, status, trackingNumber, shippingStatus, internalNote } = body

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId is required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const updatePayload: Record<string, any> = {}

    if (status !== undefined) updatePayload.status = status
    if (trackingNumber !== undefined) updatePayload.tracking_number = trackingNumber
    if (shippingStatus !== undefined) updatePayload.shipping_status = shippingStatus
    if (internalNote !== undefined) updatePayload.internal_note = internalNote

    const { data, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId)
      .select()

    if (error) {
      console.error('[ADMIN ORDERS API] Error updating order:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, order: data?.[0] })
  } catch (err: any) {
    console.error('[ADMIN ORDERS API] PATCH error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
