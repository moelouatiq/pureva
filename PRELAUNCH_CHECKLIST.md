# Pureva Pre-Launch Checklist

Work through this list in order before going live. Each item must be explicitly confirmed by the person responsible. Do not go public with unchecked items.

---

## 1. Domain and DNS

- [ ] Domain registered (`pureva.fr` or final domain)
- [ ] Domain pointing to Vercel (A/CNAME DNS records set)
- [ ] HTTPS certificate issued and valid (Vercel provisions automatically)
- [ ] `NEXT_PUBLIC_SITE_URL` set to the live domain in Vercel env vars — **no trailing slash**
  - Example: `https://pureva.fr`
  - This controls: sitemap URLs, canonical links, OpenGraph URLs, JSON-LD `url` fields
  - If this variable is missing in production, all SEO URLs fall back to `https://pureva.fr`
- [ ] www → apex redirect configured if needed (Vercel settings → Domains)
- [ ] Visit the live URL and confirm no mixed-content warnings in browser console

---

## 2. Legal pages — content the owner must provide

Legal pages are currently placeholder-only. They are **noindex** until `LEGAL_CONTENT_CONFIRMED=true` is set.

The following information must be gathered and inserted into the legal pages by a qualified professional before launch:

**Mentions légales (legal-notice page):**
- [ ] Company legal name
- [ ] Legal form (SAS, SARL, auto-entrepreneur, etc.)
- [ ] SIRET number
- [ ] Registered address (street, city, postal code, country)
- [ ] Publication director (name and role)
- [ ] Contact email address
- [ ] Hosting provider details: Vercel Inc., 340 Pine Street Suite 401, San Francisco CA 94104, USA — `https://vercel.com`

**Politique de confidentialité (privacy page):**
- [ ] Data controller name and contact details
- [ ] List of data collected (name, email, phone, address — via order form)
- [ ] Purpose of processing (order fulfilment)
- [ ] Legal basis (contract performance — art. 6(1)(b) RGPD)
- [ ] Data processor: Resend Inc. (email delivery) — include their privacy policy link
- [ ] Data retention period (define in months or years)
- [ ] User rights: access, rectification, deletion, portability, objection
- [ ] Contact email for data subject requests
- [ ] Confirmation that no data is sold to third parties
- [ ] Cookie policy (currently: no analytics cookies active)

**CGV — Conditions Générales de Vente (terms page):**
- [ ] Scope of application
- [ ] Prices in EUR including applicable taxes (TVA rate if applicable)
- [ ] Order process description
- [ ] 14-day withdrawal right (droit de rétractation — art. L221-18 Code de la consommation)
- [ ] Return and refund policy
- [ ] Dispute resolution and applicable law (French law, French courts)
- [ ] Force majeure clause
- [ ] Contact details for disputes

**After legal content is complete:**
- [ ] Set `LEGAL_CONTENT_CONFIRMED=true` in Vercel env vars
- [ ] Redeploy and confirm warning banner is gone
- [ ] Confirm legal pages are now indexable (check page source — no `<meta name="robots" content="noindex">`)
- [ ] Submit legal pages to Google Search Console after they are indexed

---

## 3. Email — Resend configuration

- [ ] Create a Resend account at resend.com
- [ ] Add the sending domain (`pureva.fr` or final domain) in Resend → Domains
- [ ] Configure DNS records in your domain registrar:
  - SPF record (TXT): as shown in Resend dashboard
  - DKIM record (TXT): as shown in Resend dashboard
- [ ] Wait for Resend to show domain status as "Verified"
- [ ] Set `FROM_EMAIL` in Vercel env vars — must use the verified domain
  - Example: `commandes@pureva.fr`
- [ ] Set `RESEND_API_KEY` in Vercel env vars — scoped API key from Resend dashboard
- [ ] Set `BUSINESS_EMAIL` in Vercel env vars — the inbox that receives order notifications
- [ ] Submit a test order from the live staging URL
  - [ ] Confirm business notification email arrives in `BUSINESS_EMAIL` inbox
  - [ ] Confirm customer confirmation email arrives in the test email address used
  - [ ] Confirm Reply-To on the business notification points to the customer's email
  - [ ] Check spam folder — if delivery fails, double-check SPF/DKIM
- [ ] Test in French locale and English locale — both emails should be locale-aware

---

## 4. WhatsApp

- [ ] Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in Vercel env vars (international format, no `+`)
  - Example: `33612345678`
- [ ] Confirm the WhatsApp number is active and monitored
- [ ] Test all WhatsApp CTA links from a real mobile device
  - [ ] Hero section CTA
  - [ ] Product page sticky CTA
  - [ ] Routine pack page CTA
  - [ ] Contact page button
  - [ ] Order success follow-up link
- [ ] Confirm pre-filled message text reads correctly in FR and EN

---

## 5. Product images

Images must be placed in `public/images/products/` before launch. The `ProductImage` component shows an SVG placeholder when files are missing — no build failure.

**Required filenames** (as referenced in `src/data/products.ts`):

