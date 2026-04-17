import React, { useState } from 'react';
import { FacultyOnboardingBanner } from './QBInlineHelpers';
import { QBQuestionRow, QB_GRID } from './QBQuestionRow';

// ─── Toast notification ───────────────────────────────────────────────────────
function Toast({ msg, type }: {msg: string;type: 'success' | 'info' | 'warn';}) {
  const cfg = {
    success: { bg: '#f0fdf4', color: '#15803d', icon: 'circle-check', border: '#bbf7d0' },
    info: { bg: '#eff6ff', color: '#2563eb', icon: 'circle-info', border: '#bfdbfe' },
    warn: { bg: '#fffbeb', color: '#b45309', icon: 'triangle-exclamation', border: '#fde68a' }
  };
  const c = cfg[type];
  return (
    <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 99999, display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 10, background: c.bg, border: `1px solid ${c.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 13, fontWeight: 500, color: c.color, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
      <i className={`fa-regular fa-${c.icon}`} style={{ fontSize: 14 }} />{msg}
    </div>);

}

// ─── Header cell ─────────────────────────────────────────────────────────────
function HC({ children, title, right }: {children?: React.ReactNode;title?: string;right?: boolean;}) {
  return (
    <div title={title} style={{ padding: '0 12px', fontSize: 11, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', justifyContent: right ? 'flex-end' : 'flex-start' }}>
      {children}
    </div>);

}

// ─── Main component ───────────────────────────────────────────────────────────
export function QBViewBottom(p: any) {
  const {
    filteredQuestions = [],
    rowCtx,
    bdr = '#e2e8f0',
    fg = '#1e293b',
    mfg = '#64748b',
    br = '#6366f1',
    onboarding
  } = p;

  const [toast, setToast] = useState<{msg: string;type: 'success' | 'info' | 'warn';} | null>(null);

  const notify = (msg: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2400);
  };

  // Inject notify into rowCtx so QBQuestionRow can fire toasts
  const enhancedCtx = rowCtx ? { ...rowCtx, notify } : rowCtx;

  if (!filteredQuestions.length) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: mfg, gap: 8 }}>
        <i className="fa-regular fa-inbox" style={{ fontSize: 28, opacity: 0.3 }} />
        <span style={{ fontSize: 13 }}>No questions match your current filters.</span>
      </div>);

  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', position: 'relative' }}>
      {onboarding && <FacultyOnboardingBanner br={br} bdr={bdr} mfg={mfg} fg={fg} />}
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* ── Sticky header ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: QB_GRID,
        borderBottom: `1px solid ${bdr}`,
        background: '#f8fafc',
        position: 'sticky',
        top: 0,
        zIndex: 2,
        height: 34
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #f1f5f9' }}>
          <input type="checkbox" style={{ width: 13, height: 13, cursor: 'pointer' }} onChange={() => {}} />
        </div>
        <HC>Question</HC>
        <HC>Status</HC>
        <HC>Difficulty</HC>
        <HC>Creator</HC>
        <HC>Edited by</HC>
        <HC right title="Times used in exams">Usage</HC>
        <HC right title="Point-Biserial correlation">P-Bis</HC>
        <HC right title="Version history">Ver</HC>
      </div>

      {/* ── Question rows ── */}
      {filteredQuestions.map((q: any) =>
      <QBQuestionRow key={q.id} q={q} ctx={enhancedCtx} />
      )}
    </div>);

}