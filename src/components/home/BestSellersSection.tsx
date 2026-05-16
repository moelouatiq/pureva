import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getPublicBestSellers } from '@/lib/products/public-products'
import ProductCard from '@/components/product/ProductCard'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

type Props = { locale: string }

export default async function BestSellersSection({ locale }: Props) {
  const t = await getTranslations('home.best_sellers')
  const products = await getPublicBestSellers()

  if (products.length === 0) return null

  return (
    <section className="section-padding bg-ivory">
      <div className="container-pureva">

        <AnimateOnScroll className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-gold-500">
              Sélection Pureva
            </p>
            <h2 className="font-heading text-2xl font-bold text-green-900 md:text-3xl">
              {t('headline')}
            </h2>
            <p className="mt-1 text-green-800/65">{t('subtitle')}</p>
          </div>
          <Link
            href="/shop"
            className="shrink-0 text-sm font-medium text-green-800 underline underline-offset-4 hover:text-green-900"
          >
            {t('cta')}
          </Link>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
            <AnimateOnScroll key={product.id} delay={i * 60}>
              <ProductCard product={product} locale={locale} />
            </AnimateOnScroll>
          ))}
        </div>

      </div>
    </section>
  )
}
