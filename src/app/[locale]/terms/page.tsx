// TODO: legal review required before launch
// Must include: CGV compliant with French consumer law, 14-day withdrawal right
// (droit de rétractation — art. L221-18 Code de la consommation), applicable law: French law,
// dispute resolution, prices in EUR including applicable VAT
import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import type { Locale } from '@/types/locale'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.terms' })
  const confirmed = process.env.LEGAL_CONTENT_CONFIRMED === 'true'
  return {
    ...buildMetadata({
      locale: locale as Locale,
      title: t('meta_title'),
      description: t('meta_description'),
      path: '/terms',
    }),
    ...(confirmed ? {} : { robots: { index: false, follow: false } }),
  }
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const confirmed = process.env.LEGAL_CONTENT_CONFIRMED === 'true'
  const tPage = await getTranslations({ locale, namespace: 'pages.terms' })
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
          <h2 className="font-semibold text-green-900 mb-2">{t('terms.scope_title')}</h2>
          <p className="text-sm text-green-800/70 leading-relaxed">{t('terms.scope_body')}</p>
        </section>

        <section className="mb-6">
          <h2 className="font-semibold text-green-900 mb-2">{t('terms.prices_title')}</h2>
          <p className="text-sm text-green-800/70 leading-relaxed">{t('terms.prices_body')}</p>
        </section>

        <section className="mb-6">
          <h2 className="font-semibold text-green-900 mb-2">{t('terms.orders_title')}</h2>
          <p className="text-sm text-green-800/70 leading-relaxed">{t('terms.orders_body')}</p>
        </section>

        <p className="text-sm text-green-800/40 italic mt-8">{t('terms.todo')}</p>
      </div>
    </div>
  )
}
