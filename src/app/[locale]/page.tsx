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
import JsonLd, { organizationJsonLd } from '@/components/shared/JsonLd'

type Props = {
  params: Promise<{ locale: string }>
}

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

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <HeroSection />
      <ProductStorySlider />
      <ProblemSection />
      <RoutineStepsSection />
      <BestSellersSection locale={locale} />
      <IngredientsPreviewSection />
      <BenefitsSection />
      <FAQPreviewSection />
      <FinalCTASection />
    </>
  )
}
