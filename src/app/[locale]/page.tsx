import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import type { Locale } from '@/types/locale'
import HeroSection from '@/components/home/HeroSection'
import ProductStorySlider from '@/components/home/ProductStorySlider'
import ProblemSection from '@/components/home/ProblemSection'
import RoutineStepsSection from '@/components/home/RoutineStepsSection'
import BestSellersSection from '@/components/home/BestSellersSection'
import IngredientsPreviewSection from '@/components/home/IngredientsPreviewSection'
import BenefitsSection from '@/components/home/BenefitsSection'
import FAQPreviewSection from '@/components/home/FAQPreviewSection'
import FinalCTASection from '@/components/home/FinalCTASection'
import JsonLd, { organizationJsonLd, websiteJsonLd } from '@/components/shared/JsonLd'
import {
  findPublicRoutinePackProduct,
  getPublicBestSellers,
  getPublicProductLoadResult,
} from '@/lib/products/public-products'

type Props = {
  params: Promise<{ locale: string }>
}

export const revalidate = 300

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return buildMetadata({
    locale: locale as Locale,
    title: t('meta_title'),
    description: t('meta_description'),
    path: '',
  })
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const productLoadResult = await getPublicProductLoadResult()
  const products = productLoadResult.products
  const routinePackProduct = findPublicRoutinePackProduct(products)
  const routineProducts = products.filter(
    (product) => product.isRoutineProduct && product.category !== 'pack'
  )
  const bestSellerProducts = await getPublicBestSellers()

  if (process.env.NODE_ENV === 'development') {
    console.info('[home-products]', {
      source: productLoadResult.source,
      fallbackReason:
        productLoadResult.source === 'static' ? productLoadResult.fallbackReason : undefined,
      productCount: products.length,
      routinePackId: routinePackProduct?.id,
      routineProductCount: routineProducts.length,
      bestSellerCount: bestSellerProducts.length,
    })
  }

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd(l)} />
      <HeroSection locale={l} routinePackProduct={routinePackProduct} />
      <ProductStorySlider locale={l} products={products} routinePackProduct={routinePackProduct} />
      <ProblemSection />
      <RoutineStepsSection
        locale={l}
        routineProducts={routineProducts}
        routinePackProduct={routinePackProduct}
      />
      <BestSellersSection locale={locale} products={bestSellerProducts} />
      <IngredientsPreviewSection />
      <BenefitsSection />
      <FAQPreviewSection />
      <FinalCTASection locale={l} routinePackProduct={routinePackProduct} />
    </>
  )
}
