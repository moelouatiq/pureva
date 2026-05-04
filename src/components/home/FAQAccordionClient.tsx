'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export type FAQItem = {
  q: string
  a: string
}

type Props = {
  items: FAQItem[]
}

export default function FAQAccordionClient({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <div className="flex flex-col divide-y divide-green-800/10" role="list">
      {items.map(({ q, a }, i) => (
        <div key={i} role="listitem">
          <button
            onClick={() => toggle(i)}
            aria-expanded={openIndex === i}
            className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-medium text-green-900 transition-colors hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800/30 focus-visible:ring-offset-2"
          >
            <span>{q}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-gold-400 transition-transform duration-200 ${
                openIndex === i ? 'rotate-180' : ''
              }`}
              aria-hidden
            />
          </button>

          {/* Answer panel */}
          <div
            aria-hidden={openIndex !== i}
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === i ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="pb-4 text-sm leading-relaxed text-green-800/70">{a}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
