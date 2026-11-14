import type { Metadata } from 'next'
import AffiliateClient from '@/components/affiliate/AffiliateClient'

export const metadata: Metadata = {
  title: 'Affiliate Program | UFO LABZ',
  description:
    'Join the UFO LABZ Affiliate Program and earn up to 25% commission on every sale. Sign up, share your referral link, and start earning today.',
  alternates: {
    canonical: 'https://ufolabz.com/pages/affiliate',
    languages: {
      fr: 'https://ufolabz.com/pages/affiliate',
      en: 'https://ufolabz.com/en/pages/affiliate',
      de: 'https://ufolabz.com/de/pages/affiliate',
      it: 'https://ufolabz.com/it/pages/affiliate',
      es: 'https://ufolabz.com/es/pages/affiliate',
      pt: 'https://ufolabz.com/pt/pages/affiliate',
    },
  },
}

export default function AffiliatePage() {
  return <AffiliateClient />
}
