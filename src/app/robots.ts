import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/env'

function siteUrl(): string {
  return getSiteUrl().replace(/\/$/, '')
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
