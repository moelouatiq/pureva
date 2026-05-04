import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { products } from '@/data/products'
import { buildMetadata } from '@/lib/seo'
import { formatPrice } from '@/lib/format-price'
import Disclaimer from '@/components/shared/Disclaimer'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import type { Locale } from '@/types/locale'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return products.flatMap((product) => [
    { locale: 'fr', slug: product.slug.fr },
    { locale: 'en', slug: product.slug.en },
  ])
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const l = locale as Locale
  const product = products.find((p) => p.slug.fr === slug || p.slug.en === slug)
  if (!product) return {}
  return buildMetadata({
    locale: l,
    title: product.seoTitle[l],
    description: product.seoDescription[l],
    path: `/products/${product.slug[l]}`,
  })
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const l = locale as Locale
  const product = products.find((p) => p.slug.fr === slug || p.slug.en === slug)
  if (!product) notFound()

  const breadcrumbItems = [
    { label: l === 'fr' ? 'Accueil' : 'Home', href: '/' },
    { label: l === 'fr' ? 'Boutique' : 'Shop', href: '/shop' },
    { label: product.name[l] },
  ]

  return (
    <div className="section-padding">
      <div className="container-pureva">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="max-w-3xl">
          <h1 className="mb-2">{product.name[l]}</h1>
          <p className="text-2xl font-semibold mb-1" style={{ color: 'var(--color-green-800)' }}>
            {formatPrice(product.price, l)}
          </p>
          {product.compareAtPrice && (
            <p className="text-base line-through text-[oklch(0.55_0.02_250)] mb-4">
              {formatPrice(product.compareAtPrice, l)}
            </p>
          )}
          <p className="text-base leading-relaxed mb-6 text-[oklch(0.35_0.02_250)]">
            {product.shortDescription[l]}
          </p>

          <div className="mt-10">
            <Disclaimer locale={l} />
          </div>
        </div>
      </div>
    </div>
  )
}
