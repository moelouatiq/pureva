'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { orderSchema } from '@/lib/order-schema'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import type { Locale } from '@/types/locale'
import type { OrderApiResponse } from '@/types/order'

export type ProductOption = {
  id: string
  name: string
  priceLabel: string
}

type Props = {
  productOptions: ProductOption[]
  defaultProduct?: string
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'
type FieldErrors = Record<string, string>

const FIELD_VALIDATION_KEYS: Record<string, string> = {
  name: 'name_required',
  email: 'email_invalid',
  phone: 'phone_required',
  country: 'country_required',
  address: 'address_required',
  product: 'product_required',
  quantity: 'quantity_min',
  consent: 'consent_required',
}

const INPUT_CLASS =
  'w-full rounded-lg border border-green-200 px-3 py-2.5 text-green-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-800/50 text-sm'
const LABEL_CLASS = 'text-sm font-medium text-green-900'
const ERROR_CLASS = 'text-xs text-red-600 mt-0.5'

export default function OrderForm({ productOptions, defaultProduct }: Props) {
  const t = useTranslations('order')
  const tWa = useTranslations('whatsapp')
  const locale = useLocale() as Locale

  const [formState, setFormState] = useState<FormState>('idle')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [apiError, setApiError] = useState('')
  const [orderReference, setOrderReference] = useState('')

  const initialProduct = defaultProduct ?? productOptions[0]?.id ?? ''
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [address, setAddress] = useState('')
  const [product, setProduct] = useState(initialProduct)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [hp, setHp] = useState('') // honeypot — must stay empty

  const waFollowUpUrl = buildWhatsAppUrl(tWa('post_order'))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFieldErrors({})
    setApiError('')

    const result = orderSchema.safeParse({
      name,
      email,
      phone,
      country,
      address,
      product,
      quantity,
      message: message || undefined,
      consent: consent as true, // Zod literal(true) rejects at runtime if false
      _hp: hp,
      locale,
    })

    if (!result.success) {
      const errors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = String(issue.path[0] ?? '')
        if (field && !errors[field]) {
          const key = FIELD_VALIDATION_KEYS[field] ?? 'generic'
          errors[field] = t(`validation.${key}`)
        }
      }
      setFieldErrors(errors)
      return
    }

    setFormState('submitting')

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })

      const data: OrderApiResponse = await res.json()

      if (!res.ok || 'error' in data) {
        if (res.status === 429) {
          setApiError(t('error.too_many_requests'))
        } else {
          setApiError(t('form.error'))
        }
        setFormState('error')
        return
      }

      setOrderReference(data.orderReference)
      setFormState('success')
    } catch {
      setApiError(t('form.error'))
      setFormState('error')
    }
  }

  const handleRetry = () => {
    setFormState('idle')
    setApiError('')
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (formState === 'success') {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-emerald-600 text-2xl" aria-hidden="true">✓</span>
          <h3 className="font-semibold text-emerald-900 text-lg">{t('form.success_title')}</h3>
        </div>

        {orderReference && (
          <p className="text-sm text-emerald-800/80">
            {t('form.reference_label')} :{' '}
            <span className="font-mono font-semibold tracking-wide">{orderReference}</span>
          </p>
        )}

        <p className="text-emerald-800/80 leading-relaxed">{t('form.success_message')}</p>

        {waFollowUpUrl !== '#' && (
          <a
            href={waFollowUpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start inline-flex items-center gap-2 bg-[var(--color-whatsapp)] hover:opacity-90 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-opacity"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.118 1.523 5.847L.057 23.882l6.222-1.449A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 0 1-5.003-1.374l-.36-.214-3.729.868.883-3.63-.235-.373A9.76 9.76 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
            </svg>
            {t('form.whatsapp_followup')}
          </a>
        )}
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot — hidden from real users, visible to bots */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}
      >
        <label htmlFor="_hp_website">Website</label>
        <input
          id="_hp_website"
          name="website"
          type="text"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Product */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="order-product" className={LABEL_CLASS}>
          {t('form.product')} <span aria-hidden="true">*</span>
        </label>
        <select
          id="order-product"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className={INPUT_CLASS}
          required
        >
          {!defaultProduct && (
            <option value="">{t('form.select_product')}</option>
          )}
          {productOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name} — {opt.priceLabel}
            </option>
          ))}
        </select>
        {fieldErrors.product && <p className={ERROR_CLASS}>{fieldErrors.product}</p>}
      </div>

      {/* Quantity */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="order-quantity" className={LABEL_CLASS}>
          {t('form.quantity')} <span aria-hidden="true">*</span>
        </label>
        <input
          id="order-quantity"
          type="number"
          min={1}
          max={99}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className={`${INPUT_CLASS} w-28`}
          required
        />
        {fieldErrors.quantity && <p className={ERROR_CLASS}>{fieldErrors.quantity}</p>}
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="order-name" className={LABEL_CLASS}>
          {t('form.name')} <span aria-hidden="true">*</span>
        </label>
        <input
          id="order-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={INPUT_CLASS}
          autoComplete="name"
          required
        />
        {fieldErrors.name && <p className={ERROR_CLASS}>{fieldErrors.name}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="order-email" className={LABEL_CLASS}>
          {t('form.email')} <span aria-hidden="true">*</span>
        </label>
        <input
          id="order-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={INPUT_CLASS}
          autoComplete="email"
          inputMode="email"
          required
        />
        {fieldErrors.email && <p className={ERROR_CLASS}>{fieldErrors.email}</p>}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="order-phone" className={LABEL_CLASS}>
          {t('form.phone')} <span aria-hidden="true">*</span>
        </label>
        <input
          id="order-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={INPUT_CLASS}
          autoComplete="tel"
          inputMode="tel"
          required
        />
        {fieldErrors.phone && <p className={ERROR_CLASS}>{fieldErrors.phone}</p>}
      </div>

      {/* Country */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="order-country" className={LABEL_CLASS}>
          {t('form.country')} <span aria-hidden="true">*</span>
        </label>
        <input
          id="order-country"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={INPUT_CLASS}
          autoComplete="country-name"
          required
        />
        {fieldErrors.country && <p className={ERROR_CLASS}>{fieldErrors.country}</p>}
      </div>

      {/* Address */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="order-address" className={LABEL_CLASS}>
          {t('form.address')} <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="order-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          className={`${INPUT_CLASS} resize-none`}
          autoComplete="street-address"
          required
        />
        {fieldErrors.address && <p className={ERROR_CLASS}>{fieldErrors.address}</p>}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="order-message" className={LABEL_CLASS}>
          {t('form.message')}
        </label>
        <textarea
          id="order-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className={`${INPUT_CLASS} resize-none`}
        />
      </div>

      {/* Consent */}
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-3 items-start">
          <input
            id="order-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 w-4 h-4 shrink-0 accent-green-900"
            required
          />
          <label htmlFor="order-consent" className="text-sm text-green-800/80 leading-snug">
            {t('form.consent')}
          </label>
        </div>
        {fieldErrors.consent && <p className={ERROR_CLASS}>{fieldErrors.consent}</p>}
      </div>

      {/* API error */}
      {formState === 'error' && apiError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 flex items-start justify-between gap-4">
          <p className="text-sm text-red-700">{apiError}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="text-xs font-medium text-red-600 underline shrink-0"
          >
            {t('form.retry')}
          </button>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={formState === 'submitting'}
        className="btn-primary self-start disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {formState === 'submitting' ? t('form.loading') : t('form.submit')}
      </button>
    </form>
  )
}
