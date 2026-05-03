import type { ShippingZone } from '@/types/shipping'

export const shippingZones: ShippingZone[] = [
  {
    id: 'france',
    name: { fr: 'France métropolitaine', en: 'Metropolitan France' },
    countries: ['FR'],
    estimatedDelivery: { fr: '2 à 3 jours ouvrés', en: '2 to 3 business days' },
    note: {
      fr: "Livraison offerte dès 50€ d'achat.",
      en: 'Free delivery on orders over €50.',
    },
    freeShippingThreshold: 5000,
  },
  {
    id: 'eu',
    name: { fr: 'Union Européenne', en: 'European Union' },
    countries: [
      'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI',
      'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SE', 'SI', 'SK',
    ],
    estimatedDelivery: { fr: '5 à 10 jours ouvrés', en: '5 to 10 business days' },
    note: {
      fr: 'Les frais de douane éventuels sont inclus dans le prix.',
      en: 'Any customs fees are included in the price.',
    },
  },
  {
    id: 'international',
    name: { fr: 'International', en: 'International' },
    countries: [],
    estimatedDelivery: { fr: '10 à 20 jours ouvrés', en: '10 to 20 business days' },
    note: {
      fr: 'Les droits de douane et taxes locales sont à la charge du destinataire.',
      en: 'Customs duties and local taxes are the responsibility of the recipient.',
    },
  },
]
