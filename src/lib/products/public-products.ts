import 'server-only'

import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import { products as staticProducts, getVisibleProducts as getStaticVisibleProducts } from '@/data/products'
import { formatPrice } from '@/lib/format-price'
import { getSupabasePublicConfig } from '@/lib/supabase/config'
import type { Product, RoutineStep } from '@/types/product'
import type { Locale } from '@/types/locale'
import type { ProductOption } from '@/components/order/OrderForm'

type PublicProductRow = {
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
  category: Product['category']
  price_cents: number | null
  price_status: Product['priceStatus']
  compare_at_price_cents: number | null
  currency: 'EUR'
  size: string | null
  size_status: Product['sizeStatus']
  stock_status: Product['stockStatus']
  images: unknown
  image_alt_fr?: unknown
  image_alt_en?: unknown
  benefits_fr: unknown
  benefits_en: unknown
  key_ingredients_fr?: unknown
  key_ingredients_en?: unknown
  composition_note_fr?: string | null
  composition_note_en?: string | null
  ingredients_inci_fr: string | null
  ingredients_inci_en: string | null
  how_to_use_fr: string | null
  how_to_use_en: string | null
  precautions_fr: string | null
  precautions_en: string | null
  target_audience_fr?: string | null
  target_audience_en?: string | null
  usage_area_fr?: string | null
  usage_area_en?: string | null
  texture_fr?: string | null
  texture_en?: string | null
  color_fr?: string | null
  color_en?: string | null
  fragrance_fr?: string | null
  fragrance_en?: string | null
  packaging_fr?: string | null
  packaging_en?: string | null
  storage_instructions_fr?: string | null
  storage_instructions_en?: string | null
  is_best_seller: boolean
  is_routine_product: boolean
  // Optional so rows still map before the visibility migration is applied.
  show_on_homepage?: boolean
  show_in_shop?: boolean
  homepage_order?: number | null
  shop_order?: number | null
  routine_order?: number | null
  routine_step?: RoutineStep | null
  status: 'published'
  sort_order: number
  seo_title_fr: string | null
  seo_title_en: string | null
  seo_description_fr: string | null
  seo_description_en: string | null
  created_at: string
}

export type PublicProductFallbackReason = 'missing_env' | 'query_error'

export type PublicProductLoadResult =
  | { source: 'db'; products: Product[] }
  | { source: 'static'; products: Product[]; fallbackReason: PublicProductFallbackReason }

export type PublicRoutinePackProductResult = {
  source: PublicProductLoadResult['source']
  product: Product | undefined
  fallbackReason?: PublicProductFallbackReason
}

// Number of products the homepage slider showed before visibility was
// admin-managed; only used when a product carries no explicit homepage flag.
const LEGACY_HOMEPAGE_PRODUCT_COUNT = 5

const ROUTINE_PACK_LEGACY_ID = 'routine-pack'
const ROUTINE_PACK_SLUGS = ['routine-cheveux-fragilises', 'weakened-hair-routine']

function createPublicCatalogClient() {
  const config = getSupabasePublicConfig()
  if (!config) return null

  return createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
}

function arrayOfStrings(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }

  if (typeof value !== 'string') return []

  const trimmed = value.trim()
  if (!trimmed) return []

  try {
    const parsed: unknown = JSON.parse(trimmed)
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [trimmed]
  } catch {
    return [trimmed]
  }
}

function isDevelopment() {
  return process.env.NODE_ENV === 'development'
}

function logPublicProductsDiagnostic(
  message: string,
  details: Record<string, string | number | boolean | null | undefined>
) {
  if (!isDevelopment()) return
  console.info('[public-products]', message, details)
}

export function findPublicRoutinePackProduct(products: Product[]): Product | undefined {
  return (
    products.find(
      (product) =>
        product.id === ROUTINE_PACK_LEGACY_ID ||
        ROUTINE_PACK_SLUGS.includes(product.slug.fr) ||
        ROUTINE_PACK_SLUGS.includes(product.slug.en)
    ) ??
    products.find((product) => product.category === 'pack' && product.isRoutineProduct) ??
    products.find((product) => product.category === 'pack')
  )
}

