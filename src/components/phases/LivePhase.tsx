import React, { useEffect, useState } from 'react';
import type { Role } from '../../types';
import { AlertTriangle, CheckCircle2, Clock, Users, WifiOff, Send, Flag, Flame, Bell } from 'lucide-react';
const STUDENTS = [{
  id: 1,
  name: 'Sarah Johnson',
  progress: 28,
  total: 42,
  flagged: 3,
  status: 'active',
  timeLeft: '01:12:44',
  accommodation: '1.5×',
  flaggedQs: [12, 18, 31]
}, {
  id: 2,
  name: 'Marcus Chen',
  progress: 35,
  total: 42,
  flagged: 1,
  status: 'active',
  timeLeft: '02:14:20',
  accommodation: '2.0×',
  flaggedQs: [18]
}, {
  id: 3,
  name: 'Priya Patel',
  progress: 0,
  total: 42,
  flagged: 0,
  status: 'disconnected',
  timeLeft: '—',
  accommodation: '',
  flaggedQs: []
}, {
  id: 4,
  name: 'James Wilson',
  progress: 42,
  total: 42,
  flagged: 0,
  status: 'submitted',
  timeLeft: 'Done',
  accommodation: '',
  flaggedQs: []
}, {
  id: 5,
  name: 'Elena Rodriguez',
  progress: 19,
  total: 42,
  flagged: 5,
  status: 'active',
  timeLeft: '01:08:33',
  accommodation: '',
  flaggedQs: [7, 12, 18, 22, 31]
}, {
  id: 6,
  name: 'David Kim',
  progress: 41,
  total: 42,
  flagged: 2,
  status: 'active',
  timeLeft: '00:04:12',
  accommodation: '',
  flaggedQs: [12, 18]
}, {
  id: 7,
  name: 'Aisha Williams',
  progress: 22,
  total: 42,
  flagged: 4,
  status: 'active',
  timeLeft: '01:22:10',
  accommodation: '1.5×',
  flaggedQs: [7, 12, 18, 31]
}, {
  id: 8,
  name: 'Chris Park',
  progress: 38,
  total: 42,
  flagged: 1,
  status: 'active',
  timeLeft: '00:18:44',
  accommodation: '',
  flaggedQs: [12]
}];
// Aggregate: how many students flagged each question
const getQuestionFlagCounts = () => {
  const counts: Record<number, number> = {};
  STUDENTS.forEach((s) => s.flaggedQs.forEach((q) => {
    counts[q] = (counts[q] || 0) + 1;
  }));
  return Object.entries(counts).map(([q, c]) => ({
    q: Number(q),
    count: c,
    pct: Math.round(c / STUDENTS.filter((s) => s.status !== 'disconnected').length * 100)
  })).sort((a, b) => b.count - a.count);
};
function TimeExtendModal({
  studentName,
  onConfirm,
  onClose




}: {studentName: string;onConfirm: (mins: number) => void;onClose: () => void;}) {
  const [mins, setMins] = useState(15);
  return <div className="fixed inset-0 z-50 flex items-center justify-center" style={{
    background: 'rgba(0,0,0,0.5)'
  }}>
      <div className="rounded-2xl p-6 w-80" style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-lg)'
    }}>
        <div className="text-sm font-semibold mb-1" style={{
        color: 'var(--text)'
      }}>
          Extend time — {studentName}
        </div>
        <p className="text-xs mb-4" style={{
        color: 'var(--text3)'
      }}>
          Their timer will update in real time. This action is logged in the
          audit trail.
        </p>
        <div className="flex gap-2 mb-4">
          {[10, 15, 20, 30].map((m) => <button key={m} onClick={() => setMins(m)} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{
          background: mins === m ? 'var(--brand)' : 'var(--surface2)',
          color: mins === m ? 'white' : 'var(--text2)',
          border: '1px solid var(--border)'
        }}>
              +{m}m
            </button>)}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onConfirm(mins)} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white" style={{
          background: 'var(--brand)'
        }}>
            Confirm extension
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          color: 'var(--text2)'
        }}>
            Cancel
          </button>
        </div>
      </div>
    </div>;
}
export function LivePhase({
  role


}: {role: Role;}) {
  const [elapsed, setElapsed] = useState(2180);
  const [timeExtendFor, setTimeExtendFor] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showHeatmap, setShowHeatmap] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = (s: number) => `${Math.floor(s / 3600).toString().padStart(2, '0')}:${Math.floor(s % 3600 / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const active = STUDENTS.filter((s) => s.status === 'active').length;
  const submitted = STUDENTS.filter((s) => s.status === 'submitted').length;
  const disconnected = STUDENTS.filter((s) => s.status === 'disconnected').length;
  const flagCounts = getQuestionFlagCounts();
  const hotQuestions = flagCounts.filter((f) => f.pct >= 20);
  const canAct = role === 'faculty' || role === 'dept-head';
  return <div className="flex-1 overflow-auto p-5 space-y-4" style={{
    background: 'var(--surface2)'
  }}>
      {/* Notification toasts */}
      {notifications.map((n, i) => <div key={i} className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm" style={{
      background: 'var(--surface)',
      border: '1px solid #10B981',
      color: '#10B981',
      boxShadow: 'var(--shadow-md)'
    }}>
          {n}
        </div>)}

      {/* Header strip */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{
        background: 'rgba(239,68,68,0.06)',
        border: '1px solid rgba(239,68,68,0.25)'
      }}>
          <div className="w-2 h-2 rounded-full" style={{
          background: '#EF4444',
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
          <span className="text-sm font-semibold" style={{
          color: '#EF4444'
        }}>
            LIVE
          </span>
          <span className="text-sm mono" style={{
          color: 'var(--text2)'
        }}>
            {fmt(elapsed)}
          </span>
        </div>
        {[{
        icon: Users,
        val: active,
        label: 'Active',
        color: '#10B981'
      }, {
        icon: CheckCircle2,
        val: submitted,
        label: 'Submitted',
        color: '#3B82F6'
      }, {
        icon: WifiOff,
        val: disconnected,
        label: 'Disconnected',
        color: '#EF4444'
      }, {
        icon: Flag,
        val: STUDENTS.reduce((sum, s) => sum + s.flaggedQs.length, 0),
        label: 'Total flags',
        color: '#D97706'
      }].map((stat, i) => <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)'
      }}>
            <stat.icon className="w-4 h-4" style={{
          color: stat.color
        }} />
            <span className="text-lg font-bold mono" style={{
          color: stat.color,
          fontFamily: 'var(--font-heading)'
        }}>
              {stat.val}
            </span>
            <span className="text-xs" style={{
          color: 'var(--text3)'
        }}>
              {stat.label}
            </span>
          </div>)}
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text2)'
        }}>
            <Send className="w-4 h-4" />
            Message all
          </button>
          {canAct && <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold" style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          color: '#EF4444'
        }}>
              End exam
            </button>}
        </div>
      </div>

      {/* Disconnected alert */}
      {disconnected > 0 && <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{
      background: 'rgba(239,68,68,0.06)',
      border: '1px solid rgba(239,68,68,0.2)'
    }}>
          <WifiOff className="w-4 h-4 flex-shrink-0" style={{
        color: '#EF4444'
      }} />
          <span className="text-sm" style={{
        color: 'var(--text2)'
      }}>
            <strong style={{
          color: 'var(--text)'
        }}>
              Priya Patel
            </strong>{' '}
            lost connection 3 minutes ago.
          </span>
          <button className="ml-auto text-sm font-semibold px-3 py-1.5 rounded-lg" style={{
        background: 'rgba(239,68,68,0.1)',
        color: '#EF4444'
      }}>
            Proxy submit
          </button>
        </div>}

      {/* QUESTION FLAG HEATMAP */}
      {hotQuestions.length > 0 && showHeatmap && <div className="rounded-xl overflow-hidden" style={{
      background: 'rgba(245,158,11,0.04)',
      border: '1px solid rgba(245,158,11,0.3)'
    }}>
          <div className="flex items-center justify-between px-4 py-2.5" style={{
        borderBottom: '1px solid rgba(245,158,11,0.2)',
        background: 'rgba(245,158,11,0.06)'
      }}>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4" style={{
            color: '#D97706'
          }} />
              <span className="text-sm font-semibold" style={{
            color: 'var(--text)'
          }}>
                Question flag heatmap — {hotQuestions.length} question
                {hotQuestions.length > 1 ? 's' : ''} flagged by &ge;20% of
                students
              </span>
            </div>
            <button onClick={() => setShowHeatmap(false)} className="text-xs" style={{
          color: 'var(--text3)'
        }}>
              Dismiss
            </button>
          </div>
          <div className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{
            color: '#D97706'
          }} />
              <p className="text-xs" style={{
            color: 'var(--text2)'
          }}>
                High flag rates often indicate a flawed question, ambiguous
                wording, or an incorrect answer key. Note these for post-exam
                review — they may need a curve applied.
              </p>
            </div>
            <div className="space-y-2">
              {hotQuestions.map((hq) => <div key={hq.q} className="flex items-center gap-4 px-4 py-2.5 rounded-xl" style={{
            background: 'var(--surface)',
            border: '1px solid rgba(245,158,11,0.2)'
          }}>
                  <span className="text-sm font-bold mono w-8 flex-shrink-0" style={{
              color: 'var(--brand)'
            }}>
                    Q{hq.q}
                  </span>
                  <div className="flex-1">
                    <div className="h-2 rounded-full overflow-hidden" style={{
                background: 'var(--surface3)'
              }}>
                      <div style={{
                  width: `${hq.pct}%`,
                  height: '100%',
                  background: hq.pct >= 40 ? '#EF4444' : '#D97706',
                  borderRadius: 4
                }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold mono flex-shrink-0" style={{
              color: hq.pct >= 40 ? '#EF4444' : '#D97706'
            }}>
                    {hq.pct}%
                  </span>
                  <span className="text-xs flex-shrink-0" style={{
              color: 'var(--text3)'
            }}>
                    {hq.count} of {active + submitted} students
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{
              background: hq.pct >= 40 ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
              color: hq.pct >= 40 ? '#EF4444' : '#D97706',
              fontWeight: 700
            }}>
                    {hq.pct >= 40 ? 'Critical' : 'Review'}
                  </span>
                </div>)}
            </div>
          </div>
        </div>}

      {/* Student monitor table */}
      <div className="rounded-xl overflow-hidden" style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)'
    }}>
        <div className="px-4 py-2.5 flex items-center gap-2" style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface2)'
      }}>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{
          color: 'var(--text3)'
        }}>
            Live student monitor
          </span>
          <span className="text-xs ml-auto" style={{
          color: 'var(--text3)'
        }}>
            Auto-refreshes every 30s
          </span>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{
            borderBottom: '1px solid var(--border)'
          }}>
              {['Student', 'Status', 'Progress', 'Flags', 'Time remaining', 'Accommodation', 'Actions'].map((h) => <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{
              color: 'var(--text3)'
            }}>
                  {h}
                </th>)}
            </tr>
          </thead>
          <tbody>
            {STUDENTS.map((s, i) => <tr key={s.id} style={{
            borderBottom: i < STUDENTS.length - 1 ? '1px solid var(--border)' : 'none',
            background: s.status === 'disconnected' ? 'rgba(239,68,68,0.04)' : s.timeLeft === '00:04:12' ? 'rgba(245,158,11,0.04)' : 'transparent'
          }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{
                  background: 'var(--brand)',
                  fontSize: 9,
                  fontWeight: 700
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
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{
                  background: s.status === 'active' ? '#10B981' : s.status === 'submitted' ? '#3B82F6' : '#EF4444'
                }} />
                    <span className="text-xs capitalize" style={{
                  color: 'var(--text2)'
                }}>
                      {s.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{
                  background: 'var(--surface3)'
                }}>
                      <div style={{
                    width: `${s.progress / s.total * 100}%`,
                    height: '100%',
                    background: s.status === 'submitted' ? '#3B82F6' : '#10B981'
                  }} />
                    </div>
                    <span className="text-xs mono" style={{
                  color: 'var(--text3)'
                }}>
                      {s.progress}/{s.total}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {s.flagged > 0 ? <div className="flex items-center gap-1">
                      <Flag className="w-3 h-3" style={{
                  color: '#D97706'
                }} />
                      <span className="text-xs font-semibold" style={{
                  color: '#D97706'
                }}>
                        {s.flagged}
                      </span>
                      {s.flaggedQs.map((q) => <span key={q} className="text-xs mono px-1 rounded" style={{
                  background: 'rgba(217,119,6,0.1)',
                  color: '#D97706'
                }}>
                          Q{q}
                        </span>)}
                    </div> : <span className="text-xs" style={{
                color: 'var(--text3)'
              }}>
                      None
                    </span>}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm mono" style={{
                color: s.timeLeft === '00:04:12' ? '#EF4444' : 'var(--text2)',
                fontWeight: s.timeLeft === '00:04:12' ? 700 : 400
              }}>
                    {s.timeLeft === '00:04:12' && '⚠ '}
                    {s.timeLeft}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {s.accommodation && <span className="text-xs px-2 py-0.5 rounded-full" style={{
                background: 'rgba(124,58,237,0.1)',
                color: '#7C3AED'
              }}>
                      {s.accommodation}
                    </span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {canAct && s.status === 'active' && <button onClick={() => setTimeExtendFor(s.name)} className="text-xs px-2 py-1 rounded-lg font-medium" style={{
                  background: 'var(--brand-soft)',
                  color: 'var(--brand)',
                  border: '1px solid var(--brand-border)'
                }}>
                        +Time
                      </button>}
                    {canAct && <button className="text-xs" style={{
                  color: 'var(--text3)'
                }}>
                        Message
                      </button>}
                    {s.status === 'disconnected' && <button className="text-xs font-semibold" style={{
                  color: '#EF4444'
                }}>
                        Proxy submit
                      </button>}
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>

      {/* Time extend modal */}
      {timeExtendFor && <TimeExtendModal studentName={timeExtendFor} onConfirm={(mins) => {
      setNotifications((prev) => [...prev, `+${mins} min added for ${timeExtendFor}`]);
      setTimeout(() => setNotifications((prev) => prev.slice(1)), 3000);
      setTimeExtendFor(null);
    }} onClose={() => setTimeExtendFor(null)} />}
    </div>;
}