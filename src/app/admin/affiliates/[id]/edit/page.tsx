import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import { getAdminAffiliateDetail } from '@/lib/admin/affiliates'
import AffiliateForm from '../../AffiliateForm'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function valueOf(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

function SetupError() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
      Le suivi influenceurs n&apos;est pas encore configure. Executez database/affiliate-tracking.sql dans Supabase.
    </div>
  )
}

export default async function EditAdminAffiliatePage({ params, searchParams }: Props) {
  const access = await requireAdmin()

  if (access.status === 'setup_required') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        Configuration Supabase requise pour modifier un influenceur.
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

  const error = valueOf(query.error)
  const { affiliate } = result.detail

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={`/admin/affiliates/${affiliate.id}`} className="text-sm text-green-800/60 underline">
          Retour a l&apos;influenceur
        </Link>
        <h1 className="mt-2 text-3xl font-heading font-bold">Modifier {affiliate.name}</h1>
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

      <AffiliateForm affiliate={affiliate} />
    </div>
  )
}
