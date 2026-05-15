import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import { getAdminProductDetail } from '@/lib/admin/products'
import { archiveProductAction, publishProductAction } from '../../actions'
import ProductForm from '../../ProductForm'

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

export default async function EditAdminProductPage({ params, searchParams }: Props) {
  const access = await requireAdmin()

  if (access.status === 'setup_required') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        Configuration Supabase requise pour modifier un produit.
      </div>
    )
  }

  if (access.status !== 'ok') {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        Accès refusé.
      </div>
    )
  }

  const { id } = await params
  const query = await searchParams
  const detail = await getAdminProductDetail(id)
  if (!detail) notFound()

  const { product, events } = detail
  const error = valueOf(query.error)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <Link href="/admin/products" className="text-sm text-green-800/60 underline">
            Retour aux produits
          </Link>
          <h1 className="mt-2 text-3xl font-heading font-bold">{product.name_fr}</h1>
          <p className="mt-1 text-sm text-green-800/60">
            Mis à jour le {formatDate(product.updated_at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.status !== 'published' && (
            <form action={publishProductAction}>
              <input type="hidden" name="productId" value={product.id} />
              <button type="submit" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">
                Publier
              </button>
            </form>
          )}
          {product.status !== 'archived' && (
            <form action={archiveProductAction}>
              <input type="hidden" name="productId" value={product.id} />
              <button type="submit" className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700">
                Archiver
              </button>
            </form>
          )}
        </div>
      </div>

      {valueOf(query.created) === '1' && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Produit créé.
        </p>
      )}
      {valueOf(query.updated) === '1' && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Produit mis à jour.
        </p>
      )}
      {valueOf(query.published) === '1' && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Produit publié.
        </p>
      )}
      {valueOf(query.archived) === '1' && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Produit archivé.
        </p>
      )}
      {error === 'validation' && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Certains champs produit sont invalides.
        </p>
      )}
      {error === 'claims' && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          La publication est bloquée par des claims à vérifier. Enregistrez en brouillon ou ajustez la copie.
        </p>
      )}
      {error === 'config' && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Product management is not configured yet.
        </p>
      )}
      {error === 'save' && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Impossible d’enregistrer le produit.
        </p>
      )}

      <ProductForm product={product} />

      <section>
        <h2 className="mb-4 text-lg font-semibold">Historique produit</h2>
        <ul className="flex flex-col gap-3">
          {events.map((event) => (
            <li key={event.id} className="rounded-lg border border-green-900/10 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{event.event_type}</p>
                <time className="text-xs text-green-800/50">{formatDate(event.created_at)}</time>
              </div>
              {event.note && <p className="mt-2 text-sm text-green-800/80">{event.note}</p>}
            </li>
          ))}
          {events.length === 0 && (
            <li className="rounded-lg border border-green-900/10 bg-white p-4 text-sm text-green-800/60">
              Aucun événement.
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}
