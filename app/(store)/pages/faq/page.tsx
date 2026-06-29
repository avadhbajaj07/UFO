import FAQPageClient from '@/components/faq/FaqClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | UFO LABZ',
  description: 'Frequently Asked Questions about UFO LABZ. Get answers to shipping, ingredients, returns, and support questions.',
}

export default function FAQPage() {
  return <FAQPageClient />
}
