import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import DermAIWorkflow from '../views/DermAIWorkflow';
import { LanguageProvider } from '../contexts/LanguageContext';

describe('Luma Guided Clinical Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.localStorage.clear();
  });

  const renderComponent = () =>
    render(
      <LanguageProvider>
        <BrowserRouter>
          <DermAIWorkflow />
        </BrowserRouter>
      </LanguageProvider>
    );

  it('renders Step 1: Patient Details intake form', () => {
    renderComponent();
    expect(screen.getByText('Luma Clinical Intelligence')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Patient Details' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ramesh Patil/i)).toBeInTheDocument();
  });

  it('advances through 7-point clinical history questions', () => {
    renderComponent();

    // Fill patient details and advance to Step 2
    fireEvent.change(screen.getByPlaceholderText(/Ramesh Patil/i), {
      target: { value: 'Anita Devi' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Now on Step 2 Question 1
    expect(screen.getByText(/Question 1 of 7/i)).toBeInTheDocument();
    expect(screen.getByText(/How long have you had this skin condition/i)).toBeInTheDocument();

    // Click Yes to advance to Question 2
    fireEvent.click(screen.getByRole('button', { name: /Yes/i }));
    expect(screen.getByText(/Question 2 of 7/i)).toBeInTheDocument();
  });

  it('renders sample lesion selection buttons in scan step', async () => {
    renderComponent();

    // Fill and skip to Step 3
    fireEvent.change(screen.getByPlaceholderText(/Ramesh Patil/i), {
      target: { value: 'Sunil Rao' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Answer 7 questions
    for (let i = 0; i < 7; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Yes/i }));
    }

    // Now on Step 3: Guided Camera Scan
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Guided Camera Scan/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/Scabies/i)).toBeInTheDocument();
    expect(screen.getByText(/Eczema/i)).toBeInTheDocument();
    expect(screen.getByText(/Tinea Ringworm/i)).toBeInTheDocument();
  });
});
