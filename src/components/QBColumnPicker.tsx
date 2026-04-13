import React from 'react';

export type ColId = 'type' | 'status' | 'difficulty' | 'collaborator' | 'pbis' | 'blooms' | 'tags' | 'usage' | 'age';

export const COL_DEFS: Record<ColId, {label: string;w: number;}> = {
  type: { label: 'Type', w: 90 },
  status: { label: 'Status', w: 90 },
  difficulty: { label: 'Difficulty', w: 76 },
  collaborator: { label: 'Owner', w: 130 },
  pbis: { label: 'P-Bis', w: 56 },
  blooms: { label: "Bloom's", w: 90 },
  tags: { label: 'Tags', w: 110 },
  usage: { label: 'Usage', w: 52 },
  age: { label: 'Updated', w: 90 }
};

export const COL_ORDER: ColId[] = ['type', 'status', 'difficulty', 'collaborator', 'pbis', 'blooms', 'tags', 'usage', 'age'];
export const DEFAULT_COLS: ColId[] = ['type', 'status', 'difficulty', 'collaborator', 'pbis'];

const PRESETS: Array<{name: string;cols: ColId[];}> = [
{ name: 'Default', cols: ['type', 'status', 'difficulty', 'collaborator', 'pbis'] },
{ name: 'Collaborators', cols: ['status', 'collaborator', 'age'] },
{ name: 'Analytics', cols: ['difficulty', 'pbis', 'usage', 'blooms'] },
{ name: 'Full', cols: ['type', 'status', 'difficulty', 'collaborator', 'pbis', 'blooms', 'tags', 'usage', 'age'] }];


export function ColumnPicker({ activeColumns, onColumnsChange, onClose



}: {activeColumns: ColId[];onColumnsChange: (cols: ColId[]) => void;onClose: () => void;}) {
  const fg = 'var(--foreground)',mfg = 'var(--muted-foreground)',br = 'var(--brand)';

  const toggleCol = (id: ColId) => {
    if (activeColumns.includes(id)) {
      if (activeColumns.length === 1) return;
      onColumnsChange(activeColumns.filter((c) => c !== id));
    } else {
      const next = COL_ORDER.filter((c) => c === id || activeColumns.includes(c));
      onColumnsChange(next);
    }
  };
  const moveCol = (id: ColId, dir: -1 | 1) => {
    const idx = activeColumns.indexOf(id);if (idx < 0) return;
    const ni = Math.max(0, Math.min(activeColumns.length - 1, idx + dir));if (ni === idx) return;
    const arr = [...activeColumns];const [m] = arr.splice(idx, 1);arr.splice(ni, 0, m);onColumnsChange(arr);
  };

  return (
    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: 'white', border: '1px solid var(--border)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.14)', zIndex: 60, width: 228, paddingBottom: 4 }} onClick={(e) => e.stopPropagation()}>
      {/* Presets */}
      <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: mfg, marginBottom: 7 }}>Presets</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {PRESETS.map((p) => {
            const isActive = p.cols.length === activeColumns.length && p.cols.every((c) => activeColumns.includes(c));
            return (
              <button key={p.name} onClick={() => onColumnsChange(p.cols)} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6, border: `1px solid ${isActive ? br : 'var(--border)'}`, background: isActive ? `color-mix(in oklch,${br} 10%,white)` : 'transparent', color: isActive ? br : fg, cursor: 'pointer', fontWeight: isActive ? 600 : 400 }}>
                {p.name}
              </button>);

          })}
        </div>
      </div>
      {/* Column toggles */}
      <div style={{ paddingTop: 4 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: mfg, padding: '6px 12px 4px' }}>Columns</div>
        {COL_ORDER.map((id) => {
          const active = activeColumns.includes(id),idx = activeColumns.indexOf(id);
          return (
            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <button onClick={() => toggleCol(id)} style={{ width: 15, height: 15, borderRadius: 3, border: `1.5px solid ${active ? br : 'var(--border)'}`, background: active ? br : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0 }}>
                {active && <i className="fa-solid fa-check" style={{ fontSize: 8, color: 'white', lineHeight: 1 }} />}
              </button>
              <span style={{ flex: 1, fontSize: 12, color: active ? fg : mfg, userSelect: 'none' }}>{COL_DEFS[id].label}</span>
              {active &&
              <div style={{ display: 'flex', gap: 1 }}>
                  <button onClick={() => moveCol(id, -1)} disabled={idx === 0} style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'default' : 'pointer', color: mfg, opacity: idx === 0 ? 0.25 : 0.7, padding: '1px 3px', lineHeight: 1 }}>
                    <i className="fa-regular fa-chevron-up" style={{ fontSize: 9 }} />
                  </button>
                  <button onClick={() => moveCol(id, 1)} disabled={idx === activeColumns.length - 1} style={{ background: 'none', border: 'none', cursor: idx === activeColumns.length - 1 ? 'default' : 'pointer', color: mfg, opacity: idx === activeColumns.length - 1 ? 0.25 : 0.7, padding: '1px 3px', lineHeight: 1 }}>
                    <i className="fa-regular fa-chevron-down" style={{ fontSize: 9 }} />
                  </button>
                </div>
              }
            </div>);

        })}
      </div>
    </div>);

}