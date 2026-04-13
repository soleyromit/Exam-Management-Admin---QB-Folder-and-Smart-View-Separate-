import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Link2 } from
'lucide-react';
/* ══ CURRICULUM MAPPING — Standards as the third axis of the graph ══
   Mental model: Standards ↔ Questions ↔ Exams. This page shows the Standards axis.
   Each standard is a node connected to questions and exams.
   Graph nav: click a standard → see questions → click a question → opens in QB.
   
   Structure: Gap section (red, needs action) + On Track section (green, monitoring) */
const STANDARDS = [
{
  code: 'CC-5.1',
  name: 'Examination & Screening',
  body: 'CAPTE',
  mapped: 12,
  total: 15,
  courses: ['PHARM-501', 'CMED-602'],
  exams: ['Midterm F25', 'EOR 3', 'Midterm S26'],
  questions: ['Q-1847', 'Q-1845', 'Q-1841']
},
{
  code: 'CC-5.2',
  name: 'Diagnosis & Prognosis',
  body: 'CAPTE',
  mapped: 8,
  total: 12,
  courses: ['CMED-602'],
  exams: ['EOR 3', 'EOR 4'],
  questions: ['Q-1845']
},
{
  code: 'CC-5.3',
  name: 'Plan of Care',
  body: 'CAPTE',
  mapped: 15,
  total: 15,
  courses: ['PHARM-501', 'PATH-301', 'CMED-602'],
  exams: ['Midterm F25', 'Final F25', 'Midterm S26'],
  questions: []
},
{
  code: 'CC-5.4',
  name: 'Procedural Interventions',
  body: 'CAPTE',
  mapped: 6,
  total: 10,
  courses: ['PATH-301'],
  exams: ['Pathophys Midterm'],
  questions: []
},
{
  code: 'CC-5.5',
  name: 'Communication',
  body: 'CAPTE',
  mapped: 4,
  total: 8,
  courses: [],
  exams: [],
  questions: []
},
{
  code: 'NCCPA-CV',
  name: 'Cardiovascular System',
  body: 'NCCPA',
  mapped: 22,
  total: 25,
  courses: ['PHARM-501', 'CMED-602'],
  exams: ['Midterm F25', 'Final F25', 'EOR 3', 'EOR 4', 'Midterm S26'],
  questions: ['Q-1847', 'Q-1846', 'Q-1845', 'Q-1844', 'Q-1843', 'Q-1841']
},
{
  code: 'NCCPA-NR',
  name: 'Neurologic System',
  body: 'NCCPA',
  mapped: 10,
  total: 16,
  courses: ['CMED-602'],
  exams: ['EOR 3'],
  questions: []
}];

