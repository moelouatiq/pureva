import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import ProductImage from '@/components/product/ProductImage'

export default async function HeroSection() {
  const t = await getTranslations('home.hero')

  return (
    <section className="relative overflow-hidden bg-ivory">
      {/* Decorative blobs — aria-hidden, no layout impact */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-gold-100/50 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-green-100/40 blur-3xl" />
      </div>

      <div className="container-pureva relative z-10">
        <div className="flex flex-col items-center gap-10 py-16 md:flex-row md:items-center md:gap-12 md:py-24 lg:py-28">

          {/* Text column */}
          <div className="hero-text-enter flex flex-col gap-5 text-center md:w-[55%] md:text-left">
            <p className="inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-500 md:justify-start">
              <span className="hidden h-px w-8 bg-gold-400 md:inline-block" aria-hidden />
              Pureva
            </p>

            <h1 className="font-heading text-4xl font-bold leading-tight text-green-900 md:text-5xl lg:text-6xl">
              {t('headline')}
            </h1>

            <p className="text-base leading-relaxed text-green-800/70 md:text-lg md:max-w-lg">
              {t('benefit_line')}
            </p>

            <p className="text-sm italic text-green-800/45">
              {t('claim')}
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-1 md:justify-start">
              <Link href="/routine-pack" className="btn-primary">
                {t('cta_primary')}
              </Link>
              <Link href="/shop" className="btn-secondary">
                {t('cta_secondary')}
              </Link>
            </div>
          </div>

          {/* Image column */}
          <div className="hero-image-enter flex w-full justify-center md:w-[45%] md:justify-end">
            <div className="relative w-full max-w-[340px] md:max-w-[420px]">
              {/* Soft glow behind image */}
              <div
                aria-hidden
                className="absolute inset-0 -z-10 scale-90 rounded-3xl bg-gradient-to-br from-gold-100/60 to-cream blur-2xl"
              />
              <div className="overflow-hidden rounded-3xl shadow-2xl shadow-green-900/15 aspect-square">
                <ProductImage
                  src="/images/products/lotion-cuir-chevelu-10%25.png"
                  alt="Routine Cheveux Fragilisés — Pureva"
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
