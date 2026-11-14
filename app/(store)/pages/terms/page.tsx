import TermsClient from '@/components/legal/TermsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | UFO LABZ Switzerland',
  description: 'Terms of Service for UFO LABZ online store governed exclusively under Swiss jurisdiction.',
}

export default function TermsPage() {
  return <TermsClient />
}
