import React, { useState } from 'react';

export interface SmartCriteria {
  difficulties: string[];
  blooms: string[];
  usage: string;
  pbis: string;
  types: string[];
  tags: string[];
  autoUpdate: boolean;
}
export const DEFAULT_CRITERIA: SmartCriteria = { difficulties: [], blooms: [], usage: 'any', pbis: 'any', types: [], tags: [], autoUpdate: true };

function Overlay({ onClose, children }: {onClose: () => void;children: React.ReactNode;}) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
    onClick={(e) => {if (e.target === e.currentTarget) onClose();}}>
      {children}
    </div>);

}

function ModalCard({ children, width = 400 }: {children: React.ReactNode;width?: number;}) {
  return (
    <div style={{ background: 'var(--card)', borderRadius: 12, width, maxWidth: '95vw', boxShadow: '0 24px 64px rgba(0,0,0,0.22)', display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>);

}

function ModalHeader({ title, onClose }: {title: string;onClose: () => void;}) {
  return (
    <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
      <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--foreground)' }}>{title}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: 4, borderRadius: 4, display: 'flex' }}>
        <i className="fa-regular fa-xmark" style={{ fontSize: 16, lineHeight: 1 }} />
      </button>
    </div>);

}

const Btn = ({ label, variant = 'ghost', onClick, disabled }: {label: string;variant?: 'ghost' | 'primary' | 'danger' | 'warning';onClick: () => void;disabled?: boolean;}) => {
  const bg = variant === 'primary' ? 'var(--brand)' : variant === 'danger' ? '#dc2626' : variant === 'warning' ? '#d97706' : 'transparent';
  const color = variant === 'ghost' ? 'var(--foreground)' : 'white';
  const border = variant === 'ghost' ? '1px solid var(--border)' : 'none';
  return (
    <button onClick={onClick} disabled={disabled}
    style={{ padding: '8px 20px', borderRadius: 7, border, background: disabled ? 'var(--muted)' : bg, color: disabled ? 'var(--muted-foreground)' : color, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: variant === 'ghost' ? 500 : 600, flexShrink: 0 }}>
      {label}
    </button>);

};

function Chip({ label, active, onClick, color }: {label: string;active: boolean;onClick: () => void;color?: string;}) {
  return (
    <button onClick={onClick} style={{ padding: '4px 11px', borderRadius: 20, fontSize: 12, border: `1px solid ${active ? color || 'var(--brand)' : 'var(--border)'}`, background: active ? color || 'var(--brand)' : 'transparent', color: active ? 'white' : 'var(--foreground)', cursor: 'pointer', fontWeight: active ? 600 : 400, transition: 'all 0.12s' }}>
      {label}
    </button>);

}

function Toggle({ on, onToggle }: {on: boolean;onToggle: () => void;}) {
  return (
    <button onClick={onToggle} style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', background: on ? 'var(--brand)' : 'var(--muted)', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
      <span style={{ position: 'absolute', width: 16, height: 16, borderRadius: '50%', background: 'white', top: 3, left: on ? 21 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
    </button>);

}

const DIFFS = ['Easy', 'Medium', 'Hard'];
const BLOOMS = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
const QTYPES = ['MCQ', 'Fill blank', 'Hotspot', 'Ordering', 'Matching'];

const TAG_PALETTE = ['#3b82f6', '#16a34a', '#7c3aed', '#b91c1c', '#0369a1', '#065f46', '#92400e', '#be185d', '#374151', '#6d28d9'];

function CriteriaForm({ name, setName, criteria, setCriteria, showName = true, availableTags = []




}: {name: string;setName: (v: string) => void;criteria: SmartCriteria;setCriteria: (v: SmartCriteria) => void;showName?: boolean;availableTags?: string[];}) {
  const [tagInput, setTagInput] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);

  const tog = (arr: string[], v: string) => arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
  const inp: React.CSSProperties = { width: '100%', padding: '8px 12px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--input-background)', color: 'var(--foreground)', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--foreground)', marginBottom: 7 };
  const row: React.CSSProperties = { marginBottom: 16 };

  const allTags = [...new Set([...availableTags, ...customTags])];
  const filteredTags = tagInput.trim() ? allTags.filter((t) => t.toLowerCase().includes(tagInput.toLowerCase())) : allTags;
  const canCreate = tagInput.trim() && !allTags.some((t) => t.toLowerCase() === tagInput.trim().toLowerCase());

  const handleCreateTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    setCustomTags((prev) => [...prev, t]);
    setCriteria({ ...criteria, tags: [...(criteria.tags || []), t] });
    setTagInput('');
  };

  return (
    <>
      {showName &&
      <div style={row}>
          <label style={lbl}>View Name</label>
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hard Cardiology Questions" style={inp} />
        </div>
      }
      <div style={row}>
        <label style={lbl}>Difficulty</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{DIFFS.map((d) => <Chip key={d} label={d} active={criteria.difficulties.includes(d)} onClick={() => setCriteria({ ...criteria, difficulties: tog(criteria.difficulties, d) })} />)}</div>
      </div>
      <div style={row}>
        <label style={lbl}>Bloom's Level</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{BLOOMS.map((b) => <Chip key={b} label={b} active={criteria.blooms.includes(b)} onClick={() => setCriteria({ ...criteria, blooms: tog(criteria.blooms, b) })} />)}</div>
      </div>
      <div style={row}>
        <label style={lbl}>Question Type</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{QTYPES.map((t) => <Chip key={t} label={t} active={criteria.types.includes(t)} onClick={() => setCriteria({ ...criteria, types: tog(criteria.types, t) })} />)}</div>
      </div>

      {/* Tags — search + create */}
      <div style={row}>
        <label style={lbl}>
          Tags
          <span style={{ fontWeight: 400, color: 'var(--muted-foreground)', fontSize: 11, marginLeft: 4 }}>(match any)</span>
        </label>
        {/* Search/create input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--border)', borderRadius: 7, padding: '5px 10px', background: 'var(--input-background)', marginBottom: 8 }}>
          <i className="fa-regular fa-tag" style={{ fontSize: 12, color: 'var(--muted-foreground)', flexShrink: 0 }} />
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {if (e.key === 'Enter' && canCreate) handleCreateTag();}}
            placeholder="Search or create tag…"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--foreground)', minWidth: 0 }} />
          
          {canCreate &&
          <button onClick={handleCreateTag}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 5, border: '1px dashed var(--brand)', background: 'color-mix(in oklch,var(--brand) 8%,white)', color: 'var(--brand)', fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
              <i className="fa-regular fa-plus" style={{ fontSize: 10 }} />
              Create "{tagInput.trim()}"
            </button>
          }
        </div>
        {/* Tag chips */}
        {filteredTags.length > 0 &&
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {filteredTags.map((t, i) =>
          <Chip key={t} label={t}
          active={(criteria.tags || []).includes(t)}
          color={TAG_PALETTE[i % TAG_PALETTE.length]}
          onClick={() => setCriteria({ ...criteria, tags: tog(criteria.tags || [], t) })} />

          )}
          </div>
        }
        {filteredTags.length === 0 && tagInput.trim() && !canCreate &&
        <div style={{ fontSize: 12, color: 'var(--muted-foreground)', padding: '4px 0' }}>Tag already selected</div>
        }
        {/* Selected tags summary */}
        {(criteria.tags || []).length > 0 &&
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8, padding: '6px 10px', background: 'color-mix(in oklch,var(--brand) 5%,white)', borderRadius: 6, border: '1px solid var(--brand-border)' }}>
            {(criteria.tags || []).map((t) =>
          <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, background: 'var(--brand)', color: 'white', fontSize: 11, fontWeight: 500 }}>
                {t}
                <button onClick={() => setCriteria({ ...criteria, tags: (criteria.tags || []).filter((x) => x !== t) })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', padding: 0, display: 'flex', lineHeight: 1 }}>
                  <i className="fa-regular fa-xmark" style={{ fontSize: 10 }} />
                </button>
              </span>
          )}
          </div>
        }
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={lbl}>Usage</label>
          <select value={criteria.usage} onChange={(e) => setCriteria({ ...criteria, usage: e.target.value })} style={inp}>
            <option value="any">Any usage</option>
            <option value="never">Never used (0×)</option>
            <option value="low">Used 1–2×</option>
            <option value="multi">Used 3+ times</option>
          </select>
        </div>
        <div>
          <label style={lbl}>P-Bis Score</label>
          <select value={criteria.pbis} onChange={(e) => setCriteria({ ...criteria, pbis: e.target.value })} style={inp}>
            <option value="any">Any P-Bis</option>
            <option value="low">Low (&lt; 0.30)</option>
            <option value="very-low">Very low (&lt; 0.20)</option>
            <option value="high">High (≥ 0.40)</option>
          </select>
        </div>
      </div>
      <div style={{ padding: '12px 14px', background: 'color-mix(in oklch,var(--brand) 8%,white)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>Auto-update</div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>Refresh question set automatically when matches change</div>
        </div>
        <Toggle on={criteria.autoUpdate} onToggle={() => setCriteria({ ...criteria, autoUpdate: !criteria.autoUpdate })} />
      </div>
    </>);

}

