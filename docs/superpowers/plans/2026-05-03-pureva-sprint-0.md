# Pureva Sprint 0 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap the Pureva project with the full foundation — Next.js 15 App Router, i18n routing, TypeScript types, skeleton data, utility stubs, placeholder pages, and build tooling — so that `npm run build` passes with zero errors.

**Architecture:** Static-first Next.js 15 App Router with next-intl v3 for FR/EN i18n via `app/[locale]/` routing. All product/content data lives in typed local TypeScript files under `src/data/`. No database, no Stripe, no active analytics. Resend for email (wired in Sprint 2), Upstash rate limiting is optional and the API compiles without it.

**Tech Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · next-intl v3 · Zod · Resend · next-sitemap · Vercel

---

## Assumptions (confirm before running)

1. **Node.js 18+** is installed (`node -v` to check — Vercel requires 18+)
2. **Working directory** is `c:\AI\pureva` (already exists, already contains `docs/` from brainstorming)
3. **npm** is the package manager (no Yarn/pnpm/Bun)
4. **Git** will be initialized by `create-next-app` — that is acceptable
5. **`create-next-app`** will overwrite the default `src/app/page.tsx` and `src/app/layout.tsx` — these will be replaced immediately after
6. **`globals.css`** stays at `src/app/globals.css` (Next.js convention; spec listed `src/styles/globals.css` but the standard location is simpler — noted deviation)
7. **Upstash packages** are NOT installed in Sprint 0. `rate-limit.ts` is a stub that always returns `{ limited: false }`. Upstash packages are installed when the order API is wired in Sprint 2
8. **shadcn/ui** is initialized with default style + neutral base color. Palette will be customized in Sprint 1 (design tokens pass)
9. **Product images** do not exist yet — placeholder `.gitkeep` files added so directories are committed
10. **No `src/styles/` directory** — `globals.css` is at `src/app/globals.css` per Next.js default

---

## File Map

### Created by `create-next-app` (then modified/replaced)
- `src/app/layout.tsx` — replaced with minimal root layout (renders children only)
- `src/app/globals.css` — kept, extended by shadcn init
- `tailwind.config.ts` — kept, extended by shadcn init
- `next.config.ts` — replaced with next-intl plugin wrapper
- `tsconfig.json` — kept as-is
- `package.json` — kept, extended by additional installs
- `.eslintrc.json` — kept as-is
- `.gitignore` — extended to include `.env.local`, `.env`

### New files created in Sprint 0

**Types:**
- `src/types/locale.ts` — shared `Locale`, `LocalizedString`, `LocalizedStringArray`
- `src/types/product.ts` — `Product`, `ProductCategory`, `StockStatus`
- `src/types/ingredient.ts` — `Ingredient`
- `src/types/order.ts` — `OrderFormPayload`, `OrderApiResponse`
- `src/types/shipping.ts` — `ShippingZone`

**i18n:**
- `src/i18n/routing.ts` — locale config (`fr` default, `['fr', 'en']`)
- `src/i18n/request.ts` — next-intl server config
- `src/i18n/messages/fr.json` — French UI strings skeleton
- `src/i18n/messages/en.json` — English UI strings skeleton
- `middleware.ts` — next-intl locale middleware

**Data:**
- `src/data/products.ts` — 5 products with canonical slugs, safe claims, skeleton content
- `src/data/ingredients.ts` — 8 ingredients (fenugreek, amla, rosemary, nigella, hibiscus, nettle, licorice root, clove)
- `src/data/faqs.ts` — 8 FAQ items skeleton
- `src/data/routine-steps.ts` — 4 routine steps
- `src/data/shipping-zones.ts` — 3 shipping zones (France, EU, International)

**Lib utilities (all stubs in Sprint 0):**
- `src/lib/seo.ts` — `buildMetadata()` helper
- `src/lib/whatsapp.ts` — `buildWhatsAppUrl()`
- `src/lib/format-price.ts` — `formatPrice()` cents → display string
- `src/lib/analytics.ts` — `trackEvent()` stub (inactive)
- `src/lib/resend.ts` — `sendOrderEmail()` stub
- `src/lib/rate-limit.ts` — `checkRateLimit()` stub (no Upstash yet)

**App routes:**
- `src/app/layout.tsx` — minimal root layout
- `src/app/[locale]/layout.tsx` — locale layout with NextIntlClientProvider
- `src/app/[locale]/page.tsx` — Home placeholder
- `src/app/[locale]/shop/page.tsx`
- `src/app/[locale]/products/[slug]/page.tsx`
- `src/app/[locale]/routine-pack/page.tsx`
- `src/app/[locale]/ingredients/page.tsx`
- `src/app/[locale]/about/page.tsx`
- `src/app/[locale]/faq/page.tsx`
- `src/app/[locale]/contact/page.tsx`
- `src/app/[locale]/shipping-returns/page.tsx`
- `src/app/[locale]/legal-notice/page.tsx`
- `src/app/[locale]/terms/page.tsx`
- `src/app/[locale]/privacy/page.tsx`
- `src/app/api/order/route.ts` — POST stub (returns 200 placeholder)

