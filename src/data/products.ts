import type { Product } from '@/types/product'

// Image upload checklist — place files in public/images/products/ before launch:
//   lotion-cuir-chevelu-10%.png      — Routine Cheveux Fragilisés
//   huile-capillaire-fortifiante.png  — Huile Capillaire Fortifiante 100ml
//   serum-cheveux-fortifiant.png      — Sérum Capillaire 50ml
//   lotion-cuir-chevelu.png           — Lotion Cuir Chevelu
//   masque-soin-cheveux.png           — Masque Soin Cheveux 200ml
//   poudre-de-sidr.jpg              ✓ uploaded — Poudre de Sidr
//   poudre-de-mashat.jpg            ✓ uploaded — Poudre de Mashat
// Recommended: 800×800px square, JPEG, <200 KB. ProductImage falls back to SVG placeholder if missing.

export const products: Product[] = [
  // ─── Routine Pack ────────────────────────────────────────────────────────────
  {
    id: 'routine-pack',
    slug: { fr: 'routine-cheveux-fragilises', en: 'weakened-hair-routine' },
    name: {
      fr: 'Routine Cheveux Fragilisés',
      en: 'Weakened Hair Routine',
    },
    shortDescription: {
      fr: 'La routine complète Pureva — 4 soins pour aider à fortifier les cheveux fragilisés, étape par étape',
      en: 'The complete Pureva routine — 4 treatments to help strengthen weakened hair, step by step',
    },
    longDescription: {
      fr: "Le pack complet Pureva réunit les 4 produits de la routine en une offre avantageuse. Pensé pour les cheveux fragilisés, sujets à la casse et au manque de densité apparente.",
      en: 'The complete Pureva pack brings together all 4 routine products in one offer. Designed for fragile hair prone to breakage and lack of apparent density.',
    },
    price: 7641,
    priceStatus: 'confirmed',
    compareAtPrice: 8490,
    currency: 'EUR',
    images: ['/images/products/lotion-cuir-chevelu-10%25.png'],
    category: 'pack',
    tags: ['pack', 'routine', 'complet', 'complete', 'bundle'],
    size: 'Lotion + Sérum 50 ml + Huile 100 ml + Masque',
    sizeStatus: 'confirmed',
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
      en: 'Step 1 — Lotion: apply to scalp, massage. Step 2 — Serum: apply to damp hair, leave in. Step 3 — Oil: apply before shampoo or as a leave-in. Step 4 — Mask: 1–2 times per week after shampoo, rinse out.',
    },
    precautions: {
      fr: "Éviter le contact avec les yeux. Tenir hors de portée des enfants. Faire un test sur une petite zone avant utilisation.",
      en: 'Avoid contact with eyes. Keep out of reach of children. Perform a patch test before use.',
    },
    isBestSeller: true,
    isRoutineProduct: true,
    stockStatus: 'in_stock',
    whatsappMessage: {
      fr: "Bonjour, je suis intéressé(e) par la Routine Cheveux Fragilisés Pureva. Pouvez-vous m'en dire plus et confirmer la disponibilité ?",
      en: 'Hello, I am interested in the Pureva Weakened Hair Routine. Could you tell me more and confirm availability?',
    },
    seoTitle: {
      fr: 'Routine Complète Cheveux Fragilisés | Pureva',
      en: 'Complete Weakened Hair Routine | Pureva',
    },
    seoDescription: {
      fr: 'La routine capillaire complète Pureva en pack avantageux. 4 soins naturels pour aider à fortifier les cheveux fragilisés, sujets à la casse.',
      en: 'The complete Pureva hair routine pack. 4 natural treatments to help strengthen fragile hair prone to breakage.',
    },
  },

  // ─── Huile Capillaire ────────────────────────────────────────────────────────
  {
    id: 'hair-oil',
    slug: { fr: 'huile-capillaire-fortifiante', en: 'strengthening-hair-oil' },
    name: {
      fr: 'Huile Capillaire Fortifiante',
      en: 'Fortifying Hair Oil',
    },
    shortDescription: {
      fr: 'Aide à réduire la chute des cheveux due à la casse et à nourrir les longueurs',
      en: 'Helps reduce hair fall caused by breakage and nourish lengths',
    },
    longDescription: {
      fr: "Une huile légère de 100 ml, enrichie en actifs naturels pour nourrir le cheveu en profondeur, renforcer sa fibre et soutenir la santé du cuir chevelu. À utiliser en soin avant-shampooing ou en finition.",
      en: 'A lightweight 100 ml oil enriched with natural actives to deeply nourish the hair shaft, strengthen its fibre, and support scalp health. Use as a pre-shampoo treatment or finishing touch.',
    },
    price: 3500,
    priceStatus: 'confirmed',
    currency: 'EUR',
    images: ['/images/products/huile-capillaire-fortifiante.png'],
    category: 'oil',
    tags: ['huile', 'fortifiant', 'cuir chevelu', 'oil', 'strengthening', 'scalp'],
    size: '100 ml',
    sizeStatus: 'confirmed',
    benefits: {
      fr: [
        'Aide à réduire la chute des cheveux due à la casse',
        'Aide à nourrir le cuir chevelu et les longueurs',
        'Soutient le confort du cuir chevelu',
        'Aide à améliorer l\'apparence de cheveux plus forts et brillants',
      ],
      en: [
        'Helps reduce hair fall caused by breakage',
        'Helps nourish the scalp and lengths',
        'Supports scalp comfort',
        'Helps improve the appearance of stronger, shinier hair',
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
      fr: "Bonjour, je souhaite commander l'Huile Capillaire Fortifiante Pureva (100 ml). Pouvez-vous confirmer la disponibilité ?",
      en: 'Hello, I would like to order the Pureva Fortifying Hair Oil (100 ml). Could you confirm availability?',
    },
    seoTitle: {
      fr: 'Huile Capillaire Fortifiante | Pureva',
      en: 'Fortifying Hair Oil | Pureva',
    },
    seoDescription: {
      fr: 'Huile capillaire Pureva 100 ml. Aide à réduire la chute due à la casse et à fortifier les cheveux fragilisés. Formulée avec fenugrec, nigelle et romarin.',
      en: 'Pureva hair oil 100 ml. Helps reduce hair fall caused by breakage and strengthen fragile hair. Formulated with fenugreek, nigella and rosemary.',
    },
  },

  // ─── Sérum Capillaire ────────────────────────────────────────────────────────
  {
    id: 'hair-serum',
    slug: { fr: 'serum-cheveux-fortifiant', en: 'strengthening-hair-serum' },
    name: {
      fr: 'Sérum Capillaire',
      en: 'Hair Serum',
    },
    shortDescription: {
      fr: 'Sérum léger pour la brillance, la douceur et des cheveux à l\'aspect plus lisse',
      en: 'Lightweight serum for shine, softness, and smoother-looking hair',
    },
    longDescription: {
      fr: "Un sérum de 50 ml, formulé avec du collagène, des protéines et de la kératine, pour aider à prendre soin des longueurs sèches ou fragilisées. Aide à apporter brillance, lissage et hydratation.",
      en: 'A 50 ml serum formulated with collagen, proteins and keratin, to help care for dry or fragile lengths. Helps provide shine, smoothing and hydration.',
    },
    price: 1300,
    priceStatus: 'confirmed',
    currency: 'EUR',
    images: ['/images/products/serum-cheveux-fortifiant.png'],
    category: 'serum',
    tags: ['sérum', 'brillance', 'lissage', 'serum', 'shine', 'smoothing'],
    size: '50 ml',
    sizeStatus: 'confirmed',
    benefits: {
      fr: [
        'Aide à apporter brillance et lissage',
        'Aide à hydrater les longueurs sèches',
        'Aide à renforcer la fibre capillaire',
        'Laisse les cheveux plus doux et faciles à coiffer',
      ],
      en: [
        'Helps provide shine and smoothing',
        'Helps hydrate dry lengths',
        'Helps strengthen the hair fibre',
        'Leaves hair softer and easier to style',
      ],
    },
    keyIngredients: ['amla', 'hibiscus', 'nettle'],
    ingredients: {
      fr: 'Aqua, Glycerin, Phyllanthus Emblica Fruit Extract, Hibiscus Sabdariffa Flower Extract, Urtica Dioica Leaf Extract, Panthenol, Allantoin, Collagen Amino Acids, Keratin Hydrolyzed, Xanthan Gum',
      en: 'Aqua, Glycerin, Phyllanthus Emblica Fruit Extract, Hibiscus Sabdariffa Flower Extract, Urtica Dioica Leaf Extract, Panthenol, Allantoin, Collagen Amino Acids, Keratin Hydrolyzed, Xanthan Gum',
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
      fr: 'Bonjour, je souhaite commander le Sérum Capillaire Pureva (50 ml). Pouvez-vous confirmer la disponibilité ?',
      en: 'Hello, I would like to order the Pureva Hair Serum (50 ml). Could you confirm availability?',
    },
    seoTitle: {
      fr: 'Sérum Capillaire Brillance & Lissage | Pureva',
      en: 'Hair Serum Shine & Smoothing | Pureva',
    },
    seoDescription: {
      fr: "Sérum capillaire Pureva 50 ml. Aide à apporter brillance, lissage et hydratation aux longueurs sèches ou fragilisées.",
      en: 'Pureva hair serum 50 ml. Helps provide shine, smoothing and hydration to dry or fragile lengths.',
    },
  },

  // ─── Lotion Cuir Chevelu ─────────────────────────────────────────────────────
  {
    id: 'scalp-lotion',
    slug: { fr: 'lotion-cuir-chevelu', en: 'scalp-lotion' },
    name: {
      fr: 'Lotion Cuir Chevelu',
      en: 'Scalp Lotion',
    },
    shortDescription: {
      fr: 'Lotion capillaire pour soutenir le confort du cuir chevelu et prendre soin des racines fragilisées',
      en: 'Scalp lotion to support scalp comfort and care for fragile roots',
    },
    longDescription: {
      fr: "Une lotion légère pour soutenir l'équilibre du cuir chevelu, apaiser les sensations d'inconfort et préparer les cheveux à la routine. Formule à confirmer.",
      en: 'A lightweight lotion to support scalp balance, soothe feelings of discomfort and prepare hair for the routine. Formula to be confirmed.',
    },
    price: 2190,
    priceStatus: 'confirmed',
    currency: 'EUR',
    images: ['/images/products/lotion-cuir-chevelu.png'],
    category: 'lotion',
    tags: ['lotion', 'cuir chevelu', 'scalp', 'soin', 'care'],
    // TODO: confirm exact volume with brand owner
    size: '150ml',
    sizeStatus: 'placeholder',
    benefits: {
      fr: [
        'Soutient le confort du cuir chevelu',
        'Aide à prendre soin des racines fragilisées',
        'Prépare les cheveux à la routine',
        'Formule légère non grasse',
      ],
      en: [
        'Supports scalp comfort',
        'Helps care for fragile roots',
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
    hidden: true,
    whatsappMessage: {
      fr: 'Bonjour, je souhaite commander la Lotion Cuir Chevelu Pureva. Pouvez-vous confirmer la disponibilité ?',
      en: 'Hello, I would like to order the Pureva Scalp Lotion. Could you confirm availability?',
    },
    seoTitle: {
      fr: 'Lotion Cuir Chevelu | Pureva',
      en: 'Scalp Lotion | Pureva',
    },
    seoDescription: {
      fr: 'Lotion cuir chevelu Pureva. Soutient le confort du cuir chevelu et aide à prendre soin des racines fragilisées.',
      en: 'Pureva scalp lotion. Supports scalp comfort and helps care for fragile roots.',
    },
  },

  // ─── Masque Soin Cheveux ─────────────────────────────────────────────────────
  {
    id: 'hair-mask',
    slug: { fr: 'masque-soin-cheveux', en: 'hair-care-mask' },
    name: {
      fr: 'Masque Soin Cheveux',
      en: 'Hair Care Mask',
    },
    shortDescription: {
      fr: 'Masque nourrissant aux protéines et kératine pour aider à adoucir et lisser les cheveux secs ou fragilisés',
      en: 'Nourishing mask with proteins and keratin to help soften and smooth dry or weakened hair',
    },
    longDescription: {
      fr: "Un masque riche formulé avec du collagène, des protéines, de la kératine et du beurre de karité pour une nutrition intense. Convient à tous types de cheveux. Aide à adoucir, lisser et apporter de la brillance aux cheveux abîmés ou fragilisés.",
      en: 'A rich mask formulated with collagen, proteins, keratin and shea butter for intense nourishment. Suitable for all hair types. Helps soften, smooth and add shine to damaged or weakened hair.',
    },
    price: 1500,
    priceStatus: 'confirmed',
    currency: 'EUR',
    images: ['/images/products/masque-soin-cheveux.png'],
    category: 'mask',
    tags: ['masque', 'nutrition', 'mask', 'nourishing', 'kératine', 'keratin'],
    size: '200 ml',
    sizeStatus: 'confirmed',
    benefits: {
      fr: [
        'Aide à adoucir et lisser les cheveux secs',
        'Aide à améliorer la brillance et la maniabilité',
        'Nourrit en profondeur grâce au beurre de karité',
        'Facilite le démêlage',
      ],
      en: [
        'Helps soften and smooth dry hair',
        'Helps improve shine and manageability',
        'Deeply nourishes with shea butter',
        'Eases detangling',
      ],
    },
    keyIngredients: ['amla', 'hibiscus', 'clove'],
    ingredients: {
      fr: 'Aqua, Cetearyl Alcohol, Behentrimonium Methosulfate, Butyrospermum Parkii (Shea) Butter, Glycerin, Phyllanthus Emblica Fruit Extract, Hibiscus Sabdariffa Flower Extract, Syzygium Aromaticum Flower Extract, Collagen Amino Acids, Keratin Hydrolyzed, Panthenol, Tocopherol',
      en: 'Aqua, Cetearyl Alcohol, Behentrimonium Methosulfate, Butyrospermum Parkii (Shea) Butter, Glycerin, Phyllanthus Emblica Fruit Extract, Hibiscus Sabdariffa Flower Extract, Syzygium Aromaticum Flower Extract, Collagen Amino Acids, Keratin Hydrolyzed, Panthenol, Tocopherol',
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
      fr: 'Bonjour, je souhaite commander le Masque Soin Cheveux Pureva. Pouvez-vous confirmer la disponibilité ?',
      en: 'Hello, I would like to order the Pureva Hair Care Mask. Could you confirm availability?',
    },
    seoTitle: {
      fr: 'Masque Soin Cheveux Kératine & Protéines | Pureva',
      en: 'Hair Mask with Keratin & Proteins | Pureva',
    },
    seoDescription: {
      fr: 'Masque cheveux Pureva. Formulé avec collagène, protéines, kératine et beurre de karité. Aide à adoucir, lisser et nourrir les cheveux secs ou fragilisés.',
      en: 'Pureva hair mask. Formulated with collagen, proteins, keratin and shea butter. Helps soften, smooth and nourish dry or weakened hair.',
    },
  },

  // ─── Poudre de Sidr (NEW) ────────────────────────────────────────────────────
  {
    id: 'sidr-powder',
    slug: { fr: 'poudre-de-sidr', en: 'sidr-powder' },
    name: {
      fr: 'Poudre de Sidr',
      en: 'Sidr Powder',
    },
    shortDescription: {
      fr: 'Poudre naturelle multi-usage pour les cheveux, le cuir chevelu et la peau',
      en: 'Natural multi-use powder for hair, scalp, and skin',
    },
    longDescription: {
      fr: "La poudre de Sidr est un actif botanique traditionnel utilisé dans les soins capillaires et cutanés. Elle aide à nettoyer en douceur, à soutenir le confort du cuir chevelu et à apporter souplesse, éclat et brillance aux cheveux. Peut être intégrée dans un masque maison ou une routine de nettoyage.",
      en: 'Sidr powder is a traditional botanical active used in hair and skin care. It helps cleanse gently, support scalp comfort and bring softness, radiance and shine to hair. Can be incorporated into a home mask or cleansing routine.',
    },
    price: 1000,
    priceStatus: 'confirmed',
    currency: 'EUR',
    images: ['/images/products/poudre-de-sidr.jpg'],
    category: 'powder',
    tags: ['poudre', 'sidr', 'naturel', 'powder', 'natural', 'scalp'],
    size: '100 g',
    sizeStatus: 'confirmed',
    benefits: {
      fr: [
        'Aide à nettoyer en douceur sans agresser',
        'Soutient le confort du cuir chevelu',
        'Aide à réduire l\'apparence des pellicules',
        'Aide à apporter souplesse, éclat et brillance',
        'Usage multi-fonctions : cheveux, cuir chevelu, peau',
      ],
      en: [
        'Helps cleanse gently without stripping',
        'Supports scalp comfort',
        'Helps reduce the appearance of dandruff',
        'Helps provide softness, radiance and shine',
        'Multi-use: hair, scalp, skin',
      ],
    },
    keyIngredients: [],
    ingredients: {
      fr: 'Ziziphus Spina-Christi Leaf Powder',
      en: 'Ziziphus Spina-Christi Leaf Powder',
    },
    howToUse: {
      fr: "Mélanger avec de l'eau pour former une pâte. Appliquer sur les cheveux et le cuir chevelu. Laisser poser 10 à 15 minutes. Rincer abondamment. Peut aussi être ajoutée à un masque ou un soin maison.",
      en: 'Mix with water to form a paste. Apply to hair and scalp. Leave on for 10 to 15 minutes. Rinse thoroughly. Can also be added to a home mask or treatment.',
    },
    precautions: {
      fr: 'Éviter le contact avec les yeux. Tenir hors de portée des enfants. Faire un test sur une petite zone avant utilisation.',
      en: 'Avoid contact with eyes. Keep out of reach of children. Perform a patch test before use.',
    },
    isBestSeller: false,
    isRoutineProduct: false,
    stockStatus: 'in_stock',
    whatsappMessage: {
      fr: "Bonjour, je souhaite en savoir plus sur la Poudre de Sidr Pureva. Pouvez-vous me donner plus d'informations ?",
      en: 'Hello, I would like to know more about Pureva Sidr Powder. Could you give me more information?',
    },
    seoTitle: {
      fr: 'Poudre de Sidr Naturelle | Pureva',
      en: 'Natural Sidr Powder | Pureva',
    },
    seoDescription: {
      fr: 'Poudre de Sidr Pureva. Aide à nettoyer en douceur, à soutenir le confort du cuir chevelu et à apporter brillance et souplesse aux cheveux.',
      en: 'Pureva Sidr Powder. Helps cleanse gently, support scalp comfort and bring shine and softness to hair.',
    },
  },

  // ─── Poudre de Mashat (NEW) ──────────────────────────────────────────────────
  {
    id: 'mashat-powder',
    slug: { fr: 'poudre-de-mashat', en: 'mashat-powder' },
    name: {
      fr: 'Poudre de Mashat',
      en: 'Mashat Powder',
    },
    shortDescription: {
      fr: 'Poudre capillaire naturelle pour aider à fortifier les cheveux fragilisés et améliorer leur apparence',
      en: 'Natural hair powder to help strengthen weakened hair and improve its appearance',
    },
    longDescription: {
      fr: "La poudre de Mashat est un actif botanique traditionnel utilisé dans les routines capillaires fortifiantes. Elle aide à renforcer les cheveux fragilisés, à réduire la casse et à améliorer l'apparence de la brillance et de la douceur. Adaptée aux cheveux ternes, fragilisés ou manquant de vitalité.",
      en: 'Mashat powder is a traditional botanical active used in strengthening hair routines. It helps strengthen weakened hair, reduce breakage and improve the appearance of shine and softness. Suitable for dull, fragile or lacking-vitality hair.',
    },
    price: 1500,
    priceStatus: 'confirmed',
    currency: 'EUR',
    images: ['/images/products/poudre-de-mashat.jpg'],
    category: 'powder',
    tags: ['poudre', 'mashat', 'fortifiant', 'powder', 'strengthening'],
    size: '100 ml',
    sizeStatus: 'confirmed',
    benefits: {
      fr: [
        'Aide à renforcer les cheveux fragilisés',
        'Aide à réduire la casse',
        'Contribue à une routine fortifiante',
        'Aide à améliorer l\'apparence de brillance et de douceur',
        'Adaptée aux cheveux ternes ou manquant de vitalité',
      ],
      en: [
        'Helps strengthen weakened hair',
        'Helps reduce breakage',
        'Contributes to a strengthening routine',
        'Helps improve the appearance of shine and softness',
        'Suitable for dull or lacking-vitality hair',
      ],
    },
    keyIngredients: [],
    ingredients: {
      // TODO: confirm INCI list with formulator
      fr: 'À confirmer — liste INCI en cours de validation.',
      en: 'To be confirmed — INCI list pending validation.',
    },
    howToUse: {
      fr: "Mélanger avec de l'eau ou une huile végétale pour former une pâte. Appliquer sur les cheveux et le cuir chevelu. Laisser poser 15 à 20 minutes. Rincer abondamment.",
      en: 'Mix with water or a vegetable oil to form a paste. Apply to hair and scalp. Leave on for 15 to 20 minutes. Rinse thoroughly.',
    },
    precautions: {
      fr: 'Éviter le contact avec les yeux. Tenir hors de portée des enfants. Faire un test sur une petite zone avant utilisation.',
      en: 'Avoid contact with eyes. Keep out of reach of children. Perform a patch test before use.',
    },
    isBestSeller: false,
    isRoutineProduct: false,
    stockStatus: 'in_stock',
    whatsappMessage: {
      fr: "Bonjour, je souhaite en savoir plus sur la Poudre de Mashat Pureva. Pouvez-vous me donner plus d'informations ?",
      en: 'Hello, I would like to know more about Pureva Mashat Powder. Could you give me more information?',
    },
    seoTitle: {
      fr: 'Poudre de Mashat Fortifiante | Pureva',
      en: 'Fortifying Mashat Powder | Pureva',
    },
    seoDescription: {
      fr: 'Poudre de Mashat Pureva. Aide à renforcer les cheveux fragilisés et à améliorer l\'apparence de la brillance et de la douceur.',
      en: 'Pureva Mashat Powder. Helps strengthen weakened hair and improve the appearance of shine and softness.',
    },
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug.fr === slug || p.slug.en === slug)
}

export function isProductVisible(product: Product): boolean {
  return product.hidden !== true
}

export function getVisibleProducts(): Product[] {
  return products.filter(isProductVisible)
}

export function getRoutineProducts(): Product[] {
  return products.filter((p) => isProductVisible(p) && p.isRoutineProduct && p.category !== 'pack')
}

export function getBestSellers(): Product[] {
  return products.filter((p) => isProductVisible(p) && p.isBestSeller)
}

export function getCrossSellProducts(): Product[] {
  return products.filter((p) => isProductVisible(p) && !p.isRoutineProduct && p.category === 'powder')
}
