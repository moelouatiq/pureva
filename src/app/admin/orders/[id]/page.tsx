import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import { getAdminOrderDetail } from '@/lib/admin/orders'
import { updateOrderStatusAction } from '@/app/admin/actions'
import { formatPrice } from '@/lib/format-price'
import { ORDER_STATUSES, type AdminOrder, type OrderEvent } from '@/types/admin-order'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(value))
}

function priceLabel(order: AdminOrder): string {
  if (order.price_status !== 'confirmed') return 'Prix a confirmer'

  const unit = order.unit_price_cents === null ? null : formatPrice(order.unit_price_cents, 'fr')
  const subtotal = order.subtotal_cents === null ? null : formatPrice(order.subtotal_cents, 'fr')

  if (!unit || !subtotal) return 'Prix a confirmer'
  return `${unit} x ${order.quantity} = ${subtotal}`
}

function valueOf(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-green-900/10 py-3 sm:grid-cols-3">
      <dt className="text-sm font-medium text-green-800/60">{label}</dt>
      <dd className="sm:col-span-2">{value || <span className="text-green-800/40">-</span>}</dd>
    </div>
  )
}

function EventItem({ event }: { event: OrderEvent }) {
  return (
    <li className="rounded-lg border border-green-900/10 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">{event.event_type}</p>
        <time className="text-xs text-green-800/50">{formatDate(event.created_at)}</time>
      </div>
      {(event.old_status || event.new_status) && (
        <p className="mt-1 text-sm text-green-800/70">
          {event.old_status ?? '-'} &rarr; {event.new_status ?? '-'}
        </p>
      )}
      {event.note && <p className="mt-2 text-sm text-green-800/80">{event.note}</p>}
    </li>
  )
}

export default async function AdminOrderDetailPage({ params, searchParams }: Props) {
  const access = await requireAdmin()

  if (access.status === 'setup_required') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        Configuration Supabase requise pour afficher les commandes.
      </div>
    )
  }

  if (access.status !== 'ok') {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        Acces refuse.
      </div>
    )
  }

  const { id } = await params
  const query = await searchParams
  const detail = await getAdminOrderDetail(id)
  if (!detail) notFound()

  const { order, events } = detail
  const updated = valueOf(query.updated) === '1'
  const updateError = valueOf(query.error) === 'update'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <Link href="/admin/orders" className="text-sm text-green-800/60 underline">
            Retour aux commandes
          </Link>
          <h1 className="mt-2 text-3xl font-heading font-bold">{order.order_reference}</h1>
          <p className="mt-1 text-sm text-green-800/60">Creee le {formatDate(order.created_at)}</p>
        </div>
        <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
          {order.status}
        </span>
      </div>

      {updated && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Statut mis a jour.
        </p>
      )}
      {updateError && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Impossible de mettre a jour le statut.
        </p>
      )}

      <section className="rounded-lg border border-green-900/10 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Details client et commande</h2>
        <dl>
          <DetailRow label="Nom" value={order.customer_name} />
          <DetailRow label="Email" value={<a href={`mailto:${order.customer_email}`}>{order.customer_email}</a>} />
          <DetailRow label="Telephone" value={order.customer_phone} />
          <DetailRow label="Pays" value={order.customer_country} />
          <DetailRow label="Adresse" value={<span className="whitespace-pre-line">{order.customer_address}</span>} />
          <DetailRow label="Produit" value={order.product_name} />
          <DetailRow label="Quantite" value={order.quantity} />
          <DetailRow label="Prix" value={priceLabel(order)} />
          <DetailRow label="Message" value={order.customer_message} />
          <DetailRow label="Source" value={order.source} />
        </dl>
      </section>

      <section className="rounded-lg border border-green-900/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Mettre a jour le statut</h2>
        <form action={updateOrderStatusAction} className="flex flex-col gap-4">
          <input type="hidden" name="orderId" value={order.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-sm font-medium">
                Statut
              </label>
              <select
                id="status"
                name="status"
                defaultValue={order.status}
                className="rounded-lg border border-green-200 px-3 py-2 text-sm"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="note" className="text-sm font-medium">
                Note interne
              </label>
              <input
                id="note"
                name="note"
                maxLength={1000}
                className="rounded-lg border border-green-200 px-3 py-2 text-sm"
                placeholder="Optionnel"
              />
            </div>
          </div>
          <button type="submit" className="self-start rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-white">
            Enregistrer
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Historique</h2>
        <ul className="flex flex-col gap-3">
          {events.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </ul>
      </section>
    </div>
  )
}
