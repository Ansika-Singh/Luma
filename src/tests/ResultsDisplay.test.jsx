import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResultsDisplay from '../components/ResultsDisplay';

describe('ResultsDisplay', () => {
  it('renders disclaimer unconditionally', () => {
    render(<ResultsDisplay condition="Acne" severity="mild" confidence={0.855} explanation="Test" imageSrc="" />);
    expect(screen.getByText(/DISCLAIMER/i)).toBeInTheDocument();
  });

  it('renders confidence score accurately', () => {
    render(<ResultsDisplay condition="Acne" severity="mild" confidence={0.855} explanation="Test" imageSrc="" />);
    expect(screen.getByText(/85\.\d%|85%|86%/)).toBeInTheDocument();
  });

  it('renders placeholder when imageSrc is empty and renders image when imageSrc is provided', () => {
    const { rerender } = render(<ResultsDisplay condition="Eczema" severity="mild" confidence={0.9} explanation="Test" imageSrc="" />);
    expect(screen.getByText(/No scan image preview available/i)).toBeInTheDocument();

    rerender(<ResultsDisplay condition="Eczema" severity="mild" confidence={0.9} explanation="Test" imageSrc="data:image/png;base64,sample" />);
    expect(screen.getByAltText(/Scan Result/i)).toBeInTheDocument();
  });
});
