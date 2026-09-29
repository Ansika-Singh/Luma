import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SkinAnalysis from '../views/SkinAnalysis';
import * as mlService from '../services/mlService';
import * as historyService from '../services/historyService';

vi.mock('../services/mlService', () => ({
  loadModel: vi.fn().mockResolvedValue(true),
  analyzeSkinImage: vi.fn().mockResolvedValue({
    condition: 'Hyperpigmentation',
    severity: 'mild',
    confidence: 0.95,
    explanation: 'Test'
  }),
  estimateFitzpatrick: vi.fn().mockReturnValue({ type: 'V', hex: '#ff0000' })
}));

vi.mock('../services/historyService', () => ({
  saveScan: vi.fn()
}));

// Mock CameraCapture since we can't get real userMedia in tests easily
vi.mock('../components/CameraCapture', () => ({
  default: ({ onCapture }) => (
    <button onClick={() => onCapture('data:image/jpeg;base64,mock')}>Mock Capture</button>
  )
}));

describe('SkinAnalysis Round 2 Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    };
    global.alert = vi.fn();
  });

  it('handles offline model load failure gracefully', async () => {
    mlService.loadModel.mockRejectedValueOnce(new Error('ModelNotAvailableOffline'));
    render(<SkinAnalysis />);
    // The background load catch should fire, we can't easily assert the console.log without mocking console,
    // but we can assert the component doesn't crash.
    expect(screen.getByText(/Skin Analysis/i)).toBeInTheDocument();
  });

  it('runs E2E flow and explicitly propagates overridden tone to saveScan', async () => {
    // 1. We mock the image onload so it resolves immediately
    global.Image = class {
      constructor() {
        setTimeout(() => this.onload(), 10);
      }
    };

    render(<SkinAnalysis />);
    
    // Simulate capture
    fireEvent.click(screen.getByText('Mock Capture'));
    
    // Wait for inference results
    await waitFor(() => {
      expect(screen.getByText('Hyperpigmentation')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Type V')).toBeInTheDocument();
    });
    
    // Override tone
    fireEvent.change(screen.getByLabelText(/Fitzpatrick skin tone override/i), { target: { value: 'IV' } });
    
    // Click Save
    const saveButton = screen.getByRole('button', { name: /Save & Continue/i });
    fireEvent.click(saveButton);
    
    // Assert saveScan was called with the OVERRIDDEN tone, not the original 'V'
    await waitFor(() => {
      expect(historyService.saveScan).toHaveBeenCalledWith(expect.objectContaining({
        tone: 'IV',
        condition: 'Hyperpigmentation'
      }));
    });
  });

  it('returns to capture step if image onload times out', async () => {
    // Mock image to NEVER fire onload
    global.Image = class {
      constructor() {}
    };

    render(<SkinAnalysis />);
    
    // Use fake timers to trigger the 15-second Promise.race timeout quickly
    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Mock Capture'));
    
    expect(screen.getByText(/Analyzing Image/i)).toBeInTheDocument();
    
    // Fast forward 16 seconds
    vi.advanceTimersByTime(16000);
    vi.useRealTimers();
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Analysis timed out'));
      // Returns to capture screen
      expect(screen.getByText('Mock Capture')).toBeInTheDocument();
    });
  });
});
