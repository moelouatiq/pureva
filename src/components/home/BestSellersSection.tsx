import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getBestSellers } from '@/data/products'
import ProductCard from '@/components/product/ProductCard'

type Props = { locale: string }

export default async function BestSellersSection({ locale }: Props) {
  const t = await getTranslations('home.best_sellers')
  const products = getBestSellers()

  if (products.length === 0) return null

  return (
    <section className="section-padding bg-ivory">
      <div className="container-pureva">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-green-900">
              {t('headline')}
            </h2>
            <p className="text-green-800/70 mt-1">{t('subtitle')}</p>
          </div>
          <Link href="/shop" className="text-sm font-medium text-green-800 underline underline-offset-2 shrink-0">
            {t('cta')}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}
