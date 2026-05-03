export type Locale = 'fr' | 'en'
export type LocalizedString = Record<Locale, string>
export type LocalizedStringArray = Record<Locale, string[]>

export const locales = ['fr', 'en'] as const
export const defaultLocale = 'fr' as const satisfies Locale