export function CreateFolderModal({ isOpen, onClose, onCreate, parentOptions



}: {isOpen: boolean;onClose: () => void;onCreate: (name: string, parentId: string | null) => void;parentOptions: Array<{id: string;name: string;}>;}) {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  if (!isOpen) return null;
  const handleCreate = () => {if (name.trim()) {onCreate(name.trim(), parentId);setName('');setParentId(null);onClose();}};
  return (
    <Overlay onClose={onClose}>
      <ModalCard width={400}>
        <ModalHeader title="Create Folder" onClose={onClose} />
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--foreground)', marginBottom: 7 }}>Folder Name</label>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreate()} placeholder="e.g. Cardiology Unit 3"
            style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--input-background)', color: 'var(--foreground)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--foreground)', marginBottom: 7 }}>Parent Folder <span style={{ fontWeight: 400, color: 'var(--muted-foreground)' }}>(optional)</span></label>
            <select value={parentId || ''} onChange={(e) => setParentId(e.target.value || null)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--input-background)', color: 'var(--foreground)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
              <option value="">None — root level</option>
              {parentOptions.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn label="Cancel" variant="ghost" onClick={onClose} />
            <Btn label="Create Folder" variant="primary" onClick={handleCreate} disabled={!name.trim()} />
          </div>
        </div>
      </ModalCard>
    </Overlay>);

}

