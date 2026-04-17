import React, { useState } from 'react';
import type { Question } from './QBData';
import { StatusBadge, TypeBadge, DiffBadge, PBisCell } from './QBHelpers';
import { Portal } from './Portal';
import { QB } from './QBStyles';

// Column grid — added Usage column between Edited-by and P-Bis
export const QB_GRID = '28px 1.6fr 100px 80px 1fr 1fr 56px 50px 52px';

const PERSONA_COLORS: Record<string, {initials: string;color: string;}> = {
  'Dr. Patel': { initials: 'AP', color: '#0891b2' },
  'Dr. Chen': { initials: 'SC', color: '#059669' },
  'Dr. Lee': { initials: 'PL', color: '#d97706' },
  'Dr. Ramirez': { initials: 'MR', color: '#dc2626' },
  'Dr. Kim': { initials: 'JK', color: '#0f766e' },
  'Dr. Wells': { initials: 'DW', color: '#64748b' },
  Admin: { initials: 'AD', color: '#7c3aed' }
};

const TRUST_CFG: Record<'junior' | 'mid' | 'senior', {color: string;bg: string;}> = {
  junior: { color: '#64748b', bg: '#f1f5f9' },
  mid: { color: '#2563eb', bg: '#dbeafe' },
  senior: { color: '#059669', bg: '#dcfce7' }
};

const STATUS_TRANSITIONS: Record<string, string[]> = {
  Draft: ['Saved'],
  Saved: ['Draft'],
  Active: ['Draft'],
  'In Review': ['Draft', 'Active'],
  Flagged: ['Draft', 'In Review'],
  Locked: []
};

function CreatorAvatar({ name, trustLevel }: {name?: string;trustLevel?: 'junior' | 'mid' | 'senior';}) {
  if (!name) return <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>;
  const cfg = PERSONA_COLORS[name];
  const initials = cfg?.initials ?? name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const color = cfg?.color ?? '#6366f1';
  const tc = trustLevel ? TRUST_CFG[trustLevel] : null;
  return (
    <div className="qb-flex-ac" style={{ gap: 7, minWidth: 0 }}>
      <div style={QB.avatar(color, 28)}>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'white' }}>{initials}</span>
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="qb-ellipsis" style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)' }}>{name}</div>
        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
          Faculty
          {tc &&
          <span style={{ fontSize: 9, fontWeight: 700, padding: '0px 4px', borderRadius: 3, background: tc.bg, color: tc.color, letterSpacing: '0.02em' }}>
              {trustLevel!.toUpperCase()}
            </span>
          }
        </div>
      </div>
    </div>);

}

function SmallAvatar({ name }: {name?: string;}) {
  if (!name) return <span style={{ color: '#94a3b8', fontSize: 11 }}>—</span>;
  const cfg = PERSONA_COLORS[name];
  const initials = cfg?.initials ?? name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const color = cfg?.color ?? '#6366f1';
  return (
    <div className="qb-flex-ac" style={{ gap: 6, minWidth: 0 }}>
      <div style={QB.avatar(color, 22)}>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'white' }}>{initials}</span>
      </div>
      <span className="qb-ellipsis" style={{ fontSize: 12, color: 'var(--foreground)' }}>{name}</span>
    </div>);

}

export interface QRowCtx {
  selected: Set<string>;
  rowMenuId: string | null;
  rowMenuPos: {x: number;y: number;} | null;
  versionPopoverId: string | null;
  versionMenuPos: {x: number;y: number;} | null;
  rowHoverId: string | null;
  pinnedQIds: Set<string>;
  shortlistedQIds: Set<string>;
  isFaculty: boolean;
  isAdmin: boolean;
  draggedQId: string | null;
  br: string;
  bdr: string;
  fg: string;
  mfg: string;
  CURRENT_USER: string;
  FACULTY_COURSES: string[];
  VERSION_HISTORY: Record<string, {v: number;label: string;date: string;author: string;}[]>;
  setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
  setRowMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  setRowMenuPos: React.Dispatch<React.SetStateAction<{x: number;y: number;} | null>>;
  setVersionPopoverId: React.Dispatch<React.SetStateAction<string | null>>;
  setVersionMenuPos: React.Dispatch<React.SetStateAction<{x: number;y: number;} | null>>;
  setRowHoverId: React.Dispatch<React.SetStateAction<string | null>>;
  setPinnedQIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setShortlistedQIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setDraggedQId: React.Dispatch<React.SetStateAction<string | null>>;
  setDragQOverFolderId: React.Dispatch<React.SetStateAction<string | null>>;
  setRowPanel: React.Dispatch<React.SetStateAction<Question | null>>;
  setEditImpactQ: React.Dispatch<React.SetStateAction<Question | null>>;
  setRequestEditId: React.Dispatch<React.SetStateAction<string | null>>;
  setAddToFolderOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedQForFolder: React.Dispatch<React.SetStateAction<string | null>>;
  setShareQId: React.Dispatch<React.SetStateAction<string | null>>;
  facultyEditAccessQIds?: Set<string>;
  onTransferToCourse?: (qId: string) => void;
  togglePin: (id: string) => void;
  onEditQuestion?: () => void;
  onCollaborate?: () => void;
  personaTrustLevels?: Record<string, 'junior' | 'mid' | 'senior'>;
  setQuestions?: React.Dispatch<React.SetStateAction<any[]>>;
  notify?: (msg: string, type?: 'success' | 'info' | 'warn') => void;
}

