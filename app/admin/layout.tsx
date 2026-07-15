import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'UFO LABZ Admin',
  description: 'Private UFO LABZ operations dashboard.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'UFO Admin',
  },
  icons: {
    icon: [
      { url: '/admin-icon/192', sizes: '192x192', type: 'image/png' },
      { url: '/admin-icon/512', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/admin-icon/180', sizes: '180x180', type: 'image/png' }],
  },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#050807',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