export function CreateSmartViewModal({ isOpen, onClose, onCreate, title = 'Create Smart View', availableTags = []




}: {isOpen: boolean;onClose: () => void;onCreate: (name: string, criteria: SmartCriteria) => void;title?: string;availableTags?: string[];}) {
  const [name, setName] = useState('');
  const [criteria, setCriteria] = useState<SmartCriteria>(DEFAULT_CRITERIA);
  if (!isOpen) return null;
  return (
    <Overlay onClose={onClose}>
      <ModalCard width={520}>
        <ModalHeader title={title} onClose={onClose} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', maxHeight: '72vh' }}>
          <CriteriaForm name={name} setName={setName} criteria={criteria} setCriteria={setCriteria} availableTags={availableTags} />
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end', flexShrink: 0 }}>
          <Btn label="Cancel" variant="ghost" onClick={onClose} />
          <Btn label="Create Smart View" variant="primary" onClick={() => {if (name.trim()) {onCreate(name.trim(), criteria);setName('');setCriteria(DEFAULT_CRITERIA);onClose();}}} disabled={!name.trim()} />
        </div>
      </ModalCard>
    </Overlay>);

}

export function EditSmartViewModal({ isOpen, onClose, initialName, initialCriteria, onSave, availableTags = []



}: {isOpen: boolean;onClose: () => void;initialName: string;initialCriteria: SmartCriteria;onSave: (name: string, criteria: SmartCriteria) => void;availableTags?: string[];}) {
  const [name, setName] = useState(initialName);
  const [criteria, setCriteria] = useState<SmartCriteria>(initialCriteria);
  if (!isOpen) return null;
  return (
    <Overlay onClose={onClose}>
      <ModalCard width={520}>
        <ModalHeader title="Edit Smart View" onClose={onClose} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', maxHeight: '72vh' }}>
          <CriteriaForm name={name} setName={setName} criteria={criteria} setCriteria={setCriteria} availableTags={availableTags} />
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end', flexShrink: 0 }}>
          <Btn label="Cancel" variant="ghost" onClick={onClose} />
          <Btn label="Save Changes" variant="primary" onClick={() => {onSave(name, criteria);onClose();}} />
        </div>
      </ModalCard>
    </Overlay>);

}

