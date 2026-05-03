import type { LocalizedString } from '@/types/locale'

export type FAQ = {
  id: string
  question: LocalizedString
  answer: LocalizedString
  category: 'product' | 'routine' | 'shipping' | 'general'
}

export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    category: 'routine',
    question: {
      fr: 'Comment utiliser la routine Pureva ?',
      en: 'How do I use the Pureva routine?',
    },
    answer: {
      fr: "La routine se compose de 4 étapes. Étape 1 : appliquez la lotion sur le cuir chevelu et massez. Étape 2 : appliquez le sérum sur cheveux humides (sans rincer). Étape 3 : utilisez l'huile en soin avant-shampooing ou en soin sans rinçage. Étape 4 : appliquez le masque 1 à 2 fois par semaine après le shampooing, laissez poser puis rincez.",
      en: 'The routine has 4 steps. Step 1: apply the lotion to the scalp and massage. Step 2: apply the serum to damp hair (leave in). Step 3: use the oil as a pre-shampoo treatment or leave-in. Step 4: apply the mask 1–2 times per week after shampooing, leave on then rinse.',
    },
  },
  {
    id: 'faq-2',
    category: 'product',
    question: {
      fr: 'Les produits Pureva sont-ils naturels ?',
      en: 'Are Pureva products natural?',
    },
    answer: {
      fr: "Les produits Pureva sont formulés avec des actifs d'origine naturelle. Ils ne contiennent pas de parabènes ni de silicones. La liste complète des ingrédients est disponible sur chaque page produit.",
      en: 'Pureva products are formulated with naturally derived actives. They contain no parabens or silicones. The full ingredient list is available on each product page.',
    },
  },
  {
    id: 'faq-3',
    category: 'product',
    question: {
      fr: 'Les produits Pureva peuvent-ils arrêter la chute des cheveux ?',
      en: 'Can Pureva products stop hair loss?',
    },
    answer: {
      fr: "Les produits Pureva sont des soins cosmétiques. Ils peuvent aider à réduire la chute des cheveux due à la casse et à fortifier les cheveux fragilisés. Ils ne constituent pas un traitement médical. En cas de chute de cheveux soudaine, sévère ou persistante, consultez un professionnel de santé.",
      en: 'Pureva products are cosmetic treatments. They may help reduce hair fall caused by breakage and strengthen fragile hair. They are not a medical treatment. If you experience sudden, severe or persistent hair loss, consult a healthcare professional.',
    },
  },
  {
    id: 'faq-4',
    category: 'routine',
    question: {
      fr: 'Au bout de combien de temps vais-je voir des résultats ?',
      en: 'How long before I see results?',
    },
    answer: {
      fr: "Les résultats varient selon le type de cheveux, la régularité de la routine et la cause des problèmes capillaires. En général, une utilisation régulière pendant 4 à 8 semaines permet d'observer une amélioration de la texture et de la résistance des cheveux.",
      en: 'Results vary depending on hair type, routine consistency, and the cause of hair concerns. Generally, regular use for 4 to 8 weeks may show improvement in hair texture and resilience. Patience and consistency are key.',
    },
  },
  {
    id: 'faq-5',
    category: 'shipping',
    question: {
      fr: 'Livrez-vous en dehors de la France ?',
      en: 'Do you deliver outside France?',
    },
    answer: {
      fr: "Oui, nous livrons dans toute l'Union Européenne et à l'international. Les délais et tarifs de livraison varient selon la destination. Consultez notre page Livraison & Retours pour plus d'informations.",
      en: 'Yes, we deliver across the European Union and internationally. Delivery times and rates vary by destination. See our Shipping & Returns page for more information.',
    },
  },
  {
    id: 'faq-6',
    category: 'shipping',
    question: {
      fr: 'Comment puis-je passer commande ?',
      en: 'How can I place an order?',
    },
    answer: {
      fr: 'Vous pouvez commander directement via le formulaire de commande sur chaque page produit, ou nous contacter sur WhatsApp pour toute question avant de commander.',
      en: 'You can order directly via the order form on each product page, or contact us on WhatsApp for any questions before ordering.',
    },
  },
  {
    id: 'faq-7',
    category: 'product',
    question: {
      fr: "Puis-je utiliser les produits si j'ai le cuir chevelu sensible ?",
      en: 'Can I use the products if I have a sensitive scalp?',
    },
    answer: {
      fr: "Nos formules sont conçues pour être douces. Nous recommandons de réaliser un test cutané sur une petite zone avant la première utilisation. En cas d'irritation, cessez l'utilisation.",
      en: 'Our formulas are designed to be gentle. We recommend performing a patch test on a small area before first use. If irritation occurs, discontinue use.',
    },
  },
  {
    id: 'faq-8',
    category: 'general',
    question: {
      fr: 'Comment contacter Pureva ?',
      en: 'How can I contact Pureva?',
    },
    answer: {
      fr: 'Vous pouvez nous contacter via le formulaire sur notre page Contact, ou directement par WhatsApp pour une réponse rapide.',
      en: 'You can contact us via the form on our Contact page, or directly on WhatsApp for a quick response.',
    },
  },
]
