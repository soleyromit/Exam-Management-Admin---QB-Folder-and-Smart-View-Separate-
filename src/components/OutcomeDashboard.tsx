import React, { useState } from 'react';
import { Download, TrendingUp, TrendingDown, AlertTriangle, ChevronDown } from 'lucide-react';
const BLUEPRINT = [{
  area: 'History Taking & Physical Exam',
  target: 20,
  actual: 22,
  color: '#7C3AED'
}, {
  area: 'Clinical Reasoning & Diagnosis',
  target: 25,
  actual: 19,
  color: '#E31C79',
  gap: true
}, {
  area: 'Pharmacology & Therapeutics',
  target: 20,
  actual: 23,
  color: '#0891B2'
}, {
  area: 'Medical Knowledge — Systems',
  target: 15,
  actual: 14,
  color: '#059669'
}, {
  area: 'Procedural & Clinical Skills',
  target: 10,
  actual: 8,
  color: '#D97706',
  gap: true
}, {
  area: 'Preventive Medicine & Public Health',
  target: 5,
  actual: 7,
  color: '#6366F1'
}, {
  area: 'Professionalism & Ethics',
  target: 5,
  actual: 7,
  color: '#14B8A6'
}];
const BLOOMS_DIST = [{
  level: 'Remember',
  pct: 18,
  target: 10,
  color: '#6366F1'
}, {
  level: 'Understand',
  pct: 22,
  target: 15,
  color: '#3B82F6'
}, {
  level: 'Apply',
  pct: 35,
  target: 40,
  color: '#7C3AED'
}, {
  level: 'Analyze',
  pct: 16,
  target: 25,
  color: '#D97706',
  gap: true
}, {
  level: 'Evaluate',
  pct: 7,
  target: 8,
  color: '#EF4444'
}, {
  level: 'Create',
  pct: 2,
  target: 2,
  color: '#10B981'
}];
const COHORT_TREND = [{
  cohort: '2024',
  eor: 76.2,
  pance: 89
}, {
  cohort: '2025',
  eor: 74.8,
  pance: 87
}, {
  cohort: '2026',
  eor: 77.1,
  pance: null
}, {
  cohort: '2027 (current)',
  eor: 74.0,
  pance: null
}];
const COMPETENCIES = [{
  code: 'PC-1',
  desc: 'History & Physical',
  covered: 94,
  trend: 'up'
}, {
  code: 'PC-2',
  desc: 'Clinical Reasoning',
  covered: 71,
  trend: 'down',
  gap: true
}, {
  code: 'PC-3',
  desc: 'Therapeutics',
  covered: 88,
  trend: 'up'
}, {
  code: 'PC-4',
  desc: 'Procedures',
  covered: 62,
  trend: 'down',
  gap: true
}, {
  code: 'ICS-1',
  desc: 'Communication',
  covered: 55,
  trend: 'down',
  gap: true
}, {
  code: 'PBLI-1',
  desc: 'Evidence-Based Practice',
  covered: 79,
  trend: 'up'
}, {
  code: 'PROF-1',
  desc: 'Professionalism',
  covered: 91,
  trend: 'up'
}];
export function OutcomeDashboard() {
  const [tab, setTab] = useState<'blueprint' | 'blooms' | 'competency' | 'cohort'>('blueprint');
  return <div className="flex-1 overflow-auto" style={{
    background: 'var(--surface2)'
  }}>
      <div className="max-w-5xl mx-auto p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold" style={{
            color: 'var(--text)',
            fontFamily: 'var(--font-heading)'
          }}>
              Outcome & Accreditation Dashboard
            </h2>
            <p className="text-sm" style={{
            color: 'var(--text3)'
          }}>
              ARC-PA Self-Study · Class of 2027 · Academic Year 2025–2026
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text2)'
          }}>
              <Download className="w-4 h-4" />
              Export ARC-PA report
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3">
          {[{
          label: 'Blueprint coverage',
          val: '71%',
          sub: '5 of 7 areas on target',
          color: '#D97706',
          down: true
        }, {
          label: "Avg Bloom's level",
          val: '2.8',
          sub: 'Target ≥ 3.0 (Apply)',
          color: '#D97706',
          down: true
        }, {
          label: 'Competencies covered',
          val: '7 / 9',
          sub: '2 below 70% threshold',
          color: '#EF4444',
          down: true
        }, {
          label: 'Cohort EOR avg',
          val: '74%',
          sub: 'vs 77% national mean',
          color: '#D97706',
          down: true
        }].map((k, i) => <div key={i} className="p-4 rounded-xl" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl font-bold mono" style={{
              color: k.color,
              fontFamily: 'var(--font-heading)'
            }}>
                  {k.val}
                </span>
                {k.down ? <TrendingDown className="w-4 h-4" style={{
              color: '#EF4444'
            }} /> : <TrendingUp className="w-4 h-4" style={{
              color: '#10B981'
            }} />}
              </div>
              <div className="text-xs font-medium" style={{
            color: 'var(--text)'
          }}>
                {k.label}
              </div>
              <div className="text-xs" style={{
            color: 'var(--text3)'
          }}>
                {k.sub}
              </div>
            </div>)}
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{
        borderColor: 'var(--border)'
      }}>
          {[{
          id: 'blueprint',
          label: 'Blueprint coverage'
        }, {
          id: 'blooms',
          label: "Bloom's distribution"
        }, {
          id: 'competency',
          label: 'Competency map'
        }, {
          id: 'cohort',
          label: 'Cohort trends'
        }].map((t) => <button key={t.id} onClick={() => setTab(t.id as any)} className="px-5 py-2.5 text-sm font-medium" style={{
          color: tab === t.id ? 'var(--brand)' : 'var(--text3)',
          borderBottom: `2px solid ${tab === t.id ? 'var(--brand)' : 'transparent'}`,
          marginBottom: -1
        }}>
              {t.label}
            </button>)}
        </div>

        {/* BLUEPRINT */}
        {tab === 'blueprint' && <div className="space-y-3">
            <div className="p-3 rounded-xl" style={{
          background: 'rgba(217,119,6,0.06)',
          border: '1px solid rgba(217,119,6,0.2)'
        }}>
              <p className="text-xs" style={{
            color: 'var(--text2)'
          }}>
                NCCPA / PAEA blueprint targets for PA program. Questions must be
                distributed across all 7 content areas within ±3% of target.
                Areas in red are under-represented.
              </p>
            </div>
            {BLUEPRINT.map((row, i) => <div key={i} className="p-4 rounded-xl" style={{
          background: 'var(--surface)',
          border: `1px solid ${row.gap ? 'rgba(239,68,68,0.25)' : 'var(--border)'}`,
          background: row.gap ? 'rgba(239,68,68,0.02)' : 'var(--surface)'
        }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{
              color: 'var(--text)'
            }}>
                    {row.area}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{
                color: 'var(--text3)'
              }}>
                      Target {row.target}%
                    </span>
                    <span className="text-sm font-bold mono" style={{
                color: row.gap ? '#EF4444' : '#10B981'
              }}>
                      {row.actual}% actual
                    </span>
                    {row.gap && <span className="text-xs px-2 py-0.5 rounded-full" style={{
                background: 'rgba(239,68,68,0.1)',
                color: '#EF4444',
                fontWeight: 700
              }}>
                        Under by {row.target - row.actual}%
                      </span>}
                  </div>
                </div>
                <div className="relative h-3 rounded-full overflow-hidden" style={{
            background: 'var(--surface3)'
          }}>
                  <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{
              width: `${row.actual}%`,
              background: row.gap ? '#EF4444' : row.color
            }} />
                  {/* Target line */}
                  <div className="absolute inset-y-0 w-0.5" style={{
              left: `${row.target}%`,
              background: 'rgba(0,0,0,0.25)'
            }} />
                </div>
              </div>)}
            <button className="w-full py-2.5 rounded-xl text-sm font-medium text-white" style={{
          background: 'var(--brand)'
        }}>
              ✦ AI: Generate questions to fill blueprint gaps
            </button>
          </div>}

        {/* BLOOMS */}
        {tab === 'blooms' && <div className="space-y-4">
            <div className="p-3 rounded-xl" style={{
          background: 'rgba(124,58,237,0.06)',
          border: '1px solid rgba(124,58,237,0.15)'
        }}>
              <p className="text-xs" style={{
            color: 'var(--text2)'
          }}>
                ARC-PA expects at least 40% of questions at Apply (Level 3) or
                above. Current distribution skews low — too many
                Remember/Understand questions.
              </p>
            </div>
            <div className="space-y-3">
              {BLOOMS_DIST.map((b, i) => <div key={i} className="p-4 rounded-xl" style={{
            background: b.gap ? 'rgba(239,68,68,0.02)' : 'var(--surface)',
            border: `1px solid ${b.gap ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`
          }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold w-5" style={{
                  color: b.color
                }}>
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium" style={{
                  color: 'var(--text)'
                }}>
                        {b.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{
                  color: 'var(--text3)'
                }}>
                        Target {b.target}%
                      </span>
                      <span className="text-sm font-bold mono" style={{
                  color: b.gap ? '#EF4444' : b.pct >= b.target ? '#10B981' : 'var(--text2)'
                }}>
                        {b.pct}%
                      </span>
                      {b.gap && <span className="text-xs px-2 py-0.5 rounded-full" style={{
                  background: 'rgba(239,68,68,0.1)',
                  color: '#EF4444'
                }}>
                          Gap −{b.target - b.pct}%
                        </span>}
                    </div>
                  </div>
                  <div className="relative h-3 rounded-full overflow-hidden" style={{
              background: 'var(--surface3)'
            }}>
                    <div style={{
                width: `${b.pct}%`,
                height: '100%',
                background: b.gap ? '#EF4444' : b.color,
                borderRadius: 4
              }} />
                    <div className="absolute inset-y-0 w-0.5" style={{
                left: `${b.target}%`,
                background: 'rgba(0,0,0,0.2)'
              }} />
                  </div>
                </div>)}
            </div>
          </div>}

        {/* COMPETENCY */}
        {tab === 'competency' && <div className="space-y-3">
            <div className="p-3 rounded-xl" style={{
          background: 'rgba(227,28,121,0.05)',
          border: '1px solid rgba(227,28,121,0.15)'
        }}>
              <p className="text-xs" style={{
            color: 'var(--text2)'
          }}>
                ARC-PA requires evidence of assessment across all 9 PA
                competency domains. 3 domains are below 70% coverage — flag for
                self-study narrative.
              </p>
            </div>
            {COMPETENCIES.map((c, i) => <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{
          background: c.gap ? 'rgba(239,68,68,0.03)' : 'var(--surface)',
          border: `1px solid ${c.gap ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`
        }}>
                <span className="text-xs mono font-bold w-14 flex-shrink-0" style={{
            color: 'var(--brand)'
          }}>
                  {c.code}
                </span>
                <span className="text-sm flex-1" style={{
            color: 'var(--text)'
          }}>
                  {c.desc}
                </span>
                <div className="w-32 h-2 rounded-full overflow-hidden flex-shrink-0" style={{
            background: 'var(--surface3)'
          }}>
                  <div style={{
              width: `${c.covered}%`,
              height: '100%',
              background: c.gap ? '#EF4444' : '#10B981'
            }} />
                </div>
                <span className="text-sm font-bold mono w-10 text-right flex-shrink-0" style={{
            color: c.gap ? '#EF4444' : '#10B981'
          }}>
                  {c.covered}%
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{
            background: c.gap ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
            color: c.gap ? '#EF4444' : '#10B981'
          }}>
                  {c.gap ? 'Below threshold' : 'On target'}
                </span>
                {c.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 flex-shrink-0" style={{
            color: '#EF4444'
          }} />}
                {c.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" style={{
            color: '#10B981'
          }} />}
              </div>)}
          </div>}

        {/* COHORT */}
        {tab === 'cohort' && <div className="space-y-4">
            <div className="rounded-xl overflow-hidden" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>
              <div className="px-4 py-3" style={{
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface2)'
          }}>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{
              color: 'var(--text3)'
            }}>
                  EOR avg score by cohort
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-end gap-6 h-32">
                  {COHORT_TREND.map((c, i) => {
                const h = (c.eor - 60) / 30 * 100;
                const isCurrentDown = c.cohort.includes('current') && c.eor < 76;
                return <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <span className="text-sm font-bold mono" style={{
                    color: isCurrentDown ? '#EF4444' : '#10B981'
                  }}>
                          {c.eor}%
                        </span>
                        <div className="w-full rounded-t-lg" style={{
                    height: `${h}%`,
                    minHeight: 8,
                    background: isCurrentDown ? 'rgba(239,68,68,0.7)' : 'rgba(16,185,129,0.7)'
                  }} />
                        <span className="text-xs text-center" style={{
                    color: 'var(--text3)'
                  }}>
                          {c.cohort}
                        </span>
                      </div>;
              })}
                </div>
                <div className="mt-3 pt-3" style={{
              borderTop: '1px solid var(--border)'
            }}>
                  <div className="flex items-center gap-2 text-xs" style={{
                color: 'var(--text3)'
              }}>
                    <div className="w-3 h-3 rounded" style={{
                  background: 'rgba(239,68,68,0.4)'
                }} />
                    <span>Below 76% national threshold</span>
                    <div className="w-3 h-3 rounded ml-4" style={{
                  background: 'rgba(16,185,129,0.4)'
                }} />
                    <span>Above threshold</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl" style={{
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.2)'
        }}>
              <p className="text-sm font-semibold mb-1" style={{
            color: 'var(--text)'
          }}>
                ✦ AI insight
              </p>
              <p className="text-sm" style={{
            color: 'var(--text2)'
          }}>
                Class of 2027 EOR average (74.0%) is trending 3.1 points below
                the 2026 cohort at the same stage. Family Medicine and
                Pediatrics are the primary drivers. Consider targeted review
                sessions for these specialties before the next EOR window.
              </p>
            </div>
          </div>}
      </div>
    </div>;
}