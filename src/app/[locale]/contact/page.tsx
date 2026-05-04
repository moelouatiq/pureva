import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import WhatsAppCTA from '@/components/shared/WhatsAppCTA'
import type { Locale } from '@/types/locale'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.contact' })
  return buildMetadata({
    locale: locale as Locale,
    title: t('meta_title'),
    description: t('meta_description'),
    path: '/contact',
  })
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'pages.contact' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tWhatsapp = await getTranslations({ locale, namespace: 'whatsapp' })

  return (
    <div className="section-padding">
      <div className="container-pureva max-w-2xl">
        <h1 className="mb-8">{t('title')}</h1>
        <WhatsAppCTA
          message={tWhatsapp('general')}
          label={tCommon('whatsapp_question')}
          variant="banner"
        />
      </div>
    </div>
  )
}
