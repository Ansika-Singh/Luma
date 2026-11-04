import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

  it('provides accessible Upload Photo tab even when camera is active', async () => {
    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        enumerateDevices: vi.fn().mockResolvedValue([{ kind: 'videoinput' }]),
        getUserMedia: vi.fn().mockResolvedValue({
          getTracks: () => [{ stop: vi.fn() }]
        }),
      },
      writable: true,
    });

    const onCaptureMock = vi.fn();
    render(<CameraCapture onCapture={onCaptureMock} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Live Camera/i })).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: /Upload Photo/i })[0]).toBeInTheDocument();
    });

    // Click Upload Photo tab
    const uploadTab = screen.getAllByRole('button', { name: /Upload Photo/i })[0];
    fireEvent.click(uploadTab);

    await waitFor(() => {
      expect(screen.getByText(/Upload Skin or Lesion Photo/i)).toBeInTheDocument();
      expect(screen.getByText(/Safe for Private & Sensitive Areas/i)).toBeInTheDocument();
    });
  });
});
