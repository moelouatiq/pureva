'use client'

import { useState } from 'react'

type Props = {
  name: string
  description: string
  benefit?: string
  image?: string
}

function IngredientImageFallback({ name }: { name: string }) {
  return (
    <div
      className="w-full aspect-square rounded-xl bg-green-900/5 flex flex-col items-center justify-center gap-2"
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        className="w-10 h-10 text-green-800/25"
        aria-hidden="true"
      >
        <path d="M12 2C6.5 2 3 7 3 12c0 2.5 1 4.5 2.5 6" />
        <path d="M12 2c5.5 0 9 5 9 10 0 2.5-1 4.5-2.5 6" />
        <path d="M12 22V10" />
        <path d="M12 10c0 0-3-3-3-6" />
        <path d="M12 10c0 0 3-3 3-6" />
      </svg>
      <span className="text-xs text-green-800/30 font-medium text-center px-2 leading-tight">
        {name}
      </span>
    </div>
  )
}

export default function IngredientCard({ name, description, benefit, image }: Props) {
  const [imgFailed, setImgFailed] = useState(false)
  const showImage = image && !imgFailed

  return (
    <div className="bg-white rounded-2xl border border-cream overflow-hidden flex flex-col">
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={name}
          onError={() => setImgFailed(true)}
          className="w-full aspect-square object-cover"
        />
      ) : (
        <IngredientImageFallback name={name} />
      )}

      <div className="p-5 flex flex-col gap-2">
        <h3 className="font-semibold text-green-900 leading-snug">{name}</h3>
        <p className="text-sm text-green-800/70 leading-relaxed">{description}</p>
        {benefit && (
          <p className="text-xs text-green-800/50 leading-relaxed italic">{benefit}</p>
        )}
      </div>
    </div>
  )
}