**Config:**
- `next.config.ts` — withNextIntl wrapper
- `next-sitemap.config.js` — sitemap configuration
- `.env.example` — all required + optional env vars
- `components.json` — shadcn/ui config (created by `shadcn init`)
- `public/images/products/.gitkeep`
- `public/images/ingredients/.gitkeep`
- `public/images/brand/.gitkeep`

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: all base files via `create-next-app`

- [ ] **Step 1.1: Verify Node.js version**

```bash
node -v
```
Expected: `v18.x.x` or higher. If lower, install Node 20 LTS before continuing.

- [ ] **Step 1.2: Run create-next-app in the current directory**

The `c:\AI\pureva` directory already exists. Run:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --src-dir --app --import-alias "@/*" --use-npm
```

When prompted about existing files, confirm overwrite. Expected prompts and answers:
- "Would you like to use Turbopack?" → **No** (keep webpack for stability)
- Any "directory not empty" warning → confirm to proceed

- [ ] **Step 1.3: Verify project was created**

```bash
ls src/app
```
Expected output includes: `favicon.ico  globals.css  layout.tsx  page.tsx`

- [ ] **Step 1.4: Install additional MVP dependencies**

```bash
npm install next-intl zod resend next-sitemap
```

- [ ] **Step 1.5: Initialize shadcn/ui**

```bash
npx shadcn@latest init -d
```

The `-d` flag uses defaults (New York style, neutral base color, CSS variables). This modifies `globals.css`, `tailwind.config.ts`, creates `components.json`, and adds `src/lib/utils.ts`.

- [ ] **Step 1.6: Extend .gitignore**

Open `.gitignore` and confirm these lines exist (add if missing):

```
.env
.env.local
.env.production
```

- [ ] **Step 1.7: Commit the initialized project**

```bash
git add -A
git commit -m "chore: initialize Next.js 15 project with TypeScript, Tailwind, shadcn/ui, next-intl, zod, resend"
```

---

## Task 2: TypeScript Types

**Files:**
- Create: `src/types/locale.ts`
- Create: `src/types/product.ts`
- Create: `src/types/ingredient.ts`
- Create: `src/types/order.ts`
- Create: `src/types/shipping.ts`

- [ ] **Step 2.1: Create shared locale types**

Create `src/types/locale.ts`:

```typescript
export type Locale = 'fr' | 'en'
export type LocalizedString = Record<Locale, string>
export type LocalizedStringArray = Record<Locale, string[]>

export const locales = ['fr', 'en'] as const
export const defaultLocale = 'fr' as const satisfies Locale
```

- [ ] **Step 2.2: Create product types**

Create `src/types/product.ts`:

```typescript
import type { LocalizedString, LocalizedStringArray } from './locale'

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'
export type ProductCategory = 'oil' | 'serum' | 'lotion' | 'mask' | 'pack'

export type Product = {
  id: string
  slug: Record<'fr' | 'en', string>
  name: LocalizedString
  shortDescription: LocalizedString
  longDescription: LocalizedString
  price: number
  compareAtPrice?: number
  currency: 'EUR'
  images: string[]
  category: ProductCategory
  tags: string[]
  size: string
  benefits: LocalizedStringArray
  keyIngredients: string[]
  ingredients: LocalizedString
  howToUse: LocalizedString
  precautions: LocalizedString
  isBestSeller: boolean
  isRoutineProduct: boolean
  stockStatus: StockStatus
  whatsappMessage: LocalizedString
  seoTitle: LocalizedString
  seoDescription: LocalizedString
}
```

- [ ] **Step 2.3: Create ingredient types**

Create `src/types/ingredient.ts`:

```typescript
import type { LocalizedString } from './locale'

export type Ingredient = {
  id: string
  name: LocalizedString
  description: LocalizedString
  benefit: LocalizedString
  image: string
}
```

- [ ] **Step 2.4: Create order types**

Create `src/types/order.ts`:

```typescript
export type OrderFormPayload = {
  name: string
  email: string
  phone: string
  country: string
  address: string
  product: string
  quantity: number
  message?: string
  consent: true
  _hp: string
}

export type OrderApiResponse =
  | { success: true }
  | { error: string }
```

- [ ] **Step 2.5: Create shipping types**

Create `src/types/shipping.ts`:

```typescript
import type { LocalizedString } from './locale'

export type ShippingZone = {
  id: string
  name: LocalizedString
  countries: string[]
  estimatedDelivery: LocalizedString
  note?: LocalizedString
  freeShippingThreshold?: number
}
```

- [ ] **Step 2.6: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors. Fix any reported type errors before continuing.

- [ ] **Step 2.7: Commit types**

```bash
git add src/types/
git commit -m "feat: add TypeScript types for product, ingredient, order, shipping, locale"
```

---

## Task 3: Configure i18n

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `src/i18n/messages/fr.json`
- Create: `src/i18n/messages/en.json`
- Create: `middleware.ts`
- Modify: `next.config.ts`

- [ ] **Step 3.1: Create i18n routing config**

Create `src/i18n/routing.ts`:

```typescript
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
})
```

- [ ] **Step 3.2: Create i18n request config**

Create `src/i18n/request.ts`:

```typescript
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 3.3: Create French messages skeleton**