export function mapPublicProductRow(row: PublicProductRow): Product {
  return {
    id: row.legacy_id || row.id,
    slug: {
      fr: row.slug_fr,
      en: row.slug_en,
    },
    name: {
      fr: row.name_fr,
      en: row.name_en,
    },
    shortDescription: {
      fr: row.short_description_fr ?? '',
      en: row.short_description_en ?? '',
    },
    longDescription: {
      fr: row.long_description_fr ?? '',
      en: row.long_description_en ?? '',
    },
    price: row.price_cents ?? 0,
    priceStatus: row.price_status,
    compareAtPrice: row.compare_at_price_cents ?? undefined,
    currency: row.currency,
    images: arrayOfStrings(row.images),
    imageAlts: {
      fr: arrayOfStrings(row.image_alt_fr),
      en: arrayOfStrings(row.image_alt_en),
    },
    category: row.category,
    tags: [],
    size: row.size ?? '',
    sizeStatus: row.size_status,
    benefits: {
      fr: arrayOfStrings(row.benefits_fr),
      en: arrayOfStrings(row.benefits_en),
    },
    keyIngredients: [],
    highlightedIngredients: {
      fr: arrayOfStrings(row.key_ingredients_fr),
      en: arrayOfStrings(row.key_ingredients_en),
    },
    compositionNote: {
      fr: row.composition_note_fr ?? '',
      en: row.composition_note_en ?? '',
    },
    ingredients: {
      fr: row.ingredients_inci_fr ?? '',
      en: row.ingredients_inci_en ?? '',
    },
    howToUse: {
      fr: row.how_to_use_fr ?? '',
      en: row.how_to_use_en ?? '',
    },
    precautions: {
      fr: row.precautions_fr ?? '',
      en: row.precautions_en ?? '',
    },
    targetAudience: {
      fr: row.target_audience_fr ?? '',
      en: row.target_audience_en ?? '',
    },
    usageArea: {
      fr: row.usage_area_fr ?? '',
      en: row.usage_area_en ?? '',
    },
    texture: {
      fr: row.texture_fr ?? '',
      en: row.texture_en ?? '',
    },
    color: {
      fr: row.color_fr ?? '',
      en: row.color_en ?? '',
    },
    fragrance: {
      fr: row.fragrance_fr ?? '',
      en: row.fragrance_en ?? '',
    },
    packaging: {
      fr: row.packaging_fr ?? '',
      en: row.packaging_en ?? '',
    },
    storageInstructions: {
      fr: row.storage_instructions_fr ?? '',
      en: row.storage_instructions_en ?? '',
    },
    isBestSeller: row.is_best_seller,
    isRoutineProduct: row.is_routine_product,
    showOnHomepage: row.show_on_homepage,
    showInShop: row.show_in_shop,
    homepageOrder: row.homepage_order ?? null,
    shopOrder: row.shop_order ?? null,
    routineOrder: row.routine_order ?? null,
    routineStep: row.routine_step ?? null,
    stockStatus: row.stock_status,
    whatsappMessage: {
      fr: `Bonjour, je souhaite commander ${row.name_fr} Pureva. Pouvez-vous confirmer la disponibilité ?`,
      en: `Hello, I would like to order ${row.name_en} from Pureva. Could you confirm availability?`,
    },
    seoTitle: {
      fr: row.seo_title_fr ?? '',
      en: row.seo_title_en ?? '',
    },
    seoDescription: {
      fr: row.seo_description_fr ?? '',
      en: row.seo_description_en ?? '',
    },
  }
}

function legacyRoutineStep(product: Product): RoutineStep | null {
  if (!product.isRoutineProduct || product.category === 'pack') return null
  if (product.category === 'oil' || product.category === 'serum' || product.category === 'mask') {
    return product.category
  }
  return product.category === 'lotion' ? 'treatment' : 'other'
}

// Products without explicit visibility flags (static fallback catalog, or DB
// rows read before the visibility migration) keep their historical placement.
// Explicit DB values are never overridden.
function withVisibilityDefaults(products: Product[]): Product[] {
  return products.map((product, index) => ({
    ...product,
    showOnHomepage: product.showOnHomepage ?? index < LEGACY_HOMEPAGE_PRODUCT_COUNT,
    showInShop: product.showInShop ?? true,
    homepageOrder: product.homepageOrder ?? null,
    shopOrder: product.shopOrder ?? null,
    routineOrder: product.routineOrder ?? null,
    routineStep: product.routineStep === undefined ? legacyRoutineStep(product) : product.routineStep,
  }))
}

// Stable sort: products with an explicit order come first (ascending); the
// rest keep the catalog order (sort_order, then created_at).
function sortByOptionalOrder(
  products: Product[],
  orderOf: (product: Product) => number | null | undefined
): Product[] {
  return [...products].sort((a, b) => {
    const orderA = orderOf(a)
    const orderB = orderOf(b)
    if (orderA == null && orderB == null) return 0
    if (orderA == null) return 1
    if (orderB == null) return -1
    return orderA - orderB
  })
}

