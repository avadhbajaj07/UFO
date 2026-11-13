import type { MetadataRoute } from 'next'

const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'ClaudeBot',
  'Claude-User',
  'Google-Extended',
  'Applebot-Extended',
]

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
      {
        userAgent: AI_BOTS,
        allow: '/',
        disallow: [
          '/admin',
          '/affiliate',
          '/account',
          '/checkout',
          '/cart',
          '/pos',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://ufolabz.com/sitemap.xml',
    host: 'https://ufolabz.com',
  }
}