export function ArchiveConfirmModal({ isOpen, onClose, onConfirm, folderName

}: {isOpen: boolean;onClose: () => void;onConfirm: () => void;folderName: string;}) {
  if (!isOpen) return null;
  return (
    <Overlay onClose={onClose}>
      <ModalCard width={380}>
        <ModalHeader title="Archive Folder" onClose={onClose} />
        <div style={{ padding: '16px 24px 24px' }}>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginBottom: 8, lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--foreground)' }}>"{folderName}"</strong> will be archived. You can restore it later from the Archived section.
          </p>
          <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginBottom: 24 }}>Questions inside will remain accessible individually.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn label="Cancel" variant="ghost" onClick={onClose} />
            <Btn label="Archive Folder" variant="warning" onClick={() => {onConfirm();onClose();}} />
          </div>
        </div>
      </ModalCard>
    </Overlay>);

}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName, itemType

}: {isOpen: boolean;onClose: () => void;onConfirm: () => void;itemName: string;itemType: 'folder' | 'smart view';}) {
  if (!isOpen) return null;
  const label = itemType === 'folder' ? 'Folder' : 'Smart View';
  return (
    <Overlay onClose={onClose}>
      <ModalCard width={380}>
        <ModalHeader title={`Delete ${label}`} onClose={onClose} />
        <div style={{ padding: '16px 24px 24px' }}>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginBottom: 24, lineHeight: 1.6 }}>
            Delete <strong style={{ color: 'var(--foreground)' }}>"{itemName}"</strong>? {itemType === 'folder' ? 'Questions will not be deleted — just unassigned from this folder.' : 'This smart view will be permanently removed.'}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn label="Cancel" variant="ghost" onClick={onClose} />
            <Btn label="Delete" variant="danger" onClick={() => {onConfirm();onClose();}} />
          </div>
        </div>
      </ModalCard>
    </Overlay>);

}

