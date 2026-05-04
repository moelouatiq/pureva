import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import FAQAccordion from '@/components/shared/FAQAccordion'
import { faqs } from '@/data/faqs'
import type { Locale } from '@/types/locale'
import JsonLd, { faqJsonLd } from '@/components/shared/JsonLd'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.faq' })
  return buildMetadata({
    locale: locale as Locale,
    title: t('meta_title'),
    description: t('meta_description'),
    path: '/faq',
  })
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const l = locale as Locale
  const t = await getTranslations({ locale, namespace: 'pages.faq' })

  const items = faqs.map((faq) => ({
    id: faq.id,
    question: faq.question[l],
    answer: faq.answer[l],
  }))

  return (
    <>
      <JsonLd data={faqJsonLd(faqs, l)} />
      <div className="section-padding">
        <div className="container-pureva max-w-3xl">
          <h1 className="mb-10">{t('title')}</h1>
          <FAQAccordion items={items} />
        </div>
      </div>
    </>
  )
}
