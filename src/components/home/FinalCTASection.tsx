import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import ProductImage from '@/components/product/ProductImage'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

export default async function FinalCTASection() {
  const t = await getTranslations('home.final_cta')
  const tWa = await getTranslations('whatsapp')
  const waUrl = buildWhatsAppUrl(tWa('routine'))

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
            <p className="text-ivory/70 leading-relaxed">{t('body')}</p>

            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <Link href="/routine-pack" className="btn-primary">
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
                  src="/images/products/lotion-cuir-chevelu-10%25.png"
                  alt="Routine Cheveux Fragilisés — Pureva"
                  className="aspect-square h-full w-full"
                />
              </div>
            </div>
          </AnimateOnScroll>

        </div>
      </div>
    </section>
  )
}
