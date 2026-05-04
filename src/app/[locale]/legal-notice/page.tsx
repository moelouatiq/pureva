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
  return buildMetadata({
    locale: locale as Locale,
    title: t('meta_title'),
    description: t('meta_description'),
    path: '/legal-notice',
  })
}

export default async function LegalNoticePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'pages.legal_notice' })

  return (
    <div className="section-padding">
      <div className="container-pureva max-w-3xl">
        <h1 className="mb-8">{t('title')}</h1>
        <p className="text-sm text-[oklch(0.5_0.02_250)] border border-[var(--color-gold-400)] bg-[var(--color-gold-100)] rounded-lg px-4 py-3">
          {locale === 'fr'
            ? 'Cette page est en cours de rédaction et doit être validée par un professionnel du droit avant la mise en ligne.'
            : 'This page is being drafted and must be reviewed by a legal professional before launch.'}
        </p>
      </div>
    </div>
  )
}
