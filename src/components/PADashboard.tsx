import React, { useState, Fragment } from 'react';
import { TrendingUp, TrendingDown, Upload, Users, AlertTriangle, Check, Sparkles } from 'lucide-react';
const EOR_SPECIALTIES = [{
  name: 'Emergency Medicine',
  raw: 412,
  nat: 404,
  sd: 28,
  z: 0.29,
  pass: true
}, {
  name: 'Family / Internal Med.',
  raw: 378,
  nat: 392,
  sd: 24,
  z: -0.58,
  pass: false
}, {
  name: 'Behavioral Health',
  raw: 391,
  nat: 385,
  sd: 22,
  z: 0.27,
  pass: true
}, {
  name: 'Pediatrics',
  raw: 356,
  nat: 374,
  sd: 26,
  z: -0.69,
  pass: false
}, {
  name: 'Surgery',
  raw: 401,
  nat: 398,
  sd: 30,
  z: 0.1,
  pass: true
}, {
  name: "Women's Health",
  raw: 382,
  nat: 388,
  sd: 20,
  z: -0.3,
  pass: true
}, {
  name: 'End of Curriculum (EOC)',
  raw: 387,
  nat: 392,
  sd: 25,
  z: -0.2,
  pass: true
}];
const COHORT_STUDENTS = [{
  name: 'Sarah Johnson',
  gpa: 3.7,
  pacrat1Z: 0.42,
  pacrat2Z: 0.38,
  eorAvgZ: 0.22,
  pancePredictor: 84,
  risk: 'On track'
}, {
  name: 'Marcus Chen',
  gpa: 3.1,
  pacrat1Z: -0.18,
  pacrat2Z: -0.41,
  eorAvgZ: -0.82,
  pancePredictor: 67,
  risk: 'At risk'
}, {
  name: 'Priya Patel',
  gpa: 3.4,
  pacrat1Z: 0.1,
  pacrat2Z: -0.22,
  eorAvgZ: -0.44,
  pancePredictor: 73,
  risk: 'Borderline'
}, {
  name: 'James Wilson',
  gpa: 3.9,
  pacrat1Z: 0.71,
  pacrat2Z: 0.65,
  eorAvgZ: 0.58,
  pancePredictor: 91,
  risk: 'On track'
}, {
  name: 'Elena Rodriguez',
  gpa: 3.5,
  pacrat1Z: 0.22,
  pacrat2Z: 0.15,
  eorAvgZ: 0.18,
  pancePredictor: 78,
  risk: 'On track'
}, {
  name: 'David Kim',
  gpa: 2.9,
  pacrat1Z: -0.55,
  pacrat2Z: -0.71,
  eorAvgZ: -1.12,
  pancePredictor: 58,
  risk: 'At risk'
}];
const RISK_COLORS: Record<string, {
  bg: string;
  text: string;
  border: string;
}> = {
  'On track': {
    bg: 'rgba(16,185,129,0.1)',
    text: '#10B981',
    border: 'rgba(16,185,129,0.2)'
  },
  Borderline: {
    bg: 'rgba(245,158,11,0.1)',
    text: '#D97706',
    border: 'rgba(245,158,11,0.2)'
  },
  'At risk': {
    bg: 'rgba(239,68,68,0.1)',
    text: '#EF4444',
    border: 'rgba(239,68,68,0.2)'
  }
};
function PanceGauge({
  score


}: {score: number;}) {
  const pct = Math.max(0, Math.min(100, (score - 50) / 50 * 100));
  const color = score >= 80 ? '#10B981' : score >= 70 ? '#D97706' : '#EF4444';
  return <div style={{
    marginTop: 8
  }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs" style={{
        color: 'var(--text3)'
      }}>
          At risk
        </span>
        <span className="text-xs font-bold mono" style={{
        color
      }}>
          {score}
        </span>
        <span className="text-xs" style={{
        color: 'var(--text3)'
      }}>
          Ready
        </span>
      </div>
      <div style={{
      height: 8,
      borderRadius: 4,
      background: 'var(--surface3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
        <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        width: `${pct}%`,
        background: color,
        borderRadius: 4
      }} />
        {/* Benchmark at 75 */}
        <div style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        width: 2,
        height: '100%',
        background: '#3B82F6',
        opacity: 0.7
      }} title="75 benchmark" />
      </div>
      <div className="flex justify-end mt-1">
        <span className="text-xs" style={{
        color: '#3B82F6'
      }}>
          75 = good passing chance
        </span>
      </div>
    </div>;
}
export function PADashboard() {
  const [view, setView] = useState<'cohort' | 'individual' | 'import' | 'pance'>('cohort');
  const [selectedStudent, setSelectedStudent] = useState(COHORT_STUDENTS[0]);
  const [importStep, setImportStep] = useState(1);
  const [importSource, setImportSource] = useState('');
  return <div className="flex-1 overflow-auto p-5" style={{
    background: 'var(--surface2)'
  }}>
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{
            color: 'var(--text)',
            fontFamily: 'var(--font-heading)'
          }}>
              PA Student Performance Dashboard
            </h1>
            <p className="text-sm" style={{
            color: 'var(--text2)'
          }}>
              PACRAT · EOR by specialty · OSCE · EOC · PANCE readiness —
              {"Vishaka's proposed differentiator vs Influx"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            fontSize: 12,
            color: 'var(--foreground)',
            cursor: 'pointer'
          }}>
              <Sparkles style={{
              width: 12,
              height: 12,
              color: 'var(--brand)'
            }} />{' '}
              Ask Leo
            </button>
            <div className="flex gap-2">
              {[{
              id: 'cohort',
              label: 'Cohort view',
              icon: Users
            }, {
              id: 'individual',
              label: 'Individual',
              icon: Users
            }, {
              id: 'pance',
              label: 'PANCE Prediction',
              icon: TrendingUp
            }, {
              id: 'import',
              label: 'Import PAEA data',
              icon: Upload
            }].map((v) => <button key={v.id} onClick={() => setView(v.id as any)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{
              background: view === v.id ? 'var(--brand-soft)' : 'var(--surface)',
              color: view === v.id ? 'var(--brand)' : 'var(--text2)',
              border: `1px solid ${view === v.id ? 'var(--brand-border)' : 'var(--border)'}`
            }}>
                  <v.icon className="w-3.5 h-3.5" />
                  {v.label}
                </button>)}
            </div>
          </div>
        </div>

        {/* ── PANCE VIEW ── */}
        {view === 'pance' && <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--text)'
        }}>
              PA Performance & PANCE Prediction
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl p-4" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)'
          }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{
              color: 'var(--text3)'
            }}>
                  Predicted PANCE pass rate
                </div>
                <div className="flex items-end gap-3">
                  <div className="text-3xl font-bold mono" style={{
                color: '#10B981',
                fontFamily: 'var(--font-heading)'
              }}>
                    87%
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium mb-1" style={{
                color: '#10B981'
              }}>
                    <TrendingUp className="w-3.5 h-3.5" /> +3% from last cohort
                  </div>
                </div>
              </div>
              <div className="rounded-xl p-4" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)'
          }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{
              color: 'var(--text3)'
            }}>
                  At-risk students
                </div>
                <div className="flex items-end gap-3">
                  <div className="text-3xl font-bold mono" style={{
                color: '#EF4444',
                fontFamily: 'var(--font-heading)'
              }}>
                    5
                  </div>
                  <div className="text-xs font-medium mb-1" style={{
                color: 'var(--text2)'
              }}>
                    Below predicted 400
                  </div>
                </div>
              </div>
              <div className="rounded-xl p-4" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)'
          }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{
              color: 'var(--text3)'
            }}>
                  Cohort avg EOR z-score
                </div>
                <div className="text-3xl font-bold mono" style={{
              color: '#10B981',
              fontFamily: 'var(--font-heading)'
            }}>
                  0.42
                </div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>
              <table className="w-full">
                <thead>
                  <tr style={{
                borderBottom: '1px solid var(--border)',
                background: 'var(--surface2)'
              }}>
                    {['Student', 'Predicted Score', 'Risk Level', 'Key Factor', 'Action'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{
                  color: 'var(--text3)'
                }}>
                        {h}
                      </th>)}
                  </tr>
                </thead>
                <tbody>
                  {[{
                id: 'A-4102',
                score: 372,
                risk: 'Critical',
                factor: 'GPA + EOR trend',
                action: 'Immediate intervention',
                color: '#EF4444',
                pulse: true
              }, {
                id: 'A-3291',
                score: 385,
                risk: 'High',
                factor: '2 EOR failures',
                action: 'Remediation',
                color: '#EF4444'
              }, {
                id: 'A-5678',
                score: 395,
                risk: 'Moderate',
                factor: 'Weak pharmacology',
                action: 'Targeted review',
                color: '#F59E0B'
              }, {
                id: 'A-7890',
                score: 408,
                risk: 'Low',
                factor: 'Improving trend',
                action: 'Monitor',
                color: '#10B981'
              }, {
                id: 'A-1847',
                score: 412,
                risk: 'Low',
                factor: 'Strong EORs',
                action: 'Monitor',
                color: '#10B981'
              }].map((row, i) => <tr key={row.id} style={{
                borderBottom: i < 4 ? '1px solid var(--border)' : 'none'
              }}>
                      <td className="px-4 py-3 text-sm font-medium mono" style={{
                  color: 'var(--text)'
                }}>
                        {row.id}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold mono" style={{
                  color: row.color
                }}>
                        {row.score}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: row.color,
                      animation: row.pulse ? 'pulse 2s infinite' : 'none'
                    }} />
                          <span className="text-sm" style={{
                      color: 'var(--text)'
                    }}>
                            {row.risk}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm" style={{
                  color: 'var(--text2)'
                }}>
                        {row.factor}
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)'
                  }}>
                          {row.action}
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl p-4 flex gap-4 items-start" style={{
          background: 'var(--brand-soft)',
          border: '1px solid var(--brand-border)'
        }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{
            background: 'var(--brand)'
          }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold mb-1" style={{
              color: 'var(--brand)'
            }}>
                  Leo's Analysis
                </div>
                <div className="text-sm" style={{
              color: 'var(--text)',
              lineHeight: 1.5
            }}>
                  3 students are trending below the PANCE threshold. Ed
                  Razenbach's model (R² 0.78) suggests early remediation in
                  pharmacology and clinical medicine would improve outcomes.
                </div>
              </div>
            </div>
            <style>{`
              @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
                100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
              }
            `}</style>
          </div>}

        {/* ── COHORT VIEW ── */}
        {view === 'cohort' && <div className="space-y-4">
            <div className="rounded-xl overflow-hidden" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>
              <div className="px-4 py-3 flex items-center justify-between" style={{
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface2)'
          }}>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{
              color: 'var(--text3)'
            }}>
                  Class of 2027 — 6 students · At-risk sorted first
                </span>
                <span className="text-xs" style={{
              color: 'var(--text3)'
            }}>
                  Z-score = (student − national mean) ÷ national SD
                </span>
              </div>
              <table className="w-full">
                <thead>
                  <tr style={{
                borderBottom: '1px solid var(--border)'
              }}>
                    {['Student', 'GPA', 'PACRAT 1 (z)', 'PACRAT 2 (z)', 'EOR avg (z)', 'PANCE predictor', 'Status', ''].map((h) => <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{
                  color: 'var(--text3)'
                }}>
                        {h}
                      </th>)}
                  </tr>
                </thead>
                <tbody>
                  {[...COHORT_STUDENTS].sort((a, b) => a.pancePredictor - b.pancePredictor).map((s, i) => {
                const rc = RISK_COLORS[s.risk];
                const zColor = (z: number) => z >= 0 ? '#10B981' : z >= -1 ? '#D97706' : '#EF4444';
                return <tr key={s.name} style={{
                  borderBottom: i < COHORT_STUDENTS.length - 1 ? '1px solid var(--border)' : 'none',
                  background: s.risk === 'At risk' ? 'rgba(239,68,68,0.03)' : 'transparent'
                }}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{
                        background: 'var(--brand)',
                        fontSize: 9
                      }}>
                                {s.name.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <span className="text-sm" style={{
                        color: 'var(--text)'
                      }}>
                                {s.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm mono" style={{
                    color: 'var(--text2)'
                  }}>
                            {s.gpa.toFixed(1)}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold mono" style={{
                    color: zColor(s.pacrat1Z)
                  }}>
                            {s.pacrat1Z >= 0 ? '+' : ''}
                            {s.pacrat1Z.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold mono" style={{
                    color: zColor(s.pacrat2Z)
                  }}>
                            {s.pacrat2Z >= 0 ? '+' : ''}
                            {s.pacrat2Z.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold mono" style={{
                    color: zColor(s.eorAvgZ)
                  }}>
                            {s.eorAvgZ >= 0 ? '+' : ''}
                            {s.eorAvgZ.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{
                        background: 'var(--surface3)'
                      }}>
                                <div style={{
                          width: `${(s.pancePredictor - 50) / 50 * 100}%`,
                          height: '100%',
                          background: s.pancePredictor >= 80 ? '#10B981' : s.pancePredictor >= 70 ? '#D97706' : '#EF4444'
                        }} />
                              </div>
                              <span className="text-sm font-bold mono" style={{
                        color: s.pancePredictor >= 80 ? '#10B981' : s.pancePredictor >= 70 ? '#D97706' : '#EF4444'
                      }}>
                                {s.pancePredictor}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      background: rc.bg,
                      color: rc.text,
                      border: `1px solid ${rc.border}`
                    }}>
                              {s.risk}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => {
                      setSelectedStudent(s);
                      setView('individual');
                    }} className="text-xs" style={{
                      color: 'var(--brand)'
                    }}>
                              View →
                            </button>
                          </td>
                        </tr>;
              })}
                </tbody>
              </table>
            </div>
          </div>}

        {/* ── INDIVIDUAL VIEW ── */}
        {view === 'individual' && <div className="space-y-4">
            {/* Student selector */}
            <div className="flex items-center gap-3">
              <select value={selectedStudent.name} onChange={(e) => setSelectedStudent(COHORT_STUDENTS.find((s) => s.name === e.target.value)!)} className="px-3 py-2 rounded-lg text-sm" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            outline: 'none'
          }}>
                {COHORT_STUDENTS.map((s) => <option key={s.name} value={s.name}>
                    {s.name}
                  </option>)}
              </select>
              <span className="text-xs px-2 py-1 rounded-full" style={{
            background: RISK_COLORS[selectedStudent.risk].bg,
            color: RISK_COLORS[selectedStudent.risk].text
          }}>
                {selectedStudent.risk}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* PANCE predictor */}
              <div className="col-span-1 rounded-xl p-4" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)'
          }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{
              color: 'var(--text3)'
            }}>
                  PANCE readiness predictor
                </div>
                <div className="text-3xl font-bold mono mb-1" style={{
              color: selectedStudent.pancePredictor >= 80 ? '#10B981' : selectedStudent.pancePredictor >= 70 ? '#D97706' : '#EF4444',
              fontFamily: 'var(--font-heading)'
            }}>
                  {selectedStudent.pancePredictor}
                </div>
                <PanceGauge score={selectedStudent.pancePredictor} />
                <p className="text-xs mt-3" style={{
              color: 'var(--text3)'
            }}>
                  Composite of PACRAT, EOR z-scores, and GPA. Score ≥ 75 = good
                  passing probability (Ed Razenbach methodology).
                </p>
              </div>

              {/* PACRAT */}
              <div className="col-span-1 rounded-xl p-4" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)'
          }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{
              color: 'var(--text3)'
            }}>
                  PACRAT self-assessment
                </div>
                {[{
              label: 'PACRAT 1',
              z: selectedStudent.pacrat1Z,
              note: 'End of didactic year'
            }, {
              label: 'PACRAT 2',
              z: selectedStudent.pacrat2Z,
              note: 'Beginning of clinical year'
            }].map((p) => <div key={p.label} className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{
                  color: 'var(--text2)'
                }}>
                        {p.label}
                      </span>
                      <span className="text-sm font-bold mono" style={{
                  color: p.z >= 0 ? '#10B981' : p.z >= -1 ? '#D97706' : '#EF4444'
                }}>
                        {p.z >= 0 ? '+' : ''}
                        {p.z.toFixed(2)} z
                      </span>
                    </div>
                    <div style={{
                height: 6,
                borderRadius: 3,
                background: 'var(--surface3)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                      <div style={{
                  height: '100%',
                  width: `${Math.max(0, Math.min(100, 50 + p.z * 25))}%`,
                  background: p.z >= 0 ? '#10B981' : p.z >= -1 ? '#D97706' : '#EF4444',
                  borderRadius: 3
                }} />
                      <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: 2,
                  height: '100%',
                  background: '#3B82F6',
                  opacity: 0.6
                }} />
                    </div>
                    <div className="text-xs mt-0.5" style={{
                color: 'var(--text3)'
              }}>
                      {p.note} · Self-assessment — not used for pass/fail
                    </div>
                  </div>)}
              </div>

              {/* GPA + academic */}
              <div className="col-span-1 rounded-xl p-4" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)'
          }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{
              color: 'var(--text3)'
            }}>
                  Academic standing
                </div>
                <div className="text-3xl font-bold mono" style={{
              color: selectedStudent.gpa >= 3.0 ? '#10B981' : '#EF4444',
              fontFamily: 'var(--font-heading)'
            }}>
                  {selectedStudent.gpa.toFixed(1)}
                </div>
                <div className="text-xs mb-3" style={{
              color: 'var(--text3)'
            }}>
                  Cumulative GPA · Threshold: 3.0
                </div>
                {selectedStudent.gpa >= 3.0 ? <div className="flex items-center gap-1.5 text-xs" style={{
              color: '#10B981'
            }}>
                    <Check className="w-3.5 h-3.5" />
                    Good academic standing
                  </div> : <div className="flex items-center gap-1.5 text-xs" style={{
              color: '#EF4444'
            }}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Academic probation threshold
                  </div>}
              </div>
            </div>

            {/* EOR by specialty */}
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
                  End of Rotation (EOR) by specialty
                </span>
              </div>
              {EOR_SPECIALTIES.map((eor, i) => {
            const color = eor.z >= 0 ? '#10B981' : eor.z >= -1 ? '#D97706' : '#EF4444';
            return <div key={eor.name} className="flex items-center gap-4 px-4 py-3" style={{
              borderBottom: i < EOR_SPECIALTIES.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
                    <span className="text-sm w-48 flex-shrink-0" style={{
                color: 'var(--text)'
              }}>
                      {eor.name}
                    </span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden relative" style={{
                background: 'var(--surface3)'
              }}>
                      <div style={{
                  height: '100%',
                  width: `${Math.max(0, Math.min(100, 50 + eor.z * 20))}%`,
                  background: color,
                  borderRadius: 4
                }} />
                      <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: 2,
                  height: '100%',
                  background: '#3B82F6',
                  opacity: 0.6
                }} />
                    </div>
                    <span className="text-xs mono font-bold w-12 text-right flex-shrink-0" style={{
                color
              }}>
                      {eor.z >= 0 ? '+' : ''}
                      {eor.z.toFixed(2)}
                    </span>
                    <span className="text-xs mono flex-shrink-0" style={{
                color: 'var(--text3)'
              }}>
                      {eor.raw} raw
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{
                background: eor.pass ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                color: eor.pass ? '#10B981' : '#EF4444'
              }}>
                      {eor.pass ? 'Pass' : 'Fail'}
                    </span>
                  </div>;
          })}
            </div>
          </div>}

        {/* ── IMPORT VIEW ── */}
        {view === 'import' && <div className="max-w-2xl space-y-4">
            <div className="rounded-xl p-4" style={{
          background: 'rgba(59,130,246,0.05)',
          border: '1px solid rgba(59,130,246,0.2)'
        }}>
              <p className="text-sm" style={{
            color: 'var(--text2)'
          }}>
                <strong style={{
              color: 'var(--text)'
            }}>
                  {"Vishaka's requirement:"}
                </strong>{' '}
                Bulk CSV upload for PAEA and ExamSoft data. Five-minute manual
                step acceptable initially. System matches by Student ID.
              </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {['Source', 'Upload', 'Map columns', 'Preview', 'Confirm'].map((s, i) => <Fragment key={s}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{
                background: importStep > i + 1 ? '#10B981' : importStep === i + 1 ? 'var(--brand)' : 'var(--surface3)',
                color: importStep >= i + 1 ? 'white' : 'var(--text3)'
              }}>
                        {importStep > i + 1 ? <Check className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <span className="text-xs" style={{
                color: importStep === i + 1 ? 'var(--text)' : 'var(--text3)'
              }}>
                        {s}
                      </span>
                    </div>
                    {i < 4 && <div className="flex-1 h-px" style={{
              background: importStep > i + 1 ? '#10B981' : 'var(--border)'
            }} />}
                  </Fragment>)}
            </div>

            {/* Step 1: Source */}
            {importStep === 1 && <div className="rounded-xl" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>
                <div className="px-4 py-3" style={{
            borderBottom: '1px solid var(--border)'
          }}>
                  <div className="text-sm font-semibold" style={{
              color: 'var(--text)'
            }}>
                    Choose data source
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {['PAEA — PACRAT 1', 'PAEA — PACRAT 2', 'PAEA — EOR (by specialty)', 'PAEA — End of Curriculum (EOC)', 'ExamSoft — custom program exam'].map((src) => <label key={src} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer" style={{
              background: importSource === src ? 'var(--brand-soft)' : 'var(--surface2)',
              border: `1px solid ${importSource === src ? 'var(--brand-border)' : 'var(--border)'}`
            }} onClick={() => setImportSource(src)}>
                      <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{
                borderColor: importSource === src ? 'var(--brand)' : 'var(--border2)'
              }}>
                        {importSource === src && <div className="w-2 h-2 rounded-full" style={{
                  background: 'var(--brand)'
                }} />}
                      </div>
                      <span className="text-sm" style={{
                color: 'var(--text)'
              }}>
                        {src}
                      </span>
                    </label>)}
                </div>
                <div className="px-4 py-3" style={{
            borderTop: '1px solid var(--border)'
          }}>
                  <button onClick={() => importSource && setImportStep(2)} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{
              background: importSource ? 'var(--brand)' : 'var(--border2)',
              cursor: importSource ? 'pointer' : 'not-allowed'
            }}>
                    Next →
                  </button>
                </div>
              </div>}

            {/* Step 2: Upload */}
            {importStep === 2 && <div className="rounded-xl" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>
                <div className="px-4 py-3" style={{
            borderBottom: '1px solid var(--border)'
          }}>
                  <div className="text-sm font-semibold" style={{
              color: 'var(--text)'
            }}>
                    Upload CSV — {importSource}
                  </div>
                </div>
                <div className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{
              background: 'var(--surface3)'
            }}>
                    <Upload className="w-7 h-7" style={{
                color: 'var(--text3)'
              }} />
                  </div>
                  <div className="text-sm font-medium mb-1" style={{
              color: 'var(--text)'
            }}>
                    Drop CSV file or click to upload
                  </div>
                  <div className="text-xs" style={{
              color: 'var(--text3)'
            }}>
                    Must include Student ID column. Download template below.
                  </div>
                  <button className="mt-3 text-xs" style={{
              color: 'var(--brand)',
              textDecoration: 'underline'
            }}>
                    Download CSV template
                  </button>
                </div>
                <div className="px-4 py-3 flex gap-2" style={{
            borderTop: '1px solid var(--border)'
          }}>
                  <button onClick={() => setImportStep(1)} className="px-3 py-2 rounded-lg text-sm" style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text2)'
            }}>
                    ← Back
                  </button>
                  <button onClick={() => setImportStep(3)} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{
              background: 'var(--brand)'
            }}>
                    Use sample data →
                  </button>
                </div>
              </div>}

            {/* Step 3: Column mapping */}
            {importStep === 3 && <div className="rounded-xl" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>
                <div className="px-4 py-3" style={{
            borderBottom: '1px solid var(--border)'
          }}>
                  <div className="text-sm font-semibold" style={{
              color: 'var(--text)'
            }}>
                    Map CSV columns to expected fields
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold uppercase tracking-wider pb-2" style={{
              color: 'var(--text3)',
              borderBottom: '1px solid var(--border)'
            }}>
                    <span>CSV column header</span>
                    <span>Maps to</span>
                  </div>
                  {['student_id → Student ID (required)', 'score → Raw score', 'national_mean → National mean', 'national_sd → National SD', 'specialty → EOR specialty'].map((row) => <div key={row} className="grid grid-cols-2 gap-2 py-2 text-sm" style={{
              borderBottom: '1px solid var(--border)'
            }}>
                      <span className="mono text-xs" style={{
                color: 'var(--text2)'
              }}>
                        {row.split(' → ')[0]}
                      </span>
                      <span className="text-xs" style={{
                color: 'var(--text3)'
              }}>
                        {row.split(' → ')[1]}
                      </span>
                    </div>)}
                </div>
                <div className="px-4 py-3 flex gap-2" style={{
            borderTop: '1px solid var(--border)'
          }}>
                  <button onClick={() => setImportStep(2)} className="px-3 py-2 rounded-lg text-sm" style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text2)'
            }}>
                    ← Back
                  </button>
                  <button onClick={() => setImportStep(4)} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{
              background: 'var(--brand)'
            }}>
                    Preview →
                  </button>
                </div>
              </div>}

            {/* Step 4/5: Preview + Confirm */}
            {importStep >= 4 && <div className="rounded-xl" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>
                <div className="px-4 py-3" style={{
            borderBottom: '1px solid var(--border)'
          }}>
                  <div className="text-sm font-semibold" style={{
              color: 'var(--text)'
            }}>
                    {importStep === 4 ? 'Preview — first 5 rows' : 'Import complete'}
                  </div>
                </div>
                {importStep === 4 && <div className="overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--surface2)'
                }}>
                          {['Student ID', 'Score', 'National mean', 'SD', 'Z-score', 'Match'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs font-semibold" style={{
                    color: 'var(--text3)'
                  }}>
                              {h}
                            </th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {[['STU-001', '412', '404', '28', '+0.29', '✓'], ['STU-002', '378', '392', '24', '−0.58', '✓'], ['STU-003', '391', '385', '22', '+0.27', '✓'], ['STU-004', '356', '374', '26', '−0.69', '✓'], ['STU-999', '361', '374', '26', '−0.50', 'No match']].map((row, i) => <tr key={i} style={{
                  borderBottom: '1px solid var(--border)',
                  background: row[5] === 'No match' ? 'rgba(239,68,68,0.04)' : 'transparent'
                }}>
                            {row.map((cell, j) => <td key={j} className="px-3 py-2 text-xs mono" style={{
                    color: j === 5 ? cell === '✓' ? '#10B981' : '#EF4444' : 'var(--text2)'
                  }}>
                                {cell}
                              </td>)}
                          </tr>)}
                      </tbody>
                    </table>
                  </div>}
                {importStep === 5 && <div className="p-8 text-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{
              background: 'rgba(16,185,129,0.1)'
            }}>
                      <Check className="w-7 h-7" style={{
                color: '#10B981'
              }} />
                    </div>
                    <div className="text-base font-semibold" style={{
              color: 'var(--text)'
            }}>
                      4 records imported
                    </div>
                    <div className="text-sm mt-1" style={{
              color: 'var(--text3)'
            }}>
                      1 unmatched row skipped · Dashboard updated
                    </div>
                  </div>}
                {importStep === 4 && <div className="px-4 py-3 flex gap-2" style={{
            borderTop: '1px solid var(--border)'
          }}>
                    <button onClick={() => setImportStep(3)} className="px-3 py-2 rounded-lg text-sm" style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text2)'
            }}>
                      ← Back
                    </button>
                    <button onClick={() => setImportStep(5)} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{
              background: 'var(--brand)'
            }}>
                      Confirm import (4 records)
                    </button>
                  </div>}
              </div>}
          </div>}
      </div>
    </div>;
}