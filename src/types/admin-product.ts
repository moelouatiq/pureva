export const PRODUCT_CATEGORIES = [
  'oil',
  'serum',
  'lotion',
  'mask',
  'pack',
  'powder',
  'hair_care',
  'foot_care',
  'body_care',
] as const
export const PRODUCT_PRICE_STATUSES = ['confirmed', 'placeholder'] as const
export const PRODUCT_SIZE_STATUSES = ['confirmed', 'placeholder'] as const
export const PRODUCT_STOCK_STATUSES = ['in_stock', 'low_stock', 'out_of_stock'] as const
export const PRODUCT_PUBLICATION_STATUSES = ['draft', 'published', 'archived'] as const
export const PRODUCT_ROUTINE_STEPS = [
  'shampoo',
  'treatment',
  'mask',
  'serum',
  'oil',
  'spray',
  'finishing',
  'other',
] as const

// Hidden marker rendered next to each admin checkbox: an unchecked box sends
// nothing, so the marker tells "unchecked" (false) apart from "not in this form".
export const CHECKBOX_PRESENT_SUFFIX = '__present'

export type AdminProductCategory = (typeof PRODUCT_CATEGORIES)[number]
export type AdminProductFieldStatus = (typeof PRODUCT_PRICE_STATUSES)[number]
export type AdminProductStockStatus = (typeof PRODUCT_STOCK_STATUSES)[number]
export type AdminProductPublicationStatus = (typeof PRODUCT_PUBLICATION_STATUSES)[number]
export type AdminProductRoutineStep = (typeof PRODUCT_ROUTINE_STEPS)[number]

export type AdminProduct = {
  id: string
  legacy_id: string | null
  slug_fr: string
  slug_en: string
  name_fr: string
  name_en: string
  short_description_fr: string | null
  short_description_en: string | null
  long_description_fr: string | null
  long_description_en: string | null
  category: AdminProductCategory
  price_cents: number | null
  price_status: AdminProductFieldStatus
  compare_at_price_cents: number | null
  currency: 'EUR'
  size: string | null
  size_status: AdminProductFieldStatus
  stock_status: AdminProductStockStatus
  images: string[]
  image_alt_fr: string[]
  image_alt_en: string[]
  benefits_fr: string[]
  benefits_en: string[]
  key_ingredients_fr: string[]
  key_ingredients_en: string[]
  composition_note_fr: string | null
  composition_note_en: string | null
  ingredients_inci_fr: string | null
  ingredients_inci_en: string | null
  how_to_use_fr: string | null
  how_to_use_en: string | null
  precautions_fr: string | null
  precautions_en: string | null
  target_audience_fr: string | null
  target_audience_en: string | null
  usage_area_fr: string | null
  usage_area_en: string | null
  texture_fr: string | null
  texture_en: string | null
  color_fr: string | null
  color_en: string | null
  fragrance_fr: string | null
  fragrance_en: string | null
  packaging_fr: string | null
  packaging_en: string | null
  storage_instructions_fr: string | null
  storage_instructions_en: string | null
  is_best_seller: boolean
  is_routine_product: boolean
  show_on_homepage: boolean
  show_in_shop: boolean
  homepage_order: number | null
  shop_order: number | null
  routine_order: number | null
  routine_step: AdminProductRoutineStep | null
  status: AdminProductPublicationStatus
  sort_order: number
  seo_title_fr: string | null
  seo_title_en: string | null
  seo_description_fr: string | null
  seo_description_en: string | null
  created_at: string
  updated_at: string
  published_at: string | null
}

export type AdminProductEvent = {
  id: string
  product_id: string
  admin_user_id: string | null
  event_type: string
  before_snapshot: Record<string, unknown> | null
  after_snapshot: Record<string, unknown> | null
  note: string | null
  created_at: string
}
