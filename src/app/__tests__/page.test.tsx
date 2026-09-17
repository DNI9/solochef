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

  it('toggles grocery items', () => {
    render(<Page />);
    
    // Click groceries tab
    fireEvent.click(screen.getByText('Groceries'));
    
    const eggsItem = screen.getByText('1 Dozen Eggs');
    expect(eggsItem).toBeTruthy();
    
    // Check initial state (no line-through)
    expect(eggsItem.className).not.toContain('line-through');
    
    // Click to toggle
    fireEvent.click(eggsItem);
    
    // Check if toggled state (line-through added)
    expect(eggsItem.className).toContain('line-through');
    
    // Click again to untoggle
    fireEvent.click(eggsItem);
    expect(eggsItem.className).not.toContain('line-through');
  });

  it('switches to import tab and shows copy button', () => {
    render(<Page />);
    fireEvent.click(screen.getByText('Import'));
    expect(screen.getByText('🔄 Import Plan')).toBeTruthy();
    expect(screen.getByText('Copy LLM Schema')).toBeTruthy();
  });
});
