import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import { buildPublicProductOptions } from '@/lib/products/public-products'
import WhatsAppCTA from '@/components/shared/WhatsAppCTA'
import OrderForm from '@/components/order/OrderForm'
import type { Locale } from '@/types/locale'

type Props = {
  params: Promise<{ locale: string }>
}

export const revalidate = 300

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

  const l = locale as Locale
  const t = await getTranslations({ locale, namespace: 'contact' })
  const tWa = await getTranslations({ locale, namespace: 'whatsapp' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tProduct = await getTranslations({ locale, namespace: 'product' })

  const productOptions = await buildPublicProductOptions(l, tProduct('price_placeholder'))

  return (
    <div className="section-padding">
      <div className="container-pureva max-w-2xl">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-green-900 mb-2">
            {t('headline')}
          </h1>
        </header>

        <section className="mb-8 p-6 bg-cream rounded-2xl">
          <h2 className="font-semibold text-green-900 mb-2">{t('how_to_order_title')}</h2>
          <p className="text-green-800/80 leading-relaxed">{t('how_to_order_body')}</p>
        </section>

        <section className="mb-8">
          <h2 className="font-semibold text-green-900 mb-3">{t('whatsapp_title')}</h2>
          <p className="text-green-800/70 leading-relaxed mb-4">{t('whatsapp_body')}</p>
          <WhatsAppCTA
            message={tWa('general')}
            label={tCommon('whatsapp_question')}
            variant="button"
          />
        </section>

        <section className="mb-8">
          <h2 className="font-semibold text-green-900 mb-2">{t('form_title')}</h2>
          <p className="text-green-800/70 leading-relaxed mb-6">{t('form_intro')}</p>
          <OrderForm productOptions={productOptions} />
        </section>

        <div className="mt-4 flex flex-col gap-1">
          <p className="text-sm text-green-800/50">{t('response_time')}</p>
          <p className="text-sm text-green-800/50">{t('shipping_note')}</p>
        </div>
      </div>
    </div>
  )
}