Create `src/i18n/messages/fr.json`:

```json
{
  "nav": {
    "shop": "Boutique",
    "routine": "La Routine",
    "ingredients": "Ingrédients",
    "about": "À propos",
    "faq": "FAQ",
    "contact": "Contact"
  },
  "home": {
    "hero": {
      "headline": "La routine naturelle pour des cheveux plus forts",
      "claim": "Aide à réduire la chute des cheveux due à la casse",
      "cta_primary": "Voir la routine",
      "cta_secondary": "Voir les produits"
    }
  },
  "order": {
    "form": {
      "name": "Nom complet",
      "email": "Adresse e-mail",
      "phone": "Téléphone",
      "country": "Pays",
      "address": "Adresse de livraison",
      "product": "Produit",
      "quantity": "Quantité",
      "message": "Message (optionnel)",
      "consent": "En soumettant ce formulaire, j'accepte d'être contacté(e) concernant ma commande et j'ai lu et accepté la Politique de confidentialité.",
      "submit": "Envoyer la commande",
      "success_title": "Commande reçue !",
      "success_message": "Nous vous contacterons pour confirmer votre commande et organiser la livraison.",
      "whatsapp_followup": "Suivre par WhatsApp",
      "error": "Une erreur s'est produite. Veuillez réessayer ou nous contacter par WhatsApp."
    }
  },
  "whatsapp": {
    "product": "Bonjour, je souhaite commander {product}. Pouvez-vous confirmer la disponibilité ?",
    "routine": "Bonjour, je suis intéressé(e) par le pack routine Pureva complet. Pouvez-vous m'en dire plus ?",
    "general": "Bonjour, j'ai une question sur les produits Pureva.",
    "post_order": "Bonjour, j'ai soumis une commande et souhaite avoir une confirmation."
  },
  "common": {
    "order_now": "Commander",
    "learn_more": "En savoir plus",
    "whatsapp_order": "Commander par WhatsApp",
    "whatsapp_question": "Poser une question sur WhatsApp",
    "loading": "Chargement…",
    "view_all": "Voir tout",
    "back": "Retour"
  },
  "disclaimer": {
    "text": "En cas de chute de cheveux soudaine, sévère ou persistante, consultez un professionnel de santé. Les résultats varient selon le type de cheveux, la régularité de la routine et la cause du problème."
  },
  "footer": {
    "tagline": "La routine naturelle pour des cheveux plus forts.",
    "legal": {
      "shop": "Boutique",
      "routine": "La Routine",
      "shipping": "Livraison & Retours",
      "legal_notice": "Mentions légales",
      "terms": "CGV",
      "privacy": "Confidentialité"
    },
    "copyright": "© {year} Pureva. Tous droits réservés."
  }
}
```

- [ ] **Step 3.4: Create English messages skeleton**

Create `src/i18n/messages/en.json`:

```json
{
  "nav": {
    "shop": "Shop",
    "routine": "The Routine",
    "ingredients": "Ingredients",
    "about": "About",
    "faq": "FAQ",
    "contact": "Contact"
  },
  "home": {
    "hero": {
      "headline": "The natural routine for stronger hair",
      "claim": "Helps reduce hair fall caused by breakage",
      "cta_primary": "See the routine",
      "cta_secondary": "View products"
    }
  },
  "order": {
    "form": {
      "name": "Full name",
      "email": "Email address",
      "phone": "Phone number",
      "country": "Country",
      "address": "Delivery address",
      "product": "Product",
      "quantity": "Quantity",
      "message": "Message (optional)",
      "consent": "By submitting this form, I agree to be contacted about my order and have read and accepted the Privacy Policy.",
      "submit": "Place order",
      "success_title": "Order received!",
      "success_message": "We will contact you to confirm your order and arrange delivery.",
      "whatsapp_followup": "Follow up on WhatsApp",
      "error": "Something went wrong. Please try again or contact us on WhatsApp."
    }
  },
  "whatsapp": {
    "product": "Hello, I would like to order {product}. Could you confirm availability?",
    "routine": "Hello, I am interested in the complete Pureva hair routine pack. Could you tell me more?",
    "general": "Hello, I have a question about Pureva products.",
    "post_order": "Hello, I submitted an order and would like a confirmation."
  },
  "common": {
    "order_now": "Order now",
    "learn_more": "Learn more",
    "whatsapp_order": "Order on WhatsApp",
    "whatsapp_question": "Ask a question on WhatsApp",
    "loading": "Loading…",
    "view_all": "View all",
    "back": "Back"
  },
  "disclaimer": {
    "text": "If you experience sudden, severe, or persistent hair loss, consult a healthcare professional. Results may vary depending on hair type, routine consistency, and the underlying cause."
  },
  "footer": {
    "tagline": "The natural routine for stronger hair.",
    "legal": {
      "shop": "Shop",
      "routine": "The Routine",
      "shipping": "Shipping & Returns",
      "legal_notice": "Legal Notice",
      "terms": "Terms",
      "privacy": "Privacy"
    },
    "copyright": "© {year} Pureva. All rights reserved."
  }
}
```

