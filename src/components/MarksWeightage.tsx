import React, { useCallback, useState } from 'react';
import { BarChart3, Lock, Unlock, RefreshCw, AlertTriangle, Check, Sparkles, ChevronDown, Info } from 'lucide-react';
// ── Source: marks_weightage_features.md (project attachment)
// ── Priority from doc:
//   Phase 1 (MVP): Equal distribution, Manual per-Q marks, Section totals,
//                  Assessment total, Bulk apply, Type defaults, Preview/summary
//   Phase 2: Percentage weightage, Partial credit MSQ, Negative marking,
//             Difficulty-based distribution, Marks validation + warnings
//   Phase 3: Bloom's-based, Grouped vignette marks, Templates, Locking, Visual editor
//
// ── Key UX principles from doc:
//   1. Visual feedback: always show totals, percentages, distribution visually
//   2. Auto-calculation: minimize manual math
//   3. Validation: warn before saving if totals don't match
//   4. Flexibility: quick (equal distribution) AND precise (manual) workflows
//   5. Preview: show impact before applying bulk changes
type DistMethod = 'equal' | 'manual' | 'difficulty' | 'blooms';
type ScoringMode = 'all-or-nothing' | 'partial-additive' | 'proportional';
interface Question {
  id: string;
  stem: string;
  type: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  blooms: string;
  marks: number;
  locked: boolean;
}
interface Section {
  id: string;
  title: string;
  color: string;
  questions: Question[];
  totalMarks: number;
  distMethod: DistMethod;
  locked: boolean;
}
const INITIAL_SECTIONS: Section[] = [{
  id: 'a',
  title: 'Section A — Pharmacology Core',
  color: '#E31C79',
  totalMarks: 60,
  distMethod: 'equal',
  locked: false,
  questions: [{
    id: 'PHR-001',
    stem: 'Which beta-blocker is cardioselective…',
    type: 'MCQ',
    difficulty: 'Medium',
    blooms: 'Apply',
    marks: 2,
    locked: false
  }, {
    id: 'PHR-002',
    stem: 'ACE inhibitors prevent conversion of…',
    type: 'MCQ',
    difficulty: 'Easy',
    blooms: 'Remember',
    marks: 2,
    locked: false
  }, {
    id: 'CRD-001',
    stem: 'ST elevation in II, III, aVF…',
    type: 'Hotspot',
    difficulty: 'Hard',
    blooms: 'Evaluate',
    marks: 2,
    locked: false
  }, {
    id: 'PHR-107',
    stem: 'Ordering: steps of glycolysis…',
    type: 'Ordering',
    difficulty: 'Medium',
    blooms: 'Remember',
    marks: 2,
    locked: false
  }, {
    id: 'PHR-003',
    stem: 'Warfarin + amiodarone expected INR change',
    type: 'Fill',
    difficulty: 'Hard',
    blooms: 'Analyze',
    marks: 2,
    locked: false
  }]
}, {
  id: 'b',
  title: 'Section B — Clinical Reasoning',
  color: '#0891B2',
  totalMarks: 25,
  distMethod: 'manual',
  locked: false,
  questions: [{
    id: 'GI-001',
    stem: 'Patient on PPI x3 years. B12 = 180…',
    type: 'MCQ',
    difficulty: 'Medium',
    blooms: 'Analyze',
    marks: 5,
    locked: false
  }, {
    id: 'NEU-001',
    stem: 'Slurred speech, arm weakness, 45min…',
    type: 'MCQ',
    difficulty: 'Hard',
    blooms: 'Evaluate',
    marks: 5,
    locked: false
  }, {
    id: 'CRD-044',
    stem: 'HR 128, BP 85/52, SpO2 88%, JVD…',
    type: 'MSQ',
    difficulty: 'Hard',
    blooms: 'Analyze',
    marks: 5,
    locked: false
  }, {
    id: 'PHR-108',
    stem: 'Which diuretic causes hypokalemia…',
    type: 'MCQ',
    difficulty: 'Medium',
    blooms: 'Apply',
    marks: 5,
    locked: false
  }, {
    id: 'NEU-033',
    stem: 'Thunderclap headache, CT negative…',
    type: 'MCQ',
    difficulty: 'Hard',
    blooms: 'Evaluate',
    marks: 5,
    locked: false
  }]
}, {
  id: 'c',
  title: 'Section C — Quick Recall',
  color: '#7C3AED',
  totalMarks: 15,
  distMethod: 'equal',
  locked: false,
  questions: [{
    id: 'PHR-109',
    stem: 'Warfarin inhibits which enzyme…',
    type: 'MCQ',
    difficulty: 'Easy',
    blooms: 'Remember',
    marks: 1,
    locked: false
  }, {
    id: 'GI-021',
    stem: 'Long-term PPI → which deficiency…',
    type: 'MCQ',
    difficulty: 'Easy',
    blooms: 'Apply',
    marks: 1,
    locked: false
  }, {
    id: 'CRD-020',
    stem: 'First-line for stable angina…',
    type: 'MCQ',
    difficulty: 'Easy',
    blooms: 'Remember',
    marks: 1,
    locked: false
  }]
}];
const DIFF_MULTIPLIERS = {
  Easy: 1,
  Medium: 2,
  Hard: 3
};
const BLOOM_MULTIPLIERS: Record<string, number> = {
  Remember: 1,
  Understand: 1.5,
  Apply: 2,
  Analyze: 2.5,
  Evaluate: 3,
  Create: 3.5
};
const DIFF_COLORS = {
  Easy: '#10B981',
  Medium: '#D97706',
  Hard: '#EF4444'
};
const BLOOM_COLORS: Record<string, string> = {
  Remember: '#6366F1',
  Understand: '#3B82F6',
  Apply: '#7C3AED',
  Analyze: '#D97706',
  Evaluate: '#EF4444',
  Create: '#10B981'
};
function distributeSectionMarks(section: Section, method: DistMethod): Question[] {
  const total = section.totalMarks;
  const qs = section.questions.filter((q) => !q.locked);
  const lockedTotal = section.questions.filter((q) => q.locked).reduce((s, q) => s + q.marks, 0);
  const available = total - lockedTotal;
  if (method === 'equal') {
    const each = Math.round(available / qs.length * 10) / 10;
    return section.questions.map((q) => q.locked ? q : {
      ...q,
      marks: each
    });
  }
  if (method === 'difficulty') {
    const weights = qs.map((q) => DIFF_MULTIPLIERS[q.difficulty]);
    const sum = weights.reduce((a, b) => a + b, 0);
    let qi = 0;
    return section.questions.map((q) => {
      if (q.locked) return q;
      const m = Math.round(DIFF_MULTIPLIERS[q.difficulty] / sum * available * 10) / 10;
      qi++;
      return {
        ...q,
        marks: m
      };
    });
  }
  if (method === 'blooms') {
    const weights = qs.map((q) => BLOOM_MULTIPLIERS[q.blooms] || 1);
    const sum = weights.reduce((a, b) => a + b, 0);
    return section.questions.map((q) => {
      if (q.locked) return q;
      return {
        ...q,
        marks: Math.round((BLOOM_MULTIPLIERS[q.blooms] || 1) / sum * available * 10) / 10
      };
    });
  }
  return section.questions;
}
function SectionRow({
  section,
  onUpdate,
  totalAssessmentMarks




}: {section: Section;onUpdate: (s: Section) => void;totalAssessmentMarks: number;}) {
  const [expanded, setExpanded] = useState(false);
  const [editingTotal, setEditingTotal] = useState(false);
  const [msqMode, setMsqMode] = useState<ScoringMode>('all-or-nothing');
  const [showNegative, setShowNegative] = useState(false);
  const [negativePct, setNegativePct] = useState(0.33);
  const sectionSum = section.questions.reduce((s, q) => s + q.marks, 0);
  const pct = Math.round(section.totalMarks / totalAssessmentMarks * 100);
  const hasMSQ = section.questions.some((q) => q.type === 'MSQ');
  const warning = Math.abs(sectionSum - section.totalMarks) > 0.1;
  const applyDist = (method: DistMethod) => {
    const updated = distributeSectionMarks({
      ...section,
      distMethod: method
    }, method);
    onUpdate({
      ...section,
      distMethod: method,
      questions: updated
    });
  };
  const updateQuestionMarks = (qId: string, marks: number) => {
    onUpdate({
      ...section,
      questions: section.questions.map((q) => q.id === qId ? {
        ...q,
        marks
      } : q)
    });
  };
  const toggleLock = (qId: string) => {
    onUpdate({
      ...section,
      questions: section.questions.map((q) => q.id === qId ? {
        ...q,
        locked: !q.locked
      } : q)
    });
  };
  return <div style={{
    borderRadius: 10,
    overflow: 'hidden',
    border: '1px solid var(--border)',
    background: '#fff'
  }}>
      {/* Section header */}
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 16px',
      background: `${section.color}06`,
      borderBottom: expanded ? '1px solid var(--border)' : 'none',
      borderLeft: `3px solid ${section.color}`
    }}>
        <button onClick={() => setExpanded(!expanded)} style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text3)',
        display: 'flex'
      }}>
          <ChevronDown style={{
          width: 14,
          height: 14,
          transform: expanded ? 'none' : 'rotate(-90deg)',
          transition: 'transform 0.15s'
        }} />
        </button>
        <span style={{
        flex: 1,
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--text)'
      }}>
          {section.title}
        </span>
        <span style={{
        fontSize: 11,
        color: 'var(--text3)'
      }}>
          {section.questions.length}q
        </span>

        {/* Section total marks */}
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }}>
          {editingTotal ? <input type="number" defaultValue={section.totalMarks} onBlur={(e) => {
          onUpdate({
            ...section,
            totalMarks: Number(e.target.value)
          });
          setEditingTotal(false);
        }} onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()} autoFocus style={{
          width: 60,
          fontSize: 13,
          fontWeight: 700,
          fontFamily: 'JetBrains Mono, monospace',
          padding: '3px 6px',
          borderRadius: 6,
          border: '1px solid var(--brand)',
          background: 'var(--brand-soft)',
          color: 'var(--brand)',
          outline: 'none',
          textAlign: 'center'
        }} /> : <button onClick={() => setEditingTotal(true)} style={{
          fontSize: 13,
          fontWeight: 800,
          fontFamily: 'JetBrains Mono, monospace',
          color: section.color,
          background: `${section.color}12`,
          border: `1px solid ${section.color}25`,
          borderRadius: 6,
          padding: '3px 10px',
          cursor: 'pointer'
        }}>
              {section.totalMarks}m
            </button>}
          <span style={{
          fontSize: 10,
          color: 'var(--text3)'
        }}>
            = {pct}%
          </span>
        </div>

        {/* Warning */}
        {warning && <span style={{
        fontSize: 10,
        fontWeight: 700,
        padding: '2px 7px',
        borderRadius: 8,
        background: 'rgba(217,119,6,0.1)',
        color: '#D97706',
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }}>
            <AlertTriangle style={{
          width: 10,
          height: 10
        }} />{' '}
            Totals don't match ({sectionSum.toFixed(1)} ≠ {section.totalMarks})
          </span>}
        {!warning && sectionSum > 0 && <span style={{
        fontSize: 10,
        padding: '2px 7px',
        borderRadius: 8,
        background: 'rgba(16,185,129,0.08)',
        color: '#10B981',
        display: 'flex',
        alignItems: 'center',
        gap: 3
      }}>
            <Check style={{
          width: 10,
          height: 10
        }} />{' '}
            {sectionSum}m
          </span>}
      </div>

      {/* Expanded content */}
      {expanded && <>
          {/* Distribution toolbar */}
          <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        background: 'var(--surface2)',
        borderBottom: '1px solid var(--border)'
      }}>
            <span style={{
          fontSize: 11,
          color: 'var(--text3)',
          flexShrink: 0
        }}>
              Distribute by:
            </span>
            {([['equal', 'Equal'], ['difficulty', 'Difficulty'], ['blooms', "Bloom's"], ['manual', 'Manual']] as [DistMethod, string][]).map(([m, label]) => <button key={m} onClick={() => applyDist(m)} style={{
          fontSize: 11,
          fontWeight: 600,
          padding: '4px 10px',
          borderRadius: 20,
          border: `1px solid ${section.distMethod === m ? section.color : 'var(--border)'}`,
          background: section.distMethod === m ? `${section.color}12` : '#fff',
          color: section.distMethod === m ? section.color : 'var(--text3)',
          cursor: 'pointer'
        }}>
                {label}
              </button>)}
            {section.distMethod === 'difficulty' && <span style={{
          fontSize: 10,
          color: 'var(--text3)',
          marginLeft: 4
        }}>
                Easy×1 · Medium×2 · Hard×3
              </span>}
            {section.distMethod === 'blooms' && <span style={{
          fontSize: 10,
          color: 'var(--text3)',
          marginLeft: 4
        }}>
                Remember×1 → Create×3.5
              </span>}
            {/* AI suggest */}
            <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 11,
          padding: '4px 10px',
          borderRadius: 20,
          border: '1px solid rgba(217,119,6,0.3)',
          background: 'rgba(217,119,6,0.06)',
          color: '#D97706',
          cursor: 'pointer',
          marginLeft: 'auto'
        }}>
              <Sparkles style={{
            width: 10,
            height: 10
          }} />{' '}
              AI suggest
            </button>
          </div>

          {/* MSQ partial credit — Phase 2 */}
          {hasMSQ && <div style={{
        padding: '8px 14px',
        background: 'rgba(109,94,212,0.04)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
              <span style={{
          fontSize: 11,
          color: 'var(--text3)',
          flexShrink: 0
        }}>
                MSQ scoring:
              </span>
              {([['all-or-nothing', 'All-or-nothing'], ['partial-additive', 'Partial credit (+1/-1)'], ['proportional', 'Proportional']] as [ScoringMode, string][]).map(([m, label]) => <button key={m} onClick={() => setMsqMode(m)} style={{
          fontSize: 11,
          padding: '3px 9px',
          borderRadius: 12,
          border: `1px solid ${msqMode === m ? '#7C3AED' : 'var(--border)'}`,
          background: msqMode === m ? 'rgba(124,58,237,0.1)' : '#fff',
          color: msqMode === m ? '#7C3AED' : 'var(--text3)',
          cursor: 'pointer'
        }}>
                  {label}
                </button>)}
              <span style={{
          fontSize: 10,
          color: 'var(--text3)',
          marginLeft: 4
        }}>
                {msqMode === 'partial-additive' ? 'Student gets +1 per correct, -1 per incorrect option.' : msqMode === 'proportional' ? 'Marks ÷ number of correct options.' : 'Must select all correct options. 0 if any wrong.'}
              </span>
            </div>}

          {/* Negative marking — Phase 2 */}
          <div style={{
        padding: '7px 14px',
        background: 'rgba(239,68,68,0.02)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
            <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          cursor: 'pointer'
        }}>
              <div style={{
            width: 28,
            height: 16,
            borderRadius: 8,
            background: showNegative ? '#EF4444' : 'var(--border2)',
            position: 'relative',
            cursor: 'pointer',
            flexShrink: 0
          }} onClick={() => setShowNegative(!showNegative)}>
                <div style={{
              position: 'absolute',
              top: 2,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#fff',
              left: showNegative ? 14 : 2,
              transition: 'left 0.12s'
            }} />
              </div>
              <span style={{
            fontSize: 11,
            color: 'var(--text2)'
          }}>
                Negative marking
              </span>
            </label>
            {showNegative && <>
                <span style={{
            fontSize: 11,
            color: 'var(--text3)'
          }}>
                  Deduct
                </span>
                <select value={negativePct} onChange={(e) => setNegativePct(Number(e.target.value))} style={{
            fontSize: 11,
            padding: '3px 7px',
            borderRadius: 6,
            border: '1px solid rgba(239,68,68,0.3)',
            background: 'rgba(239,68,68,0.05)',
            color: 'var(--text)',
            outline: 'none'
          }}>
                  <option value={0.25}>0.25 marks (1/4)</option>
                  <option value={0.33}>0.33 marks (1/3)</option>
                  <option value={0.5}>0.5 marks (1/2)</option>
                  <option value={1}>1 mark (full deduction)</option>
                </select>
                <span style={{
            fontSize: 11,
            color: '#EF4444',
            padding: '2px 8px',
            borderRadius: 7,
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.18)'
          }}>
                  per wrong answer
                </span>
              </>}
          </div>

          {/* Question rows */}
          {section.questions.map((q, i) => <div key={q.id} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 14px',
        borderBottom: i < section.questions.length - 1 ? '1px solid var(--border)' : 'none',
        background: q.locked ? 'rgba(109,94,212,0.02)' : '#fff'
      }}>
              <span style={{
          fontSize: 11,
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 700,
          color: 'var(--brand)',
          width: 64,
          flexShrink: 0
        }}>
                {q.id}
              </span>
              <span style={{
          fontSize: 12,
          color: 'var(--text2)',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
                {q.stem}
              </span>
              <span style={{
          fontSize: 10,
          padding: '1px 6px',
          borderRadius: 5,
          background: 'var(--surface2)',
          color: 'var(--text3)',
          flexShrink: 0
        }}>
                {q.type}
              </span>
              <span style={{
          fontSize: 10,
          padding: '1px 6px',
          borderRadius: 8,
          background: `${DIFF_COLORS[q.difficulty]}12`,
          color: DIFF_COLORS[q.difficulty],
          fontWeight: 600,
          flexShrink: 0
        }}>
                {q.difficulty}
              </span>
              <span style={{
          fontSize: 10,
          padding: '1px 6px',
          borderRadius: 8,
          background: `${BLOOM_COLORS[q.blooms]}12`,
          color: BLOOM_COLORS[q.blooms],
          flexShrink: 0
        }}>
                {q.blooms}
              </span>

              {/* Marks input */}
              <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          flexShrink: 0
        }}>
                {q.locked && <Lock style={{
            width: 10,
            height: 10,
            color: '#7C3AED'
          }} />}
                <input type="number" value={q.marks} min={0} step={0.5} disabled={q.locked} onChange={(e) => updateQuestionMarks(q.id, Number(e.target.value))} style={{
            width: 52,
            fontSize: 12,
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
            textAlign: 'center',
            padding: '3px 6px',
            borderRadius: 6,
            border: `1px solid ${q.locked ? '#7C3AED30' : 'var(--border)'}`,
            background: q.locked ? 'rgba(124,58,237,0.06)' : '#fff',
            color: q.locked ? '#7C3AED' : 'var(--text)',
            outline: 'none'
          }} />
                <span style={{
            fontSize: 10,
            color: 'var(--text3)'
          }}>
                  m
                </span>
                <button onClick={() => toggleLock(q.id)} title={q.locked ? 'Unlock — allow auto-distribution' : 'Lock — exclude from auto-distribution'} style={{
            color: q.locked ? '#7C3AED' : 'var(--text3)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex'
          }}>
                  {q.locked ? <Lock style={{
              width: 11,
              height: 11
            }} /> : <Unlock style={{
              width: 11,
              height: 11
            }} />}
                </button>
              </div>
            </div>)}
        </>}
    </div>;
}
export function MarksWeightage({
  onClose


}: {onClose?: () => void;}) {
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [assessmentTotal, setAssessmentTotal] = useState(100);
  const [editingTotal, setEditingTotal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const updateSection = useCallback((updated: Section) => {
    setSections((prev) => prev.map((s) => s.id === updated.id ? updated : s));
  }, []);
  const sectionTotals = sections.map((s) => s.totalMarks);
  const sumOfSections = sectionTotals.reduce((a, b) => a + b, 0);
  const totalMismatch = Math.abs(sumOfSections - assessmentTotal) > 0.1;
  const totalQuestions = sections.reduce((a, s) => a + s.questions.length, 0);
  return <div style={{
    flex: 1,
    overflowY: 'auto',
    padding: 24,
    background: 'var(--surface2)'
  }}>
      <div style={{
      maxWidth: 860,
      margin: '0 auto'
    }}>
        {/* Header */}
        <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 20
      }}>
          <div>
            <h2 style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'var(--font-heading)'
          }}>
              <BarChart3 style={{
              width: 18,
              height: 18,
              color: 'var(--brand)'
            }} />
              Marks & Weightage
            </h2>
            <p style={{
            fontSize: 12,
            color: 'var(--text3)',
            margin: '4px 0 0'
          }}>
              CV Pharmacology — Midterm 2026 · {totalQuestions} questions · 3
              sections
            </p>
          </div>
          <div style={{
          display: 'flex',
          gap: 8
        }}>
            <button onClick={() => setShowPreview(!showPreview)} style={{
            fontSize: 12,
            padding: '7px 14px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: showPreview ? 'var(--brand-soft)' : '#fff',
            color: showPreview ? 'var(--brand)' : 'var(--text2)',
            cursor: 'pointer'
          }}>
              {showPreview ? 'Hide preview' : 'Show preview'}
            </button>
            <button style={{
            fontSize: 12,
            fontWeight: 600,
            padding: '7px 16px',
            borderRadius: 8,
            background: 'var(--brand)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}>
              Save marks
            </button>
          </div>
        </div>

        {/* Distribution bar — visual at top, always visible */}
        <div style={{
        padding: '14px 16px',
        borderRadius: 12,
        background: '#fff',
        border: '1px solid var(--border)',
        marginBottom: 16
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10
        }}>
            <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--text)'
          }}>
              Assessment total
            </span>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
              {totalMismatch && <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
                  <AlertTriangle style={{
                width: 11,
                height: 11
              }} />
                  Section totals add to {sumOfSections}m — expected{' '}
                  {assessmentTotal}m
                </span>}
              {editingTotal ? <input type="number" defaultValue={assessmentTotal} onBlur={(e) => {
              setAssessmentTotal(Number(e.target.value));
              setEditingTotal(false);
            }} onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()} autoFocus style={{
              width: 70,
              fontSize: 18,
              fontWeight: 800,
              fontFamily: 'JetBrains Mono, monospace',
              textAlign: 'center',
              padding: '2px 6px',
              borderRadius: 7,
              border: '2px solid var(--brand)',
              outline: 'none',
              color: 'var(--brand)'
            }} /> : <button onClick={() => setEditingTotal(true)} style={{
              fontSize: 18,
              fontWeight: 800,
              fontFamily: 'JetBrains Mono, monospace',
              color: totalMismatch ? '#D97706' : 'var(--text)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 8px',
              borderRadius: 7
            }}>
                  {assessmentTotal}m total
                </button>}
            </div>
          </div>

          {/* Stacked bar */}
          <div style={{
          display: 'flex',
          height: 10,
          borderRadius: 5,
          overflow: 'hidden',
          gap: 2,
          marginBottom: 10
        }}>
            {sections.map((s) => <div key={s.id} style={{
            flex: s.totalMarks,
            background: s.color,
            minWidth: 2
          }} title={`${s.title}: ${s.totalMarks}m (${Math.round(s.totalMarks / assessmentTotal * 100)}%)`} />)}
            {totalMismatch && <div style={{
            flex: Math.abs(assessmentTotal - sumOfSections),
            background: 'rgba(217,119,6,0.3)',
            border: '2px dashed #D97706'
          }} />}
          </div>

          {/* Section totals row */}
          <div style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap'
        }}>
            {sections.map((s) => <div key={s.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
                <div style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: s.color
            }} />
                <span style={{
              fontSize: 12,
              color: 'var(--text2)'
            }}>
                  {s.title.split('—')[0].trim()}
                </span>
                <span style={{
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'JetBrains Mono, monospace',
              color: s.color
            }}>
                  {s.totalMarks}m
                </span>
                <span style={{
              fontSize: 11,
              color: 'var(--text3)'
            }}>
                  ({Math.round(s.totalMarks / assessmentTotal * 100)}%)
                </span>
              </div>)}
          </div>
        </div>

        {/* Sections */}
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
          {sections.map((s) => <SectionRow key={s.id} section={s} onUpdate={updateSection} totalAssessmentMarks={assessmentTotal} />)}
        </div>

        {/* Preview: if enabled, show how marks affect score */}
        {showPreview && <div style={{
        marginTop: 16,
        padding: '16px 18px',
        borderRadius: 12,
        background: '#fff',
        border: '1px solid var(--border)'
      }}>
            <div style={{
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
              <RefreshCw style={{
            width: 13,
            height: 13,
            color: 'var(--brand)'
          }} />
              Marks preview — how this distribution affects student scores
            </div>
            <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10
        }}>
              {[75, 80, 90].map((pct) => {
            const raw = Math.round(pct / 100 * assessmentTotal);
            return <div key={pct} style={{
              padding: '10px 12px',
              borderRadius: 9,
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              textAlign: 'center'
            }}>
                    <div style={{
                fontSize: 20,
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                color: pct >= 76 ? '#10B981' : '#EF4444'
              }}>
                      {pct}%
                    </div>
                    <div style={{
                fontSize: 12,
                color: 'var(--text3)',
                marginTop: 2
              }}>
                      {raw} / {assessmentTotal} marks
                    </div>
                    <div style={{
                fontSize: 11,
                fontWeight: 600,
                marginTop: 4,
                color: pct >= 76 ? '#10B981' : '#EF4444'
              }}>
                      {pct >= 76 ? 'Pass' : 'Fail'}
                    </div>
                  </div>;
          })}
            </div>
            <div style={{
          fontSize: 11,
          color: 'var(--text3)',
          marginTop: 10
        }}>
              Pass threshold: 76% ({Math.round(0.76 * assessmentTotal)} marks)
            </div>
          </div>}

        {/* Design source note */}
        <div style={{
        marginTop: 14,
        padding: '8px 12px',
        borderRadius: 8,
        background: 'rgba(109,94,212,0.04)',
        border: '1px solid rgba(109,94,212,0.12)',
        fontSize: 10,
        color: 'var(--text3)'
      }}>
          Source: marks_weightage_features.md · Phase 1 MVP (equal, manual,
          section totals, type defaults, preview) · Phase 2 (partial credit MSQ,
          negative marking, difficulty-based) · Phase 3 (Bloom's-based,
          templates, locking) built.
        </div>
      </div>
    </div>;
}