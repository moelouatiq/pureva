-- Idempotent client catalog import. Existing product slugs and prices are preserved.
-- New products remain drafts because the supplied technical sheets contain no price.

update public.products
set
  name_fr = $$Huile Capillaire Fortifiante$$,
  name_en = $$Strengthening Hair Oil$$,
  short_description_fr = $$Huile naturelle qui aide à nourrir le cuir chevelu et à renforcer l’apparence des cheveux fragilisés.$$,
  short_description_en = $$Natural hair oil that helps nourish the scalp and strengthen the appearance of weakened hair.$$,
  long_description_fr = $$Huile capillaire naturelle riche en huiles végétales et extraits botaniques. Elle aide à nourrir et hydrater le cuir chevelu, à renforcer les cheveux fragilisés et à améliorer leur souplesse et leur brillance, sans présenter la pousse comme un résultat garanti.$$,
  long_description_en = $$A natural hair oil rich in botanical oils and extracts. It helps nourish and moisturise the scalp, strengthen weakened hair, and improve suppleness and shine, without presenting hair growth as a guaranteed result.$$,
  benefits_fr = jsonb_build_array(
    $$Aide à renforcer les cheveux fragilisés$$,
    $$Nourrit et hydrate le cuir chevelu$$,
    $$Contribue à améliorer l’apparence et la souplesse des cheveux$$,
    $$Apporte de la brillance$$,
    $$Convient aux cheveux fragiles et cassants$$
  ),
  benefits_en = jsonb_build_array(
    $$Helps strengthen weakened hair$$,
    $$Nourishes and moisturises the scalp$$,
    $$Helps improve the appearance and suppleness of hair$$,
    $$Adds shine$$,
    $$Suitable for fragile and brittle hair$$
  ),
  key_ingredients_fr = jsonb_build_array(
    $$Jojoba$$, $$Ricin$$, $$Sésame$$, $$Graines d’oignon$$, $$Camomille$$, $$Amla$$,
    $$Romarin$$, $$Clou de girofle$$, $$Al-lazaz$$, $$Hibiscus$$, $$Valériane$$, $$Rose$$,
    $$Cèdre$$, $$Amande$$, $$Argan$$, $$Nigelle$$, $$Roquette$$, $$Moutarde$$, $$Neem$$,
    $$Chanvre$$, $$Huiles essentielles de lavande, romarin et cèdre$$
  ),
  key_ingredients_en = jsonb_build_array(
    $$Jojoba$$, $$Castor$$, $$Sesame$$, $$Onion seed$$, $$Chamomile$$, $$Amla$$,
    $$Rosemary$$, $$Clove$$, $$Al-lazaz$$, $$Hibiscus$$, $$Valerian$$, $$Rose$$,
    $$Cedarwood$$, $$Almond$$, $$Argan$$, $$Nigella$$, $$Rocket$$, $$Mustard$$, $$Neem$$,
    $$Hemp$$, $$Lavender, rosemary and cedarwood essential oils$$
  ),
  composition_note_fr = $$Composition fournie par le client ; elle ne remplace pas la liste INCI réglementaire.$$,
  composition_note_en = $$Composition supplied by the client; it does not replace the regulatory INCI list.$$,
  how_to_use_fr = $$Appliquer quelques gouttes sur le cuir chevelu. Masser pendant 5 à 10 minutes. Laisser poser de 30 minutes à toute une nuit, puis laver avec un shampoing doux. Utiliser 2 à 3 fois par semaine.$$,
  how_to_use_en = $$Apply a few drops to the scalp. Massage for 5 to 10 minutes. Leave on for 30 minutes or overnight, then wash with a gentle shampoo. Use 2 to 3 times per week.$$,
  precautions_fr = $$Usage externe uniquement. Éviter le contact avec les yeux. Effectuer un test cutané avant utilisation.$$,
  precautions_en = $$For external use only. Avoid contact with eyes. Perform a patch test before use.$$,
  target_audience_fr = $$Tous types de cheveux, particulièrement les cheveux fragiles ou cassants.$$,
  target_audience_en = $$All hair types, especially fragile or brittle hair.$$,
  usage_area_fr = $$Cuir chevelu et cheveux$$,
  usage_area_en = $$Scalp and hair$$,
  texture_fr = $$Liquide huileux$$,
  texture_en = $$Oily liquid$$,
  color_fr = $$Jaune à doré$$,
  color_en = $$Yellow to golden$$,
  seo_title_fr = $$Huile Capillaire Fortifiante 100 ml | Pureva$$,
  seo_title_en = $$Strengthening Hair Oil 100 ml | Pureva$$,
  seo_description_fr = $$Huile capillaire Pureva 100 ml qui aide à nourrir le cuir chevelu, renforcer les cheveux fragilisés et leur apporter souplesse et brillance.$$,
  seo_description_en = $$Pureva 100 ml hair oil that helps nourish the scalp, strengthen weakened hair, and improve suppleness and shine.$$
