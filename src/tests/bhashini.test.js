import { describe, it, expect } from 'vitest';
import { LANGUAGES, STRINGS, t } from '../lib/bhashini';

describe('Bhashini Multilingual Localization & Speech Module', () => {
  it('supports all 7 Indian languages from DermAI', () => {
    const codes = LANGUAGES.map(l => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('hi');
    expect(codes).toContain('mr');
    expect(codes).toContain('ta');
    expect(codes).toContain('te');
    expect(codes).toContain('bn');
    expect(codes).toContain('gu');
    expect(LANGUAGES.length).toBe(7);
  });

  it('correctly translates keys across multiple languages', () => {
    expect(t('start_diagnosis', 'en')).toBe('Start DermAI Triage');
    expect(t('start_diagnosis', 'hi')).toBe('डर्मएआई जांच शुरू करें');
    expect(t('start_diagnosis', 'mr')).toBe('डर्मएआय तपासणी सुरू करा');
    expect(t('start_diagnosis', 'bn')).toBe('ট্রায়াজ শুরু করুন');
  });

  it('includes 7-question clinical triage strings', () => {
    expect(STRINGS['question_1']).toBeDefined();
    expect(STRINGS['question_2']).toBeDefined();
    expect(STRINGS['question_3']).toBeDefined();
    expect(STRINGS['question_4']).toBeDefined();
    expect(STRINGS['question_5']).toBeDefined();
    expect(STRINGS['question_6']).toBeDefined();
    expect(STRINGS['question_7']).toBeDefined();
  });

  it('falls back gracefully to English or raw key if unknown', () => {
    expect(t('nonexistent_key_xyz', 'en')).toBe('nonexistent_key_xyz');
  });
});
