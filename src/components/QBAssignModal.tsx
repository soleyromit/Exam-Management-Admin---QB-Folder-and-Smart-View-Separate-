import React, { useState } from 'react';
import type { FolderNode, AccessLevel } from './QBData';

const FACULTY_MEMBERS = [
{ id: 'dr-patel', name: 'Dr. Patel', dept: 'Pharmacology', initials: 'AP', color: '#0891b2' },
{ id: 'dr-chen', name: 'Dr. Chen', dept: 'Cardiology', initials: 'SC', color: '#059669' },
{ id: 'dr-lee', name: 'Dr. Lee', dept: 'Physiology', initials: 'PL', color: '#d97706' },
{ id: 'dr-ramirez', name: 'Dr. Ramirez', dept: 'Biochemistry', initials: 'MR', color: '#dc2626' },
{ id: 'dr-kim', name: 'Dr. Kim', dept: 'Anatomy', initials: 'JK', color: '#0f766e' },
{ id: 'dr-wells', name: 'Dr. Wells', dept: 'General Studies', initials: 'DW', color: '#64748b' }];


// Per-faculty assignments: facultyName → { folderId → AccessLevel }
export type FacultyAccessMap = Record<string, Record<string, AccessLevel>>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  folders: FolderNode[];
  facultyAssignments: Record<string, string[]>;
  facultyAccessMap?: FacultyAccessMap;
  onSave: (folderIds: Record<string, string[]>, accessMap: FacultyAccessMap) => void;
}

function accessLabel(level: AccessLevel) {
  return level === 'edit' ? 'Can edit' : 'View only';
}

function accessIcon(level: AccessLevel) {
  return level === 'edit' ? 'fa-pen' : 'fa-eye';
}

function accessColors(level: AccessLevel) {
  return level === 'edit' ?
  { bg: '#ede9fe', text: '#6d28d9', border: '#c4b5fd' } :
  { bg: '#f0f9ff', text: '#0369a1', border: '#bae6fd' };
}

