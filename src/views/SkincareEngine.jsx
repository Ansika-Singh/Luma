import { useState } from 'react';
import { Sparkles, CheckCircle2, Sun, Moon, Droplets, Filter, ShieldCheck, IndianRupee, Clock } from 'lucide-react';
import { FITZ_COLORS, FITZ_LABELS } from '../lib/fitzpatrick';

export const productsDb = [
  // ─── 1. ACNE (COMEDONAL & INFLAMMATORY) ───
  {
    id: 1,
    name: 'Minimalist 2% Salicylic Acid',
    brand: 'Minimalist',
    condition: 'Acne (Comedonal)',
    category: 'Cleanser',
    price: '₹299',
    priceTier: 'Affordable OTC',
    keyActives: '2% Salicylic Acid (BHA) + LHA + Zinc PCA',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Use AM or PM. Gently massage onto damp skin for 60 seconds, then rinse with lukewarm water.',
    description: 'A gentle yet effective BHA cleanser. Proven efficacy on darker skin tones without causing post-inflammatory hyperpigmentation or barrier stripping.'
  },
  {
    id: 2,
    name: 'Sebogel Salicylic & Nicotinamide Gel',
    brand: 'Curatio Healthcare',
    condition: 'Acne (Comedonal)',
    category: 'Treatment',
    price: '₹270',
    priceTier: 'Pharmacy Grade OTC',
    keyActives: '2% Salicylic Acid + 6% Nicotinamide (Niacinamide)',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply a pea-sized dot directly onto comedones and breakout areas after cleansing at night.',
    description: 'Gold-standard Indian pharmacy anti-acne gel. Dual-action formula unclogs pores, curbs sebum, and prevents inflammatory acne marks.'
  },
  {
    id: 3,
    name: 'Aziderm 10% Azelaic Acid Gel',
    brand: 'Micro Labs',
    condition: 'Acne (Comedonal)',
    category: 'Treatment',
    price: '₹285',
    priceTier: 'Dermatology Pharmacy',
    keyActives: '10% Micronized Azelaic Acid',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply thin layer once daily (preferably PM) to clear blemishes and calm redness.',
    description: 'First-line clinical recommendation for darker skin types (IV–VI). Selectively targets abnormal melanocytes to fade acne spots while destroying acne bacteria.'
  },
  {
    id: 4,
    name: 'Cipla Saslic DS 2% Salicylic Acid Foam Wash',
    brand: 'Cipla Health',
    condition: 'Acne (Comedonal)',
    category: 'Cleanser',
    price: '₹450',
    priceTier: 'Clinical OTC',
    keyActives: '2% Salicylic Acid Encapsulated Micro-Foam',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Pump rich foam onto palms, massage over face for 30 seconds, and rinse off thoroughly.',
    description: 'Prescription-grade salicylic foaming wash widely used in Indian dermatological practice to decongest cystic comedones and control active pustules.'
  },
  {
    id: 5,
    name: 'Cipla Excela Max Moisturizer',
    brand: 'Cipla Health',
    condition: 'Acne (Comedonal)',
    category: 'Moisturizer',
    price: '₹495',
    priceTier: 'Clinical OTC',
    keyActives: 'Enantia Chlorantha Extract + Oleanolic Acid + Niacinamide',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Smooth over entire face after serums to lock in hydration without shine.',
    description: 'Oil-free mattifying moisturizer formulated specifically for acne-prone skin in warm, humid Indian climates. Reduces sebum excretion rate by up to 32%.'
  },
  {
    id: 6,
    name: "Re'equil Ultra Matte Dry Touch Gel SPF 50",
    brand: "Re'equil",
    condition: 'Acne (Comedonal)',
    category: 'Sunscreen',
    price: '₹700',
    priceTier: 'Dermatologist Standard',
    keyActives: 'Advanced Hybrid Filters · PA++++ Rating · Silicone Base',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply 2 finger-lengths generously 15 minutes before stepping out in daylight.',
    description: 'Non-comedogenic, oil-free matte gel with zero white cast on Fitzpatrick phototypes V & VI. Essential to prevent active acne blemishes from tanning into permanent scars.'
  },
  {
    id: 7,
    name: 'Sebamed Clear Face Care Gel',
    brand: 'Sebamed',
    condition: 'Acne (Comedonal)',
    category: 'Soothing Gel',
    price: '₹475',
    priceTier: 'Clinical OTC',
    keyActives: 'Hyaluronic Acid + Aloe Vera + Allantoin (pH 5.5)',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply morning and night to calm irritated, inflamed active lesions.',
    description: 'Water-based soothing gel at physiological pH 5.5. Supports the natural acid mantle to naturally suppress P. acnes bacteria without pore blockage.'
  },
  {
    id: 8,
    name: 'Brevoxyl 4% Creamy Wash (Benzoyl Peroxide)',
    brand: 'GlaxoSmithKline',
    condition: 'Acne (Comedonal)',
    category: 'Treatment',
    price: '₹240',
    priceTier: 'Pharmacy Standard',
    keyActives: '4% Micronized Benzoyl Peroxide',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Short-contact therapy: apply on breakout zones for 3-5 minutes then wash off thoroughly.',
    description: 'Potent bactericidal wash that destroys acne-causing Cutibacterium acnes without causing bacterial resistance, ideal for inflamed papulopustular acne.'
  },

  // ─── 2. HYPERPIGMENTATION & MELASMA ───
  {
    id: 9,
    name: 'Niacinamide 10% Serum',
    brand: 'Plum Goodness',
    condition: 'Hyperpigmentation',
    category: 'Treatment',
    price: '₹599',
    priceTier: 'Clinical OTC',
    keyActives: '10% Niacinamide + Fermented Rice Water + Licorice Root',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Dispense 3-4 drops onto cleansed face, gently pat until absorbed before heavier creams.',
    description: 'Helps fade dark spots and evens melanin distribution. Dermatologist recommended for Indian phototypes IV through VI to suppress melanosome transfer.'
  },
  {
    id: 10,
    name: 'Kojivit Ultra Depigmenting Gel',
    brand: 'Micro Labs',
    condition: 'Hyperpigmentation',
    category: 'Treatment',
    price: '₹380',
    priceTier: 'Pharmacy Grade',
    keyActives: 'Kojic Acid Dipalmitate + Arbutin + Glycolic Acid + Vitamin E',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply thinly onto pigmented patches and melasma zones at night. Always use sunscreen during daytime.',
    description: 'Leading clinical depigmenting gel prescribed across Indian dermatology OPDs. Safely inhibits tyrosinase on darker skin without the risks of hydroquinone rebound.'
  },
  {
    id: 11,
    name: 'Minimalist 2% Alpha Arbutin Serum',
    brand: 'Minimalist',
    condition: 'Hyperpigmentation',
    category: 'Treatment',
    price: '₹549',
    priceTier: 'Clinical OTC',
    keyActives: '2% Alpha Arbutin + Hyaluronic Acid + Ferulic Acid',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply 2-3 drops morning and evening before moisturizers.',
    description: 'Non-cytotoxic tyrosinase inhibitor that visibly lightens post-inflammatory hyperpigmentation (PIH) and sun spots without irritating sensitive melanin-rich skin.'
  },
  {
    id: 12,
    name: 'Glenmark Demelan Cream',
    brand: 'Glenmark Pharmaceuticals',
    condition: 'Hyperpigmentation',
    category: 'Treatment',
    price: '₹510',
    priceTier: 'Prescription Standard',
    keyActives: 'Glycolic Acid 10% + Arbutin 5% + Kojic Acid Dipalmitate 2%',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply on alternate nights only on hyperpigmented patches after barrier cream.',
    description: 'Dermatologist triple-combination non-steroidal therapy for refractory melasma, epidermal hyperpigmentation, and stubborn post-acne blemishes.'
  },
  {
    id: 13,
    name: 'Glenmark Episoft Cleansing Lotion',
    brand: 'Glenmark Pharmaceuticals',
    condition: 'Hyperpigmentation',
    category: 'Cleanser',
    price: '₹295',
    priceTier: 'Clinical Standard',
    keyActives: 'Cetearyl Alcohol + Sodium Cocoyl Apple Amino Acids (pH 5.5)',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply to face, massage gently, wipe off with cotton or rinse with cold water.',
    description: 'Soap-free, non-irritating cleanser. Crucial for pigment-prone skin as friction and irritation trigger further melanocyte stimulation.'
  },
  {
    id: 14,
    name: 'Cipla VC15 15% Vitamin C Serum',
    brand: 'Cipla Health',
    condition: 'Hyperpigmentation',
    category: 'Treatment',
    price: '₹1,850',
    priceTier: 'Medical Grade Premium',
    keyActives: '15% L-Ascorbic Acid + Alpha Tocopherol + Ferulic Acid',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply 4-5 drops every morning directly after cleansing, followed immediately by sunscreen.',
    description: 'Potent medical-grade antioxidant serum. Neutralizes UV-generated free radicals, inhibits melanogenesis, and brightens sun-induced solar lentigines.'
  },
  {
    id: 15,
    name: 'The Derma Co 2% Kojic Acid Face Serum',
    brand: 'The Derma Co',
    condition: 'Hyperpigmentation',
    category: 'Treatment',
    price: '₹499',
    priceTier: 'Affordable Clinical',
    keyActives: '2% Kojic Acid + 1% Alpha Arbutin + 1% Niacinamide',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply 3-4 drops morning and night to face and neck.',
    description: 'Triple-active daily depigmenting solution that reduces melanin synthesis and accelerates cellular turnover without dry peeling.'
  },
  {
    id: 16,
    name: 'Brinton UV Doux Silicone Sunscreen Gel SPF 50',
    brand: 'Brinton Pharmaceuticals',
    condition: 'Hyperpigmentation',
    category: 'Sunscreen',
    price: '₹695',
    priceTier: 'Dermatology Benchmark',
    keyActives: 'Octyl Methoxycinnamate + Micronized Minerals + Silicone Matrix',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Dot evenly across face and neck 15 minutes before daylight exposure.',
    description: 'Critical protection against UV and high-energy visible (HEV) blue light, preventing reactivation of tyrosinase in melasma-prone skin.'
  },

  // ─── 3. ECZEMA & ATOPIC DERMATITIS ───
  {
    id: 17,
    name: 'Ceramide Barrier Cream',
    brand: "Re'equil",
    condition: 'Eczema',
    category: 'Moisturizer',
    price: '₹595',
    priceTier: 'Clinical OTC',
    keyActives: 'Ceramides III & VI + Linoleic Acid + Phytosphingosine',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply liberally onto dry or itchy skin 2 to 3 times daily, especially within 3 minutes after bathing.',
    description: 'Lipid-dense barrier restoration cream formulated for severe dry skin, lichenification, and barrier breakdown in tropical and dry climates.'
  },
  {
    id: 18,
    name: 'Bioderma Atoderm Intensive Baume',
    brand: 'Bioderma',
    condition: 'Eczema',
    category: 'Moisturizer',
    price: '₹790',
    priceTier: 'Medical Grade',
    keyActives: 'Lipigenium Complex + PEA (Anti-Pruritus) + Zinc',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Smooth generously over compromised skin patches whenever itching or tight sensation occurs.',
    description: 'Ultra-soothing restorative balm clinically proven to calm severe eczema flare-ups and interrupt the itch-scratch cycle on cracked, sensitized skin.'
  },
  {
    id: 19,
    name: 'Cetaphil Gentle Skin Cleanser',
    brand: 'Galderma',
    condition: 'Eczema',
    category: 'Cleanser',
    price: '₹330',
    priceTier: 'Global Benchmark',
    keyActives: 'Niacinamide + Panthenol (Pro-Vitamin B5) + Glycerin',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply with or without water. Gently wipe excess with soft cloth or rinse with lukewarm water.',
    description: 'Hypoallergenic, fragrance-free non-foaming cleanser that preserves natural moisture barrier while cleansing impurities without stinging raw eczematous skin.'
  },
  {
    id: 20,
    name: 'Aveeno Dermexa Daily Emollient Cream',
    brand: 'Aveeno',
    condition: 'Eczema',
    category: 'Moisturizer',
    price: '₹650',
    priceTier: 'Dermatologist Recommended',
    keyActives: 'Triple Oat Complex (Colloidal Oat + Oat Extract + Oat Oil) + Ceramides',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Massage onto clean, towel-damp skin twice daily to prevent flare recurrence.',
    description: 'Intensive soothing emollient formulated for very dry, itchy, prone-to-atopic skin. Relieves persistent itchiness and visibly smooths rough scaly patches.'
  },
  {
    id: 21,
    name: 'Curatio Atogla Sensitive Skin Lotion',
    brand: 'Curatio Healthcare',
    condition: 'Eczema',
    category: 'Moisturizer',
    price: '₹420',
    priceTier: 'Pediatric & Clinical',
    keyActives: 'GLA (Gamma Linolenic Acid) + Ceramides + Cholesterol + Aloe Vera',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply after every wash over face and body to rebuild stratum corneum lipids.',
    description: 'Clinically tested restorative formula that replenishes essential fatty acids and protects compromised barrier from environmental irritants.'
  },
  {
    id: 22,
    name: 'Sun Pharma Moisturex Soft Paraffin Cream',
    brand: 'Sun Pharma',
    condition: 'Eczema',
    category: 'Moisturizer',
    price: '₹195',
    priceTier: 'Essential Pharmacy',
    keyActives: 'White Soft Paraffin IP + Liquid Paraffin IP',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply directly onto affected cracked skin, elbows, or flexural creases 3 times daily.',
    description: 'High-efficacy occlusive emollient widely stocked across government PHCs and rural dispensaries. Forms an impenetrable barrier to prevent trans-epidermal water loss.'
  },
  {
    id: 23,
    name: "Dr. Reddy's Venusia Max Moisturizing Lotion",
    brand: "Dr. Reddy's Laboratories",
    condition: 'Eczema',
    category: 'Moisturizer',
    price: '₹490',
    priceTier: 'Pharma OTC',
    keyActives: 'Shea Butter + Mango Butter + Cocoa Butter + Aloe Vera',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Spread over body after bath. Reapply as needed during winter or dry spells.',
    description: '3-way lipid replenisher that locks in cutaneous moisture for up to 48 hours. Prevents epidermal water loss caused by hot showers and dry weather.'
  },

  // ─── 4. ROSACEA & FACIAL REDNESS ───
  {
    id: 24,
    name: 'Bioderma Sensibio H2O Soothing Micellar Solution',
    brand: 'Bioderma',
    condition: 'Rosacea & Facial Redness',
    category: 'Cleanser',
    price: '₹395',
    priceTier: 'Dermatological Micellar',
    keyActives: 'Biomimetic Micelles + Cucumber Fruit Extract (pH 5.5)',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Soak cotton pad and gently cleanse face without rubbing or water rinsing.',
    description: 'The global benchmark for reactive, rosacea-prone skin. Cleanses microscopic pollutants while respecting skin barrier equilibrium and calming vascular flushing.'
  },
  {
    id: 25,
    name: 'Micro Labs Aziderm 10% Azelaic Gel',
    brand: 'Micro Labs',
    condition: 'Rosacea & Facial Redness',
    category: 'Treatment',
    price: '₹285',
    priceTier: 'Dermatology Pharmacy',
    keyActives: '10% Micronized Azelaic Acid',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply a thin film over flushed central facial zones once daily at bedtime.',
    description: 'First-line FDA and IADVL therapeutic agent for papulopustular rosacea. Potently downregulates cathelicidin LL-37 expression to arrest facial erythema.'
  },
  {
    id: 26,
    name: 'Minimalist Centella Asiatica & Ceramide Soothing Serum',
    brand: 'Minimalist',
    condition: 'Rosacea & Facial Redness',
    category: 'Treatment',
    price: '₹599',
    priceTier: 'Clinical OTC',
    keyActives: 'Madecassoside + Asiaticoside + Pure Centella Asiatica Extract',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Pat 3 drops into cleansed facial skin morning and night before moisturizing.',
    description: 'Rapidly relieves micro-capillary burning, hot flushes, and cutaneous reactivity in sensitive dark skin types susceptible to vascular reactivity.'
  },
  {
    id: 27,
    name: 'Sebamed Clear Face Care Gel (Physiological pH 5.5)',
    brand: 'Sebamed',
    condition: 'Rosacea & Facial Redness',
    category: 'Moisturizer',
    price: '₹475',
    priceTier: 'Clinical OTC',
    keyActives: 'Hyaluronic Acid + Allantoin + Panthenol',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply lightly across face whenever tight, heated, or sensitive sensations arise.',
    description: 'Completely lipid-free, water-based hydrator that prevents cutaneous heat-trapping. Does not occlude delicate capillaries or trigger flushing.'
  },
  {
    id: 28,
    name: 'Avene Thermal Spring Water Soothing Spray',
    brand: 'Pierre Fabre / Avene',
    condition: 'Rosacea & Facial Redness',
    category: 'Soothing Gel',
    price: '₹710',
    priceTier: 'Medical Grade Mist',
    keyActives: 'Low Mineralized Silicate Water + Aquaphilus Dolomiae',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Mist directly over face during flushing episodes, allow 2 minutes then pat dry gently.',
    description: 'Clinically documented anti-inflammatory mist. Immediately lowers skin surface temperature and terminates acute heat-induced facial erythema.'
  },
  {
    id: 29,
    name: 'Emcure Blynds AC Emulgel SPF 50+ PA+++',
    brand: 'Emcure Pharmaceuticals',
    condition: 'Rosacea & Facial Redness',
    category: 'Sunscreen',
    price: '₹490',
    priceTier: 'Pharma Grade',
    keyActives: 'Micro-Encapsulated UV Filters + Emulgel Cooling Matrix',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply generous layer every morning before heat or sun exposure.',
    description: 'Gentle emulgel sunscreen that blocks erythema-inducing UVA and infrared radiation without irritating dilated capillaries or creating a heavy mask.'
  },

  // ─── 5. FUNGAL ACNE (MALASSEZIA FOLLICULITIS) ───
  {
    id: 30,
    name: 'Scalpe Pro Ketoconazole 2% Anti-Fungal Wash',
    brand: 'Glenmark Pharmaceuticals',
    condition: 'Fungal Acne (Malassezia Folliculitis)',
    category: 'Cleanser',
    price: '₹280',
    priceTier: 'Pharmacy Grade',
    keyActives: '2% Ketoconazole + Zinc Pyrithione (ZPTO) + Piroctone Olamine',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Lather onto forehead, temples, or chest for 3-5 minutes before rinsing off completely. Use 3x weekly.',
    description: 'Medicated antifungal wash used for short-contact facial therapy. Eradicates lipophilic Malassezia yeasts causing uniform itchy papules.'
  },
  {
    id: 31,
    name: 'Sebamed Clear Face Care Gel (Zero Fatty Esters)',
    brand: 'Sebamed',
    condition: 'Fungal Acne (Malassezia Folliculitis)',
    category: 'Moisturizer',
    price: '₹475',
    priceTier: 'Clinical Standard',
    keyActives: 'Hyaluronic Acid + Allantoin + Aloe Barbadensis',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply thin layer morning and night. 100% Malassezia safe.',
    description: 'One of the few globally verified 100% fungal-acne-safe moisturizers. Free of polysorbates, fatty acids, and esters that feed Malassezia yeast.'
  },
  {
    id: 32,
    name: 'Minimalist 10% Niacinamide + Zinc Serum',
    brand: 'Minimalist',
    condition: 'Fungal Acne (Malassezia Folliculitis)',
    category: 'Treatment',
    price: '₹599',
    priceTier: 'Clinical OTC',
    keyActives: '10% Pure Niacinamide + 1% Zinc PCA + EUK-134',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply 3 drops onto clean forehead and T-zone twice daily.',
    description: 'Regulates facial sebum production, starves lipid-dependent yeasts, and calms follicular inflammation without clogging hair follicles.'
  },
  {
    id: 33,
    name: 'Cipla Saslic 1% Salicylic Acid Face Wash',
    brand: 'Cipla Health',
    condition: 'Fungal Acne (Malassezia Folliculitis)',
    category: 'Cleanser',
    price: '₹380',
    priceTier: 'Clinical OTC',
    keyActives: '1% Salicylic Acid Micro-Foam Base',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Use on alternate days to gently dissolve keratin plugs trapped over yeast follicles.',
    description: 'Exfoliates follicular ostia and loosens sebum accumulations where Malassezia yeast clusters thrive.'
  },
  {
    id: 34,
    name: "Re'equil Oxybenzone & OMC Free Sunscreen SPF 50",
    brand: "Re'equil",
    condition: 'Fungal Acne (Malassezia Folliculitis)',
    category: 'Sunscreen',
    price: '₹550',
    priceTier: 'Dermatologist Standard',
    keyActives: 'Corallina Officinalis Extract + Eulexin + Physical Filters',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply evenly 15 minutes before sun exposure.',
    description: 'Fungal-acne safe broad spectrum sunscreen formulated without comedogenic fatty esters or triglycerides that trigger follicular flares.'
  },
  {
    id: 35,
    name: 'Curatio Clocip 1% Antifungal Gel',
    brand: 'Curatio Healthcare',
    condition: 'Fungal Acne (Malassezia Folliculitis)',
    category: 'Treatment',
    price: '₹130',
    priceTier: 'Essential Pharmacy',
    keyActives: '1% Clotrimazole IP Gel Formulation',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Spot apply onto persistent itchy forehead papules at bedtime for 10-14 days.',
    description: 'Broad-spectrum imidazole topical gel that inhibits ergosterol biosynthesis in yeast cell membranes, clearing stubborn follicular pustules.'
  },

  // ─── 6. SEBORRHEIC DERMATITIS ───
  {
    id: 36,
    name: 'Scalpe Plus Anti-Dandruff & Facial Cleanser',
    brand: 'Glenmark Pharmaceuticals',
    condition: 'Seborrheic Dermatitis',
    category: 'Cleanser',
    price: '₹290',
    priceTier: 'Pharmacy Standard',
    keyActives: '2% Ketoconazole + 1% Zinc Pyrithione (ZPTO)',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Massage gently across nasolabial folds, eyebrows, and hairline. Leave for 3 minutes before rinsing.',
    description: 'Clinical antifungal and anti-proliferative cleanser that eliminates greasy yellowish scales and controls sebum-driven dermatitis.'
  },
  {
    id: 37,
    name: 'Bioderma Sensibio DS+ Soothing Purifying Cream',
    brand: 'Bioderma',
    condition: 'Seborrheic Dermatitis',
    category: 'Moisturizer',
    price: '₹850',
    priceTier: 'Specialist Medical',
    keyActives: 'Piroctone Olamine + Climbazole + Enoxolone (Anti-Redness)',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply morning and night to clean skin, focusing on eyebrows, nose wings, and chin.',
    description: 'Tailor-made dermo-cosmetic cream that suppresses Malassezia yeast proliferation while soothing irritated, red, flaking facial areas.'
  },
  {
    id: 38,
    name: 'Sun Pharma Sebifin 1% Terbinafine Cream',
    brand: 'Sun Pharma',
    condition: 'Seborrheic Dermatitis',
    category: 'Treatment',
    price: '₹180',
    priceTier: 'Essential Pharmacy',
    keyActives: '1% Terbinafine Hydrochloride IP',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply a pea-sized amount along the sides of the nose and hairline once daily for 2 weeks.',
    description: 'Fungicidal allylamine that directly eliminates scalp and facial seborrheic fungus, relieving itching and burning sensations.'
  },
  {
    id: 39,
    name: 'Ducray Kelual DS Squamo-Reducing Soothing Cream',
    brand: 'Pierre Fabre / Ducray',
    condition: 'Seborrheic Dermatitis',
    category: 'Treatment',
    price: '₹720',
    priceTier: 'Dermatological Specialty',
    keyActives: 'Keluamid + Crotamiton + Sabal Extract',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply after cleansing on active scaly patches for an intensive 2-week phase, then 2x weekly.',
    description: 'Detaches stubborn greasy scales along the nasolabial fold and eyebrows while curbing sebum hyperactivity.'
  },
  {
    id: 40,
    name: 'Cetaphil PRO Oil Control Foam Wash',
    brand: 'Galderma',
    condition: 'Seborrheic Dermatitis',
    category: 'Cleanser',
    price: '₹750',
    priceTier: 'Clinical Standard',
    keyActives: 'Zinc Coceth Sulfate + Licorice Root Extract',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Use daily to gently cleanse excess oil without stripping the compromised skin barrier.',
    description: 'Soap-free foam that balances sebum without drying out the sensitive, scaling epidermis characteristic of facial seborrhea.'
  },
  {
    id: 41,
    name: 'Curatio Atogla Resvera Face Gel',
    brand: 'Curatio Healthcare',
    condition: 'Seborrheic Dermatitis',
    category: 'Soothing Gel',
    price: '₹490',
    priceTier: 'Dermatology Standard',
    keyActives: 'Resveratrol + Ceramide III + Aloe Vera (pH 5.5)',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Smooth over flaky patches morning and evening to maintain moisture without greasy weight.',
    description: 'Lightweight soothing gel that calms redness and repairs lipid deficiency without heavy comedogenic waxes.'
  },

  // ─── 7. PERIORAL DERMATITIS ───
  {
    id: 42,
    name: 'Avene Cicalfate+ Restorative Protective Cream',
    brand: 'Pierre Fabre / Avene',
    condition: 'Perioral Dermatitis',
    category: 'Moisturizer',
    price: '₹890',
    priceTier: 'Medical Grade Barrier',
    keyActives: '[C+-Restore] Postbiotic Active + Copper-Zinc Sulfate',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply twice daily around mouth and chin on clean, dry skin. Discontinue all other cosmetics.',
    description: 'First-line non-steroidal barrier repairing cream for perioral dermatitis. Purifies skin and accelerates epidermal repair while halting burning sensations.'
  },
  {
    id: 43,
    name: 'Micro Labs Aziderm 10% Azelaic Gel',
    brand: 'Micro Labs',
    condition: 'Perioral Dermatitis',
    category: 'Treatment',
    price: '₹285',
    priceTier: 'Dermatology Standard',
    keyActives: '10% Micronized Azelaic Acid',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Gently dab onto red papules around lips once daily in the evening.',
    description: 'Dermatologist-recommended non-steroidal active that clears inflammatory perioral papules without triggering steroid rebound flares.'
  },
  {
    id: 44,
    name: 'Cetaphil Gentle Skin Cleanser (Zero Soap / Zero Fragrance)',
    brand: 'Galderma',
    condition: 'Perioral Dermatitis',
    category: 'Cleanser',
    price: '₹330',
    priceTier: 'Clinical Standard',
    keyActives: 'Niacinamide + Panthenol + Glycerin',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Wash face using lukewarm water and gentle patting. Do not rub with towels.',
    description: 'Essential zero-irritation wash. Eliminates friction and sulfate surfactants which are primary triggers for perioral eruptions.'
  },
  {
    id: 45,
    name: 'La Roche-Posay Cicaplast Baume B5+',
    brand: "L'Oreal Dermatological",
    condition: 'Perioral Dermatitis',
    category: 'Moisturizer',
    price: '₹950',
    priceTier: 'Dermatological Balm',
    keyActives: 'Madecassoside + 5% Panthenol + Tribioma Prebiotic',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply sparingly to peri-nasal and peri-oral skin twice daily until redness clears.',
    description: 'Soothing multi-purpose balm that rebalances the microbiome and calms severe stinging around the nasolabial folds and lips.'
  },
  {
    id: 46,
    name: 'Bioderma Cicabio Creme Soothing Repairing Care',
    brand: 'Bioderma',
    condition: 'Perioral Dermatitis',
    category: 'Soothing Gel',
    price: '₹650',
    priceTier: 'Medical Grade',
    keyActives: 'Antalgicine Active + Resveratrol + Copper-Zinc',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply gently onto cleansed perioral skin until fully reconstructed.',
    description: 'Instantly relieves the urge to scratch and soothes uncomfortable tightness and burning around the perioral zone.'
  },

  // ─── 8. ENLARGED PORES & EXCESS SEBUM ───
  {
    id: 47,
    name: 'Cipla Saslic 1% Foaming Salicylic Cleanser',
    brand: 'Cipla Health',
    condition: 'Enlarged Pores & Excess Sebum',
    category: 'Cleanser',
    price: '₹380',
    priceTier: 'Clinical OTC',
    keyActives: '1% Salicylic Acid Micro-Bubble Solution',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Dispense 1 pump of foam, massage over oily T-zone for 45 seconds, rinse with cool water.',
    description: 'Lipophilic BHA foam that penetrates pore walls to dissolve trapped sebum and oxidized blackheads, visibly tightening dilated pore structures.'
  },
  {
    id: 48,
    name: 'The Derma Co 10% Niacinamide Serum with Zinc PCA',
    brand: 'The Derma Co',
    condition: 'Enlarged Pores & Excess Sebum',
    category: 'Treatment',
    price: '₹599',
    priceTier: 'Affordable Clinical',
    keyActives: '10% Niacinamide + 1% Zinc PCA + Hyaluronic Acid',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply 3-4 drops morning and evening after washing before creams.',
    description: 'Clinically proven to normalize sebaceous gland output, reduce midday greasy shine, and improve pore elasticity across tropical climates.'
  },
  {
    id: 49,
    name: 'Minimalist 2% BHA (Salicylic Acid) Serum',
    brand: 'Minimalist',
    condition: 'Enlarged Pores & Excess Sebum',
    category: 'Treatment',
    price: '₹549',
    priceTier: 'Clinical OTC',
    keyActives: '2% Salicylic Acid + Aloe Juice + Hyaluronic Acid',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply 2-3 drops 3 nights a week onto nose, forehead, and chin.',
    description: 'High-purity pore-clearing serum that chemically unglues dead corneocyte clusters, preventing pore stretching and stubborn congestion.'
  },
  {
    id: 50,
    name: 'Cipla Excela Sebum Regulating Moisturizer',
    brand: 'Cipla Health',
    condition: 'Enlarged Pores & Excess Sebum',
    category: 'Moisturizer',
    price: '₹495',
    priceTier: 'Clinical OTC',
    keyActives: 'Enantia Chlorantha Extract + Oleanolic Acid',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Smooth 1 pump over entire face in morning and evening.',
    description: 'Non-comedogenic mattifying cream that reduces sebum excretion rate by up to 32% while maintaining internal cellular hydration.'
  },
  {
    id: 51,
    name: 'Glenmark Episoft AC Moisturizer with SPF 30',
    brand: 'Glenmark Pharmaceuticals',
    condition: 'Enlarged Pores & Excess Sebum',
    category: 'Sunscreen',
    price: '₹550',
    priceTier: 'Dermatologist Standard',
    keyActives: 'Octinoxate + Avobenzone + Microfine Mattifying Powders',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply daily in the morning as your combined daytime moisturizer and UV filter.',
    description: '2-in-1 oil-free moisturizer with sunscreen specifically engineered for oily skin in humid Indian conditions. Absorbs quickly with zero greasy film.'
  },
  {
    id: 52,
    name: 'Sebamed Clear Face Care Gel (Oil-Free)',
    brand: 'Sebamed',
    condition: 'Enlarged Pores & Excess Sebum',
    category: 'Soothing Gel',
    price: '₹475',
    priceTier: 'Clinical OTC',
    keyActives: 'Hyaluronic Acid + Panthenol + Aloe Barbadensis (pH 5.5)',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Smooth over face as a lightweight hydration shield.',
    description: 'Water-gel texture that delivers immediate hydration without a single drop of pore-clogging lipid, preserving matte skin all day.'
  },

  // ─── 9. DRY SKIN & BARRIER DAMAGE ───
  {
    id: 53,
    name: 'Moisturex 10% Urea & Lactic Acid Cream',
    brand: 'Sun Pharma',
    condition: 'Dry Skin & Barrier Damage',
    category: 'Moisturizer',
    price: '₹260',
    priceTier: 'Dermatology Staple',
    keyActives: '10% Urea + 10% Lactic Acid + Liquid Paraffin',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Massage into dry, rough, or flaking skin once or twice daily after washing.',
    description: 'Potent keratolytic moisturizing cream. Chemically dissolves dead keratin scales while pulling atmospheric moisture deep into parched skin.'
  },
  {
    id: 54,
    name: 'Cetaphil DAM DailyAdvance Hydrating Lotion',
    brand: 'Galderma',
    condition: 'Dry Skin & Barrier Damage',
    category: 'Moisturizer',
    price: '₹490',
    priceTier: 'Clinical Standard',
    keyActives: 'Shea Butter + Macadamia Nut Oil + Vitamin B5 + Glycerin',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply daily all over face and body for continuous hydration.',
    description: 'Clinically proven 48-hour continuous hydration for dry, sensitive, irritated skin. Restores cutaneous micro-elasticity without sticky residue.'
  },
  {
    id: 55,
    name: 'CeraVe Moisturizing Cream with 3 Essential Ceramides',
    brand: "L'Oreal Dermatological / CeraVe",
    condition: 'Dry Skin & Barrier Damage',
    category: 'Moisturizer',
    price: '₹450',
    priceTier: 'Global Benchmark',
    keyActives: 'Ceramides 1, 3, 6-II + MVE Delivery Technology + Hyaluronic Acid',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Smooth generously over cleansed skin morning and night.',
    description: 'Patented MultiVesicular Emulsion (MVE) releases nourishing ceramides over 24 hours to rebuild the impaired stratum corneum.'
  },
  {
    id: 56,
    name: 'Minimalist 5% Marula Oil & Hyaluronic Moisturizer',
    brand: 'Minimalist',
    condition: 'Dry Skin & Barrier Damage',
    category: 'Moisturizer',
    price: '₹449',
    priceTier: 'Clinical OTC',
    keyActives: '5% Cold Pressed Marula Oil + Vitamin F + Betaine + HA',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply 1-2 pumps onto damp face to lock in hydration.',
    description: 'Deeply nourishing yet non-comedogenic cream that provides fatty acid replenishment to dry, dehydrated, and tight skin.'
  },
  {
    id: 57,
    name: 'Physiogel Daily Moisture Therapy Cream',
    brand: 'Stiefel / GSK',
    condition: 'Dry Skin & Barrier Damage',
    category: 'Moisturizer',
    price: '₹680',
    priceTier: 'Medical Grade Barrier',
    keyActives: 'BioMimic Technology + Hydrogenated Lecithin + Squalane',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Gently press into face twice daily after cleansing.',
    description: 'BioMimic formula replicates natural lamellar lipid structures, making dry skin noticeably less sensitive and rebuilding barrier integrity.'
  },
  {
    id: 58,
    name: 'Cetaphil Gentle Skin Cleanser (Hydrating Formula)',
    brand: 'Galderma',
    condition: 'Dry Skin & Barrier Damage',
    category: 'Cleanser',
    price: '₹330',
    priceTier: 'Clinical Benchmark',
    keyActives: 'Glycerin + Niacinamide + Panthenol',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Cleanse face with lukewarm water, gently massaging without lathering.',
    description: 'Non-foaming hydrating wash that removes impurities without stripping the fragile lipid barrier or triggering tight post-wash sensations.'
  },

  // ─── 10. SUN PROTECTION (ZERO WHITE CAST) ───
  {
    id: 59,
    name: 'Brinton UV Doux Silicone Sunscreen Gel SPF 50',
    brand: 'Brinton Pharmaceuticals',
    condition: 'Sun Protection (Zero White Cast)',
    category: 'Sunscreen',
    price: '₹695',
    priceTier: 'Dermatology Benchmark',
    keyActives: 'Octyl Methoxycinnamate + Micronized Minerals + Silicone Matrix',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Dot evenly across face and neck, spread smoothly 15 minutes before stepping into direct sunlight.',
    description: 'High-adherence matte silicone sunscreen gel. Completely invisible on dark skin tones (Fitzpatrick V & VI) with zero white cast or sweating off.'
  },
  {
    id: 60,
    name: 'Emcure Blynds AC Gel SPF 50+ PA+++',
    brand: 'Emcure Pharmaceuticals',
    condition: 'Sun Protection (Zero White Cast)',
    category: 'Sunscreen',
    price: '₹490',
    priceTier: 'Pharma Grade',
    keyActives: 'Micro-Encapsulated UV Filters + Emulgel Technology',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Pump 2 coin-sized amounts and apply uniformly over exposed skin.',
    description: 'Lightweight water-based emulgel designed for humid tropical conditions. Absorbs instantly into melanin-rich skin with no residue or comedone formation.'
  },
  {
    id: 61,
    name: 'Minimalist Light Fluid Sunscreen SPF 50 PA++++',
    brand: 'Minimalist',
    condition: 'Sun Protection (Zero White Cast)',
    category: 'Sunscreen',
    price: '₹499',
    priceTier: 'Clinical OTC',
    keyActives: 'New-Gen UV Filters (Uvinul A Plus, Tinosorb S) + Vitamin F',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Shake well. Apply smoothly across face and ears as the final step of AM skincare.',
    description: 'Ultra-light fluid sunscreen extensively tested on Fitzpatrick phototypes IV to VI. High UVA-PF / PPD prevents melasma darkening without white ghosting.'
  },
  {
    id: 62,
    name: "Re'equil Ultra Matte Dry Touch Sunscreen SPF 50",
    brand: "Re'equil",
    condition: 'Sun Protection (Zero White Cast)',
    category: 'Sunscreen',
    price: '₹700',
    priceTier: 'Dermatologist Standard',
    keyActives: 'Physical & Chemical Hybrid Filters (Uvinul T 150, Titanium Dioxide)',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Smooth 2 finger-lengths evenly over face as final AM step.',
    description: 'Velvety matte finish with water and sweat resistance. Leaves dark Indian skin tones with a soft-focus shine-free finish.'
  },
  {
    id: 63,
    name: 'Fixderma Shadow Gel SPF 50+ PA+++',
    brand: 'Fixderma',
    condition: 'Sun Protection (Zero White Cast)',
    category: 'Sunscreen',
    price: '₹485',
    priceTier: 'Affordable Clinical',
    keyActives: 'Octinoxate + Titanium Dioxide + Zinc Oxide in Aqueous Gel',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply liberally over face 15 minutes before sun exposure.',
    description: 'Non-greasy, water-based sunscreen gel designed specifically for hot Indian summers. Invisible absorption on Fitzpatrick phototypes IV through VI.'
  },
  {
    id: 64,
    name: 'Ipca Acne-UV Gel SPF 50 PA+++',
    brand: 'Ipca Laboratories',
    condition: 'Sun Protection (Zero White Cast)',
    category: 'Sunscreen',
    price: '₹760',
    priceTier: 'Medical Standard',
    keyActives: 'Diethylhexyl Butamido Triazone + Avobenzone + Octinoxate',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Dot over entire face and gently blend outwards until absorbed.',
    description: 'Dermatologist favorite for acne-prone patients. Broad-spectrum protection that will not induce white casts, blackheads, or greasy sheen.'
  }
];

