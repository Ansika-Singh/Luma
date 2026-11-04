import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveScan, getHistory, clearHistory } from '../services/historyService';
import localforage from 'localforage';

vi.mock('localforage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn()
  }
}));

describe('historyService', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await clearHistory();
  });

  it('saves and retrieves scan', async () => {
    // Mock the image onload downsampling by mocking Image
    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.width = 100;
          this.height = 100;
          this.onload();
        }, 10);
      }
    };
    
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: vi.fn()
    });
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,mock');

    const scan = await saveScan({
      condition: 'Acne',
      severity: 'mild',
      tone: 'V',
      image: 'data:image/jpeg;base64,original'
    });

    expect(scan.id).toBeDefined();
    expect(scan.image).toBe('data:image/jpeg;base64,mock');

    const history = await getHistory();
    expect(history.length).toBe(1);
    expect(history[0].condition).toBe('Acne');
  });

  it('caps history at 30 scans and evicts the oldest', async () => {
    // Fill up 30 mock scans
    const fillScans = Array.from({ length: 30 }, (_, i) => ({ id: i.toString() }));
    localforage.getItem.mockResolvedValue(fillScans);

    await saveScan({ image: 'img', condition: 'Acne', severity: 'mild', tone: 'III' });
    
    // Check that we retrieved it, added one, and sliced to 30
    expect(localforage.setItem).toHaveBeenCalled();
    const saveCallArg = localforage.setItem.mock.calls[0][1];
    expect(saveCallArg.length).toBe(30);
    // The new scan should be at the front
    expect(saveCallArg[0].condition).toBe('Acne');
  });

  it('throws QUOTA_EXCEEDED when IndexedDB is full', async () => {
    const quotaError = new Error('Full');
    quotaError.name = 'QuotaExceededError';
    localforage.setItem.mockRejectedValueOnce(quotaError);

    await expect(saveScan({ image: 'img', condition: 'Acne', severity: 'mild', tone: 'III' }))
      .rejects.toMatchObject({ code: 'QUOTA_EXCEEDED' });
  });
});
