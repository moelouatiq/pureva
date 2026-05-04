import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import type { Locale } from '@/types/locale'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return buildMetadata({
    locale: locale as Locale,
    title: t('meta_title'),
    description: t('meta_description'),
    path: '',
  })
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'home' })

  return (
    <div className="section-padding">
      <div className="container-pureva">
        <h1>{t('hero.headline')}</h1>
        <p className="mt-4 text-lg" style={{ color: 'var(--color-brown-700)' }}>
          {t('hero.claim')}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a href={`/${locale}/routine-pack`} className="btn-primary">
            {t('hero.cta_primary')}
          </a>
          <a href={`/${locale}/shop`} className="btn-secondary">
            {t('hero.cta_secondary')}
          </a>
        </div>
      </div>
    </div>
  )
}
