import FAQPageClient from '@/components/faq/FaqClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | Shipping, Products & Orders | UFO LABZ',
  description: 'Answers to common questions about UFO LABZ products, ingredients, shipping across Europe, orders, and returns.',
}

export default function FAQPage() {
  return <FAQPageClient />
}
