const DEFAULT_LOCALE = 'fr'
const LOCALES = ['fr', 'en', 'de', 'it']
const SEGMENT = { fr: 'tools', en: 'tools', de: 'tools', it: 'tools' }

const toolsRewrites = [
  // French default (no prefix in URL) -> routes to [locale]=fr internal pages
  { source: '/tools', destination: '/fr/tools' },
  { source: '/tools/:slug', destination: '/fr/tools/:slug' },
  { source: '/outils', destination: '/fr/tools' },
  { source: '/outils/:slug', destination: '/fr/tools/:slug' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'ufolabz.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'nutrifitness.ch' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(self)' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/shop', destination: '/products', permanent: true },
    ]
  },
  async rewrites() {
    return toolsRewrites
  },
}

module.exports = nextConfig
