import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import type { Locale } from '@/types/locale'
import JsonLd, { organizationJsonLd } from '@/components/shared/JsonLd'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.about' })
  return buildMetadata({
    locale: locale as Locale,
    title: t('meta_title'),
    description: t('meta_description'),
    path: '/about',
  })
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'about' })
  const tWa = await getTranslations({ locale, namespace: 'whatsapp' })
  const waUrl = buildWhatsAppUrl(tWa('general'))

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <div className="section-padding">
        <div className="container-pureva max-w-2xl">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-green-900 mb-2">
              {t('headline')}
            </h1>
          </header>

          <section className="mb-8">
            <h2 className="font-semibold text-green-900 mb-3">{t('mission_title')}</h2>
            <p className="text-green-800/80 leading-relaxed">{t('mission_body')}</p>
          </section>

          <section className="mb-8">
            <h2 className="font-semibold text-green-900 mb-3">{t('approach_title')}</h2>
            <p className="text-green-800/80 leading-relaxed mb-3">{t('approach_body')}</p>
            <blockquote className="border-l-4 border-gold-400 pl-4 italic text-green-800/70">
              {t('safe_claim')}
            </blockquote>
          </section>

          <section className="mb-8">
            <h2 className="font-semibold text-green-900 mb-3">{t('contact_title')}</h2>
            <p className="text-green-800/80 leading-relaxed mb-4">{t('contact_body')}</p>
            {waUrl !== '#' && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                WhatsApp
              </a>
            )}
          </section>

          <p className="text-sm text-green-800/40 italic">{t('todo_note')}</p>
        </div>
      </div>
    </>
  )
}
