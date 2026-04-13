import React, { useState, useEffect, useRef } from 'react';
import type { Role } from '../../types';
import { Plus, GripVertical, AlertTriangle, Check, ChevronDown, ChevronUp, BookOpen, Zap, Copy, Trash2, Link2, Unlink2, Lock, Unlock, Sparkles } from 'lucide-react';

// ── Decision sources ─────────────────────────────────────────────────────────
// Section lock behavior (f29a990d Kunal/Aarti): two modes —
//   FREE = student can navigate between sections at will (default)
//   LOCKED = once a section is submitted, student cannot return (GRE model)
// AI suggest (791334af Arun): "AI everywhere on admin side — reduce faculty time"
// Vignette grouping: clinical questions that always appear together
// ─────────────────────────────────────────────────────────────────────────────

const QTYPES = [{
  id: 'mcq',
  label: 'MCQ',
  icon: '(A)',
  color: '#7C3AED',
  p: 'P1',
  desc: 'Single correct answer'
}, {
  id: 'msq',
  label: 'MSQ',
  icon: '[✓]',
  color: '#7C3AED',
  p: 'P1',
  desc: 'Multiple correct answers'
}, {
  id: 'fitb',
  label: 'Fill-blank',
  icon: '___',
  color: '#0891B2',
  p: 'P1',
  desc: 'One or more blanks in stem'
}, {
  id: 'ordering',
  label: 'Ordering',
  icon: '↕',
  color: '#059669',
  p: 'P1',
  desc: 'Drag to sequence — new',
  badge: 'New'
}, {
  id: 'match',
  label: 'Match',
  icon: '⇄',
  color: '#0891B2',
  p: 'P1',
  desc: 'Left–right pair matching'
}, {
  id: 'hotspot',
  label: 'Hotspot',
  icon: '🎯',
  color: '#059669',
  p: 'P1',
  desc: 'Click region on an image'
}, {
  id: 'passage',
  label: 'Passage',
  icon: '📚',
  color: '#059669',
  p: 'P1',
  desc: 'Long text + questions below'
}, {
  id: 'osce',
  label: 'OSCE Rubric',
  icon: '📋',
  color: '#E31C79',
  p: 'P1',
  desc: 'Clinical station rubric',
  badge: 'New'
}, {
  id: 'formula',
  label: 'Formula',
  icon: 'ƒ',
  color: '#0891B2',
  p: 'P1',
  desc: 'Randomised variables per student',
  badge: 'New'
}];
type QItem = {
  num: number;
  stem: string;
  type: string;
  marks: number;
  blooms: string;
  diff: string;
  status: string;
  a11y: boolean;
  groupId?: string;
  isGroupHead?: boolean;
};

