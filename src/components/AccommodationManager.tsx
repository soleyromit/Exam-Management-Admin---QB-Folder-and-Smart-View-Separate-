import React, { useState } from 'react';
import { Plus, Search, X, Check, Users, AlertTriangle } from 'lucide-react';
const PROFILES = [{
  id: 'p1',
  name: 'Standard',
  timeMult: 1.0,
  fontSize: 'default',
  highContrast: false,
  screenReader: false,
  calculator: false,
  color: '#94A3B8',
  students: 72
}, {
  id: 'p2',
  name: 'Extended time 1.5×',
  timeMult: 1.5,
  fontSize: 'default',
  highContrast: false,
  screenReader: false,
  calculator: false,
  color: '#7C3AED',
  students: 8
}, {
  id: 'p3',
  name: 'Extended time 2×',
  timeMult: 2.0,
  fontSize: 'default',
  highContrast: false,
  screenReader: false,
  calculator: false,
  color: '#E31C79',
  students: 3
}, {
  id: 'p4',
  name: 'Screen reader + 1.5×',
  timeMult: 1.5,
  fontSize: 'large',
  highContrast: true,
  screenReader: true,
  calculator: false,
  color: '#0891B2',
  students: 2
}, {
  id: 'p5',
  name: 'Calculator allowed',
  timeMult: 1.0,
  fontSize: 'default',
  highContrast: false,
  screenReader: false,
  calculator: true,
  color: '#059669',
  students: 1
}];
const STUDENTS_LIST = [{
  id: 's1',
  name: 'Sarah Johnson',
  profileId: 'p2',
  ds: true,
  note: 'Disability services — visual processing'
}, {
  id: 's2',
  name: 'Marcus Chen',
  profileId: 'p3',
  ds: true,
  note: 'Disability services — ADHD, reading'
}, {
  id: 's3',
  name: 'Priya Patel',
  profileId: 'p1',
  ds: false,
  note: ''
}, {
  id: 's4',
  name: 'James Wilson',
  profileId: 'p4',
  ds: true,
  note: 'Disability services — low vision'
}, {
  id: 's5',
  name: 'Elena Rodriguez',
  profileId: 'p1',
  ds: false,
  note: ''
}, {
  id: 's6',
  name: 'David Kim',
  profileId: 'p5',
  ds: true,
  note: 'Medical — diabetes (CGM calculator use)'
}, {
  id: 's7',
  name: 'Amara Osei',
  profileId: 'p1',
  ds: false,
  note: ''
}, {
  id: 's8',
  name: 'Lin Wei',
  profileId: 'p1',
  ds: false,
  note: ''
}];
export function AccommodationManager() {
  const [students, setStudents] = useState(STUDENTS_LIST);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkProfile, setBulkProfile] = useState('');
  const [showBulk, setShowBulk] = useState(false);
  const visible = students.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()));
  const noProfile = students.filter((s) => s.profileId === 'p1' && !s.ds);
  const assignProfile = (studentId: string, profileId: string) => {
    setStudents((prev) => prev.map((s) => s.id === studentId ? {
      ...s,
      profileId
    } : s));
  };
  const bulkAssign = () => {
    if (!bulkProfile) return;
    setStudents((prev) => prev.map((s) => selected.includes(s.id) ? {
      ...s,
      profileId: bulkProfile
    } : s));
    setSelected([]);
    setBulkProfile('');
    setShowBulk(false);
  };
  return <div className="flex h-full overflow-hidden">

      {/* Left — profiles */}
      <div className="w-56 flex-shrink-0 overflow-y-auto" style={{
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)'
    }}>
        <div className="px-3 py-4">
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{
          color: 'var(--text3)'
        }}>Accommodation profiles</div>
          <div className="p-3 rounded-xl mb-3" style={{
          background: 'rgba(227,28,121,0.06)',
          border: '1px solid rgba(227,28,121,0.15)'
        }}>
            <p className="text-xs" style={{
            color: 'var(--text2)'
          }}><strong style={{
              color: 'var(--text)'
            }}>Program-level profiles</strong> apply automatically to all future exams — no per-exam setup needed.</p>
            <p className="text-xs mt-1" style={{
            color: 'var(--brand)'
          }}>D2L: 70 setups. Exxat: 1.</p>
          </div>
          {PROFILES.map((p) => <div key={p.id} className="flex items-center gap-2 px-2.5 py-2 rounded-lg mb-1" style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)'
        }}>
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{
            background: p.color
          }} />
              <div className="flex-1">
                <div className="text-xs font-medium" style={{
              color: 'var(--text)'
            }}>{p.name}</div>
                <div className="text-xs" style={{
              color: 'var(--text3)'
            }}>{p.students} students</div>
              </div>
            </div>)}
          <button className="w-full flex items-center gap-2 mt-2 px-2.5 py-2 rounded-lg text-xs" style={{
          color: 'var(--brand)'
        }}>
            <Plus className="w-3 h-3" />New profile
          </button>
        </div>
      </div>

      {/* Right — student assignment */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-3 flex-shrink-0" style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)'
      }}>
          <div className="flex items-center gap-2 flex-1" style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '6px 12px'
        }}>
            <Search className="w-4 h-4" style={{
            color: 'var(--text3)'
          }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students…" className="flex-1 text-sm bg-transparent" style={{
            border: 'none',
            outline: 'none',
            color: 'var(--text)'
          }} />
          </div>
          {selected.length > 0 && <div className="flex items-center gap-2">
              <span className="text-xs" style={{
            color: 'var(--text3)'
          }}>{selected.length} selected</span>
              <button onClick={() => setShowBulk(!showBulk)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{
            background: 'var(--brand)'
          }}>Bulk assign</button>
            </div>}
          {noProfile.length > 0 && <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)'
        }}>
              <AlertTriangle className="w-3.5 h-3.5" style={{
            color: '#D97706'
          }} />
              <span className="text-xs" style={{
            color: '#D97706'
          }}>{noProfile.length} on default — check DS records</span>
            </div>}
        </div>

        {/* Bulk assign bar */}
        {showBulk && selected.length > 0 && <div className="flex items-center gap-3 px-5 py-2.5 flex-shrink-0" style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(227,28,121,0.04)'
      }}>
            <span className="text-sm" style={{
          color: 'var(--text)'
        }}>Assign {selected.length} students to:</span>
            <select value={bulkProfile} onChange={(e) => setBulkProfile(e.target.value)} className="px-3 py-1.5 rounded-lg text-sm" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          outline: 'none'
        }}>
              <option value="">Choose profile…</option>
              {PROFILES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button onClick={bulkAssign} disabled={!bulkProfile} className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white" style={{
          background: bulkProfile ? 'var(--brand)' : 'var(--border2)',
          cursor: bulkProfile ? 'pointer' : 'not-allowed'
        }}>Apply</button>
            <button onClick={() => {
          setShowBulk(false);
          setBulkProfile('');
        }} className="text-sm" style={{
          color: 'var(--text3)'
        }}>Cancel</button>
          </div>}

        {/* Student table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr style={{
              borderBottom: '1px solid var(--border)',
              background: 'var(--surface)'
            }}>
                <th className="w-10 px-4 py-2.5"><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? visible.map((s) => s.id) : [])} style={{
                  accentColor: 'var(--brand)'
                }} /></th>
                {['Student', 'Profile', 'Time multiplier', 'Features', 'DS flag', ''].map((h) => <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{
                color: 'var(--text3)'
              }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {visible.map((s, i) => {
              const profile = PROFILES.find((p) => p.id === s.profileId)!;
              return <tr key={s.id} style={{
                borderBottom: i < visible.length - 1 ? '1px solid var(--border)' : 'none',
                background: selected.includes(s.id) ? 'var(--brand-soft)' : 'transparent'
              }}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(s.id)} onChange={(e) => setSelected((prev) => e.target.checked ? [...prev, s.id] : prev.filter((id) => id !== s.id))} style={{
                    accentColor: 'var(--brand)'
                  }} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{
                      background: 'var(--brand)',
                      fontSize: 9,
                      fontWeight: 700
                    }}>{s.name.split(' ').map((n) => n[0]).join('')}</div>
                        <div>
                          <div className="text-sm font-medium" style={{
                        color: 'var(--text)'
                      }}>{s.name}</div>
                          {s.note && <div className="text-xs" style={{
                        color: 'var(--text3)'
                      }}>{s.note}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                    background: `${profile.color}14`,
                    color: profile.color
                  }}>{profile.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold mono" style={{
                    color: profile.timeMult > 1 ? '#7C3AED' : 'var(--text3)'
                  }}>{profile.timeMult}×</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {profile.highContrast && <span className="text-xs px-1.5 py-0.5 rounded" style={{
                      background: 'var(--surface3)',
                      color: 'var(--text3)'
                    }}>HC</span>}
                        {profile.screenReader && <span className="text-xs px-1.5 py-0.5 rounded" style={{
                      background: 'var(--surface3)',
                      color: 'var(--text3)'
                    }}>SR</span>}
                        {profile.calculator && <span className="text-xs px-1.5 py-0.5 rounded" style={{
                      background: 'var(--surface3)',
                      color: 'var(--text3)'
                    }}>Calc</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {s.ds && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{
                    background: 'rgba(124,58,237,0.1)',
                    color: '#7C3AED',
                    fontWeight: 600
                  }}>DS</span>}
                    </td>
                    <td className="px-4 py-3">
                      <select value={s.profileId} onChange={(e) => assignProfile(s.id, e.target.value)} className="px-2 py-1 rounded text-xs" style={{
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    outline: 'none'
                  }}>
                        {PROFILES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </td>
                  </tr>;
            })}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}