async function loadPublishedProducts(): Promise<PublicProductLoadResult> {
  const supabase = createPublicCatalogClient()
  if (!supabase) {
    const products = withVisibilityDefaults(getStaticVisibleProducts())
    logPublicProductsDiagnostic('using static fallback', {
      source: 'static',
      fallbackReason: 'missing_env',
      productCount: products.length,
    })
    return { source: 'static', products, fallbackReason: 'missing_env' }
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    if (isDevelopment()) {
      console.warn('[public-products] Supabase published products query failed', {
        code: error.code,
        message: error.message,
      })
    }
    const products = withVisibilityDefaults(getStaticVisibleProducts())
    logPublicProductsDiagnostic('using static fallback', {
      source: 'static',
      fallbackReason: 'query_error',
      productCount: products.length,
    })
    return { source: 'static', products, fallbackReason: 'query_error' }
  }

  // Important: a successful empty DB result is treated as intentional catalog
  // state. If admins archive/unpublish every product, do not revive static
  // fallback products and accidentally show old catalog content.
  const products = withVisibilityDefaults(((data ?? []) as PublicProductRow[]).map(mapPublicProductRow))
  logPublicProductsDiagnostic('loaded published products', {
    source: 'db',
    productCount: products.length,
  })
  return { source: 'db', products }
}

export const getPublicProductLoadResult = cache(loadPublishedProducts)

export async function getPublicProducts(): Promise<Product[]> {
  const result = await getPublicProductLoadResult()
  return result.products
}

export async function getPublicVisibleProducts(): Promise<Product[]> {
  return getPublicProducts()
}

export async function getPublicProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getPublicProducts()
  return products.find((product) => product.slug.fr === slug || product.slug.en === slug)
}

export async function getPublicShopProducts(): Promise<Product[]> {
  const products = (await getPublicProducts()).filter((product) => product.showInShop !== false)
  return sortByOptionalOrder(products, (product) => product.shopOrder)
}

export async function getPublicHomepageProducts(): Promise<Product[]> {
  const products = (await getPublicProducts()).filter((product) => product.showOnHomepage === true)
  return sortByOptionalOrder(products, (product) => product.homepageOrder)
}

// An empty selection stays empty: the section is hidden rather than filled
// with other products.
export async function getPublicBestSellers(): Promise<Product[]> {
  const result = await getPublicProductLoadResult()
  const bestSellers = result.products.filter((product) => product.isBestSeller)

  logPublicProductsDiagnostic('best sellers resolved', {
    source: result.source,
    fallbackReason: result.source === 'static' ? result.fallbackReason : undefined,
    bestSellerCount: bestSellers.length,
    productCount: result.products.length,
  })
  return bestSellers
}

export async function getPublicRoutineProducts(): Promise<Product[]> {
  const products = (await getPublicProducts()).filter(
    (product) => product.isRoutineProduct && product.category !== 'pack'
  )
  return sortByOptionalOrder(products, (product) => product.routineOrder)
}

export async function getPublicRoutinePackProduct(): Promise<PublicRoutinePackProductResult> {
  const result = await getPublicProductLoadResult()
  const product = findPublicRoutinePackProduct(result.products)

  logPublicProductsDiagnostic('routine pack product resolved', {
    source: result.source,
    fallbackReason: result.source === 'static' ? result.fallbackReason : undefined,
    productIdOrLegacyId: product?.id,
    imageUrl: product?.images[0],
    found: Boolean(product),
  })

  if (result.source === 'static') {
    return {
      source: result.source,
      product,
      fallbackReason: result.fallbackReason,
    }
  }

  return {
    source: result.source,
    product,
  }
}

export async function getPublicCrossSellProducts(): Promise<Product[]> {
  return (await getPublicProducts()).filter(
    (product) => !product.isRoutineProduct && product.category === 'powder'
  )
}

export async function buildPublicProductOptions(
  locale: Locale,
  pricePlaceholderLabel: string
): Promise<ProductOption[]> {
  return [...(await getPublicProducts())]
    .sort((a, b) => {
      if (a.category === 'pack') return -1
      if (b.category === 'pack') return 1
      if (a.isRoutineProduct && !b.isRoutineProduct) return -1
      if (!a.isRoutineProduct && b.isRoutineProduct) return 1
      return 0
    })
    .map((product) => ({
      id: product.id,
      name: product.name[locale] ?? product.name.fr,
      priceLabel:
        product.priceStatus === 'confirmed' && product.price > 0
          ? formatPrice(product.price, locale)
          : pricePlaceholderLabel,
    }))
}

export async function resolvePublicOrderProduct(productId: string): Promise<Product | undefined> {
  const supabase = createPublicCatalogClient()
  if (!supabase) {
    return staticProducts.find((product) => product.id === productId && product.hidden !== true)
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(productId)
  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'published')
    .limit(1)

  query = isUuid ? query.or(`id.eq.${productId},legacy_id.eq.${productId}`) : query.eq('legacy_id', productId)

  const { data, error } = await query
    .maybeSingle()

  if (error) {
    return staticProducts.find((product) => product.id === productId && product.hidden !== true)
  }

  return data ? mapPublicProductRow(data as PublicProductRow) : undefined
}
