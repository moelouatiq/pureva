import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { formatPrice } from '@/lib/format-price'
import ProductImage from '@/components/product/ProductImage'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'
import type { Locale } from '@/types/locale'
import type { Product } from '@/types/product'

type Props = {
  locale: Locale
  routinePackProduct?: Product
}

export default async function FinalCTASection({ locale, routinePackProduct }: Props) {
  const t = await getTranslations('home.final_cta')
  const tWa = await getTranslations('whatsapp')
  const tProduct = await getTranslations('product')
  const routinePackName = routinePackProduct?.name[locale] || routinePackProduct?.name.fr
  const routinePackImage = routinePackProduct?.images[0]
  const routinePackDescription =
    routinePackProduct?.shortDescription[locale] ||
    routinePackProduct?.shortDescription.fr ||
    routinePackProduct?.longDescription[locale] ||
    routinePackProduct?.longDescription.fr
  const routinePackBenefits =
    routinePackProduct?.benefits[locale] || routinePackProduct?.benefits.fr || []
  const routinePackSize =
    routinePackProduct?.sizeStatus === 'confirmed' ? routinePackProduct.size : undefined
  const routinePackPrice =
    routinePackProduct?.priceStatus === 'confirmed' && routinePackProduct.price > 0
      ? formatPrice(routinePackProduct.price, locale)
      : tProduct('price_placeholder')
  const routinePackCompareAtPrice =
    routinePackProduct?.compareAtPrice &&
    routinePackProduct.priceStatus === 'confirmed' &&
    routinePackProduct.compareAtPrice > routinePackProduct.price
      ? formatPrice(routinePackProduct.compareAtPrice, locale)
      : undefined
  const routineMessage =
    routinePackProduct?.whatsappMessage[locale] ||
    routinePackProduct?.whatsappMessage.fr ||
    tWa('routine')
  const waUrl = buildWhatsAppUrl(routineMessage)

  return (
    <section className="relative overflow-hidden bg-green-900 text-ivory section-padding">
      {/* Decorative glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-green-700/30 blur-3xl" />
      </div>

      <div className="container-pureva relative z-10">
        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">

          {/* Text */}
          <AnimateOnScroll className="flex flex-col gap-5 text-center md:w-[55%] md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-400/80">
              Pureva
            </p>
            <h2 className="font-heading text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
              {t('headline')}
            </h2>
            {routinePackName && (
              <h3 className="text-lg font-semibold text-gold-300">{routinePackName}</h3>
            )}
            <p className="text-ivory/70 leading-relaxed">
              {routinePackDescription || t('body')}
            </p>
            {routinePackProduct && (
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <span className="rounded-full bg-ivory px-4 py-2 text-sm font-semibold text-green-900">
                  {routinePackPrice}
                </span>
                {routinePackCompareAtPrice && (
                  <span className="text-sm text-ivory/45 line-through">
                    {routinePackCompareAtPrice}
                  </span>
                )}
                {routinePackSize && <span className="text-sm text-ivory/60">{routinePackSize}</span>}
                <span className="text-sm text-ivory/60">
                  {tProduct(routinePackProduct.stockStatus)}
                </span>
              </div>
            )}
            {routinePackBenefits.length > 0 && (
              <ul className="flex flex-col gap-2 text-left">
                {routinePackBenefits.slice(0, 3).map((benefit) => (
                  <li key={benefit} className="flex gap-2 text-sm text-ivory/70">
                    <span className="text-gold-400 shrink-0" aria-hidden="true">+</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <Link href={routinePackProduct ? '/routine-pack' : '/shop'} className="btn-primary">
                {t('cta_primary')}
              </Link>
              {waUrl !== '#' && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary border-ivory/30 text-ivory hover:bg-ivory/10"
                >
                  {t('cta_secondary')}
                </a>
              )}
            </div>
          </AnimateOnScroll>

          {/* Product image */}
          {routinePackImage && routinePackName && (
            <AnimateOnScroll
              delay={120}
              className="hidden md:flex md:w-[45%] justify-end"
            >
              <div className="relative w-full max-w-[360px]">
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 scale-90 rounded-3xl bg-gradient-to-br from-gold-400/20 to-transparent blur-2xl"
                />
                <div
                  className="overflow-hidden rounded-3xl bg-cream p-6 shadow-2xl shadow-black/30"
                  style={{ transform: 'rotate(-2deg)' }}
                >
                  <ProductImage
                    src={routinePackImage}
                    alt={`${routinePackName} - Pureva`}
                    className="aspect-square h-full w-full"
                  />
                </div>
              </div>
            </AnimateOnScroll>
          )}

        </div>
      </div>
    </section>
  )
}
