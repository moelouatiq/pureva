import type { Ingredient } from '@/types/ingredient'

export const ingredients: Ingredient[] = [
  {
    id: 'fenugreek',
    name: { fr: 'Fenugrec', en: 'Fenugreek' },
    description: {
      fr: 'Plante herbacée riche en protéines, vitamines et minéraux, utilisée depuis des siècles dans les soins capillaires traditionnels.',
      en: 'An herbaceous plant rich in proteins, vitamins and minerals, used for centuries in traditional hair care.',
    },
    benefit: {
      fr: 'Aide à fortifier les cheveux et à soutenir le confort du cuir chevelu',
      en: 'Helps strengthen hair and support scalp comfort',
    },
    image: '/images/ingredients/fenugreek.jpg',
  },
  {
    id: 'amla',
    name: { fr: 'Amla', en: 'Amla' },
    description: {
      fr: "Groseillier indien, l'une des plantes les plus riches en vitamine C. Pilier de l'Ayurveda pour les soins capillaires.",
      en: 'Indian gooseberry, one of the richest sources of vitamin C. A pillar of Ayurveda for hair care.',
    },
    benefit: {
      fr: 'Aide à nourrir et à renforcer la fibre capillaire',
      en: 'Helps nourish and reinforce the hair fibre',
    },
    image: '/images/ingredients/amla.jpg',
  },
  {
    id: 'rosemary',
    name: { fr: 'Romarin', en: 'Rosemary' },
    description: {
      fr: "Plante aromatique méditerranéenne dont l'extrait est reconnu pour ses propriétés sur la vitalité du cuir chevelu.",
      en: 'Mediterranean aromatic plant whose extract is recognised for its properties on scalp vitality.',
    },
    benefit: {
      fr: 'Soutient la vitalité du cuir chevelu et aide les cheveux à paraître plus forts',
      en: 'Supports scalp vitality and helps hair look stronger',
    },
    image: '/images/ingredients/rosemary.jpg',
  },
  {
    id: 'nigella',
    name: { fr: 'Nigelle', en: 'Nigella' },
    description: {
      fr: 'Connue aussi sous le nom de "graine noire", la nigelle est un actif précieux pour les soins capillaires, riche en acides gras essentiels.',
      en: 'Also known as "black seed", nigella is a precious active in hair care, rich in essential fatty acids.',
    },
    benefit: {
      fr: 'Aide à nourrir le cuir chevelu et à soutenir la santé capillaire apparente',
      en: 'Helps nourish the scalp and support apparent hair health',
    },
    image: '/images/ingredients/nigella.jpg',
  },
  {
    id: 'hibiscus',
    name: { fr: 'Hibiscus', en: 'Hibiscus' },
    description: {
      fr: "La fleur d'hibiscus est utilisée dans les soins capillaires traditionnels pour ses propriétés nourrissantes et adoucissantes.",
      en: 'Hibiscus flower is used in traditional hair care for its nourishing and softening properties.',
    },
    benefit: {
      fr: 'Aide à adoucir et à hydrater les cheveux secs',
      en: 'Helps soften and hydrate dry hair',
    },
    image: '/images/ingredients/hibiscus.jpg',
  },
  {
    id: 'nettle',
    name: { fr: 'Ortie', en: 'Nettle' },
    description: {
      fr: "L'ortie est une plante riche en minéraux et vitamines, traditionnellement appréciée pour soutenir la vigueur des cheveux.",
      en: 'Nettle is a plant rich in minerals and vitamins, traditionally valued for supporting hair vigour.',
    },
    benefit: {
      fr: "Aide à revitaliser les cheveux et à soutenir l'éclat naturel",
      en: 'Helps revitalise hair and support natural shine',
    },
    image: '/images/ingredients/nettle.jpg',
  },
  {
    id: 'licorice',
    name: { fr: 'Réglisse', en: 'Licorice Root' },
    description: {
      fr: "La racine de réglisse est un actif apaisant utilisé pour soutenir le confort et l'équilibre du cuir chevelu.",
      en: 'Licorice root is a soothing active used to support scalp comfort and balance.',
    },
    benefit: {
      fr: "Aide à soutenir le confort et l'équilibre du cuir chevelu",
      en: 'Helps support scalp comfort and balance',
    },
    image: '/images/ingredients/licorice-root.jpg',
  },
  {
    id: 'clove',
    name: { fr: 'Clou de Girofle', en: 'Clove' },
    description: {
      fr: 'Le clou de girofle est riche en antioxydants et est utilisé dans les soins capillaires pour ses propriétés protectrices.',
      en: 'Clove is rich in antioxidants and is used in hair care for its protective properties.',
    },
    benefit: {
      fr: 'Aide à protéger les cheveux des agressions extérieures',
      en: 'Helps protect hair from external aggressors',
    },
    image: '/images/ingredients/clove.jpg',
  },
]
