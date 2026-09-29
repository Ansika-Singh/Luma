import { describe, it, expect } from 'vitest';
import { findNearestPHC, PHC_DIRECTORY } from '../lib/phc';
import { sendReferralSMS, formatReferralSlip } from '../lib/sms';

describe('NHA Health Facility Registry & SMS Referral System', () => {
  it('correctly maps villages to nearest PHCs with HFR codes', () => {
    const wardhaPHC = findNearestPHC('Wardha');
    expect(wardhaPHC.name).toContain('Wardha');
    expect(wardhaPHC.code).toBe('HFR-MH-44213');

    const bhandaraPHC = findNearestPHC('Bhandara');
    expect(bhandaraPHC.name).toContain('Bhandara');
    expect(bhandaraPHC.code).toBe('HFR-MH-44190');
  });

  it('generates formatted clinical referral slips under NHA ABDM guidelines', () => {
    const slip = formatReferralSlip({
      patient: { fullName: 'Suresh Rao', age: '45', sex: 'Male', weight: '65', village: 'Wardha' },
      diagnosis: { condition: 'Scabies', confidence: 94, risk: 'HIGH', fitzpatrick: 'V', directive: 'Permethrin 5% cream.' },
      phc: findNearestPHC('Wardha'),
      clinicalHistory: ['yes', 'yes', 'no']
    });

    expect(slip).toContain('CLINICAL DERMATOLOGY REFERRAL SLIP');
    expect(slip).toContain('Suresh Rao');
    expect(slip).toContain('Scabies');
    expect(slip).toContain('HFR-MH-44213');
  });

  it('dispatches referral SMS and generates tracking ID', async () => {
    const res = await sendReferralSMS('+919372541123', 'Referral Test');
    expect(res.ok).toBe(true);
    expect(res.messageId).toContain('F2SMS-');
    expect(res.sentAt).toBeDefined();
  });
});
