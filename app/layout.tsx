import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UFO LABZ — Alien Performance Technology',
  description: 'Premium science-backed supplements engineered for peak performance. Free delivery in Switzerland on orders over CHF 99.',
  metadataBase: new URL('https://ufolabz.com'),
  openGraph: {
    title: 'UFO LABZ — Alien Performance Technology',
    description: 'Premium science-backed supplements engineered for peak performance. Free delivery in Switzerland on orders over CHF 99.',
    url: 'https://ufolabz.com',
    siteName: 'UFO LABZ',
    images: [
      {
        url: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO4_nuzyls.png',
        width: 1200,
        height: 630,
        alt: 'UFO LABZ Supplements',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UFO LABZ — Alien Performance Technology',
    description: 'Premium science-backed supplements engineered for peak performance. Free delivery in Switzerland on orders over CHF 99.',
    images: ['https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO4_nuzyls.png'],
  },
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
