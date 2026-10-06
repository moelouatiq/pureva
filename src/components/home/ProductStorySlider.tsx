import { getTranslations } from 'next-intl/server'
import ProductStorySliderClient, { type SlideData } from './ProductStorySliderClient'
import type { Locale } from '@/types/locale'
import type { Product } from '@/types/product'

type Props = {
  locale: Locale
  products: Product[]
  routinePackProduct?: Product
}

function productHref(product: Product, locale: Locale, routinePackProduct?: Product) {
  if (routinePackProduct?.id === product.id) return '/routine-pack'

  const slug = product.slug[locale] || product.slug.fr
  return `/products/${slug}`
}

function productDescription(product: Product, locale: Locale) {
  return (
    product.shortDescription[locale] ||
    product.shortDescription.fr ||
    product.longDescription[locale] ||
    product.longDescription.fr
  )
}

export default async function ProductStorySlider({ locale, products, routinePackProduct }: Props) {
  const t = await getTranslations('home.product_story')
  const tCommon = await getTranslations('common')

  if (products.length === 0) return null

  const categoryLabels: Record<Product['category'], string> = {
    pack: locale === 'fr' ? 'Pack' : 'Pack',
    oil: locale === 'fr' ? 'Huile' : 'Oil',
    serum: locale === 'fr' ? 'Serum' : 'Serum',
    lotion: locale === 'fr' ? 'Lotion' : 'Lotion',
    mask: locale === 'fr' ? 'Masque' : 'Mask',
    powder: locale === 'fr' ? 'Poudre' : 'Powder',
    hair_care: locale === 'fr' ? 'Soin capillaire' : 'Hair care',
    foot_care: locale === 'fr' ? 'Soin des pieds' : 'Foot care',
    body_care: locale === 'fr' ? 'Soin du corps' : 'Body care',
  }

  // Products arrive already filtered (show_on_homepage) and ordered (homepage_order).
  const slides: SlideData[] = products.map((product) => ({
    id: product.id,
    image: product.images[0] ?? '',
    imageAlt: product.imageAlts?.[locale]?.[0] || product.name[locale] || product.name.fr,
    href: productHref(product, locale, routinePackProduct),
    category: categoryLabels[product.category],
    name: product.name[locale] || product.name.fr,
    desc: productDescription(product, locale),
  }))

  return (
    <ProductStorySliderClient
      slides={slides}
      headline={t('headline')}
      subtitle={t('subtitle')}
      ctaLabel={tCommon('learn_more')}
    />
  )
}
