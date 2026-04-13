import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell } from
'recharts';
import {
  AlertCircle,
  CheckCircle2,
  Flag,
  Eye,
  Sparkles,
  ExternalLink,
  Link2,
  ArrowRight } from
'lucide-react';
/* ══ ITEM ANALYSIS — Question metrics as graph navigation ══
   Mental model: Each item IS a question node in the graph. Clicking it
   navigates to the QB. The scatter plot is a visual map of the graph.
   
   Every item row: WHAT (metrics) / WHY (plain English meaning) / DO (flag, revise, navigate to QB)
   Graph nav: Q-ID → QB detail. Exam name → exam detail. */
const ITEMS = [
{
  id: 'Q-1847',
  stem: 'Which beta-blocker is cardioselective?',
  pVal: 0.82,
  pbis: 0.41,
  status: 'good' as const,
  meaning: 'Strong discriminator. Working as intended.'
},
{
  id: 'Q-1846',
  stem: 'Select ALL ACE inhibitors...',
  pVal: 0.65,
  pbis: 0.35,
  status: 'good' as const,
  meaning: 'Good item. Moderate difficulty, positive discrimination.'
},
{
  id: 'Q-1845',
  stem: 'ST elevation in leads II, III, aVF...',
  pVal: 0.43,
  pbis: 0.52,
  status: 'good' as const,
  meaning: 'Excellent discriminator. Hard but effective.'
},
{
  id: 'Q-1844',
  stem: 'Mechanism of calcium channel blockers...',
  pVal: 0.91,
  pbis: 0.12,
  status: 'review' as const,
  meaning: 'Too easy (91%). Low discrimination — most students get it right.'
},
{
  id: 'Q-1843',
  stem: 'Warfarin + amiodarone INR change?',
  pVal: 0.28,
  pbis: -0.15,
  status: 'flagged' as const,
  meaning:
  'Negative PBis — weaker students outperform stronger ones. Likely flawed distractor.'
}];

const DISTRACTOR = [
{
  opt: 'A) Propranolol',
  pct: 12,
  correct: false
},
{
  opt: 'B) Metoprolol',
  pct: 72,
  correct: true
},
{
  opt: 'C) Carvedilol',
  pct: 10,
  correct: false
},
{
  opt: 'D) Labetalol',
  pct: 6,
  correct: false
}];