| File | Product | Dimensions | Max size |
|---|---|---|---|
| `routine-cheveux-fragilises.jpg` | ✅ uploaded | Routine Cheveux Fragilisés (pack) | 800×800px | 200 KB |
| `huile-capillaire-fortifiante.png` | ✅ uploaded | Huile Capillaire Fortifiante | 800×800px | 200 KB |
| `serum-cheveux-fortifiant.png` | ✅ uploaded | Sérum Capillaire | 800×800px | 200 KB |
| `lotion-cuir-chevelu.png` | ✅ uploaded | Lotion Cuir Chevelu | 800×800px | 200 KB |
| `masque-soin-cheveux.png` | ✅ uploaded | Masque Soin Cheveux | 800×800px | 200 KB |
| `poudre-de-sidr.jpg` | ✅ uploaded | Poudre de Sidr | 800×800px | 200 KB |
| `poudre-de-mashat.jpg` | ✅ uploaded | Poudre de Mashat | 800×800px | 200 KB |

**OG / social image:**

| File | Status | Usage | Dimensions | Max size |
|---|---|---|---|---|
| `public/images/brand/og-default.jpg` | ✅ uploaded | OpenGraph fallback for all pages | 1200×630px | 300 KB |

- [x] All 7 product images uploaded
- [x] OG default image uploaded
- [ ] Spot-check product pages — no SVG placeholder visible
- [ ] Spot-check a social share preview (e.g. Twitter card validator, Facebook debugger)

---

## 6. Product data — pending business confirmation

These items are marked `placeholder` in code and must be confirmed before launch:

- [ ] **Sidr powder — price**: update `price` (in cents) and `priceStatus: 'confirmed'` in `src/data/products.ts`
- [ ] **Sidr powder — size/weight**: update `size` string and `sizeStatus: 'confirmed'`
- [ ] **Mashat powder — price**: update `price` and `priceStatus: 'confirmed'`
- [ ] **Mashat powder — size/weight**: update `size` and `sizeStatus: 'confirmed'`
- [ ] **Mashat powder — INCI list**: update `ingredients.fr` and `ingredients.en` with formulator-confirmed INCI
- [ ] **Scalp lotion — exact volume**: confirm and update `size` field (currently `150ml` with `sizeStatus: 'placeholder'`)

After updating, run `npm run build` to verify no TypeScript errors.

---

## 7. Rate limiting — Upstash Redis (optional but recommended)

Rate limiting is **silently disabled** when these vars are absent. The order form still works — rate limiting is just not enforced.

- [ ] Create a free Upstash Redis database at upstash.com
- [ ] Copy the REST URL and token from the Upstash dashboard
- [ ] Set `UPSTASH_REDIS_REST_URL` in Vercel env vars
- [ ] Set `UPSTASH_REDIS_REST_TOKEN` in Vercel env vars
- [ ] Verify behavior: submit 6 orders from the same IP → 7th must be rejected with 429
- [ ] Verify fallback: delete one var → orders still accepted (no crash, no 500)

**Rate limit parameters** (defined in `src/lib/rate-limit.ts`):
- Window: 10 minutes (600 seconds)
- Max requests: 5 per IP per window
- Key format: `pureva:order:{ip}`
- Strategy: fixed window with activity extension (EXPIRE resets on each call)

---

## 8. SEO and sitemap

- [ ] After final domain is set in `NEXT_PUBLIC_SITE_URL`, run:
  ```
  npm run build
  ```
  This regenerates `public/sitemap-0.xml`, `public/sitemap.xml`, and `public/robots.txt`
- [ ] Open `public/robots.txt` and verify:
  - `Allow: /` is present
  - `Disallow: /api/` is present
  - Sitemap URL points to the live domain
- [ ] Open `public/sitemap-0.xml` and verify URLs use the live domain (not `pureva.com` or `localhost`)
- [ ] Submit sitemap to Google Search Console
- [ ] Check hreflang links in product page source (`/fr/products/...` and `/en/products/...`)
- [ ] Confirm canonical URL in `<head>` matches the live domain

---

## 9. Smoke test — staging (pre-deploy)

Run locally against a production-like env (`npm run build && npm run start`) before first deploy:

- [ ] Homepage renders all 8 sections
- [ ] Shop page lists all 7 products
- [ ] Product page: image visible, order form expands, form submits, success state shown
- [ ] Routine pack page: full page renders, form submits
- [ ] Contact page: form submits
- [ ] FAQ page: accordion opens and closes
- [ ] Legal pages: show warning banner (with `LEGAL_CONTENT_CONFIRMED` unset)
- [ ] All footer links resolve — no 404
- [ ] Mobile layout correct on 375px width (iPhone SE)
- [ ] No console errors in browser dev tools

---

## 10. Smoke test — post-deploy (on live URL)

- [ ] Visit `https://pureva.fr` → 200, no redirect loop
- [ ] Visit `https://pureva.fr/en` → English version loads
- [ ] Submit a live order and confirm emails arrive
- [ ] Submit a WhatsApp inquiry from a mobile device
- [ ] Run Lighthouse on homepage (target: Performance > 80, SEO = 100)
- [ ] Run Google Rich Results Test on a product page

---

## 11. Analytics (Phase 1.5 — not required for launch)

Do not activate tracking before a cookie consent banner is in place.

- [ ] Cookie consent banner implemented and tested
- [ ] Replace no-op stubs in `src/lib/analytics.ts` with real GA4 / Meta Pixel calls
- [ ] Gate all `trackEvent` calls behind cookie consent state
- [ ] Verify no tracking network requests fire before consent is given

---

*Last updated: Sprint 5. Items marked `[ ]` require action before public launch.*
