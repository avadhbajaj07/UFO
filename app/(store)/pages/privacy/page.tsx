import PrivacyClient from '@/components/legal/PrivacyClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | UFO LABZ Switzerland',
  description: 'UFO LABZ Privacy Policy in compliance with Swiss nLPD/DSG and General Data Protection Regulation (GDPR).',
}

export default function PrivacyPage() {
  return <PrivacyClient />
}