// Section lock mode — source: Kunal f29a990d
type LockMode = 'free' | 'locked';
const SECTIONS_RAW: Array<{
  id: string;
  title: string;
  marks: number;
  count: number;
  pct: number;
  color: string;
  distribution: string;
  issues: number;
  lockMode: LockMode;
  questions: QItem[];
}> = [{
  id: 'a',
  title: 'Section A — Pharmacology Core',
  marks: 60,
  count: 30,
  pct: 71,
  color: '#E31C79',
  distribution: 'Equal (2 marks each)',
  issues: 1,
  lockMode: 'locked',
  questions: [{
    num: 1,
    stem: 'Which beta-blocker is cardioselective and preferred in COPD patients?',
    type: 'MCQ',
    marks: 2,
    blooms: 'Apply',
    diff: 'Med',
    status: 'Ready',
    a11y: true
  }, {
    num: 2,
    stem: 'ACE inhibitors prevent angiotensin I conversion by inhibiting…',
    type: 'MSQ',
    marks: 2,
    blooms: 'Remember',
    diff: 'Easy',
    status: 'Ready',
    a11y: true
  }, {
    num: 3,
    stem: 'Identify the receptor binding site in the pharmacodynamic diagram.',
    type: 'Hotspot',
    marks: 2,
    blooms: 'Apply',
    diff: 'Med',
    status: 'Ready',
    a11y: false
  }, {
    num: 4,
    stem: 'Steps of the glycolysis pathway — place in correct order.',
    type: 'Ordering',
    marks: 2,
    blooms: 'Remember',
    diff: 'Easy',
    status: 'Ready',
    a11y: true
  }, {
    num: 5,
    stem: 'A 55yo male with hypertension, bilateral leg oedema, Cr 1.4. Which antihypertensive?',
    type: 'MCQ',
    marks: 3,
    blooms: 'Analyze',
    diff: 'Hard',
    status: 'Ready',
    a11y: true,
    groupId: 'grp-vignette-1',
    isGroupHead: true
  }, {
    num: 6,
    stem: 'Based on the case above — which monitoring parameter requires weekly checks?',
    type: 'MCQ',
    marks: 2,
    blooms: 'Apply',
    diff: 'Med',
    status: 'Ready',
    a11y: true,
    groupId: 'grp-vignette-1'
  }]
}, {
  id: 'b',
  title: 'Section B — Clinical Reasoning',
  marks: 20,
  count: 10,
  pct: 24,
  color: '#0891B2',
  distribution: 'Manual',
  issues: 0,
  lockMode: 'free',
  questions: [{
    num: 31,
    stem: 'A 45yo with jaundice, elevated LFTs, and RUQ pain. Read the case.',
    type: 'Passage',
    marks: 5,
    blooms: 'Analyze',
    diff: 'Hard',
    status: 'Active',
    a11y: true
  }, {
    num: 32,
    stem: 'Interpret the EKG strip — click the correct region to identify the rhythm.',
    type: 'Hotspot',
    marks: 3,
    blooms: 'Evaluate',
    diff: 'Hard',
    status: 'Active',
    a11y: false
  }]
}];
const STATUS_DOT: Record<string, string> = {
  Ready: '#10B981',
  Draft: '#94A3B8',
  Active: '#3B82F6',
  'In Review': '#D97706'
};
const BLOOMS_COLOR: Record<string, string> = {
  Remember: '#6366F1',
  Understand: '#3B82F6',
  Apply: '#7C3AED',
  Analyze: '#D97706',
  Evaluate: '#EF4444',
  Create: '#10B981'
};
const ROLE_ACTIONS: Record<Role, string[]> = {
  faculty: ['create-question', 'edit-question', 'reorder', 'add-section', 'import-bank', 'ai-suggest', 'configure-section'],
  'dept-head': ['view-all', 'approve-question', 'reorder'],
  contributor: ['create-question', 'edit-own'],
  reviewer: ['view-all'],
  'outcome-director': ['view-all'],
  'inst-admin': ['view-all']
};
function QTypeMenu({
  anchorRef,
  open,
  onClose,
  onSelect





}: {anchorRef: React.RefObject<HTMLButtonElement>;open: boolean;onClose: () => void;onSelect: (id: string) => void;}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({
    top: 0,
    left: 0
  });
  useEffect(() => {
    if (open && anchorRef.current) {
      const r = anchorRef.current.getBoundingClientRect();
      setPos({
        top: r.bottom + 8,
        left: r.left
      });
    }
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && anchorRef.current && !anchorRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open, onClose]);
  if (!open) return null;
  return <div ref={menuRef} style={{
    position: 'fixed',
    top: pos.top,
    left: pos.left,
    zIndex: 9999,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    width: 360,
    overflow: 'hidden'
  }}>
      <div style={{
      padding: '10px 14px 8px',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
        <span style={{
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--text3)'
      }}>Choose question type</span>
        <button onClick={onClose} style={{
        fontSize: 16,
        color: 'var(--text3)',
        background: 'none',
        border: 'none',
        cursor: 'pointer'
      }}>×</button>
      </div>
      <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 6,
      padding: 10
    }}>
        {QTYPES.map((qt) => <button key={qt.id} onClick={() => {
        onSelect(qt.id);
        onClose();
      }} style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        padding: '10px 6px 8px',
        borderRadius: 10,
        background: 'var(--surface3)',
        border: '1px solid transparent',
        cursor: 'pointer'
      }} onMouseEnter={(e) => {
        e.currentTarget.style.background = `${qt.color}12`;
        e.currentTarget.style.borderColor = `${qt.color}40`;
      }} onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--surface3)';
        e.currentTarget.style.borderColor = 'transparent';
      }}>
            {qt.badge && <span style={{
          position: 'absolute',
          top: -5,
          right: -3,
          fontSize: 8,
          fontWeight: 800,
          background: qt.id === 'ordering' ? '#059669' : 'var(--brand)',
          color: 'white',
          padding: '1px 4px',
          borderRadius: 4
        }}>{qt.badge}</span>}
            <span style={{
          fontSize: 18
        }}>{qt.icon}</span>
            <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text)'
        }}>{qt.label}</span>
            <span style={{
          fontSize: 10,
          color: 'var(--text3)',
          textAlign: 'center',
          lineHeight: 1.3
        }}>{qt.desc}</span>
          </button>)}
      </div>
    </div>;
}
function VignetteGroup({
  questions,
  onUngroup,
  canCreate




}: {questions: QItem[];onUngroup: () => void;canCreate: boolean;}) {
  return <div style={{
    margin: '4px 16px',
    borderRadius: 10,
    border: '2px dashed #7C3AED',
    background: 'rgba(124,58,237,0.03)'
  }}>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 12px',
      borderBottom: '1px dashed rgba(124,58,237,0.25)'
    }}>
        <Link2 style={{
        width: 13,
        height: 13,
        color: '#7C3AED',
        flexShrink: 0
      }} />
        <span style={{
        fontSize: 11,
        fontWeight: 700,
        color: '#7C3AED'
      }}>Clinical vignette — always together</span>
        <span style={{
        fontSize: 10,
        color: '#7C3AED',
        opacity: 0.7,
        marginLeft: 2
      }}>{questions.length} questions · {questions.reduce((s, q) => s + q.marks, 0)}m total</span>
        {canCreate && <button onClick={onUngroup} style={{
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        color: 'var(--text3)',
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: '3px 8px',
        cursor: 'pointer'
      }}>
            <Unlink2 style={{
          width: 11,
          height: 11
        }} /> Ungroup
          </button>}
      </div>
      {questions.map((q, qi) => {
      const qtColor = QTYPES.find((t) => t.label === q.type)?.color || '#7C3AED';
      return <div key={q.num} className="flex items-center gap-2.5 px-4 py-2.5" style={{
        borderBottom: qi < questions.length - 1 ? '1px solid rgba(124,58,237,0.12)' : 'none'
      }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(124,58,237,0.04)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <GripVertical style={{
          width: 12,
          height: 12,
          opacity: 0.2,
          color: 'var(--text3)'
        }} />
            <span style={{
          fontSize: 11,
          fontFamily: 'monospace',
          fontWeight: 600,
          color: '#7C3AED',
          width: 24,
          flexShrink: 0
        }}>Q{q.num}</span>
            <span style={{
          fontSize: 11,
          padding: '1px 6px',
          borderRadius: 5,
          background: `${qtColor}18`,
          color: qtColor,
          flexShrink: 0
        }}>{q.type}</span>
            <span style={{
          flex: 1,
          fontSize: 12,
          color: 'var(--text2)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>{q.stem}</span>
            <span style={{
          fontSize: 11,
          padding: '1px 5px',
          borderRadius: 8,
          background: `${BLOOMS_COLOR[q.blooms]}15`,
          color: BLOOMS_COLOR[q.blooms],
          flexShrink: 0
        }}>{q.blooms}</span>
            <div style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: STATUS_DOT[q.status],
          flexShrink: 0
        }} />
            <span style={{
          fontSize: 11,
          fontFamily: 'monospace',
          color: 'var(--text3)',
          flexShrink: 0
        }}>{q.marks}m</span>
            {q.a11y ? <Check style={{
          width: 12,
          height: 12,
          color: '#10B981',
          flexShrink: 0
        }} /> : <AlertTriangle style={{
          width: 12,
          height: 12,
          color: '#F59E0B',
          flexShrink: 0
        }} />}
          </div>;
    })}
    </div>;
}
export function BuildPhase({
  role,
  onOpenQuestionEditor,
  onOpenFormulaEditor




}: {role: Role;onOpenQuestionEditor: () => void;onOpenFormulaEditor?: () => void;}) {
  const [expanded, setExpanded] = useState<string[]>(['a', 'b']);
  const [openMenuSection, setOpenMenuSection] = useState<string | null>(null);
  const [activeQBPanel, setActiveQBPanel] = useState(false);
  const [selectedQs, setSelectedQs] = useState<number[]>([]);
  const [groups, setGroups] = useState<Record<string, string>>({
    '5': 'grp-vignette-1',
    '6': 'grp-vignette-1'
  });
  // Section lock modes — source: Kunal f29a990d, GRE-style section submit
  const [sectionLocks, setSectionLocks] = useState<Record<string, LockMode>>({
    a: 'locked',
    b: 'free'
  });
  const [showAISuggest, setShowAISuggest] = useState<string | null>(null);
  const [aiLoading, setAILoading] = useState(false);
  const [aiResult, setAIResult] = useState<string | null>(null);
  const btnRefs = useRef<Record<string, React.RefObject<HTMLButtonElement>>>({});
  SECTIONS_RAW.forEach((s) => {
    if (!btnRefs.current[s.id]) btnRefs.current[s.id] = React.createRef();
  });
  const canCreate = ROLE_ACTIONS[role].includes('create-question');
  const canApprove = ROLE_ACTIONS[role].includes('approve-question');
  const canConfigure = ROLE_ACTIONS[role].includes('configure-section');
  const totalMarks = SECTIONS_RAW.reduce((s, x) => s + x.marks, 0);
  const totalQ = SECTIONS_RAW.reduce((s, x) => s + x.count, 0);
  const totalIssues = SECTIONS_RAW.reduce((s, x) => s + x.issues, 0);
  const toggleSelect = (num: number) => setSelectedQs((prev) => prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]);
  const groupSelected = (sectionId: string) => {
    const gid = `grp-${sectionId}-${Date.now()}`;
    const next = {
      ...groups
    };
    selectedQs.forEach((n) => {
      next[String(n)] = gid;
    });
    setGroups(next);
    setSelectedQs([]);
  };
  const ungroup = (gid: string) => {
    const next = {
      ...groups
    };
    Object.keys(next).forEach((k) => {
      if (next[k] === gid) delete next[k];
    });
    setGroups(next);
  };
  const handleTypeSelect = (typeId: string) => {
    if (typeId === 'formula') onOpenFormulaEditor?.();else onOpenQuestionEditor();
  };
  const runAISuggest = (sectionId: string) => {
    setShowAISuggest(sectionId);
    setAILoading(true);
    setAIResult(null);
    setTimeout(() => {
      setAILoading(false);
      setAIResult('5 questions suggested: 2 Apply-level Pharmacology (Med), 2 Analyze-level Cardiology (Hard), 1 Remember-level Neurology (Easy). Questions not used in last 2 exams. Click to preview.');
    }, 1400);
  };
  return <div className="flex h-full" style={{
    position: 'relative'
  }}>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {/* Role banners */}
        {role === 'dept-head' && <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm" style={{
        background: 'rgba(227,28,121,0.06)',
        border: '1px solid rgba(227,28,121,0.15)'
      }}>
            <span style={{
          color: '#E31C79'
        }}>⚠️</span>
            <span style={{
          color: 'var(--text2)'
        }}><strong style={{
            color: 'var(--text)'
          }}>7 questions</strong> in your review queue.</span>
            <button className="ml-auto text-sm font-medium" style={{
          color: '#E31C79'
        }}>Go to review queue →</button>
          </div>}

        {/* Summary strip */}
        <div className="rounded-xl p-4" style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)'
      }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{
            color: 'var(--text3)'
          }}>Mark distribution</span>
            <div className="flex items-center gap-3 text-xs" style={{
            color: 'var(--text3)'
          }}>
              <span><span className="mono font-bold" style={{
                color: 'var(--text)'
              }}>{totalMarks}</span> marks</span>
              <span>·</span>
              <span><span className="mono font-bold" style={{
                color: 'var(--text)'
              }}>{totalQ}</span> questions</span>
              {totalIssues > 0 && <span className="flex items-center gap-1" style={{
              color: '#F59E0B'
            }}>
                  <AlertTriangle className="w-3 h-3" />{totalIssues} alt text missing — blocks publish
                </span>}
            </div>
          </div>
          <div className="flex h-6 rounded-lg overflow-hidden gap-0.5">
            {SECTIONS_RAW.map((s) => <div key={s.id} className="flex items-center justify-center text-white text-xs font-semibold" style={{
            width: `${s.pct}%`,
            background: s.color
          }}>
                {s.pct > 10 ? `${s.title.split('—')[0].trim().replace('Section ', '')} — ${s.marks}m` : `${s.marks}m`}
              </div>)}
          </div>
        </div>

        {/* Sections */}
        {SECTIONS_RAW.map((section) => {
        const sectionSelected = selectedQs.filter((n) => section.questions.some((q) => q.num === n));
        const groupIds = [...new Set(section.questions.map((q) => groups[String(q.num)]).filter(Boolean))];
        const lockMode = sectionLocks[section.id] || 'free';
        return <div key={section.id} className="rounded-xl overflow-hidden" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>

              {/* Section header */}
              <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none" style={{
            borderLeft: `3px solid ${section.color}`
          }} onClick={() => setExpanded((e) => e.includes(section.id) ? e.filter((x) => x !== section.id) : [...e, section.id])}>
                {canCreate && <GripVertical className="w-4 h-4 flex-shrink-0 cursor-grab" style={{
              color: 'var(--text3)'
            }} />}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{
                  color: 'var(--text)'
                }}>{section.title}</span>
                    {section.issues > 0 ? <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{
                  background: 'rgba(245,158,11,0.1)',
                  color: '#F59E0B'
                }}><AlertTriangle className="w-3 h-3" />{section.issues} alt text missing</span> : <span className="text-xs px-2 py-0.5 rounded-full" style={{
                  background: 'rgba(16,185,129,0.1)',
                  color: '#10B981'
                }}>All clear</span>}
                    {/* Section lock indicator — source: Kunal f29a990d */}
                    <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: 8,
                  background: lockMode === 'locked' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
                  color: lockMode === 'locked' ? '#EF4444' : '#10B981',
                  cursor: canConfigure ? 'pointer' : 'default'
                }} onClick={(e) => {
                  e.stopPropagation();
                  if (canConfigure) setSectionLocks((prev) => ({
                    ...prev,
                    [section.id]: prev[section.id] === 'locked' ? 'free' : 'locked'
                  }));
                }} title={lockMode === 'locked' ? 'Locked — students cannot return after submitting this section (GRE model)' : 'Free navigation — students can move between sections freely'}>
                      {lockMode === 'locked' ? <Lock style={{
                    width: 10,
                    height: 10
                  }} /> : <Unlock style={{
                    width: 10,
                    height: 10
                  }} />}
                      {lockMode === 'locked' ? 'Section locked' : 'Free nav'}
                    </span>
                  </div>
                  <div className="text-xs mt-0.5" style={{
                color: 'var(--text3)'
              }}>{section.marks} marks · {section.count} questions · {section.distribution}</div>
                </div>
                <span className="text-xs mono font-bold" style={{
              color: section.color
            }}>{section.pct}%</span>
                {expanded.includes(section.id) ? <ChevronUp className="w-4 h-4" style={{
              color: 'var(--text3)'
            }} /> : <ChevronDown className="w-4 h-4" style={{
              color: 'var(--text3)'
            }} />}
              </div>

              {expanded.includes(section.id) && <div style={{
            borderTop: '1px solid var(--border)'
          }}>

                  {/* Section lock explanation */}
                  {lockMode === 'locked' && canConfigure && <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 16px',
              background: 'rgba(239,68,68,0.04)',
              borderBottom: '1px solid rgba(239,68,68,0.12)',
              fontSize: 11,
              color: '#EF4444'
            }}>
                      <Lock style={{
                width: 11,
                height: 11
              }} />
                      <span>Students cannot return to this section after submitting it — GRE / GMAT style. <button onClick={() => setSectionLocks((prev) => ({
                  ...prev,
                  [section.id]: 'free'
                }))} style={{
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#EF4444',
                  fontSize: 11
                }}>Switch to free nav</button></span>
                    </div>}

                  {/* AI suggest panel — Arun 791334af: "reduce time faculty spends" */}
                  {showAISuggest === section.id && <div style={{
              padding: '12px 16px',
              background: 'rgba(124,58,237,0.04)',
              borderBottom: '1px solid rgba(124,58,237,0.15)'
            }}>
                      {aiLoading ? <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: '#7C3AED'
              }}>
                          <Sparkles style={{
                  width: 13,
                  height: 13
                }} /> Analysing question bank by competency coverage…
                        </div> : aiResult ? <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10
              }}>
                          <Sparkles style={{
                  width: 14,
                  height: 14,
                  color: '#7C3AED',
                  flexShrink: 0,
                  marginTop: 2
                }} />
                          <div style={{
                  flex: 1
                }}>
                            <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#7C3AED',
                    marginBottom: 3
                  }}>AI suggestion</div>
                            <div style={{
                    fontSize: 12,
                    color: 'var(--text2)',
                    lineHeight: 1.5
                  }}>{aiResult}</div>
                            <div style={{
                    display: 'flex',
                    gap: 6,
                    marginTop: 8
                  }}>
                              <button style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '5px 12px',
                      borderRadius: 7,
                      background: '#7C3AED',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}>Preview questions</button>
                              <button onClick={() => {
                      setShowAISuggest(null);
                      setAIResult(null);
                    }} style={{
                      fontSize: 11,
                      padding: '5px 10px',
                      borderRadius: 7,
                      background: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text3)',
                      cursor: 'pointer'
                    }}>Dismiss</button>
                            </div>
                          </div>
                        </div> : null}
                    </div>}

                  {/* Bulk action bar */}
                  {canCreate && sectionSelected.length >= 2 && <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 16px',
              background: 'rgba(124,58,237,0.07)',
              borderBottom: '1px solid rgba(124,58,237,0.2)'
            }}>
                      <Link2 style={{
                width: 14,
                height: 14,
                color: '#7C3AED'
              }} />
                      <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#7C3AED'
              }}>{sectionSelected.length} selected</span>
                      <button onClick={() => groupSelected(section.id)} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 12px',
                fontSize: 12,
                fontWeight: 600,
                color: 'white',
                background: '#7C3AED',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer'
              }}>
                        <Link2 style={{
                  width: 12,
                  height: 12
                }} /> Group as clinical vignette
                      </button>
                      <button onClick={() => setSelectedQs([])} style={{
                marginLeft: 'auto',
                fontSize: 11,
                color: 'var(--text3)',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}>Cancel</button>
                    </div>}

                  {/* Questions */}
                  {(() => {
              const rendered = new Set<number>();
              const items: React.ReactNode[] = [];
              groupIds.forEach((gid) => {
                const groupQs = section.questions.filter((q) => groups[String(q.num)] === gid);
                groupQs.forEach((q) => rendered.add(q.num));
                items.push(<VignetteGroup key={gid} questions={groupQs} onUngroup={() => ungroup(gid)} canCreate={canCreate} />);
              });
              section.questions.filter((q) => !rendered.has(q.num)).forEach((q, qi, arr) => {
                const qtColor = QTYPES.find((t) => t.label === q.type || t.id === q.type.toLowerCase())?.color || '#7C3AED';
                const isSelected = selectedQs.includes(q.num);
                items.push(<div key={q.num} className="flex items-center gap-2.5 px-5 py-2.5 group" style={{
                  borderBottom: '1px solid var(--border)',
                  background: isSelected ? 'rgba(124,58,237,0.06)' : 'transparent'
                }} onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'var(--surface2)';
                }} onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}>
                          {canCreate && <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(q.num)} style={{
                    accentColor: '#7C3AED',
                    flexShrink: 0,
                    cursor: 'pointer'
                  }} />}
                          <GripVertical className="w-3.5 h-3.5 flex-shrink-0 cursor-grab opacity-30" style={{
                    color: 'var(--text3)'
                  }} />
                          <span className="text-xs mono font-semibold w-7 flex-shrink-0" style={{
                    color: 'var(--text3)'
                  }}>Q{q.num}</span>
                          <span className="text-xs px-2 py-0.5 rounded-md font-medium flex-shrink-0" style={{
                    background: `${qtColor}18`,
                    color: qtColor
                  }}>{q.type}</span>
                          <span className="flex-1 text-sm" style={{
                    color: 'var(--text2)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>{q.stem}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{
                    background: `${BLOOMS_COLOR[q.blooms]}15`,
                    color: BLOOMS_COLOR[q.blooms],
                    fontSize: 11,
                    flexShrink: 0
                  }}>{q.blooms}</span>
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                    background: STATUS_DOT[q.status]
                  }} />
                          <span className="text-xs mono flex-shrink-0" style={{
                    color: 'var(--text3)'
                  }}>{q.marks}m</span>
                          {q.a11y ? <Check className="w-3.5 h-3.5 flex-shrink-0" style={{
                    color: '#10B981'
                  }} /> : <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{
                    color: '#F59E0B'
                  }} />}
                          {canCreate && <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                              <button className="p-1 rounded" style={{
                      color: 'var(--text3)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}><Copy className="w-3.5 h-3.5" /></button>
                              <button className="p-1 rounded" style={{
                      color: 'var(--text3)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>}
                        </div>);
              });
              return items;
            })()}

                  {/* Add question toolbar */}
                  {canCreate && <div className="flex items-center gap-2 px-5 py-3" style={{
              borderTop: '1px solid var(--border)',
              background: 'var(--surface2)'
            }}>
                      <button ref={btnRefs.current[section.id]} onClick={(e) => {
                e.stopPropagation();
                setOpenMenuSection((prev) => prev === section.id ? null : section.id);
              }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{
                background: openMenuSection === section.id ? 'var(--brand)' : 'var(--brand-soft)',
                color: openMenuSection === section.id ? 'white' : 'var(--brand)',
                border: '1px solid var(--brand-border)'
              }}>
                        <Plus className="w-3.5 h-3.5" /> Add question
                        <ChevronDown className="w-3 h-3" style={{
                  transform: openMenuSection === section.id ? 'rotate(180deg)' : 'none'
                }} />
                      </button>
                      <button onClick={() => setActiveQBPanel(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{
                background: 'var(--surface3)',
                border: '1px solid var(--border)',
                color: 'var(--text2)'
              }}>
                        <BookOpen className="w-3.5 h-3.5" /> From bank
                      </button>
                      <button onClick={() => runAISuggest(section.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{
                background: showAISuggest === section.id ? 'rgba(124,58,237,0.12)' : 'var(--surface3)',
                border: `1px solid ${showAISuggest === section.id ? 'rgba(124,58,237,0.3)' : 'var(--border)'}`,
                color: showAISuggest === section.id ? '#7C3AED' : 'var(--text2)'
              }}>
                        <Sparkles className="w-3.5 h-3.5" style={{
                  color: showAISuggest === section.id ? '#7C3AED' : '#D97706'
                }} />
                        AI suggest
                      </button>
                      {canCreate && sectionSelected.length < 2 && <span style={{
                marginLeft: 'auto',
                fontSize: 10,
                color: 'var(--text3)'
              }}>Select 2+ questions to <strong style={{
                  color: '#7C3AED'
                }}>group as vignette</strong></span>}
                    </div>}
                  <QTypeMenu anchorRef={btnRefs.current[section.id]} open={openMenuSection === section.id} onClose={() => setOpenMenuSection(null)} onSelect={handleTypeSelect} />
                </div>}
            </div>;
      })}

        {canCreate && <button className="w-full py-3.5 rounded-xl text-sm font-medium" style={{
        border: '2px dashed var(--border)',
        color: 'var(--text3)',
        background: 'transparent'
      }} onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--brand)';
        e.currentTarget.style.color = 'var(--brand)';
      }} onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.color = 'var(--text3)';
      }}>+ Add section</button>}
      </div>

      {/* QB side panel */}
      {activeQBPanel && <div className="w-80 flex-shrink-0 overflow-y-auto" style={{
      background: 'var(--surface)',
      borderLeft: '1px solid var(--border)'
    }}>
          <div className="flex items-center justify-between px-4 py-3" style={{
        borderBottom: '1px solid var(--border)'
      }}>
            <span className="text-sm font-semibold" style={{
          color: 'var(--text)'
        }}>Question bank</span>
            <button onClick={() => setActiveQBPanel(false)} style={{
          fontSize: 13,
          color: 'var(--text3)',
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}>Close ×</button>
          </div>
          <div className="px-3 py-3">
            <input type="search" placeholder="Search questions…" className="w-full px-3 py-2 rounded-lg text-xs mb-3" style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          outline: 'none'
        }} />
            {[{
          id: 'PHR-102',
          stem: 'Which beta-blocker is cardioselective...',
          type: 'MCQ',
          correct: '72%',
          disc: '0.34'
        }, {
          id: 'CRD-021',
          stem: 'Interpret the EKG strip below...',
          type: 'Hotspot',
          correct: '55%',
          disc: '0.38'
        }, {
          id: 'GI-008',
          stem: 'Steps of bile acid synthesis — order correctly.',
          type: 'Ordering',
          correct: '61%',
          disc: '0.32'
        }].map((q) => <div key={q.id} className="mb-2 p-3 rounded-lg" style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)'
        }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs mono font-semibold" style={{
              color: 'var(--brand)'
            }}>{q.id}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{
              background: 'var(--surface3)',
              color: 'var(--text3)'
            }}>{q.type}</span>
                </div>
                <p className="text-xs mb-2" style={{
            color: 'var(--text2)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>{q.stem}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs" style={{
              color: 'var(--text3)'
            }}>Correct {q.correct} · Disc {q.disc}</div>
                  <button className="text-xs px-2.5 py-1 rounded font-medium text-white" style={{
              background: 'var(--brand)'
            }}>Add</button>
                </div>
              </div>)}
          </div>
        </div>}
    </div>;
}