import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import { products } from '@/data/products'
import ProductGrid from '@/components/product/ProductGrid'
import type { Locale } from '@/types/locale'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.shop' })
  return buildMetadata({
    locale: locale as Locale,
    title: t('meta_title'),
    description: t('meta_description'),
    path: '/shop',
  })
}

export default async function ShopPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'shop' })

  const routineProducts = products.filter((p) => p.isRoutineProduct)
  const otherProducts = products.filter((p) => !p.isRoutineProduct)

  return (
    <div className="section-padding">
      <div className="container-pureva">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-green-900 mb-2">
            {t('headline')}
          </h1>
          <p className="text-green-800/70">{t('subtitle')}</p>
        </header>

        {routineProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-green-900 mb-6">{t('routine_products')}</h2>
            <ProductGrid products={routineProducts} locale={locale} />
          </section>
        )}

        {otherProducts.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-green-900 mb-6">{t('all_products')}</h2>
            <ProductGrid products={otherProducts} locale={locale} />
          </section>
        )}
      </div>
    </div>
  )
}
