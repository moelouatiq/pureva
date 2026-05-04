import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import { shippingZones } from '@/data/shipping-zones'
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
  const t = await getTranslations({ locale, namespace: 'pages.shipping' })
  const l = locale as Locale

  return (
    <div className="section-padding">
      <div className="container-pureva max-w-3xl">
        <h1 className="mb-10">{t('title')}</h1>
        <div className="space-y-6">
          {shippingZones.map((zone) => (
            <div
              key={zone.id}
              className="rounded-xl border border-[var(--color-cream)] bg-white px-6 py-5"
            >
              <h2 className="text-lg mb-1">{zone.name[l]}</h2>
              <p className="text-sm" style={{ color: 'var(--color-brown-700)' }}>
                {zone.estimatedDelivery[l]}
              </p>
              {zone.note && (
                <p className="text-sm mt-2 text-[oklch(0.45_0.02_250)]">
                  {zone.note[l]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
