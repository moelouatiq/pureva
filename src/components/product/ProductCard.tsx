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

  const categoryLabel: Record<string, string> = {
    pack:   'Pack Routine',
    oil:    'Huile',
    serum:  'Sérum',
    lotion: 'Lotion',
    mask:   'Masque',
    powder: 'Poudre',
  }

  return (
    <article className="group flex flex-col rounded-2xl overflow-hidden border border-cream bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

      {/* Image — padded packshot frame so the full product remains visible. */}
      <Link
        href={`/products/${slug}`}
        className="relative block overflow-hidden bg-cream p-5"
        style={{ aspectRatio: '3/4' }}
        tabIndex={-1}
        aria-hidden
      >
        <ProductImage
          src={product.images[0] ?? ''}
          alt={name}
          className="h-full w-full"
        />

        {/* Category pill (top-left) */}
        {product.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-green-800 shadow-sm backdrop-blur-sm">
            {categoryLabel[product.category] ?? product.category}
          </span>
        )}

        {/* Best-seller badge (top-right) */}
        {product.isBestSeller && (
          <span className="absolute right-3 top-3 rounded-full bg-gold-400/90 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
            Best-seller
          </span>
        )}
      </Link>

      {/* Card body */}
      <div className="flex flex-col flex-1 gap-2 p-4">
        <h3 className="font-semibold text-green-900 leading-snug">
          <Link href={`/products/${slug}`} className="hover:underline hover:underline-offset-2">
            {name}
          </Link>
        </h3>

        <p className="text-sm text-green-800/65 line-clamp-2 flex-1">{shortDesc}</p>

        {/* Price */}
        <div className="mt-1 flex items-center gap-2">
          {product.priceStatus === 'confirmed' ? (
            <>
              <span className="font-bold text-green-900">{formatPrice(product.price, loc)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-green-800/40 line-through">
                  {formatPrice(product.compareAtPrice, loc)}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm italic text-green-800/50">{t('price_placeholder')}</span>
          )}
        </div>

        {/* Size */}
        {product.sizeStatus === 'confirmed' && product.size && (
          <p className="text-xs text-green-800/40">{product.size}</p>
        )}

        {/* CTA button */}
        <Link
          href={`/products/${slug}`}
          className="btn-primary mt-3 w-full text-center text-sm"
        >
          {tCommon('learn_more')}
        </Link>
      </div>
    </article>
  )
}
