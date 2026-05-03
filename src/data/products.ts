import type { Product } from '@/types/product'

export const products: Product[] = [
  {
    id: 'hair-oil',
    slug: { fr: 'huile-capillaire-fortifiante', en: 'strengthening-hair-oil' },
    name: {
      fr: 'Huile Capillaire Fortifiante',
      en: 'Strengthening Hair Oil',
    },
    shortDescription: {
      fr: 'Aide à fortifier les cheveux fragilisés et à réduire la casse',
      en: 'Helps strengthen fragile hair and reduce breakage',
    },
    longDescription: {
      fr: 'Une huile légère enrichie en actifs naturels pour nourrir le cheveu en profondeur, renforcer sa fibre et soutenir la santé du cuir chevelu.',
      en: 'A lightweight oil enriched with natural actives to deeply nourish the hair shaft, strengthen its structure, and support a healthy scalp.',
    },
    price: 2490,
    currency: 'EUR',
    images: ['/images/products/hair-oil-1.jpg'],
    category: 'oil',
    tags: ['huile', 'fortifiant', 'cuir chevelu', 'oil', 'strengthening', 'scalp'],
    size: '100ml',
    benefits: {
      fr: [
        'Aide à réduire la casse',
        'Nourrit les cheveux secs',
        'Soutient le confort du cuir chevelu',
        'Laisse les cheveux plus doux et brillants',
      ],
      en: [
        'Helps reduce breakage',
        'Nourishes dry hair',
        'Supports scalp comfort',
        'Leaves hair softer and shinier',
      ],
    },
    keyIngredients: ['fenugreek', 'nigella', 'rosemary'],
    ingredients: {
      fr: 'Ricinus Communis Seed Oil, Argania Spinosa Kernel Oil, Nigella Sativa Seed Oil, Rosmarinus Officinalis Leaf Extract, Trigonella Foenum-Graecum Seed Extract, Tocopherol',
      en: 'Ricinus Communis Seed Oil, Argania Spinosa Kernel Oil, Nigella Sativa Seed Oil, Rosmarinus Officinalis Leaf Extract, Trigonella Foenum-Graecum Seed Extract, Tocopherol',
    },
    howToUse: {
      fr: "Appliquer quelques gouttes sur le cuir chevelu et les longueurs. Masser doucement. Laisser agir au moins 30 minutes avant le shampooing, ou toute la nuit.",
      en: 'Apply a few drops to the scalp and lengths. Gently massage. Leave on for at least 30 minutes before shampooing, or overnight.',
    },
    precautions: {
      fr: "Éviter le contact avec les yeux. Tenir hors de portée des enfants. Faire un test sur une petite zone avant utilisation.",
      en: 'Avoid contact with eyes. Keep out of reach of children. Perform a patch test before use.',
    },
    isBestSeller: true,
    isRoutineProduct: true,
    stockStatus: 'in_stock',
    whatsappMessage: {
      fr: "Bonjour, je souhaite commander l'Huile Capillaire Fortifiante Pureva (100ml). Pouvez-vous confirmer la disponibilité ?",
      en: 'Hello, I would like to order the Pureva Strengthening Hair Oil (100ml). Could you confirm availability?',
    },
    seoTitle: {
      fr: 'Huile Capillaire Fortifiante Naturelle | Pureva',
      en: 'Natural Strengthening Hair Oil | Pureva',
    },
    seoDescription: {
      fr: 'Huile capillaire naturelle Pureva. Aide à réduire la casse et à fortifier les cheveux fragilisés. Formulée avec fenugrec, nigelle et romarin.',
      en: 'Pureva natural hair oil. Helps reduce breakage and strengthen fragile hair. Formulated with fenugreek, nigella and rosemary.',
    },
  },
  {
    id: 'hair-serum',
    slug: { fr: 'serum-cheveux-fortifiant', en: 'strengthening-hair-serum' },
    name: {
      fr: 'Sérum Cheveux Fortifiant',
      en: 'Strengthening Hair Serum',
    },
    shortDescription: {
      fr: "Aide à renforcer la fibre capillaire et à améliorer l'aspect de la densité",
      en: 'Helps reinforce the hair fibre and improve the appearance of density',
    },
    longDescription: {
      fr: "Un sérum concentré en actifs botaniques pour aider à renforcer chaque cheveu de la racine à la pointe et soutenir l'apparence d'une chevelure plus dense.",
      en: 'A serum concentrated with botanical actives to help reinforce each strand from root to tip and support the appearance of denser-looking hair.',
    },
    price: 2790,
    currency: 'EUR',
    images: ['/images/products/hair-serum-1.jpg'],
    category: 'serum',
    tags: ['sérum', 'fortifiant', 'densité', 'serum', 'strengthening', 'density'],
    size: '50ml',
    benefits: {
      fr: [
        'Aide à renforcer les cheveux fragiles',
        "Aide à améliorer l'aspect de la densité",
        'Nourrit et hydrate en profondeur',
        'Laisse les cheveux plus doux',
      ],
      en: [
        'Helps strengthen fragile hair',
        'Helps improve the appearance of density',
        'Deeply nourishes and moisturises',
        'Leaves hair softer',
      ],
    },
    keyIngredients: ['amla', 'hibiscus', 'nettle'],
    ingredients: {
      fr: 'Aqua, Glycerin, Phyllanthus Emblica Fruit Extract, Hibiscus Sabdariffa Flower Extract, Urtica Dioica Leaf Extract, Panthenol, Allantoin, Xanthan Gum',
      en: 'Aqua, Glycerin, Phyllanthus Emblica Fruit Extract, Hibiscus Sabdariffa Flower Extract, Urtica Dioica Leaf Extract, Panthenol, Allantoin, Xanthan Gum',
    },
    howToUse: {
      fr: 'Appliquer sur cheveux propres et légèrement humides. Masser doucement sur le cuir chevelu et répartir sur les longueurs. Ne pas rincer.',
      en: 'Apply to clean, slightly damp hair. Gently massage into the scalp and distribute through the lengths. Do not rinse.',
    },
    precautions: {
      fr: "Éviter le contact avec les yeux. Tenir hors de portée des enfants. Faire un test sur une petite zone avant utilisation.",
      en: 'Avoid contact with eyes. Keep out of reach of children. Perform a patch test before use.',
    },
    isBestSeller: true,
    isRoutineProduct: true,
    stockStatus: 'in_stock',
    whatsappMessage: {
      fr: 'Bonjour, je souhaite commander le Sérum Cheveux Fortifiant Pureva (50ml). Pouvez-vous confirmer la disponibilité ?',
      en: 'Hello, I would like to order the Pureva Strengthening Hair Serum (50ml). Could you confirm availability?',
    },
    seoTitle: {
      fr: 'Sérum Fortifiant Cheveux Naturel | Pureva',
      en: 'Natural Strengthening Hair Serum | Pureva',
    },
    seoDescription: {
      fr: "Sérum capillaire naturel Pureva. Aide à renforcer les cheveux fragilisés et à améliorer l'apparence de la densité. Formulé avec amla, hibiscus et ortie.",
      en: 'Pureva natural hair serum. Helps strengthen fragile hair and improve the appearance of density. Formulated with amla, hibiscus and nettle.',
    },
  },
  {
    id: 'scalp-lotion',
    slug: { fr: 'lotion-cuir-chevelu', en: 'scalp-lotion' },
    name: {
      fr: 'Lotion Cuir Chevelu',
      en: 'Scalp Lotion',
    },
    shortDescription: {
      fr: 'Soutient le confort du cuir chevelu et prépare les cheveux à la routine',
      en: 'Supports scalp comfort and prepares hair for the routine',
    },
    longDescription: {
      fr: "Une lotion légère pour soutenir l'équilibre du cuir chevelu, apaiser les sensations d'inconfort et créer les conditions idéales pour une routine capillaire efficace.",
      en: 'A lightweight lotion to support scalp balance, soothe feelings of discomfort and create ideal conditions for an effective hair care routine.',
    },
    price: 2190,
    currency: 'EUR',
    images: ['/images/products/scalp-lotion-1.jpg'],
    category: 'lotion',
    tags: ['lotion', 'cuir chevelu', 'scalp', 'soin', 'care'],
    size: '150ml',
    benefits: {
      fr: [
        'Soutient le confort du cuir chevelu',
        'Aide à équilibrer le cuir chevelu',
        'Prépare les cheveux à la routine',
        'Formule légère non grasse',
      ],
      en: [
        'Supports scalp comfort',
        'Helps balance the scalp',
        'Prepares hair for the routine',
        'Lightweight non-greasy formula',
      ],
    },
    keyIngredients: ['rosemary', 'licorice', 'fenugreek'],
    ingredients: {
      fr: 'Aqua, Glycerin, Rosmarinus Officinalis Leaf Extract, Glycyrrhiza Glabra Root Extract, Trigonella Foenum-Graecum Seed Extract, Niacinamide, Panthenol',
      en: 'Aqua, Glycerin, Rosmarinus Officinalis Leaf Extract, Glycyrrhiza Glabra Root Extract, Trigonella Foenum-Graecum Seed Extract, Niacinamide, Panthenol',
    },
    howToUse: {
      fr: "Appliquer directement sur le cuir chevelu sec ou humide. Masser doucement. Peut être utilisé quotidiennement ou avant l'application de l'huile.",
      en: 'Apply directly to dry or damp scalp. Gently massage. Can be used daily or before applying the oil.',
    },
    precautions: {
      fr: 'Éviter le contact avec les yeux. Tenir hors de portée des enfants.',
      en: 'Avoid contact with eyes. Keep out of reach of children.',
    },
    isBestSeller: false,
    isRoutineProduct: true,
    stockStatus: 'in_stock',
    whatsappMessage: {
      fr: 'Bonjour, je souhaite commander la Lotion Cuir Chevelu Pureva (150ml). Pouvez-vous confirmer la disponibilité ?',
      en: 'Hello, I would like to order the Pureva Scalp Lotion (150ml). Could you confirm availability?',
    },
    seoTitle: {
      fr: 'Lotion Cuir Chevelu Naturelle | Pureva',
      en: 'Natural Scalp Lotion | Pureva',
    },
    seoDescription: {
      fr: 'Lotion cuir chevelu naturelle Pureva. Soutient le confort et l\'équilibre du cuir chevelu. Formulée avec romarin, réglisse et fenugrec.',
      en: 'Pureva natural scalp lotion. Supports scalp comfort and balance. Formulated with rosemary, licorice and fenugreek.',
    },
  },
  {
    id: 'hair-mask',
    slug: { fr: 'masque-soin-cheveux', en: 'hair-care-mask' },
    name: {
      fr: 'Masque Soin Cheveux',
      en: 'Hair Care Mask',
    },
    shortDescription: {
      fr: 'Nourrit en profondeur les cheveux secs et fragilisés, laisse les cheveux plus doux',
      en: 'Deeply nourishes dry and fragile hair, leaves hair softer',
    },
    longDescription: {
      fr: "Un masque riche en actifs naturels pour une nutrition intense. Aide à restaurer la souplesse et l'éclat des cheveux abîmés ou fragilisés par des agressions extérieures.",
      en: 'A mask rich in natural actives for intense nourishment. Helps restore softness and shine to damaged or fragile hair weakened by external aggressors.',
    },
    price: 2390,
    currency: 'EUR',
    images: ['/images/products/hair-mask-1.jpg'],
    category: 'mask',
    tags: ['masque', 'nutrition', 'mask', 'nourishing', 'soin'],
    size: '200ml',
    benefits: {
      fr: [
        'Nourrit en profondeur les cheveux secs',
        'Laisse les cheveux plus doux et brillants',
        'Aide à restaurer la souplesse',
        'Facilite le démêlage',
      ],
      en: [
        'Deeply nourishes dry hair',
        'Leaves hair softer and shinier',
        'Helps restore softness',
        'Eases detangling',
      ],
    },
    keyIngredients: ['amla', 'hibiscus', 'clove'],
    ingredients: {
      fr: 'Aqua, Cetearyl Alcohol, Behentrimonium Methosulfate, Glycerin, Phyllanthus Emblica Fruit Extract, Hibiscus Sabdariffa Flower Extract, Syzygium Aromaticum Flower Extract, Panthenol, Tocopherol',
      en: 'Aqua, Cetearyl Alcohol, Behentrimonium Methosulfate, Glycerin, Phyllanthus Emblica Fruit Extract, Hibiscus Sabdariffa Flower Extract, Syzygium Aromaticum Flower Extract, Panthenol, Tocopherol',
    },
    howToUse: {
      fr: "Appliquer généreusement sur cheveux propres et essorés. Laisser poser 10 à 20 minutes. Rincer abondamment à l'eau tiède. Utiliser 1 à 2 fois par semaine.",
      en: 'Apply generously to clean, towel-dried hair. Leave on for 10 to 20 minutes. Rinse thoroughly with lukewarm water. Use 1 to 2 times per week.',
    },
    precautions: {
      fr: 'Éviter le contact avec les yeux. Tenir hors de portée des enfants.',
      en: 'Avoid contact with eyes. Keep out of reach of children.',
    },
    isBestSeller: true,
    isRoutineProduct: true,
    stockStatus: 'in_stock',
    whatsappMessage: {
      fr: 'Bonjour, je souhaite commander le Masque Soin Cheveux Pureva (200ml). Pouvez-vous confirmer la disponibilité ?',
      en: 'Hello, I would like to order the Pureva Hair Care Mask (200ml). Could you confirm availability?',
    },
    seoTitle: {
      fr: 'Masque Soin Cheveux Naturel | Pureva',
      en: 'Natural Hair Care Mask | Pureva',
    },
    seoDescription: {
      fr: 'Masque cheveux naturel Pureva. Nourrit en profondeur les cheveux secs et fragilisés. Formulé avec amla, hibiscus et clou de girofle.',
      en: 'Pureva natural hair mask. Deeply nourishes dry and fragile hair. Formulated with amla, hibiscus and clove.',
    },
  },
  {
    id: 'routine-pack',
    slug: { fr: 'routine-cheveux-fragilises', en: 'weakened-hair-routine' },
    name: {
      fr: 'Pack Routine Cheveux Fragilisés',
      en: 'Weakened Hair Routine Pack',
    },
    shortDescription: {
      fr: 'La routine complète Pureva — 4 soins pour des cheveux plus forts, étape par étape',
      en: 'The complete Pureva routine — 4 treatments for stronger hair, step by step',
    },
    longDescription: {
      fr: "Le pack complet Pureva réunit les 4 produits de la routine en une offre avantageuse. Idéal pour les cheveux fragilisés, sujets à la casse et au manque de densité.",
      en: 'The complete Pureva pack brings together all 4 routine products in one advantageous offer. Ideal for fragile hair prone to breakage and lack of density.',
    },
    price: 7990,
    compareAtPrice: 8960,
    currency: 'EUR',
    images: ['/images/products/routine-pack-1.jpg'],
    category: 'pack',
    tags: ['pack', 'routine', 'complet', 'complete', 'bundle'],
    size: 'Lotion 150ml + Sérum 50ml + Huile 100ml + Masque 200ml',
    benefits: {
      fr: [
        'Routine complète pour cheveux fragilisés',
        'Aide à réduire la casse et la chute due à la casse',
        'Aide à renforcer les cheveux fragiles',
        'Soutient le confort du cuir chevelu',
        'Laisse les cheveux plus doux et brillants',
      ],
      en: [
        'Complete routine for weakened hair',
        'Helps reduce breakage and hair fall caused by breakage',
        'Helps strengthen fragile hair',
        'Supports scalp comfort',
        'Leaves hair softer and shinier',
      ],
    },
    keyIngredients: ['fenugreek', 'amla', 'rosemary', 'nigella', 'hibiscus', 'nettle', 'licorice', 'clove'],
    ingredients: {
      fr: 'Voir la liste des ingrédients de chaque produit.',
      en: "See each individual product's ingredient list.",
    },
    howToUse: {
      fr: "Étape 1 — Lotion : appliquer sur le cuir chevelu, masser. Étape 2 — Sérum : appliquer sur cheveux humides, ne pas rincer. Étape 3 — Huile : appliquer avant shampooing ou en soin sans rinçage. Étape 4 — Masque : 1 à 2 fois par semaine après shampooing, rincer.",
      en: 'Step 1 — Lotion: apply to scalp, massage. Step 2 — Serum: apply to damp hair, leave in. Step 3 — Oil: apply before shampoo or as a leave-in treatment. Step 4 — Mask: 1–2 times per week after shampoo, rinse out.',
    },
    precautions: {
      fr: "Éviter le contact avec les yeux. Tenir hors de portée des enfants. Faire un test sur une petite zone avant utilisation.",
      en: 'Avoid contact with eyes. Keep out of reach of children. Perform a patch test before use.',
    },
    isBestSeller: true,
    isRoutineProduct: true,
    stockStatus: 'in_stock',
    whatsappMessage: {
      fr: "Bonjour, je suis intéressé(e) par le Pack Routine Cheveux Fragilisés Pureva. Pouvez-vous m'en dire plus et confirmer la disponibilité ?",
      en: 'Hello, I am interested in the Pureva Weakened Hair Routine Pack. Could you tell me more and confirm availability?',
    },
    seoTitle: {
      fr: 'Pack Routine Complète Cheveux Fragilisés | Pureva',
      en: 'Complete Weakened Hair Routine Pack | Pureva',
    },
    seoDescription: {
      fr: 'La routine capillaire complète Pureva en pack avantageux. 4 soins naturels pour aider à fortifier les cheveux fragilisés, sujets à la casse.',
      en: 'The complete Pureva hair routine in an advantageous pack. 4 natural treatments to help strengthen fragile hair prone to breakage.',
    },
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug.fr === slug || p.slug.en === slug)
}

export function getRoutineProducts(): Product[] {
  return products.filter((p) => p.isRoutineProduct && p.category !== 'pack')
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller)
}
