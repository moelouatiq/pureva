'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from './LanguageSwitcher'

type NavItem = { href: string; label: string }

type Props = {
  navItems: NavItem[]
  whatsappUrl: string
}

export default function MobileMenu({ navItems, whatsappUrl }: Props) {
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Hamburger trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label={t('open_menu')}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-md hover:bg-[var(--color-green-100)] transition-colors"
      >
        <span className="block w-5 h-0.5 bg-[var(--color-green-800)] rounded-full" />
        <span className="block w-5 h-0.5 bg-[var(--color-green-800)] rounded-full" />
        <span className="block w-4 h-0.5 bg-[var(--color-green-800)] rounded-full" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('open_menu')}
        className={`fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-[var(--color-ivory)] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-cream)]">
          <span
            className="text-xl font-semibold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-green-800)' }}
          >
            Pureva
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label={t('close_menu')}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[var(--color-cream)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M1 1l16 16M17 1L1 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 rounded-lg text-base font-medium text-[oklch(0.25_0.02_250)] hover:bg-[var(--color-green-100)] hover:text-[var(--color-green-800)] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer area */}
        <div className="px-6 pb-8 pt-4 border-t border-[var(--color-cream)] space-y-4">
          {whatsappUrl !== '#' && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-[var(--color-whatsapp)] text-white font-semibold text-sm transition-opacity hover:opacity-90"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10 0C4.477 0 0 4.477 0 10c0 1.764.463 3.416 1.27 4.847L0 20l5.302-1.238A9.955 9.955 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm4.914 14.2c-.21.588-1.22 1.13-1.68 1.19-.43.057-.972.08-1.568-.098-.36-.108-.824-.254-1.416-.496-2.488-1.074-4.11-3.6-4.235-3.767-.123-.167-1.007-1.34-1.007-2.556 0-1.215.637-1.813.863-2.062.225-.25.49-.313.653-.313.163 0 .326.002.47.008.15.007.352-.057.55.42.205.49.696 1.69.757 1.813.06.122.1.266.02.43-.08.163-.12.265-.24.408-.12.143-.252.32-.36.43-.12.12-.245.25-.105.49.14.24.62 1.023 1.33 1.657.915.812 1.688 1.063 1.928 1.183.24.12.38.1.52-.06.14-.163.597-.697.757-.937.16-.24.32-.2.54-.12.22.08 1.396.658 1.636.778.24.12.4.18.46.28.06.1.06.575-.15 1.163z"/>
              </svg>
              WhatsApp
            </a>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </>
  )
}
