import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import History from '../views/History';
import * as historyService from '../services/historyService';

vi.mock('../services/historyService', () => ({
  getHistory: vi.fn(),
  clearHistory: vi.fn()
}));

describe('History', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state correctly', async () => {
    historyService.getHistory.mockResolvedValue([]);
    render(<History />);
    expect(await screen.findByText('No scans saved yet.')).toBeInTheDocument();
  });

  it('renders list of scans', async () => {
    historyService.getHistory.mockResolvedValue([
      { id: '1', date: new Date().toISOString(), condition: 'Acne', severity: 'mild', tone: 'V', image: '' }
    ]);
    render(<History />);
    expect(await screen.findByText('Acne')).toBeInTheDocument();
  });
});
