'use client'

import { useState } from 'react'

export function TrackingLinkCopy({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        readOnly
        value={url}
        className="min-w-0 flex-1 rounded-lg border border-green-200 px-3 py-2 font-mono text-xs"
      />
      <button
        type="button"
        onClick={copyLink}
        className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-white"
      >
        {copied ? 'Copié' : 'Copier le lien'}
      </button>
    </div>
  )
}
