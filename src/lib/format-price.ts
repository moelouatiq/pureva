import type { Locale } from '@/types/locale'

export function formatPrice(cents: number, locale: Locale = 'fr'): string {
  const amount = cents / 100
  const fractionDigits = cents % 100 === 0 ? 0 : 2

  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: 2,
  }).format(amount)
}
