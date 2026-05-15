import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import { listAdminProducts } from '@/lib/admin/products'
import { formatPrice } from '@/lib/format-price'
import { PRODUCT_CATEGORIES, PRODUCT_PUBLICATION_STATUSES, type AdminProduct } from '@/types/admin-product'
import { archiveProductAction, publishProductAction } from './actions'

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

function priceLabel(product: AdminProduct): string {
  if (product.price_status !== 'confirmed' || product.price_cents === null) {
    return 'Prix à confirmer'
  }
  return formatPrice(product.price_cents, 'fr')
}

function sizeLabel(product: AdminProduct): string {
  if (product.size_status !== 'confirmed' || !product.size) {
    return 'Format à confirmer'
  }
  return product.size
}

function StatusBadge({ status }: { status: string }) {
  const classes =
    status === 'published'
      ? 'bg-emerald-100 text-emerald-800'
      : status === 'archived'
        ? 'bg-slate-100 text-slate-700'
        : 'bg-amber-100 text-amber-800'

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>{status}</span>
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const access = await requireAdmin()

  if (access.status === 'setup_required') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        Configuration Supabase requise pour gérer les produits.
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

  const params = await searchParams
  const search = valueOf(params.search)
  const status = valueOf(params.status)
  const category = valueOf(params.category)
  const error = valueOf(params.error)
  const products = await listAdminProducts({ search, status, category })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-3xl font-heading font-bold">Produits</h1>
          <p className="mt-1 text-sm text-green-800/60">
            Catalogue administrable. Le site public reste basé sur les fichiers statiques pour cette phase.
          </p>
        </div>
        <Link href="/admin/products/new" className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-white">
          Nouveau produit
        </Link>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Action produit impossible.
        </p>
      )}

      <form className="flex flex-col gap-3 rounded-lg border border-green-900/10 bg-white p-4 sm:flex-row sm:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <label htmlFor="search" className="text-sm font-medium">Recherche</label>
          <input
            id="search"
            name="search"
            defaultValue={search}
            placeholder="Nom, slug ou legacy ID"
            className="rounded-lg border border-green-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium">Statut</label>
          <select id="status" name="status" defaultValue={status} className="rounded-lg border border-green-200 px-3 py-2 text-sm">
            <option value="">Tous</option>
            {PRODUCT_PUBLICATION_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm font-medium">Catégorie</label>
          <select id="category" name="category" defaultValue={category} className="rounded-lg border border-green-200 px-3 py-2 text-sm">
            <option value="">Toutes</option>
            {PRODUCT_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
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
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Format</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Publication</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3">Ordre</th>
                <th className="px-4 py-3">MAJ</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-900/10">
              {products.map((product) => (
                <tr key={product.id} className={product.status === 'archived' ? 'bg-slate-50 text-green-900/50' : undefined}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{product.name_fr}</div>
                    <div className="font-mono text-xs text-green-800/50">{product.slug_fr}</div>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="whitespace-nowrap px-4 py-3">{priceLabel(product)}</td>
                  <td className="whitespace-nowrap px-4 py-3">{sizeLabel(product)}</td>
                  <td className="px-4 py-3">{product.stock_status}</td>
                  <td className="px-4 py-3"><StatusBadge status={product.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1 text-xs">
                      {product.is_best_seller && <span>best seller</span>}
                      {product.is_routine_product && <span>routine</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">{product.sort_order}</td>
                  <td className="whitespace-nowrap px-4 py-3">{formatDate(product.updated_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link className="font-medium underline" href={`/admin/products/${product.id}/edit`}>
                        Modifier
                      </Link>
                      {product.status !== 'published' && (
                        <form action={publishProductAction}>
                          <input type="hidden" name="productId" value={product.id} />
                          <button type="submit" className="font-medium text-emerald-700 underline">
                            Publier
                          </button>
                        </form>
                      )}
                      {product.status !== 'archived' && (
                        <form action={archiveProductAction}>
                          <input type="hidden" name="productId" value={product.id} />
                          <button type="submit" className="font-medium text-red-700 underline">
                            Archiver
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-green-800/60" colSpan={10}>
                    Aucun produit trouvé.
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
