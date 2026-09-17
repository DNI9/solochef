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

  it('switches tabs', () => {
    render(<Page />);
    // Initial tab is plan
    expect(screen.getAllByText('Breakfast').length).toBeGreaterThan(0);
    
    // Click groceries
    fireEvent.click(screen.getByText('Groceries'));
    expect(screen.getByText('🛒 Weekly Haul')).toBeTruthy();
  });
});
