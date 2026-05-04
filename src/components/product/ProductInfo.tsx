import { getTranslations } from 'next-intl/server'
import type { Product } from '@/types/product'
import type { Locale } from '@/types/locale'
import { formatPrice } from '@/lib/format-price'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import Disclaimer from '@/components/shared/Disclaimer'

type Props = {
  product: Product
  locale: string
}

export default async function ProductInfo({ product, locale }: Props) {
  const t = await getTranslations('product')

  const loc = locale as Locale
  const longDesc = product.longDescription[loc] ?? product.longDescription.fr
  const benefits = product.benefits[loc] ?? product.benefits.fr
  const howToUse = product.howToUse[loc] ?? product.howToUse.fr
  const ingredients = product.ingredients[loc] ?? product.ingredients.fr
  const precautions = product.precautions[loc] ?? product.precautions.fr
  const waMsg = product.whatsappMessage[loc] ?? product.whatsappMessage.fr
  const waUrl = buildWhatsAppUrl(waMsg)

  return (
    <div className="flex flex-col gap-6">
      {/* Price and size */}
      <div className="flex flex-wrap items-baseline gap-4">
        {product.priceStatus === 'confirmed' ? (
          <span className="text-2xl font-bold text-green-900">{formatPrice(product.price, loc)}</span>
        ) : (
          <span className="text-base italic text-green-800/60">{t('price_placeholder')}</span>
        )}
        {product.compareAtPrice && product.priceStatus === 'confirmed' && (
          <span className="text-sm line-through text-green-800/40">
            {formatPrice(product.compareAtPrice!, loc)}
          </span>
        )}
        {product.sizeStatus === 'confirmed' && product.size ? (
          <span className="text-sm text-green-800/60">{product.size}</span>
        ) : product.sizeStatus === 'placeholder' ? (
          <span className="text-sm italic text-green-800/40">{t('size_placeholder')}</span>
        ) : null}
      </div>

      {/* Stock status */}
      <div>
        {product.stockStatus === 'in_stock' && (
          <span className="text-sm font-medium text-emerald-700">{t('in_stock')}</span>
        )}
        {product.stockStatus === 'low_stock' && (
          <span className="text-sm font-medium text-amber-600">{t('low_stock')}</span>
        )}
        {product.stockStatus === 'out_of_stock' && (
          <span className="text-sm font-medium text-red-600">{t('out_of_stock')}</span>
        )}
      </div>

      {/* Description */}
      <p className="text-green-800/80 leading-relaxed">{longDesc}</p>

      {/* CTA */}
      {waUrl !== '#' && product.stockStatus !== 'out_of_stock' && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2 self-start"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.118 1.523 5.847L.057 23.882l6.222-1.449A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 0 1-5.003-1.374l-.36-.214-3.729.868.883-3.63-.235-.373A9.76 9.76 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
          </svg>
          {t('whatsapp_cta')}
        </a>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <section>
          <h2 className="font-semibold text-green-900 mb-3">{t('benefits_label')}</h2>
          <ul className="flex flex-col gap-2">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex gap-2 text-sm text-green-800/80">
                <span className="text-gold-400 mt-0.5 shrink-0" aria-hidden="true">✦</span>
                {benefit}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* How to use */}
      {howToUse && (
        <section>
          <h2 className="font-semibold text-green-900 mb-2">{t('how_to_use_label')}</h2>
          <p className="text-sm text-green-800/80 leading-relaxed whitespace-pre-line">{howToUse}</p>
        </section>
      )}

      {/* Ingredients */}
      {ingredients && (
        <section>
          <h2 className="font-semibold text-green-900 mb-2">{t('ingredients_label')}</h2>
          <p className="text-xs text-green-800/60 leading-relaxed font-mono">{ingredients}</p>
        </section>
      )}

      {/* Precautions */}
      {precautions && (
        <section>
          <h2 className="font-semibold text-green-900 mb-2">{t('precautions_label')}</h2>
          <p className="text-sm text-green-800/70 leading-relaxed">{precautions}</p>
        </section>
      )}

      <Disclaimer locale={loc} />
    </div>
  )
}
