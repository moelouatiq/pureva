'use client'

import { deleteOrderAction } from '@/app/admin/actions'

type DeleteOrderFormProps = {
  orderId: string
  locale: 'fr' | 'en'
  isDeleted: boolean
}

const copy = {
  fr: {
    title: 'Suppression',
    button: 'Supprimer la commande',
    confirmation:
      'Cette action masquera la commande de la liste active. L’historique sera conservé.',
    reasonLabel: 'Raison de suppression',
    reasonPlaceholder: 'Optionnel',
    checkbox: 'Je confirme la suppression.',
    alreadyDeleted: 'Commande supprimée.',
  },
  en: {
    title: 'Deletion',
    button: 'Delete order',
    confirmation: 'This action will hide the order from the active list. History will be preserved.',
    reasonLabel: 'Deletion reason',
    reasonPlaceholder: 'Optional',
    checkbox: 'I confirm this deletion.',
    alreadyDeleted: 'Order deleted.',
  },
} as const

export function DeleteOrderForm({ orderId, locale, isDeleted }: DeleteOrderFormProps) {
  const labels = copy[locale]

  if (isDeleted) {
    return (
      <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">
        {labels.alreadyDeleted}
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-red-200 bg-red-50/60 p-5">
      <h2 className="mb-2 text-lg font-semibold text-red-900">{labels.title}</h2>
      <form
        action={deleteOrderAction}
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          if (!window.confirm(labels.confirmation)) {
            event.preventDefault()
          }
        }}
      >
        <input type="hidden" name="orderId" value={orderId} />
        <p className="text-sm text-red-900/80">{labels.confirmation}</p>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="reason" className="text-sm font-medium text-red-950">
            {labels.reasonLabel}
          </label>
          <textarea
            id="reason"
            name="reason"
            maxLength={1000}
            rows={3}
            placeholder={labels.reasonPlaceholder}
            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-green-900"
          />
        </div>

        <label className="flex items-start gap-2 text-sm text-red-950">
          <input
            type="checkbox"
            name="confirmDelete"
            required
            className="mt-1 h-4 w-4 rounded border-red-300 text-red-700"
          />
          <span>{labels.checkbox}</span>
        </label>

        <button
          type="submit"
          className="self-start rounded-lg border border-red-700 bg-white px-4 py-2 text-sm font-semibold text-red-800 hover:bg-red-100"
        >
          {labels.button}
        </button>
      </form>
    </section>
  )
}
