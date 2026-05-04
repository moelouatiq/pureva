/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pureva.fr'

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  alternateRefs: [
    { href: siteUrl, hreflang: 'fr' },
    { href: `${siteUrl}/en`, hreflang: 'en' },
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/api/' },
    ],
  },
}
