import type { CSSProperties } from 'react';

/**
 * QB — shared style factories for Question Bank components.
 * Use these for dynamic (theme-aware) or repeated style objects.
 * Static layout patterns belong in the CSS utility classes in index.css.
 */
export const QB = {
  // ── Color helpers ────────────────────────────────────────────────────
  /** Brand tint: color-mix(in oklch, br N%, white) */
  tint: (br: string, pct: number) => `color-mix(in oklch,${br} ${pct}%,white)`,
  /** Persona avatar background (50% mix with white) */
  avatarBg: (color: string) => `color-mix(in oklch,${color} 50%,white)`,

  // ── Component style factories ─────────────────────────────────────────
  /**
   * Circular avatar container for persona initials.
   * @param color  Persona hex color
   * @param size   Diameter in px (30 for large, 22 for small)
   */
  avatar: (color: string, size: number): CSSProperties => ({
    width: size, height: size, borderRadius: '50%',
    background: `color-mix(in oklch,${color} 50%,white)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
  }),

  /**
   * Fixed-position dropdown panel (row context menus, folder menus).
   * @param top       CSS top value (y coordinate)
   * @param right     CSS right value (window.innerWidth - x)
   * @param minWidth  Minimum width in px (default 220)
   */
  dropdown: (top: number, right: number, minWidth = 220): CSSProperties => ({
    position: 'fixed', top, right,
    background: 'white', border: '1px solid #e2e8f0', borderRadius: 10,
    boxShadow: '0 8px 32px rgba(0,0,0,0.18),0 2px 8px rgba(0,0,0,0.08)',
    minWidth, zIndex: 99999, overflow: 'hidden', paddingTop: 4, paddingBottom: 4
  }),

  /**
   * Fixed-position popover panel (version history).
   * Slightly different shadow and padding from dropdown.
   */
  popover: (top: number, right: number): CSSProperties => ({
    position: 'fixed', top, right,
    background: 'white', border: '1px solid #e2e8f0', borderRadius: 10,
    boxShadow: '0 8px 32px rgba(0,0,0,0.16)', minWidth: 260, zIndex: 99999, padding: 12
  }),

  /**
   * Pill / badge (theme-independent).
   * For theme-aware badges use the StatusBadge/DiffBadge components instead.
   */
  pill: (bg: string, color: string): CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', padding: '4px 12px',
    borderRadius: 999, fontSize: 12, fontWeight: 600, background: bg, color,
    whiteSpace: 'nowrap'
  }),

  /**
   * Toolbar icon button (search, bookmark, filter, etc.).
   * Handles active/inactive background + color; hover is set inline
   * because it must revert to the dynamic active color on mouse-out.
   */
  iconBtn: (active: boolean, br: string, mfg: string, activeBg?: string): CSSProperties => ({
    background: active ? activeBg ?? `color-mix(in oklch,${br} 10%,white)` : 'none',
    border: 'none', cursor: 'pointer', padding: 5, borderRadius: 6,
    display: 'flex', alignItems: 'center', color: active ? br : mfg
  })
};