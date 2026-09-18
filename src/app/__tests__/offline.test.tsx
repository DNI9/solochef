import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import OfflinePage from '../offline/page';

describe('Offline Fallback Page', () => {
  it('renders offline title and helpful message', () => {
    render(<OfflinePage />);
    expect(screen.getByRole('heading', { name: /offline/i })).toBeTruthy();
    expect(
      screen.getByText(/your saved meal plans and grocery lists are still safe/i)
    ).toBeTruthy();
  });

  it('provides navigation link back to the meal planner', () => {
    render(<OfflinePage />);
    const link = screen.getByRole('link', { name: /return to meal planner/i });
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/');
  });
});