const CB = '1px solid #f1f5f9';
const RB = '1px solid #e2e8f0';

export function QBQuestionRow({ q, ctx }: {q: Question;ctx: QRowCtx;}) {
  const {
    selected, rowMenuId, rowMenuPos, versionPopoverId, versionMenuPos,
    rowHoverId, pinnedQIds, shortlistedQIds, isFaculty, isAdmin,
    draggedQId, br, bdr, fg, mfg, CURRENT_USER, FACULTY_COURSES, VERSION_HISTORY,
    setSelected, setRowMenuId, setRowMenuPos, setVersionPopoverId, setVersionMenuPos,
    setRowHoverId, setPinnedQIds, setShortlistedQIds, setDraggedQId, setDragQOverFolderId,
    setRowPanel, setEditImpactQ, setRequestEditId, setAddToFolderOpen, setSelectedQForFolder,
    setShareQId, togglePin, onEditQuestion, onCollaborate, facultyEditAccessQIds,
    onTransferToCourse, personaTrustLevels, setQuestions, notify
  } = ctx;

  const [statusSubOpen, setStatusSubOpen] = useState(false);

  const isSel = selected.has(q.id);
  const isRowMenuOpen = rowMenuId === q.id;
  const isVersionOpen = versionPopoverId === q.id;
  const isRowHov = rowHoverId === q.id;
  const isPinned = pinnedQIds.has(q.id);
  const isShortlisted = shortlistedQIds.has(q.id);
  const isMyQuestion = q.collaborator === CURRENT_USER || q.creator === CURRENT_USER;
  const canEdit = isMyQuestion || isFaculty && (facultyEditAccessQIds?.has(q.id) ?? false);
  const isPrivate = (q.tags || []).includes('private');
  const creatorName = q.creator || q.collaborator || '';
  const creatorTrustLevel = personaTrustLevels?.[creatorName];
  const hasUsage = ((q as any).usageCount ?? q.usage ?? 0) > 0;
  const usageCount = (q as any).usageCount ?? q.usage ?? 0;
  const nextStatuses = STATUS_TRANSITIONS[q.status] || [];

  // Questions that have been used in exams are read-only — they can only be duplicated
  const canEditQ = !hasUsage;

  const vHistory = VERSION_HISTORY[q.id] || [{
    v: q.version || 1, label: 'Current version',
    date: q.age || 'Recently', author: q.creator || q.collaborator || 'Faculty'
  }];

  const n = (msg: string, type: 'success' | 'info' | 'warn' = 'success') => notify?.(msg, type);

  const toggleShortlist = () => {
    setShortlistedQIds((prev) => {const ns = new Set(prev);ns.has(q.id) ? ns.delete(q.id) : ns.add(q.id);return ns;});
    setRowMenuId(null);
    n(isShortlisted ? 'Removed from shortlist' : 'Added to shortlist', 'info');
  };

  const duplicateQ = () => {
    const newQ = { ...q, id: q.id + '-copy-' + Date.now().toString(36), title: q.title + ' (copy)', status: 'Draft' as const, creator: CURRENT_USER, version: 1, usageCount: 0, usage: 0, pbis: null, pbisDir: null };
    setQuestions?.((prev) => [newQ as any, ...prev]);
    setRowMenuId(null);
    n('Duplicated as Draft');
  };

  const deleteQ = () => {
    setQuestions?.((prev) => prev.filter((x: any) => x.id !== q.id));
    setRowMenuId(null);
    n('Question deleted', 'warn');
  };

  const changeStatus = (s: string) => {
    setQuestions?.((prev) => prev.map((x: any) => x.id === q.id ? { ...x, status: s } : x));
    setRowMenuId(null);
    setStatusSubOpen(false);
    n(`Status → ${s}`);
  };

  const promoteToPool = () => {
    setQuestions?.((prev) => prev.map((q2: any) => q2.id === q.id ? { ...q2, tags: (q2.tags || []).filter((t: string) => t !== 'private') } : q2));
    setRowMenuId(null);
    n('Promoted to shared pool');
  };

  // ── Context menu: Edit removed when question has been used ──
  const facultyRowMenu = isMyQuestion ?
  [
  ...(canEditQ ?
  [{ icon: 'pen', label: 'Edit Question', action: () => {onEditQuestion?.();setRowMenuId(null);} }] :
  []),
  { icon: 'eye', label: 'View Details', action: () => {setRowPanel(q);setRowMenuId(null);} },
  { icon: 'copy', label: 'Duplicate as Draft', action: duplicateQ },
  null,
  ...(isPrivate ? [{ icon: 'arrow-up-from-bracket', label: 'Promote to Pool', action: promoteToPool, purple: true }] : []),
  { icon: 'folder-plus', label: 'Add to Folder', action: () => {setSelectedQForFolder(q.id);setAddToFolderOpen(true);setRowMenuId(null);} },
  { icon: 'bookmark', label: isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist', action: toggleShortlist, amber: !isShortlisted },
  null,
  ...(nextStatuses.length > 0 ? [{ icon: 'arrow-right-arrow-left', label: 'Change Status', action: () => setStatusSubOpen((v) => !v), blue: true, sub: true }] : []),
  { icon: 'share-nodes', label: 'Share', action: () => {setShareQId(q.id);setRowMenuId(null);}, blue: true },
  { icon: 'flag', label: 'Flag for Review', action: () => setRowMenuId(null) }] :

  [
  { icon: 'eye', label: 'View Details', action: () => {setRowPanel(q);setRowMenuId(null);} },
  ...(canEditQ ?
  canEdit ?
  [{ icon: 'pen', label: 'Edit Question', action: () => {onEditQuestion?.();setRowMenuId(null);} }] :
  [{ icon: 'key', label: 'Request Edit Access', action: () => {setRequestEditId(q.id);setRowMenuId(null);n('Edit request sent', 'info');} }] :
  []),
  { icon: 'copy', label: 'Duplicate as Draft', action: duplicateQ },
  { icon: 'bookmark', label: isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist', action: toggleShortlist, amber: !isShortlisted },
  null,
  { icon: 'share-nodes', label: 'Share', action: () => {setShareQId(q.id);setRowMenuId(null);}, blue: true },
  { icon: 'flag', label: 'Flag for Review', action: () => setRowMenuId(null) }];


  const adminRowMenu = [
  { icon: 'eye', label: 'View Details', action: () => {setRowPanel(q);setRowMenuId(null);} },
  ...(canEditQ ?
  [{ icon: 'pen', label: 'Edit Question', action: () => {onEditQuestion?.();setRowMenuId(null);} }] :
  []),
  { icon: 'copy', label: 'Duplicate as Draft', action: duplicateQ },
  null,
  { icon: 'folder-plus', label: 'Add to Folder', action: () => {setSelectedQForFolder(q.id);setSelected(new Set([q.id]));setAddToFolderOpen(true);setRowMenuId(null);} },
  { icon: 'thumbtack', label: isPinned ? 'Unfix' : 'Fix to top', action: () => {togglePin(q.id);setRowMenuId(null);}, amber: !isPinned },
  { icon: 'bookmark', label: isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist', action: toggleShortlist, amber: !isShortlisted },
  null,
  ...(nextStatuses.length > 0 ? [{ icon: 'arrow-right-arrow-left', label: 'Change Status', action: () => setStatusSubOpen((v) => !v), blue: true, sub: true }] : []),
  { icon: 'share-nodes', label: 'Share', action: () => {setShareQId(q.id);setRowMenuId(null);}, blue: true },
  { icon: 'flag', label: 'Flag for Review', action: () => setRowMenuId(null) },
  { icon: 'circle-check', label: 'Mark Reviewed', action: () => setRowMenuId(null) },
  null,
  { icon: 'box-archive', label: 'Archive', action: () => setRowMenuId(null) },
  { icon: 'trash-can', label: 'Delete', action: deleteQ, danger: true }];


  const rowMenuItems = isFaculty ? facultyRowMenu : adminRowMenu;
  const rowBg = isSel ? QB.tint(br, 5) : isPinned ? QB.tint(br, 3) : 'white';

  return (
    <>
      {/* ── ROW ── */}
      <div
        draggable={isAdmin}
        onDragStart={isAdmin ? (e) => {setDraggedQId(q.id);e.dataTransfer.effectAllowed = 'copy';} : undefined}
        onDragEnd={isAdmin ? () => {setDraggedQId(null);setDragQOverFolderId(null);} : undefined}
        onClick={() => {setRowMenuId(null);setVersionPopoverId(null);setStatusSubOpen(false);setRowPanel(q);}}
        onMouseEnter={(e) => {if (!isSel) e.currentTarget.style.background = '#f8fafc';setRowHoverId(q.id);}}
        onMouseLeave={(e) => {if (!isSel) e.currentTarget.style.background = rowBg;setRowHoverId(null);}}
        style={{
          display: 'grid',
          gridTemplateColumns: QB_GRID,
          columnGap: 0,
          borderBottom: RB,
          cursor: 'pointer',
          background: rowBg,
          opacity: isFaculty && !isMyQuestion ? 0.72 : draggedQId === q.id ? 0.4 : 1,
          transition: 'background .12s',
          borderLeft: isPrivate ? '3px solid #a21caf' : '3px solid transparent'
        }}>
        
        {/* 1 · Checkbox */}
        <div className="qb-flex-center" style={{ borderRight: CB, padding: '10px 0' }}>
          <input
            type="checkbox"
            style={{ accentColor: br, cursor: 'pointer', width: 14, height: 14 }}
            checked={isSel}
            onClick={(e) => e.stopPropagation()}
            onChange={() => setSelected((prev) => {const n = new Set(prev);n.has(q.id) ? n.delete(q.id) : n.add(q.id);return n;})} />
          
        </div>

        {/* 2 · Question title + type */}
        <div className="qb-flex-col" style={{ borderRight: CB, padding: '10px 12px', minWidth: 0, justifyContent: 'center' }}>
          <div className="qb-flex-ac" style={{ alignItems: 'flex-start', gap: 5, minWidth: 0, marginBottom: 3 }}>
            {isPinned &&
            <i className="fa-solid fa-thumbtack" title="Click to unfix"
            onClick={(e) => {e.stopPropagation();togglePin(q.id);}}
            style={{ fontSize: 9, color: br, lineHeight: 1, transform: 'rotate(45deg)', flexShrink: 0, cursor: 'pointer', opacity: 0.85, marginTop: 2 }} />

            }
            <i
              className={isShortlisted ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}
              title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
              onClick={(e) => {e.stopPropagation();toggleShortlist();}}
              style={{ fontSize: 11, color: isShortlisted ? '#d97706' : '#94a3b8', lineHeight: 1, flexShrink: 0, cursor: 'pointer', marginTop: 2, opacity: isShortlisted || isRowHov ? 1 : 0, pointerEvents: isShortlisted || isRowHov ? 'auto' : 'none', transition: 'opacity 0.1s' }} />
            
            {isPrivate &&
            <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: '#fdf4ff', color: '#a21caf', border: '1px solid #f0abfc', flexShrink: 0, marginTop: 1 }}>
                <i className="fa-solid fa-lock-keyhole" style={{ fontSize: 8, marginRight: 3 }} />
                Private
              </span>
            }
            <span className="qb-ellipsis" style={{ fontSize: 13, fontWeight: 600, color: fg, flex: 1, lineHeight: 1.4 }}>{q.title}</span>
          </div>
          <div className="qb-flex-ac" style={{ gap: 4, flexWrap: 'nowrap', overflow: 'hidden' }}>
            <TypeBadge t={q.type} />
            {isFaculty && isRowHov && (
            isMyQuestion ?
            <span style={{ fontSize: 10, color: br, fontWeight: 700, padding: '1px 5px', background: QB.tint(br, 8), borderRadius: 4, flexShrink: 0 }}>Mine</span> :
            <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600, padding: '1px 5px', background: '#f1f5f9', borderRadius: 4, flexShrink: 0 }}>View only</span>)
            }
          </div>
        </div>

        {/* 3 · Status */}
        <div className="qb-flex-ac" style={{ borderRight: CB, padding: '10px 12px' }}>
          <StatusBadge s={q.status} />
        </div>

        {/* 4 · Difficulty */}
        <div className="qb-flex-ac" style={{ borderRight: CB, padding: '10px 12px' }}>
          <DiffBadge d={q.difficulty} />
        </div>

        {/* 5 · Creator */}
        <div className="qb-flex-ac" style={{ borderRight: CB, padding: '10px 12px', minWidth: 0 }}>
          <CreatorAvatar name={q.creator || q.collaborator} trustLevel={creatorTrustLevel} />
        </div>

        {/* 6 · Edited by */}
        <div className="qb-flex-ac" style={{ borderRight: CB, padding: '10px 12px', minWidth: 0 }}>
          <SmallAvatar name={q.lastEditedBy || q.collaborator || q.creator} />
        </div>

        {/* 7 · Usage */}
        <div className="qb-flex-center" style={{ borderRight: CB, padding: '10px 8px' }}>
          <span style={{ fontSize: 12, fontWeight: hasUsage ? 700 : 400, color: hasUsage ? fg : '#94a3b8' }}>
            {hasUsage ? `${usageCount}×` : '—'}
          </span>
        </div>

        {/* 8 · P-Bis */}
        <div className="qb-flex-ac" style={{ borderRight: CB, padding: '10px 8px', justifyContent: 'flex-end' }}>
          <PBisCell val={q.pbis ?? null} dir={q.pbisDir ?? null} />
        </div>

        {/* 9 · Actions — version button only when used */}
        <div className="qb-flex-ac" style={{ padding: '10px 6px', justifyContent: 'flex-end', gap: 2 }} onClick={(e) => e.stopPropagation()}>
          {hasUsage ?
          <button
            title="Version history"
            onClick={(e) => {e.stopPropagation();const rect = e.currentTarget.getBoundingClientRect();setVersionMenuPos({ x: rect.right, y: rect.bottom });setVersionPopoverId(isVersionOpen ? null : q.id);setRowMenuId(null);}}
            style={{ background: isVersionOpen ? QB.tint(br, 12) : '#f1f5f9', border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: 4, fontSize: 10, color: isVersionOpen ? br : mfg, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}
            onMouseEnter={(e) => {e.currentTarget.style.background = QB.tint(br, 8);e.currentTarget.style.color = br;}}
            onMouseLeave={(e) => {if (!isVersionOpen) {e.currentTarget.style.background = '#f1f5f9';e.currentTarget.style.color = mfg;}}}>
            
              <i className={`${isVersionOpen ? 'fa-solid' : 'fa-regular'} fa-clock-rotate-left`} style={{ fontSize: 9, lineHeight: 1 }} />{' '}V{q.version || 1}
            </button> :

          <span style={{ fontSize: 10, color: '#cbd5e1', padding: '2px 4px' }}>—</span>
          }
          <button
            onClick={(e) => {e.stopPropagation();const rect = e.currentTarget.getBoundingClientRect();setRowMenuPos({ x: rect.right, y: rect.bottom });setRowMenuId(isRowMenuOpen ? null : q.id);setVersionPopoverId(null);setStatusSubOpen(false);}}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: mfg, padding: 3, borderRadius: 4, display: 'flex', flexShrink: 0 }}
            onMouseEnter={(e) => {e.currentTarget.style.color = fg;e.currentTarget.style.background = '#f1f5f9';}}
            onMouseLeave={(e) => {e.currentTarget.style.color = mfg;e.currentTarget.style.background = 'none';}}>
            
            <i className={`${isRowMenuOpen ? 'fa-solid' : 'fa-regular'} fa-ellipsis`} style={{ fontSize: 13, lineHeight: 1 }} />
          </button>
        </div>
      </div>

      {/* ── VERSION POPOVER ── */}
      {isVersionOpen && versionMenuPos &&
      <Portal>
          <div onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} style={QB.popover(versionMenuPos.y + 4, window.innerWidth - versionMenuPos.x)}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Version History</div>
            {vHistory.map((v, idx) =>
          <div key={v.v} className="qb-flex-ac" style={{ gap: 8, padding: '7px 0', borderBottom: idx < vHistory.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: idx === 0 ? br : '#94a3b8', minWidth: 28 }}>V{v.v}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>{v.label}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{v.author} · {v.date}</div>
                </div>
                {idx === 0 && <span style={{ fontSize: 10, color: br, fontWeight: 700, alignSelf: 'center', flexShrink: 0, background: QB.tint(br, 10), padding: '2px 6px', borderRadius: 4 }}>Current</span>}
              </div>
          )}
          </div>
        </Portal>
      }

      {/* ── ROW CONTEXT MENU ── */}
      {isRowMenuOpen && rowMenuPos &&
      <Portal>
          <div style={{ position: 'fixed', inset: 0, zIndex: 9997 }} onClick={() => {setRowMenuId(null);setStatusSubOpen(false);}} />
          <div onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} style={{ ...QB.dropdown(rowMenuPos.y + 4, window.innerWidth - rowMenuPos.x), zIndex: 9998 }}>
            {/* Faculty ownership header */}
            {isFaculty &&
          <div className="qb-flex-ac" style={{ padding: '7px 14px', fontSize: 11, color: '#64748b', borderBottom: '1px solid #f1f5f9', marginBottom: 2, gap: 6, background: '#f8fafc' }}>
                <i className={`fa-regular ${isMyQuestion ? 'fa-user' : 'fa-user-lock'}`} style={{ fontSize: 11, color: '#94a3b8' }} />
                <span style={{ fontWeight: 500 }}>{isMyQuestion ? 'Your question' : 'View only — ' + q.creator}</span>
              </div>
          }
            {/* Read-only notice for used questions */}
            {hasUsage &&
          <div className="qb-flex-ac" style={{ padding: '6px 14px', fontSize: 11, color: '#92400e', borderBottom: '1px solid #fde68a', marginBottom: 2, gap: 6, background: '#fffbeb' }}>
                <i className="fa-solid fa-lock" style={{ fontSize: 10, color: '#d97706' }} />
                <span style={{ fontWeight: 500 }}>Used {usageCount}× — editing disabled</span>
              </div>
          }
            {rowMenuItems.map((item, i) => {
            if (!item) return <div key={i} className="qb-menu-sep" />;
            const it = item as {icon: string;label: string;action: () => void;danger?: boolean;amber?: boolean;green?: boolean;purple?: boolean;blue?: boolean;sub?: boolean;};
            const col = it.danger ? '#dc2626' : it.green ? '#059669' : it.purple ? '#a21caf' : it.blue ? '#2563eb' : it.amber ? '#7c3aed' : '#1e293b';
            const icol = it.danger ? '#dc2626' : it.green ? '#059669' : it.purple ? '#a21caf' : it.blue ? '#2563eb' : it.amber ? '#7c3aed' : '#475569';
            return (
              <div key={i} style={{ position: 'relative' }}>
                  <button onClick={it.action} className="qb-menu-btn" style={{ color: col, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className={`fa-regular fa-${it.icon}`}
                  style={{ fontSize: 13, color: icol, lineHeight: 1, width: 16, textAlign: 'center', flexShrink: 0, transform: it.icon === 'thumbtack' ? 'rotate(45deg)' : 'none' }} />
                  <span style={{ flex: 1 }}>{it.label}</span>
                    {it.sub && <i className="fa-regular fa-chevron-right" style={{ fontSize: 10, color: '#94a3b8' }} />}
                  </button>
                  {/* Status submenu */}
                  {it.sub && statusSubOpen && nextStatuses.length > 0 &&
                <div style={{ position: 'absolute', left: '100%', top: 0, background: 'white', border: `1px solid ${bdr}`, borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', minWidth: 140, padding: '4px 0', zIndex: 10000 }}>
                      <div style={{ padding: '4px 12px 3px', fontSize: 10, fontWeight: 700, color: mfg, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Set status</div>
                      {nextStatuses.map((s) =>
                  <button key={s} onClick={() => changeStatus(s)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: fg, fontSize: 12, textAlign: 'left' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                    
                          <i className="fa-regular fa-circle-dot" style={{ fontSize: 10, color: mfg }} /> {s}
                        </button>
                  )}
                    </div>
                }
                </div>);

          })}
          </div>
        </Portal>
      }
    </>);

}