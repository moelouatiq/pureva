import { getTranslations } from 'next-intl/server'
import { Leaf, Scissors, Droplets, CircleDot, Sparkles } from 'lucide-react'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

const PROBLEM_CARDS = [
  { key: 'fragile', Icon: Leaf },
  { key: 'casse',   Icon: Scissors },
  { key: 'sec',     Icon: Droplets },
  { key: 'scalp',   Icon: CircleDot },
  { key: 'brillance', Icon: Sparkles },
] as const

export default async function ProblemSection() {
  const t = await getTranslations('home.problem')

  return (
    <section className="section-padding bg-cream">
      <div className="container-pureva">

        {/* Header */}
        <AnimateOnScroll className="mb-10 max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-2xl font-bold text-green-900 md:text-3xl">
            {t('headline')}
          </h2>
          <p className="mt-3 leading-relaxed text-green-800/70">{t('body')}</p>
          <p className="mt-2 text-sm italic text-green-800/45">{t('note')}</p>
        </AnimateOnScroll>

        {/* Problem cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {PROBLEM_CARDS.map(({ key, Icon }, i) => (
            <AnimateOnScroll key={key} delay={i * 60}>
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center shadow-sm transition-shadow duration-200 hover:shadow-md">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-100 text-gold-500">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="font-semibold text-green-900 text-sm leading-snug">
                  {t(`card_${key}_label`)}
                </p>
                <p className="text-xs text-green-800/60 leading-relaxed">
                  {t(`card_${key}_desc`)}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

      </div>
    </section>
  )
}
