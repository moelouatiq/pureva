import { buildWhatsAppUrl } from '@/lib/whatsapp'

type Variant = 'button' | 'banner' | 'fab'

type Props = {
  message: string
  label: string
  variant?: Variant
  className?: string
}

export default function WhatsAppCTA({ message, label, variant = 'button', className = '' }: Props) {
  const url = buildWhatsAppUrl(message)

  if (url === '#') return null

  if (variant === 'fab') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={`fixed bottom-6 right-6 z-20 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 ${className}`}
        style={{ backgroundColor: 'var(--color-whatsapp)' }}
      >
        <svg width="28" height="28" viewBox="0 0 20 20" fill="white" aria-hidden="true">
          <path d="M10 0C4.477 0 0 4.477 0 10c0 1.764.463 3.416 1.27 4.847L0 20l5.302-1.238A9.955 9.955 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm4.914 14.2c-.21.588-1.22 1.13-1.68 1.19-.43.057-.972.08-1.568-.098-.36-.108-.824-.254-1.416-.496-2.488-1.074-4.11-3.6-4.235-3.767-.123-.167-1.007-1.34-1.007-2.556 0-1.215.637-1.813.863-2.062.225-.25.49-.313.653-.313.163 0 .326.002.47.008.15.007.352-.057.55.42.205.49.696 1.69.757 1.813.06.122.1.266.02.43-.08.163-.12.265-.24.408-.12.143-.252.32-.36.43-.12.12-.245.25-.105.49.14.24.62 1.023 1.33 1.657.915.812 1.688 1.063 1.928 1.183.24.12.38.1.52-.06.14-.163.597-.697.757-.937.16-.24.32-.2.54-.12.22.08 1.396.658 1.636.778.24.12.4.18.46.28.06.1.06.575-.15 1.163z"/>
        </svg>
      </a>
    )
  }

  if (variant === 'banner') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl text-white font-semibold text-base transition-opacity hover:opacity-90 ${className}`}
        style={{ backgroundColor: 'var(--color-whatsapp)' }}
      >
        <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 0C4.477 0 0 4.477 0 10c0 1.764.463 3.416 1.27 4.847L0 20l5.302-1.238A9.955 9.955 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm4.914 14.2c-.21.588-1.22 1.13-1.68 1.19-.43.057-.972.08-1.568-.098-.36-.108-.824-.254-1.416-.496-2.488-1.074-4.11-3.6-4.235-3.767-.123-.167-1.007-1.34-1.007-2.556 0-1.215.637-1.813.863-2.062.225-.25.49-.313.653-.313.163 0 .326.002.47.008.15.007.352-.057.55.42.205.49.696 1.69.757 1.813.06.122.1.266.02.43-.08.163-.12.265-.24.408-.12.143-.252.32-.36.43-.12.12-.245.25-.105.49.14.24.62 1.023 1.33 1.657.915.812 1.688 1.063 1.928 1.183.24.12.38.1.52-.06.14-.163.597-.697.757-.937.16-.24.32-.2.54-.12.22.08 1.396.658 1.636.778.24.12.4.18.46.28.06.1.06.575-.15 1.163z"/>
        </svg>
        {label}
      </a>
    )
  }

  // default: button
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-secondary inline-flex items-center gap-2 ${className}`}
      style={{ borderColor: 'var(--color-whatsapp)', color: 'var(--color-whatsapp)' }}
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 0C4.477 0 0 4.477 0 10c0 1.764.463 3.416 1.27 4.847L0 20l5.302-1.238A9.955 9.955 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm4.914 14.2c-.21.588-1.22 1.13-1.68 1.19-.43.057-.972.08-1.568-.098-.36-.108-.824-.254-1.416-.496-2.488-1.074-4.11-3.6-4.235-3.767-.123-.167-1.007-1.34-1.007-2.556 0-1.215.637-1.813.863-2.062.225-.25.49-.313.653-.313.163 0 .326.002.47.008.15.007.352-.057.55.42.205.49.696 1.69.757 1.813.06.122.1.266.02.43-.08.163-.12.265-.24.408-.12.143-.252.32-.36.43-.12.12-.245.25-.105.49.14.24.62 1.023 1.33 1.657.915.812 1.688 1.063 1.928 1.183.24.12.38.1.52-.06.14-.163.597-.697.757-.937.16-.24.32-.2.54-.12.22.08 1.396.658 1.636.778.24.12.4.18.46.28.06.1.06.575-.15 1.163z"/>
      </svg>
      {label}
    </a>
  )
}
