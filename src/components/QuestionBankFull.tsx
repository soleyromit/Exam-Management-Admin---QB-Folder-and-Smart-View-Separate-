import React, { useMemo, useState, Fragment, useRef, useEffect } from 'react';
import { ImportWizardModal } from './ImportWizard';
import { NewQuestionModal } from './NewQuestionModal';
import { QuestionRowPanel } from './QuestionRowPanel';
import type { QRowData } from './QuestionRowPanel';
import {
  CreateSmartViewModal, EditSmartViewModal,
  ArchiveConfirmModal, DeleteConfirmModal,
  ShareFolderModal, AddToFolderModal,
  DEFAULT_CRITERIA } from
'./QBModals';
import type { SmartCriteria } from './QBModals';
import { FilterSheet } from './QBFilterSheet';
import type { FieldFilters } from './QBFilterSheet';
import { QS, INIT_FOLDERS, INIT_VIEWS, INIT_ASSIGNMENTS } from './QBData';
import type { Question, FolderNode, SVItem } from './QBData';
import { StatusBadge, TypeBadge, DiffBadge, PBisCell } from './QBHelpers';
import { ShareQuestionModal } from './ShareQuestionModal';

const CURRENT_USER = 'Dr. Patel';

const VERSION_HISTORY: Record<string, {v: number;label: string;date: string;author: string;}[]> = {
  'q1': [{ v: 2, label: 'Revised stem clarity', date: 'Apr 2, 2026', author: 'Dr. Patel' }, { v: 1, label: 'Initial creation', date: 'Jan 10, 2026', author: 'Dr. Patel' }],
  'q2': [{ v: 3, label: 'Updated answer key', date: 'Mar 15, 2026', author: 'Dr. Chen' }, { v: 2, label: 'Added distractors', date: 'Feb 1, 2026', author: 'Dr. Chen' }, { v: 1, label: 'Initial creation', date: 'Nov 5, 2025', author: 'Dr. Ramirez' }],
  'q3': [{ v: 2, label: 'Peer review edits', date: 'Mar 28, 2026', author: 'Dr. Lee' }, { v: 1, label: 'Initial creation', date: 'Dec 1, 2025', author: 'Dr. Lee' }]
};

function OwnerCell({ name }: {name: string;}) {
  const initials = name.replace('Dr. ', '').replace('Prof. ', '').
  split(' ').map((n) => n[0] || '').join('').slice(0, 2).toUpperCase();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
      <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--brand)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--brand-foreground)', flexShrink: 0 }}>{initials}</span>
      <span style={{ fontSize: 12, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
    </div>);

}

// ── InlineFolderInput: defined at MODULE LEVEL to prevent remount on re-render ──
function InlineFolderInput({
  parentId, depth = 0, activePid, name, onSetName, onConfirm, onCancel, inputRef, br, fg, mfg







}: {parentId: string | null;depth?: number;activePid: string | null | undefined;name: string;onSetName: (v: string) => void;onConfirm: () => void;onCancel: () => void;inputRef: React.RefObject<HTMLInputElement>;br: string;fg: string;mfg: string;}) {
  if (activePid !== parentId) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: `5px 8px 5px ${8 + depth * 14}px`, borderRadius: 6, marginBottom: 1, background: `color-mix(in oklch,${br} 6%,white)`, border: `1px solid ${br}` }}>
      <span style={{ width: 12, flexShrink: 0 }} />
      <i className="fa-regular fa-folder" style={{ fontSize: 12, color: br, flexShrink: 0, lineHeight: 1 }} />
      <input
        ref={inputRef} value={name}
        onChange={(e) => onSetName(e.target.value)}
        onKeyDown={(e) => {if (e.key === 'Enter') onConfirm();if (e.key === 'Escape') onCancel();}}
        onBlur={onConfirm}
        placeholder="Folder name…"
        style={{ flex: 1, fontSize: 12, border: 'none', outline: 'none', background: 'transparent', color: fg }} />
      
      <button onMouseDown={(e) => {e.preventDefault();onConfirm();}} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', color: br }}>
        <i className="fa-regular fa-circle-check" style={{ fontSize: 12, lineHeight: 1 }} />
      </button>
      <button onMouseDown={(e) => {e.preventDefault();onCancel();}} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', color: mfg }}>
        <i className="fa-regular fa-xmark" style={{ fontSize: 12, lineHeight: 1 }} />
      </button>
    </div>);

}