- [ ] **Step 3.5: Create middleware**

Create `middleware.ts` at the project root (same level as `package.json`):

```typescript
import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Step 3.6: Update next.config.ts**

Replace the entire contents of `next.config.ts`:

```typescript
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withNextIntl(nextConfig)
```

- [ ] **Step 3.7: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. If next-intl types are missing, run `npm install` to ensure all types are present.

- [ ] **Step 3.8: Commit i18n configuration**

```bash
git add src/i18n/ middleware.ts next.config.ts
git commit -m "feat: configure next-intl i18n with FR default locale and EN support"
```

---

## Task 4: Skeleton Data Files

**Files:**
- Create: `src/data/products.ts`
- Create: `src/data/ingredients.ts`
- Create: `src/data/faqs.ts`
- Create: `src/data/routine-steps.ts`
- Create: `src/data/shipping-zones.ts`

- [ ] **Step 4.1: Create products data**

Create `src/data/products.ts`:

```typescript
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
      fr: 'Appliquer quelques gouttes sur le cuir chevelu et les longueurs. Masser doucement. Laisser agir au moins 30 minutes avant le shampooing, ou toute la nuit.',
      en: 'Apply a few drops to the scalp and lengths. Gently massage. Leave on for at least 30 minutes before shampooing, or overnight.',
    },
    precautions: {
      fr: 'Éviter le contact avec les yeux. Tenir hors de portée des enfants. Faire un test sur une petite zone avant utilisation.',
      en: 'Avoid contact with eyes. Keep out of reach of children. Perform a patch test before use.',
    },
    isBestSeller: true,
    isRoutineProduct: true,
    stockStatus: 'in_stock',
    whatsappMessage: {
      fr: 'Bonjour, je souhaite commander l\'Huile Capillaire Fortifiante Pureva (100ml). Pouvez-vous confirmer la disponibilité ?',
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
      fr: 'Aide à renforcer la fibre capillaire et à améliorer l\'aspect de la densité',
      en: 'Helps reinforce the hair fibre and improve the appearance of density',
    },
    longDescription: {
      fr: 'Un sérum concentré en actifs botaniques pour aider à renforcer chaque cheveu de la racine à la pointe et soutenir l\'apparence d\'une chevelure plus dense.',
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
        'Aide à améliorer l\'aspect de la densité',
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
      fr: 'Éviter le contact avec les yeux. Tenir hors de portée des enfants. Faire un test sur une petite zone avant utilisation.',
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
      fr: 'Sérum capillaire naturel Pureva. Aide à renforcer les cheveux fragilisés et à améliorer l\'apparence de la densité. Formulé avec amla, hibiscus et ortie.',
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
      fr: 'Une lotion légère pour soutenir l\'équilibre du cuir chevelu, apaiser les sensations d\'inconfort et créer les conditions idéales pour une routine capillaire efficace.',
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
      fr: 'Appliquer directement sur le cuir chevelu sec ou humide. Masser doucement. Peut être utilisé quotidiennement ou avant l\'application de l\'huile.',
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
      fr: 'Un masque riche en actifs naturels pour une nutrition intense. Aide à restaurer la souplesse et l\'éclat des cheveux abîmés ou fragilisés par des agressions extérieures.',
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
      fr: 'Appliquer généreusement sur cheveux propres et essorés. Laisser poser 10 à 20 minutes. Rincer abondamment à l\'eau tiède. Utiliser 1 à 2 fois par semaine.',
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
      fr: 'Le pack complet Pureva réunit les 4 produits de la routine en une offre avantageuse. Idéal pour les cheveux fragilisés, sujets à la casse et au manque de densité. La routine complète pour prendre soin de vos cheveux naturellement, étape par étape.',
      en: 'The complete Pureva pack brings together all 4 routine products in one advantageous offer. Ideal for fragile hair prone to breakage and lack of density. The complete routine to care for your hair naturally, step by step.',
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
      en: 'See each individual product\'s ingredient list.',
    },
    howToUse: {
      fr: 'Étape 1 — Lotion : appliquer sur le cuir chevelu, masser. Étape 2 — Sérum : appliquer sur cheveux humides, ne pas rincer. Étape 3 — Huile : appliquer avant shampooing ou en soin sans rinçage. Étape 4 — Masque : 1 à 2 fois par semaine après shampooing, rincer.',
      en: 'Step 1 — Lotion: apply to scalp, massage. Step 2 — Serum: apply to damp hair, leave in. Step 3 — Oil: apply before shampoo or as a leave-in treatment. Step 4 — Mask: 1–2 times per week after shampoo, rinse out.',
    },
    precautions: {
      fr: 'Éviter le contact avec les yeux. Tenir hors de portée des enfants. Faire un test sur une petite zone avant utilisation.',
      en: 'Avoid contact with eyes. Keep out of reach of children. Perform a patch test before use.',
    },
    isBestSeller: true,
    isRoutineProduct: true,
    stockStatus: 'in_stock',
    whatsappMessage: {
      fr: 'Bonjour, je suis intéressé(e) par le Pack Routine Cheveux Fragilisés Pureva. Pouvez-vous m\'en dire plus et confirmer la disponibilité ?',
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
  return products.find(
    (p) => p.slug.fr === slug || p.slug.en === slug
  )
}

