'use client'

import { useState } from 'react'

type Props = {
  alt: string
  /** Tailwind classes for the <img> element */
  className?: string
  /** Tailwind classes for the text fallback span */
  fallbackClassName?: string
}

export default function LogoImage({ alt, className = '', fallbackClassName = '' }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span className={fallbackClassName} aria-hidden="true">
        Pureva
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/brand/logo.png"
      alt={alt}
      onError={() => setFailed(true)}
      className={`object-contain ${className}`}
      draggable={false}
    />
  )
}