export function CurriculumMapping() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };
  const gaps = STANDARDS.filter((s) => s.mapped / s.total < 0.7);
  const onTrack = STANDARDS.filter((s) => s.mapped / s.total >= 0.7);
  return (
    <div className="flex-1 overflow-y-auto">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 20
        }}>
        
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-display, 28px)',
              fontWeight: 600,
              color: 'var(--foreground)',
              marginBottom: 4
            }}>
            
            Curriculum Mapping
          </h1>
          <p
            style={{
              fontSize: 12,
              color: 'var(--muted-foreground)'
            }}>
            
            Standards ↔ Courses ↔ Assessments · {STANDARDS.length} standards
            tracked
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 8
          }}>
          
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '7px 12px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'transparent',
              fontSize: 13,
              color: 'var(--foreground)',
              cursor: 'pointer'
            }}>
            
            <Sparkles
              style={{
                width: 14,
                height: 14,
                color: 'var(--brand)'
              }} />
            {' '}
            Ask Leo
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '7px 14px',
              borderRadius: 'var(--radius)',
              background: 'var(--primary)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--primary-foreground)',
              cursor: 'pointer',
              border: 'none'
            }}>
            
            <Plus
              style={{
                width: 14,
                height: 14
              }} />
            {' '}
            Map standard
          </button>
        </div>
      </div>

      {/* KPI + AI insight */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1.3fr',
          gap: 12,
          marginBottom: 20
        }}>
        
        {[
        {
          label: 'Standards tracked',
          value: STANDARDS.length
        },
        {
          label: 'On track (≥70%)',
          value: onTrack.length
        },
        {
          label: 'Coverage gaps',
          value: gaps.length,
          color: gaps.length > 0 ? 'var(--destructive)' : undefined
        }].
        map((m, i) =>
        <div
          key={i}
          style={{
            padding: '20px',
            background: 'var(--card)',
            border: 'none',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
            borderRadius: 16
          }}>
          
            <div
            style={{
              fontSize: 12,
              color: 'var(--muted-foreground)',
              marginBottom: 6
            }}>
            
              {m.label}
            </div>
            <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 24,
              fontWeight: 600,
              color: m.color || 'var(--foreground)',
              lineHeight: 1
            }}>
            
              {m.value}
            </span>
          </div>
        )}
        <div
          style={{
            padding: '20px',
            background: 'var(--card)',
            border: 'none',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
            borderRadius: 16,
            position: 'relative'
          }}>
          
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start'
            }}>
            
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#fef9c3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
              
              <AlertCircle
                style={{
                  width: 12,
                  height: 12,
                  color: 'var(--warning)'
                }} />
              
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  marginBottom: 2
                }}>
                
                {gaps.length} gaps before ARC-PA review
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--muted-foreground)',
                  lineHeight: 1.4
                }}>
                
                Communication has 0 linked assessments.
              </div>
            </div>
          </div>
          <button
            style={{
              position: 'absolute',
              bottom: 10,
              right: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              color: 'var(--muted-foreground)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}>
            
            <Sparkles
              style={{
                width: 10,
                height: 10,
                color: 'var(--brand)'
              }} />
            {' '}
            Ask Leo
          </button>
        </div>
      </div>

      {/* Gap section */}
      {gaps.length > 0 &&
      <>
          <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 8,
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--destructive)'
          }}>
          
            <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--destructive)'
            }} />
          {' '}
            Below threshold · {gaps.length}
          </div>
          <div
          style={{
            background: 'var(--card)',
            borderRadius: 12,
            padding: 16,
            boxShadow: 'var(--card-ring, 0 0 0 1px rgba(0,0,0,0.08))'
          }}>
          
            {gaps.map((s, i) => {
            const pct = Math.round(s.mapped / s.total * 100);
            const isOpen = expanded === s.code;
            return (
              <div
                key={s.code}
                style={{
                  borderBottom:
                  i < gaps.length - 1 ? '1px solid var(--border)' : 'none'
                }}>
                
                  <div
                  onClick={() => setExpanded(isOpen ? null : s.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 16px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) =>
                  e.currentTarget.style.background =
                  'var(--interactive-hover-row, var(--accent))'
                  }
                  onMouseLeave={(e) =>
                  e.currentTarget.style.background = 'transparent'
                  }>
                  
                    {isOpen ?
                  <ChevronDown
                    style={{
                      width: 13,
                      height: 13,
                      color: 'var(--muted-foreground)'
                    }} /> :


                  <ChevronRight
                    style={{
                      width: 13,
                      height: 13,
                      color: 'var(--muted-foreground)'
                    }} />

                  }
                    <span
                    style={{
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      color: 'var(--brand)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--sidebar-accent, #ebebfd)'
                    }}>
                    
                      {s.code}
                    </span>
                    <div
                    style={{
                      flex: 1
                    }}>
                    
                      <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--foreground)'
                      }}>
                      
                        {s.name}
                      </div>
                      <div
                      style={{
                        fontSize: 12,
                        color: 'var(--muted-foreground)'
                      }}>
                      
                        {s.body} · {s.mapped}/{s.total} questions ·{' '}
                        {s.exams.length} exams · {s.courses.length} courses
                      </div>
                    </div>
                    <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      flexShrink: 0
                    }}>
                    
                      <div
                      style={{
                        width: 50,
                        height: 3,
                        borderRadius: 2,
                        background: 'var(--muted)',
                        overflow: 'hidden'
                      }}>
                      
                        <div
                        style={{
                          height: '100%',
                          borderRadius: 2,
                          width: `${pct}%`,
                          background: 'var(--destructive)'
                        }} />
                      
                      </div>
                      <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--destructive)',
                        width: 32
                      }}>
                      
                        {pct}%
                      </span>
                    </div>
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast(
                        `Opening Question Bank filtered to ${s.code}...`
                      );
                    }}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      fontSize: 11,
                      fontWeight: 500,
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                    
                      <Plus
                      style={{
                        width: 10,
                        height: 10,
                        display: 'inline',
                        verticalAlign: -1
                      }} />
                    {' '}
                      Add
                    </button>
                  </div>
                  {/* Expanded: graph connections */}
                  {isOpen &&
                <div
                  style={{
                    padding: '0 16px 14px 46px'
                  }}>
                  
                      {/* Linked questions — graph nav */}
                      {s.questions.length > 0 &&
                  <div
                    style={{
                      marginBottom: 8
                    }}>
                    
                          <div
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: 'var(--muted-foreground)',
                        marginBottom: 4
                      }}>
                      
                            Linked questions
                          </div>
                          {s.questions.slice(0, 3).map((qid) =>
                    <div
                      key={qid}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '3px 0'
                      }}>
                      
                              <Link2
                        style={{
                          width: 10,
                          height: 10,
                          color: 'var(--brand)'
                        }} />
                      
                              <span
                        style={{
                          fontSize: 12,
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--brand)',
                          cursor: 'pointer'
                        }}>
                        
                                {qid}
                              </span>
                            </div>
                    )}
                        </div>
                  }
                      {/* Linked exams — graph nav */}
                      {s.exams.length > 0 &&
                  <div
                    style={{
                      marginBottom: 8
                    }}>
                    
                          <div
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: 'var(--muted-foreground)',
                        marginBottom: 4
                      }}>
                      
                            Assessed in
                          </div>
                          {s.exams.map((ex) =>
                    <div
                      key={ex}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '3px 0'
                      }}>
                      
                              <ExternalLink
                        style={{
                          width: 10,
                          height: 10,
                          color: 'var(--brand)'
                        }} />
                      
                              <span
                        style={{
                          fontSize: 12,
                          color: 'var(--brand)',
                          cursor: 'pointer'
                        }}>
                        
                                {ex}
                              </span>
                            </div>
                    )}
                        </div>
                  }
                      <div
                    style={{
                      fontSize: 12,
                      color: 'var(--muted-foreground)',
                      marginBottom: 6
                    }}>
                    
                        Need {s.total - s.mapped} more questions.
                        {s.courses.length === 0 ?
                    ' No courses linked — primary gap.' :
                    ''}
                      </div>
                      <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--sidebar-accent, #ebebfd)',
                      color: 'var(--brand)',
                      fontSize: 12,
                      border: '1px solid var(--sidebar-border, #e3e3f5)',
                      cursor: 'pointer'
                    }}>
                    
                        <Sparkles
                      style={{
                        width: 11,
                        height: 11
                      }} />
                    {' '}
                        Leo: Find matching questions in bank
                      </button>
                    </div>
                }
                </div>);

          })}
          </div>
        </>
      }

      {/* On track section */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--muted-foreground)',
          marginBottom: 8
        }}>
        
        On track · {onTrack.length}
      </div>
      <div
        style={{
          background: 'var(--card)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: 'var(--card-ring, 0 0 0 1px rgba(0,0,0,0.08))'
        }}>
        
        {onTrack.map((s, i) => {
          const pct = Math.round(s.mapped / s.total * 100);
          return (
            <div
              key={s.code}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 16px',
                borderBottom:
                i < onTrack.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) =>
              e.currentTarget.style.background =
              'var(--interactive-hover-row, var(--accent))'
              }
              onMouseLeave={(e) =>
              e.currentTarget.style.background = 'transparent'
              }>
              
              <CheckCircle2
                style={{
                  width: 13,
                  height: 13,
                  color: '#16a34a',
                  flexShrink: 0
                }} />
              
              <span
                style={{
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  color: 'var(--brand)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--sidebar-accent, #ebebfd)'
                }}>
                
                {s.code}
              </span>
              <div
                style={{
                  flex: 1
                }}>
                
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--foreground)'
                  }}>
                  
                  {s.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--muted-foreground)'
                  }}>
                  
                  {s.body} · {s.mapped}/{s.total} · {s.exams.length} exams ·{' '}
                  {s.courses.join(', ')}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  flexShrink: 0
                }}>
                
                <div
                  style={{
                    width: 50,
                    height: 3,
                    borderRadius: 2,
                    background: 'var(--muted)',
                    overflow: 'hidden'
                  }}>
                  
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 2,
                      width: `${pct}%`,
                      background: '#16a34a'
                    }} />
                  
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#16a34a',
                    width: 32
                  }}>
                  
                  {pct}%
                </span>
              </div>
            </div>);

        })}
      </div>
      {toast &&
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          borderRadius: 12,
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          fontSize: 13,
          fontWeight: 500,
          boxShadow: 'var(--shadow-lg)',
          zIndex: 100,
          animation: 'fadeIn 0.2s'
        }}>
        
          {toast}
        </div>
      }
    </div>);

}