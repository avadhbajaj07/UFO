import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UFO LABZ — Alien Performance Technology',
  description: 'Premium science-backed supplements engineered for peak performance. Free delivery in Switzerland on orders over CHF 99.',
  metadataBase: new URL('https://ufolabz.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
      </body>
    </html>
  )
}
