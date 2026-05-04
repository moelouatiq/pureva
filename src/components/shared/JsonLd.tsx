import type { Product } from '@/types/product'
import type { Locale } from '@/types/locale'
import type { FAQ } from '@/data/faqs'

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pureva.fr'

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pureva',
    url: siteUrl,
    logo: `${siteUrl}/images/brand/logo.png`,
    description:
      'Pureva — soins capillaires naturels pour cheveux fragilisés. Routine complète à base d\'actifs botaniques.',
  }
}

export function faqJsonLd(faqs: FAQ[], locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question[locale],
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer[locale],
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
    out_of_stock: 'https://schema.org/OutOfStock',
    pre_order: 'https://schema.org/PreOrder',
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[locale],
    description: product.seoDescription[locale],
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
      url: `${siteUrl}/${locale}/products/${product.slug[locale]}`,
    }
  }

  return schema
}
