import { getTranslations } from 'next-intl/server'
import ProductStorySliderClient, { type SlideData } from './ProductStorySliderClient'

export default async function ProductStorySlider() {
  const t = await getTranslations('home.product_story')
  const tCommon = await getTranslations('common')

  const slides: SlideData[] = [
    {
      id: 'routine',
      image: '/images/products/lotion-cuir-chevelu-10%25.png',
      href: '/routine-pack',
      category: t('slide_routine_label'),
      name: 'Routine Cheveux Fragilisés',
      desc: t('slide_routine_desc'),
    },
    {
      id: 'oil',
      image: '/images/products/huile-capillaire-fortifiante.png',
      href: '/products/huile-capillaire-fortifiante',
      category: t('slide_oil_label'),
      name: 'Huile Capillaire Fortifiante',
      desc: t('slide_oil_desc'),
    },
    {
      id: 'serum',
      image: '/images/products/serum-cheveux-fortifiant.png',
      href: '/products/serum-cheveux-fortifiant',
      category: t('slide_serum_label'),
      name: 'Sérum Capillaire',
      desc: t('slide_serum_desc'),
    },
    {
      id: 'mask',
      image: '/images/products/masque-soin-cheveux.png',
      href: '/products/masque-soin-cheveux',
      category: t('slide_mask_label'),
      name: 'Masque Soin Cheveux',
      desc: t('slide_mask_desc'),
    },
    {
      id: 'powders',
      image: '/images/products/poudre-de-sidr.jpg',
      href: '/products/poudre-de-sidr',
      category: t('slide_powders_label'),
      name: 'Poudres de Sidr & Mashat',
      desc: t('slide_powders_desc'),
    },
  ]

  return (
    <ProductStorySliderClient
      slides={slides}
      headline={t('headline')}
      subtitle={t('subtitle')}
      ctaLabel={tCommon('learn_more')}
    />
  )
}