const DOT: Record<string, string> = {
  good: 'var(--success)',
  review: 'var(--warning)',
  flagged: 'var(--destructive)',
  eliminated: 'var(--muted-foreground)',
  revision: '#ca8a04'
};
const TT = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 12,
  color: 'var(--foreground)',
  boxShadow: 'var(--shadow-md)'
};
const AX = {
  fontSize: 11,
  fill: 'var(--muted-foreground)',
  fontFamily: 'var(--font-ui)'
};
export function ItemAnalysis() {
  const [items, setItems] = useState(ITEMS);
  const [sel, setSel] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };
  const item = items[sel];
  const scatter = items.map((i) => ({
    x: i.pVal,
    y: i.pbis,
    status: i.status
  }));
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
            
            Item Analysis
          </h1>
          <p
            style={{
              fontSize: 12,
              color: 'var(--muted-foreground)'
            }}>
            
            CV Pharmacology Midterm 2026 · 50 questions
          </p>
        </div>
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
      </div>

      {/* KPI + AI insight */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1.3fr',
          gap: 12,
          marginBottom: 20
        }}>
        
        {[
        {
          l: 'Avg p-value',
          v: '0.59',
          m: 'Moderate'
        },
        {
          l: 'Avg PBis',
          v: '0.32',
          m: 'Good'
        },
        {
          l: 'Flagged',
          v: '1',
          m: 'Neg PBis'
        },
        {
          l: 'Review',
          v: '1',
          m: 'Too easy'
        }].
        map((k, i) =>
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
            
              {k.l}
            </div>
            <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--foreground)',
              lineHeight: 1
            }}>
            
              {k.v}
            </div>
            <div
            style={{
              fontSize: 11,
              color: 'var(--muted-foreground)',
              marginTop: 2
            }}>
            
              {k.m}
            </div>
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
                
                Q-1843 needs revision
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--muted-foreground)',
                  lineHeight: 1.4
                }}>
                
                Negative PBis suggests ambiguous stem.
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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: 12
        }}>
        
        <div>
          {/* Item list — graph-navigable */}
          <div
            style={{
              background: 'var(--card)',
              borderRadius: 12,
              padding: 16,
              boxShadow: 'var(--card-ring, 0 0 0 1px rgba(0,0,0,0.08))'
            }}>
            
            {items.map((it, i) =>
            <div
              key={it.id}
              onClick={() => setSel(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom:
                i < items.length - 1 ? '1px solid var(--border)' : 'none',
                background: i === sel ? 'var(--accent)' : 'transparent',
                borderLeft:
                i === sel ?
                '2px solid var(--foreground)' :
                it.status === 'flagged' || it.status === 'eliminated' ?
                '2px solid var(--destructive)' :
                it.status === 'review' || it.status === 'revision' ?
                '2px solid #ca8a04' :
                '2px solid transparent'
              }}>
              
                <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: DOT[it.status],
                  flexShrink: 0
                }} />
              
                <div
                style={{
                  flex: 1,
                  minWidth: 0
                }}>
                
                  <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    marginBottom: 2
                  }}>
                  
                    {/* Graph nav: Q-ID links to question bank */}
                    <span
                    style={{
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--brand)',
                      fontWeight: 600
                    }}>
                    
                      {it.id}
                    </span>
                    <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--foreground)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                    
                      {it.stem}
                    </span>
                  </div>
                  <div
                  style={{
                    fontSize: 12,
                    color: 'var(--muted-foreground)'
                  }}>
                  
                    {it.meaning}
                  </div>
                </div>
                <div
                style={{
                  textAlign: 'right',
                  flexShrink: 0
                }}>
                
                  <div
                  style={{
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--foreground)'
                  }}>
                  
                    p={it.pVal.toFixed(2)}
                  </div>
                  <div
                  style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color:
                    it.pbis < 0 ?
                    'var(--destructive)' :
                    it.pbis < 0.2 ?
                    'var(--warning)' :
                    'var(--muted-foreground)'
                  }}>
                  
                    PBis={it.pbis.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scatter */}
          <div
            style={{
              background: 'var(--card)',
              borderRadius: 16,
              padding: '20px'
            }}>
            
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--foreground)',
                marginBottom: 4
              }}>
              
              Difficulty vs Discrimination
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--muted-foreground)',
                marginBottom: 12
              }}>
              
              Top-center = ideal. Bottom-right = too easy, low discrimination.
            </div>
            <div
              style={{
                height: 180
              }}>
              
              <ResponsiveContainer>
                <ScatterChart
                  margin={{
                    top: 5,
                    right: 10,
                    bottom: 20,
                    left: 10
                  }}>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="x"
                    name="p-value"
                    tick={AX}
                    axisLine={{
                      stroke: 'var(--border)'
                    }}
                    label={{
                      value: 'Difficulty (p-value)',
                      position: 'bottom',
                      fontSize: 11,
                      fill: 'var(--muted-foreground)',
                      offset: 5
                    }} />
                  
                  <YAxis
                    dataKey="y"
                    name="PBis"
                    tick={AX}
                    axisLine={{
                      stroke: 'var(--border)'
                    }}
                    label={{
                      value: 'Discrimination (PBis)',
                      angle: -90,
                      position: 'left',
                      fontSize: 11,
                      fill: 'var(--muted-foreground)'
                    }} />
                  
                  <Tooltip contentStyle={TT} />
                  <Scatter data={scatter}>
                    {scatter.map((d, i) =>
                    <Cell key={i} fill={DOT[d.status]} r={5} />
                    )}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <div>
          <div
            style={{
              background: 'var(--card)',
              borderRadius: 16,
              padding: '20px',
              marginBottom: 12
            }}>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 8
              }}>
              
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: DOT[item.status]
                }} />
              
              <span
                style={{
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--brand)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                
                {item.id}{' '}
                <ExternalLink
                  style={{
                    width: 9,
                    height: 9,
                    display: 'inline',
                    verticalAlign: -1
                  }} />
                
              </span>
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'var(--foreground)',
                lineHeight: 1.5,
                marginBottom: 12
              }}>
              
              {item.stem}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                marginBottom: 12
              }}>
              
              {[
              {
                l: 'p-value',
                v: item.pVal.toFixed(2)
              },
              {
                l: 'PBis',
                v: item.pbis.toFixed(2)
              }].
              map((m) =>
              <div
                key={m.l}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--muted)'
                }}>
                
                  <div
                  style={{
                    fontSize: 11,
                    color: 'var(--muted-foreground)'
                  }}>
                  
                    {m.l}
                  </div>
                  <div
                  style={{
                    fontSize: 16,
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    color: 'var(--foreground)'
                  }}>
                  
                    {m.v}
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'var(--foreground)',
                lineHeight: 1.5,
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--muted)',
                marginBottom: 12
              }}>
              
              {item.meaning}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}>
              
              <button
                onClick={() =>
                showToast(`Opening ${item.id} in Question Bank...`)
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  fontSize: 12,
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer'
                }}>
                
                <Eye
                  style={{
                    width: 12,
                    height: 12
                  }} />
                {' '}
                View in Question Bank
              </button>
              {item.status === 'flagged' &&
              <button
                onClick={() => {
                  const newItems = [...items];
                  newItems[sel] = {
                    ...newItems[sel],
                    status: 'eliminated' as any,
                    meaning: 'Eliminated from scoring.'
                  };
                  setItems(newItems);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: '#fef2f2',
                  color: 'var(--destructive)',
                  fontSize: 12,
                  fontWeight: 500,
                  border: '1px solid #fecaca',
                  cursor: 'pointer'
                }}>
                
                  <Flag
                  style={{
                    width: 12,
                    height: 12
                  }} />
                {' '}
                  Eliminate from scoring
                </button>
              }
              {item.status === 'eliminated' &&
              <div
                style={{
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--muted)',
                  color: 'var(--muted-foreground)',
                  fontSize: 12,
                  fontWeight: 500,
                  textAlign: 'center'
                }}>
                
                  Eliminated
                </div>
              }
              {item.status === 'review' &&
              <button
                onClick={() => {
                  const newItems = [...items];
                  newItems[sel] = {
                    ...newItems[sel],
                    status: 'revision' as any,
                    meaning: 'Sent for revision.'
                  };
                  setItems(newItems);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: '#fefce8',
                  color: '#a16207',
                  fontSize: 12,
                  fontWeight: 500,
                  border: '1px solid #fde68a',
                  cursor: 'pointer'
                }}>
                
                  <AlertCircle
                  style={{
                    width: 12,
                    height: 12
                  }} />
                {' '}
                  Send for revision
                </button>
              }
              {item.status === 'revision' &&
              <div
                style={{
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: '#fefce8',
                  color: '#a16207',
                  fontSize: 12,
                  fontWeight: 500,
                  textAlign: 'center'
                }}>
                
                  Sent for revision
                </div>
              }
            </div>
          </div>

          {/* Distractor chart */}
          <div
            style={{
              background: 'var(--card)',
              borderRadius: 16,
              padding: '20px'
            }}>
            
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--foreground)',
                marginBottom: 10
              }}>
              
              Distractor Analysis
            </div>
            <div
              style={{
                height: 130
              }}>
              
              <ResponsiveContainer>
                <BarChart data={DISTRACTOR} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" domain={[0, 100]} tick={AX} />
                  <YAxis dataKey="opt" type="category" tick={AX} width={100} />
                  <Tooltip contentStyle={TT} />
                  <Bar dataKey="pct" radius={3}>
                    {DISTRACTOR.map((d, i) =>
                    <Cell
                      key={i}
                      fill={
                      d.correct ?
                      'var(--chart-2, #006e64)' :
                      'var(--border-control, #c3c4c7)'
                      } />

                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
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