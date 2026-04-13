import React, { useState } from 'react';
import type { Role } from '../../types';
import { Check, X, AlertTriangle, Lock, Calendar, Users, ShieldCheck, ChevronDown, FileText, Sparkles, Download, Eye } from 'lucide-react';
// ── Sources ───────────────────────────────────────────────────────────────
// NEW GAP - Nipun 4c9b94f5 (Mar 11): ACR (Accessibility Conformance Report)
// = VPAT-style checklist the team must validate design against.
// Nipun: "We need to generate an ACR report for that. Whatever design we
// are trying to make."
// Aarti (f29a990d): Title II ADA goes into law April 24. Everything accessible.
// ───────────────────────────────────────────────────────────────
const CHECKLIST = [{
  id: 'alt',
  type: 'critical',
  ok: false,
  label: '2 images missing alt text',
  detail: 'Q3 (Hotspot) and Q32 (EKG strip). Screen readers cannot interpret these. WCAG 1.1.1.',
  action: 'Fix now'
}, {
  id: 'cap',
  type: 'critical',
  ok: false,
  label: '1 video question missing captions',
  detail: 'Q41 (Audio-based). WCAG 1.2.1 requires captions for all audio content.',
  action: 'Add captions'
}, {
  id: 'tags',
  type: 'ok',
  ok: true,
  label: 'All 42 questions fully tagged',
  detail: "Bloom's, difficulty, PAEA competency complete.",
  action: null
}, {
  id: 'lock',
  type: 'ok',
  ok: true,
  label: 'LockDown Browser configured',
  detail: 'Respondus active. Restricted key combinations confirmed.',
  action: null
}, {
  id: 'acc',
  type: 'warn',
  ok: null,
  label: '1 student without accommodation profile',
  detail: 'Priya Patel will receive default 1.0× time. Assign a profile if accommodations apply.',
  action: 'Assign profile'
}, {
  id: 'rand',
  type: 'warn',
  ok: null,
  label: 'Randomization on — verify section order',
  detail: 'Question and answer order will differ per student. Confirm this is intended.',
  action: 'Review'
}];
// ACR / VPAT criteria — source: Nipun 4c9b94f5 "we need to generate an ACR report"
const ACR_CRITERIA = [{
  id: '1.1.1',
  label: 'Non-text content (alt text)',
  status: 'fail',
  wcag: 'A',
  detail: '2 images missing alt text. Blocks screen reader interpretation.'
}, {
  id: '1.2.1',
  label: 'Audio/video captions',
  status: 'fail',
  wcag: 'A',
  detail: '1 audio question missing captions.'
}, {
  id: '1.3.1',
  label: 'Info and relationships',
  status: 'pass',
  wcag: 'A',
  detail: 'Semantic HTML structure verified.'
}, {
  id: '1.4.3',
  label: 'Contrast (minimum 4.5:1)',
  status: 'pass',
  wcag: 'AA',
  detail: 'All text passes WCAG AA contrast ratio.'
}, {
  id: '1.4.4',
  label: 'Resize text 200%',
  status: 'pass',
  wcag: 'AA',
  detail: 'Text reflows correctly at 200% zoom.'
}, {
  id: '2.1.1',
  label: 'Keyboard accessible',
  status: 'pass',
  wcag: 'A',
  detail: 'All interactive elements reachable via Tab. Arrow keys navigate options.'
}, {
  id: '2.1.2',
  label: 'No keyboard trap',
  status: 'partial',
  wcag: 'A',
  detail: 'LockDown Browser restricts some native shortcuts. In-app equivalents provided.'
}, {
  id: '2.4.3',
  label: 'Focus order',
  status: 'pass',
  wcag: 'A',
  detail: 'Tab order follows logical reading order.'
}, {
  id: '2.4.7',
  label: 'Focus visible',
  status: 'pass',
  wcag: 'AA',
  detail: 'Focus ring visible on all interactive elements.'
}, {
  id: '3.3.1',
  label: 'Error identification',
  status: 'partial',
  wcag: 'A',
  detail: 'Errors shown on submit. Real-time inline validation not yet implemented.'
}, {
  id: '4.1.2',
  label: 'Name, role, value (ARIA)',
  status: 'pass',
  wcag: 'A',
  detail: 'ARIA labels present on all form controls.'
}];
const ACR_STATUS_COLORS: Record<string, {
  bg: string;
  color: string;
  label: string;
}> = {
  pass: {
    bg: 'rgba(16,185,129,0.08)',
    color: '#10B981',
    label: 'Pass'
  },
  partial: {
    bg: 'rgba(217,119,6,0.08)',
    color: '#D97706',
    label: 'Partial'
  },
  fail: {
    bg: 'rgba(239,68,68,0.08)',
    color: '#EF4444',
    label: 'Fail'
  }
};
export function PublishPhase({
  role,
  onOpenPublishGate



}: {role: Role;onOpenPublishGate: () => void;}) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [accOpen, setAccOpen] = useState(false);
  const [proctorOpen, setProctorOpen] = useState(false);
  const [acrOpen, setAcrOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  // Exam mode settings — Nipun 4c9b94f5: rationale shown in guided/learning mode not high-stakes
  const [showRationale, setShowRationale] = useState<'never' | 'after-question' | 'after-exam'>('after-exam');
  const [examMode, setExamMode] = useState<'assessment' | 'learning'>('assessment');
  const criticalCount = CHECKLIST.filter((c) => c.type === 'critical').length;
  const canPublish = role === 'faculty' || role === 'dept-head';
  const acrFails = ACR_CRITERIA.filter((c) => c.status === 'fail').length;
  const acrPartials = ACR_CRITERIA.filter((c) => c.status === 'partial').length;
  return <div className="p-5 space-y-4 max-w-4xl">
      {/* Dept Head sign-off */}
      {role === 'dept-head' && <div className="flex items-start gap-3 px-4 py-4 rounded-xl" style={{
      background: 'rgba(227,28,121,0.06)',
      border: '1px solid rgba(227,28,121,0.15)'
    }}>
          <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{
        color: '#E31C79'
      }} />
          <div className="flex-1">
            <div className="text-sm font-semibold mb-1" style={{
          color: 'var(--text)'
        }}>
              Your sign-off is required before this exam can publish
            </div>
            <div className="text-sm" style={{
          color: 'var(--text2)'
        }}>
              Review the accessibility checklist and ACR below, then sign off to
              hand back to Dr. Gupta for final publish.
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{
        background: '#E31C79'
      }}>
            <ShieldCheck className="w-4 h-4" /> Sign off
          </button>
        </div>}

      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-4">
          {/* Accessibility publish gate */}
          <div className="rounded-xl overflow-hidden" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{
            borderBottom: '1px solid var(--border)'
          }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
                background: criticalCount > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'
              }}>
                  {criticalCount > 0 ? <Lock className="w-4 h-4" style={{
                  color: '#EF4444'
                }} /> : <Check className="w-4 h-4" style={{
                  color: '#10B981'
                }} />}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{
                  color: 'var(--text)'
                }}>
                    Accessibility publish gate
                  </div>
                  <div className="text-xs" style={{
                  color: criticalCount > 0 ? '#EF4444' : '#10B981'
                }}>
                    {criticalCount > 0 ? `${criticalCount} critical issues block publish` : 'All checks passed'}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 space-y-2">
              {CHECKLIST.map((item) => <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg" style={{
              background: item.type === 'critical' ? 'rgba(239,68,68,0.05)' : item.type === 'ok' ? 'rgba(16,185,129,0.05)' : 'rgba(245,158,11,0.05)',
              border: `1px solid ${item.type === 'critical' ? 'rgba(239,68,68,0.2)' : item.type === 'ok' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`
            }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                background: item.type === 'critical' ? '#EF4444' : item.type === 'ok' ? '#10B981' : '#F59E0B'
              }}>
                    {item.type === 'ok' ? <Check className="w-3 h-3 text-white" /> : <AlertTriangle className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {item.type === 'critical' && <span className="text-xs font-bold uppercase mr-2 px-1.5 py-0.5 rounded" style={{
                      background: '#EF4444',
                      color: 'white'
                    }}>
                            Critical
                          </span>}
                        <span className="text-xs font-medium" style={{
                      color: 'var(--text)'
                    }}>
                          {item.label}
                        </span>
                      </div>
                      {item.action && <button className="text-xs flex-shrink-0" style={{
                    color: item.type === 'critical' ? '#EF4444' : '#F59E0B',
                    textDecoration: 'underline'
                  }}>
                          {item.action}
                        </button>}
                    </div>
                    <p className="text-xs mt-0.5" style={{
                  color: 'var(--text3)'
                }}>
                      {item.detail}
                    </p>
                  </div>
                </div>)}
            </div>
            {canPublish && <div className="px-4 py-3" style={{
            borderTop: '1px solid var(--border)'
          }}>
                <button onClick={onOpenPublishGate} className="w-full py-2.5 rounded-lg text-sm font-medium text-white" style={{
              background: criticalCount > 0 ? 'var(--border2)' : 'var(--brand)',
              cursor: criticalCount > 0 ? 'not-allowed' : 'pointer'
            }} disabled={criticalCount > 0}>
                  {criticalCount > 0 ? `Fix ${criticalCount} critical issues to publish` : 'Publish assessment →'}
                </button>
              </div>}
          </div>

          {/* NEW: ACR / VPAT report — Nipun 4c9b94f5 */}
          <div className="rounded-xl overflow-hidden" style={{
          background: 'var(--surface)',
          border: `1px solid ${acrFails > 0 ? 'rgba(239,68,68,0.25)' : 'var(--border)'}`
        }}>
            <button className="w-full flex items-center gap-3 px-4 py-3" onClick={() => setAcrOpen(!acrOpen)} style={{
            borderBottom: acrOpen ? '1px solid var(--border)' : 'none',
            background: acrFails > 0 ? 'rgba(239,68,68,0.03)' : 'transparent'
          }}>
              <FileText className="w-4 h-4" style={{
              color: acrFails > 0 ? '#EF4444' : '#10B981'
            }} />
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold" style={{
                color: 'var(--text)'
              }}>
                  ACR — Accessibility Conformance Report
                </div>
                <div className="text-xs" style={{
                color: acrFails > 0 ? '#EF4444' : 'var(--text3)'
              }}>
                  WCAG 2.1 AA · ADA Title II (Apr 24 deadline) · {acrFails} fail
                  · {acrPartials} partial ·{' '}
                  {ACR_CRITERIA.length - acrFails - acrPartials} pass
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text2)',
                cursor: 'pointer'
              }}>
                  <Download style={{
                  width: 11,
                  height: 11
                }} />{' '}
                  Export VPAT
                </button>
                <ChevronDown className="w-4 h-4" style={{
                color: 'var(--text3)',
                transform: acrOpen ? 'rotate(180deg)' : 'none'
              }} />
              </div>
            </button>
            {acrOpen && <div style={{
            maxHeight: 300,
            overflowY: 'auto'
          }}>
                {ACR_CRITERIA.map((c, i) => {
              const sc = ACR_STATUS_COLORS[c.status];
              return <div key={c.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '9px 16px',
                borderBottom: i < ACR_CRITERIA.length - 1 ? '1px solid var(--border)' : 'none',
                background: c.status === 'fail' ? 'rgba(239,68,68,0.02)' : 'transparent'
              }}>
                      <span style={{
                  fontSize: 10,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: 'var(--brand)',
                  width: 40,
                  flexShrink: 0,
                  marginTop: 1
                }}>
                        {c.id}
                      </span>
                      <div style={{
                  flex: 1
                }}>
                        <div style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--text)',
                    marginBottom: 2
                  }}>
                          {c.label}
                        </div>
                        <div style={{
                    fontSize: 11,
                    color: 'var(--text3)'
                  }}>
                          {c.detail}
                        </div>
                      </div>
                      <span style={{
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 8,
                  background: sc.bg,
                  color: sc.color,
                  flexShrink: 0
                }}>
                        {c.wcag}
                      </span>
                      <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 8,
                  background: sc.bg,
                  color: sc.color,
                  flexShrink: 0
                }}>
                        {sc.label}
                      </span>
                    </div>;
            })}
              </div>}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Exam mode & feedback settings — Nipun 4c9b94f5 */}
          <div className="rounded-xl overflow-hidden" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>
            <button className="w-full flex items-center gap-3 px-4 py-3" onClick={() => setSettingsOpen(!settingsOpen)} style={{
            borderBottom: settingsOpen ? '1px solid var(--border)' : 'none'
          }}>
              <Eye className="w-4 h-4" style={{
              color: 'var(--brand)'
            }} />
              <span className="text-sm font-semibold flex-1 text-left" style={{
              color: 'var(--text)'
            }}>
                Exam mode + feedback settings
              </span>
              <ChevronDown className="w-4 h-4" style={{
              color: 'var(--text3)',
              transform: settingsOpen ? 'rotate(180deg)' : 'none'
            }} />
            </button>
            {settingsOpen && <div className="p-4 space-y-4">
                {/* Exam mode */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{
                color: 'var(--text3)'
              }}>
                    Exam mode
                  </div>
                  <div style={{
                display: 'flex',
                gap: 8
              }}>
                    {([['assessment', 'Assessment', 'High-stakes. No feedback during or after.'], ['learning', 'Learning / Guided', 'Practice mode. Rationale shown after each answer.']] as const).map(([id, label, desc]) => <button key={id} onClick={() => {
                  setExamMode(id);
                  if (id === 'learning') setShowRationale('after-question');else setShowRationale('never');
                }} style={{
                  flex: 1,
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 9,
                  background: examMode === id ? 'var(--brand-soft)' : 'var(--surface2)',
                  border: `1.5px solid ${examMode === id ? 'var(--brand)' : 'var(--border)'}`,
                  cursor: 'pointer'
                }}>
                        <div style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: examMode === id ? 'var(--brand)' : 'var(--text)',
                    marginBottom: 2
                  }}>
                          {label}
                        </div>
                        <div style={{
                    fontSize: 10,
                    color: 'var(--text3)',
                    lineHeight: 1.4
                  }}>
                          {desc}
                        </div>
                      </button>)}
                  </div>
                </div>
                {/* Rationale display */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{
                color: 'var(--text3)'
              }}>
                    When to show rationale to students
                  </div>
                  <div className="space-y-2">
                    {([['never', 'Never (high-stakes exam)'], ['after-question', 'After each answer (guided mode)'], ['after-exam', 'After submitting the whole exam']] as const).map(([val, label]) => <label key={val} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: 7,
                  background: showRationale === val ? 'var(--brand-soft)' : 'transparent',
                  border: `1px solid ${showRationale === val ? 'var(--brand-border)' : 'transparent'}`
                }}>
                        <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    border: `2px solid ${showRationale === val ? 'var(--brand)' : 'var(--border2)'}`,
                    background: showRationale === val ? 'var(--brand)' : 'transparent',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                          {showRationale === val && <div style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: 'white'
                    }} />}
                        </div>
                        <input type="radio" checked={showRationale === val} onChange={() => setShowRationale(val)} style={{
                    display: 'none'
                  }} />
                        <span style={{
                    fontSize: 12,
                    color: showRationale === val ? 'var(--brand)' : 'var(--text2)',
                    fontWeight: showRationale === val ? 600 : 400
                  }}>
                          {label}
                        </span>
                      </label>)}
                  </div>
                  <div style={{
                marginTop: 6,
                fontSize: 10,
                color: 'var(--text3)',
                padding: '5px 8px',
                borderRadius: 6,
                background: 'var(--surface2)',
                border: '1px solid var(--border)'
              }}>
                    Nipun (Mar 11): "If it's just a mock exam, the teacher might
                    want to show the rationale after selecting the answer."
                  </div>
                </div>
              </div>}
          </div>

          {/* Schedule */}
          <div className="rounded-xl overflow-hidden" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>
            <button className="w-full flex items-center gap-3 px-4 py-3" onClick={() => setScheduleOpen(!scheduleOpen)} style={{
            borderBottom: scheduleOpen ? '1px solid var(--border)' : 'none'
          }}>
              <Calendar className="w-4 h-4" style={{
              color: 'var(--brand)'
            }} />
              <span className="text-sm font-semibold flex-1 text-left" style={{
              color: 'var(--text)'
            }}>
                Schedule
              </span>
              <span className="text-xs" style={{
              color: 'var(--text3)'
            }}>
                Apr 17 · 9:00–10:30 AM
              </span>
              <ChevronDown className="w-4 h-4" style={{
              color: 'var(--text3)',
              transform: scheduleOpen ? 'rotate(180deg)' : 'none'
            }} />
            </button>
            {scheduleOpen && <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" style={{
                color: 'var(--text)'
              }}>
                    Start date/time
                  </label>
                  <div className="relative">
                    <input type="datetime-local" defaultValue="2026-04-17T09:00" className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="px-3 py-2 rounded-lg text-sm" style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)'
                }}>
                      Apr 17, 2026 · 9:00 AM
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" style={{
                color: 'var(--text)'
              }}>
                    End date/time
                  </label>
                  <div className="relative">
                    <input type="datetime-local" defaultValue="2026-04-17T10:30" className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="px-3 py-2 rounded-lg text-sm" style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)'
                }}>
                      Apr 17, 2026 · 10:30 AM
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" style={{
                color: 'var(--text)'
              }}>
                    Duration
                  </label>
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold" style={{
                background: 'var(--surface2)',
                color: 'var(--text2)'
              }}>
                    90 minutes
                  </span>
                </div>

                <div className="h-px w-full" style={{
              background: 'var(--border)'
            }} />

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium" style={{
                color: 'var(--text)'
              }}>
                    Allow late submissions
                  </span>
                  <div style={{
                background: 'var(--border2)',
                width: 32,
                height: 18,
                borderRadius: 9,
                position: 'relative'
              }}>
                    <div style={{
                  position: 'absolute',
                  top: 2,
                  left: 2,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: 'white'
                }} />
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{
                  color: 'var(--text)'
                }}>
                      LMS sync
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{
                  background: 'rgba(16,185,129,0.1)',
                  color: '#10B981'
                }}>
                      Canvas Connected
                    </span>
                  </div>
                  <div style={{
                background: 'var(--brand)',
                width: 32,
                height: 18,
                borderRadius: 9,
                position: 'relative'
              }}>
                    <div style={{
                  position: 'absolute',
                  top: 2,
                  left: 16,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: 'white'
                }} />
                  </div>
                </label>

                <button className="w-full py-2.5 mt-2 rounded-lg text-sm font-medium text-white" style={{
              background: 'var(--brand)'
            }}>
                  Schedule & Publish
                </button>
              </div>}
          </div>

          {/* Accommodations */}
          <div className="rounded-xl overflow-hidden" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>
            <button className="w-full flex items-center gap-3 px-4 py-3" onClick={() => setAccOpen(!accOpen)} style={{
            borderBottom: accOpen ? '1px solid var(--border)' : 'none'
          }}>
              <Users className="w-4 h-4" style={{
              color: 'var(--brand)'
            }} />
              <span className="text-sm font-semibold flex-1 text-left" style={{
              color: 'var(--text)'
            }}>
                Accommodations
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{
              background: 'var(--surface2)',
              color: 'var(--text2)'
            }}>
                12 assigned
              </span>
              <ChevronDown className="w-4 h-4" style={{
              color: 'var(--text3)',
              transform: accOpen ? 'rotate(180deg)' : 'none'
            }} />
            </button>
            {accOpen && <div className="p-3 space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-lg" style={{
              background: 'rgba(16,185,129,0.05)',
              border: '1px solid rgba(16,185,129,0.2)'
            }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                background: '#10B981'
              }}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-sm font-medium mt-0.5" style={{
                color: 'var(--text)'
              }}>
                    12 students have accommodation profiles assigned
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg" style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)'
            }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                background: 'var(--border2)'
              }}>
                    <span className="text-xs font-bold text-white">i</span>
                  </div>
                  <div className="text-sm font-medium mt-0.5" style={{
                color: 'var(--text)'
              }}>
                    3 students need extended time (1.5×)
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg" style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)'
            }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                background: 'var(--border2)'
              }}>
                    <span className="text-xs font-bold text-white">i</span>
                  </div>
                  <div className="text-sm font-medium mt-0.5" style={{
                color: 'var(--text)'
              }}>
                    2 students need TTS enabled
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg" style={{
              background: 'rgba(245,158,11,0.05)',
              border: '1px solid rgba(245,158,11,0.3)'
            }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                background: '#F59E0B'
              }}>
                    <AlertTriangle className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-sm font-medium mt-0.5" style={{
                color: 'var(--text)'
              }}>
                    5 students flagged by disability services have no profile
                  </div>
                </div>

                <div className="px-2 pt-1">
                  <button className="text-sm font-medium" style={{
                color: 'var(--brand)'
              }}>
                    View all accommodations →
                  </button>
                </div>
              </div>}
          </div>

          {/* Security */}
          <div className="rounded-xl overflow-hidden" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>
            <button className="w-full flex items-center gap-3 px-4 py-3" onClick={() => setProctorOpen(!proctorOpen)} style={{
            borderBottom: proctorOpen ? '1px solid var(--border)' : 'none'
          }}>
              <ShieldCheck className="w-4 h-4" style={{
              color: 'var(--brand)'
            }} />
              <span className="text-sm font-semibold flex-1 text-left" style={{
              color: 'var(--text)'
            }}>
                Security + proctoring
              </span>
              <span className="text-xs" style={{
              color: '#10B981'
            }}>
                4 active
              </span>
              <ChevronDown className="w-4 h-4" style={{
              color: 'var(--text3)',
              transform: proctorOpen ? 'rotate(180deg)' : 'none'
            }} />
            </button>
            {proctorOpen && <div className="p-4 space-y-3">
                {[{
              label: 'Respondus LockDown Browser',
              on: true
            }, {
              label: 'Question order randomization',
              on: true
            }, {
              label: 'Answer option randomization',
              on: true
            }, {
              label: 'Admin live monitoring',
              on: true
            }, {
              label: 'Restrict key combinations',
              on: true
            }, {
              label: 'AI cheating detection',
              on: false
            }].map((opt) => <label key={opt.label} className="flex items-center gap-3 cursor-pointer">
                    <div style={{
                background: opt.on ? 'var(--brand)' : 'var(--border2)',
                width: 28,
                height: 16,
                borderRadius: 8,
                position: 'relative',
                flexShrink: 0
              }}>
                      <div style={{
                  position: 'absolute',
                  top: 2,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: 'white',
                  left: opt.on ? 14 : 2
                }} />
                    </div>
                    <span className="text-sm" style={{
                color: 'var(--text2)'
              }}>
                      {opt.label}
                    </span>
                    {opt.label === 'AI cheating detection' && <span className="text-xs px-1.5 py-0.5 rounded" style={{
                background: 'rgba(217,119,6,0.1)',
                color: '#D97706'
              }}>
                        Phase 3
                      </span>}
                  </label>)}
              </div>}
          </div>
        </div>
      </div>
    </div>;
}