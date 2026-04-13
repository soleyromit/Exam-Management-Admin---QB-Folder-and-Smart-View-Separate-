import React, { useState, useRef, useEffect } from 'react';

type PermRole = 'owner' | 'editor' | 'commenter' | 'viewer';

interface Collaborator {
  name: string;
  email: string;
  role: PermRole;
  canCreateSubfolder: boolean;
  canRemoveFromFolder: boolean;
  canAddToMainFolder: boolean;
  isOwner?: boolean;
}

const FACULTY_SUGGESTIONS = [
{ name: 'Dr. Sarah Chen', email: 's.chen@touro.edu' },
{ name: 'Dr. James Kim', email: 'j.kim@touro.edu' },
{ name: 'Dr. Priya Lee', email: 'p.lee@touro.edu' },
{ name: 'Dr. Miguel Ramirez', email: 'm.ramirez@touro.edu' },
{ name: 'Prof. Marcus Hill', email: 'm.hill@touro.edu' },
{ name: 'Dr. Aisha Okafor', email: 'a.okafor@touro.edu' }];


const ROLE_LABELS: Record<PermRole, string> = {
  owner: 'Owner',
  editor: 'Can edit',
  commenter: 'Can comment',
  viewer: 'Can view'
};

function Avatar({ name, size = 28, color = 'var(--brand)' }: {name: string;size?: number;color?: string;}) {
  const initials = name.replace('Dr. ', '').replace('Prof. ', '').
  split(' ').map((n) => n[0] || '').join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700,
      color: 'var(--brand-foreground)',
      flexShrink: 0, border: '1.5px solid white'
    }}>
      {initials}
    </div>);

}

function RoleSelect({ value, onChange, disabled = false }: {value: PermRole;onChange: (v: PermRole) => void;disabled?: boolean;}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as PermRole)}
      disabled={disabled}
      style={{
        fontSize: 12, padding: '3px 8px',
        borderRadius: 5, border: '1px solid var(--border)',
        background: disabled ? 'var(--muted)' : 'var(--input-background)',
        color: disabled ? 'var(--muted-foreground)' : 'var(--foreground)',
        outline: 'none', cursor: disabled ? 'not-allowed' : 'pointer'
      }}>
      
      {disabled ?
      <option value="owner">Owner</option> :

      <>
          <option value="editor">Can edit</option>
          <option value="commenter">Can comment</option>
          <option value="viewer">Can view</option>
        </>
      }
    </select>);

}

function PermToggle({ label, checked, onChange }: {label: string;checked: boolean;onChange: (v: boolean) => void;}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 28, height: 16, borderRadius: 8,
          background: checked ? 'var(--brand)' : 'var(--muted)',
          position: 'relative', flexShrink: 0,
          transition: 'background .18s', cursor: 'pointer',
          border: 'none'
        }}>
        
        <span style={{
          position: 'absolute',
          width: 12, height: 12, borderRadius: '50%', background: 'white',
          top: 2, left: checked ? 14 : 2,
          transition: 'left .18s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.25)'
        }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--foreground)', fontWeight: 400 }}>{label}</span>
    </label>);

}

