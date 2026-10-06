import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import {
  buildPublicProductOptions,
  getPublicCrossSellProducts,
  getPublicRoutinePackProduct,
  getPublicRoutineProducts,
} from '@/lib/products/public-products'
import { formatPrice } from '@/lib/format-price'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import Disclaimer from '@/components/shared/Disclaimer'
import ProductGrid from '@/components/product/ProductGrid'
import ProductImage from '@/components/product/ProductImage'
import OrderForm from '@/components/order/OrderForm'
import type { Locale } from '@/types/locale'
import type { Product } from '@/types/product'

type Props = {
  params: Promise<{ locale: string }>
}

// Product catalog pages use ISR. In production, admin changes may take up to
// 300 seconds to appear unless the route is manually revalidated.
export const revalidate = 300

function getLocalized(value: Product['name'], locale: Locale): string {
  return value[locale] || value.fr
}

function getProductPriceLabel(product: Product, locale: Locale, placeholder: string): string {
  if (product.priceStatus === 'confirmed' && product.price > 0) {
    return formatPrice(product.price, locale)
  }

  return placeholder
}

function textLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

function logRoutinePackDiagnostic(
  details: Record<string, string | number | boolean | null | undefined>
) {
  if (process.env.NODE_ENV !== 'development') return
  console.info('[routine-pack]', details)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const l = locale as Locale
  const routinePack = await getPublicRoutinePackProduct()

  if (!routinePack.product) {
    return buildMetadata({
      locale: l,
      title: l === 'fr' ? 'Pack routine indisponible | Pureva' : 'Routine pack unavailable | Pureva',
      description:
        l === 'fr'
          ? "Le pack routine n'est pas disponible pour le moment."
          : 'The routine pack is not available right now.',
      path: '/routine-pack',
    })
  }

  const product = routinePack.product
  const title = product.seoTitle[l] || product.name[l] || product.name.fr
  const description =
    product.seoDescription[l] ||
    product.shortDescription[l] ||
    product.shortDescription.fr ||
    product.longDescription[l] ||
    product.longDescription.fr

  return buildMetadata({
    locale: l,
    title,
    description,
    path: '/routine-pack',
    ogImage: product.images[0],
  })
}

