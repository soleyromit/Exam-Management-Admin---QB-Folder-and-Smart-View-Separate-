import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Flag,
  MessageSquare,
  Eye,
  EyeOff,
  AlertCircle,
  RotateCcw,
  Users,
  GitPullRequest,
  GitMerge,
  Clock,
  Plus,
  Sparkles,
  Award,
  X,
  TrendingUp } from
'lucide-react';
/* ══ GRADING — GitHub code review + Greenhouse scorecard ══
   Layout: Submission list (left) | Response + Rubric (center) | Reviewer panel (right)
   Every section: WHAT / WHY / DO
   Analog: GitHub PR review (parallel graders = parallel reviewers, anonymous = blind review) */
const SUBS = [
{
  id: 1,
  anon: 'A-1847',
  score: 78,
  total: 100,
  status: 'graded' as const,
  g1: 78,
  g2: 76,
  time: '42 min'
},
{
  id: 2,
  anon: 'A-2034',
  score: 85,
  total: 100,
  status: 'graded' as const,
  g1: 85,
  g2: 83,
  time: '38 min'
},
{
  id: 3,
  anon: 'A-3291',
  score: null,
  total: 100,
  status: 'pending' as const,
  g1: null,
  g2: null,
  time: '51 min'
},
{
  id: 4,
  anon: 'A-4102',
  score: 62,
  total: 100,
  status: 'conflict' as const,
  g1: 62,
  g2: 74,
  time: '35 min'
},
{
  id: 5,
  anon: 'A-5678',
  score: null,
  total: 100,
  status: 'pending' as const,
  g1: null,
  g2: null,
  time: '45 min'
},
{
  id: 6,
  anon: 'A-6543',
  score: 91,
  total: 100,
  status: 'graded' as const,
  g1: 91,
  g2: 90,
  time: '30 min'
}];

const RUBRIC = [
{
  id: 1,
  name: 'Clinical reasoning',
  max: 4,
  levels: [
  {
    pts: 0,
    label: 'Absent'
  },
  {
    pts: 1,
    label: 'Emerging'
  },
  {
    pts: 2,
    label: 'Developing'
  },
  {
    pts: 3,
    label: 'Proficient'
  },
  {
    pts: 4,
    label: 'Exemplary'
  }]

},
{
  id: 2,
  name: 'Evidence-based justification',
  max: 3,
  levels: [
  {
    pts: 0,
    label: 'None'
  },
  {
    pts: 1,
    label: 'Weak'
  },
  {
    pts: 2,
    label: 'Adequate'
  },
  {
    pts: 3,
    label: 'Strong'
  }]

},
{
  id: 3,
  name: 'Communication clarity',
  max: 3,
  levels: [
  {
    pts: 0,
    label: 'Unclear'
  },
  {
    pts: 1,
    label: 'Adequate'
  },
  {
    pts: 2,
    label: 'Good'
  },
  {
    pts: 3,
    label: 'Excellent'
  }]

}];

const OSCE_RUBRIC = [
{
  id: 'o1',
  name: 'Opens with introduction',
  critical: false
},
{
  id: 'o2',
  name: 'Takes focused history',
  critical: false
},
{
  id: 'o3',
  name: 'Performs targeted physical exam',
  critical: true
},
{
  id: 'o4',
  name: 'Identifies primary diagnosis',
  critical: true
},
{
  id: 'o5',
  name: 'Communicates plan clearly',
  critical: false
}];

