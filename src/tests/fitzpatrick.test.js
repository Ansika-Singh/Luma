import { describe, it, expect } from 'vitest';
import { 
  FITZ_COLORS, 
  CONDITION_META, 
  calculateToneMetrics, 
  rgbToHsv 
} from '../lib/fitzpatrick';

describe('Fitzpatrick Diagnostic Intelligence Engine', () => {
  it('defines swatches for Fitzpatrick Phototypes I through VI', () => {
    expect(FITZ_COLORS.I).toBeDefined();
    expect(FITZ_COLORS.II).toBeDefined();
    expect(FITZ_COLORS.III).toBeDefined();
    expect(FITZ_COLORS.IV).toBeDefined();
    expect(FITZ_COLORS.V).toBeDefined();
    expect(FITZ_COLORS.VI).toBeDefined();
  });

  it('calculates dark-skin tone uncertainty and engages melanin-corrected pipeline for Type V and VI', () => {
    const metricsV = calculateToneMetrics('V', 'daylight');
    expect(metricsV.isDarkSkin).toBe(true);
    expect(metricsV.toneUncertainty).toBeGreaterThanOrEqual(20);
    expect(metricsV.pipelineEngaged).toContain('Melanin-Corrected');

    const metricsVI = calculateToneMetrics('VI', 'daylight');
    expect(metricsVI.isDarkSkin).toBe(true);

    const metricsI = calculateToneMetrics('I', 'daylight');
    expect(metricsI.isDarkSkin).toBe(false);
    expect(metricsI.toneUncertainty).toBeLessThanOrEqual(15);
  });

  it('provides clinical operator directives and contagion metadata for Scabies, Eczema, Tinea, Vitiligo', () => {
    expect(CONDITION_META['Scabies'].contagionRisk).toBe('HIGH');
    expect(CONDITION_META['Scabies'].risk).toBe('HIGH');
    expect(CONDITION_META['Scabies'].directive).toContain('Permethrin');

    expect(CONDITION_META['Eczema'].risk).toBe('MEDIUM');
    expect(CONDITION_META['Eczema'].directive).toContain('emollient');

    expect(CONDITION_META['Tinea Ringworm'].directive).toContain('Clotrimazole');
    expect(CONDITION_META['Vitiligo'].directive).toContain('sun protection');
  });

  it('correctly converts RGB to HSV', () => {
    const [h, s, v] = rgbToHsv(255, 0, 0); // Pure Red
    expect(h).toBe(0);
    expect(s).toBe(1);
    expect(v).toBe(1);
  });
});
