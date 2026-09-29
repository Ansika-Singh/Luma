import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EscalationAlert from '../components/EscalationAlert';

describe('EscalationAlert', () => {
  it('renders correct tier for mild severity', () => {
    render(<EscalationAlert severity="mild" condition="Acne" />);
    expect(screen.getByText('Tier 1: Routine Care')).toBeInTheDocument();
    expect(screen.getByText(/Condition can likely be managed with OTC/i)).toBeInTheDocument();
  });

  it('renders correct tier for moderate severity', () => {
    render(<EscalationAlert severity="moderate" condition="Acne" />);
    expect(screen.getByText('Tier 2: Monitor')).toBeInTheDocument();
  });

  it('renders correct tier for severe severity', () => {
    render(<EscalationAlert severity="severe" condition="Acne" />);
    expect(screen.getByText('Tier 3: Consult Required')).toBeInTheDocument();
  });

  it('renders correct tier for urgent severity', () => {
    render(<EscalationAlert severity="urgent" condition="Acne" />);
    expect(screen.getByText('Tier 4: Immediate Action')).toBeInTheDocument();
  });
});