where legacy_id = 'hair-oil';

update public.products
set
  name_fr = $$Masque Capillaire Hydratant & Nourrissant$$,
  name_en = $$Hydrating & Nourishing Hair Mask$$,
  short_description_fr = $$Masque onctueux qui hydrate, nourrit et adoucit les cheveux secs ou abîmés.$$,
  short_description_en = $$A rich mask that hydrates, nourishes and softens dry or damaged hair.$$,
  long_description_fr = $$Masque capillaire formulé pour hydrater intensément, nourrir et adoucir les cheveux secs et abîmés. Il aide à restaurer la souplesse, la brillance et la douceur de la fibre capillaire.$$,
  long_description_en = $$A hair mask formulated to deeply hydrate, nourish and soften dry or damaged hair. It helps restore suppleness, shine and softness to the hair fibre.$$,
  benefits_fr = jsonb_build_array(
    $$Hydrate en profondeur$$, $$Nourrit la fibre capillaire$$, $$Aide à réduire les frisottis$$,
    $$Facilite le démêlage$$, $$Apporte douceur et brillance$$, $$Protège contre la sécheresse$$
  ),
  benefits_en = jsonb_build_array(
    $$Deeply hydrates$$, $$Nourishes the hair fibre$$, $$Helps reduce frizz$$,
    $$Makes detangling easier$$, $$Adds softness and shine$$, $$Helps protect against dryness$$
  ),
  how_to_use_fr = $$Appliquer sur cheveux propres et humides. Répartir sur les longueurs et les pointes. Laisser poser 5 à 15 minutes, puis rincer abondamment. Utiliser 1 à 2 fois par semaine.$$,
  how_to_use_en = $$Apply to clean, damp hair. Distribute through the lengths and ends. Leave on for 5 to 15 minutes, then rinse thoroughly. Use 1 to 2 times per week.$$,
  precautions_fr = $$Usage externe uniquement. Éviter le contact avec les yeux. Ne pas utiliser sur un cuir chevelu irrité. Tenir hors de portée des enfants.$$,
  precautions_en = $$For external use only. Avoid contact with eyes. Do not use on an irritated scalp. Keep out of reach of children.$$,
  target_audience_fr = $$Tous types de cheveux. Idéal pour les cheveux secs, abîmés ou déshydratés.$$,
  target_audience_en = $$All hair types. Ideal for dry, damaged or dehydrated hair.$$,
  usage_area_fr = $$Longueurs et pointes$$,
  usage_area_en = $$Lengths and ends$$,
  texture_fr = $$Crème onctueuse$$,
  texture_en = $$Rich cream$$,
  seo_title_fr = $$Masque Capillaire Hydratant & Nourrissant 200 ml | Pureva$$,
  seo_title_en = $$Hydrating & Nourishing Hair Mask 200 ml | Pureva$$,
  seo_description_fr = $$Masque capillaire Pureva 200 ml pour hydrater, nourrir, faciliter le démêlage et apporter douceur et brillance aux cheveux secs ou abîmés.$$,
  seo_description_en = $$Pureva 200 ml hair mask to hydrate, nourish, ease detangling, and add softness and shine to dry or damaged hair.$$
where legacy_id = 'hair-mask';

