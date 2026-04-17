import React, { useState, Fragment } from 'react';
import type { FolderNode } from './QBData';
import { InlineFolderInput } from './QBInlineHelpers';
import { Portal } from './Portal';

export interface FolderRowCtx {
  liveFolderCounts?: Record<string, number>;
  folders: FolderNode[];
  expandedFolders: Set<string>;
  selectedFolder: string | null;
  renamingFolderId: string | null;
  renamingFolderName: string;
  folderMenuId: string | null;
  dragFolderId: string | null;
  dragOverFolderId: string | null;
  draggedQId: string | null;
  dragQOverFolderId: string | null;
  inlineFolderParentId: string | null | undefined;
  inlineFolderName: string;
  facultyAccessibleFolderIds: Set<string>;
  newContentFolderIds?: Set<string>;
  br: string;
  bdr: string;
  fg: string;
  mfg: string;
  inlineInputRef: React.RefObject<HTMLInputElement>;
  setFolders: React.Dispatch<React.SetStateAction<FolderNode[]>>;
  setExpandedFolders: React.Dispatch<React.SetStateAction<Set<string>>>;
  setSelectedFolder: React.Dispatch<React.SetStateAction<string | null>>;
  setFolderMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  setRenamingFolderId: React.Dispatch<React.SetStateAction<string | null>>;
  setRenamingFolderName: React.Dispatch<React.SetStateAction<string>>;
  setDragFolderId: React.Dispatch<React.SetStateAction<string | null>>;
  setDragOverFolderId: React.Dispatch<React.SetStateAction<string | null>>;
  setDraggedQId: React.Dispatch<React.SetStateAction<string | null>>;
  setDragQOverFolderId: React.Dispatch<React.SetStateAction<string | null>>;
  setInlineFolderParentId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setInlineFolderName: React.Dispatch<React.SetStateAction<string>>;
  setActiveTabId: React.Dispatch<React.SetStateAction<string>>;
  setAssignments: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  setShareTarget: React.Dispatch<React.SetStateAction<{id: string;name: string;type: 'folder' | 'view';} | null>>;
  setArchiveFolder: React.Dispatch<React.SetStateAction<string | null>>;
  setDeleteItem: React.Dispatch<React.SetStateAction<{id: string;name: string;type: 'folder' | 'smart view';} | null>>;
  toggleFolderExpand: (id: string) => void;
  handleFolderRename: (fid: string) => void;
  handleReorderFolders: (dragId: string, dropId: string) => void;
  handleInlineFolderCreate: () => void;
  cancelInlineFolder: () => void;
  inlineFolderIsQSet?: boolean;
  setInlineFolderIsQSet?: React.Dispatch<React.SetStateAction<boolean>>;
  questions?: any[];
  setQuestions?: React.Dispatch<React.SetStateAction<any[]>>;
  assignments?: Record<string, string[]>;
}

// ─── Available folder icons ───────────────────────────────────────────────────
const FOLDER_ICONS = [
{ key: 'folder', label: 'Folder' }, { key: 'folder-open', label: 'Open' },
{ key: 'graduation-cap', label: 'Course' }, { key: 'calendar', label: 'Term' },
{ key: 'book', label: 'Book' }, { key: 'book-open', label: 'Readings' },
{ key: 'flask', label: 'Lab' }, { key: 'microscope', label: 'Science' },
{ key: 'stethoscope', label: 'Clinical' }, { key: 'pills', label: 'Pharm' },
{ key: 'brain', label: 'Neuro' }, { key: 'heart-pulse', label: 'Cardio' },
{ key: 'rectangle-list', label: 'Q-Set' }, { key: 'file-lines', label: 'File' },
{ key: 'star', label: 'Star' }, { key: 'bookmark', label: 'Saved' },
{ key: 'tag', label: 'Tag' }, { key: 'layer-group', label: 'Stack' }];


