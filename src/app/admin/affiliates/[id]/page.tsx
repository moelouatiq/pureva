import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import { getAdminAffiliateDetail } from '@/lib/admin/affiliates'
import { getSiteUrl } from '@/lib/env'
import { formatPrice } from '@/lib/format-price'
import type { AdminAffiliateClick } from '@/types/admin-affiliate'
import type { AdminOrder } from '@/types/admin-order'
import { setAffiliateStatusAction } from '../actions'
import { TrackingLinkCopy } from '../TrackingLinkCopy'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
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

function trackingLink(code: string): string {
  return `${getSiteUrl().replace(/\/$/, '')}/fr?ref=${encodeURIComponent(code)}`
}

function commissionLabel(order: AdminOrder): string {
  if (!order.commission_status || order.commission_status === 'none') return '-'
  if (order.commission_amount_cents === null || order.commission_amount_cents === undefined) {
    return order.commission_status
  }
  return `${formatPrice(order.commission_amount_cents, 'fr')} (${order.commission_status})`
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-green-900/10 py-3 sm:grid-cols-3">
      <dt className="text-sm font-medium text-green-800/60">{label}</dt>
      <dd className="sm:col-span-2">{value || <span className="text-green-800/40">-</span>}</dd>
    </div>
  )
}

function SetupError() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
      Le suivi influenceurs n&apos;est pas encore configure. Executez database/affiliate-tracking.sql dans Supabase.
    </div>
  )
}

function ClickItem({ click }: { click: AdminAffiliateClick }) {
  return (
    <li className="rounded-lg border border-green-900/10 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">{click.landing_path || '-'}</p>
        <time className="text-xs text-green-800/50">{formatDate(click.created_at)}</time>
      </div>
      <div className="mt-2 grid gap-1 text-xs text-green-800/65 sm:grid-cols-2">
        <p>utm_source: {click.utm_source || '-'}</p>
        <p>utm_campaign: {click.utm_campaign || '-'}</p>
        <p>utm_medium: {click.utm_medium || '-'}</p>
        <p>utm_content: {click.utm_content || '-'}</p>
      </div>
    </li>
  )
}

export default async function AdminAffiliateDetailPage({ params, searchParams }: Props) {
  const access = await requireAdmin()

  if (access.status === 'setup_required') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        Configuration Supabase requise pour gerer les influenceurs.
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
  const result = await getAdminAffiliateDetail(id)

  if (result.status !== 'ok') {
    if (result.status === 'not_found') notFound()
    return <SetupError />
  }

  const { affiliate, clicks, orders, clickCount, orderCount, commissionTotals } = result.detail
  const updated = valueOf(query.updated) === '1'
  const created = valueOf(query.created) === '1'
  const error = valueOf(query.error)
  const nextStatus = affiliate.status === 'active' ? 'inactive' : 'active'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <Link href="/admin/affiliates" className="text-sm text-green-800/60 underline">
            Retour aux influenceurs
          </Link>
          <h1 className="mt-2 text-3xl font-heading font-bold">{affiliate.name}</h1>
          <p className="mt-1 text-sm text-green-800/60">Code affilié: {affiliate.code}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/affiliates/${affiliate.id}/edit`}
            className="rounded-lg border border-green-900/15 px-4 py-2 text-sm font-semibold"
          >
            Modifier
          </Link>
          <form action={setAffiliateStatusAction}>
            <input type="hidden" name="affiliateId" value={affiliate.id} />
            <input type="hidden" name="status" value={nextStatus} />
            <button type="submit" className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-white">
              {nextStatus === 'active' ? 'Activer' : 'Desactiver'}
            </button>
          </form>
        </div>
      </div>

      {(created || updated) && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Influenceur enregistre.
        </p>
      )}
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Action influenceur impossible.
        </p>
      )}

      <section className="rounded-lg border border-green-900/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Lien de suivi</h2>
        <TrackingLinkCopy url={trackingLink(affiliate.code)} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border border-green-900/10 bg-white p-4 shadow-sm">
          <p className="text-sm text-green-800/60">Clics</p>
          <p className="mt-2 text-2xl font-semibold">{clickCount}</p>
        </div>
        <div className="rounded-lg border border-green-900/10 bg-white p-4 shadow-sm">
          <p className="text-sm text-green-800/60">Commandes attribuées</p>
          <p className="mt-2 text-2xl font-semibold">{orderCount}</p>
        </div>
        <div className="rounded-lg border border-green-900/10 bg-white p-4 shadow-sm">
          <p className="text-sm text-green-800/60">Commission en attente</p>
          <p className="mt-2 text-2xl font-semibold">{formatPrice(commissionTotals.pending, 'fr')}</p>
        </div>
        <div className="rounded-lg border border-green-900/10 bg-white p-4 shadow-sm">
          <p className="text-sm text-green-800/60">Commission approuvée</p>
          <p className="mt-2 text-2xl font-semibold">{formatPrice(commissionTotals.approved, 'fr')}</p>
        </div>
        <div className="rounded-lg border border-green-900/10 bg-white p-4 shadow-sm">
          <p className="text-sm text-green-800/60">Commission payée</p>
          <p className="mt-2 text-2xl font-semibold">{formatPrice(commissionTotals.paid, 'fr')}</p>
        </div>
      </section>

      <section className="rounded-lg border border-green-900/10 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Infos influenceur</h2>
        <dl>
          <DetailRow label="Statut" value={affiliate.status} />
          <DetailRow label="Email" value={affiliate.email ? <a href={`mailto:${affiliate.email}`}>{affiliate.email}</a> : null} />
          <DetailRow label="Téléphone" value={affiliate.phone} />
          <DetailRow label="Instagram" value={affiliate.instagram_handle} />
          <DetailRow
            label="Commission"
            value={
              affiliate.commission_type === 'fixed'
                ? `${formatPrice(Math.round(affiliate.commission_value * 100), 'fr')} fixe`
                : `${affiliate.commission_value}%`
            }
          />
          <DetailRow label="Notes" value={affiliate.notes} />
        </dl>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Clics récents</h2>
        <ul className="flex flex-col gap-3">
          {clicks.map((click) => (
            <ClickItem key={click.id} click={click} />
          ))}
          {clicks.length === 0 && (
            <li className="rounded-lg border border-green-900/10 bg-white p-4 text-sm text-green-800/60">
              Aucun clic.
            </li>
          )}
        </ul>
      </section>

      <section className="overflow-hidden rounded-lg border border-green-900/10 bg-white shadow-sm">
        <div className="border-b border-green-900/10 p-5">
          <h2 className="text-lg font-semibold">Commandes attribuées</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-green-900/10 text-sm">
            <thead className="bg-cream text-left text-xs uppercase tracking-wide text-green-800/60">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-900/10">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{order.order_reference}</td>
                  <td className="whitespace-nowrap px-4 py-3">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3">{order.customer_name}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {order.subtotal_cents === null ? '-' : formatPrice(order.subtotal_cents, 'fr')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{commissionLabel(order)}</td>
                  <td className="px-4 py-3">
                    <Link className="font-medium underline" href={`/admin/orders/${order.id}`}>
                      Ouvrir
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-green-800/60" colSpan={6}>
                    Aucune commande attribuee.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
