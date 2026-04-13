import React, { useState } from 'react';
import { Sparkles, TrendingDown, AlertTriangle, Users, BarChart3, Download, ChevronDown } from 'lucide-react';
// ─── SOURCE: Touro ExamSoft meeting f5d66e4c + Ed Razenbach ca5a709c
// Post-exam admin design updates:
// 1. KR-20 reliability + point-biserial + upper-27% — Mary Touro + Ed Razenbach
//    "We obviously like point-biserial between 0 and 1. Negative means weaker students got it right."
// 2. Curve options: full credit / bonus points / answer change — ExamSoft demo notes
// 3. AI remediation — Ed Razenbach: "I give it the PACRAT results by topic, it generates
//    personalised questions for each student. Completely different question sets per student."
// 4. Competency breakdown by tagging — Aarti f29a990d:
//    "After the test it can tell you: strong in logic, weak in analytical. That\'s what tagging does."
const QUESTIONS_ANALYSIS = [{
  id: 'PHR-001',
  stem: 'Which beta-blocker is cardioselective…',
  pBiserial: 0.38,
  correct: 61,
  upper27: 82,
  lower27: 42,
  status: 'good'
}, {
  id: 'PHR-002',
  stem: 'ACE inhibitors prevent angiotensin I conversion…',
  pBiserial: 0.08,
  correct: 91,
  upper27: 94,
  lower27: 88,
  status: 'flag'
}, {
  id: 'CRD-001',
  stem: 'ST elevation in II, III, aVF…',
  pBiserial: 0.41,
  correct: 55,
  upper27: 80,
  lower27: 22,
  status: 'good'
}, {
  id: 'NEU-001',
  stem: 'Slurred speech, arm weakness 45 min resolving…',
  pBiserial: -0.09,
  correct: 44,
  upper27: 38,
  lower27: 51,
  status: 'remove'
}, {
  id: 'GI-001',
  stem: 'PPI × 3 years, B12 = 180…',
  pBiserial: 0.44,
  correct: 48,
  upper27: 78,
  lower27: 18,
  status: 'good'
}, {
  id: 'PHR-003',
  stem: 'Warfarin + amiodarone, expected INR change…',
  pBiserial: 0.12,
  correct: 82,
  upper27: 87,
  lower27: 75,
  status: 'easy'
}];
const COMPETENCY_SCORES = [{
  area: 'Pharmacology',
  avg: 74,
  national: 78,
  gap: -4
}, {
  area: 'Cardiovascular',
  avg: 81,
  national: 77,
  gap: +4
}, {
  area: 'Neurology',
  avg: 58,
  national: 72,
  gap: -14
}, {
  area: 'GI / Hepatic',
  avg: 66,
  national: 70,
  gap: -4
}, {
  area: 'Pulmonology',
  avg: 79,
  national: 74,
  gap: +5
}];
const STUDENTS_BELOW = [{
  name: 'Marcus T.',
  score: 61,
  weakAreas: ['Neurology', 'Pharmacology'],
  watchListed: true
}, {
  name: 'Sarah K.',
  score: 68,
  weakAreas: ['Neurology'],
  watchListed: true
}, {
  name: 'Elena R.',
  score: 72,
  weakAreas: ['GI / Hepatic'],
  watchListed: false
}];
type CurveMode = null | 'full-credit' | 'bonus' | 'answer-change';
export function PostExamPhase() {
  const [curveMode, setCurveMode] = useState<CurveMode>(null);
  const [bonusPts, setBonusPts] = useState(2);
  const [newAnswer, setNewAnswer] = useState('B');
  const [remStudentIdx, setRemStudentIdx] = useState<number | null>(null);
  const [aiGenerating, setAIGenerating] = useState(false);
  const [aiDone, setAIDone] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'psychometrics' | 'competency' | 'remediation' | 'curves'>('psychometrics');
  const runRemediation = (idx: number) => {
    setRemStudentIdx(idx);
    setAIGenerating(true);
    setTimeout(() => {
      setAIGenerating(false);
      setAIDone((prev) => [...prev, idx]);
    }, 1600);
  };
  return <div style={{
    flex: 1,
    overflowY: 'auto',
    padding: 24,
    background: 'var(--surface2)'
  }}>
      <div style={{
      maxWidth: 900,
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
            fontFamily: 'var(--font-heading)'
          }}>
              Post-exam analysis
            </h2>
            <p style={{
            fontSize: 12,
            color: 'var(--text3)',
            marginTop: 4
          }}>
              CV Pharmacology — Midterm 2026 · 87 students · 42 questions ·
              scored Apr 17
            </p>
          </div>
          <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          padding: '7px 14px',
          borderRadius: 8,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text2)',
          cursor: 'pointer'
        }}>
            <Download style={{
            width: 13,
            height: 13
          }} />{' '}
            Export report
          </button>
        </div>

        {/* Score summary */}
        <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: 12,
        marginBottom: 20
      }}>
          {[{
          label: 'Class avg',
          val: '74%',
          color: '#D97706',
          sub: 'vs 76% threshold'
        }, {
          label: 'KR-20 reliability',
          val: '0.84',
          color: '#10B981',
          sub: '≥ 0.80 = good'
        }, {
          label: 'Flag for review',
          val: '2 items',
          color: '#EF4444',
          sub: 'low discrimination'
        }, {
          label: 'Below threshold',
          val: '3 students',
          color: '#EF4444',
          sub: '< 76% passing'
        }].map((k) => <div key={k.label} style={{
          padding: 14,
          borderRadius: 10,
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>
              <div style={{
            fontSize: 11,
            color: 'var(--text3)',
            marginBottom: 4
          }}>
                {k.label}
              </div>
              <div style={{
            fontSize: 20,
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: k.color
          }}>
                {k.val}
              </div>
              <div style={{
            fontSize: 11,
            color: 'var(--text3)'
          }}>
                {k.sub}
              </div>
            </div>)}
        </div>

        {/* Tabs */}
        <div style={{
        display: 'flex',
        gap: 4,
        marginBottom: 20,
        padding: 4,
        background: 'var(--surface)',
        borderRadius: 10,
        border: '1px solid var(--border)',
        width: 'fit-content'
      }}>
          {(['psychometrics', 'competency', 'remediation', 'curves'] as const).map((t) => <button key={t} onClick={() => setActiveTab(t)} style={{
          fontSize: 12,
          fontWeight: 600,
          padding: '6px 14px',
          borderRadius: 7,
          background: activeTab === t ? 'var(--brand)' : 'transparent',
          color: activeTab === t ? 'white' : 'var(--text3)',
          border: 'none',
          cursor: 'pointer',
          textTransform: 'capitalize'
        }}>
              {t}
            </button>)}
        </div>

        {/* PSYCHOMETRICS TAB — KR-20, point-biserial, upper-27% */}
        {/* Source: Mary Touro f5d66e4c + Ed Razenbach ca5a709c */}
        {activeTab === 'psychometrics' && <div>
            <div style={{
          fontSize: 12,
          color: 'var(--text3)',
          marginBottom: 12
        }}>
              Point-biserial &lt; 0.15 → flag for revision · Negative → remove
              (weaker students scored higher) · Correct % &gt; 90 or &lt; 30 →
              check difficulty calibration
            </div>
            <div style={{
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid var(--border)'
        }}>
              <div style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 100px 100px 80px 80px 80px',
            gap: 0,
            padding: '8px 16px',
            background: 'var(--surface2)',
            borderBottom: '1px solid var(--border)',
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text3)'
          }}>
                <span>ID</span>
                <span>Stem</span>
                <span>p-Biserial</span>
                <span>Correct %</span>
                <span>Upper 27</span>
                <span>Lower 27</span>
                <span>Action</span>
              </div>
              {QUESTIONS_ANALYSIS.map((q, i) => {
            const statusColors: Record<string, {
              bg: string;
              color: string;
              label: string;
            }> = {
              good: {
                bg: 'rgba(16,185,129,0.08)',
                color: '#10B981',
                label: 'Good'
              },
              flag: {
                bg: 'rgba(217,119,6,0.1)',
                color: '#D97706',
                label: 'Too easy'
              },
              remove: {
                bg: 'rgba(239,68,68,0.1)',
                color: '#EF4444',
                label: 'Remove'
              },
              easy: {
                bg: 'rgba(99,102,241,0.08)',
                color: '#6366F1',
                label: 'Low disc.'
              }
            };
            const sc = statusColors[q.status];
            return <div key={q.id} style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 100px 100px 80px 80px 80px',
              gap: 0,
              padding: '10px 16px',
              borderBottom: i < QUESTIONS_ANALYSIS.length - 1 ? '1px solid var(--border)' : 'none',
              background: q.status === 'remove' ? 'rgba(239,68,68,0.02)' : 'var(--surface)',
              alignItems: 'center'
            }}>
                    <span style={{
                fontSize: 11,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'var(--brand)'
              }}>
                      {q.id}
                    </span>
                    <span style={{
                fontSize: 12,
                color: 'var(--text2)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                paddingRight: 12
              }}>
                      {q.stem}
                    </span>
                    <span style={{
                fontSize: 12,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: q.pBiserial < 0 ? '#EF4444' : q.pBiserial < 0.15 ? '#D97706' : '#10B981'
              }}>
                      {q.pBiserial.toFixed(2)}
                    </span>
                    <span style={{
                fontSize: 12,
                fontFamily: 'monospace',
                color: 'var(--text)'
              }}>
                      {q.correct}%
                    </span>
                    <span style={{
                fontSize: 12,
                fontFamily: 'monospace',
                color: 'var(--text3)'
              }}>
                      {q.upper27}%
                    </span>
                    <span style={{
                fontSize: 12,
                fontFamily: 'monospace',
                color: 'var(--text3)'
              }}>
                      {q.lower27}%
                    </span>
                    <span style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 8,
                background: sc.bg,
                color: sc.color
              }}>
                      {sc.label}
                    </span>
                  </div>;
          })}
            </div>
          </div>}

        {/* COMPETENCY TAB — Aarti f29a990d: tagging drives post-exam competency analytics */}
        {activeTab === 'competency' && <div>
            <div style={{
          fontSize: 12,
          color: 'var(--text3)',
          marginBottom: 12
        }}>
              Class performance by CATEGORY tag — mapped to PAEA accreditation
              competency areas
            </div>
            <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
              {COMPETENCY_SCORES.map((c) => <div key={c.area} style={{
            padding: '14px 16px',
            borderRadius: 10,
            background: 'var(--surface)',
            border: '1px solid var(--border)'
          }}>
                  <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 8
            }}>
                    <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text)',
                width: 160,
                flexShrink: 0
              }}>
                      {c.area}
                    </span>
                    <div style={{
                flex: 1,
                height: 6,
                background: 'var(--border)',
                borderRadius: 3,
                overflow: 'hidden'
              }}>
                      <div style={{
                  height: '100%',
                  width: `${c.avg}%`,
                  background: c.gap < -8 ? '#EF4444' : c.gap < 0 ? '#D97706' : '#10B981',
                  borderRadius: 3
                }} />
                    </div>
                    <span style={{
                fontSize: 14,
                fontWeight: 800,
                fontFamily: 'monospace',
                color: c.gap < -8 ? '#EF4444' : c.gap < 0 ? '#D97706' : '#10B981',
                width: 44,
                textAlign: 'right'
              }}>
                      {c.avg}%
                    </span>
                    <span style={{
                fontSize: 11,
                color: 'var(--text3)',
                width: 90
              }}>
                      National: {c.national}%
                    </span>
                    <span style={{
                fontSize: 11,
                fontWeight: 700,
                width: 52,
                textAlign: 'right',
                color: c.gap < 0 ? '#EF4444' : '#10B981'
              }}>
                      {c.gap > 0 ? '+' : ''}
                      {c.gap}%
                    </span>
                  </div>
                  {c.gap < -8 && <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              color: '#EF4444',
              padding: '5px 8px',
              background: 'rgba(239,68,68,0.06)',
              borderRadius: 6
            }}>
                      <AlertTriangle style={{
                width: 11,
                height: 11
              }} />
                      Significant gap vs national mean — consider curriculum
                      review for {c.area}
                    </div>}
                </div>)}
            </div>
          </div>}

        {/* REMEDIATION TAB — Ed Razenbach ca5a709c: AI generates personalised questions per student */}
        {/* "Two students failed family medicine but each got a completely different question set from me." */}
        {activeTab === 'remediation' && <div>
            <div style={{
          padding: '12px 14px',
          borderRadius: 10,
          background: 'rgba(124,58,237,0.05)',
          border: '1px solid rgba(124,58,237,0.18)',
          marginBottom: 16
        }}>
              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            marginBottom: 5
          }}>
                <Sparkles style={{
              width: 14,
              height: 14,
              color: '#7C3AED'
            }} />
                <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#7C3AED'
            }}>
                  AI remediation (admin only)
                </span>
              </div>
              <p style={{
            fontSize: 12,
            color: 'var(--text2)',
            margin: 0,
            lineHeight: 1.6
          }}>
                Based on each student's weak competency areas, AI generates a
                personalised question set targeting exactly what they need. Two
                students can fail the same exam but receive entirely different
                remediation questions.
                <span style={{
              color: '#7C3AED',
              fontWeight: 600
            }}>
                  {' '}
                  All questions require your review before sending.
                </span>
              </p>
            </div>
            <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
              {STUDENTS_BELOW.map((s, i) => <div key={s.name} style={{
            padding: '14px 16px',
            borderRadius: 10,
            background: 'var(--surface)',
            border: `1px solid ${s.watchListed ? 'rgba(239,68,68,0.25)' : 'var(--border)'}`,
            borderLeft: `3px solid ${s.watchListed ? '#EF4444' : 'var(--border)'}`
          }}>
                  <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 8
            }}>
                    <div style={{
                flex: 1
              }}>
                      <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  marginBottom: 3
                }}>
                        <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--text)'
                  }}>
                          {s.name}
                        </span>
                        {s.watchListed && <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 6,
                    background: 'rgba(239,68,68,0.1)',
                    color: '#EF4444'
                  }}>
                            Watch-list
                          </span>}
                        <span style={{
                    fontSize: 13,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: s.score < 70 ? '#EF4444' : '#D97706'
                  }}>
                          {s.score}%
                        </span>
                      </div>
                      <div style={{
                  display: 'flex',
                  gap: 5,
                  flexWrap: 'wrap'
                }}>
                        {s.weakAreas.map((a) => <span key={a} style={{
                    fontSize: 11,
                    padding: '1px 7px',
                    borderRadius: 8,
                    background: 'rgba(239,68,68,0.08)',
                    color: '#EF4444'
                  }}>
                            Weak: {a}
                          </span>)}
                      </div>
                    </div>
                    <button onClick={() => !aiDone.includes(i) && runRemediation(i)} disabled={aiGenerating && remStudentIdx === i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                padding: '7px 14px',
                borderRadius: 8,
                background: aiDone.includes(i) ? 'rgba(16,185,129,0.1)' : 'rgba(124,58,237,0.1)',
                color: aiDone.includes(i) ? '#10B981' : '#7C3AED',
                border: 'none',
                cursor: aiDone.includes(i) ? 'default' : 'pointer'
              }}>
                      {aiDone.includes(i) ? <>✓ 20 questions ready — review</> : aiGenerating && remStudentIdx === i ? 'Generating…' : <>
                          <Sparkles style={{
                    width: 12,
                    height: 12
                  }} />
                          Generate remediation set
                        </>}
                    </button>
                  </div>
                  {aiDone.includes(i) && <div style={{
              padding: '8px 12px',
              borderRadius: 8,
              background: 'rgba(16,185,129,0.05)',
              border: '1px solid rgba(16,185,129,0.2)',
              fontSize: 11,
              color: 'var(--text2)'
            }}>
                      20 questions generated targeting {s.weakAreas.join(' + ')}{' '}
                      · Bloom's levels 2–3 · not used in previous 2 exams ·
                      awaiting your review before sending
                    </div>}
                </div>)}
            </div>
          </div>}

        {/* CURVES TAB — ExamSoft demo notes: full credit / bonus / answer change */}
        {activeTab === 'curves' && <div>
            <div style={{
          fontSize: 12,
          color: 'var(--text3)',
          marginBottom: 14
        }}>
              Apply a scoring adjustment to this exam. All changes are logged in
              the audit trail and reversible before results are released.
            </div>
            <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
              {/* Option 1: Full credit */}
              <div onClick={() => setCurveMode(curveMode === 'full-credit' ? null : 'full-credit')} style={{
            padding: '14px 16px',
            borderRadius: 10,
            background: 'var(--surface)',
            border: `1.5px solid ${curveMode === 'full-credit' ? 'var(--brand)' : 'var(--border)'}`,
            cursor: 'pointer'
          }}>
                <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
                  <div style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                border: `2px solid ${curveMode === 'full-credit' ? 'var(--brand)' : 'var(--border2)'}`,
                background: curveMode === 'full-credit' ? 'var(--brand)' : 'transparent',
                flexShrink: 0
              }} />
                  <div>
                    <div style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--text)'
                }}>
                      Give full credit to all students
                    </div>
                    <div style={{
                  fontSize: 11,
                  color: 'var(--text3)'
                }}>
                      Removes a specific question entirely — every student
                      receives full credit regardless of their answer
                    </div>
                  </div>
                </div>
                {curveMode === 'full-credit' && <div style={{
              marginTop: 12
            }}>
                    <label style={{
                fontSize: 11,
                color: 'var(--text3)',
                marginBottom: 5,
                display: 'block'
              }}>
                      Select question to remove:
                    </label>
                    <select style={{
                fontSize: 12,
                padding: '5px 10px',
                borderRadius: 7,
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                outline: 'none',
                width: 280
              }}>
                      {QUESTIONS_ANALYSIS.filter((q) => q.status !== 'good').map((q) => <option key={q.id}>
                          {q.id} — {q.stem.slice(0, 40)}…
                        </option>)}
                    </select>
                    <div style={{
                marginTop: 8,
                fontSize: 11,
                color: '#D97706'
              }}>
                      ⚠ This will recalculate all student scores. Cannot be
                      undone after results are released.
                    </div>
                  </div>}
              </div>

              {/* Option 2: Bonus points */}
              <div onClick={() => setCurveMode(curveMode === 'bonus' ? null : 'bonus')} style={{
            padding: '14px 16px',
            borderRadius: 10,
            background: 'var(--surface)',
            border: `1.5px solid ${curveMode === 'bonus' ? 'var(--brand)' : 'var(--border)'}`,
            cursor: 'pointer'
          }}>
                <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
                  <div style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                border: `2px solid ${curveMode === 'bonus' ? 'var(--brand)' : 'var(--border2)'}`,
                background: curveMode === 'bonus' ? 'var(--brand)' : 'transparent',
                flexShrink: 0
              }} />
                  <div>
                    <div style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--text)'
                }}>
                      Add bonus points to all scores
                    </div>
                    <div style={{
                  fontSize: 11,
                  color: 'var(--text3)'
                }}>
                      Adds a flat number of points to every student's raw score
                    </div>
                  </div>
                </div>
                {curveMode === 'bonus' && <div style={{
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
                    <label style={{
                fontSize: 12,
                color: 'var(--text2)'
              }}>
                      Bonus points:
                    </label>
                    <input type="number" value={bonusPts} onChange={(e) => setBonusPts(Number(e.target.value))} min={1} max={10} style={{
                width: 64,
                fontSize: 14,
                fontFamily: 'monospace',
                fontWeight: 700,
                padding: '5px 10px',
                borderRadius: 7,
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                outline: 'none',
                textAlign: 'center'
              }} />
                    <span style={{
                fontSize: 12,
                color: 'var(--text3)'
              }}>
                      pts — new class avg:{' '}
                      <strong style={{
                  color: '#10B981'
                }}>
                        {74 + bonusPts}%
                      </strong>
                    </span>
                  </div>}
              </div>

              {/* Option 3: Answer key change */}
              <div onClick={() => setCurveMode(curveMode === 'answer-change' ? null : 'answer-change')} style={{
            padding: '14px 16px',
            borderRadius: 10,
            background: 'var(--surface)',
            border: `1.5px solid ${curveMode === 'answer-change' ? 'var(--brand)' : 'var(--border)'}`,
            cursor: 'pointer'
          }}>
                <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
                  <div style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                border: `2px solid ${curveMode === 'answer-change' ? 'var(--brand)' : 'var(--border2)'}`,
                background: curveMode === 'answer-change' ? 'var(--brand)' : 'transparent',
                flexShrink: 0
              }} />
                  <div>
                    <div style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--text)'
                }}>
                      Change answer key
                    </div>
                    <div style={{
                  fontSize: 11,
                  color: 'var(--text3)'
                }}>
                      Corrects a wrong answer key — rescores all students
                      against the new correct answer
                    </div>
                  </div>
                </div>
                {curveMode === 'answer-change' && <div style={{
              marginTop: 12,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-end'
            }}>
                    <div>
                      <label style={{
                  fontSize: 11,
                  color: 'var(--text3)',
                  marginBottom: 4,
                  display: 'block'
                }}>
                        Question:
                      </label>
                      <select style={{
                  fontSize: 12,
                  padding: '5px 10px',
                  borderRadius: 7,
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  outline: 'none'
                }}>
                        {QUESTIONS_ANALYSIS.map((q) => <option key={q.id}>{q.id}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{
                  fontSize: 11,
                  color: 'var(--text3)',
                  marginBottom: 4,
                  display: 'block'
                }}>
                        New correct answer:
                      </label>
                      <div style={{
                  display: 'flex',
                  gap: 5
                }}>
                        {['A', 'B', 'C', 'D'].map((opt) => <button key={opt} onClick={(e) => {
                    e.stopPropagation();
                    setNewAnswer(opt);
                  }} style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    background: newAnswer === opt ? 'var(--brand)' : 'var(--surface2)',
                    color: newAnswer === opt ? 'white' : 'var(--text2)',
                    border: `1px solid ${newAnswer === opt ? 'var(--brand)' : 'var(--border)'}`,
                    cursor: 'pointer'
                  }}>
                            {opt}
                          </button>)}
                      </div>
                    </div>
                  </div>}
              </div>
            </div>

            {curveMode && <div style={{
          marginTop: 16,
          display: 'flex',
          gap: 8
        }}>
                <button style={{
            fontSize: 13,
            fontWeight: 600,
            padding: '8px 18px',
            borderRadius: 9,
            background: 'var(--brand)',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}>
                  Apply adjustment — preview scores
                </button>
                <button onClick={() => setCurveMode(null)} style={{
            fontSize: 13,
            padding: '8px 14px',
            borderRadius: 9,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text2)',
            cursor: 'pointer'
          }}>
                  Cancel
                </button>
              </div>}
          </div>}
      </div>
    </div>;
}