export default async function RoutinePackPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const l = locale as Locale
  const t = await getTranslations({ locale, namespace: 'routine_pack' })
  const rawTWa = await getTranslations({ locale, namespace: 'whatsapp' })
  const tProduct = await getTranslations({ locale, namespace: 'product' })
  const tStep = await getTranslations({ locale, namespace: 'routine_step_labels' })
  const routineWhatsApp = { message: undefined as string | undefined }
  const tWa = ((key: Parameters<typeof rawTWa>[0]) =>
    key === 'routine' && routineWhatsApp.message ? routineWhatsApp.message : rawTWa(key)) as typeof rawTWa

  const routinePack = await getPublicRoutinePackProduct()
  const packProduct = routinePack.product

  if (!packProduct) {
    return (
      <div className="section-padding">
        <div className="container-pureva max-w-3xl">
          <div className="rounded-2xl border border-cream bg-white p-6">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-green-900 mb-3">
              {l === 'fr' ? 'Pack routine indisponible' : 'Routine pack unavailable'}
            </h1>
            <p className="text-green-800/70 leading-relaxed">
              {l === 'fr'
                ? "Ce produit n'est pas publie pour le moment. Revenez bientot ou contactez-nous pour plus d'informations."
                : 'This product is not published right now. Please check back soon or contact us for more information.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const routineProducts = await getPublicRoutineProducts()
  const crossSellProducts = await getPublicCrossSellProducts()
  const packName = getLocalized(packProduct.name, l)
  const packShortDescription =
    packProduct.shortDescription[l] ||
    packProduct.shortDescription.fr ||
    packProduct.longDescription[l] ||
    packProduct.longDescription.fr
  const packLongDescription = packProduct.longDescription[l] || packProduct.longDescription.fr
  const packBenefits = packProduct.benefits[l] ?? packProduct.benefits.fr
  const packHowToUse = packProduct.howToUse[l] ?? ''
  const packHowToUseLines = textLines(packHowToUse)
  const packSize = packProduct.sizeStatus === 'confirmed' ? packProduct.size : ''
  const packPriceLabel = getProductPriceLabel(packProduct, l, tProduct('price_placeholder'))
  routineWhatsApp.message = packProduct.whatsappMessage[l] || packProduct.whatsappMessage.fr || rawTWa('routine')
  const waUrl = buildWhatsAppUrl(routineWhatsApp.message)

  const productOptions = await buildPublicProductOptions(l, tProduct('price_placeholder'))

  logRoutinePackDiagnostic({
    source: routinePack.source,
    fallbackReason: routinePack.fallbackReason,
    productIdOrLegacyId: packProduct.id,
    hasHowToUse: packHowToUseLines.length > 0,
    howToUseLength: packHowToUse.length,
  })

  return (
    <div className="section-padding">
      <div className="container-pureva max-w-5xl">
        <header className="mb-10 grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center">
          <div className="aspect-square overflow-hidden rounded-2xl bg-cream p-6 md:p-8">
            <ProductImage
              src={packProduct.images[0] ?? ''}
              alt={packProduct.imageAlts?.[l]?.[0] || packName}
              className="h-full w-full"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-green-900 mb-3">
              {packName}
            </h1>
            {packShortDescription && (
              <p className="text-green-800/70 text-lg leading-relaxed">{packShortDescription}</p>
            )}
            {packLongDescription && (
              <p className="mt-4 text-green-800/80 leading-relaxed">{packLongDescription}</p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-green-900 px-4 py-2 text-sm font-semibold text-white">
                {packPriceLabel}
              </span>
              {packProduct.compareAtPrice &&
                packProduct.priceStatus === 'confirmed' &&
                packProduct.compareAtPrice > packProduct.price && (
                  <span className="text-sm text-green-800/45 line-through">
                    {formatPrice(packProduct.compareAtPrice, l)}
                  </span>
                )}
              {packSize && <span className="text-sm text-green-800/60">{packSize}</span>}
            </div>
          </div>
        </header>

        {/* Who it's for */}
        <section className="mb-8 p-6 bg-cream rounded-2xl">
          <h2 className="font-semibold text-green-900 mb-2">{t('who_title')}</h2>
          <p className="text-green-800/80 leading-relaxed">{t('who_body')}</p>
        </section>

        {/* Product benefits */}
        {packBenefits.length > 0 && (
          <section className="mb-8">
          <h2 className="font-semibold text-green-900 mb-4">{t('includes_title')}</h2>
          <ul className="flex flex-col gap-2">
            {packBenefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm text-green-800/80">
                  <span className="text-gold-400 shrink-0 mt-0.5" aria-hidden="true">✦</span>
                  {benefit}
                </li>
              ))}
          </ul>
          </section>
        )}

        {/* Routine products: published + "show in routine", ordered by routine_order */}
        {routineProducts.length > 0 && (
          <section className="mb-8">
            <h2 className="font-semibold text-green-900 mb-4">{t('steps_title')}</h2>
            <ol className="mb-6 flex flex-col gap-2">
              {routineProducts.map((product, index) => (
                <li key={product.id} className="flex gap-3 text-sm text-green-800/80">
                  <span className="shrink-0 font-semibold text-gold-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>
                    {product.routineStep && (
                      <span className="font-semibold text-green-900">{tStep(product.routineStep)} — </span>
                    )}
                    {getLocalized(product.name, l)}
                  </span>
                </li>
              ))}
            </ol>
            <ProductGrid products={routineProducts} locale={locale} />
          </section>
        )}

        {/* How to use */}
        {packHowToUseLines.length > 0 && (
          <section className="mb-8">
            <h2 className="font-semibold text-green-900 mb-4">{t('how_title')}</h2>
            <div className="flex flex-col gap-3">
              {packHowToUseLines.map((line, index) => (
                <p key={`${line}-${index}`} className="text-green-800/80 leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Timeline */}
        <section className="mb-8 p-6 bg-cream rounded-2xl">
          <h2 className="font-semibold text-green-900 mb-2">{t('timeline_title')}</h2>
          <p className="text-green-800/80 leading-relaxed">{t('timeline_body')}</p>
        </section>

        {/* Limits */}
        <section className="mb-8">
          <h2 className="font-semibold text-green-900 mb-2">{t('limits_title')}</h2>
          <p className="text-green-800/70 leading-relaxed">{t('limits_body')}</p>
        </section>

        {/* Cross-sell: powders */}
        {crossSellProducts.length > 0 && (
          <section className="mb-8">
            <h2 className="font-semibold text-green-900 mb-2">{t('crosssell_title')}</h2>
            <p className="text-green-800/70 leading-relaxed mb-6">{t('crosssell_body')}</p>
            <ProductGrid products={crossSellProducts} locale={locale} />
          </section>
        )}

        <div className="mt-10">
          <Disclaimer locale={l} />
        </div>

        {/* Order form — primary CTA */}
        <section className="mt-10 pt-10 border-t border-cream" id="order">
          <h2 className="text-xl font-heading font-bold text-green-900 mb-6">
            {t('order_cta')}
          </h2>
          <OrderForm productOptions={productOptions} defaultProduct={packProduct.id} />

          {/* WhatsApp secondary CTA */}
          {waUrl !== '#' && (
            <p className="mt-6 text-sm text-green-800/60">
              {l === 'fr' ? 'Préférez WhatsApp ?' : 'Prefer WhatsApp?'}{' '}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-green-800 hover:text-green-900"
              >
                {tWa('routine').slice(0, 40)}…
              </a>
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
