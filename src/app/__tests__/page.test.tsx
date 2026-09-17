import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Page from '../page';

describe('Page', () => {
  it('renders title and navigation', () => {
    render(<Page />);
    expect(screen.getByText("Solo Chef's Dabba")).toBeTruthy();
    expect(screen.getByText('Plan')).toBeTruthy();
    expect(screen.getByText('Groceries')).toBeTruthy();
  });

  it('shows empty state when no plan is loaded', () => {
    render(<Page />);
    // Initial tab is plan
    expect(screen.getByText('No meal plan found')).toBeTruthy();
    
    // Click groceries
    fireEvent.click(screen.getByText('Groceries'));
    expect(screen.getByText('Empty Cart')).toBeTruthy();
  });

  it('switches to import tab and shows copy button', () => {
    render(<Page />);
    fireEvent.click(screen.getByText('Import'));
    expect(screen.getByText('🔄 Import Plan')).toBeTruthy();
    expect(screen.getByText('Copy LLM Schema')).toBeTruthy();
  });
});
