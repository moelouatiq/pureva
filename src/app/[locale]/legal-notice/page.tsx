// TODO: legal review required before launch
// Must include: publisher identity (name, address, SIRET), hosting provider (Vercel Inc.,
// 340 Pine Street, Suite 401, San Francisco, CA 94104), responsible editor
// Required by French law (LCEN — Loi pour la Confiance dans l'Économie Numérique)
import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import type { Locale } from '@/types/locale'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.legal_notice' })
  const confirmed = process.env.LEGAL_CONTENT_CONFIRMED === 'true'
  return {
    ...buildMetadata({
      locale: locale as Locale,
      title: t('meta_title'),
      description: t('meta_description'),
      path: '/legal-notice',
    }),
    ...(confirmed ? {} : { robots: { index: false, follow: false } }),
  }
}

export default async function LegalNoticePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const confirmed = process.env.LEGAL_CONTENT_CONFIRMED === 'true'
  const tPage = await getTranslations({ locale, namespace: 'pages.legal_notice' })
  const t = await getTranslations({ locale, namespace: 'legal' })

  return (
    <div className="section-padding">
      <div className="container-pureva max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-green-900">
            {tPage('title')}
          </h1>
        </header>

        {!confirmed && (
          <div className="mb-8 rounded-xl border-2 border-red-400 bg-red-50 px-5 py-4">
            <p className="font-semibold text-red-800 text-sm">
              À compléter avant lancement — révision juridique requise
            </p>
          </div>
        )}

        <aside className="mb-8 text-sm border border-gold-400/50 bg-gold-400/10 rounded-xl px-5 py-4 text-green-800/70">
          {t('todo_intro')}
        </aside>

        <section className="mb-6">
          <h2 className="font-semibold text-green-900 mb-2">{t('legal_notice.publisher_title')}</h2>
          <p className="text-sm text-green-800/60 italic">{t('legal_notice.publisher_todo')}</p>
        </section>

        <section className="mb-6">
          <h2 className="font-semibold text-green-900 mb-2">{t('legal_notice.host_title')}</h2>
          <p className="text-sm text-green-800/70">{t('legal_notice.host_body')}</p>
        </section>

        <section className="mb-6">
          <h2 className="font-semibold text-green-900 mb-2">{t('legal_notice.director_title')}</h2>
          <p className="text-sm text-green-800/60 italic">{t('legal_notice.director_todo')}</p>
        </section>
      </div>
    </div>
  )
}
