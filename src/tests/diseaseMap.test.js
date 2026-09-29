import { describe, it, expect, beforeEach } from 'vitest';
import { 
  lookupVillage, 
  detectClusters, 
  computeDiseaseStats, 
  recordDiagnosisForMap, 
  getMapRecordsSync, 
  persistMapRecords,
  VILLAGES 
} from '../lib/diseaseMap';

describe('Disease Outbreak Map & Cluster Detection', () => {
  beforeEach(async () => {
    await persistMapRecords([]);
  });

  it('accurately resolves rural Maharashtra village coordinates', () => {
    const bhandara = lookupVillage('Bhandara');
    expect(bhandara).toBeDefined();
    expect(bhandara.lat).toBeCloseTo(21.1667, 2);
    expect(bhandara.lon).toBeCloseTo(79.65, 2);

    const wardha = lookupVillage('Wardha');
    expect(wardha).toBeDefined();
    expect(wardha.district).toBe('Wardha');
  });

  it('triggers cluster outbreak alert when 3 or more cases occur in 72 hours in a village', () => {
    const now = Date.now();
    const mockCases = [
      { id: '1', condition: 'Scabies', village: 'Bhandara', date: new Date(now - 1000 * 3600 * 5).toISOString(), risk: 'HIGH' },
      { id: '2', condition: 'Scabies', village: 'Bhandara', date: new Date(now - 1000 * 3600 * 15).toISOString(), risk: 'HIGH' },
      { id: '3', condition: 'Scabies', village: 'Bhandara', date: new Date(now - 1000 * 3600 * 30).toISOString(), risk: 'HIGH' },
      { id: '4', condition: 'Eczema', village: 'Wardha', date: new Date(now - 1000 * 3600 * 10).toISOString(), risk: 'MEDIUM' }
    ];

    const clusters = detectClusters(mockCases);
    expect(clusters.length).toBe(1);
    expect(clusters[0].village).toBe('Bhandara');
    expect(clusters[0].condition).toBe('Scabies');
    expect(clusters[0].count).toBe(3);
  });

  it('records an anonymous diagnosis without patient PII', async () => {
    const rec = await recordDiagnosisForMap(
      { condition: 'Tinea Ringworm', fitzpatrick: 'V', risk: 'LOW' },
      'Wardha'
    );

    expect(rec.id).toBeDefined();
    expect(rec.village).toBe('Wardha');
    expect(rec.condition).toBe('Tinea Ringworm');
    // Ensure no PII fields exist
    expect(rec.fullName).toBeUndefined();
    expect(rec.age).toBeUndefined();

    const stored = getMapRecordsSync();
    expect(stored.length).toBe(1);
  });

  it('computes summary epidemiological stats', () => {
    const mockCases = [
      { id: '1', condition: 'Scabies', village: 'Bhandara', date: new Date().toISOString(), risk: 'HIGH' },
      { id: '2', condition: 'Scabies', village: 'Bhandara', date: new Date().toISOString(), risk: 'HIGH' },
      { id: '3', condition: 'Scabies', village: 'Bhandara', date: new Date().toISOString(), risk: 'HIGH' },
      { id: '4', condition: 'Vitiligo', village: 'Katol', date: new Date().toISOString(), risk: 'MEDIUM' }
    ];

    const stats = computeDiseaseStats(mockCases);
    expect(stats.totalRecords).toBe(4);
    expect(stats.activeClusters).toBe(1);
    expect(stats.mostCommonCondition).toBe('Scabies');
    expect(stats.mostAffectedVillage).toBe('Bhandara');
  });
});
