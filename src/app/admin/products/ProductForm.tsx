'use client'

import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import Link from 'next/link'
import ProductImage from '@/components/product/ProductImage'
import { detectForbiddenClaims, type ClaimWarning } from '@/lib/admin/product-claims'
import {
  CHECKBOX_PRESENT_SUFFIX,
  PRODUCT_CATEGORIES,
  PRODUCT_PRICE_STATUSES,
  PRODUCT_PUBLICATION_STATUSES,
  PRODUCT_ROUTINE_STEPS,
  PRODUCT_SIZE_STATUSES,
  PRODUCT_STOCK_STATUSES,
  type AdminProduct,
  type AdminProductRoutineStep,
} from '@/types/admin-product'
import { createProductAction, updateProductAction } from './actions'
import { uploadProductImageAction } from './image-actions'

type ProductFormProps = {
  product?: AdminProduct
}

const ROUTINE_STEP_LABELS: Record<AdminProductRoutineStep, string> = {
  shampoo: 'Shampoing',
  treatment: 'Soin / lotion',
  mask: 'Masque',
  serum: 'Sérum',
  oil: 'Huile',
  spray: 'Spray',
  finishing: 'Finition',
  other: 'Autre',
}

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_UPLOAD_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function listValue(value: string[] | undefined): string {
  return value?.join('\n') ?? ''
}

function listEntries(value: string): string[] {
  return value.split(/\r?\n/).map((item) => item.trim())
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
    key_ingredients_fr: list('key_ingredients_fr'),
    key_ingredients_en: list('key_ingredients_en'),
    composition_note_fr: String(data.get('composition_note_fr') ?? ''),
    composition_note_en: String(data.get('composition_note_en') ?? ''),
    ingredients_inci_fr: String(data.get('ingredients_inci_fr') ?? ''),
    ingredients_inci_en: String(data.get('ingredients_inci_en') ?? ''),
    how_to_use_fr: String(data.get('how_to_use_fr') ?? ''),
    how_to_use_en: String(data.get('how_to_use_en') ?? ''),
    precautions_fr: String(data.get('precautions_fr') ?? ''),
    precautions_en: String(data.get('precautions_en') ?? ''),
    target_audience_fr: String(data.get('target_audience_fr') ?? ''),
    target_audience_en: String(data.get('target_audience_en') ?? ''),
    usage_area_fr: String(data.get('usage_area_fr') ?? ''),
    usage_area_en: String(data.get('usage_area_en') ?? ''),
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
    key_ingredients_fr: product.key_ingredients_fr ?? [],
    key_ingredients_en: product.key_ingredients_en ?? [],
    composition_note_fr: product.composition_note_fr ?? '',
    composition_note_en: product.composition_note_en ?? '',
    ingredients_inci_fr: product.ingredients_inci_fr ?? '',
    ingredients_inci_en: product.ingredients_inci_en ?? '',
    how_to_use_fr: product.how_to_use_fr ?? '',
    how_to_use_en: product.how_to_use_en ?? '',
    precautions_fr: product.precautions_fr ?? '',
    precautions_en: product.precautions_en ?? '',
    target_audience_fr: product.target_audience_fr ?? '',
    target_audience_en: product.target_audience_en ?? '',
    usage_area_fr: product.usage_area_fr ?? '',
    usage_area_en: product.usage_area_en ?? '',
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

function Toggle({
  label,
  name,
  defaultChecked,
  checked,
  onChange,
}: {
  label: string
  name: string
  defaultChecked?: boolean
  checked?: boolean
  onChange?: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="hidden" name={`${name}${CHECKBOX_PRESENT_SUFFIX}`} value="1" />
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange ? (event) => onChange(event.target.checked) : undefined}
        className="h-4 w-4 rounded border-green-300"
      />
      {label}
    </label>
  )
}

