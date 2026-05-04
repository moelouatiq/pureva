import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import type { Locale } from '@/types/locale'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.shipping' })
  return buildMetadata({
    locale: locale as Locale,
    title: t('meta_title'),
    description: t('meta_description'),
    path: '/shipping-returns',
  })
}

export default async function ShippingReturnsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'shipping' })

  return (
    <div className="section-padding">
      <div className="container-pureva max-w-3xl">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-green-900 mb-2">
            {t('headline')}
          </h1>
        </header>

        <section className="mb-8">
          <h2 className="font-semibold text-green-900 mb-4">{t('zones_title')}</h2>
          <p className="text-green-800/80 leading-relaxed mb-5">{t('zones_body')}</p>

          <div className="flex flex-col gap-3">
            {(['france', 'europe', 'international'] as const).map((zone) => (
              <div key={zone} className="flex items-center justify-between p-4 bg-white rounded-xl border border-cream">
                <span className="font-medium text-green-900">{t(`${zone}_label`)}</span>
                <span className="text-sm text-green-800/60 italic">{t(`${zone}_delay`)}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-green-800/40 italic mt-4">{t('todo_rates')}</p>
        </section>

        <section>
          <h2 className="font-semibold text-green-900 mb-3">{t('returns_title')}</h2>
          <p className="text-green-800/80 leading-relaxed mb-2">{t('returns_body')}</p>
          <p className="text-sm text-green-800/60">{t('returns_contact')}</p>
          <p className="text-sm text-green-800/40 italic mt-3">{t('todo_policy')}</p>
        </section>
      </div>
    </div>
  )
}
