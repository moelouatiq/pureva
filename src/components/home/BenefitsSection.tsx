import { getTranslations } from 'next-intl/server'

const BENEFITS = ['b1', 'b2', 'b3', 'b4'] as const

export default async function BenefitsSection() {
  const t = await getTranslations('home.benefits')

  return (
    <section className="section-padding bg-white">
      <div className="container-pureva">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-green-900 text-center mb-10">
          {t('headline')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {BENEFITS.map((key) => (
            <div key={key} className="flex gap-4 items-start">
              <span className="text-gold-400 text-2xl mt-0.5 shrink-0" aria-hidden="true">✦</span>
              <div>
                <h3 className="font-semibold text-green-900 mb-1">{t(`${key}_title`)}</h3>
                <p className="text-sm text-green-800/70 leading-relaxed">{t(`${key}_desc`)}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-center text-green-800/40 italic mt-8 max-w-xl mx-auto">
          {t('disclaimer')}
        </p>
      </div>
    </section>
  )
}
