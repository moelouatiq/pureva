import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import {
  buildPublicProductOptions,
  getPublicCrossSellProducts,
  getPublicRoutineProducts,
} from '@/lib/products/public-products'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import Disclaimer from '@/components/shared/Disclaimer'
import RoutineSteps from '@/components/routine/RoutineSteps'
import ProductGrid from '@/components/product/ProductGrid'
import OrderForm from '@/components/order/OrderForm'
import type { Locale } from '@/types/locale'

type Props = {
  params: Promise<{ locale: string }>
}

export const revalidate = 300

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.routine_pack' })
  return buildMetadata({
    locale: locale as Locale,
    title: t('meta_title'),
    description: t('meta_description'),
    path: '/routine-pack',
  })
}

export default async function RoutinePackPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const l = locale as Locale
  const t = await getTranslations({ locale, namespace: 'routine_pack' })
  const tWa = await getTranslations({ locale, namespace: 'whatsapp' })
  const tProduct = await getTranslations({ locale, namespace: 'product' })

  const routineProducts = await getPublicRoutineProducts()
  const crossSellProducts = await getPublicCrossSellProducts()
  const waUrl = buildWhatsAppUrl(tWa('routine'))

  const productOptions = await buildPublicProductOptions(l, tProduct('price_placeholder'))

  return (
    <div className="section-padding">
      <div className="container-pureva max-w-3xl">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-green-900 mb-3">
            {t('headline')}
          </h1>
          <p className="text-green-800/70 text-lg">{t('subtitle')}</p>
        </header>

        {/* Who it's for */}
        <section className="mb-8 p-6 bg-cream rounded-2xl">
          <h2 className="font-semibold text-green-900 mb-2">{t('who_title')}</h2>
          <p className="text-green-800/80 leading-relaxed">{t('who_body')}</p>
        </section>

        {/* What's included */}
        <section className="mb-8">
          <h2 className="font-semibold text-green-900 mb-4">{t('includes_title')}</h2>
          <ul className="flex flex-col gap-2">
            {(['includes_oil', 'includes_mask', 'includes_lotion', 'includes_serum'] as const).map(
              (key) => (
                <li key={key} className="flex gap-3 text-sm text-green-800/80">
                  <span className="text-gold-400 shrink-0 mt-0.5" aria-hidden="true">✦</span>
                  {t(key)}
                </li>
              )
            )}
          </ul>
        </section>

        {/* Routine products grid */}
        {routineProducts.length > 0 && (
          <section className="mb-8">
            <ProductGrid products={routineProducts} locale={locale} />
          </section>
        )}

        {/* How to use */}
        <section className="mb-8">
          <h2 className="font-semibold text-green-900 mb-4">{t('how_title')}</h2>
          <RoutineSteps />
        </section>

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
          <OrderForm productOptions={productOptions} defaultProduct="routine-pack" />

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
