'use client'

import { useEffect } from 'react'
import { useCurrencyStore } from '@/store/currency'
import { formatCurrencyPrice, SupportedCurrency } from '@/lib/config/pricing'

export function useCurrency() {
  const currency = useCurrencyStore((s) => s.currency)
  const country = useCurrencyStore((s) => s.country)
  const isManual = useCurrencyStore((s) => s.isManual)
  const isHydrated = useCurrencyStore((s) => s.isHydrated)
  const setCurrency = useCurrencyStore((s) => s.setCurrency)
  const setCountry = useCurrencyStore((s) => s.setCountry)
  const initGeo = useCurrencyStore((s) => s.initGeo)

  useEffect(() => {
    initGeo()
  }, [initGeo])

  const format = (amount: number) => formatCurrencyPrice(amount, currency)

  return {
    currency,
    country,
    isManual,
    isHydrated,
    setCurrency,
    setCountry,
    formatPrice: format,
    isEurope: currency === 'EUR',
    isSwitzerland: currency === 'CHF',
  }
}