export function ShareQuestionModal({
  isOpen, onClose, questionTitle, questionId





}: {isOpen: boolean;onClose: () => void;questionTitle?: string;questionId?: string;}) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
  {
    name: 'Dr. Patel', email: 'r.patel@touro.edu', role: 'owner',
    canCreateSubfolder: true, canRemoveFromFolder: true, canAddToMainFolder: true, isOwner: true
  },
  {
    name: 'Dr. Sarah Chen', email: 's.chen@touro.edu', role: 'editor',
    canCreateSubfolder: true, canRemoveFromFolder: false, canAddToMainFolder: true
  },
  {
    name: 'Prof. Marcus Hill', email: 'm.hill@touro.edu', role: 'viewer',
    canCreateSubfolder: false, canRemoveFromFolder: false, canAddToMainFolder: false
  }]
  );

  const [searchVal, setSearchVal] = useState('');
  const [newRole, setNewRole] = useState<PermRole>('editor');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [generalAccess, setGeneralAccess] = useState<'restricted' | 'link-view'>('restricted');
  const [linkCopied, setLinkCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const existingEmails = collaborators.map((c) => c.email);
  const filtered = searchVal.trim() ?
  FACULTY_SUGGESTIONS.filter(
    (f) => !existingEmails.includes(f.email) && (
    f.name.toLowerCase().includes(searchVal.toLowerCase()) ||
    f.email.toLowerCase().includes(searchVal.toLowerCase()))
  ) :
  [];

  const addCollaborator = (faculty: {name: string;email: string;}) => {
    setCollaborators((prev) => [
    ...prev,
    {
      name: faculty.name, email: faculty.email,
      role: newRole,
      canCreateSubfolder: newRole === 'editor',
      canRemoveFromFolder: false,
      canAddToMainFolder: newRole === 'editor'
    }]
    );
    setSearchVal('');
    setShowSuggestions(false);
  };

  const removeCollaborator = (email: string) => {
    setCollaborators((prev) => prev.filter((c) => c.email !== email));
  };

  const updateCollaborator = (email: string, patch: Partial<Collaborator>) => {
    setCollaborators((prev) => prev.map((c) => c.email === email ? { ...c, ...patch } : c));
  };

  const handleCopyLink = () => {
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  if (!isOpen) return null;

  const displayTitle = questionTitle ?
  questionTitle.length > 45 ? questionTitle.slice(0, 45) + '…' : questionTitle :
  'This Question';

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={(e) => {if (e.target === e.currentTarget) onClose();}}>
      
      <div style={{
        background: 'var(--card)', borderRadius: 12, width: 480, maxWidth: '95vw',
        boxShadow: '0 24px 64px rgba(0,0,0,0.22)', display: 'flex', flexDirection: 'column',
        maxHeight: '90vh'
      }}>
        {/* Header */}
        <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 10, flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Share Question</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.3, fontFamily: 'var(--font-heading)' }}>{displayTitle}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: 4, borderRadius: 4, display: 'flex', flexShrink: 0 }}>
            <i className="fa-regular fa-xmark" style={{ fontSize: 16, lineHeight: 1 }} />
          </button>
        </div>

        {/* Invite section */}
        <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 10px', borderRadius: 7,
                border: `1px solid ${showSuggestions && filtered.length ? 'var(--brand)' : 'var(--border)'}`,
                background: 'var(--input-background)'
              }}>
                <i className="fa-regular fa-magnifying-glass" style={{ fontSize: 12, color: 'var(--muted-foreground)', flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  value={searchVal}
                  onChange={(e) => {setSearchVal(e.target.value);setShowSuggestions(true);}}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Invite by name or email…"
                  style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--foreground)', minWidth: 0 }} />
                
                {searchVal &&
                <button onClick={() => {setSearchVal('');setShowSuggestions(false);}} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: 0, display: 'flex' }}>
                    <i className="fa-regular fa-xmark" style={{ fontSize: 12, lineHeight: 1 }} />
                  </button>
                }
              </div>
              {/* Suggestions dropdown */}
              {showSuggestions && filtered.length > 0 &&
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 3,
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                zIndex: 10, overflow: 'hidden'
              }}>
                  {filtered.map((f) =>
                <button key={f.email}
                onMouseDown={(e) => {e.preventDefault();addCollaborator(f);}}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                  
                      <Avatar name={f.name} size={26} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{f.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{f.email}</div>
                      </div>
                    </button>
                )}
                  {searchVal.trim() && !FACULTY_SUGGESTIONS.some((f) => f.email.toLowerCase() === searchVal.toLowerCase()) &&
                <button
                  onMouseDown={(e) => {e.preventDefault();addCollaborator({ name: searchVal, email: searchVal });}}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', width: '100%', background: 'none', border: 'none', borderTop: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                  
                      <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className="fa-regular fa-user-plus" style={{ fontSize: 11, color: 'var(--muted-foreground)' }} />
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--foreground)' }}>Invite <strong>"{searchVal}"</strong></span>
                    </button>
                }
                </div>
              }
            </div>
            {/* Role picker for new invite */}
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as PermRole)}
              style={{ padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--input-background)', color: 'var(--foreground)', fontSize: 13, outline: 'none', cursor: 'pointer', flexShrink: 0 }}>
              
              <option value="editor">Can edit</option>
              <option value="commenter">Can comment</option>
              <option value="viewer">Can view</option>
            </select>
          </div>
        </div>

        {/* Collaborators list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
          <div style={{ padding: '4px 22px 8px', fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>People with access</div>
          {collaborators.map((c) => {
            const key = c.email;
            const isExpanded = expandedId === key;
            return (
              <div key={key} style={{ borderBottom: '1px solid var(--border)' }}>
                {/* Collaborator row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 22px' }}>
                  <Avatar name={c.name} size={30} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.name}{c.isOwner && <span style={{ fontSize: 10, color: 'var(--muted-foreground)', fontWeight: 400, marginLeft: 4 }}>(you)</span>}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{c.email}</div>
                  </div>
                  <RoleSelect value={c.role} onChange={(v) => updateCollaborator(c.email, { role: v })} disabled={c.isOwner} />
                  {/* Expand permissions */}
                  {!c.isOwner &&
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : key)}
                    title="Folder permissions"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: '3px 4px', borderRadius: 4, display: 'flex', flexShrink: 0 }}
                    onMouseEnter={(e) => {e.currentTarget.style.color = 'var(--foreground)';e.currentTarget.style.background = 'var(--accent)';}}
                    onMouseLeave={(e) => {e.currentTarget.style.color = 'var(--muted-foreground)';e.currentTarget.style.background = 'none';}}>
                    
                      <i className={`fa-regular fa-${isExpanded ? 'chevron-up' : 'chevron-down'}`} style={{ fontSize: 11, lineHeight: 1 }} />
                    </button>
                  }
                  {!c.isOwner &&
                  <button
                    onClick={() => removeCollaborator(c.email)}
                    title="Remove"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: '3px 4px', borderRadius: 4, display: 'flex', flexShrink: 0 }}
                    onMouseEnter={(e) => {e.currentTarget.style.color = '#ef4444';e.currentTarget.style.background = '#fee2e2';}}
                    onMouseLeave={(e) => {e.currentTarget.style.color = 'var(--muted-foreground)';e.currentTarget.style.background = 'none';}}>
                    
                      <i className="fa-regular fa-xmark" style={{ fontSize: 13, lineHeight: 1 }} />
                    </button>
                  }
                </div>

                {/* Folder permissions expansion */}
                {isExpanded && !c.isOwner &&
                <div style={{ padding: '10px 22px 14px 62px', background: 'color-mix(in oklch,var(--brand) 3%,white)', borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Folder permissions</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                      <PermToggle
                      label="Create subfolders"
                      checked={c.canCreateSubfolder}
                      onChange={(v) => updateCollaborator(c.email, { canCreateSubfolder: v })} />
                    
                      <PermToggle
                      label="Remove from folder"
                      checked={c.canRemoveFromFolder}
                      onChange={(v) => updateCollaborator(c.email, { canRemoveFromFolder: v })} />
                    
                      <PermToggle
                      label="Add / update main folder"
                      checked={c.canAddToMainFolder}
                      onChange={(v) => updateCollaborator(c.email, { canAddToMainFolder: v })} />
                    
                    </div>
                  </div>
                }
              </div>);

          })}
        </div>

        {/* General access */}
        <div style={{ padding: '12px 22px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>General access</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: generalAccess === 'link-view' ? '#dbeafe' : 'var(--muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <i className={`fa-regular fa-${generalAccess === 'link-view' ? 'link' : 'lock'}`}
              style={{ fontSize: 14, color: generalAccess === 'link-view' ? '#1d4ed8' : 'var(--muted-foreground)', lineHeight: 1 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <select
                value={generalAccess}
                onChange={(e) => setGeneralAccess(e.target.value as any)}
                style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', width: '100%' }}>
                
                <option value="restricted">Restricted (only invited people)</option>
                <option value="link-view">Anyone with link can view</option>
              </select>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 1 }}>
                {generalAccess === 'restricted' ?
                'Only collaborators listed above can access' :
                'Anyone with the link can view this question'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 22px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <button
            onClick={handleCopyLink}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 12px', borderRadius: 7,
              border: '1px solid var(--border)',
              background: linkCopied ? 'color-mix(in oklch,var(--brand) 8%,white)' : 'transparent',
              color: linkCopied ? 'var(--brand)' : 'var(--foreground)',
              fontSize: 13, cursor: 'pointer', fontWeight: linkCopied ? 600 : 400,
              transition: 'all .15s'
            }}
            onMouseEnter={(e) => {if (!linkCopied) {e.currentTarget.style.background = 'var(--accent)';}}}
            onMouseLeave={(e) => {if (!linkCopied) {e.currentTarget.style.background = 'transparent';}}}>
            
            <i className={`fa-regular fa-${linkCopied ? 'circle-check' : 'link'}`} style={{ fontSize: 13, lineHeight: 1 }} />
            {linkCopied ? 'Link copied!' : 'Copy link'}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '7px 20px', borderRadius: 7, border: 'none',
              background: 'var(--brand)', color: 'var(--brand-foreground)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}>
            Done</button>
        </div>
      </div>
    </div>);

}