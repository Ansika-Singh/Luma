import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeSkinImage, validateImageQuality, estimateFitzpatrick } from '../services/mlService';
import * as tf from '@tensorflow/tfjs';

// Mock TFJS layer loading
vi.mock('@tensorflow/tfjs', async () => {
  const actual = await vi.importActual('@tensorflow/tfjs');
  return {
    ...actual,
    loadLayersModel: vi.fn().mockResolvedValue({
      predict: vi.fn().mockReturnValue({
        dataSync: () => new Float32Array([0.9, 0.05, 0.05, 0, 0, 0, 0]),
        dispose: vi.fn()
      })
    }),
    ready: vi.fn().mockResolvedValue(),
    setBackend: vi.fn().mockResolvedValue()
  };
});

describe('mlService Production Hardening', () => {
  it('estimateFitzpatrick correctly estimates phototype from canvas image', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#4A2A1A';
      ctx.fillRect(0, 0, 100, 100);
      const tone = estimateFitzpatrick(canvas);
      expect(tone).toHaveProperty('type');
      expect(tone).toHaveProperty('hex');
      expect(['IV', 'V', 'VI']).toContain(tone.type);
    }
  });
  beforeEach(() => {
    vi.clearAllMocks();
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    };
  });

  it('validateImageQuality throws on extremely dark image (OOD)', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    vi.spyOn(canvas, 'getContext').mockReturnValue({
      getImageData: () => ({
        data: new Uint8ClampedArray(100 * 100 * 4).fill(10) // Too dark
      })
    });
    
    expect(() => validateImageQuality(canvas)).toThrow(/too dark/);
  });

  it('validateImageQuality throws on overexposed image (OOD)', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    vi.spyOn(canvas, 'getContext').mockReturnValue({
      getImageData: () => ({
        data: new Uint8ClampedArray(100 * 100 * 4).fill(250) // Glare
      })
    });
    
    expect(() => validateImageQuality(canvas)).toThrow(/overexposed/);
  });

  it('Memory Leak Stress Test: tensor delta is exactly 0 after 20 loops', async () => {
    const mockImg = document.createElement('img');
    mockImg.width = 224;
    mockImg.height = 224;
    
    const originalCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'canvas') {
        const mockCanvas = {
          width: 224,
          height: 224,
          style: {}
        };
        const mockCtx = {
          canvas: mockCanvas,
          drawImage: vi.fn(),
          getImageData: () => ({
            data: new Uint8ClampedArray(224 * 224 * 4).fill(120) // Normal lighting
          })
        };
        mockCanvas.getContext = () => mockCtx;
        return mockCanvas;
      }
      return originalCreate(tag);
    });

    const initialTensors = tf.memory().numTensors;
    
    for (let i = 0; i < 20; i++) {
      await analyzeSkinImage(mockImg);
    }
    
    const finalTensors = tf.memory().numTensors;
    expect(finalTensors - initialTensors).toBe(0);
  });
});
