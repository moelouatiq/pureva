'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import type { Locale } from '@/types/locale'

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale(next: Locale) {
    if (next === locale) return
    router.replace(pathname, { locale: next })
  }

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <button
        onClick={() => switchLocale('fr')}
        aria-label="Passer en français"
        aria-pressed={locale === 'fr'}
        className={`px-2 py-1 rounded transition-colors ${
          locale === 'fr'
            ? 'text-[var(--color-green-800)] font-semibold'
            : 'text-[oklch(0.45_0.02_250)] hover:text-[var(--color-green-800)]'
        }`}
      >
        FR
      </button>
      <span className="text-[oklch(0.75_0_0)] select-none" aria-hidden="true">
        /
      </span>
      <button
        onClick={() => switchLocale('en')}
        aria-label="Switch to English"
        aria-pressed={locale === 'en'}
        className={`px-2 py-1 rounded transition-colors ${
          locale === 'en'
            ? 'text-[var(--color-green-800)] font-semibold'
            : 'text-[oklch(0.45_0.02_250)] hover:text-[var(--color-green-800)]'
        }`}
      >
        EN
      </button>
    </div>
  )
}
