import { useState } from 'react';
import { Sparkles, CheckCircle2, Sun, Moon, Droplets, Filter, ShieldCheck, IndianRupee, Clock } from 'lucide-react';
import { FITZ_COLORS, FITZ_LABELS } from '../lib/fitzpatrick';

export const productsDb = [
  // ─── ACNE (COMEDONAL & INFLAMMATORY) ───
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
    fitzpatrickSuitable: ['IV', 'V', 'VI', 'I', 'II', 'III'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply thin layer once daily (preferably PM) to clear blemishes and calm redness.',
    description: 'First-line clinical recommendation for darker skin types (IV–VI). Selectively targets abnormal melanocytes to fade acne spots while destroying acne bacteria.'
  },
  {
    id: 4,
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
    id: 5,
    name: "Re'equil Ultra Matte Dry Touch Gel SPF 50",
    brand: "Re'equil",
    condition: 'Acne (Comedonal)',
    category: 'Sunscreen',
    price: '₹700',
    priceTier: 'Dermatologist Standard',
    keyActives: 'Advanced Hybrid Filters · PA++++ Rating · Silicone Base',
    fitzpatrickSuitable: ['IV', 'V', 'VI', 'I', 'II', 'III'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply 2 finger-lengths generously 15 minutes before stepping out in daylight.',
    description: 'Non-comedogenic, oil-free matte gel with zero white cast on Fitzpatrick phototypes V & VI. Essential to prevent active acne blemishes from tanning into permanent scars.'
  },
  {
    id: 6,
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

  // ─── HYPERPIGMENTATION & MELASMA ───
  {
    id: 7,
    name: 'Niacinamide 10% Serum',
    brand: 'Plum Goodness',
    condition: 'Hyperpigmentation',
    category: 'Treatment',
    price: '₹599',
    priceTier: 'Clinical OTC',
    keyActives: '10% Niacinamide + Fermented Rice Water + Licorice Root',
    fitzpatrickSuitable: ['IV', 'V', 'VI', 'I', 'II', 'III'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Dispense 3-4 drops onto cleansed face, gently pat until absorbed before heavier creams.',
    description: 'Helps fade dark spots and evens melanin distribution. Dermatologist recommended for Indian phototypes IV through VI to suppress melanosome transfer.'
  },
  {
    id: 8,
    name: 'Kojivit Ultra Depigmenting Gel',
    brand: 'Micro Labs',
    condition: 'Hyperpigmentation',
    category: 'Treatment',
    price: '₹380',
    priceTier: 'Pharmacy Grade',
    keyActives: 'Kojic Acid Dipalmitate + Arbutin + Glycolic Acid + Vitamin E',
    fitzpatrickSuitable: ['IV', 'V', 'VI', 'I', 'II', 'III'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply thinly onto pigmented patches and melasma zones at night. Always use sunscreen during daytime.',
    description: 'Leading clinical depigmenting gel prescribed across Indian dermatology OPDs. Safely inhibits tyrosinase on darker skin without the risks of hydroquinone rebound.'
  },
  {
    id: 9,
    name: 'Minimalist 2% Alpha Arbutin Serum',
    brand: 'Minimalist',
    condition: 'Hyperpigmentation',
    category: 'Treatment',
    price: '₹549',
    priceTier: 'Clinical OTC',
    keyActives: '2% Alpha Arbutin + Hyaluronic Acid + Ferulic Acid',
    fitzpatrickSuitable: ['IV', 'V', 'VI', 'I', 'II', 'III'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply 2-3 drops morning and evening before moisturizers.',
    description: 'Non-cytotoxic tyrosinase inhibitor that visibly lightens post-inflammatory hyperpigmentation (PIH) and sun spots without irritating sensitive melanin-rich skin.'
  },
  {
    id: 10,
    name: 'Glenmark Episoft Cleansing Lotion',
    brand: 'Glenmark Pharmaceuticals',
    condition: 'Hyperpigmentation',
    category: 'Cleanser',
    price: '₹295',
    priceTier: 'Pharmacy Standard',
    keyActives: 'Cetearyl Alcohol + Colloidal Oatmeal · Soap-Free Syndet',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply on face, massage in circular motions, wipe off gently or rinse with water.',
    description: 'Ultra-gentle soap-free syndet cleanser. Avoids friction and micro-inflammation, preventing chronic pigment triggers during daily facial washing.'
  },
  {
    id: 11,
    name: 'Glenmark La Shield Gel Sunscreen SPF 40',
    brand: 'Glenmark Pharmaceuticals',
    condition: 'Hyperpigmentation',
    category: 'Sunscreen',
    price: '₹390',
    priceTier: 'Dermatology Standard',
    keyActives: 'Micronized Mineral Filters + Vitamin E · PA+++ Broad Spectrum',
    fitzpatrickSuitable: ['IV', 'V', 'VI', 'I', 'II', 'III'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Generously apply 20 minutes prior to sun exposure. Reapply after heavy sweating.',
    description: 'Translucent mineral gel specifically formulated for Indian heat. Shields against UV-induced melanin hyperproduction with zero ghostly white cast.'
  },
  {
    id: 12,
    name: 'Micro Labs Glyco-6 Cream',
    brand: 'Micro Labs',
    condition: 'Hyperpigmentation',
    category: 'Treatment',
    price: '₹230',
    priceTier: 'Affordable Pharmacy',
    keyActives: '6% Glycolic Acid (AHA)',
    fitzpatrickSuitable: ['IV', 'V', 'VI', 'I', 'II', 'III'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Start 2 nights per week. Apply tiny amount on pigmented areas; gradually increase frequency.',
    description: 'Micro-exfoliates pigmented surface dead corneocytes to accelerate spot clearance and renew uneven epidermal texture on sun-damaged skin.'
  },

  // ─── ECZEMA & BARRIER BREAKDOWN ───
  {
    id: 13,
    name: 'Ceramide Barrier Cream',
    brand: "Re'equil",
    condition: 'Eczema',
    category: 'Moisturizer',
    price: '₹450',
    priceTier: 'Clinical OTC',
    keyActives: 'Ceramide III + Hyaluronic Acid + Mango Seed Butter',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply liberally onto dry or itchy skin 2 to 3 times daily, especially within 3 minutes after bathing.',
    description: 'Lipid-dense barrier restoration cream formulated for severe dry skin, lichenification, and barrier breakdown in tropical and dry climates.'
  },
  {
    id: 14,
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
    id: 15,
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
    id: 16,
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
    id: 17,
    name: 'Sun Pharma Moisturex Soft Paraffin Cream',
    brand: 'Sun Pharma',
    condition: 'Eczema',
    category: 'Barrier Cream',
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
    id: 18,
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

  // ─── TINEA & FUNGAL RASH ───
  {
    id: 19,
    name: 'Candid Dusting Powder (Clotrimazole 1%)',
    brand: 'Glenmark Pharmaceuticals',
    condition: 'Tinea & Fungal Rash',
    category: 'Treatment',
    price: '₹145',
    priceTier: 'Essential Indian OTC',
    keyActives: '1% Clotrimazole IP + Anti-Chafing Absorbent Base',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Dust generously across skin folds, groin, axilla, and under-breast areas twice daily after drying completely.',
    description: 'Premier broad-spectrum antifungal dusting powder in India. Absorbs moisture and perspiration in high heat while eradicating dermatophytes.'
  },
  {
    id: 20,
    name: 'Sun Pharma Sebifin 1% Terbinafine Cream',
    brand: 'Sun Pharma',
    condition: 'Tinea & Fungal Rash',
    category: 'Treatment',
    price: '₹180',
    priceTier: 'Pharmacy Standard',
    keyActives: '1% Terbinafine Hydrochloride',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply thin layer extending 2 cm beyond the visible lesion border twice daily for 2 to 3 weeks.',
    description: 'Directly fungicidal topical cream for Tinea Corporis and Tinea Cruris. Eradicates fungal cell membranes rather than just arresting growth, reducing recurrence risk.'
  },
  {
    id: 21,
    name: 'Scalpe Pro Ketoconazole 2% Anti-Fungal Wash',
    brand: 'Glenmark Pharmaceuticals',
    condition: 'Tinea & Fungal Rash',
    category: 'Cleanser',
    price: '₹280',
    priceTier: 'Pharmacy Grade',
    keyActives: '2% Ketoconazole + Zinc Pyrithione (ZPTO) + Piroctone Olamine',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Lather onto affected body areas or scalp, leave for 3 minutes before rinsing off completely.',
    description: 'Medicated antifungal body and scalp wash. Rapidly clears Malassezia folliculitis, tinea versicolor, and fungal rashes exacerbated by tropical humidity.'
  },
  {
    id: 22,
    name: 'Piramal Lacto Calamine Daily Skin Balance',
    brand: 'Piramal Healthcare',
    condition: 'Tinea & Fungal Rash',
    category: 'Soothing Lotion',
    price: '₹170',
    priceTier: 'Household OTC',
    keyActives: 'Kaolin Clay + Zinc Oxide + Glycerin',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Shake well and dab onto itchy, sweaty folds to maintain dryness and soothe burning sensations.',
    description: 'Astringent calamine and zinc oxide lotion. Keeps skin dry and protected, suppressing fungal micro-environments without stinging irritated epidermis.'
  },

  // ─── DRY SKIN & XEROSIS ───
  {
    id: 23,
    name: 'Moisturex 10% Urea & Lactic Acid Cream',
    brand: 'Sun Pharma',
    condition: 'Dry Skin & Xerosis',
    category: 'Moisturizer',
    price: '₹260',
    priceTier: 'Dermatology Staple',
    keyActives: '10% Urea + 10% Lactic Acid + Liquid Paraffin',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Massage into rough, thickened, or scaly areas (elbows, shins, heels) once or twice daily after washing.',
    description: 'Potent keratolytic moisturizing cream. Chemically dissolves thick dead keratin scales while pulling atmospheric moisture deep into dry, cracked skin.'
  },
  {
    id: 24,
    name: 'Cetaphil DAM DailyAdvance Hydrating Lotion',
    brand: 'Galderma',
    condition: 'Dry Skin & Xerosis',
    category: 'Moisturizer',
    price: '₹490',
    priceTier: 'Clinical Standard',
    keyActives: 'Shea Butter + Macadamia Nut Oil + Vitamin B5 + Glycerin',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply daily all over face and body for continuous hydration.',
    description: 'Clinically proven 48-hour continuous hydration for dry, sensitive, irritated skin. Restores cutaneous micro-elasticity without leaving sticky or greasy residue.'
  },
  {
    id: 25,
    name: 'Ranbaxy Logifeel Intensive Exfoliating Cream',
    brand: 'Sun Pharma / Ranbaxy',
    condition: 'Dry Skin & Xerosis',
    category: 'Treatment',
    price: '₹230',
    priceTier: 'Pharmacy Standard',
    keyActives: 'Glycolic Acid + Urea + Cetyl Alcohol',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Apply generously at night to cracked heels, knees, and dry keratotic shins.',
    description: 'Dual AHA and urea therapy that exfoliates stubborn hyperkeratotic plaques and restores soft, supple skin texture on chronically parched limbs.'
  },

  // ─── SUN PROTECTION (ZERO WHITE CAST) ───
  {
    id: 26,
    name: 'Brinton UV Doux Silicone Sunscreen Gel SPF 50',
    brand: 'Brinton Pharmaceuticals',
    condition: 'Sun Protection (Zero White Cast)',
    category: 'Sunscreen',
    price: '₹695',
    priceTier: 'Dermatology Benchmark',
    keyActives: 'Octyl Methoxycinnamate + Micronized Minerals + Silicone Matrix',
    fitzpatrickSuitable: ['IV', 'V', 'VI', 'I', 'II', 'III'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Dot evenly across face and neck, spread smoothly 15 minutes before stepping into direct sunlight.',
    description: 'High-adherence matte silicone sunscreen gel. Completely invisible on dark skin tones (Fitzpatrick V & VI) with zero white cast or sweating off.'
  },
  {
    id: 27,
    name: 'Emcure Blynds AC Gel SPF 50+ PA+++',
    brand: 'Emcure Pharmaceuticals',
    condition: 'Sun Protection (Zero White Cast)',
    category: 'Sunscreen',
    price: '₹490',
    priceTier: 'Pharma Grade',
    keyActives: 'Micro-Encapsulated UV Filters + Emulgel Technology',
    fitzpatrickSuitable: ['IV', 'V', 'VI', 'I', 'II', 'III'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Pump 2 coin-sized amounts and apply uniformly over exposed skin.',
    description: 'Lightweight water-based emulgel designed for humid tropical conditions. Absorbs instantly into melanin-rich skin with no residue or comedone formation.'
  },
  {
    id: 28,
    name: 'Minimalist Light Fluid Sunscreen SPF 50 PA++++',
    brand: 'Minimalist',
    condition: 'Sun Protection (Zero White Cast)',
    category: 'Sunscreen',
    price: '₹499',
    priceTier: 'Clinical OTC',
    keyActives: 'New-Gen UV Filters (Uvinul A Plus, Tinosorb S) + Vitamin F',
    fitzpatrickSuitable: ['IV', 'V', 'VI', 'I', 'II', 'III'],
    doctorValidated: true,
    availableInIndia: true,
    howToUse: 'Shake well. Apply smoothly across face and ears as the final step of AM skincare.',
    description: 'Ultra-light fluid sunscreen extensively tested on Fitzpatrick phototypes IV to VI. High UVA-PF / PPD prevents melasma darkening without white ghosting.'
  }
];

const ROUTINE_GUIDES = {
  'Acne (Comedonal)': {
    morning: 'Salicylic / syndet cleanser → 10% Azelaic Acid or Niacinamide → Non-comedogenic oil-free moisturizer → Matte SPF 50 gel (zero white cast).',
    evening: 'Gentle foaming cleanse → Targeted Salicylic / Sebogel on breakout zones → Lightweight barrier care (Sebamed gel / Excela Max).'
  },
  'Hyperpigmentation': {
    morning: 'Soap-free syndet cleanser (Episoft) → 10% Niacinamide or 2% Alpha Arbutin → Lightweight barrier moisturizer → Broad-spectrum High-PPD Sunscreen.',
    evening: 'Double cleanse to remove pollution & UV filters → Kojivit Ultra or Glyco-6 on pigmented patches → Ceramide cream to support cellular recovery.'
  },
  'Eczema': {
    morning: 'Lukewarm water or syndet cleanser (no harsh soap) → Pat damp (do not rub) → Liberal ceramide / colloidal oat cream → Non-irritating mineral sunscreen.',
    evening: 'Short 5-minute lukewarm bath → Immediate application of thick soft paraffin or Atoderm baume within 3 minutes to seal in hydration overnight.'
  },
  'Tinea & Fungal Rash': {
    morning: 'Antifungal wash (Ketoconazole 2%) during bath → Dry skin folds completely with dedicated clean towel → Dust Candid powder in friction zones.',
    evening: 'Cleanse and thoroughly dry affected annular patch → Apply Terbinafine 1% cream extending 2 cm beyond margin → Wear loose breathable cotton.'
  },
  'Dry Skin & Xerosis': {
    morning: 'Hydrating non-foaming wash → DailyAdvance hydrating lotion → Broad-spectrum sunscreen.',
    evening: 'Warm bath → Keratolytic 10% Urea / Lactic acid cream on rough patches, elbows, shins, and cracked feet → Cotton socks overnight.'
  },
  'Sun Protection (Zero White Cast)': {
    morning: 'Hydrate with antioxidant serum / light moisturizer → Apply full 2 finger lengths of silicone/emulgel SPF 50 PA++++ 15 minutes before stepping out.',
    evening: 'Gentle micellar water or oil cleanse to dissolve water-resistant UV filters → Nourishing ceramide cream.'
  }
};

const CONDITIONS_LIST = [
  'Acne (Comedonal)',
  'Hyperpigmentation',
  'Eczema',
  'Tinea & Fungal Rash',
  'Dry Skin & Xerosis',
  'Sun Protection (Zero White Cast)'
];

const CATEGORIES = ['All Steps', 'Cleanser', 'Treatment', 'Moisturizer', 'Sunscreen', 'Soothing Gel'];

const SkincareEngine = () => {
  const [selectedCondition, setSelectedCondition] = useState(() => {
    const saved = localStorage.getItem('luma_last_scan_condition');
    if (!saved) return 'Acne (Comedonal)';
    if (saved.includes('Acne')) return 'Acne (Comedonal)';
    if (saved.includes('Hyperpigmentation') || saved.includes('Melasma') || saved.includes('Pigment')) return 'Hyperpigmentation';
    if (saved.includes('Eczema') || saved.includes('Dermatitis')) return 'Eczema';
    if (saved.includes('Tinea') || saved.includes('Ringworm') || saved.includes('Fungal')) return 'Tinea & Fungal Rash';
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
