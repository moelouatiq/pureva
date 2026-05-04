import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import IngredientCard from '@/components/ingredients/IngredientCard'
import { ingredients } from '@/data/ingredients'
import type { Locale } from '@/types/locale'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.ingredients' })
  return buildMetadata({
    locale: locale as Locale,
    title: t('meta_title'),
    description: t('meta_description'),
    path: '/ingredients',
  })
}

export default async function IngredientsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const l = locale as Locale
  const t = await getTranslations({ locale, namespace: 'ingredients' })

  return (
    <div className="section-padding">
      <div className="container-pureva">
        <header className="mb-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-green-900 mb-3">
            {t('headline')}
          </h1>
          <p className="text-green-800/70">{t('subtitle')}</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {ingredients.map((ingredient) => (
            <IngredientCard
              key={ingredient.id}
              name={ingredient.name[l]}
              description={ingredient.description[l]}
              benefit={ingredient.benefit[l]}
              image={ingredient.image}
            />
          ))}
        </div>

        <aside className="max-w-2xl p-5 rounded-2xl bg-cream text-sm text-green-800/70 leading-relaxed">
          {t('disclaimer')}
        </aside>
      </div>
    </div>
  )
}
