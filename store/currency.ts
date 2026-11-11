import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SupportedCurrency } from '@/lib/config/pricing'

interface CurrencyStore {
  currency: SupportedCurrency
  country: string
  isManual: boolean
  isHydrated: boolean
  setCurrency: (currency: SupportedCurrency, isManual?: boolean) => void
  setCountry: (country: string) => void
  initGeo: () => Promise<void>
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
  return match ? decodeURIComponent(match[3]) : null
}

function setCookie(name: string, value: string, days = 30) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: 'CHF',
      country: 'CH',
      isManual: false,
      isHydrated: false,

      setCurrency: (currency: SupportedCurrency, isManual = true) => {
        set({ currency, isManual })
        setCookie('ufo_currency', currency)
        if (isManual) {
          setCookie('ufo_currency_manual', '1')
        }
      },

      setCountry: (country: string) => {
        set({ country })
        setCookie('ufo_country', country)
      },

      initGeo: async () => {
        if (typeof window === 'undefined') return

        // 1. Check cookies first
        const cookieManual = getCookie('ufo_currency_manual')
        const cookieCurrency = getCookie('ufo_currency') as SupportedCurrency | null
        const cookieCountry = getCookie('ufo_country')

        if (cookieCurrency === 'CHF' || cookieCurrency === 'EUR') {
          set({
            currency: cookieCurrency,
            country: cookieCountry || (cookieCurrency === 'EUR' ? 'FR' : 'CH'),
            isManual: cookieManual === '1',
            isHydrated: true,
          })
          if (cookieManual === '1') {
            return
          }
        }

        // 2. Query geo endpoint for IP detection
        try {
          const res = await fetch('/api/geo')
          if (res.ok) {
            const data = await res.json()
            const detectedCurrency: SupportedCurrency =
              data.currency || (data.isEurope ? 'EUR' : 'CHF')
            const detectedCountry: string = data.country || 'CH'

            // If user hasn't manually chosen currency, adopt detected currency
            if (!get().isManual && cookieManual !== '1') {
              set({
                currency: detectedCurrency,
                country: detectedCountry,
                isHydrated: true,
              })
              setCookie('ufo_currency', detectedCurrency)
              setCookie('ufo_country', detectedCountry)
            } else {
              set({ country: detectedCountry, isHydrated: true })
            }
          }
        } catch (e) {
          console.warn('[useCurrencyStore] Geo detection error:', e)
          set({ isHydrated: true })
        }
      },
    }),
    {
      name: 'ufo_currency_storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true
        }
      },
    }
  )
)