export function getRoutineProducts(): Product[] {
  return products.filter((p) => p.isRoutineProduct && p.category !== 'pack')
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller)
}
```

- [ ] **Step 4.2: Create ingredients data**

Create `src/data/ingredients.ts`:

```typescript
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
      fr: 'Groseillier indien, l\'une des plantes les plus riches en vitamine C. Pilier de l\'Ayurveda pour les soins capillaires.',
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
      fr: 'Plante aromatique méditerranéenne dont l\'extrait est reconnu pour ses propriétés sur la vitalité du cuir chevelu.',
      en: 'Mediterranean aromatic plant whose extract is recognised for its properties on scalp vitality.',
    },
    benefit: {
      fr: 'Soutient la vitalité du cuir chevelu et les cheveux à paraître plus forts',
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
      fr: 'La fleur d\'hibiscus est utilisée dans les soins capillaires traditionnels pour ses propriétés nourrissantes et adoucissantes.',
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
      fr: 'L\'ortie est une plante riche en minéraux et vitamines, traditionnellement appréciée pour soutenir la vigueur des cheveux.',
      en: 'Nettle is a plant rich in minerals and vitamins, traditionally valued for supporting hair vigour.',
    },
    benefit: {
      fr: 'Aide à revitaliser les cheveux et à soutenir l\'éclat naturel',
      en: 'Helps revitalise hair and support natural shine',
    },
    image: '/images/ingredients/nettle.jpg',
  },
  {
    id: 'licorice',
    name: { fr: 'Réglisse', en: 'Licorice Root' },
    description: {
      fr: 'La racine de réglisse est un actif apaisant utilisé pour soutenir le confort et l\'équilibre du cuir chevelu.',
      en: 'Licorice root is a soothing active used to support scalp comfort and balance.',
    },
    benefit: {
      fr: 'Aide à soutenir le confort et l\'équilibre du cuir chevelu',
      en: 'Helps support scalp comfort and balance',
    },
    image: '/images/ingredients/licorice.jpg',
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
```

- [ ] **Step 4.3: Create FAQs data**

Create `src/data/faqs.ts`:

```typescript
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
      fr: 'La routine se compose de 4 étapes. Étape 1 : appliquez la lotion sur le cuir chevelu et massez. Étape 2 : appliquez le sérum sur cheveux humides (sans rincer). Étape 3 : utilisez l\'huile en soin avant-shampooing ou en soin sans rinçage. Étape 4 : appliquez le masque 1 à 2 fois par semaine après le shampooing, laissez poser puis rincez.',
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
      fr: 'Les produits Pureva sont formulés avec des actifs d\'origine naturelle. Ils ne contiennent pas de parabènes ni de silicones. La liste complète des ingrédients est disponible sur chaque page produit.',
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
      fr: 'Les produits Pureva sont des soins cosmétiques. Ils peuvent aider à réduire la chute des cheveux due à la casse et à fortifier les cheveux fragilisés. Ils ne constituent pas un traitement médical. En cas de chute de cheveux soudaine, sévère ou persistante, consultez un professionnel de santé.',
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
      fr: 'Les résultats varient selon le type de cheveux, la régularité de la routine et la cause des problèmes capillaires. En général, une utilisation régulière pendant 4 à 8 semaines permet d\'observer une amélioration de la texture et de la résistance des cheveux. La patience et la régularité sont essentielles.',
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
      fr: 'Oui, nous livrons dans toute l\'Union Européenne et à l\'international. Les délais et tarifs de livraison varient selon la destination. Consultez notre page Livraison & Retours pour plus d\'informations.',
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
      fr: 'Puis-je utiliser les produits si j\'ai le cuir chevelu sensible ?',
      en: 'Can I use the products if I have a sensitive scalp?',
    },
    answer: {
      fr: 'Nos formules sont conçues pour être douces. Nous recommandons de réaliser un test cutané sur une petite zone avant la première utilisation. En cas d\'irritation, cessez l\'utilisation.',
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
```

- [ ] **Step 4.4: Create routine steps data**

Create `src/data/routine-steps.ts`:

```typescript
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
```

- [ ] **Step 4.5: Create shipping zones data**

Create `src/data/shipping-zones.ts`:

```typescript
import type { ShippingZone } from '@/types/shipping'

export const shippingZones: ShippingZone[] = [
  {
    id: 'france',
    name: { fr: 'France métropolitaine', en: 'Metropolitan France' },
    countries: ['FR'],
    estimatedDelivery: { fr: '2 à 3 jours ouvrés', en: '2 to 3 business days' },
    note: {
      fr: 'Livraison offerte dès 50€ d\'achat.',
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
```

- [ ] **Step 4.6: Verify data compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. If type errors appear, fix them before continuing.

- [ ] **Step 4.7: Commit data files**

```bash
git add src/data/
git commit -m "feat: add skeleton data files for products, ingredients, FAQs, routine steps, shipping zones"
```

---

## Task 5: Library Utility Stubs

**Files:**
- Create: `src/lib/seo.ts`
- Create: `src/lib/whatsapp.ts`
- Create: `src/lib/format-price.ts`
- Create: `src/lib/analytics.ts`
- Create: `src/lib/resend.ts`
- Create: `src/lib/rate-limit.ts`

Note: `src/lib/utils.ts` already exists (created by shadcn init — do not touch it).

- [ ] **Step 5.1: Create SEO helper**

Create `src/lib/seo.ts`:

```typescript
import type { Metadata } from 'next'
import type { Locale } from '@/types/locale'

type BuildMetadataParams = {
  locale: Locale
  title: string
  description: string
  path: string
  ogImage?: string
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pureva-cosmetics.fr'

export function buildMetadata({
  locale,
  title,
  description,
  path,
  ogImage,
}: BuildMetadataParams): Metadata {
  const canonical = `${siteUrl}/${locale}${path}`
  const altLocale = locale === 'fr' ? 'en' : 'fr'
  const altCanonical = `${siteUrl}/${altLocale}${path}`
  const image = ogImage ?? `${siteUrl}/images/brand/og-default.jpg`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fr: `${siteUrl}/fr${path}`,
        en: `${siteUrl}/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Pureva',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: locale === 'fr' ? 'en_US' : 'fr_FR',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}
```

- [ ] **Step 5.2: Create WhatsApp URL builder**

Create `src/lib/whatsapp.ts`:

```typescript
const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

export function buildWhatsAppUrl(message: string): string {
  if (!phone) return '#'
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
```

- [ ] **Step 5.3: Create price formatter**

Create `src/lib/format-price.ts`:

```typescript
import type { Locale } from '@/types/locale'

export function formatPrice(cents: number, locale: Locale = 'fr'): string {
  const amount = cents / 100
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount)
}
```

- [ ] **Step 5.4: Create analytics stubs**

Create `src/lib/analytics.ts`:

```typescript
// Analytics stubs — inactive in MVP.
// Replace function bodies with GA4 / Pixel calls in Phase 1.5.
// Gate all calls behind CookieBanner consent before activating.

export type AnalyticsEvent =
  | 'page_view'
  | 'view_product'
  | 'view_routine_pack'
  | 'whatsapp_click'
  | 'order_form_start'
  | 'order_submitted'

export function trackEvent(
  _event: AnalyticsEvent,
  _params?: Record<string, unknown>
): void {
  // no-op in MVP
}
```

- [ ] **Step 5.5: Create Resend email stub**

Create `src/lib/resend.ts`:

```typescript
// Resend email wrapper — wired up in Sprint 2 when the order API is built.
// Requires RESEND_API_KEY, BUSINESS_EMAIL, FROM_EMAIL environment variables.

export type OrderEmailData = {
  customerName: string
  customerEmail: string
  customerPhone: string
  country: string
  address: string
  product: string
  quantity: number
  message?: string
}

export async function sendOrderNotification(
  _data: OrderEmailData
): Promise<{ success: boolean; error?: string }> {
  // Stub — replace in Sprint 2
  return { success: true }
}

export async function sendOrderConfirmation(
  _customerEmail: string,
  _data: OrderEmailData
): Promise<{ success: boolean; error?: string }> {
  // Stub — replace in Sprint 2
  return { success: true }
}
```

- [ ] **Step 5.6: Create rate limit stub**

Create `src/lib/rate-limit.ts`:

```typescript
// Optional serverless rate limiting helper.
// When UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are present,
// install @upstash/ratelimit and @upstash/redis and replace this stub
// with the full Upstash implementation (Sprint 2).
//
// Without those env vars, this function always returns { limited: false }
// and the API route continues normally. The route never crashes.

export async function checkRateLimit(
  _ip: string
): Promise<{ limited: boolean }> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    return { limited: false }
  }

  // Upstash implementation goes here in Sprint 2.
  // Requires: npm install @upstash/ratelimit @upstash/redis
  return { limited: false }
}
```

- [ ] **Step 5.7: Verify lib files compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5.8: Commit lib utilities**

```bash
git add src/lib/seo.ts src/lib/whatsapp.ts src/lib/format-price.ts src/lib/analytics.ts src/lib/resend.ts src/lib/rate-limit.ts
git commit -m "feat: add lib utility stubs — seo, whatsapp, format-price, analytics, resend, rate-limit"
```

---

## Task 6: App Routes and Placeholder Pages

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx` + all 11 other page routes
- Create: `src/app/api/order/route.ts`

- [ ] **Step 6.1: Replace root layout**

Replace `src/app/layout.tsx` entirely with:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
```

Note: `html` and `body` tags are in `[locale]/layout.tsx` — this root layout just passes children through. This is the correct next-intl App Router pattern.

- [ ] **Step 6.2: Create locale layout**

Create `src/app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Pureva',
    default: 'Pureva — Routine naturelle pour des cheveux plus forts',
  },
  description:
    'Pureva — soins capillaires naturels pour les cheveux fragilisés. Aide à réduire la casse et à fortifier les cheveux.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'fr' | 'en')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 6.3: Create Home placeholder**

Delete `src/app/page.tsx` (the root page created by create-next-app).

Create `src/app/[locale]/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main>
      <h1>Pureva — Home (Sprint 0 placeholder)</h1>
    </main>
  )
}
```

- [ ] **Step 6.4: Create Shop placeholder**

Create `src/app/[locale]/shop/page.tsx`:

```tsx
export default function ShopPage() {
  return (
    <main>
      <h1>Shop (Sprint 0 placeholder)</h1>
    </main>
  )
}
```

- [ ] **Step 6.5: Create Product Detail placeholder**

Create `src/app/[locale]/products/[slug]/page.tsx`:

```tsx
import { products } from '@/data/products'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return products.flatMap((product) => [
    { locale: 'fr', slug: product.slug.fr },
    { locale: 'en', slug: product.slug.en },
  ])
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug } = await params
  const product = products.find(
    (p) => p.slug.fr === slug || p.slug.en === slug
  )

  if (!product) notFound()

  return (
    <main>
      <h1>{product.name.fr} (Sprint 0 placeholder)</h1>
    </main>
  )
}
```

- [ ] **Step 6.6: Create Routine Pack placeholder**

Create `src/app/[locale]/routine-pack/page.tsx`:

```tsx
export default function RoutinePackPage() {
  return (
    <main>
      <h1>Routine Pack — Primary commercial page (Sprint 0 placeholder)</h1>
    </main>
  )
}
```

- [ ] **Step 6.7: Create remaining static placeholders**

Create `src/app/[locale]/ingredients/page.tsx`:

```tsx
export default function IngredientsPage() {
  return <main><h1>Ingredients (Sprint 0 placeholder)</h1></main>
}
```

Create `src/app/[locale]/about/page.tsx`:

```tsx
export default function AboutPage() {
  return <main><h1>About Pureva (Sprint 0 placeholder)</h1></main>
}
```

Create `src/app/[locale]/faq/page.tsx`:

```tsx
export default function FAQPage() {
  return <main><h1>FAQ (Sprint 0 placeholder)</h1></main>
}
```

Create `src/app/[locale]/contact/page.tsx`:

```tsx
export default function ContactPage() {
  return <main><h1>Contact (Sprint 0 placeholder)</h1></main>
}
```

Create `src/app/[locale]/shipping-returns/page.tsx`:

```tsx
export default function ShippingReturnsPage() {
  return <main><h1>Shipping & Returns (Sprint 0 placeholder)</h1></main>
}
```

Create `src/app/[locale]/legal-notice/page.tsx`:

```tsx
// TODO: legal review required before launch
// Must include: publisher identity, SIRET, host details (Vercel), responsible editor
export default function LegalNoticePage() {
  return <main><h1>Mentions légales / Legal Notice (Sprint 0 placeholder)</h1></main>
}
```

Create `src/app/[locale]/terms/page.tsx`:

```tsx
// TODO: legal review required before launch
// Must include: CGV, 14-day withdrawal right (droit de rétractation), French law
export default function TermsPage() {
  return <main><h1>Terms & Conditions / CGV (Sprint 0 placeholder)</h1></main>
}
```

Create `src/app/[locale]/privacy/page.tsx`:

```tsx
// TODO: legal review required before launch
// Must include: RGPD/GDPR data processing notice, user rights, Resend as processor
export default function PrivacyPage() {
  return <main><h1>Privacy Policy / Politique de confidentialité (Sprint 0 placeholder)</h1></main>
}
```

- [ ] **Step 6.8: Create Order API stub**

Create `src/app/api/order/route.ts`:

```typescript
import { NextResponse } from 'next/server'

// Sprint 0 stub — full implementation in Sprint 2
// Will add: Zod validation, honeypot check, rate limiting, Resend email send
export async function POST() {
  return NextResponse.json(
    { message: 'Order API — Sprint 0 placeholder' },
    { status: 200 }
  )
}
```

- [ ] **Step 6.9: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6.10: Commit routes**

```bash
git add src/app/
git commit -m "feat: add placeholder pages for all 12 MVP routes and order API stub"
```

---

## Task 7: Configuration Files

**Files:**
- Create: `next-sitemap.config.js`
- Create: `.env.example`
- Create: `public/images/products/.gitkeep`
- Create: `public/images/ingredients/.gitkeep`
- Create: `public/images/brand/.gitkeep`

- [ ] **Step 7.1: Create next-sitemap config**

Create `next-sitemap.config.js` at the project root:

```javascript
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://pureva-cosmetics.fr',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/api/' },
    ],
  },
  exclude: ['/api/*'],
}
```

- [ ] **Step 7.2: Add postbuild script to package.json**

Open `package.json` and add `"postbuild": "next-sitemap"` to the `scripts` block:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "postbuild": "next-sitemap",
    "start": "next start",
    "lint": "next lint"
  }
}
```

