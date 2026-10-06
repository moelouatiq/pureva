import type { LocalizedString, LocalizedStringArray } from './locale'

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'
export type ProductCategory =
  | 'oil'
  | 'serum'
  | 'lotion'
  | 'mask'
  | 'pack'
  | 'powder'
  | 'hair_care'
  | 'foot_care'
  | 'body_care'

// 'confirmed' = safe to display publicly
// 'placeholder' = must not be shown as a real confirmed value
export type RoutineStep =
  | 'shampoo'
  | 'treatment'
  | 'mask'
  | 'serum'
  | 'oil'
  | 'spray'
  | 'finishing'
  | 'other'

export type FieldStatus = 'confirmed' | 'placeholder'

export type Product = {
  id: string
  slug: Record<'fr' | 'en', string>
  name: LocalizedString
  shortDescription: LocalizedString
  longDescription: LocalizedString
  price: number
  priceStatus: FieldStatus
  compareAtPrice?: number
  currency: 'EUR'
  images: string[]
  imageAlts?: LocalizedStringArray
  category: ProductCategory
  tags: string[]
  size: string
  sizeStatus: FieldStatus
  benefits: LocalizedStringArray
  keyIngredients: string[]
  highlightedIngredients?: LocalizedStringArray
  compositionNote?: LocalizedString
  ingredients: LocalizedString
  howToUse: LocalizedString
  precautions: LocalizedString
  targetAudience?: LocalizedString
  usageArea?: LocalizedString
  texture?: LocalizedString
  color?: LocalizedString
  fragrance?: LocalizedString
  packaging?: LocalizedString
  storageInstructions?: LocalizedString
  isBestSeller: boolean
  // isRoutineProduct doubles as the admin "show in routine" flag.
  isRoutineProduct: boolean
  // Visibility controls managed from /admin/products. Optional so the static
  // fallback catalog in src/data/products.ts keeps compiling unchanged.
  showOnHomepage?: boolean
  showInShop?: boolean
  homepageOrder?: number | null
  shopOrder?: number | null
  routineOrder?: number | null
  routineStep?: RoutineStep | null
  stockStatus: StockStatus
  hidden?: boolean
  whatsappMessage: LocalizedString
  seoTitle: LocalizedString
  seoDescription: LocalizedString
}