export function QuestionBankFull({
  onEditQuestion, leftOpen: leftOpenProp, onToggleLeft



}: {onEditQuestion?: () => void;onToggleSidebar?: () => void;leftOpen?: boolean;onToggleLeft?: () => void;}) {
  const [_lo, _slo] = useState(true);
  const leftOpen = leftOpenProp !== undefined ? leftOpenProp : _lo;
  const toggleLeft = () => {onToggleLeft ? onToggleLeft() : _slo((v) => !v);};

  const [questions] = useState<Question[]>(QS);
  const [folders, setFolders] = useState<FolderNode[]>(INIT_FOLDERS);
  const [views, setViews] = useState<SVItem[]>(INIT_VIEWS);
  const [assignments, setAssignments] = useState(INIT_ASSIGNMENTS);

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['f-pharm', 'f-courses']));
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [inlineFolderParentId, setInlineFolderParentId] = useState<string | null | undefined>(undefined);
  const [inlineFolderName, setInlineFolderName] = useState('');
  const inlineInputRef = useRef<HTMLInputElement>(null);
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renamingFolderName, setRenamingFolderName] = useState('');
  const [folderMenuId, setFolderMenuId] = useState<string | null>(null);
  const [rowMenuId, setRowMenuId] = useState<string | null>(null);
  const [versionPopoverId, setVersionPopoverId] = useState<string | null>(null);
  const [dragFolderId, setDragFolderId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [draggedQId, setDraggedQId] = useState<string | null>(null);
  const [dragQOverFolderId, setDragQOverFolderId] = useState<string | null>(null);
  const [activeTabId, setActiveTabId] = useState('qa-all');
  const [hoverTabId, setHoverTabId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [fieldFilters, setFieldFilters] = useState<FieldFilters>({});
  const [sortBy] = useState<'title' | 'age' | 'status'>('title');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selected, setSelected] = useState(new Set<string>());
  const [rowHoverId, setRowHoverId] = useState<string | null>(null);
  const [pinnedQIds, setPinnedQIds] = useState<Set<string>>(new Set());

  // Tab context menu + inline rename
  const [tabCtxMenu, setTabCtxMenu] = useState<{id: string;x: number;y: number;} | null>(null);
  const [renamingTabId, setRenamingTabId] = useState<string | null>(null);
  const [renamingTabName, setRenamingTabName] = useState('');

  const [rowPanel, setRowPanel] = useState<Question | null>(null);
  const [newQuestionOpen, setNewQuestionOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [createSVOpen, setCreateSVOpen] = useState(false);
  const [editSV, setEditSV] = useState<SVItem | null>(null);
  const [archiveFolder, setArchiveFolder] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<{id: string;name: string;type: 'folder' | 'smart view';} | null>(null);
  const [shareTarget, setShareTarget] = useState<{name: string;type: 'folder' | 'view';} | null>(null);
  const [addToFolderOpen, setAddToFolderOpen] = useState(false);
  const [selectedQForFolder, setSelectedQForFolder] = useState<string | null>(null);
  const [shareQId, setShareQId] = useState<string | null>(null);

  useEffect(() => {
    if (inlineFolderParentId !== undefined) setTimeout(() => inlineInputRef.current?.focus(), 50);
  }, [inlineFolderParentId]);

  const getChildIds = (fid: string): string[] => {
    const ch = folders.filter((f) => f.parentId === fid);
    return [fid, ...ch.flatMap((c) => getChildIds(c.id))];
  };
  const getFolderQIds = (fid: string) => {
    const ids = getChildIds(fid);
    return [...new Set(ids.flatMap((id) => assignments[id] || []))];
  };

  const allValues = useMemo(() => ({
    folder: [...new Set(questions.map((q) => q.folder).filter(Boolean))].sort() as string[],
    type: [...new Set(questions.map((q) => q.type))].sort() as string[],
    status: [...new Set(questions.map((q) => q.status))].sort() as string[],
    difficulty: ['Easy', 'Medium', 'Hard'] as string[],
    blooms: [...new Set(questions.map((q) => q.blooms).filter(Boolean))].sort() as string[],
    tags: [...new Set(questions.flatMap((q) => q.tags || []))].sort() as string[],
    collaborator: [...new Set(questions.map((q) => q.collaborator).filter((c): c is string => !!c))].sort() as string[]
  }), [questions]);

  const myCount = useMemo(() => questions.filter((q) => q.collaborator === CURRENT_USER).length, [questions]);

  const filteredQuestions = useMemo(() => {
    let r = [...questions];
    if (selectedFolder) {const qIds = new Set(getFolderQIds(selectedFolder));r = r.filter((q) => qIds.has(q.id));}
    if (activeTabId === 'qa-my') {r = r.filter((q) => q.collaborator === CURRENT_USER);} else
    if (activeTabId !== 'qa-all') {
      const sv = views.find((v) => v.id === activeTabId);
      if (sv) {const c = sv.criteria;
        if (c.difficulties?.length) r = r.filter((q) => c.difficulties.includes(q.difficulty || ''));
        if (c.blooms?.length) r = r.filter((q) => c.blooms.includes(q.blooms || ''));
        if (c.types?.length) r = r.filter((q) => c.types.includes(q.type || ''));
        if (c.tags?.length) r = r.filter((q) => c.tags!.some((t) => (q.tags || []).includes(t)));
        if (c.usage === 'never') r = r.filter((q) => (q.usage ?? 0) === 0);
        if (c.usage === 'low') r = r.filter((q) => (q.usage ?? 0) >= 1 && (q.usage ?? 0) <= 2);
        if (c.usage === 'multi') r = r.filter((q) => (q.usage ?? 0) >= 3);
        if (c.pbis === 'low') r = r.filter((q) => q.pbis !== null && q.pbis < 0.3);
        if (c.pbis === 'very-low') r = r.filter((q) => q.pbis !== null && q.pbis < 0.2);
        if (c.pbis === 'high') r = r.filter((q) => q.pbis !== null && q.pbis >= 0.4);
      }
    }
    if (searchText.trim()) {const s = searchText.toLowerCase();r = r.filter((q) => (q.title || '').toLowerCase().includes(s) || (q.code || '').toLowerCase().includes(s));}
    Object.entries(fieldFilters).forEach(([field, vals]) => {
      if (!vals || !vals.length) return;
      if (field === 'tags') r = r.filter((q) => vals.some((v) => (q.tags || []).includes(v)));else
      r = r.filter((q) => vals.includes((q as any)[field] || ''));
    });
    return r.sort((a, b) => {
      const aP = pinnedQIds.has(a.id) ? 0 : 1,bP = pinnedQIds.has(b.id) ? 0 : 1;
      if (aP !== bP) return aP - bP;
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'age') return (a.age || '').localeCompare(b.age || '');
      return (a.status || '').localeCompare(b.status || '');
    });
  }, [questions, selectedFolder, activeTabId, views, searchText, fieldFilters, sortBy, assignments, folders, pinnedQIds]);

  const togglePin = (id: string) => setPinnedQIds((prev) => {const n = new Set(prev);n.has(id) ? n.delete(id) : n.add(id);return n;});
  const toggleFolderExpand = (id: string) => setExpandedFolders((prev) => {const n = new Set(prev);n.has(id) ? n.delete(id) : n.add(id);return n;});

  const handleInlineFolderCreate = () => {
    const name = inlineFolderName.trim();
    if (!name) {setInlineFolderParentId(undefined);setInlineFolderName('');return;}
    const newId = `f-${Date.now()}`;
    setFolders((prev) => [...prev, { id: newId, name, parentId: inlineFolderParentId ?? null, count: 0 }]);
    if (inlineFolderParentId) setExpandedFolders((prev) => new Set([...prev, inlineFolderParentId]));
    setInlineFolderParentId(undefined);setInlineFolderName('');
  };
  const cancelInlineFolder = () => {setInlineFolderParentId(undefined);setInlineFolderName('');};

  const handleFolderRename = (fid: string) => {
    const name = renamingFolderName.trim();
    if (name) setFolders((prev) => prev.map((f) => f.id === fid ? { ...f, name } : f));
    setRenamingFolderId(null);setRenamingFolderName('');
  };

  const handleReorderFolders = (dragId: string, dropId: string) => {
    const dragF = folders.find((f) => f.id === dragId),dropF = folders.find((f) => f.id === dropId);
    if (!dragF || !dropF || dragF.parentId !== dropF.parentId) return;
    setFolders((prev) => {
      const pid = dragF.parentId;
      const siblings = prev.filter((f) => f.parentId === pid),others = prev.filter((f) => f.parentId !== pid);
      const fi = siblings.findIndex((f) => f.id === dragId),ti = siblings.findIndex((f) => f.id === dropId);
      if (fi < 0 || ti < 0) return prev;
      const r = [...siblings];const [m] = r.splice(fi, 1);r.splice(ti, 0, m);
      return [...others, ...r];
    });
  };

  const handleCreateSV = (name: string, criteria: SmartCriteria) => {
    const sv: SVItem = { id: `sv-${Date.now()}`, name, count: 0, isDefault: false, autoUpdate: criteria.autoUpdate, criteria };
    setViews((prev) => [...prev, sv]);setCreateSVOpen(false);setActiveTabId(sv.id);
  };
  const handleSaveAsView = (name: string) => {
    const sv: SVItem = { id: `sv-flt-${Date.now()}`, name, count: filteredQuestions.length, isDefault: false, autoUpdate: false, criteria: { ...DEFAULT_CRITERIA, autoUpdate: false } };
    setViews((prev) => [...prev, sv]);setFieldFilters({});setFilterSheetOpen(false);setActiveTabId(sv.id);
  };
  const handleDeleteTab = (id: string) => {
    setViews((prev) => prev.filter((v) => v.id !== id));
    if (activeTabId === id) setActiveTabId('qa-all');
  };

  // Tab rename / reorder
  const saveTabRename = () => {
    if (renamingTabId && renamingTabName.trim())
    setViews((p) => p.map((v) => v.id === renamingTabId ? { ...v, name: renamingTabName.trim() } : v));
    setRenamingTabId(null);
  };
  const moveTab = (id: string, dir: -1 | 1) => {
    setViews((prev) => {
      const idx = prev.findIndex((v) => v.id === id);if (idx < 0) return prev;
      const ni = Math.max(0, Math.min(prev.length - 1, idx + dir));if (ni === idx) return prev;
      const arr = [...prev];const [m] = arr.splice(idx, 1);arr.splice(ni, 0, m);return arr;
    });
    setTabCtxMenu(null);
  };

  const assignedFolderIds = useMemo(() => {
    const tid = selectedQForFolder || (selected.size === 1 ? [...selected][0] : null);
    if (!tid) return [];
    return Object.entries(assignments).filter(([, ids]) => ids.includes(tid)).map(([fid]) => fid);
  }, [selectedQForFolder, selected, assignments]);

  const toQRowData = (q: Question): QRowData => ({
    id: q.id, stem: q.title || '', type: q.type || '', status: q.status || '',
    blooms: q.blooms || '', difficulty: q.difficulty || '', topic: q.folder || '',
    owner: q.collaborator || 'Faculty', pbis: q.pbis ?? null, version: q.version || 1,
    folder: q.folder || '', tags: q.tags || [], usageCount: q.usage ?? 0,
    updatedAt: q.age || '', options: []
  });

  const br = 'var(--brand)',bdr = 'var(--border)',fg = 'var(--foreground)',mfg = 'var(--muted-foreground)',surf = 'var(--surface)',fh = 'var(--font-heading)';
  const rootFolders = folders.filter((f) => !f.parentId);
  const childFolders = (pid: string) => folders.filter((f) => f.parentId === pid);
  const allSelectedPinned = selected.size > 0 && [...selected].every((id) => pinnedQIds.has(id));
  const tabItems = [
  { id: 'qa-all', name: 'All Questions', count: questions.length, isSystem: true },
  { id: 'qa-my', name: 'My Questions', count: myCount, isSystem: true },
  ...views.map((v) => ({ id: v.id, name: v.name, count: v.count, isSystem: false }))];


  // ── FolderRow ───────────────────────────────────────────────────────────────
  function FolderRow({ f, depth = 0 }: {f: FolderNode;depth?: number;}) {
    const isExpanded = expandedFolders.has(f.id),isSelected = selectedFolder === f.id;
    const children = childFolders(f.id);
    const [hov, setHov] = useState(false);
    const isRenaming = renamingFolderId === f.id;
    const isDragQOver = dragQOverFolderId === f.id,isFDragOver = dragOverFolderId === f.id;
    const showGrip = hov && !f.locked && !isRenaming;
    const lockFolder = () => {setFolders((p) => p.map((x) => x.id === f.id ? { ...x, locked: true } : x));setFolderMenuId(null);};
    const unlockFolder = () => {setFolders((p) => p.map((x) => x.id === f.id ? { ...x, locked: false } : x));setFolderMenuId(null);};
    return (
      <Fragment>
        <div
          draggable={!isRenaming && !f.locked}
          onDragStart={(e) => {setDragFolderId(f.id);e.dataTransfer.effectAllowed = 'move';}}
          onDragEnd={() => {setDragFolderId(null);setDragOverFolderId(null);}}
          onDragOver={(e) => {
            if (draggedQId) {e.preventDefault();e.stopPropagation();setDragQOverFolderId(f.id);return;}
            if (dragFolderId && dragFolderId !== f.id) {const df = folders.find((ff) => ff.id === dragFolderId);if (df?.parentId === f.parentId) {e.preventDefault();setDragOverFolderId(f.id);}}
          }}
          onDragLeave={() => {
            if (dragQOverFolderId === f.id) setDragQOverFolderId(null);
            if (dragOverFolderId === f.id) setDragOverFolderId(null);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedQId) {setAssignments((prev) => {const n = { ...prev };n[f.id] = [...new Set([...(n[f.id] || []), draggedQId!])];return n;});setDraggedQId(null);setDragQOverFolderId(null);if (!isExpanded) toggleFolderExpand(f.id);return;}
            if (dragFolderId && dragFolderId !== f.id) {handleReorderFolders(dragFolderId, f.id);setDragFolderId(null);setDragOverFolderId(null);}
          }}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => {
            setHov(false);
            // Fix: clear context menu when mouse leaves so it doesn't re-appear on next hover
            if (folderMenuId === f.id) setFolderMenuId(null);
          }}
          onClick={() => {if (isRenaming) return;setFolderMenuId(null);setSelectedFolder(f.id);setActiveTabId('qa-all');}}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: `5px 8px 5px ${8 + depth * 14}px`,
            borderRadius: 6, cursor: 'pointer', marginBottom: 1,
            background: isDragQOver ? `color-mix(in oklch,${br} 18%,white)` : isFDragOver ? `color-mix(in oklch,${br} 10%,white)` : isSelected ? `color-mix(in oklch,${br} 10%,white)` : hov ? 'var(--accent)' : 'transparent',
            outline: isDragQOver ? `2px dashed ${br}` : 'none', transition: 'background .1s'
          }}>
          
          {/* Grip: always in layout, only visible on hover — prevents shift */}
          <span style={{ width: 12, flexShrink: 0, display: 'flex', alignItems: 'center', visibility: showGrip ? 'visible' : 'hidden', cursor: showGrip ? 'grab' : 'default', color: mfg, opacity: 0.55 }}>
            <i className="fa-regular fa-grip-vertical" style={{ fontSize: 10, lineHeight: 1 }} />
          </span>
          <button onClick={(e) => {e.stopPropagation();if (!f.locked) toggleFolderExpand(f.id);}} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', color: mfg, flexShrink: 0 }}>
            {children.length > 0 ? isExpanded ?
            <i className="fa-regular fa-chevron-down" style={{ fontSize: 11, lineHeight: 1 }} /> :
            <i className="fa-regular fa-chevron-right" style={{ fontSize: 11, lineHeight: 1 }} /> :
            <span style={{ width: 12 }} />}
          </button>
          {f.locked ?
          <i className="fa-solid fa-lock" style={{ fontSize: 11, color: '#f59e0b', flexShrink: 0 }} /> :
          isExpanded ?
          <i className="fa-solid fa-folder-open" style={{ fontSize: 12, color: br, flexShrink: 0 }} /> :
          <i className={`${hov || isSelected ? 'fa-solid' : 'fa-regular'} fa-folder`} style={{ fontSize: 12, color: hov || isSelected ? br : mfg, flexShrink: 0 }} />
          }
          {isRenaming ?
          <input autoFocus value={renamingFolderName}
          onChange={(e) => setRenamingFolderName(e.target.value)}
          onKeyDown={(e) => {if (e.key === 'Enter') handleFolderRename(f.id);if (e.key === 'Escape') {setRenamingFolderId(null);setRenamingFolderName('');}}}
          onBlur={() => handleFolderRename(f.id)}
          onClick={(e) => e.stopPropagation()}
          style={{ flex: 1, fontSize: 12, border: `1px solid ${br}`, borderRadius: 4, padding: '1px 4px', outline: 'none', background: 'white', color: fg, minWidth: 0 }} /> :


          <span style={{ flex: 1, fontSize: 12, fontWeight: isSelected ? 600 : 400, color: f.locked ? mfg : isSelected ? br : fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, fontStyle: f.locked ? 'italic' : 'normal' }}>{f.name}</span>
          }
          <span style={{ fontSize: 11, color: mfg, flexShrink: 0 }}>{f.count}</span>
          {hov && !isRenaming &&
          <div style={{ position: 'relative', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
              <button
              onClick={(e) => {e.stopPropagation();setFolderMenuId(folderMenuId === f.id ? null : f.id);}}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: 4, display: 'flex', color: mfg }}
              onMouseEnter={(e) => e.currentTarget.style.color = fg}
              onMouseLeave={(e) => e.currentTarget.style.color = mfg}>
              
                <i className={`${folderMenuId === f.id ? 'fa-solid' : 'fa-regular'} fa-ellipsis`} style={{ fontSize: 13, lineHeight: 1 }} />
              </button>
              {folderMenuId === f.id &&
            <div onMouseDown={(e) => e.stopPropagation()} style={{ position: 'absolute', right: 0, top: '100%', marginTop: 2, background: 'var(--card)', border: `1px solid ${bdr}`, borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', minWidth: 172, zIndex: 100, overflow: 'hidden', paddingTop: 4, paddingBottom: 4 }}>
                  {f.locked ?
              <>
                      <div style={{ padding: '6px 12px 4px', fontSize: 10, fontWeight: 700, color: mfg, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Locked</div>
                      <button onClick={unlockFolder} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: fg, fontSize: 12, textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                        <i className="fa-regular fa-lock-open" style={{ fontSize: 12, color: '#f59e0b', lineHeight: 1 }} />Unlock folder
                      </button>
                    </> :

              [
              { icon: 'pen', label: 'Rename', action: () => {setRenamingFolderId(f.id);setRenamingFolderName(f.name);setFolderMenuId(null);} },
              { icon: 'folder-plus', label: 'Add Subfolder', action: () => {setExpandedFolders((p) => new Set([...p, f.id]));setInlineFolderParentId(f.id);setInlineFolderName('');setFolderMenuId(null);} },
              { icon: 'share-nodes', label: 'Share', action: () => {setShareTarget({ name: f.name, type: 'folder' });setFolderMenuId(null);} },
              'divider',
              { icon: 'lock', label: 'Lock folder', action: lockFolder, amber: true },
              'divider',
              { icon: 'box-archive', label: 'Archive', action: () => {setArchiveFolder(f.id);setFolderMenuId(null);} },
              { icon: 'trash-can', label: 'Delete', action: () => {setDeleteItem({ id: f.id, name: f.name, type: 'folder' });setFolderMenuId(null);}, danger: true }].
              map((item, i) => {
                if (item === 'divider') return <div key={i} style={{ borderTop: `1px solid ${bdr}`, margin: '4px 0' }} />;
                const it = item as {icon: string;label: string;action: () => void;danger?: boolean;amber?: boolean;};
                const col = it.danger ? '#ef4444' : it.amber ? '#f59e0b' : fg;
                const icol = it.danger ? '#ef4444' : it.amber ? '#f59e0b' : mfg;
                return <button key={i} onClick={it.action} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: col, fontSize: 12, textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                        <i className={`fa-regular fa-${it.icon}`} style={{ fontSize: 12, color: icol, lineHeight: 1 }} />{it.label}
                      </button>;
              })
              }
                </div>
            }
            </div>
          }
        </div>
        {isExpanded && <InlineFolderInput parentId={f.id} depth={depth + 1} activePid={inlineFolderParentId} name={inlineFolderName} onSetName={setInlineFolderName} onConfirm={handleInlineFolderCreate} onCancel={cancelInlineFolder} inputRef={inlineInputRef} br={br} fg={fg} mfg={mfg} />}
        {isExpanded && children.map((c) => <FolderRow key={c.id} f={c} depth={depth + 1} />)}
      </Fragment>);

  }

  return (
    <div
      style={{ display: 'flex', height: '100%', overflow: 'hidden', background: 'white', position: 'relative' }}
      onClick={() => {setFolderMenuId(null);setRowMenuId(null);setVersionPopoverId(null);setTabCtxMenu(null);}}>
      
      {/* ── LEFT SIDEBAR ── */}
      {leftOpen &&
      <div style={{ width: 252, flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${bdr}`, background: 'white', overflow: 'hidden' }}>
          {/* Sidebar header — no toggle button here; toggle lives in breadcrumb bar */}
          <div style={{ padding: '0 12px', height: 40, borderBottom: `1px solid ${bdr}`, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: fg, fontFamily: fh, letterSpacing: '-0.01em' }}>Library</span>
          </div>
          <div style={{ padding: '6px 8px', borderBottom: `1px solid ${bdr}`, flexShrink: 0 }}>
            {[{ id: 'qa-all', label: 'All Questions', faIcon: 'book-open', count: questions.length }].map((item) => {
            const isA = activeTabId === item.id && !selectedFolder;
            return (
              <div key={item.id} onClick={() => {setSelectedFolder(null);setActiveTabId(item.id);}}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 6, cursor: 'pointer', marginBottom: 1, background: isA ? `color-mix(in oklch,${br} 8%,white)` : 'transparent' }}
              onMouseEnter={(e) => {if (!isA) e.currentTarget.style.background = 'var(--accent)';}}
              onMouseLeave={(e) => {if (!isA) e.currentTarget.style.background = 'transparent';}}>
                
                  <i className={`${isA ? 'fa-solid' : 'fa-regular'} fa-${item.faIcon}`} style={{ fontSize: 13, color: isA ? br : mfg, lineHeight: 1 }} />
                  <span style={{ flex: 1, fontSize: 12, fontWeight: isA ? 600 : 400, color: isA ? br : fg }}>{item.label}</span>
                  <span style={{ fontSize: 11, color: mfg }}>{item.count}</span>
                </div>);

          })}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 8px 6px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: mfg }}>Folders</span>
              <button onClick={() => {setInlineFolderParentId(null);setInlineFolderName('');}} style={{ background: 'none', border: 'none', cursor: 'pointer', color: mfg, padding: 2, borderRadius: 4, display: 'flex' }} onMouseEnter={(e) => e.currentTarget.style.color = fg} onMouseLeave={(e) => e.currentTarget.style.color = mfg}>
                <i className="fa-regular fa-plus" style={{ fontSize: 12, lineHeight: 1 }} />
              </button>
            </div>
            {rootFolders.map((f) => <FolderRow key={f.id} f={f} />)}
            <InlineFolderInput parentId={null} depth={0} activePid={inlineFolderParentId} name={inlineFolderName} onSetName={setInlineFolderName} onConfirm={handleInlineFolderCreate} onCancel={cancelInlineFolder} inputRef={inlineInputRef} br={br} fg={fg} mfg={mfg} />
            <button onClick={() => {setInlineFolderParentId(null);setInlineFolderName('');}} style={{ width: '100%', padding: '5px 8px 5px 22px', background: 'none', border: 'none', cursor: 'pointer', color: mfg, fontSize: 12, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }} onMouseEnter={(e) => e.currentTarget.style.color = fg} onMouseLeave={(e) => e.currentTarget.style.color = mfg}>
              <i className="fa-regular fa-plus" style={{ fontSize: 11, lineHeight: 1 }} /> New Folder
            </button>
          </div>
        </div>
      }

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden', background: 'white' }}>

        {/* ── BREADCRUMB NAV BAR ── */}
        <div style={{ padding: '0 16px', height: 40, borderBottom: `1px solid ${bdr}`, display: 'flex', alignItems: 'center', gap: 0, background: 'white', flexShrink: 0 }}>
          {/* Sidebar toggle — always visible here */}
          <button onClick={toggleLeft} title={leftOpen ? 'Close sidebar' : 'Open sidebar'}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: mfg, padding: '4px 6px', borderRadius: 4, display: 'flex', flexShrink: 0 }}
          onMouseEnter={(e) => e.currentTarget.style.color = fg}
          onMouseLeave={(e) => e.currentTarget.style.color = mfg}>
            
            <i className="fa-regular fa-table-columns" style={{ fontSize: 14, lineHeight: 1 }} />
          </button>
          {/* Separator */}
          <span style={{ color: bdr, fontSize: 18, lineHeight: 1, margin: '0 8px', userSelect: 'none', flexShrink: 0 }}>|</span>
          {/* Breadcrumb title */}
          <span style={{ fontSize: 13, fontWeight: 500, color: fg, fontFamily: fh, letterSpacing: '-0.01em' }}>
            {selectedFolder ? folders.find((f) => f.id === selectedFolder)?.name || 'Question Bank' : 'Question Bank'}
          </span>
          {selectedFolder && folders.find((f) => f.id === selectedFolder)?.locked &&
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '1px 7px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', marginLeft: 8, flexShrink: 0 }}>
              <i className="fa-solid fa-lock" style={{ fontSize: 9 }} /> Locked
            </span>
          }
          <div style={{ flex: 1 }} />
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, border: `1px solid ${bdr}`, background: surf, minWidth: 180 }}>
            <i className="fa-regular fa-magnifying-glass" style={{ fontSize: 12, color: mfg, flexShrink: 0, lineHeight: 1 }} />
            <input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search questions…"
            style={{ background: 'transparent', border: 'none', outline: 'none', color: fg, fontSize: 12, flex: 1, minWidth: 0 }} />
          </div>
          <div style={{ width: 6 }} />
          {/* Filter */}
          <button onClick={() => setFilterSheetOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 6, border: `1px solid ${Object.keys(fieldFilters).length ? br : bdr}`, background: Object.keys(fieldFilters).length ? `color-mix(in oklch,${br} 8%,white)` : 'transparent', color: Object.keys(fieldFilters).length ? br : fg, cursor: 'pointer', fontSize: 12, flexShrink: 0, fontWeight: Object.keys(fieldFilters).length ? 600 : 400 }}>
            <i className={`${Object.keys(fieldFilters).length ? 'fa-solid' : 'fa-regular'} fa-sliders`} style={{ fontSize: 12, lineHeight: 1 }} />
            Filter{Object.keys(fieldFilters).length > 0 ? ` (${Object.keys(fieldFilters).length})` : ''}
          </button>
          <div style={{ width: 6 }} />
          {/* Import */}
          <button onClick={() => setImportOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 6, border: `1px solid ${bdr}`, background: 'transparent', color: fg, cursor: 'pointer', fontSize: 12, flexShrink: 0 }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            
            <i className="fa-regular fa-arrow-up-from-bracket" style={{ fontSize: 12, lineHeight: 1 }} /> Import
          </button>
          <div style={{ width: 6 }} />
          {/* New Question */}
          <button onClick={() => setNewQuestionOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 6, background: br, color: 'var(--brand-foreground)', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
            <i className="fa-regular fa-plus" style={{ fontSize: 13, lineHeight: 1 }} /> Question
          </button>
        </div>

        {/* ── TAB BAR (Notion-style) ── */}
        <div style={{ display: 'flex', alignItems: 'stretch', borderBottom: `1px solid ${bdr}`, background: 'white', flexShrink: 0, paddingLeft: 4, overflowX: 'auto' }}>
          {tabItems.map((tab) => {
            const isActive = activeTabId === tab.id,isHov = hoverTabId === tab.id,isMy = tab.id === 'qa-my';
            const isRenaming = renamingTabId === tab.id;
            return (
              <div key={tab.id}
              onClick={(e) => {if (isRenaming) {e.stopPropagation();return;}setActiveTabId(tab.id);}}
              onContextMenu={(e) => {
                e.preventDefault();
                if (!tab.isSystem) setTabCtxMenu({ id: tab.id, x: e.clientX, y: e.clientY });
              }}
              onMouseEnter={() => setHoverTabId(tab.id)}
              onMouseLeave={() => setHoverTabId(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 4px 0 10px', height: 36, borderBottom: isActive ? `2px solid ${br}` : '2px solid transparent', cursor: 'pointer', userSelect: 'none', marginBottom: -1, flexShrink: 0, color: isActive ? br : isHov ? fg : mfg, position: 'relative' }}>
                
                {isMy && <i className={`${isActive ? 'fa-solid' : 'fa-regular'} fa-user`} style={{ fontSize: 11, lineHeight: 1 }} />}
                {!isMy && !tab.isSystem && <i className={`${isActive ? 'fa-solid' : 'fa-regular'} fa-eye`} style={{ fontSize: 10, lineHeight: 1 }} />}
                {isRenaming ?
                <input
                  autoFocus
                  value={renamingTabName}
                  onChange={(e) => setRenamingTabName(e.target.value)}
                  onKeyDown={(e) => {if (e.key === 'Enter') {saveTabRename();};if (e.key === 'Escape') setRenamingTabId(null);}}
                  onBlur={saveTabRename}
                  onClick={(e) => e.stopPropagation()}
                  style={{ fontSize: 12, fontWeight: 600, border: 'none', outline: `2px solid ${br}`, borderRadius: 3, background: 'white', color: br, padding: '0 4px', minWidth: 60, width: `${Math.max(60, (renamingTabName.length + 1) * 7.5)}px` }} /> :


                <span style={{ fontSize: 12, fontWeight: isActive ? 600 : 400 }}>{tab.name}</span>
                }
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8, background: isActive ? br : 'var(--muted)', color: isActive ? 'var(--brand-foreground)' : mfg, fontSize: 9, fontWeight: 600 }}>{tab.count}</span>
                {/* Notion-style chevron on hover for custom tabs */}
                {!tab.isSystem && (isActive || isHov) && !isRenaming &&
                <button
                  title="Tab options"
                  onClick={(e) => {e.stopPropagation();setTabCtxMenu({ id: tab.id, x: e.currentTarget.getBoundingClientRect().left, y: e.currentTarget.getBoundingClientRect().bottom + 2 });}}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: mfg, padding: '2px 3px', borderRadius: 3, display: 'flex', marginLeft: 1 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = br}
                  onMouseLeave={(e) => e.currentTarget.style.color = mfg}>
                  
                    <i className="fa-regular fa-chevron-down" style={{ fontSize: 9, lineHeight: 1 }} />
                  </button>
                }
              </div>);

          })}
          <button title="New Smart View" onClick={() => setCreateSVOpen(true)}
          style={{ display: 'flex', alignItems: 'center', padding: '0 10px', height: 36, background: 'none', border: 'none', cursor: 'pointer', color: mfg, flexShrink: 0, fontSize: 12, gap: 4 }}
          onMouseEnter={(e) => {(e.currentTarget as HTMLButtonElement).style.color = br;}}
          onMouseLeave={(e) => {(e.currentTarget as HTMLButtonElement).style.color = mfg;}}>
            <i className="fa-regular fa-plus" style={{ fontSize: 12, lineHeight: 1 }} />
          </button>
        </div>

        {/* ── TABLE ── */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '28px 44px 1fr 90px 90px 76px 130px 56px 90px', gap: 8, padding: '8px 16px', borderBottom: `1px solid ${bdr}`, background: surf, position: 'sticky', top: 0, zIndex: 1 }}>
            <input type="checkbox" style={{ accentColor: br, cursor: 'pointer', margin: 'auto' }}
            checked={selected.size > 0 && selected.size === filteredQuestions.length}
            onChange={() => {if (selected.size === filteredQuestions.length) setSelected(new Set());else setSelected(new Set(filteredQuestions.map((q) => q.id)));}} />
            
            <span />
            {['Question', 'Type', 'Status', 'Difficulty', 'Owner', 'P-Bis', ''].map((h, i) =>
            <span key={i} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: mfg, display: 'flex', alignItems: 'center' }}>{h}</span>
            )}
          </div>
          {filteredQuestions.length === 0 ?
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 240, gap: 8, color: mfg }}>
              <i className="fa-regular fa-magnifying-glass" style={{ fontSize: 28, opacity: .3, lineHeight: 1 }} />
              <span style={{ fontSize: 13 }}>No questions match the current filters</span>
            </div> :

          filteredQuestions.map((q) => {
            const isSel = selected.has(q.id),isRowMenuOpen = rowMenuId === q.id,isVersionOpen = versionPopoverId === q.id;
            const isRowHov = rowHoverId === q.id,isPinned = pinnedQIds.has(q.id);
            const vHistory = VERSION_HISTORY[q.id] || [{ v: q.version || 1, label: 'Current version', date: q.age || 'Recently', author: q.collaborator || 'Faculty' }];
            const collabInitials = q.collaborator ? q.collaborator.replace('Dr. ', '').replace('Prof. ', '').split(' ').map((n: string) => n[0] || '').join('').slice(0, 2).toUpperCase() : '';
            return (
              <div key={q.id}
              draggable
              onDragStart={(e) => {setDraggedQId(q.id);e.dataTransfer.effectAllowed = 'copy';}}
              onDragEnd={() => {setDraggedQId(null);setDragQOverFolderId(null);}}
              onClick={() => {setRowMenuId(null);setVersionPopoverId(null);setRowPanel(q);}}
              onMouseEnter={(e) => {if (!isSel) e.currentTarget.style.background = 'var(--surface)';setRowHoverId(q.id);}}
              onMouseLeave={(e) => {if (!isSel) e.currentTarget.style.background = 'white';setRowHoverId(null);}}
              style={{ display: 'grid', gridTemplateColumns: '28px 44px 1fr 90px 90px 76px 130px 56px 90px', gap: 8, padding: '9px 16px', borderBottom: `1px solid ${bdr}`, cursor: 'pointer', alignItems: 'center', background: isSel ? `color-mix(in oklch,${br} 4%,white)` : isPinned ? `color-mix(in oklch,${br} 2%,white)` : 'white', borderLeft: isPinned ? `3px solid ${br}` : '3px solid transparent', transition: 'background .1s', opacity: draggedQId === q.id ? 0.4 : 1 }}>
                
                  <input type="checkbox" style={{ accentColor: br, cursor: 'pointer', margin: 'auto' }} checked={isSel}
                onClick={(e) => e.stopPropagation()}
                onChange={() => setSelected((prev) => {const n = new Set(prev);n.has(q.id) ? n.delete(q.id) : n.add(q.id);return n;})} />
                
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 0 }}>
                    {isPinned && <i className="fa-solid fa-thumbtack" title="Click to unfix" onClick={(e) => {e.stopPropagation();togglePin(q.id);}} style={{ fontSize: 8, color: br, lineHeight: 1, transform: 'rotate(45deg)', flexShrink: 0, cursor: 'pointer', opacity: 0.85 }} />}
                    <span style={{ fontSize: 10, color: mfg, fontFamily: 'var(--font-mono)', letterSpacing: '0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.code}</span>
                  </div>
                  <div style={{ minWidth: 0, position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.title}</div>
                      {q.tags && q.tags.length > 0 &&
                    <div style={{ display: 'flex', gap: 4, marginTop: 3, flexWrap: 'nowrap', overflow: 'hidden' }}>
                          {q.tags.slice(0, 3).map((tag) => <span key={tag} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 10, background: 'var(--muted)', color: mfg, whiteSpace: 'nowrap' }}>{tag}</span>)}
                          {q.tags.length > 3 && <span style={{ fontSize: 10, color: mfg }}>+{q.tags.length - 3}</span>}
                        </div>
                    }
                    </div>
                    {isRowHov &&
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0, paddingLeft: 8, background: 'linear-gradient(to right,transparent,var(--surface) 25%)' }} onClick={(e) => {e.stopPropagation();setShareQId(q.id);}}>
                        {q.collaborator && <div title={q.collaborator} style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: 'var(--brand-foreground)', border: '1.5px solid white', flexShrink: 0, cursor: 'pointer' }}>{collabInitials}</div>}
                        <button title="Share" style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--muted)', border: `1px solid ${bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }} onMouseEnter={(e) => {e.currentTarget.style.background = `color-mix(in oklch,${br} 12%,white)`;e.currentTarget.style.borderColor = br;}} onMouseLeave={(e) => {e.currentTarget.style.background = 'var(--muted)';e.currentTarget.style.borderColor = bdr;}}>
                          <i className="fa-regular fa-user-plus" style={{ fontSize: 9, color: mfg, lineHeight: 1 }} />
                        </button>
                      </div>
                  }
                  </div>
                  <div><TypeBadge t={q.type} /></div>
                  <div><StatusBadge s={q.status} /></div>
                  <div><DiffBadge d={q.difficulty} /></div>
                  <div style={{ minWidth: 0 }}>{q.collaborator ? <OwnerCell name={q.collaborator} /> : <span style={{ fontSize: 12, color: mfg }}>—</span>}</div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}><PBisCell val={q.pbis ?? null} dir={q.pbisDir ?? null} /></div>
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ position: 'relative' }}>
                      <button title="Version history"
                    onClick={(e) => {e.stopPropagation();setVersionPopoverId(isVersionOpen ? null : q.id);setRowMenuId(null);}}
                    style={{ background: isVersionOpen ? `color-mix(in oklch,${br} 12%,white)` : 'var(--muted)', border: 'none', cursor: 'pointer', padding: '2px 5px', borderRadius: 4, fontSize: 10, color: isVersionOpen ? br : mfg, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}
                    onMouseEnter={(e) => {e.currentTarget.style.background = `color-mix(in oklch,${br} 8%,white)`;e.currentTarget.style.color = br;}}
                    onMouseLeave={(e) => {if (!isVersionOpen) {e.currentTarget.style.background = 'var(--muted)';e.currentTarget.style.color = mfg;}}}>
                      
                        <i className={`${isVersionOpen ? 'fa-solid' : 'fa-regular'} fa-clock-rotate-left`} style={{ fontSize: 10, lineHeight: 1 }} />{' '}V{q.version || 1}
                      </button>
                      {isVersionOpen &&
                    <div onMouseDown={(e) => e.stopPropagation()} style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, background: 'var(--card)', border: `1px solid ${bdr}`, borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.13)', minWidth: 230, zIndex: 100, padding: 10 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: mfg, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Version History</div>
                          {vHistory.map((v, idx) =>
                      <div key={v.v} style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: idx < vHistory.length - 1 ? `1px solid ${bdr}` : 'none' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: idx === 0 ? br : mfg, minWidth: 24 }}>V{v.v}</span>
                              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, color: fg }}>{v.label}</div><div style={{ fontSize: 11, color: mfg }}>{v.author} · {v.date}</div></div>
                              {idx === 0 && <span style={{ fontSize: 10, color: br, fontWeight: 600, alignSelf: 'center', flexShrink: 0 }}>Current</span>}
                            </div>
                      )}
                        </div>
                    }
                    </div>
                    <div style={{ position: 'relative' }}>
                      <button onClick={(e) => {e.stopPropagation();setRowMenuId(isRowMenuOpen ? null : q.id);setVersionPopoverId(null);}} style={{ background: 'none', border: 'none', cursor: 'pointer', color: mfg, padding: 4, borderRadius: 4, display: 'flex' }} onMouseEnter={(e) => {e.currentTarget.style.color = fg;e.currentTarget.style.background = 'var(--accent)';}} onMouseLeave={(e) => {e.currentTarget.style.color = mfg;e.currentTarget.style.background = 'none';}}>
                        <i className={`${isRowMenuOpen ? 'fa-solid' : 'fa-regular'} fa-ellipsis`} style={{ fontSize: 14, lineHeight: 1 }} />
                      </button>
                      {isRowMenuOpen &&
                    <div onMouseDown={(e) => e.stopPropagation()} style={{ position: 'absolute', right: 0, top: '100%', marginTop: 2, background: 'var(--card)', border: `1px solid ${bdr}`, borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.13)', minWidth: 185, zIndex: 100, overflow: 'hidden', paddingTop: 4, paddingBottom: 4 }}>
                          {[
                      { icon: 'eye', label: 'View Details', action: () => {setRowPanel(q);setRowMenuId(null);} },
                      { icon: 'thumbtack', label: isPinned ? 'Unfix' : 'Fix to top', action: () => {togglePin(q.id);setRowMenuId(null);}, amber: !isPinned },
                      null,
                      { icon: 'folder-plus', label: 'Add to Folder', action: () => {setSelectedQForFolder(q.id);setSelected(new Set([q.id]));setAddToFolderOpen(true);setRowMenuId(null);} },
                      { icon: 'share-nodes', label: 'Share', action: () => {setShareQId(q.id);setRowMenuId(null);} },
                      { icon: 'flag', label: 'Flag for Review', action: () => setRowMenuId(null) },
                      { icon: 'circle-check', label: 'Mark Reviewed', action: () => setRowMenuId(null) },
                      { icon: 'clock-rotate-left', label: 'Version History', action: () => {setVersionPopoverId(q.id);setRowMenuId(null);} },
                      null,
                      { icon: 'box-archive', label: 'Archive', action: () => setRowMenuId(null) },
                      { icon: 'trash-can', label: 'Delete', action: () => setRowMenuId(null), danger: true }].
                      map((item, i) => {
                        if (!item) return <div key={i} style={{ borderTop: `1px solid ${bdr}`, margin: '4px 0' }} />;
                        const it = item as {icon: string;label: string;action: () => void;danger?: boolean;amber?: boolean;};
                        const col = it.danger ? '#ef4444' : it.amber ? br : fg,icol = it.danger ? '#ef4444' : it.amber ? br : mfg;
                        return <button key={i} onClick={it.action} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: col, fontSize: 12, textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                              <i className={`${it.icon === 'thumbtack' && isPinned ? 'fa-solid' : 'fa-regular'} fa-${it.icon}`} style={{ fontSize: 12, color: icol, lineHeight: 1, transform: it.icon === 'thumbtack' ? 'rotate(45deg)' : 'none' }} />{it.label}
                            </button>;
                      })}
                        </div>
                    }
                    </div>
                  </div>
                </div>);

          })
          }
        </div>

        {/* ── STATUS BAR ── */}
        <div style={{ padding: '5px 16px', borderTop: `1px solid ${bdr}`, fontSize: 12, color: mfg, background: surf, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          {pinnedQIds.size > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: br, fontWeight: 500 }}><i className="fa-solid fa-thumbtack" style={{ fontSize: 9, transform: 'rotate(45deg)' }} />{pinnedQIds.size} fixed</span>}
          {selected.size > 0 && <span style={{ fontWeight: 600, color: br }}>{selected.size} selected ·</span>}
          <span>{filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}</span>
          {Object.keys(fieldFilters).length > 0 && <button onClick={() => setFieldFilters({})} style={{ marginLeft: 'auto', fontSize: 11, color: mfg, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}><i className="fa-regular fa-xmark" style={{ fontSize: 10, lineHeight: 1 }} /> Clear filters</button>}
        </div>
      </div>

      {/* ── BULK BAR ── */}
      {selected.size > 0 &&
      <div style={{ position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)', background: 'var(--foreground)', color: 'white', borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 4px 24px rgba(0,0,0,0.22)', zIndex: 50, userSelect: 'none' }}>
          <span style={{ fontWeight: 600, fontSize: 12, marginRight: 8, color: 'rgba(255,255,255,0.65)' }}>{selected.size} selected</span>
          {[
        allSelectedPinned ?
        { icon: 'thumbtack', label: 'Unfix', action: () => {selected.forEach((id) => setPinnedQIds((prev) => {const n = new Set(prev);n.delete(id);return n;}));} } :
        { icon: 'thumbtack', label: 'Fix', action: () => {selected.forEach((id) => setPinnedQIds((prev) => {const n = new Set(prev);n.add(id);return n;}));} },
        { icon: 'folder-plus', label: 'Add to Folder', action: () => setAddToFolderOpen(true) },
        { icon: 'flag', label: 'Flag', action: () => {} },
        { icon: 'circle-check', label: 'Reviewed', action: () => {} },
        { icon: 'box-archive', label: 'Archive', action: () => {} },
        { icon: 'trash-can', label: 'Delete', action: () => {}, danger: true }].
        map((item, i) =>
        <button key={i} onClick={item.action} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: (item as any).danger ? '#fca5a5' : 'white', fontSize: 12 }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <i className={`fa-regular fa-${item.icon}`} style={{ fontSize: 13, lineHeight: 1, transform: item.icon === 'thumbtack' ? 'rotate(45deg)' : 'none' }} />{item.label}
            </button>
        )}
          <button onClick={() => setSelected(new Set())} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', padding: 4, borderRadius: 4, display: 'flex', marginLeft: 4 }}>
            <i className="fa-regular fa-xmark" style={{ fontSize: 14, lineHeight: 1 }} />
          </button>
        </div>
      }

      {/* ── TAB CONTEXT MENU (Notion-style) ── */}
      {tabCtxMenu &&
      <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 900 }} onClick={() => setTabCtxMenu(null)} />
          <div onMouseDown={(e) => e.stopPropagation()} style={{ position: 'fixed', left: tabCtxMenu.x, top: tabCtxMenu.y, zIndex: 901, background: 'var(--card)', border: `1px solid ${bdr}`, borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.13)', minWidth: 196, overflow: 'hidden', paddingTop: 4, paddingBottom: 4 }}>
            {(() => {
            const sv = views.find((v) => v.id === tabCtxMenu.id);
            const idx = views.findIndex((v) => v.id === tabCtxMenu.id);
            const canLeft = idx > 0,canRight = idx < views.length - 1;
            const menuItems: ({icon: string;label: string;action: () => void;danger?: boolean;amber?: boolean;} | 'divider')[] = [
            { icon: 'pen', label: 'Rename', action: () => {setRenamingTabId(tabCtxMenu.id);setRenamingTabName(sv?.name || '');setTabCtxMenu(null);} },
            { icon: 'sliders', label: 'Edit criteria', action: () => {if (sv) setEditSV(sv);setTabCtxMenu(null);} },
            'divider',
            ...(canLeft ? [{ icon: 'arrow-left', label: 'Move left', action: () => moveTab(tabCtxMenu.id, -1) } as const] : []),
            ...(canRight ? [{ icon: 'arrow-right', label: 'Move right', action: () => moveTab(tabCtxMenu.id, +1) } as const] : []),
            ...(canLeft || canRight ? ['divider' as const] : []),
            { icon: 'copy', label: 'Duplicate', action: () => {if (sv) {const ns: SVItem = { ...sv, id: `sv-dup-${Date.now()}`, name: `${sv.name} (copy)` };setViews((p) => {const i = p.findIndex((v) => v.id === sv.id);const r = [...p];r.splice(i + 1, 0, ns);return r;});};setTabCtxMenu(null);} },
            'divider',
            { icon: 'trash-can', label: 'Delete view', action: () => {handleDeleteTab(tabCtxMenu.id);setTabCtxMenu(null);}, danger: true }];

            return menuItems.map((item, i) => {
              if (item === 'divider') return <div key={i} style={{ borderTop: `1px solid ${bdr}`, margin: '4px 0' }} />;
              const it = item as {icon: string;label: string;action: () => void;danger?: boolean;};
              const col = it.danger ? '#ef4444' : fg,icol = it.danger ? '#ef4444' : mfg;
              return <button key={i} onClick={it.action} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: col, fontSize: 12, textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                  <i className={`fa-regular fa-${it.icon}`} style={{ fontSize: 12, color: icol, lineHeight: 1 }} />{it.label}
                </button>;
            });
          })()}
          </div>
        </>
      }

      {/* ── RIGHT PANEL ── */}
      {rowPanel && <QuestionRowPanel q={toQRowData(rowPanel)} onClose={() => setRowPanel(null)} onEdit={() => {onEditQuestion?.();setRowPanel(null);}} />}

      {/* ── MODALS ── */}
      {newQuestionOpen && <NewQuestionModal onClose={() => setNewQuestionOpen(false)} onSave={() => setNewQuestionOpen(false)} />}
      {importOpen && <ImportWizardModal isOpen={importOpen} onClose={() => setImportOpen(false)} folders={folders} folderRules={{}} onImport={(_qs, _assigns) => setImportOpen(false)} />}
      <CreateSmartViewModal isOpen={createSVOpen} onClose={() => setCreateSVOpen(false)} onCreate={handleCreateSV} availableTags={allValues.tags} />
      {editSV && <EditSmartViewModal isOpen onClose={() => setEditSV(null)} initialName={editSV.name} initialCriteria={editSV.criteria} availableTags={allValues.tags} onSave={(name, criteria) => {setViews((prev) => prev.map((v) => v.id === editSV.id ? { ...v, name, criteria, autoUpdate: criteria.autoUpdate } : v));setEditSV(null);}} />}
      {archiveFolder && <ArchiveConfirmModal isOpen onClose={() => setArchiveFolder(null)} onConfirm={() => {setFolders((prev) => prev.filter((f) => f.id !== archiveFolder));setArchiveFolder(null);}} folderName={folders.find((f) => f.id === archiveFolder)?.name || ''} />}
      {deleteItem && <DeleteConfirmModal isOpen onClose={() => setDeleteItem(null)} onConfirm={() => {if (deleteItem.type === 'folder') setFolders((prev) => prev.filter((f) => f.id !== deleteItem.id));else {setViews((prev) => prev.filter((v) => v.id !== deleteItem.id));if (activeTabId === deleteItem.id) setActiveTabId('qa-all');};setDeleteItem(null);}} itemName={deleteItem.name} itemType={deleteItem.type} />}
      {shareTarget && <ShareFolderModal isOpen onClose={() => setShareTarget(null)} itemName={shareTarget.name} itemType={shareTarget.type} />}
      {addToFolderOpen && <AddToFolderModal isOpen onClose={() => {setAddToFolderOpen(false);setSelectedQForFolder(null);}} allFolders={folders} assignedFolderIds={assignedFolderIds} questionCount={selected.size || 1} onAdd={(fids) => {setAssignments((prev) => {const next = { ...prev };fids.forEach((fid) => {const qids = selectedQForFolder ? [selectedQForFolder] : [...selected];next[fid] = [...new Set([...(next[fid] || []), ...qids])];});return next;});setAddToFolderOpen(false);setSelected(new Set());setSelectedQForFolder(null);}} />}
      {shareQId && <ShareQuestionModal isOpen onClose={() => setShareQId(null)} questionTitle={questions.find((q) => q.id === shareQId)?.title} questionId={shareQId} />}
      <FilterSheet isOpen={filterSheetOpen} onClose={() => setFilterSheetOpen(false)} filters={fieldFilters} onFiltersChange={setFieldFilters} allValues={allValues} onSaveAsView={handleSaveAsView} onCreateView={() => setCreateSVOpen(true)} smartViews={views.map((v) => ({ id: v.id, name: v.name, count: v.count }))} onSelectView={(id) => {setActiveTabId(id);setFilterSheetOpen(false);}} />
    </div>);

}