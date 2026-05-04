import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

const STEPS = [
  { key: 'step1', product: 'Huile Capillaire', color: 'bg-gold-100 text-gold-600' },
  { key: 'step2', product: 'Masque ou Poudre', color: 'bg-green-100 text-green-700' },
  { key: 'step3', product: 'Lotion Cuir Chevelu', color: 'bg-cream text-brown-700' },
  { key: 'step4', product: 'Sérum Capillaire', color: 'bg-ivory text-green-800' },
] as const

export default async function RoutineStepsSection() {
  const t = await getTranslations('home.routine_steps')

  return (
    <section className="section-padding bg-white">
      <div className="container-pureva">

        {/* Header */}
        <AnimateOnScroll className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-gold-500">
            La routine Pureva
          </p>
          <h2 className="font-heading text-2xl font-bold text-green-900 md:text-3xl">
            {t('headline')}
          </h2>
          <p className="mt-2 text-green-800/60">{t('subtitle')}</p>
        </AnimateOnScroll>

        {/* Steps grid */}
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* Desktop connector line */}
          <div
            aria-hidden
            className="absolute top-8 left-[12.5%] right-[12.5%] hidden h-px bg-gradient-to-r from-transparent via-gold-200 to-transparent lg:block"
          />

          {STEPS.map(({ key, product, color }, i) => (
            <AnimateOnScroll key={key} delay={i * 80}>
              <div className="relative flex flex-col gap-4 rounded-2xl border border-cream bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">

                {/* Step number circle */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold-200 bg-ivory text-xl font-bold font-heading text-gold-500 shadow-sm">
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Product pill */}
                <span className={`inline-flex w-fit rounded-full px-3 py-0.5 text-xs font-semibold ${color}`}>
                  {product}
                </span>

                <div className="flex flex-col gap-1.5">
                  <h3 className="font-semibold text-green-900 leading-snug">
                    {t(`${key}_label`)}
                  </h3>
                  <p className="text-sm text-green-800/65 leading-relaxed">
                    {t(`${key}_desc`)}
                  </p>
                </div>

              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* CTA */}
        <AnimateOnScroll className="mt-10 text-center" delay={320}>
          <Link href="/routine-pack" className="btn-primary">
            {t('cta')}
          </Link>
        </AnimateOnScroll>

      </div>
    </section>
  )
}
