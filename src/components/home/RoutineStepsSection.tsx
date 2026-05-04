import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

const STEPS = ['step1', 'step2', 'step3', 'step4'] as const

export default async function RoutineStepsSection() {
  const t = await getTranslations('home.routine_steps')

  return (
    <section className="section-padding bg-white">
      <div className="container-pureva">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-green-900 mb-2">
            {t('headline')}
          </h2>
          <p className="text-green-800/70">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step} className="flex flex-col gap-3 p-5 bg-cream rounded-2xl">
              <span className="text-3xl font-heading font-bold text-gold-400/60">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-semibold text-green-900">{t(`${step}_label`)}</h3>
              <p className="text-sm text-green-800/70 leading-relaxed">{t(`${step}_desc`)}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/routine-pack" className="btn-primary inline-block">
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  )
}