- [ ] **Step 7.3: Create .env.example**

Create `.env.example` at the project root:

```bash
# ─────────────────────────────────────────────────────────────
# Pureva — Environment Variables
# Copy this file to .env.local and fill in real values.
# Never commit .env.local to git.
# ─────────────────────────────────────────────────────────────

# Required — order email flow (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BUSINESS_EMAIL=orders@pureva-cosmetics.fr
FROM_EMAIL=orders@pureva-cosmetics.fr

# Required — WhatsApp CTA links (international format, no + or spaces)
NEXT_PUBLIC_WHATSAPP_NUMBER=33XXXXXXXXX

# Required — site URL (no trailing slash)
NEXT_PUBLIC_SITE_URL=https://pureva-cosmetics.fr

# Optional — enables rate limiting on the order API (Upstash Redis)
# If not set, the API works without rate limiting (Zod + honeypot remain active)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

- [ ] **Step 7.4: Create public image directory placeholders**

```bash
mkdir -p public/images/products public/images/ingredients public/images/brand
```

Then create a `.gitkeep` file in each:

Create `public/images/products/.gitkeep` (empty file).
Create `public/images/ingredients/.gitkeep` (empty file).
Create `public/images/brand/.gitkeep` (empty file).

- [ ] **Step 7.5: Commit configuration**

```bash
git add next-sitemap.config.js .env.example public/images/ package.json
git commit -m "chore: add next-sitemap config, .env.example, and public image directories"
```

---

## Task 8: Lint and Build Verification

- [ ] **Step 8.1: Run linter**

```bash
npm run lint
```

Expected: no errors, no warnings. Fix any ESLint errors before proceeding.

Common fixes:
- Unused imports: remove them
- `any` types: replace with `unknown` or the correct type
- Missing `key` props in lists: add `key`

- [ ] **Step 8.2: Run full build**

```bash
npm run build
```

Expected output:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (N/N)
✓ Collecting build traces
✓ Finalizing page optimization
```

