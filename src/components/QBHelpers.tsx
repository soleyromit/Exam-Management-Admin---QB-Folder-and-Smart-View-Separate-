import React from 'react';
import type { SmartCriteria } from './QBModals';
import { S_CFG } from './QBData';
import type { QStatus, QType, QDiff } from './QBData';

// ── pill (neutral base) ───────────────────────────────────────────────────

export const pill = (bg: string, color: string, children: React.ReactNode, border?: string) =>
<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: bg, color, border: border ?? '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
    {children}
  </span>;


// ── StatusBadge — neutral pill, keeps per-status colored dot only ──────────

export function StatusBadge({ s }: {s: QStatus;}) {
  const c = S_CFG[s];
  return pill('#f1f5f9', '#334155',
  <>
      {s === 'Locked' ?
    <i className="fa-regular fa-lock" style={{ fontSize: 9, lineHeight: 1, color: '#64748b' }} /> :
    s === 'Flagged' ?
    <i className="fa-regular fa-flag" style={{ fontSize: 9, lineHeight: 1, color: '#64748b' }} /> :

    <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, flexShrink: 0, display: 'inline-block' }} />
    }
      {s}
    </>
  );
}

// ── TypeBadge — neutral, no per-type color ────────────────────────────────

export function TypeBadge({ t }: {t: QType;}) {
  return pill('#f1f5f9', '#334155', t);
}

// ── DiffBadge — neutral bg, font-weight encodes difficulty ─────────────

export function DiffBadge({ d }: {d: QDiff;}) {
  const fw = d === 'Hard' ? 700 : d === 'Medium' ? 500 : 400;
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: fw, background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
      {d}
    </span>);

}

// ── PBisCell ───────────────────────────────────────────────────────────────

export function PBisCell({ val, dir }: {val: number | null;dir: 'up' | 'down' | 'flat' | null;}) {
  if (!val) return <span style={{ color: 'var(--muted-foreground)', fontSize: 12 }}>—</span>;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}>
      {dir === 'up' ? <i className="fa-regular fa-arrow-trend-up" style={{ fontSize: 10, color: '#16a34a' }} /> :
      dir === 'down' ? <i className="fa-regular fa-arrow-trend-down" style={{ fontSize: 10, color: '#dc2626' }} /> :
      <i className="fa-regular fa-minus" style={{ fontSize: 10, color: '#94a3b8' }} />}
      <span style={{ fontSize: 12, fontWeight: 600, color: val >= 0.3 ? '#16a34a' : '#dc2626' }}>{val.toFixed(2)}</span>
    </div>);

}

// ── KebabMenu ──────────────────────────────────────────────────────────────

export function KebabMenu({ items }: {items: Array<{label: string;icon: React.ReactNode;danger?: boolean;onClick: () => void;}>;}) {
  return (
    <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 2px)', background: 'white', border: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, minWidth: 180, padding: '4px 0' }}>
      {items.map((it, i) =>
      <button key={i} onClick={(e) => {e.stopPropagation();it.onClick();}} style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '7px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: it.danger ? '#dc2626' : 'var(--foreground)', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
          {it.icon}{it.label}
        </button>
      )}
    </div>);

}

// ── chipLabels ─────────────────────────────────────────────────────────────

export function chipLabels(c: SmartCriteria): string[] {
  const o: string[] = [...c.difficulties, ...c.blooms, ...c.types, ...(c.tags || [])];
  if (c.usage === 'never') o.push('Never used');
  if (c.usage === 'low') o.push('Used 1–2×');
  if (c.usage === 'multi') o.push('Used 3+');
  if (c.pbis === 'low') o.push('P-Bis <0.30');
  if (c.pbis === 'very-low') o.push('P-Bis <0.20');
  if (c.pbis === 'high') o.push('P-Bis ≥0.40');
  return o;
}