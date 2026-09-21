import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCookTimer } from '../useCookTimer';

describe('useCookTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    
    // Mock AudioContext
    window.AudioContext = vi.fn().mockImplementation(() => ({
      createOscillator: vi.fn().mockReturnValue({
        type: 'sine',
        frequency: { setValueAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      }),
      createGain: vi.fn().mockReturnValue({
        gain: { exponentialRampToValueAtTime: vi.fn(), setValueAtTime: vi.fn() },
        connect: vi.fn(),
      }),
      destination: {},
      currentTime: 0,
    })) as unknown as typeof AudioContext;

    // Mock navigator.vibrate
    if (!navigator.vibrate) {
      navigator.vibrate = vi.fn();
    } else {
      vi.spyOn(navigator, 'vibrate').mockImplementation(() => true);
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('initializes correctly', () => {
    const { result } = renderHook(() => useCookTimer(60));
    expect(result.current.timeLeft).toBe(60);
    expect(result.current.isRunning).toBe(false);
  });

  it('starts the timer and decrements timeLeft', () => {
    const { result } = renderHook(() => useCookTimer(60));
    
    act(() => {
      result.current.start();
    });
    
    expect(result.current.isRunning).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(result.current.timeLeft).toBe(59);
  });

  it('pauses the timer', () => {
    const { result } = renderHook(() => useCookTimer(60));
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      vi.advanceTimersByTime(1000);
      result.current.pause();
    });
    
    expect(result.current.isRunning).toBe(false);
    expect(result.current.timeLeft).toBe(59);
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(result.current.timeLeft).toBe(59);
  });

  it('stops and resets the timer', () => {
    const { result } = renderHook(() => useCookTimer(60));
    
    act(() => {
      result.current.start();
      vi.advanceTimersByTime(2000);
      result.current.stop();
    });
    
    expect(result.current.isRunning).toBe(false);
    expect(result.current.timeLeft).toBe(60);
  });

  it('formats time correctly', () => {
    const { result } = renderHook(() => useCookTimer(0));
    expect(result.current.formatTime(65)).toBe('01:05');
    expect(result.current.formatTime(3600)).toBe('60:00');
    expect(result.current.formatTime(9)).toBe('00:09');
  });

  it('plays audio and vibrates when timer reaches zero', () => {
    const { result } = renderHook(() => useCookTimer(2));
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(result.current.timeLeft).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(window.AudioContext).toHaveBeenCalled();
    expect(navigator.vibrate).toHaveBeenCalledWith([200, 100, 200]);
  });
});
