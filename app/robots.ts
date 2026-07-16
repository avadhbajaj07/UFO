import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/affiliate',
          '/account',
          '/checkout',
          '/cart',
          '/login',
          '/signup',
          '/reset-password',
          '/update-password',
          '/pos',
          '/api/',
          '/search',
        ],
      },
    ],
    sitemap: 'https://ufolabz.com/sitemap.xml',
    host: 'https://ufolabz.com',
  }
}
