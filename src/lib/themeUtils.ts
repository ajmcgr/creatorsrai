export interface Theme {
  card_bg: string;
  card_border_color: string;
  content_color: string;
  accent: string;
  font_family: string;
  heading_weight: string;
  link_decoration: string;
  card_radius: string;
  layout_density: 'compact' | 'normal' | 'spacious';
  card_shadow: boolean;
  badge_style: 'subtle' | 'solid' | 'outline';
  button_style: 'solid' | 'ghost' | 'outline';
}

export interface ContrastResult {
  pass: boolean;
  ratio: number;
}

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

export function checkContrast(theme: Theme): ContrastResult {
  const ratio = getContrastRatio(theme.content_color, theme.card_bg);
  // WCAG AA requires 4.5:1 for normal text
  return {
    pass: ratio >= 4.5,
    ratio,
  };
}

export const defaultTheme: Theme = {
  card_bg: '#ffffff',
  card_border_color: '#e5e7eb',
  content_color: '#111827',
  accent: '#3b82f6',
  font_family: 'Inter',
  heading_weight: '600',
  link_decoration: 'underline',
  card_radius: '0.75rem',
  layout_density: 'normal',
  card_shadow: true,
  badge_style: 'subtle',
  button_style: 'solid',
};