After build, `next-sitemap` runs automatically and generates `public/sitemap.xml` and `public/robots.txt`.

If the build fails:
- TypeScript errors: fix reported type errors in the files listed
- Missing module errors: run `npm install` and retry
- next-intl errors: verify `middleware.ts` is at the project root (not inside `src/`)

- [ ] **Step 8.3: Verify generated sitemap**

```bash
cat public/sitemap.xml
```

Expected: XML file with entries for `/fr`, `/en`, and all localized routes.

- [ ] **Step 8.4: Commit final Sprint 0 state**

```bash
git add -A
git commit -m "chore: sprint 0 complete — foundation, types, i18n, data, routes, build passing"
```

---

## Self-Review Checklist (run after writing plan)

- [x] All 12 page routes from the spec are represented
- [x] `[locale]` segment covers `fr` and `en` with `generateStaticParams`
- [x] `[slug]` page has `generateStaticParams` mapping all 10 product slugs (5 products × 2 locales)
- [x] Product slugs match the canonical slugs in the spec exactly
- [x] `rate-limit.ts` gracefully no-ops when Upstash env vars are absent
- [x] No Stripe, no Prisma, no DB, no admin dashboard, no fake reviews anywhere
- [x] `analytics.ts` is a stub with no active tracking code
- [x] `CookieBanner` is not yet created — it appears in Sprint 1 as a null-returning stub
- [x] `Disclaimer` is not yet created — it appears in Sprint 1 as a shared component
- [x] Legal pages have `TODO: legal review required` comments
- [x] `LocalizedString` and `Locale` are defined in `src/types/locale.ts` and imported by all other type files
- [x] `getProductBySlug`, `getRoutineProducts`, `getBestSellers` helpers are in `products.ts` for use in Sprint 1
- [x] No `/api/checkout`, no `/order-success`, no `/order-cancelled` pages
- [x] `.env.example` has all 7 env vars from the spec
- [x] `postbuild` script in `package.json` runs `next-sitemap` after `next build`
