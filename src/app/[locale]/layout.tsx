import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CookieBanner from '@/components/shared/CookieBanner'
import type { Locale } from '@/types/locale'
import '../globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Pureva',
    default: 'Pureva — Routine naturelle pour des cheveux plus forts',
  },
  description:
    'Pureva — soins capillaires naturels pour les cheveux fragilisés. Aide à réduire la casse et à fortifier les cheveux.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  // Required for static rendering with next-intl.
  // Must be called before any async i18n function (getMessages, getTranslations, etc.)
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale as Locale} />
          <main id="main-content">{children}</main>
          <Footer locale={locale as Locale} />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
