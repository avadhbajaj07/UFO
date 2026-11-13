const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en'
const LOCALES = ['en', 'fr', 'de']
const SEGMENT = { en: 'tools', fr: 'outils', de: 'tools' }

const toolsRewrites = LOCALES.flatMap((l) => {
  const prefix = l === DEFAULT_LOCALE ? '' : `/${l}`
  const hubSrc = `${prefix}/${SEGMENT[l]}`
  const hubDst = `/${l}/tools`
  if (hubSrc === hubDst) return []
  return [
    { source: hubSrc, destination: hubDst },
    { source: `${hubSrc}/:slug`, destination: `${hubDst}/:slug` },
  ]
})

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
