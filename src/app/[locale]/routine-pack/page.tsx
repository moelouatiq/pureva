import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import Disclaimer from '@/components/shared/Disclaimer'
import type { Locale } from '@/types/locale'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.routine_pack' })
  return buildMetadata({
    locale: locale as Locale,
    title: t('meta_title'),
    description: t('meta_description'),
    path: '/routine-pack',
  })
}

export default async function RoutinePackPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'pages.routine_pack' })

  return (
    <div className="section-padding">
      <div className="container-pureva max-w-3xl">
        <h1>{t('title')}</h1>
        <div className="mt-10">
          <Disclaimer locale={locale as Locale} />
        </div>
      </div>
    </div>
  )
}
