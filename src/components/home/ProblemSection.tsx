import { getTranslations } from 'next-intl/server'

export default async function ProblemSection() {
  const t = await getTranslations('home.problem')

  return (
    <section className="section-padding bg-cream">
      <div className="container-pureva max-w-2xl text-center mx-auto">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-green-900 mb-4">
          {t('headline')}
        </h2>
        <p className="text-green-800/80 leading-relaxed mb-3">{t('body')}</p>
        <p className="text-sm text-green-800/50 italic">{t('note')}</p>
      </div>
    </section>
  )
}
