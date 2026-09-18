// @vitest-environment node
import { describe, it, expect } from 'vitest';
import manifest from '../manifest';

describe('Web App Manifest', () => {
  it('exports a valid PWA manifest matching W3C specification', () => {
    const config = manifest();

    expect(config).toBeDefined();
    expect(config.name).toContain('Solo Chef');
    expect(config.short_name).toBe('Solo Chef');
    expect(config.description).toBeDefined();
    expect(config.start_url).toBe('/');
    expect(config.display).toBe('standalone');
    expect(config.background_color).toBeDefined();
    expect(config.theme_color).toBeDefined();
  });

  it('includes required PWA icons including 192x192, 512x512, and maskable variants', () => {
    const config = manifest();

    expect(config.icons).toBeDefined();
    expect(config.icons && config.icons.length).toBeGreaterThanOrEqual(2);

    const iconSizes = config.icons?.map(icon => icon.sizes);
    expect(iconSizes).toContain('192x192');
    expect(iconSizes).toContain('512x512');

    const hasMaskable = config.icons?.some(
      icon => icon.purpose === 'maskable'
    );
    expect(hasMaskable).toBe(true);
  });

  it('includes appropriate app categories and portrait orientation', () => {
    const config = manifest();

    expect(config.orientation).toBe('portrait');
    expect(config.categories).toEqual(
      expect.arrayContaining(['food', 'lifestyle'])
    );
  });
});
