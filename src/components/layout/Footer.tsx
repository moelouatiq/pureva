import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import LanguageSwitcher from './LanguageSwitcher'
import type { Locale } from '@/types/locale'

type Props = {
  locale: Locale
}

export default async function Footer({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'footer' })
  const whatsappUrl = buildWhatsAppUrl(
    locale === 'fr'
      ? 'Bonjour, j\'ai une question sur les produits Pureva.'
      : 'Hello, I have a question about Pureva products.'
  )
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[var(--color-green-900)] text-[var(--color-ivory)]">
      <div className="container-pureva py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <span
              className="block text-2xl font-bold tracking-tight mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Pureva
            </span>
            <p className="text-sm leading-relaxed text-[var(--color-green-100)] mb-5">
              {t('brand_description')}
            </p>
            {whatsappUrl !== '#' && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-whatsapp)] hover:opacity-80 transition-opacity"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M10 0C4.477 0 0 4.477 0 10c0 1.764.463 3.416 1.27 4.847L0 20l5.302-1.238A9.955 9.955 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm4.914 14.2c-.21.588-1.22 1.13-1.68 1.19-.43.057-.972.08-1.568-.098-.36-.108-.824-.254-1.416-.496-2.488-1.074-4.11-3.6-4.235-3.767-.123-.167-1.007-1.34-1.007-2.556 0-1.215.637-1.813.863-2.062.225-.25.49-.313.653-.313.163 0 .326.002.47.008.15.007.352-.057.55.42.205.49.696 1.69.757 1.813.06.122.1.266.02.43-.08.163-.12.265-.24.408-.12.143-.252.32-.36.43-.12.12-.245.25-.105.49.14.24.62 1.023 1.33 1.657.915.812 1.688 1.063 1.928 1.183.24.12.38.1.52-.06.14-.163.597-.697.757-.937.16-.24.32-.2.54-.12.22.08 1.396.658 1.636.778.24.12.4.18.46.28.06.1.06.575-.15 1.163z"/>
                </svg>
                {t('whatsapp_label')}
              </a>
            )}
          </div>

          {/* Products column */}
          <div>
            <h3
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-gold-400)' }}
            >
              {t('sections.shop_title')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/shop" className="text-[var(--color-green-100)] hover:text-white transition-colors">
                  {t('links.shop')}
                </Link>
              </li>
              <li>
                <Link href="/routine-pack" className="text-[var(--color-green-100)] hover:text-white transition-colors">
                  {t('links.routine')}
                </Link>
              </li>
              <li>
                <Link href="/ingredients" className="text-[var(--color-green-100)] hover:text-white transition-colors">
                  {t('links.ingredients')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Info column */}
          <div>
            <h3
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-gold-400)' }}
            >
              {t('sections.legal_title')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/faq" className="text-[var(--color-green-100)] hover:text-white transition-colors">
                  {t('links.faq')}
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="text-[var(--color-green-100)] hover:text-white transition-colors">
                  {t('links.shipping')}
                </Link>
              </li>
              <li>
                <Link href="/legal-notice" className="text-[var(--color-green-100)] hover:text-white transition-colors">
                  {t('links.legal_notice')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[var(--color-green-100)] hover:text-white transition-colors">
                  {t('links.terms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[var(--color-green-100)] hover:text-white transition-colors">
                  {t('links.privacy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact + language column */}
          <div>
            <h3
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-gold-400)' }}
            >
              {t('sections.contact_title')}
            </h3>
            <ul className="space-y-2.5 text-sm mb-6">
              <li>
                <Link href="/contact" className="text-[var(--color-green-100)] hover:text-white transition-colors">
                  {t('links.contact')}
                </Link>
              </li>
            </ul>
            <div>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--color-gold-400)' }}>
                {t('language_label')}
              </p>
              <div className="text-[var(--color-green-100)]">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--color-green-800)] text-xs text-[var(--color-green-100)]">
          {t('copyright', { year })}
        </div>
      </div>
    </footer>
  )
}
