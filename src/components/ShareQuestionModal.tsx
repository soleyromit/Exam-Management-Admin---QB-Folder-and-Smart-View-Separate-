import React, { useState, useRef, useEffect } from 'react';
import type { FacultyInfo } from './QBModals';

type AccessLevel = 'view' | 'edit';

function Avatar({ name, size = 28, color = '#7c3aed' }: {name: string;size?: number;color?: string;}) {
  const initials = name.replace('Dr. ', '').replace('Prof. ', '').
  split(' ').map((n) => n[0] || '').join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700,
      color: 'white', flexShrink: 0
    }}>
      {initials}
    </div>);

}

export function ShareQuestionModal({
  isOpen, onClose,
  questionTitle, questionId,
  allFaculty,
  questionAccessMap,
  onUpdateQuestionAccess








}: {isOpen: boolean;onClose: () => void;questionTitle?: string;questionId?: string | null;allFaculty: FacultyInfo[];questionAccessMap: Record<string, Record<string, AccessLevel>>;onUpdateQuestionAccess: (qId: string, newAccess: Record<string, AccessLevel>) => void;}) {
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // local copy of access for this question
  const getInitialAccess = () => {
    if (!questionId) return {};
    return { ...(questionAccessMap[questionId] || {}) };
  };
  const [localAccess, setLocalAccess] = useState<Record<string, AccessLevel>>(getInitialAccess);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSaved(false);
      setLocalAccess(getInitialAccess());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, questionId]);

  if (!isOpen) return null;

  const searchLower = search.toLowerCase();
  const hasAccess = (name: string) => localAccess[name] != null;
  const currentlyShared = allFaculty.filter((f) => hasAccess(f.name));
  const suggestions = allFaculty.filter(
    (f) => !hasAccess(f.name) &&
    f.name.toLowerCase().includes(searchLower)
  );

  const grant = (name: string, level: AccessLevel = 'view') => {
    setLocalAccess((prev) => ({ ...prev, [name]: level }));
    setSearch('');
    setSaved(false);
    inputRef.current?.focus();
  };

  const revoke = (name: string) => {
    setLocalAccess((prev) => {const n = { ...prev };delete n[name];return n;});
    setSaved(false);
  };

  const setLevel = (name: string, level: AccessLevel) => {
    setLocalAccess((prev) => ({ ...prev, [name]: level }));
    setSaved(false);
  };

  const toggleLevel = (name: string) => {
    setLocalAccess((prev) => ({ ...prev, [name]: prev[name] === 'edit' ? 'view' : 'edit' }));
    setSaved(false);
  };

  const handleSave = () => {
    if (!questionId) return;
    onUpdateQuestionAccess(questionId, { ...localAccess });
    setSaved(true);
    setTimeout(onClose, 900);
  };

  const inp: React.CSSProperties = {
    flex: 1, border: 'none', outline: 'none',
    background: 'transparent', fontSize: 13,
    color: 'var(--foreground)', minWidth: 0
  };

  const badgeStyle = (level: AccessLevel) => ({
    bg: level === 'edit' ? '#ede9fe' : '#f0f9ff',
    text: level === 'edit' ? '#6d28d9' : '#0369a1',
    border: level === 'edit' ? '#c4b5fd' : '#bae6fd',
    icon: level === 'edit' ? 'fa-pen' : 'fa-eye',
    label: level === 'edit' ? 'Can edit' : 'View only'
  });

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}
      onClick={onClose}>
      
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--card)', borderRadius: 14,
          boxShadow: '0 8px 48px rgba(0,0,0,0.22)',
          width: 500, maxWidth: '94vw',
          maxHeight: '82vh', display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}>
        
        {/* Header */}
        <div style={{ padding: '18px 24px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa-regular fa-share-nodes" style={{ fontSize: 14, color: '#7c3aed' }} />
                Share Question
              </div>
              {questionTitle &&
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 380 }}>
                  "{questionTitle}"
                </div>
              }
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: 4, borderRadius: 6, display: 'flex' }}>
              <i className="fa-regular fa-xmark" style={{ fontSize: 16, lineHeight: 1 }} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {/* Info */}
          <div style={{ padding: '10px 14px', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <i className="fa-regular fa-circle-info" style={{ fontSize: 13, color: '#7c3aed', marginTop: 1, flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>
              Sharing this question gives the selected faculty direct access to it, even if they don't have access to its folder. Faculty with view-only access can read, comment, and shortlist; edit access allows full editing.
            </div>
          </div>

          {/* Search input */}
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--input-background)' }}>
              <i className="fa-regular fa-magnifying-glass" style={{ fontSize: 12, color: 'var(--muted-foreground)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search faculty to share with…"
                style={inp} />
              
              {search &&
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: 0, display: 'flex' }}>
                  <i className="fa-regular fa-xmark" style={{ fontSize: 11 }} />
                </button>
              }
            </div>

            {/* Suggestions dropdown */}
            {search &&
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 200, overflow: 'hidden' }}>
                {suggestions.length > 0 ? suggestions.map((f) =>
              <div key={f.id} style={{ display: 'flex', alignItems: 'stretch', borderBottom: '1px solid var(--border)' }}>
                    <button
                  onMouseDown={() => grant(f.name, 'view')}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                  
                      <Avatar name={f.name} size={28} color={f.color} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{f.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Grant view access</div>
                      </div>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', flexShrink: 0 }}>View</span>
                    </button>
                    <button
                  onMouseDown={() => grant(f.name, 'edit')}
                  title="Grant edit access"
                  style={{ padding: '9px 12px', background: 'none', border: 'none', borderLeft: '1px solid var(--border)', cursor: 'pointer', flexShrink: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#faf5ff'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                  
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#ede9fe', color: '#6d28d9', border: '1px solid #c4b5fd' }}>Edit</span>
                    </button>
                  </div>
              ) :
              <div style={{ padding: '10px 14px', fontSize: 13, color: 'var(--muted-foreground)' }}>
                    {allFaculty.some((f) => hasAccess(f.name) && f.name.toLowerCase().includes(searchLower)) ?
                'Already shared with this person' :
                'No matching faculty'}
                  </div>
              }
              </div>
            }
          </div>

          {/* Currently shared */}
          {currentlyShared.length > 0 ?
          <>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Shared with ({currentlyShared.length})
              </div>
              <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                {currentlyShared.map((f, i) => {
                const level = localAccess[f.name];
                const badge = badgeStyle(level);
                return (
                  <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: i < currentlyShared.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <Avatar name={f.name} size={30} color={f.color} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{f.name}</div>
                      </div>
                      {/* Inline view/edit select */}
                      <select
                      value={level}
                      onChange={(e) => setLevel(f.name, e.target.value as AccessLevel)}
                      style={{ fontSize: 12, padding: '3px 8px', borderRadius: 5, border: '1px solid var(--border)', background: 'var(--input-background)', color: 'var(--foreground)', outline: 'none', cursor: 'pointer', marginRight: 4 }}>
                      
                        <option value="view">View only</option>
                        <option value="edit">Can edit</option>
                      </select>
                      <button
                      onClick={() => revoke(f.name)}
                      title="Remove access"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: '3px 6px', borderRadius: 4, display: 'flex', flexShrink: 0 }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}>
                      
                        <i className="fa-regular fa-xmark" style={{ fontSize: 13, lineHeight: 1 }} />
                      </button>
                    </div>);

              })}
              </div>
            </> :

          <div style={{ padding: '20px 0', textAlign: 'center' }}>
              <i className="fa-regular fa-share-nodes" style={{ fontSize: 24, color: 'var(--muted-foreground)', display: 'block', marginBottom: 8 }} />
              <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>This question hasn't been shared with anyone yet.</div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4 }}>Search above to share with faculty.</div>
            </div>
          }
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
          {saved &&
          <span style={{ fontSize: 12, color: '#059669', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600, marginRight: 'auto' }}>
              <i className="fa-regular fa-circle-check" style={{ fontSize: 13 }} /> Access updated
            </span>
          }
          <button
            onClick={onClose}
            style={{ padding: '7px 16px', borderRadius: 7, border: '1px solid var(--border)', background: 'white', color: 'var(--foreground)', fontSize: 13, cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
            
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{ padding: '7px 20px', borderRadius: 7, border: 'none', background: '#7c3aed', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#6d28d9'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#7c3aed'}>
            
            Save
          </button>
        </div>
      </div>
    </div>);

}