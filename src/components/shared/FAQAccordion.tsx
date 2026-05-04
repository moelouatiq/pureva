'use client'

import { useState } from 'react'

export type FAQItem = {
  id: string
  question: string
  answer: string
}

type Props = {
  items: FAQItem[]
  allowMultiple?: boolean
}

export default function FAQAccordion({ items, allowMultiple = true }: Props) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!allowMultiple) next.clear()
        next.add(id)
      }
      return next
    })
  }

  return (
    <dl className="space-y-2">
      {items.map((item) => {
        const isOpen = openIds.has(item.id)
        const panelId = `faq-panel-${item.id}`
        const triggerId = `faq-trigger-${item.id}`

        return (
          <div
            key={item.id}
            className="border border-[var(--color-cream)] rounded-xl overflow-hidden bg-white"
          >
            <dt>
              <button
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium hover:bg-[var(--color-green-50)] transition-colors"
                style={{ color: 'var(--color-green-900)' }}
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className={`flex-shrink-0 w-5 h-5 rounded-full border border-[var(--color-green-700)] flex items-center justify-center transition-transform ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                  style={{ color: 'var(--color-green-700)' }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
              </button>
            </dt>
            <dd
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className="px-5 pb-5 text-sm leading-relaxed text-[oklch(0.35_0.02_250)]"
            >
              {item.answer}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
