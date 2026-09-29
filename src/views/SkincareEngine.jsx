import { useState } from 'react';
import { Search, Info } from 'lucide-react';

const productsDb = [
  {
    id: 1,
    name: 'Minimalist 2% Salicylic Acid',
    brand: 'Minimalist',
    condition: 'Acne (Comedonal)',
    fitzpatrickSuitable: ['V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    description: 'A gentle yet effective BHA cleanser. Proven efficacy on darker skin tones without causing hyperpigmentation.'
  },
  {
    id: 2,
    name: 'Niacinamide 10% Serum',
    brand: 'Plum Goodness',
    condition: 'Hyperpigmentation',
    fitzpatrickSuitable: ['IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    description: 'Helps fade dark spots and even out skin tone. Dermatologist recommended for Indian skin types.'
  },
  {
    id: 3,
    name: 'Ceramide Barrier Cream',
    brand: "Re'equil",
    condition: 'Eczema',
    fitzpatrickSuitable: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    doctorValidated: true,
    availableInIndia: true,
    description: 'Thick barrier repair cream for severe dry skin and eczema flares.'
  }
];

const SkincareEngine = () => {
  const [selectedCondition, setSelectedCondition] = useState(() => {
    return localStorage.getItem('luma_last_scan_condition') || 'Acne (Comedonal)';
  });
  const [detectedTone, setDetectedTone] = useState(() => {
    return localStorage.getItem('luma_last_scan_tone') || 'V';
  });

  const filteredProducts = productsDb.filter(p => 
    p.condition === selectedCondition && 
    p.fitzpatrickSuitable.includes(detectedTone)
  );

  return (
    <div className="flex flex-col">
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Skincare Engine</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        Based on your latest scan (Fitzpatrick Type {detectedTone} detected), here are dermatologist-validated products available in India.
      </p>
      
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
          Viewing recommendations for:
        </label>
        <select 
          value={selectedCondition} 
          onChange={(e) => setSelectedCondition(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
        >
          <option value="Acne (Comedonal)">Acne (Comedonal)</option>
          <option value="Hyperpigmentation">Hyperpigmentation</option>
          <option value="Eczema">Eczema</option>
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} style={{ padding: '1rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem' }}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>{product.name}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>by {product.brand}</span>
              </div>
              <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckBadgeIcon size={14} /> Doctor Verified
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
              {product.description}
            </p>
            <div className="flex gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span style={{ backgroundColor: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                Matches Fitzpatrick V/VI
              </span>
              <span style={{ backgroundColor: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                Available in India
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Search size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p>No specific products found for this condition.</p>
        </div>
      )}
    </div>
  );
};

// Quick inline icon component to avoid extra imports
const CheckBadgeIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

export default SkincareEngine;
