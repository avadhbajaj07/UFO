import ContactPageClient from '@/components/contact/ContactClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | UFO LABZ',
  description: 'Reach out to UFO LABZ. Get in touch with our team for general inquiries, order status, or support requests.',
}

export default function ContactPage() {
  return <ContactPageClient />
}
