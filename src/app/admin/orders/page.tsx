import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import { listAdminOrders } from '@/lib/admin/orders'
import { formatPrice } from '@/lib/format-price'
import { ORDER_STATUSES, type AdminOrder } from '@/types/admin-order'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function valueOf(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function priceLabel(order: AdminOrder): string {
  if (order.price_status !== 'confirmed' || order.subtotal_cents === null) {
    return 'Prix a confirmer'
  }

  return formatPrice(order.subtotal_cents, 'fr')
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
      {status}
    </span>
  )
}

function DeletedBadge() {
  return (
    <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800">
      Deleted
    </span>
  )
}

export default async function AdminOrdersPage({ searchParams }: Props) {
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

  const params = await searchParams
  const status = valueOf(params.status)
  const search = valueOf(params.search)
  const showDeleted = valueOf(params.showDeleted) === '1'
  const orders = await listAdminOrders({ status, search, showDeleted })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Commandes</h1>
        <p className="mt-1 text-sm text-green-800/60">
          Liste des demandes de commande Pureva.
        </p>
      </div>

      <form className="flex flex-col gap-3 rounded-lg border border-green-900/10 bg-white p-4 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium">
            Statut
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="rounded-lg border border-green-200 px-3 py-2 text-sm"
          >
            <option value="">Tous</option>
            {ORDER_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <label htmlFor="search" className="text-sm font-medium">
            Recherche
          </label>
          <input
            id="search"
            name="search"
            defaultValue={search}
            placeholder="Reference, email ou nom"
            className="rounded-lg border border-green-200 px-3 py-2 text-sm"
          />
        </div>

        <label className="flex items-center gap-2 rounded-lg border border-green-900/10 px-3 py-2 text-sm">
          <input
            type="checkbox"
            name="showDeleted"
            value="1"
            defaultChecked={showDeleted}
            className="h-4 w-4 rounded border-green-300"
          />
          <span>Afficher les commandes supprimées</span>
        </label>

        <button type="submit" className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-white">
          Filtrer
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-green-900/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-green-900/10 text-sm">
            <thead className="bg-cream text-left text-xs uppercase tracking-wide text-green-800/60">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Telephone</th>
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Qte</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Affilié</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Pays</th>
                <th className="px-4 py-3">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-900/10">
              {orders.map((order) => {
                const isDeleted = Boolean(order.deleted_at)
                return (
                  <tr key={order.id} className={isDeleted ? 'bg-slate-50 text-green-900/45' : undefined}>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{order.order_reference}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3">{order.customer_name}</td>
                    <td className="px-4 py-3">{order.customer_email}</td>
                    <td className="px-4 py-3">{order.customer_phone}</td>
                    <td className="px-4 py-3">{order.product_name}</td>
                    <td className="px-4 py-3">{order.quantity}</td>
                    <td className="whitespace-nowrap px-4 py-3">{priceLabel(order)}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                      {order.affiliate_code || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge status={order.status} />
                        {isDeleted && <DeletedBadge />}
                      </div>
                    </td>
                    <td className="px-4 py-3">{order.customer_country}</td>
                    <td className="px-4 py-3">
                      <Link className="font-medium underline" href={`/admin/orders/${order.id}`}>
                        Ouvrir
                      </Link>
                    </td>
                  </tr>
                )
              })}
              {orders.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-green-800/60" colSpan={12}>
                    Aucune commande trouvee.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
