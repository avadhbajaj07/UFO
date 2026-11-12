import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import './globals.css'
import '@/components/alien-fx/alien-fx.css'

export const metadata: Metadata = {
  title: {
    default: 'UFO LABZ | Sports Supplements Switzerland',
    template: '%s',
  },
  description: 'Premium science-backed supplements engineered for peak performance. Free delivery in Switzerland on orders over CHF 75.',
  metadataBase: new URL('https://ufolabz.com'),
  applicationName: 'UFO LABZ',
  alternates: { canonical: 'https://ufolabz.com' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google97d03441cbab61fc',
  },
  openGraph: {
    title: 'UFO LABZ — Alien Performance Technology',
    description: 'Premium science-backed supplements engineered for peak performance. Free delivery in Switzerland on orders over CHF 75.',
    url: 'https://ufolabz.com',
    siteName: 'UFO LABZ',
    images: [
      {
        url: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/astro-creatine.png',
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
    description: 'Premium science-backed supplements engineered for peak performance. Free delivery in Switzerland on orders over CHF 75.',
    images: ['https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/astro-creatine.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-K6QTB4VF" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-K6QTB4VF"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
          {children}
        </Providers>
      </body>
    </html>
  )
}
