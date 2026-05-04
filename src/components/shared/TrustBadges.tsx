import { getTranslations } from 'next-intl/server'
import { brandClaims } from '@/config/brand'
import type { Locale } from '@/types/locale'

type Props = {
  locale: Locale
  className?: string
}

// Maps claim key → a simple SVG checkmark icon and label key
const claimConfig: Array<{ key: keyof typeof brandClaims; labelKey: string }> = [
  { key: 'noParabens', labelKey: 'no_parabens' },
  { key: 'noSilicones', labelKey: 'no_silicones' },
  { key: 'crueltyFree', labelKey: 'cruelty_free' },
  { key: 'naturalOrigin', labelKey: 'natural_origin' },
  { key: 'madeInFrance', labelKey: 'made_in_france' },
  { key: 'organicCertified', labelKey: 'organic_certified' },
  { key: 'dermatologicallyTested', labelKey: 'dermatologically_tested' },
]

const activeClaims = claimConfig.filter(({ key }) => brandClaims[key] === true)

export default async function TrustBadges({ locale, className = '' }: Props) {
  // Render nothing if no claims are explicitly confirmed true
  if (activeClaims.length === 0) return null

  const t = await getTranslations({ locale, namespace: 'trust' })

  return (
    <ul
      aria-label="Engagements produit"
      className={`flex flex-wrap gap-3 ${className}`}
    >
      {activeClaims.map(({ key, labelKey }) => (
        <li
          key={key}
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-[var(--color-green-700)] bg-[var(--color-green-50)] text-sm font-medium"
          style={{ color: 'var(--color-green-800)' }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="6.5" stroke="currentColor" />
            <path
              d="M4 7l2 2 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t(labelKey as Parameters<typeof t>[0])}
        </li>
      ))}
    </ul>
  )
}
