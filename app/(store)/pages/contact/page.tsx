import ContactPageClient from '@/components/contact/ContactClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact UFO LABZ | Zürich, Switzerland',
  description: 'Get in touch with UFO LABZ by email, visit us in Zürich, or shop offline at NutriFit Geneva. We typically respond within 24 hours.',
}

export default function ContactPage() {
  return <ContactPageClient />
}
