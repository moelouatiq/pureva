-- Pureva product seed.
--
-- WARNING: This seed is idempotent by legacy_id, but it DOES overwrite the
-- seeded product fields on every run. Use it to initialize or reset Supabase
-- products from the current static catalog. Do not run it after editing products
-- in admin unless you intentionally want to restore these catalog values.

with seed_products as (
  select *
  from (
    values
      (
        'routine-pack', 'routine-cheveux-fragilises', 'weakened-hair-routine',
        $$Routine Cheveux Fragilisés$$, $$Weakened Hair Routine$$,
        $$La routine complète Pureva — 4 soins pour aider à fortifier les cheveux fragilisés, étape par étape$$,
        $$The complete Pureva routine — 4 treatments to help strengthen weakened hair, step by step$$,
        $$Le pack complet Pureva réunit les 4 produits de la routine en une offre avantageuse. Pensé pour les cheveux fragilisés, sujets à la casse et au manque de densité apparente.$$,
        $$The complete Pureva pack brings together all 4 routine products in one offer. Designed for fragile hair prone to breakage and lack of apparent density.$$,
        'pack', 7641, 'confirmed', 8490, 'EUR',
        $$Lotion + Sérum 50 ml + Huile 100 ml + Masque$$, 'confirmed', 'in_stock',
        jsonb_build_array('/images/products/lotion-cuir-chevelu-10%25.png'),
        jsonb_build_array(
          $$Routine complète pour cheveux fragilisés$$,
          $$Aide à réduire la casse et la chute due à la casse$$,
          $$Aide à renforcer les cheveux fragiles$$,
          $$Soutient le confort du cuir chevelu$$,
          $$Laisse les cheveux plus doux et brillants$$
        ),
        jsonb_build_array(
          $$Complete routine for weakened hair$$,
          $$Helps reduce breakage and hair fall caused by breakage$$,
          $$Helps strengthen fragile hair$$,
          $$Supports scalp comfort$$,
          $$Leaves hair softer and shinier$$
        ),
        $$Voir la liste des ingrédients de chaque produit.$$,
        $$See each individual product's ingredient list.$$,
        $$Étape 1 — Lotion : appliquer sur le cuir chevelu, masser. Étape 2 — Sérum : appliquer sur cheveux humides, ne pas rincer. Étape 3 — Huile : appliquer avant shampooing ou en soin sans rinçage. Étape 4 — Masque : 1 à 2 fois par semaine après shampooing, rincer.$$,
        $$Step 1 — Lotion: apply to scalp, massage. Step 2 — Serum: apply to damp hair, leave in. Step 3 — Oil: apply before shampoo or as a leave-in. Step 4 — Mask: 1–2 times per week after shampoo, rinse out.$$,
        $$Éviter le contact avec les yeux. Tenir hors de portée des enfants. Faire un test sur une petite zone avant utilisation.$$,
        $$Avoid contact with eyes. Keep out of reach of children. Perform a patch test before use.$$,
        true, true, 'published', 10,
        $$Routine Complète Cheveux Fragilisés | Pureva$$,
        $$Complete Weakened Hair Routine | Pureva$$,
        $$La routine capillaire complète Pureva en pack avantageux. 4 soins naturels pour aider à fortifier les cheveux fragilisés, sujets à la casse.$$,
        $$The complete Pureva hair routine pack. 4 natural treatments to help strengthen fragile hair prone to breakage.$$
      ),
      (
        'hair-oil', 'huile-capillaire-fortifiante', 'strengthening-hair-oil',
        $$Huile Capillaire Fortifiante$$, $$Fortifying Hair Oil$$,
        $$Aide à réduire la chute des cheveux due à la casse et à nourrir les longueurs$$,
        $$Helps reduce hair fall caused by breakage and nourish lengths$$,
        $$Une huile légère de 100 ml, enrichie en actifs naturels pour nourrir le cheveu en profondeur, renforcer sa fibre et soutenir la santé du cuir chevelu. À utiliser en soin avant-shampooing ou en finition.$$,
        $$A lightweight 100 ml oil enriched with natural actives to deeply nourish the hair shaft, strengthen its fibre, and support scalp health. Use as a pre-shampoo treatment or finishing touch.$$,
        'oil', 3500, 'confirmed', null, 'EUR',
        $$100 ml$$, 'confirmed', 'in_stock',
        jsonb_build_array('/images/products/huile-capillaire-fortifiante.png'),
        jsonb_build_array(
          $$Aide à réduire la chute des cheveux due à la casse$$,
          $$Aide à nourrir le cuir chevelu et les longueurs$$,
          $$Soutient le confort du cuir chevelu$$,
          $$Aide à améliorer l'apparence de cheveux plus forts et brillants$$
        ),
        jsonb_build_array(
          $$Helps reduce hair fall caused by breakage$$,
          $$Helps nourish the scalp and lengths$$,
          $$Supports scalp comfort$$,
          $$Helps improve the appearance of stronger, shinier hair$$
        ),
        $$Ricinus Communis Seed Oil, Argania Spinosa Kernel Oil, Nigella Sativa Seed Oil, Rosmarinus Officinalis Leaf Extract, Trigonella Foenum-Graecum Seed Extract, Tocopherol$$,
        $$Ricinus Communis Seed Oil, Argania Spinosa Kernel Oil, Nigella Sativa Seed Oil, Rosmarinus Officinalis Leaf Extract, Trigonella Foenum-Graecum Seed Extract, Tocopherol$$,
        $$Appliquer quelques gouttes sur le cuir chevelu et les longueurs. Masser doucement. Laisser agir au moins 30 minutes avant le shampooing, ou toute la nuit.$$,
        $$Apply a few drops to the scalp and lengths. Gently massage. Leave on for at least 30 minutes before shampooing, or overnight.$$,
        $$Éviter le contact avec les yeux. Tenir hors de portée des enfants. Faire un test sur une petite zone avant utilisation.$$,
        $$Avoid contact with eyes. Keep out of reach of children. Perform a patch test before use.$$,
        true, true, 'published', 20,
        $$Huile Capillaire Fortifiante | Pureva$$,
        $$Fortifying Hair Oil | Pureva$$,
        $$Huile capillaire Pureva 100 ml. Aide à réduire la chute due à la casse et à fortifier les cheveux fragilisés. Formulée avec fenugrec, nigelle et romarin.$$,
        $$Pureva hair oil 100 ml. Helps reduce hair fall caused by breakage and strengthen fragile hair. Formulated with fenugreek, nigella and rosemary.$$
      ),
      (
        'hair-serum', 'serum-cheveux-fortifiant', 'strengthening-hair-serum',
        $$Sérum Capillaire$$, $$Hair Serum$$,
        $$Sérum léger pour la brillance, la douceur et des cheveux à l'aspect plus lisse$$,
        $$Lightweight serum for shine, softness, and smoother-looking hair$$,
        $$Un sérum de 50 ml, formulé avec du collagène, des protéines et de la kératine, pour aider à prendre soin des longueurs sèches ou fragilisées. Aide à apporter brillance, lissage et hydratation.$$,
        $$A 50 ml serum formulated with collagen, proteins and keratin, to help care for dry or fragile lengths. Helps provide shine, smoothing and hydration.$$,
        'serum', 1300, 'confirmed', null, 'EUR',
        $$50 ml$$, 'confirmed', 'in_stock',
        jsonb_build_array('/images/products/serum-cheveux-fortifiant.png'),
        jsonb_build_array(
          $$Aide à apporter brillance et lissage$$,
          $$Aide à hydrater les longueurs sèches$$,
          $$Aide à renforcer la fibre capillaire$$,
          $$Laisse les cheveux plus doux et faciles à coiffer$$
        ),
        jsonb_build_array(
          $$Helps provide shine and smoothing$$,
          $$Helps hydrate dry lengths$$,
          $$Helps strengthen the hair fibre$$,
          $$Leaves hair softer and easier to style$$
        ),
        $$Aqua, Glycerin, Phyllanthus Emblica Fruit Extract, Hibiscus Sabdariffa Flower Extract, Urtica Dioica Leaf Extract, Panthenol, Allantoin, Collagen Amino Acids, Keratin Hydrolyzed, Xanthan Gum$$,
        $$Aqua, Glycerin, Phyllanthus Emblica Fruit Extract, Hibiscus Sabdariffa Flower Extract, Urtica Dioica Leaf Extract, Panthenol, Allantoin, Collagen Amino Acids, Keratin Hydrolyzed, Xanthan Gum$$,
        $$Appliquer sur cheveux propres et légèrement humides. Masser doucement sur le cuir chevelu et répartir sur les longueurs. Ne pas rincer.$$,
        $$Apply to clean, slightly damp hair. Gently massage into the scalp and distribute through the lengths. Do not rinse.$$,
        $$Éviter le contact avec les yeux. Tenir hors de portée des enfants. Faire un test sur une petite zone avant utilisation.$$,
        $$Avoid contact with eyes. Keep out of reach of children. Perform a patch test before use.$$,
        true, true, 'published', 30,
        $$Sérum Capillaire Brillance & Lissage | Pureva$$,
        $$Hair Serum Shine & Smoothing | Pureva$$,
        $$Sérum capillaire Pureva 50 ml. Aide à apporter brillance, lissage et hydratation aux longueurs sèches ou fragilisées.$$,
        $$Pureva hair serum 50 ml. Helps provide shine, smoothing and hydration to dry or fragile lengths.$$
      ),
      (
        'scalp-lotion', 'lotion-cuir-chevelu', 'scalp-lotion',
        $$Lotion Cuir Chevelu$$, $$Scalp Lotion$$,
        $$Lotion capillaire pour soutenir le confort du cuir chevelu et prendre soin des racines fragilisées$$,
        $$Scalp lotion to support scalp comfort and care for fragile roots$$,
        $$Une lotion légère pour soutenir l'équilibre du cuir chevelu, apaiser les sensations d'inconfort et préparer les cheveux à la routine. Formule à confirmer.$$,
        $$A lightweight lotion to support scalp balance, soothe feelings of discomfort and prepare hair for the routine. Formula to be confirmed.$$,
        'lotion', 2190, 'confirmed', null, 'EUR',
        $$150ml$$, 'placeholder', 'in_stock',
        jsonb_build_array('/images/products/lotion-cuir-chevelu.png'),
        jsonb_build_array(
          $$Soutient le confort du cuir chevelu$$,
          $$Aide à prendre soin des racines fragilisées$$,
          $$Prépare les cheveux à la routine$$,
          $$Formule légère non grasse$$
        ),
        jsonb_build_array(
          $$Supports scalp comfort$$,
          $$Helps care for fragile roots$$,
          $$Prepares hair for the routine$$,
          $$Lightweight non-greasy formula$$
        ),
        $$Aqua, Glycerin, Rosmarinus Officinalis Leaf Extract, Glycyrrhiza Glabra Root Extract, Trigonella Foenum-Graecum Seed Extract, Niacinamide, Panthenol$$,
        $$Aqua, Glycerin, Rosmarinus Officinalis Leaf Extract, Glycyrrhiza Glabra Root Extract, Trigonella Foenum-Graecum Seed Extract, Niacinamide, Panthenol$$,
        $$Appliquer directement sur le cuir chevelu sec ou humide. Masser doucement. Peut être utilisé quotidiennement ou avant l'application de l'huile.$$,
        $$Apply directly to dry or damp scalp. Gently massage. Can be used daily or before applying the oil.$$,
        $$Éviter le contact avec les yeux. Tenir hors de portée des enfants.$$,
        $$Avoid contact with eyes. Keep out of reach of children.$$,
        false, true, 'draft', 40,
        $$Lotion Cuir Chevelu | Pureva$$,
        $$Scalp Lotion | Pureva$$,
        $$Lotion cuir chevelu Pureva. Soutient le confort du cuir chevelu et aide à prendre soin des racines fragilisées.$$,
        $$Pureva scalp lotion. Supports scalp comfort and helps care for fragile roots.$$
      ),
      (
        'hair-mask', 'masque-soin-cheveux', 'hair-care-mask',
        $$Masque Soin Cheveux$$, $$Hair Care Mask$$,
        $$Masque nourrissant aux protéines et kératine pour aider à adoucir et lisser les cheveux secs ou fragilisés$$,
        $$Nourishing mask with proteins and keratin to help soften and smooth dry or weakened hair$$,
        $$Un masque riche formulé avec du collagène, des protéines, de la kératine et du beurre de karité pour une nutrition intense. Convient à tous types de cheveux. Aide à adoucir, lisser et apporter de la brillance aux cheveux abîmés ou fragilisés.$$,
        $$A rich mask formulated with collagen, proteins, keratin and shea butter for intense nourishment. Suitable for all hair types. Helps soften, smooth and add shine to damaged or weakened hair.$$,
        'mask', 1500, 'confirmed', null, 'EUR',
        $$200 ml$$, 'confirmed', 'in_stock',
        jsonb_build_array('/images/products/masque-soin-cheveux.png'),
        jsonb_build_array(
          $$Aide à adoucir et lisser les cheveux secs$$,
          $$Aide à améliorer la brillance et la maniabilité$$,
          $$Nourrit en profondeur grâce au beurre de karité$$,
          $$Facilite le démêlage$$
        ),
        jsonb_build_array(
          $$Helps soften and smooth dry hair$$,
          $$Helps improve shine and manageability$$,
          $$Deeply nourishes with shea butter$$,
          $$Eases detangling$$
        ),
        $$Aqua, Cetearyl Alcohol, Behentrimonium Methosulfate, Butyrospermum Parkii (Shea) Butter, Glycerin, Phyllanthus Emblica Fruit Extract, Hibiscus Sabdariffa Flower Extract, Syzygium Aromaticum Flower Extract, Collagen Amino Acids, Keratin Hydrolyzed, Panthenol, Tocopherol$$,
        $$Aqua, Cetearyl Alcohol, Behentrimonium Methosulfate, Butyrospermum Parkii (Shea) Butter, Glycerin, Phyllanthus Emblica Fruit Extract, Hibiscus Sabdariffa Flower Extract, Syzygium Aromaticum Flower Extract, Collagen Amino Acids, Keratin Hydrolyzed, Panthenol, Tocopherol$$,
        $$Appliquer généreusement sur cheveux propres et essorés. Laisser poser 10 à 20 minutes. Rincer abondamment à l'eau tiède. Utiliser 1 à 2 fois par semaine.$$,
        $$Apply generously to clean, towel-dried hair. Leave on for 10 to 20 minutes. Rinse thoroughly with lukewarm water. Use 1 to 2 times per week.$$,
        $$Éviter le contact avec les yeux. Tenir hors de portée des enfants.$$,
        $$Avoid contact with eyes. Keep out of reach of children.$$,
        true, true, 'published', 50,
        $$Masque Soin Cheveux Kératine & Protéines | Pureva$$,
        $$Hair Mask with Keratin & Proteins | Pureva$$,
        $$Masque cheveux Pureva. Formulé avec collagène, protéines, kératine et beurre de karité. Aide à adoucir, lisser et nourrir les cheveux secs ou fragilisés.$$,
        $$Pureva hair mask. Formulated with collagen, proteins, keratin and shea butter. Helps soften, smooth and nourish dry or weakened hair.$$
      ),
      (
        'sidr-powder', 'poudre-de-sidr', 'sidr-powder',
        $$Poudre de Sidr$$, $$Sidr Powder$$,
        $$Poudre naturelle multi-usage pour les cheveux, le cuir chevelu et la peau$$,
        $$Natural multi-use powder for hair, scalp, and skin$$,
        $$La poudre de Sidr est un actif botanique traditionnel utilisé dans les soins capillaires et cutanés. Elle aide à nettoyer en douceur, à soutenir le confort du cuir chevelu et à apporter souplesse, éclat et brillance aux cheveux. Peut être intégrée dans un masque maison ou une routine de nettoyage.$$,
        $$Sidr powder is a traditional botanical active used in hair and skin care. It helps cleanse gently, support scalp comfort and bring softness, radiance and shine to hair. Can be incorporated into a home mask or cleansing routine.$$,
        'powder', 1000, 'confirmed', null, 'EUR',
        $$100 g$$, 'confirmed', 'in_stock',
        jsonb_build_array('/images/products/poudre-de-sidr.jpg'),
        jsonb_build_array(
          $$Aide à nettoyer en douceur sans agresser$$,
          $$Soutient le confort du cuir chevelu$$,
          $$Aide à réduire l'apparence des pellicules$$,
          $$Aide à apporter souplesse, éclat et brillance$$,
          $$Usage multi-fonctions : cheveux, cuir chevelu, peau$$
        ),
        jsonb_build_array(
          $$Helps cleanse gently without stripping$$,
          $$Supports scalp comfort$$,
          $$Helps reduce the appearance of dandruff$$,
          $$Helps provide softness, radiance and shine$$,
          $$Multi-use: hair, scalp, skin$$
        ),
        $$Ziziphus Spina-Christi Leaf Powder$$,
        $$Ziziphus Spina-Christi Leaf Powder$$,
        $$Mélanger avec de l'eau pour former une pâte. Appliquer sur les cheveux et le cuir chevelu. Laisser poser 10 à 15 minutes. Rincer abondamment. Peut aussi être ajoutée à un masque ou un soin maison.$$,
        $$Mix with water to form a paste. Apply to hair and scalp. Leave on for 10 to 15 minutes. Rinse thoroughly. Can also be added to a home mask or treatment.$$,
        $$Éviter le contact avec les yeux. Tenir hors de portée des enfants. Faire un test sur une petite zone avant utilisation.$$,
        $$Avoid contact with eyes. Keep out of reach of children. Perform a patch test before use.$$,
        false, false, 'published', 60,
        $$Poudre de Sidr Naturelle | Pureva$$,
        $$Natural Sidr Powder | Pureva$$,
        $$Poudre de Sidr Pureva. Aide à nettoyer en douceur, à soutenir le confort du cuir chevelu et à apporter brillance et souplesse aux cheveux.$$,
        $$Pureva Sidr Powder. Helps cleanse gently, support scalp comfort and bring shine and softness to hair.$$
      ),
      (
        'mashat-powder', 'poudre-de-mashat', 'mashat-powder',
        $$Poudre de Mashat$$, $$Mashat Powder$$,
        $$Poudre capillaire naturelle pour aider à fortifier les cheveux fragilisés et améliorer leur apparence$$,
        $$Natural hair powder to help strengthen weakened hair and improve its appearance$$,
        $$La poudre de Mashat est un actif botanique traditionnel utilisé dans les routines capillaires fortifiantes. Elle aide à renforcer les cheveux fragilisés, à réduire la casse et à améliorer l'apparence de la brillance et de la douceur. Adaptée aux cheveux ternes, fragilisés ou manquant de vitalité.$$,
        $$Mashat powder is a traditional botanical active used in strengthening hair routines. It helps strengthen weakened hair, reduce breakage and improve the appearance of shine and softness. Suitable for dull, fragile or lacking-vitality hair.$$,
        'powder', 1500, 'confirmed', null, 'EUR',
        $$100 ml$$, 'confirmed', 'in_stock',
        jsonb_build_array('/images/products/poudre-de-mashat.jpg'),
        jsonb_build_array(
          $$Aide à renforcer les cheveux fragilisés$$,
          $$Aide à réduire la casse$$,
          $$Contribue à une routine fortifiante$$,
          $$Aide à améliorer l'apparence de brillance et de douceur$$,
          $$Adaptée aux cheveux ternes ou manquant de vitalité$$
        ),
        jsonb_build_array(
          $$Helps strengthen weakened hair$$,
          $$Helps reduce breakage$$,
          $$Contributes to a strengthening routine$$,
          $$Helps improve the appearance of shine and softness$$,
          $$Suitable for dull or lacking-vitality hair$$
        ),
        $$À confirmer — liste INCI en cours de validation.$$,
        $$To be confirmed — INCI list pending validation.$$,
        $$Mélanger avec de l'eau ou une huile végétale pour former une pâte. Appliquer sur les cheveux et le cuir chevelu. Laisser poser 15 à 20 minutes. Rincer abondamment.$$,
        $$Mix with water or a vegetable oil to form a paste. Apply to hair and scalp. Leave on for 15 to 20 minutes. Rinse thoroughly.$$,
        $$Éviter le contact avec les yeux. Tenir hors de portée des enfants. Faire un test sur une petite zone avant utilisation.$$,
        $$Avoid contact with eyes. Keep out of reach of children. Perform a patch test before use.$$,
        false, false, 'published', 70,
        $$Poudre de Mashat Fortifiante | Pureva$$,
        $$Fortifying Mashat Powder | Pureva$$,
        $$Poudre de Mashat Pureva. Aide à renforcer les cheveux fragilisés et à améliorer l'apparence de la brillance et de la douceur.$$,
        $$Pureva Mashat Powder. Helps strengthen weakened hair and improve the appearance of shine and softness.$$
      )
  ) as v(
    legacy_id, slug_fr, slug_en, name_fr, name_en, short_description_fr, short_description_en,
    long_description_fr, long_description_en, category, price_cents, price_status,
    compare_at_price_cents, currency, size, size_status, stock_status, images,
    benefits_fr, benefits_en, ingredients_inci_fr, ingredients_inci_en, how_to_use_fr,
    how_to_use_en, precautions_fr, precautions_en, is_best_seller, is_routine_product,
    status, sort_order, seo_title_fr, seo_title_en, seo_description_fr, seo_description_en
  )
),
upserted as (
  insert into public.products (
    legacy_id, slug_fr, slug_en, name_fr, name_en, short_description_fr, short_description_en,
    long_description_fr, long_description_en, category, price_cents, price_status,
    compare_at_price_cents, currency, size, size_status, stock_status, images,
    benefits_fr, benefits_en, ingredients_inci_fr, ingredients_inci_en, how_to_use_fr,
    how_to_use_en, precautions_fr, precautions_en, is_best_seller, is_routine_product,
    status, sort_order, seo_title_fr, seo_title_en, seo_description_fr, seo_description_en,
    published_at
  )
  select
    legacy_id, slug_fr, slug_en, name_fr, name_en, short_description_fr, short_description_en,
    long_description_fr, long_description_en, category, price_cents, price_status,
    compare_at_price_cents, currency, size, size_status, stock_status, images,
    benefits_fr, benefits_en, ingredients_inci_fr, ingredients_inci_en, how_to_use_fr,
    how_to_use_en, precautions_fr, precautions_en, is_best_seller, is_routine_product,
    status, sort_order, seo_title_fr, seo_title_en, seo_description_fr, seo_description_en,
    case when status = 'published' then now() else null end
  from seed_products
  on conflict (legacy_id) do update
  set
    slug_fr = excluded.slug_fr,
    slug_en = excluded.slug_en,
    name_fr = excluded.name_fr,
    name_en = excluded.name_en,
    short_description_fr = excluded.short_description_fr,
    short_description_en = excluded.short_description_en,
    long_description_fr = excluded.long_description_fr,
    long_description_en = excluded.long_description_en,
    category = excluded.category,
    price_cents = excluded.price_cents,
    price_status = excluded.price_status,
    compare_at_price_cents = excluded.compare_at_price_cents,
    currency = excluded.currency,
    size = excluded.size,
    size_status = excluded.size_status,
    stock_status = excluded.stock_status,
    images = excluded.images,
    benefits_fr = excluded.benefits_fr,
    benefits_en = excluded.benefits_en,
    ingredients_inci_fr = excluded.ingredients_inci_fr,
    ingredients_inci_en = excluded.ingredients_inci_en,
    how_to_use_fr = excluded.how_to_use_fr,
    how_to_use_en = excluded.how_to_use_en,
    precautions_fr = excluded.precautions_fr,
    precautions_en = excluded.precautions_en,
    is_best_seller = excluded.is_best_seller,
    is_routine_product = excluded.is_routine_product,
    status = excluded.status,
    sort_order = excluded.sort_order,
    seo_title_fr = excluded.seo_title_fr,
    seo_title_en = excluded.seo_title_en,
    seo_description_fr = excluded.seo_description_fr,
    seo_description_en = excluded.seo_description_en,
    published_at = excluded.published_at
  returning *
)
insert into public.admin_product_events (product_id, admin_user_id, event_type, after_snapshot, note)
select id, null, 'product_seeded', to_jsonb(upserted), 'Initial static catalog seed'
from upserted
where not exists (
  select 1
  from public.admin_product_events e
  where e.product_id = upserted.id
    and e.event_type = 'product_seeded'
);
