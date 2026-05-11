import type { LocalizedString, LocalizedStringArray } from './locale'

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'
export type ProductCategory = 'oil' | 'serum' | 'lotion' | 'mask' | 'pack' | 'powder'

// 'confirmed' = safe to display publicly
// 'placeholder' = must not be shown as a real confirmed value
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
  category: ProductCategory
  tags: string[]
  size: string
  sizeStatus: FieldStatus
  benefits: LocalizedStringArray
  keyIngredients: string[]
  ingredients: LocalizedString
  howToUse: LocalizedString
  precautions: LocalizedString
  isBestSeller: boolean
  isRoutineProduct: boolean
  stockStatus: StockStatus
  hidden?: boolean
  whatsappMessage: LocalizedString
  seoTitle: LocalizedString
  seoDescription: LocalizedString
}
