import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import SkincareEngine from '../views/SkincareEngine';
import { BrowserRouter } from 'react-router-dom';

describe('SkincareEngine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders filtered products based on matching condition and tone', () => {
    localStorage.setItem('luma_last_scan_condition', 'Acne (Comedonal)');
    localStorage.setItem('luma_last_scan_tone', 'V');
    
    render(
      <BrowserRouter>
        <SkincareEngine />
      </BrowserRouter>
    );
    
    // Should render Salicylic Acid product
    expect(screen.getByText('Minimalist 2% Salicylic Acid')).toBeInTheDocument();
  });

  it('handles empty state gracefully when no match exists', () => {
    localStorage.setItem('luma_last_scan_condition', 'NonexistentCondition');
    localStorage.setItem('luma_last_scan_tone', 'I');
    
    render(
      <BrowserRouter>
        <SkincareEngine />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/No specific products found/i)).toBeInTheDocument();
  });
});
