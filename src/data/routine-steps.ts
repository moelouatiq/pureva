import type { LocalizedString } from '@/types/locale'

export type RoutineStep = {
  step: number
  productId: string
  title: LocalizedString
  description: LocalizedString
  icon: string
}

export const routineSteps: RoutineStep[] = [
  {
    step: 1,
    productId: 'scalp-lotion',
    title: {
      fr: 'Lotion Cuir Chevelu',
      en: 'Scalp Lotion',
    },
    description: {
      fr: 'Appliquez la lotion directement sur le cuir chevelu. Massez doucement pour stimuler la circulation et préparer le terrain.',
      en: 'Apply the lotion directly to the scalp. Gently massage to stimulate circulation and prepare the base.',
    },
    icon: '💧',
  },
  {
    step: 2,
    productId: 'hair-serum',
    title: {
      fr: 'Sérum Fortifiant',
      en: 'Strengthening Serum',
    },
    description: {
      fr: 'Appliquez le sérum sur cheveux propres et humides, du cuir chevelu aux pointes. Ne rincez pas.',
      en: 'Apply the serum to clean, damp hair from scalp to ends. Do not rinse.',
    },
    icon: '✨',
  },
  {
    step: 3,
    productId: 'hair-oil',
    title: {
      fr: 'Huile Capillaire',
      en: 'Hair Oil',
    },
    description: {
      fr: 'En soin avant-shampooing ou en finition légère. Quelques gouttes suffisent pour nourrir et protéger.',
      en: 'As a pre-shampoo treatment or a light finishing touch. A few drops are enough to nourish and protect.',
    },
    icon: '🌿',
  },
  {
    step: 4,
    productId: 'hair-mask',
    title: {
      fr: 'Masque Soin',
      en: 'Hair Mask',
    },
    description: {
      fr: '1 à 2 fois par semaine, après le shampooing. Laissez poser 10 à 20 minutes puis rincez abondamment.',
      en: '1 to 2 times per week, after shampooing. Leave on for 10 to 20 minutes then rinse thoroughly.',
    },
    icon: '🪴',
  },
]
