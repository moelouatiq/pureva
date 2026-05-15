export const PRODUCT_CATEGORIES = ['oil', 'serum', 'lotion', 'mask', 'pack', 'powder'] as const
export const PRODUCT_PRICE_STATUSES = ['confirmed', 'placeholder'] as const
export const PRODUCT_SIZE_STATUSES = ['confirmed', 'placeholder'] as const
export const PRODUCT_STOCK_STATUSES = ['in_stock', 'low_stock', 'out_of_stock'] as const
export const PRODUCT_PUBLICATION_STATUSES = ['draft', 'published', 'archived'] as const

export type AdminProductCategory = (typeof PRODUCT_CATEGORIES)[number]
export type AdminProductFieldStatus = (typeof PRODUCT_PRICE_STATUSES)[number]
export type AdminProductStockStatus = (typeof PRODUCT_STOCK_STATUSES)[number]
export type AdminProductPublicationStatus = (typeof PRODUCT_PUBLICATION_STATUSES)[number]

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
  benefits_fr: string[]
  benefits_en: string[]
  ingredients_inci_fr: string | null
  ingredients_inci_en: string | null
  how_to_use_fr: string | null
  how_to_use_en: string | null
  precautions_fr: string | null
  precautions_en: string | null
  is_best_seller: boolean
  is_routine_product: boolean
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