update public.products
set
  name_fr = $$Sérum Capillaire Fortifiant$$,
  name_en = $$Strengthening Hair Serum$$,
  short_description_fr = $$Sérum léger sans rinçage qui aide à nourrir, renforcer et protéger les longueurs sans effet gras.$$,
  short_description_en = $$A lightweight leave-in serum that helps nourish, strengthen and protect the lengths without a greasy feel.$$,
  long_description_fr = $$Sérum capillaire léger formulé pour nourrir, renforcer et protéger les cheveux sans effet gras. Il aide à lisser les frisottis et à apporter de la brillance aux longueurs fragilisées.$$,
  long_description_en = $$A lightweight hair serum formulated to nourish, strengthen and protect hair without a greasy feel. It helps smooth frizz and add shine to weakened lengths.$$,
  benefits_fr = jsonb_build_array(
    $$Aide à renforcer la fibre capillaire$$, $$Protège les longueurs$$, $$Apporte de la brillance$$,
    $$Aide à lisser les frisottis$$, $$Nourrit sans alourdir$$
  ),
  benefits_en = jsonb_build_array(
    $$Helps strengthen the hair fibre$$, $$Protects the lengths$$, $$Adds shine$$,
    $$Helps smooth frizz$$, $$Nourishes without weighing hair down$$
  ),
  how_to_use_fr = $$Appliquer 1 à 3 gouttes sur cheveux secs ou humides. Répartir sur les longueurs et les pointes. Ne pas rincer. Peut être utilisé quotidiennement.$$,
  how_to_use_en = $$Apply 1 to 3 drops to dry or damp hair. Distribute through the lengths and ends. Do not rinse. Suitable for daily use.$$,
  target_audience_fr = $$Tous types de cheveux. Idéal pour les cheveux secs, abîmés ou cassants.$$,
  target_audience_en = $$All hair types. Ideal for dry, damaged or brittle hair.$$,
  usage_area_fr = $$Longueurs et pointes$$,
  usage_area_en = $$Lengths and ends$$,
  texture_fr = $$Sérum léger$$,
  texture_en = $$Lightweight serum$$,
  packaging_fr = $$Flacon pipette$$,
  packaging_en = $$Dropper bottle$$,
  seo_title_fr = $$Sérum Capillaire Fortifiant 50 ml | Pureva$$,
  seo_title_en = $$Strengthening Hair Serum 50 ml | Pureva$$,
  seo_description_fr = $$Sérum capillaire Pureva 50 ml qui aide à renforcer et protéger les longueurs, lisser les frisottis et apporter de la brillance.$$,
  seo_description_en = $$Pureva 50 ml hair serum that helps strengthen and protect the lengths, smooth frizz, and add shine.$$
where legacy_id = 'hair-serum';

