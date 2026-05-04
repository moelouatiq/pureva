import { getTranslations } from 'next-intl/server'
import { FileText, ListChecks, BookOpen, MessageCircle } from 'lucide-react'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'

const ICONS = [FileText, ListChecks, BookOpen, MessageCircle]
const KEYS = ['b1', 'b2', 'b3', 'b4'] as const

export default async function BenefitsSection() {
  const t = await getTranslations('home.benefits')

  return (
    <section className="section-padding bg-white">
      <div className="container-pureva">

        <AnimateOnScroll className="mb-10 text-center">
          <h2 className="font-heading text-2xl font-bold text-green-900 md:text-3xl">
            {t('headline')}
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {KEYS.map((key, i) => {
            const Icon = ICONS[i]
            return (
              <AnimateOnScroll key={key} delay={i * 70}>
                <div className="flex gap-4 rounded-2xl border border-cream bg-ivory p-6 transition-shadow duration-200 hover:shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-500">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-green-900">{t(`${key}_title`)}</h3>
                    <p className="text-sm text-green-800/65 leading-relaxed">{t(`${key}_desc`)}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            )
          })}
        </div>

        <AnimateOnScroll className="mt-8 text-center" delay={280}>
          <p className="text-xs italic text-green-800/40 max-w-xl mx-auto">
            {t('disclaimer')}
          </p>
        </AnimateOnScroll>

      </div>
    </section>
  )
}
