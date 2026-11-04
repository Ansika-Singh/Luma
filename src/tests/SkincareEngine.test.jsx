import { render, screen, fireEvent } from '@testing-library/react';
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
    
    // Multiple products should render for Acne
    expect(screen.getByRole('heading', { name: 'Minimalist 2% Salicylic Acid' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Sebogel/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Aziderm/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Excela Max/i })).toBeInTheDocument();
  });

  it('switches condition and renders multiple products for hyperpigmentation and eczema', () => {
    render(
      <BrowserRouter>
        <SkincareEngine />
      </BrowserRouter>
    );
    
    // Switch to Hyperpigmentation
    const hyperpigmentationBtn = screen.getByRole('button', { name: /Hyperpigmentation/i });
    fireEvent.click(hyperpigmentationBtn);
    
    expect(screen.getByRole('heading', { name: /Niacinamide 10% Serum/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Kojivit Ultra/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Alpha Arbutin/i })).toBeInTheDocument();

    // Switch to Eczema
    const eczemaBtn = screen.getByRole('button', { name: /Eczema/i });
    fireEvent.click(eczemaBtn);
    
    expect(screen.getByRole('heading', { name: /Ceramide Barrier Cream/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Bioderma Atoderm/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Cetaphil Gentle Skin Cleanser/i })).toBeInTheDocument();
  });

  it('filters by category routine step', () => {
    localStorage.setItem('luma_last_scan_condition', 'Acne (Comedonal)');
    render(
      <BrowserRouter>
        <SkincareEngine />
      </BrowserRouter>
    );

    // Click Sunscreen filter
    const sunscreenBtn = screen.getByRole('button', { name: /^Sunscreen$/i });
    fireEvent.click(sunscreenBtn);

    expect(screen.getByRole('heading', { name: /Re'equil Ultra Matte/i })).toBeInTheDocument();
    // Cleanser should be filtered out
    expect(screen.queryByRole('heading', { name: 'Minimalist 2% Salicylic Acid' })).not.toBeInTheDocument();
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
