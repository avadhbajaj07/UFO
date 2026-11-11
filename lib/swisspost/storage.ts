import { createAdminClient } from '@/lib/supabase/admin'

const BUCKET_NAME = 'shipping-labels'

/**
 * Ensures the shipping-labels bucket exists in Supabase Storage
 */
export async function ensureShippingBucketExists(): Promise<void> {
  const supabase = createAdminClient()
  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    const found = buckets?.some((b: any) => b.name === BUCKET_NAME)
    if (!found) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['application/pdf'],
      })
    }
  } catch (err) {
    console.warn('[STORAGE] ensureShippingBucketExists non-fatal warning:', err)
  }
}

/**
 * Uploads a generated Swiss Post label PDF to Supabase Storage and returns a 24h signed URL
 */
export async function uploadShippingLabelPdf(
  orderId: string,
  trackingNumber: string,
  pdfBase64: string
): Promise<{ storagePath: string; signedUrl: string }> {
  const supabase = createAdminClient()
  await ensureShippingBucketExists()

  const pdfBuffer = Buffer.from(pdfBase64, 'base64')
  const storagePath = `orders/${orderId}/${trackingNumber}.pdf`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (uploadError) {
    console.error('[STORAGE] Label PDF upload failed:', uploadError)
    throw new Error(`Failed to upload shipping label to storage: ${uploadError.message}`)
  }

  // Generate 24h signed URL for printing & download
  const { data: signedData, error: signError } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, 86400) // 24 hours

  if (signError || !signedData?.signedUrl) {
    throw new Error(`Failed to generate signed URL for shipping label: ${signError?.message}`)
  }

  return {
    storagePath,
    signedUrl: signedData.signedUrl,
  }
}

/**
 * Generates a fresh signed URL for an existing label storage path
 */
export async function getShippingLabelSignedUrl(storagePath: string, expiresInSec: number = 86400): Promise<string> {
  const supabase = createAdminClient()
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, expiresInSec)

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to create signed URL: ${error?.message}`)
  }

  return data.signedUrl
}
