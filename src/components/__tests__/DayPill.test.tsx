import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DayPill from '../DayPill';

describe('DayPill', () => {
  it('renders correct text', () => {
    render(<DayPill day="Monday" active={false} onClick={() => {}} />);
    expect(screen.getByText('MON')).toBeTruthy();
  });

  it('applies active classes', () => {
    render(<DayPill day="Monday" active={true} onClick={() => {}} />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-zinc-900');
  });

  it('fires onClick', () => {
    const handleClick = vi.fn();
    render(<DayPill day="Monday" active={false} onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