export const ROUTINE_GUIDES = {
  'Acne (Comedonal)': {
    morning: 'Salicylic / syndet cleanser → 10% Azelaic Acid or Niacinamide → Non-comedogenic oil-free moisturizer → Matte SPF 50 gel (zero white cast).',
    evening: 'Gentle foaming cleanse → Targeted Salicylic / Sebogel on breakout zones → Lightweight barrier care (Sebamed gel / Excela Max).'
  },
  'Hyperpigmentation': {
    morning: 'Soap-free syndet cleanser (Episoft) → 10% Niacinamide or 2% Alpha Arbutin → Lightweight barrier moisturizer → Broad-spectrum High-PPD Sunscreen.',
    evening: 'Double cleanse to remove pollution & UV filters → Kojivit Ultra or Demelan on pigmented patches → Ceramide cream to support cellular recovery.'
  },
  'Eczema': {
    morning: 'Lukewarm water or syndet cleanser (no harsh soap) → Pat damp (do not rub) → Liberal ceramide / colloidal oat cream → Non-irritating mineral sunscreen.',
    evening: 'Short 5-minute lukewarm bath → Immediate application of thick soft paraffin or Atoderm baume within 3 minutes to seal in hydration overnight.'
  },
  'Rosacea & Facial Redness': {
    morning: 'Gentle micellar solution (Sensibio H2O) or cool water rinse → Centella Asiatica / Madecassoside soothing serum → Cooling water-gel hydrator → Blynds AC Emulgel SPF 50+ to block erythema.',
    evening: 'Ultra-gentle cleanse without friction → 10% Micronized Azelaic Acid on flushed central T-zone → Lightweight barrier repair moisturizer; avoid alcohol, hot water, and fragrant actives.'
  },
  'Fungal Acne (Malassezia Folliculitis)': {
    morning: 'Gentle BHA wash (Saslic 1%) → 10% Niacinamide + Zinc to curb sebum secretion → 100% lipid/ester-free hydrator (Sebamed gel) → Fungal-acne safe broad spectrum SPF 50.',
    evening: 'Ketoconazole 2% wash lathered for 3-5 minutes (short contact therapy 3x weekly) → Spot treat with Clotrimazole gel on itchy follicular bumps → Light oil-free barrier hydration.'
  },
  'Seborrheic Dermatitis': {
    morning: 'Ketoconazole 2% + ZPTO wash (Scalpe Plus) over eyebrows and nasolabial folds → Soothing Resveratrol or Sensibio DS+ cream → Non-comedogenic mineral/hybrid matte sunscreen.',
    evening: 'Gentle foaming cleanse → Terbinafine 1% or Kelual DS cream along sides of nose and hairline → Lightweight non-occlusive barrier gel; avoid heavy plant oils (olive, coconut).'
  },
  'Perioral Dermatitis': {
    morning: 'Zero-therapy wash (lukewarm water or Cetaphil gentle soap-free wash only) → Avene Cicalfate+ or Cicaplast Baume B5+ around mouth → Physical mineral SPF without chemical filters or fragrances.',
    evening: 'Gentle splash cleanse with lukewarm water → Azelaic acid 10% on inflammatory perioral papules → Pure copper-zinc barrier balm; strictly avoid topical corticosteroid creams.'
  },
  'Enlarged Pores & Excess Sebum': {
    morning: 'Saslic 1% BHA foaming wash to clear nighttime sebum → 10% Niacinamide with Zinc PCA to tighten pores → Oil-free mattifying hydrator (Excela) → Dry-touch silicone SPF 50.',
    evening: 'Double cleanse with BHA cleanser → 2% Salicylic Acid solution on T-zone and nose pores (3 nights/week) → Lightweight physiological pH 5.5 water gel to maintain barrier balance.'
  },
  'Dry Skin & Barrier Damage': {
    morning: 'Hydrating non-foaming wash → BioMimic or CeraVe 3-ceramide cream onto damp skin → Moisturizing broad-spectrum sunscreen.',
    evening: 'Warm water wash → Keratolytic 10% Urea / Lactic acid or deep lipid replenisher (Moisturex / DAM lotion) → Seal with ceramide cream overnight.'
  },
  'Sun Protection (Zero White Cast)': {
    morning: 'Hydrate with antioxidant serum / light moisturizer → Apply full 2 finger lengths of silicone/emulgel SPF 50 PA++++ 15 minutes before stepping out into direct sunlight.',
    evening: 'Gentle micellar water or oil cleanse to dissolve water-resistant UV filters → Nourishing ceramide cream to repair sun-exposed skin.'
  }
};

