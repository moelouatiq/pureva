import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ingredients } from '@/data/ingredients'
import IngredientImageItem from './IngredientImageItem'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

// Only show the 8 ingredients that have confirmed images
const SHOWN_IDS = ['fenugreek', 'amla', 'rosemary', 'nigella', 'hibiscus', 'nettle', 'licorice', 'clove']

export default async function IngredientsPreviewSection() {
  const t = await getTranslations('home.ingredients_preview')
  const shown = SHOWN_IDS
    .map((id) => ingredients.find((ing) => ing.id === id))
    .filter(Boolean) as typeof ingredients

  return (
    <section className="section-padding bg-green-900 text-ivory">
      <div className="container-pureva">

        {/* Header */}
        <AnimateOnScroll className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-gold-400/80">
            Botanique
          </p>
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            {t('headline')}
          </h2>
          <p className="mt-2 text-ivory/65 md:max-w-xl md:mx-auto">{t('subtitle')}</p>
        </AnimateOnScroll>

        {/* Ingredient grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {shown.map((ing, i) => {
            const name = ing.name.fr
            const benefit = ing.benefit.fr

            return (
              <AnimateOnScroll key={ing.id} delay={i * 50}>
                <div className="group flex flex-col overflow-hidden rounded-2xl bg-green-800/40 transition-colors duration-200 hover:bg-green-800/60">
                  {/* Image */}
                  <div className="overflow-hidden rounded-t-2xl">
                    <IngredientImageItem src={ing.image} alt={name} />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-1.5 p-4">
                    <h3 className="font-semibold text-gold-400 text-sm leading-snug">{name}</h3>
                    <p className="text-xs text-ivory/60 leading-relaxed">{benefit}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            )
          })}
        </div>

        {/* CTA */}
        <AnimateOnScroll className="mt-10 text-center" delay={400}>
          <Link
            href="/ingredients"
            className="btn-secondary border-ivory/30 text-ivory hover:bg-ivory/10"
          >
            {t('cta')}
          </Link>
        </AnimateOnScroll>

      </div>
    </section>
  )
}