export function ShareFolderModal({ isOpen, onClose, itemName, itemType

}: {isOpen: boolean;onClose: () => void;itemName: string;itemType: 'folder' | 'view';}) {
  const [email, setEmail] = useState('');
  const [perm, setPerm] = useState<'view' | 'edit'>('view');
  const [collab, setCollab] = useState(true);
  const [users, setUsers] = useState([
  { name: 'Dr. Sarah Chen', email: 's.chen@touro.edu', perm: 'edit' as const },
  { name: 'Prof. Marcus Hill', email: 'm.hill@touro.edu', perm: 'view' as const }]
  );
  if (!isOpen) return null;
  const add = () => {if (!email.trim()) return;setUsers((u) => [...u, { name: email, email, perm }]);setEmail('');};
  const inp: React.CSSProperties = { padding: '8px 12px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--input-background)', color: 'var(--foreground)', fontSize: 13, outline: 'none' };
  function ToggleSwitch({ on, onToggle }: {on: boolean;onToggle: () => void;}) {
    return (
      <button onClick={onToggle} style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', background: on ? 'var(--brand)' : 'var(--muted)', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
        <span style={{ position: 'absolute', width: 16, height: 16, borderRadius: '50%', background: 'white', top: 3, left: on ? 21 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
      </button>);

  }
  return (
    <Overlay onClose={onClose}>
      <ModalCard width={460}>
        <ModalHeader title={`Share ${itemType === 'folder' ? 'Folder' : 'View'}: "${itemName}"`} onClose={onClose} />
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Add by email or name..." style={{ ...inp, flex: 1 }} />
            <select value={perm} onChange={(e) => setPerm(e.target.value as 'view' | 'edit')} style={{ ...inp }}>
              <option value="view">Can view</option>
              <option value="edit">Can edit</option>
            </select>
            <Btn label="Add" variant="primary" onClick={add} disabled={!email.trim()} />
          </div>
          {users.length > 0 &&
          <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
              {users.map((u, i) =>
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--brand-foreground)', flexShrink: 0 }}>
                    {u.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{u.email}</div>
                  </div>
                  <select value={u.perm} onChange={(e) => setUsers((us) => us.map((x, j) => j === i ? { ...x, perm: e.target.value as 'view' | 'edit' } : x))}
              style={{ fontSize: 12, padding: '3px 8px', borderRadius: 5, border: '1px solid var(--border)', background: 'var(--input-background)', color: 'var(--foreground)', outline: 'none' }}>
                    <option value="view">Can view</option>
                    <option value="edit">Can edit</option>
                  </select>
                  <button onClick={() => setUsers((us) => us.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: 2, display: 'flex', borderRadius: 4 }}>
                    <i className="fa-regular fa-xmark" style={{ fontSize: 14, lineHeight: 1 }} />
                  </button>
                </div>
            )}
            </div>
          }
          {itemType === 'folder' &&
          <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>Collaboration folder</div>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 1 }}>Recipients receive updates when this folder changes</div>
                </div>
                <ToggleSwitch on={collab} onToggle={() => setCollab((c) => !c)} />
              </div>
              <div style={{ padding: '10px 12px', background: 'var(--sidebar-accent)', borderRadius: 7, fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 16, lineHeight: 1.5 }}>
                {collab ? <>Recipients see live updates. They cannot add/remove questions unless given <strong style={{ color: 'var(--foreground)' }}>edit</strong> access.</> : <>Recipients receive a <strong style={{ color: 'var(--foreground)' }}>static copy</strong>. Changes to this folder won't affect their copy.</>}
              </div>
            </>
          }
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Btn label="Done" variant="primary" onClick={onClose} />
          </div>
        </div>
      </ModalCard>
    </Overlay>);

}

export function AddToFolderModal({ isOpen, onClose, allFolders, assignedFolderIds, questionCount, onAdd





}: {isOpen: boolean;onClose: () => void;allFolders: Array<{id: string;name: string;parentId: string | null;locked?: boolean;}>;assignedFolderIds: string[];questionCount: number;onAdd: (folderIds: string[]) => void;}) {
  const [sel, setSel] = useState<string[]>([]);
  if (!isOpen) return null;
  const roots = allFolders.filter((f) => !f.parentId && !f.locked);
  const getChildren = (pid: string) => allFolders.filter((f) => f.parentId === pid && !f.locked);
  const toggle = (id: string) => setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  function FItem({ f, depth }: {f: {id: string;name: string;parentId: string | null;locked?: boolean;};depth: number;}) {
    const ch = getChildren(f.id);
    const already = assignedFolderIds.includes(f.id);
    const checked = already || sel.includes(f.id);
    return (
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: `6px 14px 6px ${14 + depth * 16}px`, cursor: already ? 'default' : 'pointer', background: sel.includes(f.id) ? 'color-mix(in oklch,var(--brand) 5%,white)' : 'transparent' }}>
          {ch.length > 0 ?
          <i className="fa-regular fa-chevron-right" style={{ fontSize: 11, color: 'var(--muted-foreground)', flexShrink: 0 }} /> :
          <span style={{ width: 12, flexShrink: 0 }} />
          }
          <i className="fa-regular fa-folder" style={{ fontSize: 12, flexShrink: 0, color: 'var(--muted-foreground)' }} />
          <input type="checkbox" checked={checked} disabled={already} onChange={() => !already && toggle(f.id)} style={{ accentColor: 'var(--brand)', flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: already ? 'var(--muted-foreground)' : 'var(--foreground)', flex: 1 }}>{f.name}</span>
          {already && <span style={{ fontSize: 10, color: 'var(--muted-foreground)', fontWeight: 600, background: 'var(--sidebar-accent)', padding: '1px 6px', borderRadius: 4 }}>Already added</span>}
        </label>
        {ch.map((c) => <FItem key={c.id} f={c} depth={depth + 1} />)}
      </div>);

  }
  return (
    <Overlay onClose={onClose}>
      <ModalCard width={400}>
        <ModalHeader title="Add to Folder" onClose={onClose} />
        <div style={{ padding: '8px 0 0', fontSize: 12, color: 'var(--muted-foreground)', paddingLeft: 14, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
          Adding {questionCount} question{questionCount !== 1 ? 's' : ''} to selected folders
        </div>
        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
          {roots.map((f) => <FItem key={f.id} f={f} depth={0} />)}
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn label="Cancel" variant="ghost" onClick={() => {setSel([]);onClose();}} />
          <Btn label={sel.length ? `Add to ${sel.length} folder${sel.length !== 1 ? 's' : ''}` : 'Select folders'} variant="primary" disabled={sel.length === 0} onClick={() => {onAdd(sel);setSel([]);onClose();}} />
        </div>
      </ModalCard>
    </Overlay>);

}