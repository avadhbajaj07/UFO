import AboutClient from '@/components/about/AboutClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About UFO LABZ — Sports Nutrition Built by Athletes',
  description:
    'UFO LABZ is a Swiss sports nutrition brand engineered by athletes, built on independent third-party testing and European quality standards.',
}

export default function AboutPage() {
  return <AboutClient />
}
