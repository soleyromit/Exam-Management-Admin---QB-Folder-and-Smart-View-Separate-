import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  ArrowRight,
  ExternalLink } from
'lucide-react';
/* ══ BLUEPRINT BUILDER — Exam pipeline "Define" stage ══
   Mental model: Blueprint is the pipeline configuration.
   Each content area is a constraint that the exam must satisfy.
   Graph nav: clicking "Add" opens QB filtered to that content area's tags.
   
   Each row: WHAT (category + target/actual) / WHY (gap or surplus) / DO (add from bank, AI fill) */
const AREAS = [
{
  cat: 'Cardiovascular',
  target: 16,
  actual: 18,
  standard: 'NCCPA-CV'
},
{
  cat: 'Pulmonary',
  target: 12,
  actual: 12,
  standard: 'NCCPA-PL'
},
{
  cat: 'Gastrointestinal',
  target: 10,
  actual: 8,
  standard: 'NCCPA-GI'
},
{
  cat: 'Musculoskeletal',
  target: 10,
  actual: 10,
  standard: 'NCCPA-MSK'
},
{
  cat: 'Neurologic',
  target: 8,
  actual: 6,
  standard: 'NCCPA-NR'
},
{
  cat: 'Psychiatry',
  target: 8,
  actual: 8,
  standard: 'NCCPA-PS'
},
{
  cat: 'Dermatologic',
  target: 6,
  actual: 7,
  standard: 'NCCPA-DM'
},
{
  cat: 'Endocrine',
  target: 6,
  actual: 5,
  standard: 'NCCPA-EN'
},
{
  cat: 'EENT',
  target: 6,
  actual: 6,
  standard: 'NCCPA-EE'
},
{
  cat: 'Renal / Urinary',
  target: 6,
  actual: 4,
  standard: 'NCCPA-RU'
},
{
  cat: 'Reproductive',
  target: 6,
  actual: 6,
  standard: 'NCCPA-RP'
},
{
  cat: 'Hematologic',
  target: 6,
  actual: 6,
  standard: 'NCCPA-HM'
}];

export function BlueprintBuilder() {
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };
  const totalT = AREAS.reduce((a, r) => a + r.target, 0);
  const totalA = AREAS.reduce((a, r) => a + r.actual, 0);
  const gaps = AREAS.filter((r) => r.actual < r.target);
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
            
            Exam Blueprint
          </h1>
          <p
            style={{
              fontSize: 12,
              color: 'var(--muted-foreground)'
            }}>
            
            NCCPA content blueprint · CV Pharmacology Midterm 2026
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 8
          }}>
          
          <button
            onClick={() =>
            showToast(
              `Leo is selecting questions to fill ${gaps.length} gaps...`
            )
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '7px 12px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--sidebar-border, #e3e3f5)',
              background: 'var(--sidebar-accent, #ebebfd)',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--brand)',
              cursor: 'pointer'
            }}>
            
            <Sparkles
              style={{
                width: 14,
                height: 14
              }} />
            {' '}
            AI auto-fill gaps
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
            
            <CheckCircle2
              style={{
                width: 14,
                height: 14
              }} />
            {' '}
            Save blueprint
          </button>
        </div>
      </div>

      {/* KPI + AI */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1.3fr',
          gap: 12,
          marginBottom: 20
        }}>
        
        {[
        {
          l: 'Target',
          v: totalT
        },
        {
          l: 'Filled',
          v: totalA,
          c: totalA >= totalT ? '#16a34a' : '#ca8a04'
        },
        {
          l: 'Coverage',
          v: `${Math.round(totalA / totalT * 100)}%`
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
            
              {m.l}
            </div>
            <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 24,
              fontWeight: 600,
              color: (m as any).c || 'var(--foreground)',
              lineHeight: 1
            }}>
            
              {m.v}
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
                background: gaps.length > 0 ? '#fef9c3' : '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
              
              {gaps.length > 0 ?
              <AlertCircle
                style={{
                  width: 12,
                  height: 12,
                  color: 'var(--warning)'
                }} /> :


              <CheckCircle2
                style={{
                  width: 12,
                  height: 12,
                  color: 'var(--success)'
                }} />

              }
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  marginBottom: 2
                }}>
                
                {gaps.length} areas need questions
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--muted-foreground)',
                  lineHeight: 1.4
                }}>
                
                {gaps.
                map((g) => `${g.cat} (-${g.target - g.actual})`).
                join(', ')}
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

      {/* Table */}
      <div
        style={{
          background: 'var(--card)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: 'var(--card-ring, 0 0 0 1px rgba(0,0,0,0.08))'
        }}>
        
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 70px 70px 120px 50px 70px 80px',
            alignItems: 'center',
            padding: '0 16px',
            height: 44,
            borderBottom: '1px solid var(--border)'
          }}>
          
          {[
          'Content Area',
          'Target',
          'Actual',
          'Fill',
          'Gap',
          'Standard',
          'Action'].
          map((h) =>
          <div
            key={h}
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--muted-foreground)',
              textAlign: h === 'Action' ? 'right' : undefined
            }}>
            
              {h}
            </div>
          )}
        </div>
        {AREAS.map((r, i) => {
          const short = r.actual < r.target;
          const over = r.actual > r.target;
          return (
            <div
              key={r.cat}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 70px 70px 120px 50px 70px 80px',
                alignItems: 'center',
                padding: '0 16px',
                height: 48,
                borderBottom:
                i < AREAS.length - 1 ? '1px solid var(--border)' : 'none',
                borderLeft: short ?
                '2px solid var(--destructive)' :
                '2px solid transparent',
                background: short ? '#fef2f2' : 'transparent'
              }}>
              
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}>
                
                {r.cat}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--muted-foreground)',
                  textAlign: 'center'
                }}>
                
                {r.target}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  color: short ?
                  'var(--destructive)' :
                  over ?
                  '#ca8a04' :
                  'var(--foreground)',
                  textAlign: 'center'
                }}>
                
                {r.actual}
              </div>
              <div>
                <div
                  style={{
                    height: 3,
                    borderRadius: 2,
                    background: 'var(--muted)',
                    overflow: 'hidden'
                  }}>
                  
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 2,
                      width: `${Math.min(100, Math.round(r.actual / r.target * 100))}%`,
                      background: short ?
                      'var(--destructive)' :
                      over ?
                      '#ca8a04' :
                      '#16a34a'
                    }} />
                  
                </div>
              </div>
              <div
                style={{
                  textAlign: 'center'
                }}>
                
                {!short && !over &&
                <CheckCircle2
                  style={{
                    width: 13,
                    height: 13,
                    color: '#16a34a'
                  }} />

                }
                {short &&
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--destructive)'
                  }}>
                  
                    -{r.target - r.actual}
                  </span>
                }
                {over &&
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#ca8a04'
                  }}>
                  
                    +{r.actual - r.target}
                  </span>
                }
              </div>
              {/* Graph nav: standard code links to curriculum mapping */}
              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--brand)',
                    cursor: 'pointer'
                  }}>
                  
                  {r.standard}
                </span>
              </div>
              <div
                style={{
                  textAlign: 'right'
                }}>
                
                {short &&
                <button
                  onClick={() =>
                  showToast(`Opening Question Bank filtered to ${r.cat}...`)
                  }
                  style={{
                    padding: '3px 8px',
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
                }
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