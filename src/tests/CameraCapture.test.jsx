import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CameraCapture from '../components/CameraCapture';

// Mock matchMedia and other globals if needed
beforeEach(() => {
  vi.clearAllMocks();
});

describe('CameraCapture Round 2', () => {
  it('falls back to file upload when enumerateDevices returns no video inputs', async () => {
    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        enumerateDevices: vi.fn().mockResolvedValue([{ kind: 'audioinput' }]),
        getUserMedia: vi.fn().mockRejectedValue(new Error('Should not be called')),
      },
      writable: true,
    });

    render(<CameraCapture onCapture={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/Camera not available/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /upload photo/i })).toBeInTheDocument();
    });
  });

  it('falls back to file upload when getUserMedia throws permission error', async () => {
    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        enumerateDevices: vi.fn().mockResolvedValue([{ kind: 'videoinput' }]),
        getUserMedia: vi.fn().mockRejectedValue(new DOMException('Permission denied', 'NotAllowedError')),
      },
      writable: true,
    });

    render(<CameraCapture onCapture={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/Could not access camera/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /upload photo/i })).toBeInTheDocument();
    });
  });
});
