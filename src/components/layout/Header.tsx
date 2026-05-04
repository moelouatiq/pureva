import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import LanguageSwitcher from './LanguageSwitcher'
import MobileMenu from './MobileMenu'
import LogoImage from '@/components/shared/LogoImage'
import type { Locale } from '@/types/locale'

type Props = {
  locale: Locale
}

export default async function Header({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'nav' })
  const tHeader = await getTranslations({ locale, namespace: 'header' })

  const whatsappUrl = buildWhatsAppUrl(
    locale === 'fr'
      ? 'Bonjour, j\'ai une question sur les produits Pureva.'
      : 'Hello, I have a question about Pureva products.'
  )

  const navItems = [
    { href: '/shop', label: t('shop') },
    { href: '/routine-pack', label: t('routine') },
    { href: '/ingredients', label: t('ingredients') },
    { href: '/about', label: t('about') },
    { href: '/faq', label: t('faq') },
    { href: '/contact', label: t('contact') },
  ]

  return (
    <header className="sticky top-0 z-30 bg-[var(--color-ivory)]/95 backdrop-blur-sm border-b border-[var(--color-cream)]">
      <div className="container-pureva">
        <div className="flex items-center justify-between py-3 md:py-5">
          {/* Logo */}
          <Link
            href="/"
            aria-label={tHeader('logo_alt')}
            className="flex items-center shrink-0"
          >
            <LogoImage
              alt={locale === 'fr' ? 'Logo Pureva' : 'Pureva logo'}
              className="h-[60px] w-auto md:h-[100px] md:w-auto"
              fallbackClassName="text-2xl font-bold tracking-tight font-heading text-green-800"
            />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium rounded-md text-[oklch(0.35_0.02_250)] hover:text-[var(--color-green-800)] hover:bg-[var(--color-green-100)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop: right-side utilities */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />

            {whatsappUrl !== '#' && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tHeader('whatsapp_aria')}
                className="flex items-center justify-center w-9 h-9 rounded-md text-[var(--color-whatsapp)] hover:bg-[var(--color-green-100)] transition-colors"
              >
                <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M10 0C4.477 0 0 4.477 0 10c0 1.764.463 3.416 1.27 4.847L0 20l5.302-1.238A9.955 9.955 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm4.914 14.2c-.21.588-1.22 1.13-1.68 1.19-.43.057-.972.08-1.568-.098-.36-.108-.824-.254-1.416-.496-2.488-1.074-4.11-3.6-4.235-3.767-.123-.167-1.007-1.34-1.007-2.556 0-1.215.637-1.813.863-2.062.225-.25.49-.313.653-.313.163 0 .326.002.47.008.15.007.352-.057.55.42.205.49.696 1.69.757 1.813.06.122.1.266.02.43-.08.163-.12.265-.24.408-.12.143-.252.32-.36.43-.12.12-.245.25-.105.49.14.24.62 1.023 1.33 1.657.915.812 1.688 1.063 1.928 1.183.24.12.38.1.52-.06.14-.163.597-.697.757-.937.16-.24.32-.2.54-.12.22.08 1.396.658 1.636.778.24.12.4.18.46.28.06.1.06.575-.15 1.163z"/>
                </svg>
              </a>
            )}
          </div>

          {/* Mobile menu (handles its own trigger button) */}
          <MobileMenu navItems={navItems} whatsappUrl={whatsappUrl} />
        </div>
      </div>
    </header>
  )
}
