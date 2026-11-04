import { useState } from 'react';
import { Search, Sparkles, CheckCircle2, Sun, Moon, Droplets } from 'lucide-react';
import { FITZ_COLORS } from '../lib/fitzpatrick';

const productsDb = [
  {
    id: 1,
    name: 'Minimalist 2% Salicylic Acid',
    brand: 'Minimalist',
    condition: 'Acne (Comedonal)',
    fitzpatrickSuitable: ['V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    description: 'A gentle yet effective BHA cleanser. Proven efficacy on darker skin tones without causing post-inflammatory hyperpigmentation.'
  },
  {
    id: 2,
    name: 'Niacinamide 10% Serum',
    brand: 'Plum Goodness',
    condition: 'Hyperpigmentation',
    fitzpatrickSuitable: ['IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    description: 'Helps fade dark spots and evening melanin distribution. Dermatologist recommended for Indian phototypes IV through VI.'
  },
  {
    id: 3,
    name: 'Ceramide Barrier Cream',
    brand: "Re'equil",
    condition: 'Eczema',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    description: 'Lipid-dense barrier restoration cream formulated for severe dry skin, lichenification, and barrier breakdown in tropical climates.'
  }
];

const SkincareEngine = () => {
  const [selectedCondition, setSelectedCondition] = useState(() => {
    return localStorage.getItem('luma_last_scan_condition') || 'Acne (Comedonal)';
  });
  const [detectedTone] = useState(() => {
    return localStorage.getItem('luma_last_scan_tone') || 'V';
  });

  const filteredProducts = productsDb.filter(p => 
    p.condition === selectedCondition && 
    p.fitzpatrickSuitable.includes(detectedTone)
  );

  const conditionsList = ['Acne (Comedonal)', 'Hyperpigmentation', 'Eczema'];

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
          </div>

          <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black tracking-tight text-white leading-tight">
            Skincare <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-pink-500">Engine</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Based on your latest scan (Fitzpatrick Type {detectedTone} detected), here are dermatologist-validated products available in India.
          </p>
        </div>
      </div>

      {/* 2. Condition & Phototype Selector */}
      <div className="rounded-3xl p-6 bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            Viewing recommendations for:
          </label>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Detected Skin Tone:</span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white font-bold">
              <span
                className="size-3 rounded-full border border-white/40"
                style={{ backgroundColor: FITZ_COLORS[detectedTone] || '#6E4327' }}
              />
              Type {detectedTone}
            </span>
          </div>
        </div>

        {/* Condition Pills */}
        <div className="flex flex-wrap gap-2.5">
          {conditionsList.map((cond) => {
            const isSelected = selectedCondition === cond;
            return (
              <button
                key={cond}
                onClick={() => setSelectedCondition(cond)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-teal-400 text-slate-950 shadow-[0_0_20px_-3px_rgba(45,212,191,0.5)] scale-[1.02]'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {cond}
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
                <div>
                  <span className="text-[11px] font-mono text-teal-300 uppercase font-bold tracking-wider">
                    {product.brand}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                    {product.name}
                  </h3>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                  <CheckCircle2 size={12} className="text-emerald-400" /> Doctor Verified
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                Matches Fitzpatrick V/VI
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
          <Search size={36} className="mx-auto text-slate-500" />
          <p className="text-sm font-bold text-slate-300">
            No specific products found for this condition.
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try selecting another diagnosed skin condition or consult a certified dermatologist.
          </p>
        </div>
      )}

      {/* 4. Routine Guidance Strip */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-teal-500/10 via-slate-900/80 to-slate-950/90 border border-teal-500/20 backdrop-blur-2xl shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <Droplets size={20} className="text-teal-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            Daily Indian Climate Barrier Repair Protocol
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase">
              <Sun size={14} /> Morning Protocol (AM)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gentle pH-balanced hydrating cleanser → Active treatment (Niacinamide / Azelaic) → Broad-spectrum gel/matte sunscreen SPF 50 PA++++ without white cast.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-300 uppercase">
              <Moon size={14} /> Evening Protocol (PM)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Double cleanse to remove pollution & sweat → Targeted exfoliant (Salicylic 2% on alternate days) → Ceramide barrier repair cream to seal moisture overnight.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkincareEngine;
