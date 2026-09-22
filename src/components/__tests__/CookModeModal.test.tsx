import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CookModeModal } from '../CookModeModal';

describe('CookModeModal', () => {
  const mockMeal = {
    title: 'Test Meal',
    type: 'Dinner',
    time: '20m',
    emoji: '🍲',
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    text: 'text-blue-900',
    recipe: [
      'Chop veggies.',
      'Cook for 1 minute.'
    ],
    ingredients: ['1 carrot', '1 tbsp oil']
  };

  let wakeLockRequestMock: ReturnType<typeof vi.fn>;
  let releaseMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    releaseMock = vi.fn().mockResolvedValue(undefined);
    wakeLockRequestMock = vi.fn().mockResolvedValue({ release: releaseMock });

    Object.defineProperty(navigator, 'wakeLock', {
      value: { request: wakeLockRequestMock },
      configurable: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when meal is null', () => {
    const { container } = render(<CookModeModal meal={null} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('requests Wake Lock on mount and releases on unmount', async () => {
    const { unmount } = render(<CookModeModal meal={mockMeal} onClose={() => {}} />);

    expect(wakeLockRequestMock).toHaveBeenCalledWith('screen');

    unmount();

    await vi.waitFor(() => {
      expect(releaseMock).toHaveBeenCalled();
    });
  });

  it('re-requests Wake Lock on visibility change to visible', () => {
    render(<CookModeModal meal={mockMeal} onClose={() => {}} />);

    expect(wakeLockRequestMock).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    fireEvent(document, new Event('visibilitychange'));

    expect(wakeLockRequestMock).toHaveBeenCalledTimes(2);
  });

  it('renders active step 1 and lookahead Up Next step 2', () => {
    render(<CookModeModal meal={mockMeal} onClose={() => {}} />);

    expect(screen.getByText('Chop veggies.')).toBeTruthy();
    expect(screen.getByText(/Active Step 1/i)).toBeTruthy();
    expect(screen.getByText(/Up Next: Step 2/i)).toBeTruthy();
    expect(screen.getByText('Cook for 1 minute.')).toBeTruthy();
  });

  it('navigates to next step and shows timer controls when step has duration', () => {
    render(<CookModeModal meal={mockMeal} onClose={() => {}} />);

    const nextBtn = screen.getByRole('button', { name: /next step/i });
    act(() => {
      fireEvent.click(nextBtn);
    });

    // Now on step 2
    expect(screen.getByText(/Active Step 2/i)).toBeTruthy();
    expect(screen.getByText('Cook for 1 minute.')).toBeTruthy();

    // Start timer button should be visible with 1m
    const startTimerBtn = screen.getByRole('button', { name: /start timer/i });
    expect(startTimerBtn).toBeTruthy();

    // Final step notice
    expect(screen.getByText(/Final step! Almost ready/i)).toBeTruthy();
  });

  it('starts and controls the timer on step with duration', () => {
    vi.useFakeTimers();
    render(<CookModeModal meal={mockMeal} onClose={() => {}} />);

    // Go to step 2 which has 1 minute timer
    const nextBtn = screen.getByRole('button', { name: /next step/i });
    act(() => {
      fireEvent.click(nextBtn);
    });

    const startTimerBtn = screen.getByRole('button', { name: /start timer/i });
    act(() => {
      fireEvent.click(startTimerBtn);
    });

    // Pause button should now be visible
    expect(screen.getByRole('button', { name: /pause/i })).toBeTruthy();

    // Advance 10s
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(screen.getByText('00:50')).toBeTruthy();

    vi.useRealTimers();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<CookModeModal meal={mockMeal} onClose={handleClose} />);

    const closeBtn = screen.getByRole('button', { name: /close/i });
    act(() => {
      fireEvent.click(closeBtn);
    });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('shows finish cooking button on completion and calls onClose', () => {
    const handleClose = vi.fn();
    render(<CookModeModal meal={mockMeal} onClose={handleClose} />);

    // On step 1, click Next Step -> advances to step 2 (last step)
    const nextBtn = screen.getByRole('button', { name: /next step/i });
    act(() => {
      fireEvent.click(nextBtn);
    });

    // Now on last step, button is "Finish Cooking 🎉"
    const finishBtn = screen.getByRole('button', { name: /finish cooking/i });
    expect(finishBtn).toBeTruthy();

    act(() => {
      fireEvent.click(finishBtn);
    });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
