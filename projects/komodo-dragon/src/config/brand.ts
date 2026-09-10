/**
 * Brand Configuration
 *
 * Generated from brands/komodo/brand.json for the "komodo-dragon" project.
 *
 * To change brands, either:
 * 1. Run /video again with a different brand
 * 2. Manually copy values from brands/{brand-name}/brand.json
 */

import type { Theme } from '../../../../lib/theme';

// Project brand name (for reference)
export const brandName = 'komodo';

// Brand colors and styling (dramatic volcanic-jungle aesthetic)
export const brand = {
  name: 'Komodo',
  colors: {
    primary: '#3A6B35',
    primaryLight: '#5C8A52',
    accent: '#E8590C',
    textDark: '#F4EFE4',
    textMedium: '#C9C0AC',
    textLight: '#8A8272',
    bgLight: '#12160F',
    bgDark: '#050604',
    bgOverlay: 'rgba(244, 239, 228, 0.06)',
    divider: '#2A2E22',
    shadow: 'rgba(0, 0, 0, 0.6)',
  },
  fonts: {
    primary: "'Bebas Neue', 'Oswald', system-ui, -apple-system, sans-serif",
    mono: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
  },
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 48,
    xl: 80,
    xxl: 120,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 14,
  },
  typography: {
    h1: { size: 88, weight: 700 },
    h2: { size: 64, weight: 700 },
    h3: { size: 44, weight: 600 },
    body: { size: 28, weight: 400 },
    label: { size: 18, weight: 500, letterSpacing: 3 },
  },
  assets: {
    logo: undefined as string | undefined,
    logoLight: undefined as string | undefined,
  },
};

// Theme derived from brand (for component use)
export const brandTheme: Theme = {
  colors: brand.colors,
  fonts: brand.fonts,
  spacing: brand.spacing,
  borderRadius: brand.borderRadius,
  typography: brand.typography,
};
