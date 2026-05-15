'use client'

import { useMemo, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import ProductImage from '@/components/product/ProductImage'
import { detectForbiddenClaims, type ClaimWarning } from '@/lib/admin/product-claims'
import {
  PRODUCT_CATEGORIES,
  PRODUCT_PRICE_STATUSES,
  PRODUCT_PUBLICATION_STATUSES,
  PRODUCT_SIZE_STATUSES,
  PRODUCT_STOCK_STATUSES,
  type AdminProduct,
} from '@/types/admin-product'
import { createProductAction, updateProductAction } from './actions'

type ProductFormProps = {
  product?: AdminProduct
}

function listValue(value: string[] | undefined): string {
  return value?.join('\n') ?? ''
}

function textValue(value: string | null | undefined): string {
  return value ?? ''
}

function claimsFromForm(form: HTMLFormElement): Record<string, string | string[]> {
  const data = new FormData(form)
  const list = (name: string) =>
    String(data.get(name) ?? '')
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean)

  return {
    name_fr: String(data.get('name_fr') ?? ''),
    name_en: String(data.get('name_en') ?? ''),
    short_description_fr: String(data.get('short_description_fr') ?? ''),
    short_description_en: String(data.get('short_description_en') ?? ''),
    long_description_fr: String(data.get('long_description_fr') ?? ''),
    long_description_en: String(data.get('long_description_en') ?? ''),
    benefits_fr: list('benefits_fr'),
    benefits_en: list('benefits_en'),
    ingredients_inci_fr: String(data.get('ingredients_inci_fr') ?? ''),
    ingredients_inci_en: String(data.get('ingredients_inci_en') ?? ''),
    how_to_use_fr: String(data.get('how_to_use_fr') ?? ''),
    how_to_use_en: String(data.get('how_to_use_en') ?? ''),
    precautions_fr: String(data.get('precautions_fr') ?? ''),
    precautions_en: String(data.get('precautions_en') ?? ''),
    seo_title_fr: String(data.get('seo_title_fr') ?? ''),
    seo_title_en: String(data.get('seo_title_en') ?? ''),
    seo_description_fr: String(data.get('seo_description_fr') ?? ''),
    seo_description_en: String(data.get('seo_description_en') ?? ''),
  }
}

function claimWarningsForProduct(product?: AdminProduct): ClaimWarning[] {
  if (!product) return []
  return detectForbiddenClaims({
    name_fr: product.name_fr,
    name_en: product.name_en,
    short_description_fr: product.short_description_fr ?? '',
    short_description_en: product.short_description_en ?? '',
    long_description_fr: product.long_description_fr ?? '',
    long_description_en: product.long_description_en ?? '',
    benefits_fr: product.benefits_fr,
    benefits_en: product.benefits_en,
    ingredients_inci_fr: product.ingredients_inci_fr ?? '',
    ingredients_inci_en: product.ingredients_inci_en ?? '',
    how_to_use_fr: product.how_to_use_fr ?? '',
    how_to_use_en: product.how_to_use_en ?? '',
    precautions_fr: product.precautions_fr ?? '',
    precautions_en: product.precautions_en ?? '',
    seo_title_fr: product.seo_title_fr ?? '',
    seo_title_en: product.seo_title_en ?? '',
    seo_description_fr: product.seo_description_fr ?? '',
    seo_description_en: product.seo_description_en ?? '',
  })
}

function Field({
  label,
  name,
  defaultValue,
  required,
  maxLength,
}: {
  label: string
  name: string
  defaultValue?: string
  required?: boolean
  maxLength?: number
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
        maxLength={maxLength}
        className="rounded-lg border border-green-200 px-3 py-2 text-sm"
      />
    </div>
  )
}

function TextArea({
  label,
  name,
  defaultValue,
  rows = 4,
}: {
  label: string
  name: string
  defaultValue?: string
  rows?: number
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="rounded-lg border border-green-200 px-3 py-2 text-sm"
      />
    </div>
  )
}

