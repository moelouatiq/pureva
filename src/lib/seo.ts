import type { Metadata } from 'next'
import type { Locale } from '@/types/locale'

type BuildMetadataParams = {
  locale: Locale
  title: string
  description: string
  path: string
  ogImage?: string
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pureva.fr'

export function buildMetadata({
  locale,
  title,
  description,
  path,
  ogImage,
}: BuildMetadataParams): Metadata {
  const canonical = `${siteUrl}/${locale}${path}`
  const image = ogImage ?? `${siteUrl}/images/brand/og-default.jpg`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fr: `${siteUrl}/fr${path}`,
        en: `${siteUrl}/en${path}`,
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
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}
