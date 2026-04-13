import React, { useState } from 'react';
import { X, Zap, Check, AlertTriangle, Plus, Trash2, ChevronDown, ArrowLeft, Sparkles, Eye, GitBranch, Shield, Tag, Lock, FileText, MessageSquare } from 'lucide-react';

// ── Source decisions ────────────────────────────────────────────────────────────
// NEW GAP - Nipun 4c9b94f5 (Mar 11): Per-option rationale is better than
// one shared rationale. "Maybe it would be better if we can give different
// rationales for different options." AI should help faculty write them.
//
// GAP-17 (6fdcd0dd Nipun): DRAFT = incomplete WIP, PRIVATE = complete+restricted
// GAP-19 (6fdcd0dd Vishaka): CATEGORIES = school-defined, TAGS = personal
// Dr. Vicky Mody (2768ba8d): Ordering question type missing from ExamSoft
// Aarti (f29a990d): Alt text = publish gate. WCAG 1.1.1.
// ────────────────────────────────────────────────────────────

const QTYPES = [{
  id: 'mcq',
  label: 'MCQ',
  icon: 'A',
  color: '#7C3AED',
  desc: 'Single correct'
}, {
  id: 'msq',
  label: 'MSQ',
  icon: '✓✓',
  color: '#7C3AED',
  desc: 'Multiple correct'
}, {
  id: 'fitb',
  label: 'Fill blank',
  icon: '___',
  color: '#0891B2',
  desc: 'Complete the blank'
}, {
  id: 'ordering',
  label: 'Ordering',
  icon: '↕',
  color: '#059669',
  desc: 'Drag to sequence',
  badge: 'New'
}, {
  id: 'match',
  label: 'Match',
  icon: '⇄',
  color: '#0891B2',
  desc: 'Pair left-right'
}, {
  id: 'hotspot',
  label: 'Hotspot',
  icon: '◎',
  color: '#059669',
  desc: 'Click on image'
}, {
  id: 'passage',
  label: 'Passage',
  icon: '¶',
  color: '#059669',
  desc: 'Long read + Qs'
}, {
  id: 'osce',
  label: 'OSCE',
  icon: '✓',
  color: '#E31C79',
  desc: 'Clinical rubric',
  badge: 'PA'
}, {
  id: 'formula',
  label: 'Formula',
  icon: 'ƒ',
  color: '#0891B2',
  desc: 'Variable injection',
  badge: 'New'
}];
const BLOOMS = [{
  id: 1,
  label: 'Remember',
  color: '#6366F1'
}, {
  id: 2,
  label: 'Understand',
  color: '#3B82F6'
}, {
  id: 3,
  label: 'Apply',
  color: '#7C3AED'
}, {
  id: 4,
  label: 'Analyze',
  color: '#D97706'
}, {
  id: 5,
  label: 'Evaluate',
  color: '#EF4444'
}, {
  id: 6,
  label: 'Create',
  color: '#10B981'
}];
const SCHOOL_CATEGORIES = [{
  id: 'bloom',
  label: "Bloom's Level",
  required: true
}, {
  id: 'paea',
  label: 'PAEA Competency',
  required: true
}, {
  id: 'area',
  label: 'Content Area',
  required: true
}];
const COMPETENCIES = ['PAEA — Pharmacology', 'PAEA — Cardiology', 'NCCPA — Cardiovascular', 'ARC-PA Competency 3.1'];
const QUESTION_STATES = {
  draft: {
    label: 'Draft',
    color: '#94A3B8',
    bg: 'rgba(148,163,184,0.12)',
    border: 'rgba(148,163,184,0.3)',
    icon: FileText,
    desc: 'Work in progress. Cannot be added to any exam until reviewed.',
    nextAction: 'Submit for review',
    nextState: 'review' as const
  },
  review: {
    label: 'In Review',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.3)',
    icon: GitBranch,
    desc: 'Awaiting Dept Head approval. Not usable in exams.',
    nextAction: null,
    nextState: null
  },
  private: {
    label: 'Private',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.1)',
    border: 'rgba(124,58,237,0.25)',
    icon: Lock,
    desc: 'Complete and approved, visible only to you.',
    nextAction: 'Make available to school',
    nextState: 'approved' as const
  },
  approved: {
    label: 'Approved — Ready',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.25)',
    icon: Check,
    desc: 'Available to all faculty with access.',
    nextAction: null,
    nextState: null
  }
} as const;
type QState = keyof typeof QUESTION_STATES;
export interface QuestionEditorProps {
  isOpen: boolean;
  onClose: () => void;
}
export function QuestionEditor({
  isOpen,
  onClose
}: QuestionEditorProps) {
  const [type, setType] = useState('mcq');
  const [stem, setStem] = useState('Which beta-blocker is considered cardioselective and preferred in patients with reactive airway disease such as COPD?');
  const [altText, setAlt] = useState('');
  const [blooms, setBlooms] = useState(3);
  const [diff, setDiff] = useState('medium');
  const [competency, setComp] = useState(COMPETENCIES[0]);
  const [qState, setQState] = useState<QState>('draft');
  const [bloomsMode, setBloomsMode] = useState<'1-3' | '1-6'>('1-3');
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState('standard');
  const [personalTags, setPersonalTags] = useState<string[]>(['beta-blockers', 'COPD']);
  const [newTag, setNewTag] = useState('');
  // NEW: per-option rationale (Nipun 4c9b94f5)
  const [rationaleMode, setRationaleMode] = useState<'shared' | 'per-option'>('per-option');
  const [sharedRationale, setSharedRationale] = useState('Metoprolol is beta1-selective. Unlike non-selective agents it has minimal effect on beta2 receptors in the lungs.');
  const [options, setOptions] = useState([{
    id: 'a',
    text: 'Propranolol (non-selective)',
    correct: false,
    rationale: 'Propranolol is non-selective — blocks both beta1 and beta2. Contraindicated in COPD as beta2 blockade causes bronchoconstriction.'
  }, {
    id: 'b',
    text: 'Metoprolol (beta1-selective)',
    correct: true,
    rationale: 'Correct. Metoprolol is beta1-selective (cardioselective). It does not significantly block beta2 receptors in the lungs, making it safe in COPD.'
  }, {
    id: 'c',
    text: 'Carvedilol (alpha+beta)',
    correct: false,
    rationale: 'Carvedilol blocks alpha1, beta1, and beta2. The non-selective beta blockade worsens airway resistance. Not preferred in COPD.'
  }, {
    id: 'd',
    text: 'Labetalol (alpha+beta)',
    correct: false,
    rationale: 'Labetalol also has both alpha and beta blockade. Like carvedilol, the beta2 component can worsen bronchospasm in COPD.'
  }]);
  const [orderItems, setOrderItems] = useState(['Inhibition of pepsinogen secretion', 'Proton pump inactivation', 'Reduced gastric acid production', 'Mucosal healing']);
  const [generatingRationale, setGeneratingRationale] = useState<string | null>(null);
  const bloomsVisible = bloomsMode === '1-3' ? BLOOMS.slice(0, 3) : BLOOMS;
  const selectedBloom = BLOOMS.find((b) => b.id === blooms)!;
  const sc = QUESTION_STATES[qState];
  const StateIcon = sc.icon;
  const addTag = () => {
    const t = newTag.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !personalTags.includes(t)) setPersonalTags((prev) => [...prev, t]);
    setNewTag('');
  };
  const generateOptionRationale = (optId: string) => {
    setGeneratingRationale(optId);
    setTimeout(() => setGeneratingRationale(null), 1200);
  };
  if (!isOpen) return null;
  return <div style={{
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--surface)'
  }}>

      {/* Top bar */}
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 20px',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0
    }}>
        <button onClick={onClose} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 12,
        color: 'var(--text3)',
        background: 'none',
        border: 'none',
        cursor: 'pointer'
      }}>
          <ArrowLeft style={{
          width: 14,
          height: 14
        }} /> Question bank
        </button>
        <span style={{
        color: 'var(--border2)',
        fontSize: 14
      }}>/</span>
        <span style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--text)'
      }}>New question</span>
        <span style={{
        fontSize: 11,
        fontFamily: 'monospace',
        color: 'var(--text3)',
        background: 'var(--surface2)',
        padding: '2px 7px',
        borderRadius: 5,
        border: '1px solid var(--border)'
      }}>PHR-107 · V1</span>

        {/* State pill */}
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginLeft: 8,
        padding: '5px 12px',
        borderRadius: 20,
        background: sc.bg,
        border: `1px solid ${sc.border}`
      }}>
          <StateIcon style={{
          width: 12,
          height: 12,
          color: sc.color
        }} />
          <span style={{
          fontSize: 11,
          fontWeight: 700,
          color: sc.color
        }}>{sc.label}</span>
        </div>
        {(qState === 'draft' || qState === 'private') && <span style={{
        fontSize: 11,
        color: 'var(--text3)'
      }}>
            {qState === 'draft' ? '📝 Cannot be added to any exam until reviewed' : '🔒 Only visible to you'}
          </span>}

        <div style={{
        flex: 1
      }} />
        <button onClick={() => setShowPreview(!showPreview)} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 12,
        padding: '6px 12px',
        borderRadius: 8,
        background: showPreview ? 'var(--surface3)' : 'var(--surface2)',
        border: '1px solid var(--border)',
        color: 'var(--text2)',
        cursor: 'pointer'
      }}>
          <Eye style={{
          width: 13,
          height: 13
        }} /> {showPreview ? 'Hide preview' : 'Student preview'}
        </button>
        <button style={{
        fontSize: 12,
        padding: '6px 12px',
        borderRadius: 8,
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        color: 'var(--text2)',
        cursor: 'pointer'
      }}>Save draft</button>
        {sc.nextAction && <button onClick={() => sc.nextState && setQState(sc.nextState)} style={{
        fontSize: 12,
        fontWeight: 600,
        padding: '6px 14px',
        borderRadius: 8,
        background: 'var(--brand)',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
      }}>{sc.nextAction}</button>}
        <button onClick={onClose} style={{
        padding: '6px',
        borderRadius: 8,
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        color: 'var(--text2)',
        cursor: 'pointer',
        display: 'flex'
      }}>
          <X style={{
          width: 14,
          height: 14
        }} />
        </button>
      </div>

      <div style={{
      flex: 1,
      display: 'flex',
      overflow: 'hidden'
    }}>

        {/* LEFT: Properties sidebar */}
        <div style={{
        width: 228,
        flexShrink: 0,
        overflowY: 'auto',
        borderRight: '1px solid var(--border)',
        padding: '16px 14px',
        background: 'var(--surface)'
      }}>
          {/* Question type */}
          <div style={{
          marginBottom: 16
        }}>
            <div style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: 'var(--text3)',
            marginBottom: 8
          }}>Type</div>
            <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 5
          }}>
              {QTYPES.map((qt) => <button key={qt.id} onClick={() => setType(qt.id)} style={{
              position: 'relative',
              padding: '7px 6px',
              borderRadius: 8,
              background: type === qt.id ? `${qt.color}12` : 'var(--surface2)',
              border: `1.5px solid ${type === qt.id ? qt.color : 'transparent'}`,
              cursor: 'pointer',
              textAlign: 'center'
            }}>
                  {qt.badge && <span style={{
                position: 'absolute',
                top: -4,
                right: -4,
                fontSize: 8,
                fontWeight: 800,
                background: qt.id === 'ordering' ? '#059669' : qt.color,
                color: 'white',
                padding: '1px 4px',
                borderRadius: 3
              }}>{qt.badge}</span>}
                  <div style={{
                fontSize: 14,
                marginBottom: 2
              }}>{qt.icon}</div>
                  <div style={{
                fontSize: 10,
                fontWeight: 600,
                color: type === qt.id ? qt.color : 'var(--text2)'
              }}>{qt.label}</div>
                </button>)}
            </div>
          </div>

          <div style={{
          height: 1,
          background: 'var(--border)',
          margin: '0 0 14px'
        }} />

          {/* Bloom's */}
          <div style={{
          marginBottom: 12
        }}>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 5
          }}>
              <span style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: 'var(--text3)'
            }}>Bloom's</span>
              <div style={{
              display: 'flex',
              gap: 2
            }}>
                {(['1-3', '1-6'] as const).map((m) => <button key={m} onClick={() => setBloomsMode(m)} style={{
                fontSize: 9,
                padding: '1px 5px',
                borderRadius: 4,
                background: bloomsMode === m ? 'var(--brand-soft)' : 'var(--surface2)',
                color: bloomsMode === m ? 'var(--brand)' : 'var(--text3)',
                border: '1px solid var(--border)',
                cursor: 'pointer'
              }}>{m}</button>)}
              </div>
            </div>
            <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4
          }}>
              {bloomsVisible.map((b) => <button key={b.id} onClick={() => setBlooms(b.id)} style={{
              padding: '3px 8px',
              borderRadius: 12,
              fontSize: 11,
              fontWeight: 500,
              background: blooms === b.id ? b.color : 'var(--surface2)',
              color: blooms === b.id ? 'white' : 'var(--text2)',
              border: `1px solid ${blooms === b.id ? b.color : 'var(--border)'}`,
              cursor: 'pointer'
            }}>{b.label}</button>)}
            </div>
          </div>

          {/* Difficulty */}
          <div style={{
          marginBottom: 12
        }}>
            <div style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: 'var(--text3)',
            marginBottom: 5
          }}>Difficulty</div>
            <div style={{
            display: 'flex',
            gap: 4
          }}>
              {[['easy', '#10B981'], ['medium', '#D97706'], ['hard', '#EF4444']].map(([d, c]) => <button key={d} onClick={() => setDiff(d)} style={{
              flex: 1,
              padding: '4px 0',
              borderRadius: 7,
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'capitalize',
              background: diff === d ? c : 'var(--surface2)',
              color: diff === d ? 'white' : 'var(--text2)',
              border: `1px solid ${diff === d ? c : 'var(--border)'}`,
              cursor: 'pointer'
            }}>{d}</button>)}
            </div>
          </div>

          <div style={{
          height: 1,
          background: 'var(--border)',
          margin: '0 0 12px'
        }} />

          {/* Categories */}
          <div style={{
          marginBottom: 14
        }}>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            marginBottom: 7
          }}>
              <Shield style={{
              width: 11,
              height: 11,
              color: '#D97706'
            }} />
              <span style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: '#D97706'
            }}>Categories</span>
              <span style={{
              fontSize: 9,
              color: '#D97706',
              opacity: 0.7
            }}>school-defined</span>
            </div>
            {SCHOOL_CATEGORIES.map((cat) => <div key={cat.id} style={{
            marginBottom: 6
          }}>
                <div style={{
              fontSize: 10,
              color: 'var(--text3)',
              marginBottom: 3
            }}>{cat.label}</div>
                {cat.id === 'paea' ? <select value={competency} onChange={(e) => setComp(e.target.value)} style={{
              width: '100%',
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 11,
              background: 'rgba(217,119,6,0.06)',
              border: '1px solid rgba(217,119,6,0.2)',
              color: 'var(--text)',
              outline: 'none'
            }}>
                    {COMPETENCIES.map((c) => <option key={c}>{c}</option>)}
                  </select> : cat.id === 'bloom' ? <div style={{
              padding: '4px 8px',
              borderRadius: 6,
              background: 'rgba(217,119,6,0.06)',
              border: '1px solid rgba(217,119,6,0.2)',
              fontSize: 11,
              color: selectedBloom.color,
              fontWeight: 600
            }}>{selectedBloom.label}</div> : <select style={{
              width: '100%',
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 11,
              background: 'rgba(217,119,6,0.06)',
              border: '1px solid rgba(217,119,6,0.2)',
              color: 'var(--text)',
              outline: 'none'
            }}>
                    {['Pharmacology', 'Cardiovascular', 'Neurology', 'GI'].map((a) => <option key={a}>{a}</option>)}
                  </select>}
              </div>)}
          </div>

          {/* Tags */}
          <div style={{
          marginBottom: 14
        }}>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            marginBottom: 7
          }}>
              <Tag style={{
              width: 11,
              height: 11,
              color: 'var(--text3)'
            }} />
              <span style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: 'var(--text3)'
            }}>Tags</span>
              <span style={{
              fontSize: 9,
              color: 'var(--text3)',
              opacity: 0.8
            }}>personal</span>
            </div>
            <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            marginBottom: 6
          }}>
              {personalTags.map((t) => <span key={t} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 10,
              padding: '2px 7px',
              borderRadius: 10,
              background: 'var(--surface2)',
              color: 'var(--text2)',
              border: '1px solid var(--border)'
            }}>
                  {t}
                  <button onClick={() => setPersonalTags((prev) => prev.filter((x) => x !== t))} style={{
                color: 'var(--text3)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex'
              }}><X style={{
                  width: 9,
                  height: 9
                }} /></button>
                </span>)}
            </div>
            <div style={{
            display: 'flex',
            gap: 4
          }}>
              <input value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTag()} placeholder="Add tag…" style={{
              flex: 1,
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 11,
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              outline: 'none'
            }} />
              <button onClick={addTag} style={{
              padding: '4px 8px',
              borderRadius: 6,
              background: 'var(--surface3)',
              border: '1px solid var(--border)',
              color: 'var(--text3)',
              cursor: 'pointer',
              fontSize: 11
            }}>+</button>
            </div>
          </div>
        </div>

        {/* CENTER: Editor */}
        <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px 48px',
        background: 'var(--surface)'
      }}>

          {/* State banner */}
          {(qState === 'draft' || qState === 'private') && <div style={{
          marginBottom: 20,
          padding: '10px 14px',
          borderRadius: 10,
          background: sc.bg,
          border: `1px solid ${sc.border}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10
        }}>
              <StateIcon style={{
            width: 16,
            height: 16,
            color: sc.color,
            marginTop: 1,
            flexShrink: 0
          }} />
              <div style={{
            flex: 1
          }}>
                <div style={{
              fontSize: 12,
              fontWeight: 700,
              color: sc.color,
              marginBottom: 2
            }}>{sc.label}</div>
                <div style={{
              fontSize: 11,
              color: 'var(--text2)',
              lineHeight: 1.5
            }}>{sc.desc}</div>
              </div>
              {sc.nextAction && <button onClick={() => sc.nextState && setQState(sc.nextState)} style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '5px 10px',
            borderRadius: 7,
            background: sc.color,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0
          }}>{sc.nextAction}</button>}
            </div>}

          {/* Stem */}
          <div style={{
          marginBottom: 24
        }}>
            <div style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text3)',
            marginBottom: 8
          }}>Question stem</div>
            <div style={{
            position: 'relative'
          }}>
              <textarea value={stem} onChange={(e) => setStem(e.target.value)} rows={3} style={{
              width: '100%',
              fontSize: 17,
              fontWeight: 500,
              lineHeight: 1.65,
              color: 'var(--text)',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              padding: 0,
              fontFamily: 'inherit'
            }} />
              <button style={{
              position: 'absolute',
              top: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              padding: '4px 8px',
              borderRadius: 6,
              background: 'rgba(217,119,6,0.08)',
              color: '#D97706',
              border: 'none',
              cursor: 'pointer'
            }}>
                <Zap style={{
                width: 11,
                height: 11
              }} /> AI improve
              </button>
            </div>
          </div>

          {/* Alt text gate */}
          <div style={{
          marginBottom: 20,
          padding: '12px 16px',
          borderRadius: 10,
          border: `1.5px dashed ${altText ? '#10B981' : '#E2E8F0'}`,
          background: altText ? 'rgba(16,185,129,0.03)' : 'var(--surface2)',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
            <div style={{
            width: 52,
            height: 40,
            borderRadius: 8,
            background: 'var(--surface3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 10,
            color: 'var(--text3)'
          }}>EKG</div>
            <div style={{
            flex: 1
          }}>
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 5
            }}>
                {altText ? <span style={{
                fontSize: 11,
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}><Check style={{
                  width: 12,
                  height: 12
                }} /> Alt text saved — WCAG 1.1.1 compliant</span> : <span style={{
                fontSize: 11,
                color: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}><AlertTriangle style={{
                  width: 12,
                  height: 12
                }} /> Alt text required — blocks publish (ADA Title II · Apr 24 deadline)</span>}
              </div>
              <input type="text" placeholder="Describe this image for screen readers…" value={altText} onChange={(e) => setAlt(e.target.value)} style={{
              width: '100%',
              padding: '5px 9px',
              borderRadius: 7,
              fontSize: 12,
              background: 'var(--surface)',
              border: `1px solid ${altText ? '#10B981' : '#E2E8F0'}`,
              color: 'var(--text)',
              outline: 'none'
            }} />
            </div>
          </div>

          {/* MCQ/MSQ options with per-option rationale */}
          {(type === 'mcq' || type === 'msq') && <div style={{
          marginBottom: 24
        }}>
              <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10
          }}>
                <div style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text3)'
            }}>Answer options</div>
                {/* NEW: rationale mode toggle — Nipun 4c9b94f5 */}
                <div style={{
              display: 'flex',
              gap: 2,
              padding: '3px 4px',
              borderRadius: 8,
              background: 'var(--surface2)',
              border: '1px solid var(--border)'
            }}>
                  {(['shared', 'per-option'] as const).map((m) => <button key={m} onClick={() => setRationaleMode(m)} style={{
                fontSize: 10,
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 6,
                background: rationaleMode === m ? 'var(--brand)' : 'transparent',
                color: rationaleMode === m ? 'white' : 'var(--text3)',
                border: 'none',
                cursor: 'pointer'
              }}>
                      {m === 'shared' ? 'Shared rationale' : 'Per-option rationale'}
                    </button>)}
                </div>
              </div>

              {rationaleMode === 'per-option' && <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 8,
            padding: '6px 10px',
            borderRadius: 8,
            background: 'rgba(124,58,237,0.05)',
            border: '1px solid rgba(124,58,237,0.15)',
            fontSize: 11,
            color: 'var(--text2)'
          }}>
                  <MessageSquare style={{
              width: 12,
              height: 12,
              color: '#7C3AED',
              flexShrink: 0
            }} />
                  Nipun (Mar 11): “Maybe better if we can give different rationales for different options.” AI can draft all four automatically.
                  <button onClick={() => options.forEach((o) => generateOptionRationale(o.id))} style={{
              marginLeft: 'auto',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: 7,
              background: '#7C3AED',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}>
                    <Sparkles style={{
                width: 11,
                height: 11
              }} /> AI draft all
                  </button>
                </div>}

              <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: rationaleMode === 'per-option' ? 10 : 6
          }}>
                {options.map((opt, i) => <div key={opt.id} style={{
              borderRadius: 10,
              background: opt.correct ? 'rgba(16,185,129,0.04)' : 'var(--surface2)',
              border: `1.5px solid ${opt.correct ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`
            }}>
                    {/* Option row */}
                    <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px'
              }}>
                      <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  width: 20,
                  flexShrink: 0,
                  color: opt.correct ? '#10B981' : 'var(--text3)',
                  fontFamily: 'monospace'
                }}>{String.fromCharCode(65 + i)}</span>
                      <input type="text" value={opt.text} onChange={(e) => setOptions(options.map((o) => o.id === opt.id ? {
                  ...o,
                  text: e.target.value
                } : o))} style={{
                  flex: 1,
                  fontSize: 14,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text)',
                  fontFamily: 'inherit'
                }} />
                      {opt.correct ? <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#10B981',
                  background: 'rgba(16,185,129,0.12)',
                  padding: '2px 7px',
                  borderRadius: 10,
                  flexShrink: 0
                }}>Correct</span> : <button onClick={() => setOptions(options.map((o) => ({
                  ...o,
                  correct: o.id === opt.id
                })))} style={{
                  fontSize: 10,
                  color: 'var(--text3)',
                  background: 'var(--surface3)',
                  border: '1px solid var(--border)',
                  padding: '2px 7px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  flexShrink: 0
                }}>Set correct</button>}
                      <button onClick={() => setOptions(options.filter((o) => o.id !== opt.id))} style={{
                  color: 'var(--text3)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0
                }}><X style={{
                    width: 13,
                    height: 13
                  }} /></button>
                    </div>

                    {/* Per-option rationale */}
                    {rationaleMode === 'per-option' && <div style={{
                padding: '0 12px 10px',
                borderTop: '1px solid var(--border)'
              }}>
                        <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 0 5px'
                }}>
                          <MessageSquare style={{
                    width: 11,
                    height: 11,
                    color: opt.correct ? '#10B981' : 'var(--text3)',
                    flexShrink: 0
                  }} />
                          <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: opt.correct ? '#10B981' : 'var(--text3)'
                  }}>
                            {opt.correct ? 'Why this is correct' : 'Why this is wrong'}
                          </span>
                          <button onClick={() => generateOptionRationale(opt.id)} style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    fontSize: 10,
                    padding: '2px 7px',
                    borderRadius: 6,
                    background: 'rgba(217,119,6,0.08)',
                    color: '#D97706',
                    border: 'none',
                    cursor: 'pointer'
                  }}>
                            {generatingRationale === opt.id ? 'Writing…' : <><Sparkles style={{
                        width: 10,
                        height: 10
                      }} /> AI draft</>}
                          </button>
                        </div>
                        <textarea value={opt.rationale} onChange={(e) => setOptions(options.map((o) => o.id === opt.id ? {
                  ...o,
                  rationale: e.target.value
                } : o))} rows={2} placeholder={opt.correct ? 'Explain why this is the correct answer…' : 'Explain why a student choosing this is wrong…'} style={{
                  width: '100%',
                  fontSize: 12,
                  lineHeight: 1.55,
                  color: 'var(--text2)',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '7px 9px',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit'
                }} />
                      </div>}
                  </div>)}
              </div>

              {rationaleMode === 'shared' && <div style={{
            marginTop: 14,
            padding: '12px 14px',
            borderRadius: 10,
            background: 'rgba(59,130,246,0.05)',
            border: '1px solid rgba(59,130,246,0.15)'
          }}>
                  <div style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#3B82F6',
              marginBottom: 6
            }}>Shared rationale (shown after all options)</div>
                  <textarea value={sharedRationale} onChange={(e) => setSharedRationale(e.target.value)} rows={2} style={{
              width: '100%',
              fontSize: 12,
              lineHeight: 1.6,
              color: 'var(--text2)',
              background: 'var(--surface)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: 8,
              padding: '7px 9px',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit'
            }} />
                </div>}

              <div style={{
            display: 'flex',
            gap: 8,
            marginTop: 8
          }}>
                <button onClick={() => setOptions([...options, {
              id: String.fromCharCode(97 + options.length),
              text: '',
              correct: false,
              rationale: ''
            }])} style={{
              fontSize: 12,
              color: 'var(--brand)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
                  <Plus style={{
                width: 13,
                height: 13
              }} /> Add option
                </button>
                <button style={{
              fontSize: 12,
              color: '#D97706',
              background: 'rgba(217,119,6,0.08)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 7
            }}>
                  <Sparkles style={{
                width: 11,
                height: 11
              }} /> Generate distractors
                </button>
              </div>
            </div>}

          {/* Ordering type */}
          {type === 'ordering' && <div style={{
          marginBottom: 24
        }}>
              <div style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text3)',
            marginBottom: 6
          }}>Correct order</div>
              <div style={{
            fontSize: 11,
            color: 'var(--text3)',
            marginBottom: 10
          }}>Students see items in a randomised order and drag them into the correct sequence.</div>
              {orderItems.map((item, i) => <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 12px',
            marginBottom: 6,
            borderRadius: 10,
            background: 'var(--surface2)',
            border: '1px solid var(--border)'
          }}>
                  <span style={{
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'monospace',
              color: 'var(--brand)',
              width: 20
            }}>{i + 1}</span>
                  <input value={item} onChange={(e) => setOrderItems(orderItems.map((x, j) => j === i ? e.target.value : x))} style={{
              flex: 1,
              fontSize: 13,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontFamily: 'inherit'
            }} />
                  <div style={{
              display: 'flex',
              gap: 3
            }}>
                    {i > 0 && <button onClick={() => {
                const a = [...orderItems];
                [a[i - 1], a[i]] = [a[i], a[i - 1]];
                setOrderItems(a);
              }} style={{
                fontSize: 10,
                padding: '2px 5px',
                borderRadius: 5,
                background: 'var(--surface3)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                color: 'var(--text3)'
              }}>↑</button>}
                    {i < orderItems.length - 1 && <button onClick={() => {
                const a = [...orderItems];
                [a[i], a[i + 1]] = [a[i + 1], a[i]];
                setOrderItems(a);
              }} style={{
                fontSize: 10,
                padding: '2px 5px',
                borderRadius: 5,
                background: 'var(--surface3)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                color: 'var(--text3)'
              }}>↓</button>}
                    <button onClick={() => setOrderItems(orderItems.filter((_, j) => j !== i))} style={{
                color: 'var(--text3)',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}><X style={{
                  width: 12,
                  height: 12
                }} /></button>
                  </div>
                </div>)}
              <button onClick={() => setOrderItems([...orderItems, ''])} style={{
            fontSize: 12,
            color: 'var(--brand)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginTop: 4
          }}>
                <Plus style={{
              width: 13,
              height: 13
            }} /> Add step
              </button>
            </div>}
        </div>

        {/* RIGHT: Student preview */}
        {showPreview && <div style={{
        width: 380,
        flexShrink: 0,
        borderLeft: '1px solid var(--border)',
        background: 'var(--surface2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
            <div style={{
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          flexShrink: 0
        }}>
              <div style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: 'var(--text3)',
            marginBottom: 7
          }}>Student view</div>
              <div style={{
            display: 'flex',
            gap: 5,
            flexWrap: 'wrap'
          }}>
                {['Standard', 'High contrast', 'TTS', 'After submit'].map((m) => <button key={m} onClick={() => setPreviewMode(m.toLowerCase())} style={{
              fontSize: 10,
              padding: '3px 8px',
              borderRadius: 12,
              background: previewMode === m.toLowerCase() ? 'var(--brand)' : 'var(--surface2)',
              color: previewMode === m.toLowerCase() ? 'white' : 'var(--text2)',
              border: '1px solid var(--border)',
              cursor: 'pointer'
            }}>{m}</button>)}
              </div>
            </div>
            <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16
        }}>
              <div style={{
            padding: 16,
            borderRadius: 12,
            background: previewMode === 'high contrast' ? '#000' : 'var(--surface)',
            border: '1px solid var(--border)'
          }}>
                <div style={{
              fontSize: 10,
              fontFamily: 'monospace',
              color: 'var(--text3)',
              marginBottom: 10
            }}>Question 1 of 30</div>
                <p style={{
              fontSize: 14,
              lineHeight: 1.75,
              color: previewMode === 'high contrast' ? '#fff' : 'var(--text)',
              marginBottom: 16
            }}>{stem}</p>
                {options.map((opt, i) => {
              const isAfterSubmit = previewMode === 'after submit';
              return <div key={opt.id}>
                      <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 9,
                  marginBottom: isAfterSubmit ? 0 : 6,
                  background: isAfterSubmit && opt.correct ? 'rgba(16,185,129,0.06)' : 'var(--surface2)',
                  border: `1px solid ${isAfterSubmit && opt.correct ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`
                }}>
                        <div style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: `2px solid ${isAfterSubmit && opt.correct ? '#10B981' : 'var(--border2)'}`,
                    flexShrink: 0,
                    background: isAfterSubmit && opt.correct ? 'rgba(16,185,129,0.1)' : 'transparent'
                  }} />
                        <span style={{
                    fontSize: 13,
                    color: 'var(--text)'
                  }}>{String.fromCharCode(65 + i)}. {opt.text}</span>
                        {isAfterSubmit && opt.correct && <span style={{
                    marginLeft: 'auto',
                    fontSize: 10,
                    color: '#10B981',
                    fontWeight: 700
                  }}>✓ Correct</span>}
                      </div>
                      {/* Show per-option rationale after submit */}
                      {isAfterSubmit && rationaleMode === 'per-option' && opt.rationale && <div style={{
                  marginBottom: 6,
                  padding: '6px 10px 7px 36px',
                  borderRadius: '0 0 9px 9px',
                  background: opt.correct ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.03)',
                  border: `1px solid ${opt.correct ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)'}`,
                  borderTop: 'none',
                  fontSize: 11,
                  color: 'var(--text3)',
                  lineHeight: 1.5
                }}>
                          {opt.rationale}
                        </div>}
                    </div>;
            })}
              </div>
            </div>
          </div>}
      </div>
    </div>;
}