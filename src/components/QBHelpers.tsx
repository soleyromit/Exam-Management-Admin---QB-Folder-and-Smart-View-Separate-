import React from 'react';
import type { SmartCriteria } from './QBModals';
import { S_CFG } from './QBData';
import type { QStatus, QType, QDiff } from './QBData';
// ── pill (neutral base) ────────────────────────────────────────────────────
export const pill = (
bg: string,
color: string,
children: React.ReactNode,
border?: string) =>

<span
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    background: bg,
    color,
    border: border ?? 'none',
    whiteSpace: 'nowrap'
  }}>
  
    {children}
  </span>;

// ── StatusBadge ─────────────────────────────────────────────────────────────────────
//
// Matches reference data-list-table-cells.tsx StatusBadge exactly:
//   h-6 border-0 px-2 py-1 text-xs font-medium leading-none shadow-none
//
//   h-6      = height: 24px
//   border-0 = border: none
//   px-2     = padding left/right: 8px
//   py-1     = padding top/bottom: 4px
//   text-xs  = font-size: 11px (Exxat --text-xs: 0.6875rem)
//   font-medium = font-weight: 500
const BADGE_BASE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  height: 24,
  padding: '4px 8px',
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 500,
  lineHeight: 1,
  border: 'none',
  whiteSpace: 'nowrap'
};
export function StatusBadge({ s }: {s: QStatus;}) {
  const c = S_CFG[s];
  return (
    <span
      style={{
        ...BADGE_BASE,
        gap: 6,
        background: c.bg,
        color: c.text
      }}>
      
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: c.dot,
          flexShrink: 0
        }} />
      
      {s}
    </span>);

}
// ── TypeBadge ─────────────────────────────────────────────────────────────────────
export function TypeBadge({ t }: {t: QType;}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 500,
        background: '#f1f5f9',
        color: '#475569',
        whiteSpace: 'nowrap'
      }}>
      
      {t}
    </span>);

}
// ── DiffBadge ─────────────────────────────────────────────────────────────────────
export function DiffBadge({ d }: {d: QDiff;}) {
  const cfg: Record<
    string,
    {
      bg: string;
      color: string;
      fw: number;
    }> =
  {
    Easy: {
      bg: '#f0fdf4',
      color: '#16a34a',
      fw: 500
    },
    Medium: {
      bg: '#fffbeb',
      color: '#d97706',
      fw: 600
    },
    Hard: {
      bg: '#fef2f2',
      color: '#dc2626',
      fw: 700
    }
  };
  const c = cfg[d] ?? {
    bg: '#f1f5f9',
    color: '#64748b',
    fw: 500
  };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: c.fw,
        background: c.bg,
        color: c.color,
        whiteSpace: 'nowrap'
      }}>
      
      {d}
    </span>);

}
// ── PBisCell ─────────────────────────────────────────────────────────────────────
export function PBisCell({
  val,
  dir



}: {val: number | null;dir: 'up' | 'down' | 'flat' | null;}) {
  if (!val)
  return (
    <span
      style={{
        color: '#94a3b8',
        fontSize: 12
      }}>
      
        —
      </span>);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        justifyContent: 'flex-end'
      }}>
      
      {dir === 'up' ?
      <i
        className="fa-regular fa-arrow-trend-up"
        style={{
          fontSize: 10,
          color: '#16a34a'
        }} /> :

      dir === 'down' ?
      <i
        className="fa-regular fa-arrow-trend-down"
        style={{
          fontSize: 10,
          color: '#dc2626'
        }} /> :


      <i
        className="fa-regular fa-minus"
        style={{
          fontSize: 10,
          color: '#94a3b8'
        }} />

      }
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: val >= 0.3 ? '#16a34a' : '#dc2626'
        }}>
        
        {val.toFixed(2)}
      </span>
    </div>);

}
// ── KebabMenu ─────────────────────────────────────────────────────────────────────
export function KebabMenu({
  items







}: {items: Array<{label: string;icon: React.ReactNode;danger?: boolean;onClick: () => void;}>;}) {
  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 'calc(100% + 2px)',
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        zIndex: 9999,
        minWidth: 180,
        padding: '4px 0'
      }}>
      
      {items.map((it, i) =>
      <button
        key={i}
        onClick={(e) => {
          e.stopPropagation();
          it.onClick();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          width: '100%',
          padding: '7px 14px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          fontSize: 13,
          color: it.danger ? '#dc2626' : 'var(--foreground)',
          textAlign: 'left'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
        
          {it.icon}
          {it.label}
        </button>
      )}
    </div>);

}
// ── chipLabels ─────────────────────────────────────────────────────────────────────
export function chipLabels(c: SmartCriteria): string[] {
  const o: string[] = [
  ...c.difficulties,
  ...c.blooms,
  ...c.types,
  ...(c.tags || [])];

  if (c.usage === 'never') o.push('Never used');
  if (c.usage === 'low') o.push('Used 1–2×');
  if (c.usage === 'multi') o.push('Used 3+');
  if (c.pbis === 'low') o.push('P-Bis <0.30');
  if (c.pbis === 'very-low') o.push('P-Bis <0.20');
  if (c.pbis === 'high') o.push('P-Bis ≥0.40');
  return o;
}