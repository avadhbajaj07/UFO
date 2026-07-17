import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'UFO Mail',
  description: 'Private UFO LABZ business email dashboard.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#07100d',
  width: 'device-width',
  initialScale: 1,
}

export default function MailLayout({ children }: { children: React.ReactNode }) {
  return children
}
