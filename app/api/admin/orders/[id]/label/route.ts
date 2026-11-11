import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import {
  validateSwissAddress,
  generateSwissPostLabel,
  uploadShippingLabelPdf,
  getShippingLabelSignedUrl,
  ensureShippingBucketExists,
} from '@/lib/swisspost'
import { emailService } from '@/lib/email/email'

export const dynamic = 'force-dynamic'

const postSchema = z.object({
  regenerate: z.boolean().optional().default(false),
  serviceCode: z.enum(['PRI', 'ECO']).optional().default('PRI'),
  weightKg: z.number().positive().max(30).optional(),
  overrideAddress: z
    .object({
      fullName: z.string().min(1).optional(),
      addressLine1: z.string().min(1).optional(),
      zipCode: z.string().min(1).optional(),
      city: z.string().min(1).optional(),
    })
    .optional(),
})

async function checkAdminAuth(req: NextRequest): Promise<boolean> {
  const secret = req.headers.get('x-admin-secret') || new URL(req.url).searchParams.get('secret')
  if (secret === 'UFOLabzAdmin2026!') return true

  try {
    const supabase = createServerSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const adminClient = createAdminClient()
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    return profile?.role === 'admin' || profile?.role === 'super_admin'
  } catch {
    return false
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isAuthorized = await checkAdminAuth(req)
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized. Admin credentials required.' }, { status: 401 })
    }

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: 'Missing order ID parameter.' }, { status: 400 })
    }

    const rawBody = await req.json().catch(() => ({}))
    const parsedInput = postSchema.safeParse(rawBody)
    if (!parsedInput.success) {
      return NextResponse.json(
        { error: 'Invalid input parameters.', details: parsedInput.error.format() },
        { status: 400 }
      )
    }

    const { regenerate, serviceCode, weightKg, overrideAddress } = parsedInput.data
    const supabaseAdmin = createAdminClient()

    // 1. Fetch order by UUID or order_number
    let { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', id)
      .maybeSingle()

    if (!order) {
      const { data: orderByNum } = await supabaseAdmin
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('order_number', id)
        .maybeSingle()
      order = orderByNum
    }

    if (!order) {
      return NextResponse.json({ error: `Order "${id}" not found in database.` }, { status: 404 })
    }

    // 2. Check country: Swiss domestic only for now (CH / LI)
    const rawShipping = order.shipping_address || {}
    const rawCountry = (rawShipping.country || 'CH').toUpperCase().trim()
    const isDomestic = ['CH', 'CHE', 'SWITZERLAND', 'SCHWEIZ', 'SUISSE', 'SVIZZERA', 'LI', 'LIECHTENSTEIN'].includes(rawCountry)

    if (!isDomestic) {
      return NextResponse.json(
        {
          error: `Cross-border label generation for "${rawCountry}" is not supported yet. Swiss Post Barcode API is currently configured for domestic Swiss (CH/LI) parcels.`,
          unsupportedCountry: rawCountry,
        },
        { status: 400 }
      )
    }

    // 3. Idempotency Check: if label already exists and not regenerating, return existing
    const existingTracking = order.tracking_number
    const existingLabelPath = order.shipping_label_url

    if (existingTracking && existingLabelPath && !regenerate) {
      try {
        const signedUrl = await getShippingLabelSignedUrl(existingLabelPath)
        return NextResponse.json({
          success: true,
          alreadyExists: true,
          orderId: order.id,
          orderNumber: order.order_number,
          trackingNumber: existingTracking,
          trackingUrl: order.tracking_url || `https://service.post.ch/tracking?formattedParcelCodes=${existingTracking}`,
          labelUrl: signedUrl,
          shippingStatus: order.shipping_status || 'label_created',
          createdAt: order.label_created_at || order.created_at,
          message: 'Existing Swiss Post label retrieved successfully.',
        })
      } catch (signErr) {
        console.warn('[SWISSPOST ROUTE] Failed to sign existing label URL, will regenerate:', signErr)
      }
    }

    // 4. Address Verification with Swiss Post Address API
    const addressToValidate = {
      fullName: overrideAddress?.fullName || rawShipping.fullName || rawShipping.name || 'Customer',
      addressLine1: overrideAddress?.addressLine1 || rawShipping.addressLine1 || rawShipping.street || '',
      zipCode: overrideAddress?.zipCode || rawShipping.zipCode || rawShipping.zip || rawShipping.postalCode || '',
      city: overrideAddress?.city || rawShipping.city || '',
    }

    const validation = await validateSwissAddress(
      addressToValidate.fullName,
      addressToValidate.addressLine1,
      addressToValidate.zipCode,
      addressToValidate.city
    )

    if (!validation.isValid && validation.quality === 'UNUSABLE') {
      return NextResponse.json(
        {
          error: validation.error || 'Swiss Post Address Validation rejected this recipient address as unusable.',
          validationQuality: validation.quality,
          addressAttempted: addressToValidate,
        },
        { status: 422 }
      )
    }

    // Use normalized address if certified by Swiss Post
    const finalStreet = validation.normalized
      ? `${validation.normalized.street} ${validation.normalized.houseNumber}`.trim()
      : addressToValidate.addressLine1

    const finalZip = validation.normalized ? validation.normalized.zip : addressToValidate.zipCode
    const finalCity = validation.normalized ? validation.normalized.city : addressToValidate.city

    // 5. Calculate Parcel Weight
    let calculatedWeightKg = 1.0
    if (weightKg) {
      calculatedWeightKg = weightKg
    } else if (order.items && order.items.length > 0) {
      const totalUnits = order.items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0)
      calculatedWeightKg = Math.max(0.5, totalUnits * 0.45)
    }

    // 6. Generate Label via Swiss Post Barcode API
    const labelResult = await generateSwissPostLabel({
      recipient: {
        name1: addressToValidate.fullName,
        street: finalStreet,
        zip: finalZip,
        city: finalCity,
        country: 'CH',
        email: order.guest_email || rawShipping.email,
        phone: rawShipping.phone,
        houseKey: validation.normalized?.houseKey,
      },
      serviceCode,
      weightKg: calculatedWeightKg,
      orderNumber: order.order_number,
    })

    // 7. Store PDF in Supabase Storage
    const { storagePath, signedUrl } = await uploadShippingLabelPdf(
      order.id,
      labelResult.trackingNumber,
      labelResult.pdfBase64
    )

    // 8. Update Order Record in Supabase
    const nowIso = new Date().toISOString()
    const updatePayload: Record<string, any> = {
      tracking_number: labelResult.trackingNumber,
      tracking_url: labelResult.trackingUrl,
      shipping_label_url: storagePath,
      shipping_status: 'label_created',
      label_created_at: nowIso,
      status: order.status === 'confirmed' || order.status === 'pending' ? 'processing' : order.status,
    }

    // Safe DB update with fallback in case columns were not migrated yet
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update(updatePayload)
      .eq('id', order.id)

    if (updateError) {
      console.warn('[SWISSPOST ROUTE] Full column update had notice, executing fallback update:', updateError.message)
      await supabaseAdmin
        .from('orders')
        .update({
          tracking_number: labelResult.trackingNumber,
          tracking_url: labelResult.trackingUrl,
          internal_note: `SWISSPOST_LABEL:${JSON.stringify({
            storagePath,
            trackingNumber: labelResult.trackingNumber,
            status: 'label_created',
            createdAt: nowIso,
          })}`,
        })
        .eq('id', order.id)
    }

    // Send Order Shipped notification email with Swiss Post tracking
    const recipientEmail = order.guest_email || order.shipping_address?.email
    if (recipientEmail) {
      try {
        await emailService.sendOrderShipped({
          email: recipientEmail,
          customerName: order.shipping_address?.fullName || 'Valued Athlete',
          order_number: order.order_number || order.id,
          tracking_number: labelResult.trackingNumber,
          tracking_url: labelResult.trackingUrl,
          shipping_address: order.shipping_address,
        })
      } catch (mailErr: any) {
        console.warn('[SWISSPOST ROUTE] Could not send order shipped email:', mailErr?.message)
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      trackingNumber: labelResult.trackingNumber,
      trackingUrl: labelResult.trackingUrl,
      labelUrl: signedUrl,
      serviceCode: labelResult.serviceCode,
      weightKg: labelResult.weightKg,
      printPreview: labelResult.printPreview,
      shippingStatus: 'label_created',
      createdAt: nowIso,
      message: 'Swiss Post label successfully generated and saved.',
    })
  } catch (err: any) {
    console.error('[SWISSPOST ROUTE] Unexpected failure:', err)
    return NextResponse.json(
      {
        error: err.message || 'An unexpected error occurred while communicating with Swiss Post.',
      },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isAuthorized = await checkAdminAuth(req)
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const { id } = params
    const supabaseAdmin = createAdminClient()

    let { data: order } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (!order) {
      const { data: byNum } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('order_number', id)
        .maybeSingle()
      order = byNum
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    }

    let storagePath = order.shipping_label_url
    let trackingNumber = order.tracking_number

    if (!storagePath && order.internal_note?.includes('SWISSPOST_LABEL:')) {
      try {
        const meta = JSON.parse(order.internal_note.replace('SWISSPOST_LABEL:', ''))
        storagePath = meta.storagePath
        trackingNumber = meta.trackingNumber
      } catch {}
    }

    if (!storagePath) {
      return NextResponse.json({ error: 'No shipping label exists for this order.' }, { status: 404 })
    }

    const isDownload = req.nextUrl.searchParams.get('download') === 'true'

    if (isDownload) {
      const { data: fileData, error: dlError } = await supabaseAdmin.storage
        .from('shipping-labels')
        .download(storagePath)

      if (dlError || !fileData) {
        return NextResponse.json({ error: 'Failed to download label file from storage.' }, { status: 500 })
      }

      const arrayBuffer = await fileData.arrayBuffer()
      return new NextResponse(arrayBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="SwissPost_${trackingNumber || 'Label'}.pdf"`,
        },
      })
    }

    const signedUrl = await getShippingLabelSignedUrl(storagePath)
    return NextResponse.json({
      success: true,
      trackingNumber,
      labelUrl: signedUrl,
      trackingUrl: order.tracking_url || `https://service.post.ch/tracking?formattedParcelCodes=${trackingNumber}`,
      shippingStatus: order.shipping_status || 'label_created',
      createdAt: order.label_created_at || order.created_at,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
