import type { LocalizedString, LocalizedStringArray } from './locale'

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'
export type ProductCategory = 'oil' | 'serum' | 'lotion' | 'mask' | 'pack'

export type Product = {
  id: string
  slug: Record<'fr' | 'en', string>
  name: LocalizedString
  shortDescription: LocalizedString
  longDescription: LocalizedString
  price: number
  compareAtPrice?: number
  currency: 'EUR'
  images: string[]
  category: ProductCategory
  tags: string[]
  size: string
  benefits: LocalizedStringArray
  keyIngredients: string[]
  ingredients: LocalizedString
  howToUse: LocalizedString
  precautions: LocalizedString
  isBestSeller: boolean
  isRoutineProduct: boolean
  stockStatus: StockStatus
  whatsappMessage: LocalizedString
  seoTitle: LocalizedString
  seoDescription: LocalizedString
}
