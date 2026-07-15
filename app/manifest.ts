import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'UFO LABZ Admin',
    short_name: 'UFO Admin',
    description: 'Private UFO LABZ operations dashboard.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#050807',
    theme_color: '#050807',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/admin-icon/192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/admin-icon/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
