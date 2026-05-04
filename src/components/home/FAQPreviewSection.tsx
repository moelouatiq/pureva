import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4'] as const

export default async function FAQPreviewSection() {
  const t = await getTranslations('home.faq_preview')

  return (
    <section className="section-padding bg-cream">
      <div className="container-pureva max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-green-900 mb-8 text-center">
          {t('headline')}
        </h2>

        <div className="flex flex-col divide-y divide-green-800/10">
          {FAQ_KEYS.map((key) => (
            <details key={key} className="group py-4">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-green-900 gap-4">
                {t(key)}
                <span className="text-gold-400 text-lg shrink-0 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 text-sm text-green-800/70 leading-relaxed">{t(`a${key.slice(1)}`)}</p>
            </details>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/faq" className="text-sm font-medium text-green-800 underline underline-offset-2">
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  )
}
