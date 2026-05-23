import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import FAQAccordionClient, { type FAQItem } from './FAQAccordionClient'
import AnimateOnScroll from '@/components/shared/AnimateOnScroll'
import JsonLd, { faqItemsJsonLd } from '@/components/shared/JsonLd'

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4'] as const

export default async function FAQPreviewSection() {
  const t = await getTranslations('home.faq_preview')

  const items: FAQItem[] = FAQ_KEYS.map((key) => ({
    q: t(key),
    a: t(`a${key.slice(1)}`),
  }))

  return (
    <section className="section-padding bg-cream">
      <JsonLd data={faqItemsJsonLd(items.map((item) => ({ question: item.q, answer: item.a })))} />
      <div className="container-pureva max-w-2xl mx-auto">

        <AnimateOnScroll className="mb-8 text-center">
          <h2 className="font-heading text-2xl font-bold text-green-900 md:text-3xl">
            {t('headline')}
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll delay={60} className="rounded-2xl border border-green-800/10 bg-white p-6 shadow-sm">
          <FAQAccordionClient items={items} />
        </AnimateOnScroll>

        <AnimateOnScroll className="mt-8 text-center" delay={120}>
          <Link
            href="/faq"
            className="text-sm font-medium text-green-800 underline underline-offset-4 hover:text-green-900"
          >
            {t('cta')}
          </Link>
        </AnimateOnScroll>

      </div>
    </section>
  )
}