insert into public.products (
  legacy_id, slug_fr, slug_en, name_fr, name_en, short_description_fr, short_description_en,
  long_description_fr, long_description_en, category, price_cents, price_status,
  compare_at_price_cents, currency, size, size_status, stock_status, images,
  image_alt_fr, image_alt_en, benefits_fr, benefits_en, key_ingredients_fr,
  key_ingredients_en, composition_note_fr, composition_note_en, ingredients_inci_fr,
  ingredients_inci_en, how_to_use_fr, how_to_use_en, precautions_fr, precautions_en,
  target_audience_fr, target_audience_en, usage_area_fr, usage_area_en, texture_fr,
  texture_en, color_fr, color_en, fragrance_fr, fragrance_en, packaging_fr, packaging_en,
  storage_instructions_fr, storage_instructions_en, is_best_seller, is_routine_product,
  status, sort_order, seo_title_fr, seo_title_en, seo_description_fr, seo_description_en
)
values
(
  'hair-spray', 'spray-fortifiant-cheveux', 'strengthening-hair-spray',
  $$Spray Fortifiant Cheveux$$, $$Strengthening Hair Spray$$,
  $$Spray ciblé qui aide à fortifier les cheveux fragilisés et à maintenir le confort du cuir chevelu.$$,
  $$A targeted spray that helps strengthen weakened hair and maintain scalp comfort.$$,
  $$Spray spécialement formulé pour le soin du cuir chevelu et des cheveux fragilisés. Il aide à fortifier la fibre capillaire, à améliorer l’apparence des cheveux et à maintenir le cuir chevelu confortable. Son format spray facilite l’application ciblée sur les racines.$$,
  $$A spray specially formulated to care for the scalp and weakened hair. It helps strengthen the hair fibre, improve the appearance of hair, and maintain scalp comfort. The spray format makes targeted application to the roots easy.$$,
  'hair_care', null, 'placeholder', null, 'EUR', '120 ml', 'confirmed', 'out_of_stock',
  jsonb_build_array('https://qqsmqzjruibgejlzveeh.supabase.co/storage/v1/object/public/product-images/products/spray-fortifiant-cheveux/spray-fortifiant-cheveux-pureva-120-ml.jpeg'),
  jsonb_build_array($$Spray fortifiant cheveux Pureva 120 ml$$),
  jsonb_build_array($$Pureva strengthening hair spray 120 ml$$),
  jsonb_build_array(
    $$Aide à fortifier les cheveux fragilisés$$,
    $$Contribue à améliorer l’apparence de la fibre$$,
    $$Aide à maintenir le cuir chevelu hydraté$$,
    $$Permet une application ciblée sur les racines$$,
    $$Procure une sensation de fraîcheur et de confort$$,
    $$Aide à réduire l’apparence des cheveux cassants dans le cadre d’une routine$$
  ),
  jsonb_build_array(
    $$Helps strengthen weakened hair$$,
    $$Helps improve the appearance of the hair fibre$$,
    $$Helps keep the scalp moisturised$$,
    $$Allows targeted application to the roots$$,
    $$Provides a fresh, comfortable feel$$,
    $$Helps reduce the appearance of brittle hair as part of a routine$$
  ),
  '[]'::jsonb, '[]'::jsonb, null, null, null, null,
  $$Vaporiser sur le cuir chevelu propre, sec ou légèrement humide, en ciblant les racines. Masser délicatement quelques minutes. Ne pas rincer. Utiliser quotidiennement ou selon les besoins.$$,
  $$Spray onto a clean, dry or slightly damp scalp, targeting the roots. Massage gently for a few minutes. Do not rinse. Use daily or as needed.$$,
  null, null,
  $$Adultes ayant les cheveux fragilisés ou cassants.$$,
  $$Adults with weakened or brittle hair.$$,
  $$Cuir chevelu et racines$$, $$Scalp and roots$$,
  $$Spray léger$$, $$Lightweight spray$$,
  null, null, null, null, $$Flacon spray$$, $$Spray bottle$$, null, null,
  false, false, 'draft', 80,
  $$Spray Fortifiant Cheveux 120 ml | Pureva$$,
  $$Strengthening Hair Spray 120 ml | Pureva$$,
  $$Spray Pureva 120 ml pour le cuir chevelu et les racines. Aide à fortifier les cheveux fragilisés et à maintenir le confort du cuir chevelu.$$,
  $$Pureva 120 ml scalp and root spray. Helps strengthen weakened hair and maintain scalp comfort.$$
),
(
  'foot-scrub', 'gommage-pieds', 'nourishing-foot-scrub',
  $$Gommage Pieds Nourrissant & Exfoliant$$, $$Nourishing & Exfoliating Foot Scrub$$,
  $$Gommage doux qui aide à éliminer les cellules mortes et les rugosités des pieds.$$,
  $$A gentle scrub that helps remove dead skin cells and rough areas from the feet.$$,
  $$Gommage spécialement formulé pour exfolier en douceur la peau des pieds. Il aide à éliminer les cellules mortes et les rugosités, notamment au niveau des talons, afin de laisser la peau plus douce, lisse et confortable.$$,
  $$A scrub specially formulated to gently exfoliate the skin on the feet. It helps remove dead skin cells and rough areas, especially around the heels, leaving the skin softer, smoother and more comfortable.$$,
  'foot_care', null, 'placeholder', null, 'EUR', '200 g', 'confirmed', 'out_of_stock',
  jsonb_build_array('https://qqsmqzjruibgejlzveeh.supabase.co/storage/v1/object/public/product-images/products/gommage-pieds/gommage-pieds-pureva-200-g.jpeg'),
  jsonb_build_array($$Gommage pieds nourrissant et exfoliant Pureva 200 g$$),
  jsonb_build_array($$Pureva nourishing and exfoliating foot scrub 200 g$$),
  jsonb_build_array(
    $$Élimine les cellules mortes$$, $$Aide à réduire l’aspect rugueux des talons$$,
    $$Lisse et adoucit la peau$$, $$Prépare la peau à recevoir un soin hydratant$$,
    $$Laisse la peau souple$$
  ),
  jsonb_build_array(
    $$Removes dead skin cells$$, $$Helps reduce the rough appearance of heels$$,
    $$Smooths and softens the skin$$, $$Prepares the skin for moisturising care$$,
    $$Leaves skin supple$$
  ),
  jsonb_build_array($$Base crème$$, $$Exfoliant$$, $$Agent hydratant$$, $$Huile ou beurre végétal$$, $$Parfum cosmétique$$, $$Conservateur$$, $$Antioxydant$$, $$Aker Fassi$$),
  jsonb_build_array($$Cream base$$, $$Exfoliant$$, $$Moisturising agent$$, $$Plant oil or butter$$, $$Cosmetic fragrance$$, $$Preservative$$, $$Antioxidant$$, $$Aker Fassi$$),
  $$Composition indicative fournie par le client ; elle ne constitue pas une liste INCI définitive.$$,
  $$Indicative composition supplied by the client; it is not a definitive INCI list.$$,
  null, null,
  $$Appliquer sur des pieds propres et légèrement humides. Masser en mouvements circulaires pendant 2 à 5 minutes en insistant sur les talons et les zones rugueuses. Rincer, sécher soigneusement, puis appliquer un soin hydratant. Utiliser 1 à 2 fois par semaine.$$,
  $$Apply to clean, slightly damp feet. Massage in circular motions for 2 to 5 minutes, focusing on the heels and rough areas. Rinse, dry thoroughly, then apply a moisturiser. Use 1 to 2 times per week.$$,
  null, null, null, null,
  $$Pieds, talons et zones rugueuses$$, $$Feet, heels and rough areas$$,
  $$Crème exfoliante$$, $$Exfoliating cream$$,
  $$Rose$$, $$Pink$$, $$Fruité$$, $$Fruity$$,
  $$Pot$$, $$Jar$$, null, null,
  false, false, 'draft', 90,
  $$Gommage Pieds Nourrissant & Exfoliant 200 g | Pureva$$,
  $$Nourishing & Exfoliating Foot Scrub 200 g | Pureva$$,
  $$Gommage pieds Pureva 200 g qui exfolie en douceur et aide à lisser les talons et les zones rugueuses.$$,
  $$Pureva 200 g foot scrub that gently exfoliates and helps smooth heels and rough areas.$$
),
(
  'foot-cream', 'creme-pieds-nourrissante', 'nourishing-foot-cream',
  $$Crème Pieds Nourrissante & Réparatrice$$, $$Nourishing & Repairing Foot Cream$$,
  $$Crème riche qui aide à nourrir, hydrater et adoucir les pieds secs et rugueux.$$,
  $$A rich cream that helps nourish, moisturise and soften dry, rough feet.$$,
  $$Crème spécialement formulée pour prendre soin des pieds secs et rugueux. Sa texture riche aide à nourrir et hydrater la peau tout en améliorant la sensation de confort et de douceur.$$,
  $$A cream specially formulated to care for dry, rough feet. Its rich texture helps nourish and moisturise the skin while improving comfort and softness.$$,
  'foot_care', null, 'placeholder', null, 'EUR', null, 'placeholder', 'out_of_stock',
  jsonb_build_array(
    'https://qqsmqzjruibgejlzveeh.supabase.co/storage/v1/object/public/product-images/products/creme-pieds-nourrissante/creme-pieds-pureva-pot.jpeg',
    'https://qqsmqzjruibgejlzveeh.supabase.co/storage/v1/object/public/product-images/products/creme-pieds-nourrissante/creme-pieds-pureva-vue-exterieure.jpeg'
  ),
  jsonb_build_array($$Crème pieds nourrissante et réparatrice Pureva en pot$$, $$Crème pieds Pureva présentée en extérieur$$),
  jsonb_build_array($$Pureva nourishing and repairing foot cream in a jar$$, $$Pureva foot cream photographed outdoors$$),
  jsonb_build_array(
    $$Hydrate intensément$$, $$Nourrit la peau$$, $$Adoucit les pieds$$,
    $$Améliore l’aspect des talons secs$$, $$Laisse la peau souple et confortable$$,
    $$Convient à une utilisation quotidienne$$
  ),
  jsonb_build_array(
    $$Provides intensive moisture$$, $$Nourishes the skin$$, $$Softens the feet$$,
    $$Improves the appearance of dry heels$$, $$Leaves skin supple and comfortable$$,
    $$Suitable for daily use$$
  ),
  jsonb_build_array($$Urée$$, $$Glycérine$$, $$Beurre de karité$$, $$Huile d’amande douce$$, $$Panthénol$$, $$Vitamine E$$),
  jsonb_build_array($$Urea$$, $$Glycerin$$, $$Shea butter$$, $$Sweet almond oil$$, $$Panthenol$$, $$Vitamin E$$),
  $$Actifs fournis par le client ; la liste INCI complète reste à confirmer.$$,
  $$Actives supplied by the client; the complete INCI list remains to be confirmed.$$,
  null, null,
  $$Appliquer sur des pieds propres et secs en insistant sur les talons et les zones sèches. Masser jusqu’à absorption. Pour un soin intensif, appliquer le soir et laisser agir pendant la nuit.$$,
  $$Apply to clean, dry feet, focusing on the heels and dry areas. Massage until absorbed. For intensive care, apply in the evening and leave on overnight.$$,
  null, null,
  $$Pieds secs et rugueux$$, $$Dry, rough feet$$,
  $$Pieds, talons et zones sèches$$, $$Feet, heels and dry areas$$,
  $$Crème riche$$, $$Rich cream$$,
  null, null, null, null, $$Pot$$, $$Jar$$, null, null,
  false, false, 'draft', 100,
  $$Crème Pieds Nourrissante & Réparatrice | Pureva$$,
  $$Nourishing & Repairing Foot Cream | Pureva$$,
  $$Crème pieds Pureva qui aide à nourrir, hydrater et adoucir les pieds secs et les talons rugueux.$$,
  $$Pureva foot cream that helps nourish, moisturise and soften dry feet and rough heels.$$
),
(
  'bath-salt', 'sel-de-bain-relaxant', 'relaxing-bath-salts',
  $$Sel de Bain Relaxant$$, $$Relaxing Bath Salts$$,
  $$Cristaux parfumés qui transforment le bain en un moment de confort et de détente.$$,
  $$Scented crystals that turn bath time into a relaxing, comfortable moment.$$,
  $$Sel de bain formulé pour agrémenter le moment du bain. Il se dissout dans l’eau et parfume agréablement le bain tout en procurant une sensation de confort et de détente.$$,
  $$Bath salts formulated to enhance bath time. They dissolve in water and gently fragrance the bath while providing a feeling of comfort and relaxation.$$,
  'body_care', null, 'placeholder', null, 'EUR', '200 g', 'confirmed', 'out_of_stock',
  jsonb_build_array(
    'https://qqsmqzjruibgejlzveeh.supabase.co/storage/v1/object/public/product-images/products/sel-de-bain-relaxant/sel-de-bain-pureva-200-g-face.jpeg',
    'https://qqsmqzjruibgejlzveeh.supabase.co/storage/v1/object/public/product-images/products/sel-de-bain-relaxant/sel-de-bain-pureva-200-g-profil.jpeg',
    'https://qqsmqzjruibgejlzveeh.supabase.co/storage/v1/object/public/product-images/products/sel-de-bain-relaxant/sel-de-bain-pureva-200-g-dos.jpeg'
  ),
  jsonb_build_array($$Sel de bain relaxant Pureva 200 g, face avant$$, $$Sel de bain relaxant Pureva 200 g, vue de profil$$, $$Sel de bain relaxant Pureva 200 g, étiquette arrière$$),
  jsonb_build_array($$Pureva relaxing bath salts 200 g, front view$$, $$Pureva relaxing bath salts 200 g, side view$$, $$Pureva relaxing bath salts 200 g, back label$$),
  jsonb_build_array(
    $$Parfume agréablement l’eau$$, $$Procure une sensation de détente$$,
    $$Laisse une sensation de confort$$, $$Transforme le bain en moment de bien-être$$
  ),
  jsonb_build_array(
    $$Gently fragrances the water$$, $$Provides a relaxing sensation$$,
    $$Leaves a feeling of comfort$$, $$Turns bath time into a moment of wellbeing$$
  ),
  jsonb_build_array($$Sel marin ou sel d’Epsom$$, $$Bicarbonate de sodium$$, $$Parfum cosmétique$$, $$Huile cosmétique ou huile essentielle selon la formulation$$, $$Agent anti-agglomérant si nécessaire$$),
  jsonb_build_array($$Sea salt or Epsom salt$$, $$Sodium bicarbonate$$, $$Cosmetic fragrance$$, $$Cosmetic oil or essential oil depending on the formulation$$, $$Anti-caking agent if required$$),
  $$Composition indicative fournie par le client ; elle ne constitue pas une liste INCI définitive.$$,
  $$Indicative composition supplied by the client; it is not a definitive INCI list.$$,
  null, null,
  $$Verser dans une baignoire d’eau tiède et remuer pour favoriser la dissolution. Profiter du bain pendant 15 à 20 minutes. Rincer la peau si nécessaire.$$,
  $$Pour into a warm bath and stir to help dissolve. Enjoy the bath for 15 to 20 minutes. Rinse the skin if needed.$$,
  $$Usage externe. Ne pas avaler. Éviter le contact avec les yeux. Ne pas utiliser sur une peau irritée ou lésée. Tenir hors de portée des enfants. La baignoire peut devenir glissante.$$,
  $$For external use. Do not swallow. Avoid contact with eyes. Do not use on irritated or broken skin. Keep out of reach of children. The bath may become slippery.$$,
  null, null, $$Bain$$, $$Bath$$,
  $$Cristaux / granulés$$, $$Crystals / granules$$,
  null, null, $$Fruité$$, $$Fruity$$, $$Pot$$, $$Jar$$, null, null,
  false, false, 'draft', 110,
  $$Sel de Bain Relaxant 200 g | Pureva$$,
  $$Relaxing Bath Salts 200 g | Pureva$$,
  $$Sel de bain Pureva 200 g aux notes fruitées, pour parfumer l’eau et créer un moment de confort et de détente.$$,
  $$Pureva 200 g fruity bath salts that fragrance the water and create a relaxing, comfortable moment.$$
)
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
  size = coalesce(excluded.size, products.size),
  size_status = case when excluded.size is null then products.size_status else excluded.size_status end,
  images = excluded.images,
  image_alt_fr = excluded.image_alt_fr,
  image_alt_en = excluded.image_alt_en,
  benefits_fr = excluded.benefits_fr,
  benefits_en = excluded.benefits_en,
  key_ingredients_fr = excluded.key_ingredients_fr,
  key_ingredients_en = excluded.key_ingredients_en,
  composition_note_fr = excluded.composition_note_fr,
  composition_note_en = excluded.composition_note_en,
  ingredients_inci_fr = coalesce(excluded.ingredients_inci_fr, products.ingredients_inci_fr),
  ingredients_inci_en = coalesce(excluded.ingredients_inci_en, products.ingredients_inci_en),
  how_to_use_fr = excluded.how_to_use_fr,
  how_to_use_en = excluded.how_to_use_en,
  precautions_fr = coalesce(excluded.precautions_fr, products.precautions_fr),
  precautions_en = coalesce(excluded.precautions_en, products.precautions_en),
  target_audience_fr = excluded.target_audience_fr,
  target_audience_en = excluded.target_audience_en,
  usage_area_fr = excluded.usage_area_fr,
  usage_area_en = excluded.usage_area_en,
  texture_fr = excluded.texture_fr,
  texture_en = excluded.texture_en,
  color_fr = excluded.color_fr,
  color_en = excluded.color_en,
  fragrance_fr = excluded.fragrance_fr,
  fragrance_en = excluded.fragrance_en,
  packaging_fr = excluded.packaging_fr,
  packaging_en = excluded.packaging_en,
  storage_instructions_fr = coalesce(excluded.storage_instructions_fr, products.storage_instructions_fr),
  storage_instructions_en = coalesce(excluded.storage_instructions_en, products.storage_instructions_en),
  is_best_seller = excluded.is_best_seller,
  is_routine_product = excluded.is_routine_product,
  sort_order = excluded.sort_order,
  seo_title_fr = excluded.seo_title_fr,
  seo_title_en = excluded.seo_title_en,
  seo_description_fr = excluded.seo_description_fr,
  seo_description_en = excluded.seo_description_en;
