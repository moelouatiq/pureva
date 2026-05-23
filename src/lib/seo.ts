import type { Metadata } from 'next'
import type { Locale } from '@/types/locale'
import { getSiteUrl } from '@/lib/env'

type BuildMetadataParams = {
  locale: Locale
  title: string
  description: string
  path: string
  ogImage?: string
  alternatePaths?: Partial<Record<Locale, string>>
  type?: 'website' | 'article'
}

export function getCanonicalSiteUrl(): string {
  return getSiteUrl().replace(/\/$/, '')
}

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${getCanonicalSiteUrl()}${path}`
}

export function defaultOgImageUrl(): string {
  return absoluteUrl('/images/brand/og-default.jpg')
}

export function buildMetadata({
  locale,
  title,
  description,
  path,
  ogImage,
  alternatePaths,
  type = 'website',
}: BuildMetadataParams): Metadata {
  const siteUrl = getCanonicalSiteUrl()
  const canonicalPath = `/${locale}${path}`
  const canonical = `${siteUrl}${canonicalPath}`
  const frPath = alternatePaths?.fr ?? path
  const enPath = alternatePaths?.en ?? path
  const image = ogImage ? absoluteUrl(ogImage) : defaultOgImageUrl()

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fr: `${siteUrl}/fr${frPath}`,
        en: `${siteUrl}/en${enPath}`,
        'x-default': `${siteUrl}/fr${frPath}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Pureva',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: locale === 'fr' ? 'en_US' : 'fr_FR',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}
