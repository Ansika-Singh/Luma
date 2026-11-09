import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LumaWorkflow from '../views/LumaWorkflow';
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
          <LumaWorkflow />
        </BrowserRouter>
      </LanguageProvider>
    );

  it('exports backward-compatible DermAIWorkflow component matching LumaWorkflow', () => {
    expect(DermAIWorkflow).toBe(LumaWorkflow);
  });

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

  it('renders Voice Tour card without crashing when clicking Dictate Instructions', () => {
    renderComponent();

    // Find and click the Dictate Instructions button in header
    const dictateButtons = screen.getAllByRole('button', { name: /Dictate Instructions/i });
    expect(dictateButtons.length).toBeGreaterThan(0);

    fireEvent.click(dictateButtons[0]);

    // Tour card should be rendered without any ReferenceError or unmounting
    expect(screen.getByText(/Bhashini TTS/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome to Luma Clinical Intelligence/i)).toBeInTheDocument();
  });

  it('switches entire triage page and voice tour to Hindi when Hindi is selected', () => {
    renderComponent();

    // Find the language selector
    const langSelect = screen.getByLabelText(/Language Selector/i);
    expect(langSelect).toBeInTheDocument();

    // Change to Hindi
    fireEvent.change(langSelect, { target: { value: 'hi' } });

    // Header, badge and details should switch to Hindi
    expect(screen.getAllByText(/रोगी विवरण/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/पूरा नाम/i)).toBeInTheDocument();
  });
});
