import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getVisibleProducts } from '@/data/products'
import { buildMetadata } from '@/lib/seo'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { buildProductOptions } from '@/lib/product-options'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import ProductImage from '@/components/product/ProductImage'
import ProductInfo from '@/components/product/ProductInfo'
import ProductGrid from '@/components/product/ProductGrid'
import StickyMobileCTA from '@/components/product/StickyMobileCTA'
import OrderForm from '@/components/order/OrderForm'
import JsonLd, { productJsonLd, breadcrumbJsonLd } from '@/components/shared/JsonLd'
import type { Locale } from '@/types/locale'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return getVisibleProducts().flatMap((product) => [
    { locale: 'fr', slug: product.slug.fr },
    { locale: 'en', slug: product.slug.en },
  ])
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const l = locale as Locale
  const product = getVisibleProducts().find((p) => p.slug.fr === slug || p.slug.en === slug)
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
  const t = await getTranslations({ locale, namespace: 'product' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tOrder = await getTranslations({ locale, namespace: 'order' })
  const tProduct = await getTranslations({ locale, namespace: 'product' })

  const visibleProducts = getVisibleProducts()
  const product = visibleProducts.find((p) => p.slug.fr === slug || p.slug.en === slug)
  if (!product) notFound()

  const relatedProducts = visibleProducts
    .filter((p) => p.id !== product.id && p.isRoutineProduct === product.isRoutineProduct)
    .slice(0, 3)

  const breadcrumbItems = [
    { label: l === 'fr' ? 'Accueil' : 'Home', href: '/' as const },
    { label: tNav('shop'), href: '/shop' as const },
    { label: product.name[l] },
  ]

  const waMsg = product.whatsappMessage[l] ?? product.whatsappMessage.fr
  const waUrl = buildWhatsAppUrl(waMsg)

  const productOptions = buildProductOptions(l, tProduct('price_placeholder'))

  return (
    <>
      <JsonLd data={productJsonLd(product, l)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems, l)} />
      <div className="section-padding pb-24 md:pb-0">
        <div className="container-pureva">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {/* Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-cream">
              <ProductImage
                src={product.images[0] ?? ''}
                alt={product.name[l]}
                className="w-full h-full"
              />
            </div>

            {/* Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-green-900 mb-4">
                {product.name[l]}
              </h1>
              <ProductInfo product={product} locale={locale} />
            </div>
          </div>

          {/* Expandable order section */}
          {product.stockStatus !== 'out_of_stock' && (
            <div className="mt-12 border border-green-200 rounded-2xl overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 bg-green-900 text-ivory list-none hover:bg-green-800 transition-colors">
                  <span className="font-semibold">
                    {tOrder('form.order_cta_label')}
                  </span>
                  <span
                    className="text-xl transition-transform duration-200 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="p-6 bg-white">
                  <OrderForm
                    productOptions={productOptions}
                    defaultProduct={product.id}
                  />
                </div>
              </details>
            </div>
          )}

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl font-heading font-bold text-green-900 mb-6">
                {t('related_title')}
              </h2>
              <ProductGrid products={relatedProducts} locale={locale} />
            </section>
          )}
        </div>
      </div>

      <StickyMobileCTA href={waUrl} label={t('sticky_cta')} />
    </>
  )
}
