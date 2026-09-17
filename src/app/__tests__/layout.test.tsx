// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { metadata, viewport } from '../layout';

describe('RootLayout Configuration', () => {
  it('exports viewport configuration optimized for mobile native app feel', () => {
    expect(viewport).toBeDefined();
    expect(viewport.viewportFit).toBe('cover');
    expect(viewport.width).toBe('device-width');
    expect(viewport.initialScale).toBe(1);
    expect(viewport.maximumScale).toBe(1);
    expect(viewport.userScalable).toBe(false);
    expect(viewport.themeColor).toBeDefined();
  });

  it('exports metadata with standalone appleWebApp capabilities', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("Solo Chef's Dabba");
    expect(metadata.appleWebApp).toEqual({
      capable: true,
      statusBarStyle: 'default',
      title: "Solo Chef",
    });
  });
});
