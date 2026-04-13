// ─── Exxat brand theme configuration ─────────────────────────────────────────
// Single source of truth for all theme-aware components.

export type ThemeKey = 'exam' | 'one' | 'orange' | 'teal' | 'red' | 'purple' | 'green';

export interface ThemeConfig {
  label: string;
  h: string; // oklch hue
  c: string; // oklch chroma
  swatch: string; // representative oklch color for preview dot
}

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  // Exam Mgmt uses Exxat brand purple (h=299 = clear purple, not indigo)
  exam: { label: 'Exam Mgmt', h: '299', c: '0.16', swatch: 'oklch(0.50 0.16 299)' },
  one: { label: 'Exxat One', h: '286', c: '0.14', swatch: 'oklch(0.50 0.14 286)' },
  orange: { label: 'Orange', h: '55', c: '0.20', swatch: 'oklch(0.60 0.20 55)' },
  teal: { label: 'Teal', h: '180', c: '0.11', swatch: 'oklch(0.45 0.13 180)' },
  red: { label: 'Red', h: '25', c: '0.22', swatch: 'oklch(0.55 0.22 25)' },
  purple: { label: 'Purple', h: '305', c: '0.18', swatch: 'oklch(0.50 0.18 305)' },
  green: { label: 'Green', h: '145', c: '0.15', swatch: 'oklch(0.48 0.15 145)' }
};

/** Applies the two root brand params to :root — all derived tokens re-compute. */
export function applyTheme(theme: ThemeConfig): void {
  const root = document.documentElement;
  root.style.setProperty('--brand-h', theme.h);
  root.style.setProperty('--brand-c', theme.c);
}