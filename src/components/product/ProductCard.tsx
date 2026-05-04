import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Product } from '@/types/product'
import type { Locale } from '@/types/locale'
import { formatPrice } from '@/lib/format-price'
import ProductImage from './ProductImage'

type Props = {
  product: Product
  locale: string
}

export default async function ProductCard({ product, locale }: Props) {
  const t = await getTranslations('product')
  const tCommon = await getTranslations('common')

  const loc = locale as Locale
  const name = product.name[loc] ?? product.name.fr
  const shortDesc = product.shortDescription[loc] ?? product.shortDescription.fr
  const slug = product.slug[loc] ?? product.slug.fr

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-cream hover:shadow-md transition-shadow">
      <Link href={`/products/${slug}`} className="block aspect-square overflow-hidden bg-cream">
        <ProductImage
          src={product.images[0] ?? ''}
          alt={name}
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="flex flex-col flex-1 p-4 gap-2">
        {product.isBestSeller && (
          <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
            Best-seller
          </span>
        )}

        <h3 className="font-semibold text-green-900 leading-snug">
          <Link href={`/products/${slug}`} className="hover:underline">
            {name}
          </Link>
        </h3>

        <p className="text-sm text-green-800/70 line-clamp-2 flex-1">{shortDesc}</p>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-cream">
          <div className="flex flex-col">
            {product.priceStatus === 'confirmed' ? (
              <span className="font-bold text-green-900">{formatPrice(product.price, loc)}</span>
            ) : (
              <span className="text-sm italic text-green-800/60">{t('price_placeholder')}</span>
            )}
            {product.sizeStatus === 'confirmed' && product.size ? (
              <span className="text-xs text-green-800/50">{product.size}</span>
            ) : null}
          </div>

          <Link
            href={`/products/${slug}`}
            className="text-sm font-medium text-green-800 hover:text-green-900 underline underline-offset-2"
          >
            {tCommon('learn_more')}
          </Link>
        </div>
      </div>
    </article>
  )
}