export function AssignCoursesModal({ isOpen, onClose, folders, facultyAssignments, facultyAccessMap, onSave }: Props) {
  const buildInitialAccessMap = (): FacultyAccessMap => {
    const map: FacultyAccessMap = {};
    FACULTY_MEMBERS.forEach((fm) => {
      map[fm.name] = {};
      const assigned = facultyAssignments[fm.name] || [];
      assigned.forEach((fid) => {
        map[fm.name][fid] = facultyAccessMap?.[fm.name]?.[fid] ?? 'view';
      });
    });
    return map;
  };

  const [accessMap, setAccessMap] = useState<FacultyAccessMap>(buildInitialAccessMap);
  const [activeTab, setActiveTab] = useState<'byfaculty' | 'bycourse'>('byfaculty');
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const isAssigned = (facultyName: string, folderId: string) => !!accessMap[facultyName]?.[folderId];
  const getLevel = (facultyName: string, folderId: string): AccessLevel => accessMap[facultyName]?.[folderId] ?? 'view';

  const toggleAssign = (facultyName: string, folderId: string) => {
    setAccessMap((prev) => {
      const cur = { ...(prev[facultyName] || {}) };
      if (cur[folderId]) {
        delete cur[folderId];
      } else {
        cur[folderId] = 'view';
      }
      return { ...prev, [facultyName]: cur };
    });
    setSaved(false);
  };

  const cycleLevel = (facultyName: string, folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setAccessMap((prev) => {
      const cur = { ...(prev[facultyName] || {}) };
      if (!cur[folderId]) return prev;
      cur[folderId] = cur[folderId] === 'view' ? 'edit' : 'view';
      return { ...prev, [facultyName]: cur };
    });
    setSaved(false);
  };

  const handleSave = () => {
    const folderIds: Record<string, string[]> = {};
    FACULTY_MEMBERS.forEach((fm) => {
      folderIds[fm.name] = Object.keys(accessMap[fm.name] || {});
    });
    setSaved(true);
    setTimeout(() => {onSave(folderIds, accessMap);}, 600);
  };

  const filteredFaculty = FACULTY_MEMBERS.filter((f) =>
  f.name.toLowerCase().includes(search.toLowerCase()) ||
  f.dept.toLowerCase().includes(search.toLowerCase())
  );

  const totalAssigned = FACULTY_MEMBERS.reduce((s, fm) =>
  s + Object.keys(accessMap[fm.name] || {}).length, 0
  );
  const editCount = FACULTY_MEMBERS.reduce((s, fm) =>
  s + Object.values(accessMap[fm.name] || {}).filter((v) => v === 'edit').length, 0
  );

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 9998, backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 640, maxHeight: '84vh',
        background: 'white', borderRadius: 14,
        boxShadow: '0 24px 60px rgba(0,0,0,0.22)', zIndex: 9999,
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ padding: '18px 20px 0', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fa-regular fa-user-plus" style={{ fontSize: 16, color: '#7c3aed' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111' }}>Assign Faculty to Courses</h2>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: '#6b7280' }}>
                Set which courses faculty can access and whether they can edit questions.
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, borderRadius: 6, display: 'flex' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#374151'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
              <i className="fa-regular fa-xmark" style={{ fontSize: 16 }} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 20, background: '#f0f9ff', border: '1px solid #bae6fd', fontSize: 11, color: '#0369a1' }}>
              <i className="fa-regular fa-eye" style={{ fontSize: 10 }} /> View only
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 20, background: '#ede9fe', border: '1px solid #c4b5fd', fontSize: 11, color: '#6d28d9' }}>
              <i className="fa-regular fa-pen" style={{ fontSize: 10 }} /> Can edit
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginLeft: 'auto', alignSelf: 'center' }}>
              Click the badge to toggle between view / edit access
            </div>
          </div>
          <div style={{ display: 'flex', gap: 2, marginBottom: -1 }}>
            {([['byfaculty', 'By Faculty', 'user-group'], ['bycourse', 'By Course', 'graduation-cap']] as const).map(([id, label, icon]) =>
            <button key={id} onClick={() => setActiveTab(id as any)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: '6px 6px 0 0',
              border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              background: activeTab === id ? 'white' : 'transparent',
              color: activeTab === id ? '#7c3aed' : '#6b7280',
              borderBottom: activeTab === id ? '2px solid #7c3aed' : '2px solid transparent',
              marginBottom: -1
            }}>
                <i className={`fa-regular fa-${icon}`} style={{ fontSize: 11 }} />
                {label}
              </button>
            )}
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: '#6b7280', padding: '7px 0', alignSelf: 'center' }}>
              {totalAssigned} assignment{totalAssigned !== 1 ? 's' : ''} · {editCount} with edit
            </span>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 20px 8px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb' }}>
            <i className="fa-regular fa-magnifying-glass" style={{ fontSize: 12, color: '#9ca3af' }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === 'byfaculty' ? 'Search faculty…' : 'Search courses…'}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#374151' }} />
            
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#9ca3af' }}><i className="fa-regular fa-xmark" style={{ fontSize: 11 }} /></button>}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 16px' }}>
          {activeTab === 'byfaculty' ?
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredFaculty.map((faculty) => {
              const assigned = Object.keys(accessMap[faculty.name] || {});
              return (
                <div key={faculty.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: faculty.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{faculty.initials}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{faculty.name}</div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>{faculty.dept}</div>
                      </div>
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: assigned.length > 0 ? '#ede9fe' : '#f3f4f6',
                      color: assigned.length > 0 ? '#7c3aed' : '#9ca3af'
                    }}>{assigned.length} course{assigned.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div style={{ padding: '8px 14px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {folders.length === 0 ?
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px', borderRadius: 8, background: '#fef3c7', border: '1px dashed #fde68a' }}>
                          <i className="fa-regular fa-triangle-exclamation" style={{ fontSize: 12, color: '#92400e' }} />
                          <span style={{ fontSize: 12, color: '#92400e' }}>No course folders created yet.</span>
                        </div> :

                    folders.map((f) => {
                      const hasAccess = isAssigned(faculty.name, f.id);
                      const level = getLevel(faculty.name, f.id);
                      const lvlColors = accessColors(level);
                      return (
                        <div key={f.id}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 8px', borderRadius: 7, transition: 'background 0.1s',
                          background: hasAccess ? level === 'edit' ? '#faf5ff' : '#f0f9ff' : 'transparent'
                        }}
                        onMouseEnter={(e) => {if (!hasAccess) (e.currentTarget as HTMLDivElement).style.background = '#f9fafb';}}
                        onMouseLeave={(e) => {if (!hasAccess) (e.currentTarget as HTMLDivElement).style.background = 'transparent';}}
                        onClick={() => toggleAssign(faculty.name, f.id)}>
                          
                              <input type="checkbox" checked={hasAccess} onChange={() => toggleAssign(faculty.name, f.id)}
                          style={{ accentColor: '#7c3aed', cursor: 'pointer', width: 14, height: 14, flexShrink: 0 }}
                          onClick={(e) => e.stopPropagation()} />
                          
                              <div style={{ width: 24, height: 24, borderRadius: 6, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <i className="fa-regular fa-graduation-cap" style={{ fontSize: 11, color: '#7c3aed' }} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <span style={{ fontSize: 13, color: '#111', fontWeight: hasAccess ? 600 : 400 }}>{f.name}</span>
                              </div>
                              {hasAccess &&
                          <button
                            onClick={(e) => cycleLevel(faculty.name, f.id, e)}
                            title="Click to toggle view / edit access"
                            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20,
                              background: lvlColors.bg, color: lvlColors.text,
                              border: `1px solid ${lvlColors.border}`,
                              fontSize: 11, fontWeight: 600, cursor: 'pointer',
                              flexShrink: 0, whiteSpace: 'nowrap'
                            }}>
                            
                                  <i className={`fa-regular ${accessIcon(level)}`} style={{ fontSize: 10 }} />
                                  {accessLabel(level)}
                                </button>
                          }
                            </div>);

                    })
                    }
                    </div>
                  </div>);

            })}
            </div> :

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {folders.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())).map((f) => {
              const assignedFaculty = FACULTY_MEMBERS.filter((fm) => isAssigned(fm.name, f.id));
              return (
                <div key={f.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#faf5ff', borderBottom: '1px solid #e9d5ff' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 7, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className="fa-regular fa-graduation-cap" style={{ fontSize: 14, color: '#7c3aed' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{f.name}</div>
                        <div style={{ fontSize: 11, color: '#7c3aed' }}>{assignedFaculty.length} faculty assigned</div>
                      </div>
                    </div>
                    <div style={{ padding: '8px 14px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {FACULTY_MEMBERS.map((fm) => {
                      const hasAccess = isAssigned(fm.name, f.id);
                      const level = getLevel(fm.name, f.id);
                      const lvlColors = accessColors(level);
                      return (
                        <div key={fm.id}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 8px', borderRadius: 7,
                          background: hasAccess ? level === 'edit' ? '#faf5ff' : '#f0f9ff' : 'transparent'
                        }}
                        onClick={() => toggleAssign(fm.name, f.id)}>
                          
                            <input type="checkbox" checked={hasAccess} onChange={() => toggleAssign(fm.name, f.id)}
                          style={{ accentColor: '#7c3aed', cursor: 'pointer', width: 14, height: 14, flexShrink: 0 }}
                          onClick={(e) => e.stopPropagation()} />
                          
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: fm.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{fm.initials}</div>
                            <span style={{ flex: 1, fontSize: 13, color: '#111', fontWeight: hasAccess ? 600 : 400 }}>{fm.name}</span>
                            <span style={{ fontSize: 11, color: '#6b7280', marginRight: 6 }}>{fm.dept}</span>
                            {hasAccess &&
                          <button
                            onClick={(e) => cycleLevel(fm.name, f.id, e)}
                            title="Click to toggle view / edit access"
                            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20,
                              background: lvlColors.bg, color: lvlColors.text,
                              border: `1px solid ${lvlColors.border}`,
                              fontSize: 11, fontWeight: 600, cursor: 'pointer',
                              flexShrink: 0, whiteSpace: 'nowrap'
                            }}>
                            
                                <i className={`fa-regular ${accessIcon(level)}`} style={{ fontSize: 10 }} />
                                {accessLabel(level)}
                              </button>
                          }
                          </div>);

                    })}
                    </div>
                  </div>);

            })}
            </div>
          }
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, background: '#f9fafb' }}>
          <div style={{ flex: 1 }}>
            {saved &&
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#059669', fontWeight: 600 }}>
                <i className="fa-regular fa-circle-check" style={{ fontSize: 13 }} /> Assignments saved
              </span>
            }
          </div>
          <button onClick={onClose}
          style={{ padding: '7px 16px', borderRadius: 7, border: '1px solid #e5e7eb', background: 'white', color: '#374151', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
            Cancel
          </button>
          <button onClick={handleSave}
          style={{ padding: '7px 20px', borderRadius: 7, border: 'none', background: '#7c3aed', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#6d28d9'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#7c3aed'}>
            Save assignments
          </button>
        </div>
      </div>
    </>);

}