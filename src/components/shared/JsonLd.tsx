import type { Product } from '@/types/product'
import type { Locale } from '@/types/locale'
import type { FAQ } from '@/data/faqs'
import { absoluteUrl, defaultOgImageUrl, getCanonicalSiteUrl } from '@/lib/seo'

type Props = {
  data: Record<string, unknown>
}

export default function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

const siteUrl = getCanonicalSiteUrl()

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pureva',
    url: siteUrl,
    logo: absoluteUrl('/images/brand/logo.png'),
    description:
      'Pureva - soins capillaires naturels pour cheveux fragilises. Routine a base d actifs botaniques.',
  }
}

export function websiteJsonLd(locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pureva',
    url: `${siteUrl}/${locale}`,
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: 'Pureva',
      url: siteUrl,
    },
  }
}

export function faqJsonLd(faqs: FAQ[], locale: Locale): Record<string, unknown> {
  return faqItemsJsonLd(
    faqs.map((faq) => ({
      question: faq.question[locale],
      answer: faq.answer[locale],
    }))
  )
}

export function faqItemsJsonLd(items: Array<{ question: string; answer: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

type BreadcrumbItem = {
  label: string
  href?: string
}

export function breadcrumbJsonLd(
  items: BreadcrumbItem[],
  locale: Locale
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${siteUrl}/${locale}${item.href}` } : {}),
    })),
  }
}

export function productJsonLd(product: Product, locale: Locale): Record<string, unknown> {
  const availabilityMap: Record<string, string> = {
    in_stock: 'https://schema.org/InStock',
    low_stock: 'https://schema.org/LimitedAvailability',
    out_of_stock: 'https://schema.org/OutOfStock',
  }
  const description =
    product.seoDescription[locale] ||
    product.shortDescription[locale] ||
    product.shortDescription.fr ||
    product.name[locale]
  const image = product.images[0] ? absoluteUrl(product.images[0]) : defaultOgImageUrl()
  const url = `${siteUrl}/${locale}/products/${product.slug[locale]}`

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[locale],
    description,
    image: [image],
    sku: product.id,
    url,
    brand: {
      '@type': 'Brand',
      name: 'Pureva',
    },
  }

  if (product.priceStatus === 'confirmed' && product.price > 0) {
    schema.offers = {
      '@type': 'Offer',
      price: (product.price / 100).toFixed(2),
      priceCurrency: 'EUR',
      availability: availabilityMap[product.stockStatus] ?? 'https://schema.org/InStock',
      url,
    }
  }

  return schema
}
