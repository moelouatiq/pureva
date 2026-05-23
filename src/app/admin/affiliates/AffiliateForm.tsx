import Link from 'next/link'
import { AFFILIATE_COMMISSION_TYPES, AFFILIATE_STATUSES, type AdminAffiliate } from '@/types/admin-affiliate'
import { createAffiliateAction, updateAffiliateAction } from './actions'

type AffiliateFormProps = {
  affiliate?: AdminAffiliate
}

function textValue(value: string | null | undefined): string {
  return value ?? ''
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = 'text',
  step,
}: {
  label: string
  name: string
  defaultValue?: string
  required?: boolean
  type?: string
  step?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        type={type}
        step={step}
        className="rounded-lg border border-green-200 px-3 py-2 text-sm"
      />
    </div>
  )
}

export default function AffiliateForm({ affiliate }: AffiliateFormProps) {
  const action = affiliate ? updateAffiliateAction : createAffiliateAction

  return (
    <form action={action} className="flex flex-col gap-6">
      {affiliate && <input type="hidden" name="affiliateId" value={affiliate.id} />}

      <section className="rounded-lg border border-green-900/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Influenceur</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Code affilié" name="code" required defaultValue={affiliate?.code ?? ''} />
          <Field label="Nom" name="name" required defaultValue={affiliate?.name ?? ''} />
          <Field label="Email" name="email" type="email" defaultValue={textValue(affiliate?.email)} />
          <Field label="Téléphone" name="phone" defaultValue={textValue(affiliate?.phone)} />
          <Field
            label="Instagram"
            name="instagram_handle"
            defaultValue={textValue(affiliate?.instagram_handle)}
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className="text-sm font-medium">
              Statut
            </label>
            <select
              id="status"
              name="status"
              defaultValue={affiliate?.status ?? 'active'}
              className="rounded-lg border border-green-200 px-3 py-2 text-sm"
            >
              {AFFILIATE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-green-900/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Commission</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="commission_type" className="text-sm font-medium">
              Type
            </label>
            <select
              id="commission_type"
              name="commission_type"
              defaultValue={affiliate?.commission_type ?? 'percentage'}
              className="rounded-lg border border-green-200 px-3 py-2 text-sm"
            >
              {AFFILIATE_COMMISSION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <Field
            label="Valeur"
            name="commission_value"
            type="number"
            step="0.01"
            required
            defaultValue={String(affiliate?.commission_value ?? 10)}
          />
        </div>
      </section>

      <section className="rounded-lg border border-green-900/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Notes</h2>
        <textarea
          id="notes"
          name="notes"
          defaultValue={textValue(affiliate?.notes)}
          rows={5}
          className="w-full rounded-lg border border-green-200 px-3 py-2 text-sm"
        />
      </section>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-white">
          Enregistrer
        </button>
        <Link href="/admin/affiliates" className="rounded-lg border border-green-900/15 px-4 py-2 text-sm font-semibold">
          Annuler
        </Link>
      </div>
    </form>
  )
}
