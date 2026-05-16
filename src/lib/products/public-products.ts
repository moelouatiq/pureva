import 'server-only'

import { createClient } from '@supabase/supabase-js'
import { products as staticProducts, getVisibleProducts as getStaticVisibleProducts } from '@/data/products'
import { formatPrice } from '@/lib/format-price'
import { getSupabasePublicConfig } from '@/lib/supabase/config'
import type { Product } from '@/types/product'
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
  status: 'published'
  sort_order: number
  seo_title_fr: string | null
  seo_title_en: string | null
  seo_description_fr: string | null
  seo_description_en: string | null
  created_at: string
}

type ProductLoadResult =
  | { source: 'db'; products: Product[] }
  | { source: 'static'; products: Product[] }

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
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
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
    category: row.category,
    tags: [],
    size: row.size ?? '',
    sizeStatus: row.size_status,
    benefits: {
      fr: arrayOfStrings(row.benefits_fr),
      en: arrayOfStrings(row.benefits_en),
    },
    keyIngredients: [],
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
    isBestSeller: row.is_best_seller,
    isRoutineProduct: row.is_routine_product,
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

async function loadPublishedProducts(): Promise<ProductLoadResult> {
  const supabase = createPublicCatalogClient()
  if (!supabase) {
    return { source: 'static', products: getStaticVisibleProducts() }
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    return { source: 'static', products: getStaticVisibleProducts() }
  }

  // Important: a successful empty DB result is treated as intentional catalog
  // state. If admins archive/unpublish every product, do not revive static
  // fallback products and accidentally show old catalog content.
  return { source: 'db', products: ((data ?? []) as PublicProductRow[]).map(mapPublicProductRow) }
}

export async function getPublicProducts(): Promise<Product[]> {
  const result = await loadPublishedProducts()
  return result.products
}

export async function getPublicVisibleProducts(): Promise<Product[]> {
  return getPublicProducts()
}

export async function getPublicProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getPublicProducts()
  return products.find((product) => product.slug.fr === slug || product.slug.en === slug)
}

export async function getPublicBestSellers(): Promise<Product[]> {
  return (await getPublicProducts()).filter((product) => product.isBestSeller)
}

export async function getPublicRoutineProducts(): Promise<Product[]> {
  return (await getPublicProducts()).filter(
    (product) => product.isRoutineProduct && product.category !== 'pack'
  )
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
