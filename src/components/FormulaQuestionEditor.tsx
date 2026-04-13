import React, { useState } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

// ─── Formula / Calculation Question Editor ──────────────────────────────────
// Source: Dr. Vicky Mody Blackboard demo · Mar 20 · session 2768ba8d
//
// Key insight: "If I have 10 students, 10 students will get different x and
// different y — their answers will be different. This helps with cheating."
//
// ExamSoft does NOT have formula questions.
// D2L BrightSpace has them. This is a Year 1 differentiator.
//
// Architecture:
// - Faculty defines the question stem with variables: {x}, {y}
// - Faculty defines variable ranges (min, max, decimal places)
// - System generates N unique combinations at exam publish time
// - Each student receives a unique instantiation
// - Correct answer is computed from the formula, not hardcoded

interface Variable {
  name: string;
  min: number;
  max: number;
  decimals: number;
  unit?: string;
}
function generateSample(variables: Variable[]): Record<string, number> {
  const result: Record<string, number> = {};
  variables.forEach((v) => {
    const range = v.max - v.min;
    const raw = v.min + Math.random() * range;
    result[v.name] = parseFloat(raw.toFixed(v.decimals));
  });
  return result;
}
function renderStem(stem: string, values: Record<string, number>, units: Record<string, string>) {
  return stem.replace(/\{([a-z])\}/gi, (_, name) => {
    const val = values[name];
    const unit = units[name] || '';
    return val !== undefined ? `${val}${unit ? ' ' + unit : ''}` : `{${name}}`;
  });
}
export function FormulaQuestionEditor() {
  const [stem, setStem] = useState('A patient weighs {x} kg and requires {y} mg/kg of medication. What is the total dose in mg?');
  const [formula, setFormula] = useState('x * y');
  const [variables, setVariables] = useState<Variable[]>([{
    name: 'x',
    min: 50,
    max: 100,
    decimals: 0,
    unit: 'kg'
  }, {
    name: 'y',
    min: 2,
    max: 8,
    decimals: 1,
    unit: 'mg/kg'
  }]);
  const [sampleCount, setSampleCount] = useState(5);
  const [samples, setSamples] = useState<Array<{
    vals: Record<string, number>;
    answer: number | null;
  }>>([]);
  const [rationale, setRationale] = useState('Multiply the patient weight by the dose per kilogram to get total dose.');
  const [showRationale, setShowRationale] = useState(false);
  function computeAnswer(vals: Record<string, number>): number | null {
    try {
      // Safe formula evaluation using Function constructor with variable names as params
      const varNames = Object.keys(vals);
      const varValues = varNames.map((k) => vals[k]);
      // eslint-disable-next-line no-new-func
      const fn = new Function(...varNames, `return ${formula}`);
      const result = fn(...varValues);
      return typeof result === 'number' && isFinite(result) ? parseFloat(result.toFixed(2)) : null;
    } catch {
      return null;
    }
  }
  function regenerate() {
    const units: Record<string, string> = {};
    variables.forEach((v) => {
      if (v.unit) units[v.name] = v.unit;
    });
    const newSamples = Array.from({
      length: sampleCount
    }, () => {
      const vals = generateSample(variables);
      return {
        vals,
        answer: computeAnswer(vals)
      };
    });
    setSamples(newSamples);
  }
  function updateVar(i: number, field: keyof Variable, value: string | number) {
    setVariables((prev) => prev.map((v, idx) => idx === i ? {
      ...v,
      [field]: value
    } : v));
  }
  const units: Record<string, string> = {};
  variables.forEach((v) => {
    if (v.unit) units[v.name] = v.unit;
  });
  const isFormulaValid = computeAnswer(generateSample(variables)) !== null;
  return <div style={{
    padding: 20,
    fontFamily: 'Inter, sans-serif',
    maxWidth: 900,
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  }}>

      {/* Header */}
      <div style={{
      padding: '12px 16px',
      borderRadius: 10,
      background: 'rgba(46,196,160,0.06)',
      border: '1px solid rgba(46,196,160,0.25)',
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start'
    }}>
        <Info style={{
        width: 14,
        height: 14,
        color: '#2ec4a0',
        flexShrink: 0,
        marginTop: 1
      }} />
        <div style={{
        fontSize: 12,
        color: '#0f766e',
        lineHeight: 1.6
      }}>
          <strong>Formula question</strong> — each student receives unique variable values. ExamSoft does not have this.
          D2L BrightSpace does. Anti-cheating by design: 10 students, 10 different calculations.
          <span style={{
          display: 'block',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          color: '#0d9488',
          marginTop: 3
        }}>Source: Dr. Vicky Mody session 2768ba8d</span>
        </div>
      </div>

      {/* Question stem */}
      <div style={{
      background: '#fff',
      border: '1px solid var(--border, #E2E8F0)',
      borderRadius: 12,
      padding: 16
    }}>
        <div style={{
        fontSize: 12,
        fontWeight: 700,
        color: 'var(--text, #0F172A)',
        marginBottom: 8
      }}>Question stem</div>
        <div style={{
        fontSize: 11,
        color: 'var(--text3, #94A3B8)',
        marginBottom: 8
      }}>Use {'{x}'}, {'{y}'} etc. to insert variables. Each student gets unique values.</div>
        <textarea value={stem} onChange={(e) => setStem(e.target.value)} style={{
        width: '100%',
        minHeight: 80,
        padding: '10px 12px',
        fontSize: 13,
        border: '1px solid var(--border, #E2E8F0)',
        borderRadius: 8,
        resize: 'vertical',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        color: 'var(--text, #0F172A)'
      }} />
      </div>

      {/* Variables */}
      <div style={{
      background: '#fff',
      border: '1px solid var(--border, #E2E8F0)',
      borderRadius: 12,
      padding: 16
    }}>
        <div style={{
        fontSize: 12,
        fontWeight: 700,
        color: 'var(--text, #0F172A)',
        marginBottom: 12
      }}>Variable ranges</div>
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr) 28px',
        gap: 8,
        marginBottom: 8
      }}>
          {['Variable', 'Min', 'Max', 'Decimals', 'Unit', ''].map((h) => <div key={h} style={{
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--text3, #94A3B8)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>{h}</div>)}
        </div>
        {variables.map((v, i) => <div key={i} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr) 28px',
        gap: 8,
        marginBottom: 8
      }}>
            <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
              <code style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#6d5ed4',
            padding: '4px 8px',
            background: 'rgba(109,94,212,0.08)',
            borderRadius: 5
          }}>{'{' + v.name + '}'}</code>
            </div>
            {(['min', 'max', 'decimals'] as const).map((field) => <input key={field} type="number" value={v[field]} onChange={(e) => updateVar(i, field, parseFloat(e.target.value) || 0)} style={{
          padding: '6px 8px',
          fontSize: 12,
          border: '1px solid var(--border, #E2E8F0)',
          borderRadius: 7,
          width: '100%',
          boxSizing: 'border-box'
        }} />)}
            <input value={v.unit || ''} onChange={(e) => updateVar(i, 'unit', e.target.value)} placeholder="mg, kg..." style={{
          padding: '6px 8px',
          fontSize: 12,
          border: '1px solid var(--border, #E2E8F0)',
          borderRadius: 7,
          width: '100%',
          boxSizing: 'border-box'
        }} />
            <button onClick={() => setVariables((prev) => prev.filter((_, idx) => idx !== i))} style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          border: '1px solid var(--border, #E2E8F0)',
          background: '#fff',
          cursor: 'pointer',
          color: '#94a3b8',
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>×</button>
          </div>)}
        <button onClick={() => setVariables((prev) => [...prev, {
        name: String.fromCharCode(97 + prev.length),
        min: 1,
        max: 10,
        decimals: 0
      }])} style={{
        marginTop: 4,
        padding: '6px 12px',
        fontSize: 11,
        fontWeight: 600,
        border: '1px dashed var(--border, #E2E8F0)',
        borderRadius: 7,
        background: '#fff',
        cursor: 'pointer',
        color: 'var(--text3, #94A3B8)'
      }}>
          + Add variable
        </button>
      </div>

      {/* Formula */}
      <div style={{
      background: '#fff',
      border: '1px solid var(--border, #E2E8F0)',
      borderRadius: 12,
      padding: 16
    }}>
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
      }}>
          <div style={{
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--text, #0F172A)'
        }}>Answer formula</div>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
            {isFormulaValid ? <><CheckCircle2 style={{
              width: 13,
              height: 13,
              color: '#16a34a'
            }} /><span style={{
              fontSize: 11,
              color: '#16a34a'
            }}>Valid</span></> : <><AlertTriangle style={{
              width: 13,
              height: 13,
              color: '#dc2626'
            }} /><span style={{
              fontSize: 11,
              color: '#dc2626'
            }}>Invalid formula</span></>}
          </div>
        </div>
        <div style={{
        fontSize: 11,
        color: 'var(--text3, #94A3B8)',
        marginBottom: 8
      }}>JavaScript expression using variable names. Example: x * y / 1000</div>
        <input value={formula} onChange={(e) => setFormula(e.target.value)} style={{
        width: '100%',
        padding: '8px 12px',
        fontSize: 13,
        border: '1px solid var(--border, #E2E8F0)',
        borderRadius: 8,
        fontFamily: 'JetBrains Mono, monospace',
        boxSizing: 'border-box'
      }} />
      </div>

      {/* Rationale */}
      <div style={{
      background: '#fff',
      border: '1px solid var(--border, #E2E8F0)',
      borderRadius: 12,
      padding: 16
    }}>
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
      }}>
          <div>
            <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--text, #0F172A)'
          }}>Rationale (optional)</div>
            <div style={{
            fontSize: 11,
            color: 'var(--text3, #94A3B8)'
          }}>Shown to students after submission on formative exams</div>
          </div>
          <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
            <div onClick={() => setShowRationale((p) => !p)} style={{
            width: 36,
            height: 20,
            borderRadius: 10,
            background: showRationale ? '#6d5ed4' : '#CBD5E1',
            position: 'relative',
            cursor: 'pointer',
            flexShrink: 0
          }}>
              <div style={{
              position: 'absolute',
              top: 2,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#fff',
              left: showRationale ? 18 : 2,
              transition: 'left 0.15s'
            }} />
            </div>
            <span style={{
            fontSize: 12,
            color: 'var(--text2, #475569)'
          }}>Show on submit</span>
          </label>
        </div>
        {showRationale && <textarea value={rationale} onChange={(e) => setRationale(e.target.value)} style={{
        width: '100%',
        minHeight: 60,
        padding: '10px 12px',
        fontSize: 12,
        border: '1px solid var(--border, #E2E8F0)',
        borderRadius: 8,
        resize: 'vertical',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        color: 'var(--text, #0F172A)'
      }} />}
      </div>

      {/* Preview generator */}
      <div style={{
      background: '#fff',
      border: '1px solid var(--border, #E2E8F0)',
      borderRadius: 12,
      padding: 16
    }}>
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
      }}>
          <div>
            <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--text, #0F172A)'
          }}>Student preview generator</div>
            <div style={{
            fontSize: 11,
            color: 'var(--text3, #94A3B8)'
          }}>Each row = one unique student's version</div>
          </div>
          <div style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center'
        }}>
            <select value={sampleCount} onChange={(e) => setSampleCount(Number(e.target.value))} style={{
            padding: '5px 8px',
            fontSize: 12,
            border: '1px solid var(--border, #E2E8F0)',
            borderRadius: 7,
            background: '#fff'
          }}>
              {[3, 5, 10].map((n) => <option key={n} value={n}>{n} students</option>)}
            </select>
            <button onClick={regenerate} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 8,
            border: 'none',
            background: '#6d5ed4',
            color: '#fff',
            cursor: 'pointer'
          }}>
              <RefreshCw style={{
              width: 12,
              height: 12
            }} />
              Generate
            </button>
          </div>
        </div>

        {samples.length === 0 && <div style={{
        textAlign: 'center',
        padding: '24px 0',
        color: 'var(--text3, #94A3B8)',
        fontSize: 13
      }}>Click Generate to preview unique student versions</div>}

        {samples.map((s, i) => <div key={i} style={{
        padding: '12px 14px',
        borderRadius: 9,
        background: 'var(--bg2, #F8FAFC)',
        marginBottom: 8,
        border: '1px solid var(--border, #E2E8F0)'
      }}>
            <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 6
        }}>
              <span style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--text3, #94A3B8)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>Student {i + 1}</span>
              {s.answer !== null ? <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#16a34a',
            fontFamily: 'JetBrains Mono, monospace'
          }}>Answer: {s.answer}</span> : <span style={{
            fontSize: 11,
            color: '#dc2626'
          }}>Formula error</span>}
            </div>
            <div style={{
          fontSize: 13,
          color: 'var(--text, #0F172A)',
          lineHeight: 1.6
        }}>{renderStem(stem, s.vals, units)}</div>
            {showRationale && <div style={{
          marginTop: 8,
          padding: '6px 10px',
          borderRadius: 7,
          background: 'rgba(109,94,212,0.06)',
          border: '1px solid rgba(109,94,212,0.15)',
          fontSize: 11,
          color: '#4c1d95',
          fontStyle: 'italic'
        }}>{rationale}</div>}
          </div>)}
      </div>
    </div>;
}