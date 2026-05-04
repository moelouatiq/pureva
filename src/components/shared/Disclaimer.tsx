import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/types/locale'

type Props = {
  locale: Locale
}

export default async function Disclaimer({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'disclaimer' })

  return (
    <aside
      role="note"
      aria-label="Avertissement / Disclaimer"
      className="rounded-lg border border-[var(--color-brown-600)]/30 bg-[var(--color-gold-100)] px-5 py-4"
    >
      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-brown-800)' }}>
        {t('text')}
      </p>
    </aside>
  )
}
