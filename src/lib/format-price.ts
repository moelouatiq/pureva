import type { Locale } from '@/types/locale'

export function formatPrice(cents: number, locale: Locale = 'fr'): string {
  const amount = cents / 100
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount)
}