// Options for a select, always including the stored value. Without this, a
// value the UI does not list yet (e.g. a new category) is silently replaced by
// the first option on save — which is how products were reset to "oil".
function optionsWithCurrent(options: readonly string[], current: string | null | undefined): string[] {
  return current && !options.includes(current) ? [current, ...options] : [...options]
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<'fr' | 'en'>('fr')
  const [showInRoutine, setShowInRoutine] = useState(product?.is_routine_product ?? false)
  const [warnings, setWarnings] = useState<ClaimWarning[]>(() => claimWarningsForProduct(product))
  const [imageText, setImageText] = useState(listValue(product?.images))
  const [imageAltFrText, setImageAltFrText] = useState(listValue(product?.image_alt_fr))
  const [imageAltEnText, setImageAltEnText] = useState(listValue(product?.image_alt_en))
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const action = product ? updateProductAction : createProductAction
  const imagePaths = useMemo(
    () => imageText.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
    [imageText]
  )
  const imageAltsFr = useMemo(() => listEntries(imageAltFrText), [imageAltFrText])
  const imageAltsEn = useMemo(() => listEntries(imageAltEnText), [imageAltEnText])

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

  function setImages(paths: string[]) {
    setImageText(listValue(paths.map((path) => path.trim()).filter(Boolean)))
  }

  function setImageAlts(fr: string[], en: string[]) {
    setImageAltFrText(listValue(fr))
    setImageAltEnText(listValue(en))
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadMessage(null)
    setUploadError(null)

    if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
      setUploadError('Format accepté : JPG, PNG ou WebP.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setUploadError('Taille max : 5 Mo.')
      event.target.value = ''
      return
    }

    const formData = new FormData()
    formData.set('image', file)
    if (product?.id) {
      formData.set('productId', product.id)
    }

    setIsUploading(true)
    let result: Awaited<ReturnType<typeof uploadProductImageAction>>
    try {
      result = await uploadProductImageAction(formData)
    } catch {
      setIsUploading(false)
      event.target.value = ''
      setUploadError('Upload impossible pour le moment.')
      return
    }
    setIsUploading(false)
    event.target.value = ''

    if (!result.success) {
      setUploadError(result.error)
      return
    }

    setImages([...imagePaths, result.url])
    setImageAlts([...imageAltsFr, ''], [...imageAltsEn, ''])
    setUploadMessage('Image uploadée.')
  }

  function removeImage(index: number) {
    setImages(imagePaths.filter((_, itemIndex) => itemIndex !== index))
    setImageAlts(
      imageAltsFr.filter((_, itemIndex) => itemIndex !== index),
      imageAltsEn.filter((_, itemIndex) => itemIndex !== index)
    )
  }

  function setMainImage(index: number) {
    const nextImages = [...imagePaths]
    const [selected] = nextImages.splice(index, 1)
    if (!selected) return
    setImages([selected, ...nextImages])
    const nextAltsFr = [...imageAltsFr]
    const nextAltsEn = [...imageAltsEn]
    const [selectedAltFr = ''] = nextAltsFr.splice(index, 1)
    const [selectedAltEn = ''] = nextAltsEn.splice(index, 1)
    setImageAlts([selectedAltFr, ...nextAltsFr], [selectedAltEn, ...nextAltsEn])
  }

  function moveImage(index: number, direction: -1 | 1) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= imagePaths.length) return
    const nextImages = [...imagePaths]
    const current = nextImages[index]
    const next = nextImages[nextIndex]
    if (!current || !next) return
    nextImages[index] = next
    nextImages[nextIndex] = current
    setImages(nextImages)
    const nextAltsFr = [...imageAltsFr]
    const nextAltsEn = [...imageAltsEn]
    ;[nextAltsFr[index], nextAltsFr[nextIndex]] = [nextAltsFr[nextIndex] ?? '', nextAltsFr[index] ?? '']
    ;[nextAltsEn[index], nextAltsEn[nextIndex]] = [nextAltsEn[nextIndex] ?? '', nextAltsEn[index] ?? '']
    setImageAlts(nextAltsFr, nextAltsEn)
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
              {optionsWithCurrent(PRODUCT_CATEGORIES, product?.category).map((item) => <option key={item} value={item}>{item}</option>)}
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
          <Field label="Ordre général" name="sort_order" defaultValue={String(product?.sort_order ?? 0)} />
        </div>
      </section>

      <section className="rounded-lg border border-green-900/10 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Visibilité du produit</h2>
        <p className="mt-1 mb-4 text-sm text-green-900/65">
          Un produit n’apparaît sur le site que s’il est publié. Ces options choisissent où il apparaît
          une fois publié. Ordre : plus petit = affiché en premier (ex. 10, 20, 30). Vide = après les
          produits ordonnés.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Toggle label="Afficher sur la page d’accueil" name="show_on_homepage" defaultChecked={product?.show_on_homepage ?? false} />
            <Toggle label="Afficher dans la boutique" name="show_in_shop" defaultChecked={product?.show_in_shop ?? true} />
            <Toggle label="Afficher dans la routine" name="is_routine_product" checked={showInRoutine} onChange={setShowInRoutine} />
            <Toggle label="Best seller" name="is_best_seller" defaultChecked={product?.is_best_seller ?? false} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ordre accueil" name="homepage_order" defaultValue={product?.homepage_order?.toString() ?? ''} />
            <Field label="Ordre boutique" name="shop_order" defaultValue={product?.shop_order?.toString() ?? ''} />
            <Field label="Ordre routine" name="routine_order" defaultValue={product?.routine_order?.toString() ?? ''} />
            {/* Kept mounted when hidden so the saved step survives toggling routine off and on. */}
            <div className={showInRoutine ? 'flex flex-col gap-1.5' : 'hidden'}>
              <label htmlFor="routine_step" className="text-sm font-medium">Étape de routine</label>
              <select id="routine_step" name="routine_step" defaultValue={product?.routine_step ?? ''} className="rounded-lg border border-green-200 px-3 py-2 text-sm">
                <option value="">—</option>
                {PRODUCT_ROUTINE_STEPS.map((item) => <option key={item} value={item}>{ROUTINE_STEP_LABELS[item]}</option>)}
              </select>
            </div>
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
          <TextArea label="Actifs / ingrédients mis en avant FR (un par ligne)" name="key_ingredients_fr" defaultValue={listValue(product?.key_ingredients_fr)} rows={6} />
          <TextArea label="Note de composition FR" name="composition_note_fr" defaultValue={textValue(product?.composition_note_fr)} rows={3} />
          <TextArea label="INCI FR" name="ingredients_inci_fr" defaultValue={textValue(product?.ingredients_inci_fr)} rows={4} />
          <TextArea label="Utilisation FR" name="how_to_use_fr" defaultValue={textValue(product?.how_to_use_fr)} rows={4} />
          <TextArea label="Précautions FR" name="precautions_fr" defaultValue={textValue(product?.precautions_fr)} rows={3} />
          <TextArea label="Public cible / type FR" name="target_audience_fr" defaultValue={textValue(product?.target_audience_fr)} rows={2} />
          <Field label="Zone d’utilisation FR" name="usage_area_fr" defaultValue={textValue(product?.usage_area_fr)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Texture / aspect FR" name="texture_fr" defaultValue={textValue(product?.texture_fr)} />
            <Field label="Couleur FR" name="color_fr" defaultValue={textValue(product?.color_fr)} />
            <Field label="Parfum FR" name="fragrance_fr" defaultValue={textValue(product?.fragrance_fr)} />
            <Field label="Conditionnement FR" name="packaging_fr" defaultValue={textValue(product?.packaging_fr)} />
          </div>
          <TextArea label="Conservation FR" name="storage_instructions_fr" defaultValue={textValue(product?.storage_instructions_fr)} rows={2} />
          <Field label="SEO title FR" name="seo_title_fr" defaultValue={textValue(product?.seo_title_fr)} maxLength={180} />
          <TextArea label="SEO description FR" name="seo_description_fr" defaultValue={textValue(product?.seo_description_fr)} rows={3} />
        </div>

        <div className={tab === 'en' ? 'grid gap-4' : 'hidden'}>
          <Field label="Slug EN" name="slug_en" required defaultValue={product?.slug_en ?? ''} />
          <Field label="Name EN" name="name_en" required defaultValue={product?.name_en ?? ''} />
          <TextArea label="Short description EN" name="short_description_en" defaultValue={textValue(product?.short_description_en)} rows={3} />
          <TextArea label="Long description EN" name="long_description_en" defaultValue={textValue(product?.long_description_en)} rows={5} />
          <TextArea label="Benefits EN (one per line)" name="benefits_en" defaultValue={listValue(product?.benefits_en)} rows={6} />
          <TextArea label="Highlighted ingredients EN (one per line)" name="key_ingredients_en" defaultValue={listValue(product?.key_ingredients_en)} rows={6} />
          <TextArea label="Composition note EN" name="composition_note_en" defaultValue={textValue(product?.composition_note_en)} rows={3} />
          <TextArea label="INCI EN" name="ingredients_inci_en" defaultValue={textValue(product?.ingredients_inci_en)} rows={4} />
          <TextArea label="How to use EN" name="how_to_use_en" defaultValue={textValue(product?.how_to_use_en)} rows={4} />
          <TextArea label="Precautions EN" name="precautions_en" defaultValue={textValue(product?.precautions_en)} rows={3} />
          <TextArea label="Target audience / type EN" name="target_audience_en" defaultValue={textValue(product?.target_audience_en)} rows={2} />
          <Field label="Application area EN" name="usage_area_en" defaultValue={textValue(product?.usage_area_en)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Texture / appearance EN" name="texture_en" defaultValue={textValue(product?.texture_en)} />
            <Field label="Colour EN" name="color_en" defaultValue={textValue(product?.color_en)} />
            <Field label="Fragrance EN" name="fragrance_en" defaultValue={textValue(product?.fragrance_en)} />
            <Field label="Packaging EN" name="packaging_en" defaultValue={textValue(product?.packaging_en)} />
          </div>
          <TextArea label="Storage instructions EN" name="storage_instructions_en" defaultValue={textValue(product?.storage_instructions_en)} rows={2} />
          <Field label="SEO title EN" name="seo_title_en" defaultValue={textValue(product?.seo_title_en)} maxLength={180} />
          <TextArea label="SEO description EN" name="seo_description_en" defaultValue={textValue(product?.seo_description_en)} rows={3} />
        </div>
      </section>

      <section className="rounded-lg border border-green-900/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Images produit</h2>
            <p className="mt-1 text-sm text-green-900/65">
              Format accepté : JPG, PNG ou WebP. Taille max : 5 Mo.
            </p>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="sr-only"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? 'Upload en cours...' : 'Uploader une image'}
            </button>
          </div>
        </div>

        {uploadError && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {uploadError}
          </p>
        )}
        {uploadMessage && (
          <p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">
            {uploadMessage}
          </p>
        )}

        {imagePaths.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {imagePaths.map((path, index) => (
              <div key={`${path}-${index}`} className="overflow-hidden rounded-lg border border-green-900/10 bg-cream">
                <div className="relative p-3">
                  <ProductImage
                    src={path}
                    alt={imageAltsFr[index] || product?.name_fr || 'Aperçu image produit'}
                    className="aspect-square h-full w-full"
                  />
                  {index === 0 && (
                    <span className="absolute left-2 top-2 rounded bg-white/95 px-2 py-1 text-xs font-semibold text-green-900 shadow-sm">
                      Image principale
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 bg-white p-3">
                  <p className="break-all text-xs text-green-900/65">{path}</p>
                  <div className="flex flex-wrap gap-2">
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => setMainImage(index)}
                        className="rounded border border-green-900/15 px-2 py-1 text-xs font-semibold text-green-900"
                      >
                        Définir principale
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => moveImage(index, -1)}
                      disabled={index === 0}
                      className="rounded border border-green-900/15 px-2 py-1 text-xs font-semibold text-green-900 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Monter
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 1)}
                      disabled={index === imagePaths.length - 1}
                      className="rounded border border-green-900/15 px-2 py-1 text-xs font-semibold text-green-900 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Descendre
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="rounded border border-red-200 px-2 py-1 text-xs font-semibold text-red-700"
                    >
                      Supprimer de ce produit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-green-900/15 bg-cream px-3 py-8 text-center text-sm text-green-900/65">
            Aucune image produit.
          </p>
        )}

        <details className="mt-5 rounded-lg border border-green-900/10 bg-green-50/40 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-green-900">
            Chemins d’image avancés
          </summary>
          <div className="mt-3 flex flex-col gap-1.5">
            <label htmlFor="images" className="text-sm font-medium">
              Chemins d’image (un par ligne)
            </label>
            <textarea
              id="images"
              name="images"
              value={imageText}
              onChange={(event) => setImageText(event.target.value)}
              rows={4}
              className="rounded-lg border border-green-200 px-3 py-2 text-sm"
            />
            <label htmlFor="image_alt_fr" className="mt-3 text-sm font-medium">
              Alt text FR (un par image, dans le même ordre)
            </label>
            <textarea
              id="image_alt_fr"
              name="image_alt_fr"
              value={imageAltFrText}
              onChange={(event) => setImageAltFrText(event.target.value)}
              rows={4}
              className="rounded-lg border border-green-200 px-3 py-2 text-sm"
            />
            <label htmlFor="image_alt_en" className="mt-3 text-sm font-medium">
              Alt text EN (one per image, in the same order)
            </label>
            <textarea
              id="image_alt_en"
              name="image_alt_en"
              value={imageAltEnText}
              onChange={(event) => setImageAltEnText(event.target.value)}
              rows={4}
              className="rounded-lg border border-green-200 px-3 py-2 text-sm"
            />
          </div>
        </details>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-white hover:cursor-pointer"
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