function FolderNodeIcon({ f, isExpanded, isSelected, depth, br, mfg, customIcon


}: {f: FolderNode;isExpanded: boolean;isSelected: boolean;depth: number;br: string;mfg: string;customIcon?: string;}) {
  if (f.isPrivateSpace)
  return <i className="fa-solid fa-lock-keyhole" style={{ fontSize: 11, color: '#a21caf', flexShrink: 0 }} />;
  if (f.isQuestionSet)
  return <i className="fa-solid fa-rectangle-list" style={{ fontSize: 11, color: '#2563eb', flexShrink: 0 }} />;
  if (f.locked)
  return <i className="fa-solid fa-lock" style={{ fontSize: 11, color: '#f59e0b', flexShrink: 0 }} />;
  const icon = customIcon || (depth === 0 ? 'fa-graduation-cap' : depth === 1 ? 'fa-calendar' : depth === 2 || depth === 3 ? isExpanded ? 'fa-folder-open' : 'fa-folder' : 'fa-file-lines');
  const solidOnly = icon === 'fa-graduation-cap' || icon === 'fa-calendar';
  return <i className={`${isSelected || solidOnly ? 'fa-solid' : 'fa-regular'} ${icon.startsWith('fa-') ? icon : 'fa-' + icon}`} style={{ fontSize: 12, color: isSelected ? br : mfg, flexShrink: 0 }} />;
}

// ─── Icon picker modal ────────────────────────────────────────────────────────
function ChangeIconModal({ isOpen, onClose, onSelect, current, fg, bdr, mfg, br


}: {isOpen: boolean;onClose: () => void;onSelect: (icon: string) => void;current?: string;fg: string;bdr: string;mfg: string;br: string;}) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)' }} onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: 12, width: 320, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: `1px solid ${bdr}` }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: fg }}>Change folder icon</span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: mfg, fontSize: 16 }}>×</button>
                </div>
                <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
                    {FOLDER_ICONS.map(({ key, label }) => {
            const isCurrent = current === key;
            return (
              <button key={key} title={label} onClick={() => {onSelect(key);onClose();}}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 4px', borderRadius: 8, border: `1.5px solid ${isCurrent ? br : bdr}`, background: isCurrent ? `color-mix(in oklch,${br} 10%,white)` : 'white', cursor: 'pointer' }}
              onMouseEnter={(e) => {if (!isCurrent) e.currentTarget.style.background = '#f8fafc';}}
              onMouseLeave={(e) => {if (!isCurrent) e.currentTarget.style.background = 'white';}}>
                
                                <i className={`fa-regular fa-${key}`} style={{ fontSize: 16, color: isCurrent ? br : mfg }} />
                                <span style={{ fontSize: 9, color: mfg }}>{label}</span>
                            </button>);

          })}
                </div>
            </div>
        </div>);

}

// ─── Move to subfolder modal ──────────────────────────────────────────────────
function MoveFolderModal({ isOpen, onClose, folders, movingFolder, onMove, fg, bdr, mfg, br



}: {isOpen: boolean;onClose: () => void;folders: FolderNode[];movingFolder: FolderNode | null;onMove: (targetParentId: string | null) => void;fg: string;bdr: string;mfg: string;br: string;}) {
  if (!isOpen || !movingFolder) return null;
  const getDescendantIds = (id: string): Set<string> => {
    const s = new Set<string>([id]);
    folders.forEach((f) => {if (f.parentId === id) getDescendantIds(f.id).forEach((d) => s.add(d));});
    return s;
  };
  const excluded = getDescendantIds(movingFolder.id);
  const eligible = folders.filter((f) => !excluded.has(f.id) && f.id !== movingFolder.parentId && !f.isQuestionSet && !f.isPrivateSpace);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)' }} onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: 12, width: 340, maxHeight: 460, display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: `1px solid ${bdr}` }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: fg }}>Move "{movingFolder.name}"</span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: mfg, fontSize: 16 }}>×</button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
                    <button onClick={() => {onMove(null);onClose();}}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', width: '100%', borderRadius: 8, border: `1px solid ${bdr}`, background: 'white', cursor: 'pointer', fontSize: 13, color: fg, textAlign: 'left', marginBottom: 6 }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
            
                        <i className="fa-regular fa-house" style={{ fontSize: 13, color: mfg }} /> Move to top level
                    </button>
                    {eligible.map((f) =>
          <button key={f.id} onClick={() => {onMove(f.id);onClose();}}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', width: '100%', borderRadius: 8, border: `1px solid ${bdr}`, background: 'white', cursor: 'pointer', fontSize: 13, color: fg, textAlign: 'left', marginBottom: 6 }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
            
                            <i className="fa-regular fa-folder" style={{ fontSize: 13, color: mfg }} />
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                        </button>
          )}
                </div>
            </div>
        </div>);

}