const ST_DOT = {
  graded: '#16a34a',
  pending: 'var(--muted-foreground, #60636a)',
  conflict: 'var(--destructive, #d40924)',
  'in-progress': 'var(--warning, #ca8a04)'
};
export function GradingInterface() {
  const [sel, setSel] = useState(0);
  const [anon, setAnon] = useState(true);
  const [rubricType, setRubricType] = useState<'standard' | 'osce'>('standard');
  const [allScores, setAllScores] = useState<
    Record<number, Record<number | string, number>>>(
    {});
  const [comment, setComment] = useState('');
  const scores =
  allScores[sel] || (
  rubricType === 'standard' ?
  {
    1: 3,
    2: 2,
    3: 0
  } :
  {});
  const setScores = (updater: any) => {
    setAllScores((prev) => ({
      ...prev,
      [sel]:
      typeof updater === 'function' ?
      updater(
        prev[sel] || (
        rubricType === 'standard' ?
        {
          1: 3,
          2: 2,
          3: 0
        } :
        {})
      ) :
      updater
    }));
  };
  const sub = SUBS[sel];
  const rubricTotal = Object.values(scores).reduce((a, b) => a + b, 0);
  const rubricMax =
  rubricType === 'standard' ?
  RUBRIC.reduce((a, c) => a + c.max, 0) :
  OSCE_RUBRIC.length * 2;
  const graded = SUBS.filter((s) => s.status === 'graded').length;
  const conflicts = SUBS.filter((s) => s.status === 'conflict').length;
  const hasCriticalFailure =
  rubricType === 'osce' &&
  OSCE_RUBRIC.some((c) => c.critical && scores[c.id] === 0);
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 20
        }}>
        
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 28,
              fontWeight: 600,
              color: 'var(--foreground)',
              marginBottom: 4,
              letterSpacing: '-0.02em'
            }}>
            
            Grading
          </h1>
          <p
            style={{
              fontSize: 13,
              color: 'var(--muted-foreground)'
            }}>
            
            {graded}/{SUBS.length} graded · {conflicts} conflicts
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
          
          <button
            onClick={() => setAnon(!anon)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 12,
              fontWeight: 500,
              background: anon ? '#f0fdf4' : 'var(--muted)',
              color: anon ? '#15803d' : 'var(--muted-foreground)',
              border: `1px solid ${anon ? '#bbf7d0' : 'var(--border)'}`,
              cursor: 'pointer'
            }}>
            
            {anon ?
            <EyeOff
              style={{
                width: 12,
                height: 12
              }} /> :


            <Eye
              style={{
                width: 12,
                height: 12
              }} />

            }
            {anon ? 'Blind' : 'Names'}
          </button>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--muted)',
              fontSize: 12,
              color: 'var(--muted-foreground)'
            }}>
            
            <div
              style={{
                width: 50,
                height: 3,
                borderRadius: 2,
                background: 'var(--border)',
                overflow: 'hidden'
              }}>
              
              <div
                style={{
                  height: '100%',
                  width: `${graded / SUBS.length * 100}%`,
                  borderRadius: 2,
                  background: '#16a34a'
                }} />
              
            </div>
            {graded}/{SUBS.length}
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: 'transparent',
              fontSize: 12,
              color: 'var(--foreground)',
              cursor: 'pointer'
            }}>
            
            <Sparkles
              style={{
                width: 12,
                height: 12,
                color: 'var(--brand)'
              }} />
            {' '}
            Ask Leo
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden'
        }}>
        
        {/* LEFT: Submission list */}
        <div
          style={{
            width: 210,
            flexShrink: 0,
            overflowY: 'auto',
            borderRight: '1px solid var(--border)',
            background: 'var(--card)'
          }}>
          
          <div
            style={{
              padding: '8px 12px',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--muted-foreground)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              borderBottom: '1px solid var(--border)'
            }}>
            
            Submissions
          </div>
          {SUBS.map((s, i) =>
          <button
            key={s.id}
            onClick={() => setSel(i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '10px 12px',
              textAlign: 'left',
              background: i === sel ? 'var(--accent)' : 'transparent',
              borderBottom: '1px solid var(--border)',
              borderLeft:
              i === sel ?
              '2px solid var(--foreground)' :
              '2px solid transparent',
              cursor: 'pointer',
              border: 'none',
              borderBottomStyle: 'solid',
              borderLeftStyle: 'solid',
              borderBottomColor: 'var(--border)',
              borderLeftColor:
              i === sel ? 'var(--foreground)' : 'transparent'
            }}>
            
              <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: ST_DOT[s.status],
                flexShrink: 0
              }} />
            
              <div
              style={{
                flex: 1,
                minWidth: 0
              }}>
              
                <div
                style={{
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}>
                
                  {s.anon}
                </div>
                <div
                style={{
                  fontSize: 11,
                  color: 'var(--muted-foreground)'
                }}>
                
                  {s.status === 'graded' ?
                `${s.score}/${s.total}` :
                s.status === 'conflict' ?
                `${s.g1} vs ${s.g2}` :
                'Not graded'}
                </div>
              </div>
              <span
              style={{
                fontSize: 10,
                color: 'var(--muted-foreground)'
              }}>
              
                {s.time}
              </span>
            </button>
          )}
        </div>

        {/* CENTER: Response + Rubric */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 20
          }}>
          
          {/* Nav */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16
            }}>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
              
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--brand)'
                }}>
                
                {sub.anon}
              </span>
              <span
                style={{
                  fontSize: 12,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background:
                  sub.status === 'graded' ?
                  '#f0fdf4' :
                  sub.status === 'conflict' ?
                  '#fef2f2' :
                  'var(--muted)',
                  color:
                  sub.status === 'graded' ?
                  '#15803d' :
                  sub.status === 'conflict' ?
                  'var(--destructive)' :
                  'var(--muted-foreground)'
                }}>
                
                {sub.status === 'conflict' ?
                'Score conflict' :
                sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
              
              <button
                onClick={() => setSel(Math.max(0, sel - 1))}
                style={{
                  padding: 4,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  cursor: 'pointer'
                }}>
                
                <ChevronLeft
                  style={{
                    width: 14,
                    height: 14,
                    color: 'var(--muted-foreground)'
                  }} />
                
              </button>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--muted-foreground)',
                  padding: '0 4px'
                }}>
                
                {sel + 1}/{SUBS.length}
              </span>
              <button
                onClick={() => setSel(Math.min(SUBS.length - 1, sel + 1))}
                style={{
                  padding: 4,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  cursor: 'pointer'
                }}>
                
                <ChevronRight
                  style={{
                    width: 14,
                    height: 14,
                    color: 'var(--muted-foreground)'
                  }} />
                
              </button>
            </div>
          </div>

          {/* Question */}
          <div
            style={{
              background: 'var(--card)',
              border: 'none',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
              borderRadius: 16,
              padding: '20px',
              marginBottom: 14
            }}>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 8
              }}>
              
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--brand-tint, #f3f3ff)',
                  color: 'var(--brand)'
                }}>
                
                Q6
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--muted-foreground)'
                }}>
                
                Short Answer · 10 points
              </span>
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'var(--foreground)',
                lineHeight: 1.6
              }}>
              
              A 45-year-old woman presents with fatigue, weight gain, and cold
              intolerance. Lab results show elevated TSH and low free T4.
              Describe the pathophysiology, differential diagnosis, and
              recommended treatment plan.
            </div>
          </div>

          {/* Student response — GitHub diff pattern: line numbers + inline comments */}
          <div
            style={{
              background: 'var(--card)',
              border: 'none',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
              borderRadius: 16,
              overflow: 'hidden',
              marginBottom: 14
            }}>
            
            <div
              style={{
                padding: '8px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                background: '#fefce8'
              }}>
              
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#a16207'
                }}>
                
                Student response
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: '#a16207'
                }}>
                
                <MessageSquare
                  style={{
                    width: 11,
                    height: 11,
                    display: 'inline',
                    verticalAlign: -1
                  }} />
                {' '}
                2 annotations
              </span>
            </div>
            <div
              style={{
                padding: '12px 16px'
              }}>
              
              {[
              'The patient likely has primary hypothyroidism based on elevated TSH and low free T4.',
              'The thyroid gland is not producing enough thyroid hormone, which causes the hypothalamus-pituitary axis to increase TSH production.',
              "Common causes include Hashimoto's thyroiditis (autoimmune), iodine deficiency, or post-surgical.",
              'Treatment would be levothyroxine replacement therapy, starting at a low dose and titrating based on TSH levels every 6-8 weeks.'].
              map((line, i) =>
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 8,
                  padding: '4px 0'
                }}>
                
                  <span
                  style={{
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--muted-foreground)',
                    width: 16,
                    textAlign: 'right',
                    flexShrink: 0
                  }}>
                  
                    {i + 1}
                  </span>
                  <span
                  style={{
                    fontSize: 13,
                    color: 'var(--foreground)',
                    lineHeight: 1.6
                  }}>
                  
                    {line}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Rubric — Greenhouse scorecard: click level to score */}
          <div
            style={{
              background: 'var(--card)',
              border: 'none',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
              borderRadius: 16,
              overflow: 'hidden',
              marginBottom: 14
            }}>
            
            <div
              style={{
                padding: '10px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
              
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}>
                
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--foreground)'
                  }}>
                  
                  Rubric
                </span>
                <div
                  style={{
                    display: 'flex',
                    background: 'var(--surface2)',
                    borderRadius: 8,
                    padding: 2,
                    border: '1px solid var(--border)'
                  }}>
                  
                  <button
                    onClick={() => setRubricType('standard')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      background:
                      rubricType === 'standard' ?
                      'var(--card)' :
                      'transparent',
                      color:
                      rubricType === 'standard' ?
                      'var(--foreground)' :
                      'var(--muted-foreground)',
                      border: 'none',
                      boxShadow:
                      rubricType === 'standard' ?
                      '0 1px 2px rgba(0,0,0,0.05)' :
                      'none',
                      cursor: 'pointer'
                    }}>
                    
                    Standard Rubric
                  </button>
                  <button
                    onClick={() => setRubricType('osce')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      background:
                      rubricType === 'osce' ? 'var(--card)' : 'transparent',
                      color:
                      rubricType === 'osce' ?
                      'var(--foreground)' :
                      'var(--muted-foreground)',
                      border: 'none',
                      boxShadow:
                      rubricType === 'osce' ?
                      '0 1px 2px rgba(0,0,0,0.05)' :
                      'none',
                      cursor: 'pointer'
                    }}>
                    
                    OSCE Rubric
                  </button>
                </div>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  color: 'var(--brand)'
                }}>
                
                {rubricTotal}/{rubricMax}
              </span>
            </div>

            {rubricType === 'standard' ?
            RUBRIC.map((c) =>
            <div
              key={c.id}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)'
              }}>
              
                    <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8
                }}>
                
                      <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--foreground)'
                  }}>
                  
                        {c.name}
                      </span>
                      <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--muted-foreground)'
                  }}>
                  
                        {scores[c.id] ?? 0}/{c.max}
                      </span>
                    </div>
                    <div
                style={{
                  display: 'flex',
                  gap: 4
                }}>
                
                      {c.levels.map((l) => {
                  const isSel = (scores[c.id] ?? 0) === l.pts;
                  return (
                    <button
                      key={l.pts}
                      onClick={() =>
                      setScores((s: any) => ({
                        ...s,
                        [c.id]: l.pts
                      }))
                      }
                      style={{
                        flex: 1,
                        padding: '6px 4px',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'center',
                        fontSize: 11,
                        fontWeight: isSel ? 600 : 400,
                        background: isSel ?
                        'var(--primary, #39393c)' :
                        'var(--muted)',
                        color: isSel ?
                        'var(--primary-foreground)' :
                        'var(--muted-foreground)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.1s'
                      }}>
                      
                            {l.pts} — {l.label}
                          </button>);

                })}
                    </div>
                  </div>
            ) :
            OSCE_RUBRIC.map((c) =>
            <div
              key={c.id}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                borderLeft: c.critical ?
                '3px solid #EF4444' :
                '3px solid transparent',
                background: c.critical ?
                'rgba(239,68,68,0.02)' :
                'transparent'
              }}>
              
                    <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8
                }}>
                
                      <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                  
                        <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--foreground)'
                    }}>
                    
                          {c.name}
                        </span>
                        {c.critical &&
                  <Flag
                    style={{
                      width: 12,
                      height: 12,
                      color: '#EF4444'
                    }} />

                  }
                      </div>
                      <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--muted-foreground)'
                  }}>
                  
                        {scores[c.id] ?? 0}/2
                      </span>
                    </div>
                    <div
                style={{
                  display: 'flex',
                  gap: 4
                }}>
                
                      {[
                {
                  pts: 0,
                  label: 'Not Done'
                },
                {
                  pts: 1,
                  label: 'Partially Done'
                },
                {
                  pts: 2,
                  label: 'Done'
                }].
                map((l) => {
                  const isSel = (scores[c.id] ?? 0) === l.pts;
                  return (
                    <button
                      key={l.pts}
                      onClick={() =>
                      setScores((s: any) => ({
                        ...s,
                        [c.id]: l.pts
                      }))
                      }
                      style={{
                        flex: 1,
                        padding: '6px 4px',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'center',
                        fontSize: 11,
                        fontWeight: isSel ? 600 : 400,
                        background: isSel ?
                        'var(--primary, #39393c)' :
                        'var(--muted)',
                        color: isSel ?
                        'var(--primary-foreground)' :
                        'var(--muted-foreground)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.1s'
                      }}>
                      
                            {l.pts} — {l.label}
                          </button>);

                })}
                    </div>
                  </div>
            )}

            {hasCriticalFailure &&
            <div
              style={{
                padding: '10px 16px',
                background: '#fef2f2',
                borderTop: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
              
                <AlertCircle
                style={{
                  width: 16,
                  height: 16,
                  color: '#ef4444'
                }} />
              
                <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#991b1b'
                }}>
                
                  Critical task failed — competency not met regardless of total
                  score.
                </span>
              </div>
            }
          </div>

          {/* Feedback + actions — GitHub review submit */}
          <div
            style={{
              background: 'var(--card)',
              borderRadius: 12,
              padding: 20,
              boxShadow: 'var(--card-ring, 0 0 0 1px rgba(0,0,0,0.08))',
              marginBottom: 20
            }}>
            
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Feedback for student..."
              rows={2}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                fontSize: 12,
                color: 'var(--foreground)',
                background: 'var(--card)',
                outline: 'none',
                resize: 'none',
                marginBottom: 10
              }} />
            
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}>
              
              <div
                style={{
                  display: 'flex',
                  gap: 6
                }}>
                
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#fef2f2',
                    color: 'var(--destructive)',
                    fontSize: 12,
                    border: '1px solid #fecaca',
                    cursor: 'pointer'
                  }}>
                  
                  <Flag
                    style={{
                      width: 12,
                      height: 12
                    }} />
                  {' '}
                  Flag
                </button>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'transparent',
                    color: 'var(--muted-foreground)',
                    fontSize: 12,
                    border: '1px solid var(--border)',
                    cursor: 'pointer'
                  }}>
                  
                  <RotateCcw
                    style={{
                      width: 12,
                      height: 12
                    }} />
                  {' '}
                  Reset
                </button>
              </div>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary, #39393c)',
                  color: 'var(--primary-foreground)',
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}>
                
                <CheckCircle2
                  style={{
                    width: 13,
                    height: 13
                  }} />
                {' '}
                Submit & Next
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Reviewer panel (parallel grading) */}
        <div
          style={{
            width: 220,
            flexShrink: 0,
            overflowY: 'auto',
            borderLeft: '1px solid var(--border)',
            background: 'var(--card)',
            padding: 14
          }}>
          
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--foreground)',
              marginBottom: 10
            }}>
            
            Reviewers
          </div>
          {/* Grader 1 */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 12,
              background: '#f0fdf4',
              border: 'none',
              boxShadow: '0 0 0 1px #bbf7d0',
              marginBottom: 8
            }}>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 4
              }}>
              
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 8,
                  color: '#fff',
                  fontWeight: 700
                }}>
                
                P
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}>
                
                Dr. Patel
              </span>
              <CheckCircle2
                style={{
                  width: 12,
                  height: 12,
                  color: '#16a34a',
                  marginLeft: 'auto'
                }} />
              
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#15803d'
              }}>
              
              Score: 7/10
            </div>
          </div>
          {/* Grader 2 */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 12,
              background: 'var(--muted)',
              border: 'none',
              boxShadow: '0 0 0 1px var(--border)',
              marginBottom: 14
            }}>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 4
              }}>
              
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'var(--brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 8,
                  color: '#fff',
                  fontWeight: 700
                }}>
                
                K
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}>
                
                Dr. Kim
              </span>
              <Clock
                style={{
                  width: 12,
                  height: 12,
                  color: 'var(--warning)',
                  marginLeft: 'auto'
                }} />
              
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--muted-foreground)'
              }}>
              
              Pending
            </div>
          </div>

          {/* Conflict resolution */}
          {sub.status === 'conflict' &&
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 12,
              background: '#fef2f2',
              border: 'none',
              boxShadow: '0 0 0 1px #fecaca',
              marginBottom: 14
            }}>
            
              <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--destructive)',
                marginBottom: 4
              }}>
              
                <GitMerge
                style={{
                  width: 12,
                  height: 12
                }} />
              {' '}
                Score conflict
              </div>
              <div
              style={{
                fontSize: 11,
                color: 'var(--destructive)'
              }}>
              
                {sub.g1} vs {sub.g2} ({Math.abs((sub.g1 || 0) - (sub.g2 || 0))}{' '}
                pts)
              </div>
              <button
              style={{
                marginTop: 6,
                width: '100%',
                padding: '5px 0',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--destructive)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer'
              }}>
              
                Resolve
              </button>
            </div>
          }

          <div
            style={{
              height: 1,
              background: 'var(--border)',
              margin: '6px 0 10px'
            }} />
          

          {/* Post-exam adjustments */}
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--foreground)',
              marginBottom: 8
            }}>
            
            Adjustments
          </div>
          {[
          {
            label: 'Curve grades',
            desc: '+5 to all',
            icon: TrendingUp
          },
          {
            label: 'Bonus question',
            desc: 'Q6 as bonus',
            icon: Award
          },
          {
            label: 'Eliminate Q',
            desc: 'Remove from scoring',
            icon: X
          }].
          map((a) =>
          <button
            key={a.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--muted)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              textAlign: 'left',
              marginBottom: 4
            }}>
            
              <a.icon
              style={{
                width: 13,
                height: 13,
                color: 'var(--muted-foreground)'
              }} />
            
              <div>
                <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}>
                
                  {a.label}
                </div>
                <div
                style={{
                  fontSize: 10,
                  color: 'var(--muted-foreground)'
                }}>
                
                  {a.desc}
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>);

}