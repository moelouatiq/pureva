import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import { listAdminAffiliates } from '@/lib/admin/affiliates'
import { getSiteUrl } from '@/lib/env'
import { formatPrice } from '@/lib/format-price'
import { AFFILIATE_STATUSES } from '@/types/admin-affiliate'
import { TrackingLinkCopy } from './TrackingLinkCopy'

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

function trackingLink(code: string): string {
  return `${getSiteUrl().replace(/\/$/, '')}/fr?ref=${encodeURIComponent(code)}`
}

function StatusBadge({ status }: { status: string }) {
  const classes = status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>{status}</span>
}

function SetupError() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
      Le suivi influenceurs n&apos;est pas encore configure. Executez database/affiliate-tracking.sql dans Supabase.
    </div>
  )
}

export default async function AdminAffiliatesPage({ searchParams }: Props) {
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

  const params = await searchParams
  const status = valueOf(params.status)
  const search = valueOf(params.search)
  const error = valueOf(params.error)
  const result = await listAdminAffiliates({ status, search })

  if (result.status !== 'ok') {
    return <SetupError />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-3xl font-heading font-bold">Influenceurs</h1>
          <p className="mt-1 text-sm text-green-800/60">
            Codes affilies, clics et commissions attribuees.
          </p>
        </div>
        <Link href="/admin/affiliates/new" className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-white">
          Nouvel influenceur
        </Link>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Action influenceur impossible.
        </p>
      )}

      <form className="flex flex-col gap-3 rounded-lg border border-green-900/10 bg-white p-4 sm:flex-row sm:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <label htmlFor="search" className="text-sm font-medium">
            Recherche
          </label>
          <input
            id="search"
            name="search"
            defaultValue={search}
            placeholder="Code, nom ou Instagram"
            className="rounded-lg border border-green-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium">
            Statut
          </label>
          <select id="status" name="status" defaultValue={status} className="rounded-lg border border-green-200 px-3 py-2 text-sm">
            <option value="">Tous</option>
            {AFFILIATE_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-white">
          Filtrer
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-green-900/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-green-900/10 text-sm">
            <thead className="bg-cream text-left text-xs uppercase tracking-wide text-green-800/60">
              <tr>
                <th className="px-4 py-3">Influenceur</th>
                <th className="px-4 py-3">Code affilié</th>
                <th className="px-4 py-3">Lien de suivi</th>
                <th className="px-4 py-3">Clics</th>
                <th className="px-4 py-3">Commandes attribuées</th>
                <th className="px-4 py-3">Commission en attente</th>
                <th className="px-4 py-3">Commission approuvée</th>
                <th className="px-4 py-3">Commission payée</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">MAJ</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-900/10">
              {result.affiliates.map((affiliate) => (
                <tr key={affiliate.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{affiliate.name}</div>
                    {affiliate.instagram_handle && (
                      <div className="text-xs text-green-800/60">{affiliate.instagram_handle}</div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{affiliate.code}</td>
                  <td className="min-w-80 px-4 py-3">
                    <TrackingLinkCopy url={trackingLink(affiliate.code)} />
                  </td>
                  <td className="px-4 py-3">{affiliate.clickCount}</td>
                  <td className="px-4 py-3">{affiliate.orderCount}</td>
                  <td className="whitespace-nowrap px-4 py-3">{formatPrice(affiliate.commissionTotals.pending, 'fr')}</td>
                  <td className="whitespace-nowrap px-4 py-3">{formatPrice(affiliate.commissionTotals.approved, 'fr')}</td>
                  <td className="whitespace-nowrap px-4 py-3">{formatPrice(affiliate.commissionTotals.paid, 'fr')}</td>
                  <td className="px-4 py-3"><StatusBadge status={affiliate.status} /></td>
                  <td className="whitespace-nowrap px-4 py-3">{formatDate(affiliate.updated_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link className="font-medium underline" href={`/admin/affiliates/${affiliate.id}`}>
                        Ouvrir
                      </Link>
                      <Link className="font-medium underline" href={`/admin/affiliates/${affiliate.id}/edit`}>
                        Modifier
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {result.affiliates.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-green-800/60" colSpan={11}>
                    Aucun influenceur trouve.
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
