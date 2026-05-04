import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

const INGREDIENTS = [
  'fenugreek',
  'amla',
  'rosemary',
  'nigella',
  'shea',
  'keratin',
] as const

export default async function IngredientsPreviewSection() {
  const t = await getTranslations('home.ingredients_preview')

  return (
    <section className="section-padding bg-green-900 text-ivory">
      <div className="container-pureva">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2">{t('headline')}</h2>
          <p className="text-ivory/70">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {INGREDIENTS.map((key) => (
            <div key={key} className="bg-green-800/40 rounded-xl p-4 flex flex-col gap-1">
              <h3 className="font-semibold text-gold-400 text-sm">{t(`${key}_name`)}</h3>
              <p className="text-xs text-ivory/70 leading-relaxed">{t(`${key}_desc`)}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/ingredients" className="btn-secondary border-ivory/30 text-ivory hover:bg-ivory/10">
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  )
}
