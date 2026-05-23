import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import { getAdminOrderDetail } from '@/lib/admin/orders'
import { updateCommissionStatusAction, updateOrderStatusAction } from '@/app/admin/actions'
import { formatPrice } from '@/lib/format-price'
import { ORDER_STATUSES, type AdminOrder, type CommissionStatus, type OrderEvent } from '@/types/admin-order'
import { DeleteOrderForm } from './DeleteOrderForm'

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

function commissionAmountLabel(order: AdminOrder): string {
  if (!order.commission_status || order.commission_status === 'none') return '-'
  if (order.commission_amount_cents === null || order.commission_amount_cents === undefined) return '-'
  return formatPrice(order.commission_amount_cents, 'fr')
}

function nextCommissionStatuses(status: CommissionStatus | undefined): Array<'approved' | 'rejected' | 'paid'> {
  if (status === 'pending') return ['approved', 'rejected']
  if (status === 'approved') return ['paid']
  return []
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

function DeletedBadge() {
  return (
    <span className="w-fit rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
      Deleted
    </span>
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

  const { order, events, affiliate } = detail
  const updated = valueOf(query.updated) === '1'
  const commissionUpdated = valueOf(query.commission_updated) === '1'
  const updateError = valueOf(query.error) === 'update'
  const commissionError = valueOf(query.error) === 'commission'
  const commissionConfigError = valueOf(query.error) === 'commission_config'
  const deletedStatusError = valueOf(query.error) === 'deleted'
  const deleteError = valueOf(query.error) === 'delete'
  const deleteConfigError = valueOf(query.error) === 'delete_config'
  const deletedSuccess = valueOf(query.deleted) === '1'
  const isDeleted = Boolean(order.deleted_at)
  const deletedCopy =
    order.locale === 'en'
      ? {
          success: 'Order deleted.',
          metadataTitle: 'Deletion details',
          deletedAt: 'Deleted at',
          deletedBy: 'Deleted by',
          reason: 'Deletion reason',
          statusDisabled: 'Status updates are disabled for deleted orders.',
        }
      : {
          success: 'Commande supprimée.',
          metadataTitle: 'Details de suppression',
          deletedAt: 'Supprimee le',
          deletedBy: 'Supprimee par',
          reason: 'Raison de suppression',
          statusDisabled: 'Les mises a jour de statut sont desactivees pour les commandes supprimees.',
        }

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
        <div className="flex flex-wrap gap-2">
          <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
            {order.status}
          </span>
          {isDeleted && <DeletedBadge />}
        </div>
      </div>

      {updated && !isDeleted && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Statut mis a jour.
        </p>
      )}
      {commissionUpdated && !isDeleted && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Commission mise a jour.
        </p>
      )}
      {deletedSuccess && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {deletedCopy.success}
        </p>
      )}
      {updateError && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Impossible de mettre a jour le statut.
        </p>
      )}
      {commissionError && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Transition de commission impossible.
        </p>
      )}
      {commissionConfigError && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Commission tracking is not configured yet.
        </p>
      )}
      {deletedStatusError && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {deletedCopy.statusDisabled}
        </p>
      )}
      {deleteError && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Impossible de supprimer la commande.
        </p>
      )}
      {deleteConfigError && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Deletion is not configured yet.
        </p>
      )}

      {isDeleted && (
        <section className="rounded-lg border border-red-200 bg-red-50 p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-red-900">{deletedCopy.metadataTitle}</h2>
          <dl>
            <DetailRow
              label={deletedCopy.deletedAt}
              value={order.deleted_at ? formatDate(order.deleted_at) : null}
            />
            <DetailRow label={deletedCopy.deletedBy} value={order.deleted_by} />
            <DetailRow label={deletedCopy.reason} value={order.delete_reason} />
          </dl>
        </section>
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
        <h2 className="mb-3 text-lg font-semibold">Attribution affiliée</h2>
        <dl>
          <DetailRow label="Code affilié" value={order.affiliate_code} />
          <DetailRow
            label="Influenceur"
            value={
              affiliate ? (
                <Link href={`/admin/affiliates/${affiliate.id}`} className="underline">
                  {affiliate.name}
                </Link>
              ) : null
            }
          />
          <DetailRow label="Commission" value={commissionAmountLabel(order)} />
          <DetailRow label="Statut commission" value={order.commission_status ?? 'none'} />
          <DetailRow label="Source attribution" value={order.attribution_source} />
          <DetailRow label="Landing path" value={order.landing_path} />
          <DetailRow label="utm_source" value={order.utm_source} />
          <DetailRow label="utm_medium" value={order.utm_medium} />
          <DetailRow label="utm_campaign" value={order.utm_campaign} />
          <DetailRow label="utm_content" value={order.utm_content} />
          <DetailRow label="utm_term" value={order.utm_term} />
        </dl>
      </section>

      <section className="rounded-lg border border-green-900/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Mettre a jour le statut</h2>
        {isDeleted && (
          <p className="mb-4 text-sm text-green-800/60">{deletedCopy.statusDisabled}</p>
        )}
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
                disabled={isDeleted}
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
                disabled={isDeleted}
                className="rounded-lg border border-green-200 px-3 py-2 text-sm"
                placeholder="Optionnel"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isDeleted}
            className="self-start rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-green-900/30"
          >
            Enregistrer
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-green-900/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Commission</h2>
        <div className="mb-4 grid gap-2 text-sm sm:grid-cols-3">
          <p>
            <span className="text-green-800/60">Statut: </span>
            <span className="font-semibold">{order.commission_status ?? 'none'}</span>
          </p>
          <p>
            <span className="text-green-800/60">Montant: </span>
            <span className="font-semibold">{commissionAmountLabel(order)}</span>
          </p>
          <p>
            <span className="text-green-800/60">Devise: </span>
            <span className="font-semibold">{order.commission_currency ?? 'EUR'}</span>
          </p>
        </div>
        {nextCommissionStatuses(order.commission_status).length > 0 && !isDeleted ? (
          <div className="flex flex-wrap gap-3">
            {nextCommissionStatuses(order.commission_status).map((status) => (
              <form key={status} action={updateCommissionStatusAction} className="flex flex-wrap gap-2">
                <input type="hidden" name="orderId" value={order.id} />
                <input type="hidden" name="status" value={status} />
                <input type="hidden" name="note" value={`Commission ${order.commission_status ?? 'none'} -> ${status}`} />
                <button type="submit" className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-white">
                  {status}
                </button>
              </form>
            ))}
          </div>
        ) : (
          <p className="text-sm text-green-800/60">Aucune transition disponible.</p>
        )}
      </section>

      <DeleteOrderForm orderId={order.id} locale={order.locale} isDeleted={isDeleted} />

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