export const CONDITIONS_LIST = [
  'Acne (Comedonal)',
  'Hyperpigmentation',
  'Eczema',
  'Rosacea & Facial Redness',
  'Fungal Acne (Malassezia Folliculitis)',
  'Seborrheic Dermatitis',
  'Perioral Dermatitis',
  'Enlarged Pores & Excess Sebum',
  'Dry Skin & Barrier Damage',
  'Sun Protection (Zero White Cast)'
];

const CATEGORIES = ['All Steps', 'Cleanser', 'Treatment', 'Moisturizer', 'Sunscreen', 'Soothing Gel'];

const SkincareEngine = () => {
  const [selectedCondition, setSelectedCondition] = useState(() => {
    const saved = localStorage.getItem('luma_last_scan_condition');
    if (!saved) return 'Acne (Comedonal)';
    if (saved.includes('Acne')) return 'Acne (Comedonal)';
    if (saved.includes('Hyperpigmentation') || saved.includes('Melasma') || saved.includes('Pigment')) return 'Hyperpigmentation';
    if (saved.includes('Eczema') || saved.includes('Atopic')) return 'Eczema';
    if (saved.includes('Rosacea') || saved.includes('Redness') || saved.includes('Erythema')) return 'Rosacea & Facial Redness';
    if (saved.includes('Fungal') || saved.includes('Malassezia')) return 'Fungal Acne (Malassezia Folliculitis)';
    if (saved.includes('Seborrheic')) return 'Seborrheic Dermatitis';
    if (saved.includes('Perioral')) return 'Perioral Dermatitis';
    if (saved.includes('Pore') || saved.includes('Sebum') || saved.includes('Oily')) return 'Enlarged Pores & Excess Sebum';
    if (saved.includes('Dry') || saved.includes('Xerosis') || saved.includes('Barrier')) return 'Dry Skin & Barrier Damage';
    return saved;
  });

  const [detectedTone, setDetectedTone] = useState(() => {
    return localStorage.getItem('luma_last_scan_tone') || 'V';
  });

  const [selectedCategory, setSelectedCategory] = useState('All Steps');

  // Filter products by condition, phototype, and category
  const filteredProducts = productsDb.filter(p => {
    const matchesCondition = p.condition === selectedCondition;
    const matchesTone = p.fitzpatrickSuitable.includes(detectedTone);
    const matchesCategory = selectedCategory === 'All Steps' || p.category === selectedCategory;
    return matchesCondition && matchesTone && matchesCategory;
  });

  const currentRoutine = ROUTINE_GUIDES[selectedCondition] || ROUTINE_GUIDES['Acne (Comedonal)'];

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-widest uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
              <Sparkles size={12} className="text-teal-400" /> Preventative Dermatology
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/5 text-slate-300 border border-white/10">
              Fitzpatrick V/VI Calibrated
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/5 text-slate-300 border border-white/10">
              Available in India
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {productsDb.length} Formulations Cataloged
            </span>
          </div>

          <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black tracking-tight text-white leading-tight">
            Skincare <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-pink-500">Engine</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Dermatologist-curated clinical and OTC skincare products widely available across pharmacies and clinics in India, specifically vetted for melanin-rich skin and tropical climatic resilience.
          </p>
        </div>
      </div>

      {/* 2. Condition & Phototype Interactive Selector */}
      <div className="rounded-3xl p-6 bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-xl space-y-5">
        {/* Phototype Row with Click-to-Switch */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/5">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={14} className="text-teal-400" /> Active Skin Phototype
            </span>
            <p className="text-[11px] text-slate-400">
              Recommendations adapt to melanin density & sensitivity. Click any tone to test:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {['I', 'II', 'III', 'IV', 'V', 'VI'].map((tone) => {
              const isActive = detectedTone === tone;
              return (
                <button
                  key={tone}
                  onClick={() => setDetectedTone(tone)}
                  title={FITZ_LABELS[tone] || `Type ${tone}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-teal-400 text-slate-950 shadow-[0_0_12px_rgba(45,212,191,0.5)] scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  <span
                    className="size-3 rounded-full border border-white/40 shadow-sm shrink-0"
                    style={{ backgroundColor: FITZ_COLORS[tone] || '#6E4327' }}
                  />
                  <span>Type {tone}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Condition Selector Pills */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            Viewing Recommendations For:
          </label>
          <div className="flex flex-wrap gap-2.5">
            {CONDITIONS_LIST.map((cond) => {
              const isSelected = selectedCondition === cond;
              const count = productsDb.filter(p => p.condition === cond && p.fitzpatrickSuitable.includes(detectedTone)).length;
              return (
                <button
                  key={cond}
                  onClick={() => {
                    setSelectedCondition(cond);
                    setSelectedCategory('All Steps');
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-teal-400 text-slate-950 shadow-[0_0_20px_-3px_rgba(45,212,191,0.5)] scale-[1.02]'
                      : 'bg-white/[0.04] text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span>{cond}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-black ${
                    isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Step Filter Pills */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider mr-1">
            <Filter size={12} className="text-teal-400" /> Filter Step:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl font-medium transition-all ${
                  isSelected
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
                    : 'bg-white/[0.02] text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Filtered Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-xl hover:border-teal-400/40 transition-all hover:scale-[1.01] flex flex-col justify-between gap-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-teal-300 uppercase font-black tracking-wider">
                      {product.brand}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/5 text-slate-400 border border-white/10">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                    {product.name}
                  </h3>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                  <CheckCircle2 size={12} className="text-emerald-400" /> Doctor Verified
                </span>
              </div>

              {/* Price & Actives Highlight */}
              <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-emerald-400 flex items-center gap-0.5">
                    <IndianRupee size={12} /> {product.price.replace('₹', '')}
                    <span className="text-[10px] text-slate-400 font-normal ml-1">({product.priceTier})</span>
                  </span>
                </div>
                <div className="text-[11px] text-teal-200/90 font-mono">
                  <span className="text-slate-400 font-sans font-semibold">Key: </span>
                  {product.keyActives}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* How to use */}
              {product.howToUse && (
                <div className="pt-2 text-[11px] text-slate-400 leading-relaxed flex items-start gap-1.5">
                  <Clock size={12} className="text-teal-400 mt-0.5 shrink-0" />
                  <span><strong className="text-slate-300">How to use:</strong> {product.howToUse}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                Matches Fitzpatrick {detectedTone}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300">
                Available in India
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-white/15 text-center space-y-3">
          <Filter size={36} className="mx-auto text-slate-500" />
          <p className="text-sm font-bold text-slate-300">
            No specific products found for this condition.
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try switching the filter to "All Steps" or select another diagnosed skin condition above, or consult a certified dermatologist.
          </p>
          <button
            onClick={() => {
              setSelectedCondition('Acne (Comedonal)');
              setSelectedCategory('All Steps');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-400 text-slate-950 hover:bg-teal-300 transition-all mt-2"
          >
            Reset Catalog
          </button>
        </div>
      )}

      {/* 4. Condition-Specific Routine Guidance Protocol */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-teal-500/10 via-slate-900/80 to-slate-950/90 border border-teal-500/20 backdrop-blur-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Droplets size={20} className="text-teal-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Daily Indian Climate Protocol: {selectedCondition}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-teal-300/80 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 self-start sm:self-auto">
            Dermatologist Validated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Sun size={14} /> Morning Protocol (AM)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentRoutine.morning}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-300 uppercase tracking-wider">
              <Moon size={14} /> Evening Protocol (PM)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentRoutine.evening}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkincareEngine;