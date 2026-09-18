import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ServiceWorkerRegister from '../ServiceWorkerRegister';

describe('ServiceWorkerRegister', () => {
  const originalNavigator = { ...global.navigator };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      configurable: true,
      writable: true,
    });
  });

  it('registers /sw.js when serviceWorker is available in navigator', async () => {
    const registerMock = vi.fn().mockResolvedValue({
      scope: '/',
      addEventListener: vi.fn(),
    });

    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        serviceWorker: {
          register: registerMock,
        },
        onLine: true,
      },
      configurable: true,
      writable: true,
    });

    render(<ServiceWorkerRegister />);

    expect(registerMock).toHaveBeenCalledWith('/sw.js');
  });

  it('handles registration failure gracefully without crashing', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const registerMock = vi.fn().mockRejectedValue(new Error('SW failed'));

    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        serviceWorker: {
          register: registerMock,
        },
        onLine: true,
      },
      configurable: true,
      writable: true,
    });

    render(<ServiceWorkerRegister />);

    // Allow promise rejection to resolve
    await act(async () => {
      await Promise.resolve();
    });

    expect(registerMock).toHaveBeenCalledWith('/sw.js');
    consoleErrorSpy.mockRestore();
  });

  it('does nothing when navigator.serviceWorker is undefined', () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        serviceWorker: undefined,
        onLine: true,
      },
      configurable: true,
      writable: true,
    });

    expect(() => render(<ServiceWorkerRegister />)).not.toThrow();
  });

  it('shows an offline notice banner when offline status is detected', async () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        serviceWorker: {
          register: vi.fn().mockResolvedValue({}),
        },
        onLine: false,
      },
      configurable: true,
      writable: true,
    });

    render(<ServiceWorkerRegister />);

    expect(screen.getByText(/offline mode/i)).toBeTruthy();
  });
});
