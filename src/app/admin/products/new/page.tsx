import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import ProductForm from '../ProductForm'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function valueOf(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

export default async function NewAdminProductPage({ searchParams }: Props) {
  const access = await requireAdmin()

  if (access.status === 'setup_required') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        Configuration Supabase requise pour créer un produit.
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
  const error = valueOf(params.error)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/products" className="text-sm text-green-800/60 underline">
          Retour aux produits
        </Link>
        <h1 className="mt-2 text-3xl font-heading font-bold">Nouveau produit</h1>
      </div>

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

      <ProductForm />
    </div>
  )
}
