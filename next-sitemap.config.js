/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://pureva.com',
  generateRobotsTxt: true,
  alternateRefs: [
    { href: process.env.NEXT_PUBLIC_SITE_URL || 'https://pureva.com', hreflang: 'fr' },
    {
      href: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pureva.com'}/en`,
      hreflang: 'en',
    },
  ],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
}