const DEMO_FACULTY = ['Dr. Patel', 'Dr. Chen', 'Dr. Lee', 'Dr. Ramirez', 'Dr. Kim', 'Dr. Wells'];
const PERSONA_COLORS_FR: Record<string, string> = {
  'Dr. Patel': '#0891b2', 'Dr. Chen': '#059669', 'Dr. Lee': '#d97706',
  'Dr. Ramirez': '#dc2626', 'Dr. Kim': '#0f766e', 'Dr. Wells': '#64748b'
};

function ManageCollaboratorsModal({ isOpen, onClose, folder, setFolders, fg, bdr, mfg, br



}: {isOpen: boolean;onClose: () => void;folder: FolderNode | null;setFolders: React.Dispatch<React.SetStateAction<FolderNode[]>>;fg: string;bdr: string;mfg: string;br: string;}) {
  if (!isOpen || !folder) return null;
  const current = folder.collaborators ?? [];
  const addable = DEMO_FACULTY.filter((n) => !current.includes(n));
  const removeCollab = (name: string) => {
    setFolders((prev) => prev.map((f) => f.id === folder.id ? { ...f, collaborators: (f.collaborators || []).filter((c) => c !== name) } : f));
  };
  const addCollab = (name: string) => {
    setFolders((prev) => prev.map((f) => f.id === folder.id ? { ...f, collaborators: [...(f.collaborators || []), name] } : f));
  };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: 12, width: 420, maxHeight: '80vh', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: `1px solid ${bdr}` }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-regular fa-users" style={{ fontSize: 13, color: '#2563eb' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: fg }}>Manage Collaborators</div>
                        <div style={{ fontSize: 11, color: mfg, marginTop: 1 }}>{folder.name} · All assigned faculty have view access</div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: mfg, padding: 4, borderRadius: 5 }} onMouseEnter={(e) => e.currentTarget.style.color = fg} onMouseLeave={(e) => e.currentTarget.style.color = mfg}>
                        <i className="fa-regular fa-xmark" style={{ fontSize: 15 }} />
                    </button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                    {current.length > 0 &&
          <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: mfg, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Collaborators (edit access)</div>
                            {current.map((name) => {
              const color = PERSONA_COLORS_FR[name] ?? '#6366f1';
              const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
              return (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, border: `1px solid ${bdr}`, marginBottom: 6, background: '#f8fafc' }}>
                                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <span style={{ fontSize: 8, fontWeight: 700, color: 'white' }}>{initials}</span>
                                        </div>
                                        <span style={{ flex: 1, fontSize: 13, color: fg, fontWeight: 500 }}>{name}</span>
                                        <button onClick={() => removeCollab(name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px 6px', borderRadius: 5, fontSize: 11, fontWeight: 600 }} onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>Remove</button>
                                    </div>);

            })}
                        </div>
          }
                    {addable.length > 0 &&
          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: mfg, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Grant edit access</div>
                            {addable.map((name) => {
              const color = PERSONA_COLORS_FR[name] ?? '#6366f1';
              const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
              return (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, border: `1px solid ${bdr}`, marginBottom: 6, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = 'var(--accent)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = 'white'}>
                                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <span style={{ fontSize: 8, fontWeight: 700, color: 'white' }}>{initials}</span>
                                        </div>
                                        <span style={{ flex: 1, fontSize: 13, color: fg }}>{name}</span>
                                        <button onClick={() => addCollab(name)} style={{ background: '#dbeafe', border: 'none', cursor: 'pointer', color: '#1d4ed8', padding: '3px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600 }} onMouseEnter={(e) => e.currentTarget.style.background = '#bfdbfe'} onMouseLeave={(e) => e.currentTarget.style.background = '#dbeafe'}>+ Add</button>
                                    </div>);

            })}
                        </div>
          }
                </div>
                <div style={{ borderTop: `1px solid ${bdr}`, padding: '12px 20px', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc' }}>
                    <button onClick={onClose} style={{ padding: '7px 16px', borderRadius: 7, border: `1px solid ${bdr}`, background: 'white', color: fg, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Done</button>
                </div>
            </div>
        </div>);

}

type MenuItem = string | {icon: string;label: string;action: () => void;danger?: boolean;amber?: boolean;blue?: boolean;purple?: boolean;};

export function AdminFolderRow({ f, depth = 0, ctx }: {f: FolderNode;depth?: number;ctx: FolderRowCtx;}) {
  const {
    folders, expandedFolders, selectedFolder, renamingFolderId, renamingFolderName,
    folderMenuId, dragFolderId, dragOverFolderId, draggedQId, dragQOverFolderId,
    inlineFolderParentId, inlineFolderName, newContentFolderIds, br, bdr, fg, mfg, inlineInputRef,
    setFolders, setExpandedFolders, setSelectedFolder, setFolderMenuId, setRenamingFolderId,
    setRenamingFolderName, setDragFolderId, setDragOverFolderId, setDraggedQId, setDragQOverFolderId,
    setInlineFolderParentId, setInlineFolderName, setActiveTabId, setAssignments,
    setShareTarget, setArchiveFolder, setDeleteItem, toggleFolderExpand, handleFolderRename,
    handleReorderFolders, handleInlineFolderCreate, cancelInlineFolder,
    inlineFolderIsQSet, setInlineFolderIsQSet, liveFolderCounts
  } = ctx;

  const isExpanded = expandedFolders.has(f.id);
  const isSelected = selectedFolder === f.id;
  const children = folders.filter((fc) => fc.parentId === f.id);
  const hasKids = children.length > 0;
  const [hov, setHov] = useState(false);
  const [menuPos, setMenuPos] = useState<{x: number;y: number;} | null>(null);
  const [manageCollabOpen, setManageCollabOpen] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);

  const isRenaming = renamingFolderId === f.id;
  const isDragQOver = dragQOverFolderId === f.id;
  const isFDragOver = dragOverFolderId === f.id;
  const hasNewContent = newContentFolderIds?.has(f.id) ?? false;

  const isQSet = f.isQuestionSet;
  const isPriv = f.isPrivateSpace;
  const accentColor = isQSet ? '#2563eb' : isPriv ? '#a21caf' : br;
  const accentBg = isQSet ? 'color-mix(in oklch,#2563eb 10%,white)' : isPriv ? '#fdf4ff' : `color-mix(in oklch,${br} 10%,white)`;

  const customIcon = (f as any).customIcon as string | undefined;

  const lockFolder = () => {setFolders((p) => p.map((x) => x.id === f.id ? { ...x, locked: true } : x));setFolderMenuId(null);};
  const unlockFolder = () => {setFolders((p) => p.map((x) => x.id === f.id ? { ...x, locked: false } : x));setFolderMenuId(null);};

  const moveToParent = () => {
    const parent = folders.find((ff) => ff.id === f.parentId);
    const grandparentId = parent?.parentId ?? null;
    setFolders((p) => p.map((x) => x.id === f.id ? { ...x, parentId: grandparentId } : x));
    setFolderMenuId(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();e.stopPropagation();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setFolderMenuId(f.id);
  };

  const menuItems: MenuItem[] = [
  { icon: 'pen', label: 'Rename', action: () => {setRenamingFolderId(f.id);setRenamingFolderName(f.name);setFolderMenuId(null);} },
  { icon: 'image', label: 'Change icon', action: () => {setFolderMenuId(null);setIconPickerOpen(true);} },
  'divider' as string,
  ...(depth < 4 && !isQSet && !isPriv ? [{ icon: 'folder-plus', label: 'Add subfolder', action: () => {setExpandedFolders((p) => new Set([...p, f.id]));setInlineFolderParentId(f.id);setInlineFolderName('');setFolderMenuId(null);} }] : []),
  ...(depth < 4 && !isQSet && !isPriv ? [{ icon: 'rectangle-list', label: 'New Question Set', action: () => {setExpandedFolders((p) => new Set([...p, f.id]));setInlineFolderParentId(f.id);setInlineFolderName('');setInlineFolderIsQSet?.(true);setFolderMenuId(null);}, blue: true }] : []),
  ...(f.parentId ? [{ icon: 'arrow-up-to-line', label: 'Move to parent folder', action: () => {moveToParent();} }] : []),
  { icon: 'arrow-right-to-bracket', label: 'Move into subfolder', action: () => {setFolderMenuId(null);setMoveModalOpen(true);} },
  ...(isQSet ? [
  { icon: 'users', label: 'Manage Collaborators', action: () => {setManageCollabOpen(true);setFolderMenuId(null);}, blue: true },
  { icon: 'plus-circle', label: 'Add Questions', action: () => setFolderMenuId(null) }] :
  []),
  { icon: 'share-nodes', label: 'Share / Access', action: () => {setShareTarget({ id: f.id, name: f.name, type: 'folder' });setFolderMenuId(null);} },
  'divider' as string,
  ...(!isQSet && !isPriv ? [{ icon: 'lock', label: 'Lock folder', action: lockFolder, amber: true } as MenuItem, 'divider' as string] : []),
  { icon: 'box-archive', label: 'Archive', action: () => {setArchiveFolder(f.id);setFolderMenuId(null);} },
  { icon: 'trash-can', label: 'Delete', action: () => {setDeleteItem({ id: f.id, name: f.name, type: 'folder' });setFolderMenuId(null);}, danger: true }];


  const displayCount = liveFolderCounts != null && f.id in liveFolderCounts ? liveFolderCounts[f.id] : f.count;

  return (
    <Fragment>
            <div
        draggable={!isRenaming && !f.locked}
        onDragStart={(e) => {setDragFolderId(f.id);e.dataTransfer.effectAllowed = 'move';}}
        onDragEnd={() => {setDragFolderId(null);setDragOverFolderId(null);}}
        onDragOver={(e) => {
          if (draggedQId) {e.preventDefault();e.stopPropagation();setDragQOverFolderId(f.id);return;}
          if (dragFolderId && dragFolderId !== f.id) {
            const df = folders.find((ff) => ff.id === dragFolderId);
            if (df?.parentId === f.parentId) {e.preventDefault();setDragOverFolderId(f.id);}
          }
        }}
        onDragLeave={() => {if (dragQOverFolderId === f.id) setDragQOverFolderId(null);if (dragOverFolderId === f.id) setDragOverFolderId(null);}}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedQId) {setAssignments((prev) => {const n = { ...prev };n[f.id] = [...new Set([...(n[f.id] || []), draggedQId!])];return n;});setDraggedQId(null);setDragQOverFolderId(null);if (!isExpanded) toggleFolderExpand(f.id);return;}
          if (dragFolderId && dragFolderId !== f.id) {handleReorderFolders(dragFolderId, f.id);setDragFolderId(null);setDragOverFolderId(null);}
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => {if (isRenaming) return;setFolderMenuId(null);setSelectedFolder(f.id);setActiveTabId('qa-all');}}
        onContextMenu={handleContextMenu}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: `6px 8px 6px ${8 + depth * 16}px`,
          borderRadius: 6, cursor: 'pointer', marginBottom: 2,
          background: isDragQOver ? `color-mix(in oklch,${accentColor} 18%,white)` :
          isFDragOver ? `color-mix(in oklch,${accentColor} 10%,white)` :
          isSelected ? accentBg : hov ? 'var(--accent)' : 'transparent',
          outline: isDragQOver ? `2px dashed ${accentColor}` : 'none',
          borderLeft: isQSet || isPriv ? `3px solid ${isSelected || hov ? accentColor : 'transparent'}` : 'none',
          transition: 'background .1s', position: 'relative'
        }}>
        
                <button
          onClick={(e) => {e.stopPropagation();if (!f.locked && hasKids) toggleFolderExpand(f.id);}}
          style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 16, height: 16, cursor: hasKids && !f.locked ? 'pointer' : 'default', color: hasKids && !f.locked ? mfg : 'transparent' }}
          tabIndex={-1}>
          
                    <i className={`fa-regular fa-chevron-${isExpanded ? 'down' : 'right'}`} style={{ fontSize: 10, lineHeight: 1 }} />
                </button>

                <FolderNodeIcon f={f} isExpanded={isExpanded} isSelected={isSelected} depth={depth} br={br} mfg={mfg} customIcon={customIcon} />

                {isRenaming ?
        <input autoFocus value={renamingFolderName} onChange={(e) => setRenamingFolderName(e.target.value)}
        onKeyDown={(e) => {if (e.key === 'Enter') handleFolderRename(f.id);if (e.key === 'Escape') {setRenamingFolderId(null);setRenamingFolderName('');}}}
        onBlur={() => handleFolderRename(f.id)} onClick={(e) => e.stopPropagation()}
        style={{ flex: 1, fontSize: 13, border: `1px solid ${accentColor}`, borderRadius: 4, padding: '2px 6px', outline: 'none', background: 'white', color: fg, minWidth: 0 }} /> :

        <span style={{ flex: 1, fontSize: 13, fontWeight: isSelected ? 500 : 400, color: f.locked ? mfg : isSelected ? accentColor : fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, fontStyle: f.locked ? 'italic' : 'normal' }}>{f.name}</span>
        }

                {f.isCourseOffering && depth === 0 && !isRenaming &&
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                        <i className="fa-solid fa-calendar" style={{ fontSize: 9, color: '#0d9488', lineHeight: 1 }} />
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: '#ccfbf1', color: '#0f766e' }}>Offering</span>
                    </span>
        }

                {isQSet && !isRenaming && f.collaborators && f.collaborators.length > 0 &&
        <div style={{ display: 'flex', alignItems: 'center' }} title={`Edit-access collaborators: ${f.collaborators.join(', ')}`}>
                        {f.collaborators.slice(0, 3).map((name, ci) => {
            const color = PERSONA_COLORS_FR[name] ?? '#6366f1';
            const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
            return <div key={ci} style={{ width: 14, height: 14, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid white', marginLeft: ci > 0 ? -4 : 0, flexShrink: 0 }}><span style={{ fontSize: 6, fontWeight: 700, color: 'white' }}>{initials}</span></div>;
          })}
                        {f.collaborators.length > 3 && <span style={{ fontSize: 9, color: mfg, marginLeft: 2 }}>+{f.collaborators.length - 3}</span>}
                    </div>
        }

                {isQSet && !isRenaming && <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 4px', borderRadius: 3, background: '#dbeafe', color: '#1d4ed8', flexShrink: 0 }}>SET</span>}
                {hasNewContent && !isRenaming && <span title="New auto-collected questions" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />}
                <span style={{ fontSize: 12, color: isSelected ? accentColor : mfg, flexShrink: 0, fontWeight: 500 }}>{displayCount}</span>

                {hov && !isRenaming &&
        <div style={{ position: 'relative', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={(e) => {e.stopPropagation();const r = e.currentTarget.getBoundingClientRect();setMenuPos({ x: r.right, y: r.bottom });setFolderMenuId(folderMenuId === f.id ? null : f.id);}}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: 4, display: 'flex', color: mfg }}
          onMouseEnter={(e) => e.currentTarget.style.color = fg}
          onMouseLeave={(e) => e.currentTarget.style.color = mfg}>
                            <i className={`${folderMenuId === f.id ? 'fa-solid' : 'fa-regular'} fa-ellipsis`} style={{ fontSize: 13, lineHeight: 1 }} />
                        </button>
                    </div>
        }
            </div>

            {folderMenuId === f.id && menuPos &&
      <Portal>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 99997 }} onClick={() => setFolderMenuId(null)} />
                    <div onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}
        style={{ position: 'fixed', top: menuPos.y + 4, left: menuPos.x, background: 'var(--card)', border: `1px solid ${bdr}`, borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', minWidth: 200, zIndex: 99998, overflow: 'hidden', paddingTop: 4, paddingBottom: 4 }}>
                        {f.locked ?
          <>
                                <div style={{ padding: '6px 12px 4px', fontSize: 10, fontWeight: 700, color: mfg, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Locked</div>
                                <button onClick={unlockFolder} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: fg, fontSize: 13, textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                                    <i className="fa-regular fa-lock-open" style={{ fontSize: 13, color: '#f59e0b', lineHeight: 1, width: 16, textAlign: 'center' }} />Unlock folder
                                </button>
                            </> :

          menuItems.map((item, i) => {
            if (item === 'divider') return <div key={i} style={{ borderTop: `1px solid ${bdr}`, margin: '4px 0' }} />;
            const it = item as {icon: string;label: string;action: () => void;danger?: boolean;amber?: boolean;blue?: boolean;purple?: boolean;};
            const col = it.danger ? '#ef4444' : it.blue ? '#2563eb' : it.purple ? '#a21caf' : it.amber ? '#f59e0b' : fg;
            const icol = it.danger ? '#ef4444' : it.blue ? '#2563eb' : it.purple ? '#a21caf' : it.amber ? '#f59e0b' : mfg;
            return (
              <button key={i} onClick={it.action}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: col, fontSize: 13, textAlign: 'left' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                                        <i className={`fa-regular fa-${it.icon}`} style={{ fontSize: 13, color: icol, lineHeight: 1, width: 16, textAlign: 'center', flexShrink: 0 }} />{it.label}
                                    </button>);

          })
          }
                    </div>
                </Portal>
      }

            {isExpanded && children.map((c) => <AdminFolderRow key={c.id} f={c} depth={depth + 1} ctx={ctx} />)}
            {isExpanded &&
      <InlineFolderInput parentId={f.id} depth={depth + 1} activePid={inlineFolderParentId} name={inlineFolderName}
      onSetName={setInlineFolderName} onConfirm={handleInlineFolderCreate} onCancel={cancelInlineFolder}
      inputRef={inlineInputRef} br={inlineFolderIsQSet ? '#2563eb' : br} fg={fg} mfg={mfg} />
      }

            <ChangeIconModal
        isOpen={iconPickerOpen} onClose={() => setIconPickerOpen(false)}
        current={customIcon}
        onSelect={(icon) => setFolders((p) => p.map((x) => x.id === f.id ? { ...x, customIcon: icon } as any : x))}
        fg={fg} bdr={bdr} mfg={mfg} br={br} />

            <MoveFolderModal
        isOpen={moveModalOpen} onClose={() => setMoveModalOpen(false)}
        folders={folders} movingFolder={f}
        onMove={(targetId) => setFolders((p) => p.map((x) => x.id === f.id ? { ...x, parentId: targetId } : x))}
        fg={fg} bdr={bdr} mfg={mfg} br={br} />

            <ManageCollaboratorsModal isOpen={manageCollabOpen} onClose={() => setManageCollabOpen(false)}
      folder={manageCollabOpen ? f : null} setFolders={setFolders} fg={fg} bdr={bdr} mfg={mfg} br={br} />
        </Fragment>);

}

export function FacultyFolderRow({ f, depth = 0, ctx }: {f: FolderNode;depth?: number;ctx: FolderRowCtx;}) {
  const {
    folders, expandedFolders, selectedFolder, facultyAccessibleFolderIds, newContentFolderIds,
    br, fg, mfg, setFolderMenuId, setSelectedFolder, setActiveTabId, toggleFolderExpand, liveFolderCounts
  } = ctx;

  const isExpanded = expandedFolders.has(f.id);
  const isSelected = selectedFolder === f.id;
  const children = folders.filter((fc) => fc.parentId === f.id).filter((c) => facultyAccessibleFolderIds.has(c.id));
  const hasKids = children.length > 0;
  const [hov, setHov] = useState(false);
  const hasNewContent = newContentFolderIds?.has(f.id) ?? false;

  const isQSet = f.isQuestionSet;
  const isPriv = f.isPrivateSpace;
  const accentColor = isQSet ? '#2563eb' : isPriv ? '#a21caf' : br;

  const displayCount = liveFolderCounts != null && f.id in liveFolderCounts ? liveFolderCounts[f.id] : f.count;

  return (
    <Fragment>
            <div onClick={() => {setFolderMenuId(null);setSelectedFolder(f.id);setActiveTabId('qa-all');}}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: `6px 8px 6px ${8 + depth * 16}px`, borderRadius: 6, cursor: 'pointer', marginBottom: 2, background: isSelected ? `color-mix(in oklch,${accentColor} 10%,white)` : hov ? 'var(--accent)' : 'transparent', transition: 'background .1s', position: 'relative' }}>
                <button onClick={(e) => {e.stopPropagation();if (hasKids) toggleFolderExpand(f.id);}}
        style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 16, height: 16, cursor: hasKids ? 'pointer' : 'default', color: hasKids ? mfg : 'transparent' }}
        tabIndex={-1}>
                    <i className={`fa-regular fa-chevron-${isExpanded ? 'down' : 'right'}`} style={{ fontSize: 10, lineHeight: 1 }} />
                </button>
                <FolderNodeIcon f={f} isExpanded={isExpanded} isSelected={isSelected} depth={depth} br={br} mfg={mfg} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: isSelected ? 500 : 400, color: isSelected ? accentColor : fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{f.name}</span>
                {f.isCourseOffering && depth === 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0 }}><i className="fa-solid fa-calendar" style={{ fontSize: 9, color: '#0d9488', lineHeight: 1 }} /><span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: '#ccfbf1', color: '#0f766e' }}>Offering</span></span>}
                {isQSet && <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 4px', borderRadius: 3, background: '#dbeafe', color: '#1d4ed8', flexShrink: 0 }}>SET</span>}
                {hasNewContent && <span title="New auto-collected questions" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />}
                <span style={{ fontSize: 12, color: mfg, flexShrink: 0, fontWeight: 500 }}>{displayCount}</span>
            </div>
            {isExpanded && children.map((c) => <FacultyFolderRow key={c.id} f={c} depth={depth + 1} ctx={ctx} />)}
        </Fragment>);

}