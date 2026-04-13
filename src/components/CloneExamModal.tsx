import React, { useState } from 'react';
import { X, Copy, Check, ChevronDown } from 'lucide-react';
const PAST_EXAMS = [{
  id: 'e-2025-04',
  name: 'CV Pharmacology Midterm — Spring 2025',
  date: 'Apr 2025',
  questions: 42,
  sections: 3,
  score: 76
}, {
  id: 'e-2024-04',
  name: 'CV Pharmacology Midterm — Spring 2024',
  date: 'Apr 2024',
  questions: 40,
  sections: 3,
  score: 74
}, {
  id: 'e-2025-11',
  name: 'Pathophysiology Final — Fall 2025',
  date: 'Nov 2025',
  questions: 65,
  sections: 4,
  score: 79
}, {
  id: 'e-2025-03',
  name: 'Clinical Reasoning Quiz 2 — Spring 2025',
  date: 'Mar 2025',
  questions: 20,
  sections: 1,
  score: 81
}];
type InheritKey = 'questions' | 'sections' | 'marks' | 'accommodations' | 'schedule' | 'proctoring';
const INHERIT_OPTIONS: {
  key: InheritKey;
  label: string;
  desc: string;
  default: boolean;
}[] = [{
  key: 'questions',
  label: 'All questions',
  desc: 'Clone every question in the exam',
  default: true
}, {
  key: 'sections',
  label: 'Section structure + marks',
  desc: 'Section names, mark weights, and order',
  default: true
}, {
  key: 'marks',
  label: 'Mark distribution settings',
  desc: 'Per-section marks and total',
  default: true
}, {
  key: 'accommodations',
  label: 'Accommodation profiles',
  desc: 'Student accommodation assignments',
  default: true
}, {
  key: 'schedule',
  label: 'Schedule settings',
  desc: 'Time window, duration, timezone',
  default: false
}, {
  key: 'proctoring',
  label: 'Proctoring settings',
  desc: 'LockDown browser, randomization',
  default: true
}];
export function CloneExamModal({
  onClose,
  onClone



}: {onClose: () => void;onClone: (name: string) => void;}) {
  const [selectedSource, setSelectedSource] = useState(PAST_EXAMS[0].id);
  const [inherit, setInherit] = useState<Record<InheritKey, boolean>>(Object.fromEntries(INHERIT_OPTIONS.map((o) => [o.key, o.default])) as Record<InheritKey, boolean>);
  const [newName, setNewName] = useState('CV Pharmacology Midterm — Spring 2026');
  const source = PAST_EXAMS.find((e) => e.id === selectedSource)!;
  return <div className="fixed inset-0 z-50 flex items-center justify-center" style={{
    background: 'rgba(0,0,0,0.5)'
  }}>
      <div className="w-full max-w-xl rounded-2xl overflow-hidden" style={{
      background: 'var(--surface)',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border)'
    }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{
        borderBottom: '1px solid var(--border)'
      }}>
          <div className="flex items-center gap-3">
            <Copy className="w-5 h-5" style={{
            color: 'var(--brand)'
          }} />
            <div>
              <div className="text-sm font-semibold" style={{
              color: 'var(--text)'
            }}>Clone exam</div>
              <div className="text-xs" style={{
              color: 'var(--text3)'
            }}>80–85% of exams are incremental changes from a previous exam</div>
            </div>
          </div>
          <button onClick={onClose} style={{
          color: 'var(--text3)',
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">

          {/* Source exam select */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{
            color: 'var(--text3)'
          }}>Clone from</label>
            <div className="space-y-1.5">
              {PAST_EXAMS.map((e) => <button key={e.id} onClick={() => setSelectedSource(e.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left" style={{
              background: selectedSource === e.id ? 'var(--brand-soft)' : 'var(--surface2)',
              border: `1px solid ${selectedSource === e.id ? 'var(--brand-border)' : 'var(--border)'}`
            }}>
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{
                borderColor: selectedSource === e.id ? 'var(--brand)' : 'var(--border2)'
              }}>
                    {selectedSource === e.id && <div className="w-2 h-2 rounded-full" style={{
                  background: 'var(--brand)'
                }} />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{
                  color: 'var(--text)'
                }}>{e.name}</div>
                    <div className="text-xs" style={{
                  color: 'var(--text3)'
                }}>{e.date} · {e.questions} questions · {e.sections} sections · avg {e.score}%</div>
                  </div>
                </button>)}
            </div>
          </div>

          {/* New name */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{
            color: 'var(--text3)'
          }}>Name for cloned exam</label>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-3 py-2 rounded-xl text-sm" style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            outline: 'none'
          }} />
          </div>

          {/* Inherit settings */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{
            color: 'var(--text3)'
          }}>What to inherit</label>
            <div className="space-y-1.5">
              {INHERIT_OPTIONS.map((opt) => <label key={opt.key} className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer" style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)'
            }}>
                  <div onClick={() => setInherit((prev) => ({
                ...prev,
                [opt.key]: !prev[opt.key]
              }))} className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{
                background: inherit[opt.key] ? 'var(--brand)' : 'var(--surface3)',
                border: `1px solid ${inherit[opt.key] ? 'var(--brand)' : 'var(--border2)'}`
              }}>
                    {inherit[opt.key] && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm" style={{
                  color: 'var(--text)'
                }}>{opt.label}</div>
                    <div className="text-xs" style={{
                  color: 'var(--text3)'
                }}>{opt.desc}</div>
                  </div>
                </label>)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4" style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--surface2)'
      }}>
          <span className="text-xs" style={{
          color: 'var(--text3)'
        }}>Cloning from: {source.name}</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text2)'
          }}>Cancel</button>
            <button onClick={() => onClone(newName)} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white" style={{
            background: 'var(--brand)'
          }}>
              <Copy className="w-4 h-4" />Clone exam
            </button>
          </div>
        </div>

      </div>
    </div>;
}