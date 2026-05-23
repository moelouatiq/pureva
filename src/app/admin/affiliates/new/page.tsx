import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import AffiliateForm from '../AffiliateForm'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function valueOf(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

export default async function NewAdminAffiliatePage({ searchParams }: Props) {
  const access = await requireAdmin()

  if (access.status === 'setup_required') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        Configuration Supabase requise pour creer un influenceur.
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
  const error = valueOf(params.error)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/affiliates" className="text-sm text-green-800/60 underline">
          Retour aux influenceurs
        </Link>
        <h1 className="mt-2 text-3xl font-heading font-bold">Nouvel influenceur</h1>
      </div>

      {error === 'validation' && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Certains champs influenceur sont invalides.
        </p>
      )}
      {error === 'config' && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Le suivi influenceurs n&apos;est pas encore configure.
        </p>
      )}
      {error === 'save' && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Impossible d&apos;enregistrer l&apos;influenceur.
        </p>
      )}

      <AffiliateForm />
    </div>
  )
}
