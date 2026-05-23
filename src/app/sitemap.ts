import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/env'
import { getPublicProducts } from '@/lib/products/public-products'

export const revalidate = 300

const STATIC_PATHS = [
  { path: '/fr', priority: 1 },
  { path: '/en', priority: 0.9 },
  { path: '/fr/shop', priority: 0.8 },
  { path: '/en/shop', priority: 0.7 },
  { path: '/fr/routine-pack', priority: 0.8 },
  { path: '/en/routine-pack', priority: 0.7 },
  { path: '/fr/contact', priority: 0.6 },
  { path: '/en/contact', priority: 0.5 },
] as const

function siteUrl(): string {
  return getSiteUrl().replace(/\/$/, '')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl()
  const now = new Date()
  const products = await getPublicProducts()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((entry) => ({
    url: `${baseUrl}${entry.path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: entry.priority,
  }))

  const productEntries: MetadataRoute.Sitemap = products.flatMap((product) => [
    {
      url: `${baseUrl}/fr/products/${product.slug.fr}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/products/${product.slug.en}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ])

  return [...staticEntries, ...productEntries]
}
