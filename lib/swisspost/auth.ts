/**
 * Swiss Post Digital Commerce API - OAuth2 Client Credentials Token Manager
 *
 * Implements token caching in memory with automatic 30s-early refresh.
 */

interface CachedToken {
  accessToken: string
  expiresAt: number // timestamp in ms
}

const tokenCache = new Map<string, CachedToken>()

export async function getSwissPostToken(scope: string = 'DCAPI_BARCODE_READ DCAPI_ADDRESS_VALIDATE'): Promise<string> {
  const clientId = process.env.SWISSPOST_CLIENT_ID
  const clientSecret = process.env.SWISSPOST_CLIENT_SECRET
  const tokenUrl = process.env.SWISSPOST_TOKEN_URL || 'https://api.post.ch/OAuth/token'

  if (!clientId || !clientSecret) {
    throw new Error('Swiss Post API credentials (SWISSPOST_CLIENT_ID / SWISSPOST_CLIENT_SECRET) are not configured.')
  }

  // Check cache (refresh 30s before expiry)
  const cached = tokenCache.get(scope)
  const now = Date.now()
  if (cached && cached.expiresAt - 30_000 > now) {
    return cached.accessToken
  }

  const bodyParams = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope,
  })

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: bodyParams.toString(),
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => '')
    console.error('[SWISSPOST AUTH] Failed to retrieve access token:', res.status, errorText)
    throw new Error(`Swiss Post authentication failed with status ${res.status}. Check API credentials.`)
  }

  const data = await res.json()
  if (!data.access_token) {
    throw new Error('Swiss Post token response did not contain an access_token.')
  }

  const expiresInSec = typeof data.expires_in === 'number' ? data.expires_in : 300
  const expiresAt = now + expiresInSec * 1000

  tokenCache.set(scope, {
    accessToken: data.access_token,
    expiresAt,
  })

  return data.access_token
}

export function clearSwissPostTokenCache(scope?: string): void {
  if (scope) {
    tokenCache.delete(scope)
  } else {
    tokenCache.clear()
  }
}
