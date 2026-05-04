'use client'

import { useState } from 'react'

type Props = {
  src: string
  alt: string
}

export default function IngredientImageItem({ src, alt }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div
        className="flex aspect-square w-full items-center justify-center bg-green-800/30 text-green-300/40"
        role="img"
        aria-label={alt}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className="h-10 w-10 opacity-50"
          aria-hidden
        >
          <path d="M12 2C6.5 2 3 7 3 12c0 2.5 1 4.5 2.5 6" />
          <path d="M12 2c5.5 0 9 5 9 10 0 2.5-1 4.5-2.5 6" />
          <path d="M12 22V10" />
          <path d="M12 10c0 0-3-3-3-6" />
          <path d="M12 10c0 0 3-3 3-6" />
        </svg>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="aspect-square w-full object-cover"
    />
  )
}
