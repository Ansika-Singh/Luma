import { describe, it, expect } from 'vitest';
import { 
  LANGUAGES, 
  VOICE_LANGUAGES,
  STRINGS, 
  t, 
  isSupportedLanguage, 
  getLanguageDetails, 
  getSupportedLanguageCodes,
  parseVoiceCommand,
  speakStepGuidance,
  stopSpeaking
} from '../lib/bhashini';

describe('Bhashini Multilingual Localization & Speech Module', () => {
  it('supports all 7 Indian languages', () => {
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
    expect(t('start_diagnosis', 'en')).toBe('Start Clinical Triage');
    expect(t('triage_title', 'en')).toBe('Clinical Triage');
    expect(t('dermai_title', 'en')).toBe('Clinical Triage');
    expect(t('start_diagnosis', 'hi')).toBe('क्लिनिकल जांच शुरू करें');
    expect(t('start_diagnosis', 'mr')).toBe('क्लिनिकल तपासणी सुरू करा');
    expect(t('start_diagnosis', 'bn')).toBe('ট্রায়াজ শুরু করুন');
  });

  it('translates full workflow elements and conditions into medical-grade Hindi', () => {
    expect(t('patient_details', 'hi')).toBe('रोगी विवरण');
    expect(t('patient_history', 'hi')).toBe('नैदानिक इतिहास');
    expect(t('camera_scan', 'hi')).toBe('निर्देशित कैमरा स्कैन');
    expect(t('diagnosis_report', 'hi')).toBe('निदान रिपोर्ट');
    expect(t('yes', 'hi')).toBe('हाँ');
    expect(t('no', 'hi')).toBe('नहीं');
    expect(t('Scabies', 'hi')).toBe('स्केबीज (Scabies)');
    expect(t('Eczema', 'hi')).toBe('एक्जिमा (Eczema)');
    expect(t('cdss_disclaimer_content', 'hi')).toContain('क्लिनिकल डिसीजन सपोर्ट सिस्टम');
  });

  it('defines VOICE_LANGUAGES with English and Hindi active, and 5 Indic languages coming soon', () => {
    expect(VOICE_LANGUAGES).toBeDefined();
    expect(VOICE_LANGUAGES.length).toBe(7);

    const en = VOICE_LANGUAGES.find(v => v.code === 'en');
    const hi = VOICE_LANGUAGES.find(v => v.code === 'hi');
    const mr = VOICE_LANGUAGES.find(v => v.code === 'mr');
    const ta = VOICE_LANGUAGES.find(v => v.code === 'ta');

    expect(en.active).toBe(true);
    expect(hi.active).toBe(true);
    expect(mr.active).toBe(false);
    expect(ta.active).toBe(false);
  });

  it('parses voice commands accurately in Hindi', () => {
    expect(parseVoiceCommand('अगला चरण')).toEqual({ type: 'NEXT_STEP', action: 'next' });
    expect(parseVoiceCommand('आगे बढ़ो')).toEqual({ type: 'NEXT_STEP', action: 'next' });
    expect(parseVoiceCommand('पीछे जाओ')).toEqual({ type: 'PREV_STEP', action: 'back' });
    expect(parseVoiceCommand('हाँ')).toEqual({ type: 'ANSWER', value: 'Yes' });
    expect(parseVoiceCommand('नहीं')).toEqual({ type: 'ANSWER', value: 'No' });
    expect(parseVoiceCommand('पुरुष')).toEqual({ type: 'SET_FIELD', field: 'sex', value: 'Male' });
    expect(parseVoiceCommand('महिला')).toEqual({ type: 'SET_FIELD', field: 'sex', value: 'Female' });
    expect(parseVoiceCommand('फोटो स्कैन करो')).toEqual({ type: 'SCAN_ACTION', action: 'capture' });
    expect(parseVoiceCommand('निर्देश बताओ')).toEqual({ type: 'DICTATE_HELP' });
    expect(parseVoiceCommand('रुको')).toEqual({ type: 'STOP_SPEECH' });
  });

  it('parses voice commands accurately in English', () => {
    expect(parseVoiceCommand('go next')).toEqual({ type: 'NEXT_STEP', action: 'next' });
    expect(parseVoiceCommand('go back')).toEqual({ type: 'PREV_STEP', action: 'back' });
    expect(parseVoiceCommand('yes')).toEqual({ type: 'ANSWER', value: 'Yes' });
    expect(parseVoiceCommand('no')).toEqual({ type: 'ANSWER', value: 'No' });
    expect(parseVoiceCommand('male')).toEqual({ type: 'SET_FIELD', field: 'sex', value: 'Male' });
    expect(parseVoiceCommand('female')).toEqual({ type: 'SET_FIELD', field: 'sex', value: 'Female' });
    expect(parseVoiceCommand('capture photo')).toEqual({ type: 'SCAN_ACTION', action: 'capture' });
    expect(parseVoiceCommand('help me')).toEqual({ type: 'DICTATE_HELP' });
    expect(parseVoiceCommand('stop talking')).toEqual({ type: 'STOP_SPEECH' });
  });

  it('executes speakStepGuidance and stopSpeaking without error', () => {
    expect(() => speakStepGuidance(1, 'en')).not.toThrow();
    expect(() => speakStepGuidance(2, 'hi', { questionKey: 'question_1', questionIndex: 0 })).not.toThrow();
    expect(() => speakStepGuidance(3, 'hi')).not.toThrow();
    expect(() => speakStepGuidance(4, 'hi', { condition: 'Scabies' })).not.toThrow();
    expect(() => stopSpeaking()).not.toThrow();
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

  it('validates supported languages and language details lookup', () => {
    const codes = getSupportedLanguageCodes();
    expect(codes).toHaveLength(7);
    expect(isSupportedLanguage('hi')).toBe(true);
    expect(isSupportedLanguage('unknown')).toBe(false);

    const hindiDetails = getLanguageDetails('hi');
    expect(hindiDetails).toBeDefined();
    expect(hindiDetails?.native).toBe('हिंदी');
    expect(hindiDetails?.locale).toBe('hi-IN');
    expect(getLanguageDetails('nonexistent')).toBeNull();
  });
});
