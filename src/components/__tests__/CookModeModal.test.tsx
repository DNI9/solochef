import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CookModeModal } from '../CookModeModal';

// Mock hook
vi.mock('../../hooks/useCookTimer', () => ({
  useCookTimer: vi.fn(() => ({
    timeLeft: 60,
    isRunning: false,
    start: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    formatTime: () => `01:00`
  }))
}));

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
    ingredients: []
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
    
    // Simulate document becoming hidden then visible
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    fireEvent(document, new Event('visibilitychange'));
    
    expect(wakeLockRequestMock).toHaveBeenCalledTimes(2);
  });

  it('renders steps and timer for steps with duration', () => {
    render(<CookModeModal meal={mockMeal} onClose={() => {}} />);
    
    expect(screen.getByText('Chop veggies.')).toBeTruthy();
    expect(screen.getByText('Cook for 1 minute.')).toBeTruthy();
    
    // It should render a timer button for the second step
    const timerButton = screen.getByRole('button', { name: /01:00/i });
    expect(timerButton).toBeTruthy();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<CookModeModal meal={mockMeal} onClose={handleClose} />);
    
    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
