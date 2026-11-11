import { getSwissPostToken, clearSwissPostTokenCache } from './auth'

export interface SwissPostSenderConfig {
  name1: string
  name2?: string
  street: string
  zip: string
  city: string
  country: string
  domicilePostOffice?: string
}

export interface GenerateLabelRecipient {
  name1: string
  street: string
  zip: string
  city: string
  country: string
  email?: string
  phone?: string
  houseKey?: string
}

export interface GenerateLabelOptions {
  recipient: GenerateLabelRecipient
  serviceCode?: 'PRI' | 'ECO' // PRI = PostPac Priority, ECO = PostPac Economy
  weightKg?: number
  orderNumber?: string
  sender?: Partial<SwissPostSenderConfig>
  printPreview?: boolean
}

export interface GeneratedLabelResult {
  trackingNumber: string
  pdfBase64: string
  trackingUrl: string
  serviceCode: string
  weightKg: number
  printPreview: boolean
  labelLayout: string
}

/**
 * Returns default sender details from environment variables
 */
export function getSwissPostSenderConfig(): SwissPostSenderConfig {
  const name1 = process.env.SWISSPOST_SENDER_NAME1 || 'SCARPANTONI NUTRIFIT'
  const street = process.env.SWISSPOST_SENDER_STREET || 'Bahnhofstrasse 1'
  const zip = process.env.SWISSPOST_SENDER_ZIP || '8001'
  const city = process.env.SWISSPOST_SENDER_CITY || 'Zürich'
  const country = process.env.SWISSPOST_SENDER_COUNTRY || 'CH'
  const domicilePostOffice = `${zip} ${city}`

  return {
    name1,
    street,
    zip,
    city,
    country,
    domicilePostOffice,
  }
}

/**
 * Calls Swiss Post Barcode API to generate an A6 thermal shipping label
 */
export async function generateSwissPostLabel(
  options: GenerateLabelOptions,
  isRetry = false
): Promise<GeneratedLabelResult> {
  const barcodeUrl = process.env.SWISSPOST_BARCODE_URL || 'https://dcapi.apis.post.ch/barcode/v1/generateAddressLabel'
  const frankingLicense = process.env.SWISSPOST_FRANKING_LICENSE || '60178154'

  // Safety rule: printPreview MUST be true in dev/test, and false only if explicitly configured in production
  const printPreview =
    options.printPreview !== undefined
      ? options.printPreview
      : process.env.SWISSPOST_PRINT_PREVIEW !== 'false'

  const senderConfig = {
    ...getSwissPostSenderConfig(),
    ...options.sender,
  }

  const serviceCode = options.serviceCode || 'PRI'
  const weight = Math.max(0.1, Number((options.weightKg || 1).toFixed(2)))

  const requestBody = {
    language: 'DE',
    frankingLicense: String(frankingLicense),
    ppFranking: false,
    customer: {
      name1: senderConfig.name1,
      name2: senderConfig.name2 || undefined,
      street: senderConfig.street,
      zip: senderConfig.zip,
      city: senderConfig.city,
      country: senderConfig.country || 'CH',
      logoRotation: 0,
      domicilePostOffice: senderConfig.domicilePostOffice || `${senderConfig.zip} ${senderConfig.city}`,
    },
    customerSystem: null,
    labelDefinition: {
      labelLayout: 'A6',
      printAddresses: 'RECIPIENT_AND_CUSTOMER',
      imageFileType: 'PDF',
      imageResolution: 300,
      printPreview,
    },
    item: {
      recipient: {
        name1: options.recipient.name1,
        street: options.recipient.street,
        zip: options.recipient.zip,
        city: options.recipient.city,
        country: options.recipient.country || 'CH',
        email: options.recipient.email || undefined,
        houseKey: options.recipient.houseKey || undefined,
      },
      attributes: {
        przl: [serviceCode],
        weight,
        returnInfo: {
          returnNote: false,
          instructionForReturns: false,
        },
      },
    },
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('[SWISSPOST LABEL] Request payload:', JSON.stringify(requestBody, null, 2))
  }

  const token = await getSwissPostToken('DCAPI_BARCODE_READ')

  const res = await fetch(barcodeUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(requestBody),
    cache: 'no-store',
  })

  // Token expired / 401 retry handling
  if (res.status === 401 && !isRetry) {
    console.warn('[SWISSPOST LABEL] Received 401, clearing token cache and retrying once...')
    clearSwissPostTokenCache('DCAPI_BARCODE_READ')
    return generateSwissPostLabel(options, true)
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => '')
    console.error('[SWISSPOST LABEL] API error:', res.status, errorText)

    let parsedError: any = null
    try {
      parsedError = JSON.parse(errorText)
    } catch {}

    const errorMsg =
      parsedError?.errors?.[0]?.message ||
      parsedError?.message ||
      `Swiss Post Barcode API returned status ${res.status}.`

    throw new Error(errorMsg)
  }

  const data = await res.json()

  if (process.env.NODE_ENV !== 'production') {
    console.log('[SWISSPOST LABEL] Raw response keys:', Object.keys(data))
    if (data.item) {
      console.log('[SWISSPOST LABEL] item keys:', Object.keys(data.item), 'identCode:', data.item.identCode)
    }
  }

  const trackingNumber = data.item?.identCode || data.item?.itemID || ''
  if (!trackingNumber) {
    throw new Error('Swiss Post API did not return a valid tracking number (identCode).')
  }

  // Label array or string in base64
  let pdfBase64 = ''
  if (Array.isArray(data.item?.label) && data.item.label.length > 0) {
    pdfBase64 = data.item.label[0]
  } else if (typeof data.item?.label === 'string') {
    pdfBase64 = data.item.label
  }

  if (!pdfBase64) {
    throw new Error('Swiss Post API did not return the PDF label data.')
  }

  const trackingUrl = `https://service.post.ch/tracking?formattedParcelCodes=${trackingNumber}`

  return {
    trackingNumber,
    pdfBase64,
    trackingUrl,
    serviceCode,
    weightKg: weight,
    printPreview,
    labelLayout: 'A6',
  }
}