export default function ProductForm({ product }: ProductFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [tab, setTab] = useState<'fr' | 'en'>('fr')
  const [warnings, setWarnings] = useState<ClaimWarning[]>(() => claimWarningsForProduct(product))
  const [imageText, setImageText] = useState(listValue(product?.images))
  const action = product ? updateProductAction : createProductAction
  const imagePaths = useMemo(
    () => imageText.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
    [imageText]
  )

  function updateWarnings() {
    if (!formRef.current) return
    setWarnings(detectForbiddenClaims(claimsFromForm(formRef.current)))
  }

  function handleInput(event: FormEvent<HTMLFormElement>) {
    updateWarnings()
    const target = event.target
    if (target instanceof HTMLTextAreaElement && target.name === 'images') {
      setImageText(target.value)
    }
  }

  return (
    <form ref={formRef} action={action} onInput={handleInput} className="flex flex-col gap-6">
      {product && <input type="hidden" name="productId" value={product.id} />}

      {warnings.length > 0 && (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Claims à vérifier avant publication</p>
          <p className="mt-1">
            La sauvegarde en brouillon reste possible, mais la publication sera bloquée.
          </p>
          <ul className="mt-3 flex flex-col gap-1">
            {warnings.map((warning, index) => (
              <li key={`${warning.field}-${warning.term}-${index}`}>
                {warning.field}: “{warning.term}”
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-lg border border-green-900/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Général</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-sm font-medium">Catégorie</label>
            <select id="category" name="category" defaultValue={product?.category ?? 'oil'} className="rounded-lg border border-green-200 px-3 py-2 text-sm">
              {PRODUCT_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className="text-sm font-medium">Statut</label>
            <select id="status" name="status" defaultValue={product?.status ?? 'draft'} className="rounded-lg border border-green-200 px-3 py-2 text-sm">
              {PRODUCT_PUBLICATION_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="stock_status" className="text-sm font-medium">Stock</label>
            <select id="stock_status" name="stock_status" defaultValue={product?.stock_status ?? 'in_stock'} className="rounded-lg border border-green-200 px-3 py-2 text-sm">
              {PRODUCT_STOCK_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <Field label="Legacy ID" name="legacy_id" defaultValue={textValue(product?.legacy_id)} />
          <Field label="Ordre" name="sort_order" defaultValue={String(product?.sort_order ?? 0)} />
          <div className="flex flex-col justify-end gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_best_seller" defaultChecked={product?.is_best_seller ?? false} className="h-4 w-4 rounded border-green-300" />
              Best seller
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_routine_product" defaultChecked={product?.is_routine_product ?? false} className="h-4 w-4 rounded border-green-300" />
              Produit routine
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-green-900/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Prix et format</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Prix en centimes" name="price_cents" defaultValue={product?.price_cents?.toString() ?? ''} />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="price_status" className="text-sm font-medium">Statut du prix</label>
            <select id="price_status" name="price_status" defaultValue={product?.price_status ?? 'placeholder'} className="rounded-lg border border-green-200 px-3 py-2 text-sm">
              {PRODUCT_PRICE_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <Field label="Prix barré en centimes" name="compare_at_price_cents" defaultValue={product?.compare_at_price_cents?.toString() ?? ''} />
          <input type="hidden" name="currency" value="EUR" />
          <Field label="Format" name="size" defaultValue={textValue(product?.size)} />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="size_status" className="text-sm font-medium">Statut du format</label>
            <select id="size_status" name="size_status" defaultValue={product?.size_status ?? 'placeholder'} className="rounded-lg border border-green-200 px-3 py-2 text-sm">
              {PRODUCT_SIZE_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-green-900/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex gap-2">
          <button type="button" onClick={() => setTab('fr')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${tab === 'fr' ? 'bg-green-900 text-white' : 'bg-green-50 text-green-900'}`}>
            FR
          </button>
          <button type="button" onClick={() => setTab('en')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${tab === 'en' ? 'bg-green-900 text-white' : 'bg-green-50 text-green-900'}`}>
            EN
          </button>
        </div>

        <div className={tab === 'fr' ? 'grid gap-4' : 'hidden'}>
          <Field label="Slug FR" name="slug_fr" required defaultValue={product?.slug_fr ?? ''} />
          <Field label="Nom FR" name="name_fr" required defaultValue={product?.name_fr ?? ''} />
          <TextArea label="Description courte FR" name="short_description_fr" defaultValue={textValue(product?.short_description_fr)} rows={3} />
          <TextArea label="Description longue FR" name="long_description_fr" defaultValue={textValue(product?.long_description_fr)} rows={5} />
          <TextArea label="Bénéfices FR (un par ligne)" name="benefits_fr" defaultValue={listValue(product?.benefits_fr)} rows={6} />
          <TextArea label="INCI FR" name="ingredients_inci_fr" defaultValue={textValue(product?.ingredients_inci_fr)} rows={4} />
          <TextArea label="Utilisation FR" name="how_to_use_fr" defaultValue={textValue(product?.how_to_use_fr)} rows={4} />
          <TextArea label="Précautions FR" name="precautions_fr" defaultValue={textValue(product?.precautions_fr)} rows={3} />
          <Field label="SEO title FR" name="seo_title_fr" defaultValue={textValue(product?.seo_title_fr)} maxLength={180} />
          <TextArea label="SEO description FR" name="seo_description_fr" defaultValue={textValue(product?.seo_description_fr)} rows={3} />
        </div>

        <div className={tab === 'en' ? 'grid gap-4' : 'hidden'}>
          <Field label="Slug EN" name="slug_en" required defaultValue={product?.slug_en ?? ''} />
          <Field label="Name EN" name="name_en" required defaultValue={product?.name_en ?? ''} />
          <TextArea label="Short description EN" name="short_description_en" defaultValue={textValue(product?.short_description_en)} rows={3} />
          <TextArea label="Long description EN" name="long_description_en" defaultValue={textValue(product?.long_description_en)} rows={5} />
          <TextArea label="Benefits EN (one per line)" name="benefits_en" defaultValue={listValue(product?.benefits_en)} rows={6} />
          <TextArea label="INCI EN" name="ingredients_inci_en" defaultValue={textValue(product?.ingredients_inci_en)} rows={4} />
          <TextArea label="How to use EN" name="how_to_use_en" defaultValue={textValue(product?.how_to_use_en)} rows={4} />
          <TextArea label="Precautions EN" name="precautions_en" defaultValue={textValue(product?.precautions_en)} rows={3} />
          <Field label="SEO title EN" name="seo_title_en" defaultValue={textValue(product?.seo_title_en)} maxLength={180} />
          <TextArea label="SEO description EN" name="seo_description_en" defaultValue={textValue(product?.seo_description_en)} rows={3} />
        </div>
      </section>

      <section className="rounded-lg border border-green-900/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Images</h2>
        <TextArea
          label="Chemins d’image (un par ligne)"
          name="images"
          defaultValue={listValue(product?.images)}
          rows={4}
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {imagePaths.map((path) => (
            <div key={path} className="overflow-hidden rounded-lg border border-green-900/10 bg-cream">
              <ProductImage src={path} alt={path} className="aspect-square h-full w-full" />
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Enregistrer
        </button>
        <Link href="/admin/products" className="rounded-lg border border-green-900/15 px-4 py-2 text-sm font-semibold">
          Annuler
        </Link>
      </div>
    </form>
  )
}
