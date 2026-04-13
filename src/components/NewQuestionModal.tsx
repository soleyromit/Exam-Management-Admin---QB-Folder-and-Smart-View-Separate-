import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  ChevronDown,
  Folder,
  Plus,
  Trash2,
  GripVertical,
  Check,
  Image,
  Video,
  FileText,
  Hash,
  Bold,
  Italic,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Lock,
  Zap,
  Users,
  BookOpen,
  Target,
  Link2,
  ChevronRight,
  Info,
  AlertCircle,
  Save,
  Send } from
'lucide-react';
type QType =
'MCQ' |
'MSQ' |
'TF' |
'Fill blank' |
'Essay' |
'Hotspot' |
'Matching' |
'Ordering' |
'Case Study';
const TYPE_OPTIONS: Array<{
  value: QType;
  label: string;
  desc: string;
  group: string;
}> = [
{
  value: 'MCQ',
  label: 'Multiple Choice (MCQ)',
  desc: 'One correct answer from 4+ options',
  group: 'Objective'
},
{
  value: 'MSQ',
  label: 'Multiple Select (MSQ)',
  desc: 'Two or more correct answers',
  group: 'Objective'
},
{
  value: 'TF',
  label: 'True / False',
  desc: 'Simple binary judgment',
  group: 'Objective'
},
{
  value: 'Matching',
  label: 'Matching',
  desc: 'Pair premises with responses',
  group: 'Objective'
},
{
  value: 'Ordering',
  label: 'Ordering / Sequencing',
  desc: 'Arrange steps in correct order',
  group: 'Structured'
},
{
  value: 'Fill blank',
  label: 'Fill in the Blank',
  desc: 'Type missing term(s)',
  group: 'Structured'
},
{
  value: 'Essay',
  label: 'Essay / Short Answer',
  desc: 'Free text with rubric scoring',
  group: 'Open-ended'
},
{
  value: 'Hotspot',
  label: 'Hotspot',
  desc: 'Click correct region on an image',
  group: 'Visual'
},
{
  value: 'Case Study',
  label: 'Case Study',
  desc: 'Passage with multiple sub-questions',
  group: 'Complex'
}];

const BLOOMS = [
'Remember',
'Understand',
'Apply',
'Analyze',
'Evaluate',
'Create'];

const DIFFS = ['Easy', 'Medium', 'Hard'];
const TOPICS = [
'Pharmacology',
'Cardiology',
'Anatomy',
'Physiology',
'Pathology',
'Microbiology'];

const DIFF_COLOR: Record<string, string> = {
  Easy: '#15803d',
  Medium: '#92400e',
  Hard: '#991b1b'
};
const DIFF_BG: Record<string, string> = {
  Easy: '#dcfce7',
  Medium: '#fef3c7',
  Hard: '#fee2e2'
};
function mkId() {
  return Math.random().toString(36).slice(2, 8);
}
// ─── TYPE DROPDOWN ─────────────────────────────────────────────────────────────────────────
function TypeDropdown({
  value,
  onChange,
  locked




}: {value: QType;onChange: (t: QType) => void;locked: boolean;}) {
  const [open, setOpen] = useState(false);
  const selected = TYPE_OPTIONS.find((t) => t.value === value)!;
  const groups = [...new Set(TYPE_OPTIONS.map((t) => t.group))];
  return (
    <div
      style={{
        position: 'relative'
      }}>
      
      <button
        onClick={() => !locked && setOpen((o) => !o)}
        disabled={locked}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '10px 14px',
          borderRadius: 8,
          border:
          '1.5px solid ' + (open ? 'var(--brand)' : 'var(--border-control)'),
          background: 'var(--card)',
          cursor: locked ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          opacity: locked ? 0.6 : 1
        }}>
        
        <div
          style={{
            flex: 1
          }}>
          
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--foreground)',
              lineHeight: 1.3
            }}>
            
            {selected.label}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text3)',
              marginTop: 1
            }}>
            
            {selected.desc}
          </div>
        </div>
        {locked ?
        <Lock
          size={14}
          style={{
            color: 'var(--text3)',
            flexShrink: 0
          }} /> :


        <ChevronDown
          size={15}
          style={{
            color: 'var(--text3)',
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform .15s'
          }} />

        }
      </button>
      {open &&
      <>
          <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9991
          }} />
        
          <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
            zIndex: 9992,
            overflow: 'hidden',
            maxHeight: 360,
            overflowY: 'auto'
          }}>
          
            {groups.map((g) =>
          <div key={g}>
                <div
              style={{
                padding: '8px 14px 4px',
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text3)',
                background: 'var(--surface)'
              }}>
              
                  {g}
                </div>
                {TYPE_OPTIONS.filter((t) => t.group === g).map((t) =>
            <button
              key={t.value}
              onClick={() => {
                onChange(t.value);
                setOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '10px 14px',
                background:
                t.value === value ? 'var(--brand-tint)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
              }}
              onMouseEnter={(e) =>
              e.currentTarget.style.background = 'var(--surface2)'
              }
              onMouseLeave={(e) =>
              e.currentTarget.style.background =
              t.value === value ? 'var(--brand-tint)' : 'transparent'
              }>
              
                    <div
                style={{
                  flex: 1
                }}>
                
                      <div
                  style={{
                    fontSize: 14,
                    fontWeight: t.value === value ? 600 : 400,
                    color:
                    t.value === value ?
                    'var(--brand)' :
                    'var(--foreground)'
                  }}>
                  
                        {t.label}
                      </div>
                      <div
                  style={{
                    fontSize: 12,
                    color: 'var(--text3)',
                    marginTop: 1
                  }}>
                  
                        {t.desc}
                      </div>
                    </div>
                    {t.value === value &&
              <Check
                size={14}
                style={{
                  color: 'var(--brand)',
                  flexShrink: 0
                }} />

              }
                  </button>
            )}
              </div>
          )}
          </div>
        </>
      }
    </div>);

}
// ─── SECTION WRAPPER ─────────────────────────────────────────────────────────────────────────
function Section({
  step,
  title,
  done,
  children





}: {step: number;title: string;done: boolean;children: React.ReactNode;}) {
  return (
    <div
      style={{
        marginBottom: 20
      }}>
      
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10
        }}>
        
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: done ? '#16a34a' : 'var(--surface2)',
            border:
            '1.5px solid ' + (done ? '#16a34a' : 'var(--border-control)'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
          
          {done ?
          <Check
            size={11}
            style={{
              color: '#fff'
            }} /> :


          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text3)'
            }}>
            
              {step}
            </span>
          }
        </div>
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: done ? 'var(--foreground)' : 'var(--text2)'
          }}>
          
          {title}
        </span>
      </div>
      <div
        style={{
          paddingLeft: 30
        }}>
        
        {children}
      </div>
    </div>);

}
// ─── ANSWER CHOICE BUILDER ───────────────────────────────────────────────────
interface Choice {
  id: string;
  text: string;
  correct: boolean;
  rationale: string;
}
function ChoiceBuilder({
  multi,
  choices,
  onChange




}: {multi: boolean;choices: Choice[];onChange: (c: Choice[]) => void;}) {
  const [rationaleMode, setRationaleMode] = useState<'shared' | 'per-option'>(
    'shared'
  );
  const [sharedRationale, setSharedRationale] = useState('');
  const toggle = (id: string) =>
  onChange(
    multi ?
    choices.map((c) =>
    c.id === id ?
    {
      ...c,
      correct: !c.correct
    } :
    c
    ) :
    choices.map((c) => ({
      ...c,
      correct: c.id === id
    }))
  );
  const correctCount = choices.filter((c) => c.correct).length;
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10
        }}>
        
        <span
          style={{
            fontSize: 13,
            color: 'var(--text3)'
          }}>
          
          {multi ? 'Select all that apply' : 'Select one correct answer'}
          {correctCount > 0 &&
          <span
            style={{
              marginLeft: 8,
              padding: '1px 8px',
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 600,
              background: '#dcfce7',
              color: '#15803d'
            }}>
            
              {correctCount} correct
            </span>
          }
        </span>
        <div
          style={{
            display: 'flex',
            gap: 2,
            padding: '2px 3px',
            borderRadius: 8,
            background: 'var(--surface)',
            border: '1px solid var(--border-control)'
          }}>
          
          {(['shared', 'per-option'] as const).map((m) =>
          <button
            key={m}
            onClick={() => setRationaleMode(m)}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: rationaleMode === m ? 600 : 400,
              background: rationaleMode === m ? 'var(--card)' : 'transparent',
              color:
              rationaleMode === m ? 'var(--foreground)' : 'var(--text3)',
              border: 'none',
              cursor: 'pointer'
            }}>
            
              {m === 'shared' ? 'Shared rationale' : 'Per-option'}
            </button>
          )}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: rationaleMode === 'per-option' ? 10 : 6
        }}>
        
        {choices.map((c, i) =>
        <div
          key={c.id}
          style={{
            borderRadius: 8,
            border:
            '1.5px solid ' + (
            c.correct ? '#16a34a' : 'var(--border-control)'),
            background: 'var(--card)',
            overflow: 'hidden'
          }}>
          
            <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              background: c.correct ? '#f0fdf4' : 'var(--card)'
            }}>
            
              <GripVertical
              size={14}
              style={{
                color: 'var(--text3)',
                flexShrink: 0,
                cursor: 'grab',
                opacity: 0.5
              }} />
            
              <button
              onClick={() => toggle(c.id)}
              style={{
                width: 18,
                height: 18,
                borderRadius: multi ? 4 : '50%',
                border:
                '2px solid ' + (
                c.correct ? '#16a34a' : 'var(--border-control)'),
                background: c.correct ? '#16a34a' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                padding: 0
              }}>
              
                {c.correct &&
              <Check
                size={10}
                style={{
                  color: '#fff'
                }} />

              }
              </button>
              <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--text3)',
                fontFamily: 'monospace',
                flexShrink: 0,
                width: 16
              }}>
              
                {String.fromCharCode(65 + i)}
              </span>
              <input
              value={c.text}
              onChange={(e) =>
              onChange(
                choices.map((x) =>
                x.id === c.id ?
                {
                  ...x,
                  text: e.target.value
                } :
                x
                )
              )
              }
              placeholder={`Option ${String.fromCharCode(65 + i)}`}
              style={{
                flex: 1,
                fontSize: 14,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--foreground)',
                fontFamily: 'var(--font-ui)'
              }} />
            
              {c.correct &&
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: '#15803d',
                flexShrink: 0
              }}>
              
                  Correct
                </span>
            }
              {choices.length > 2 &&
            <button
              onClick={() => onChange(choices.filter((x) => x.id !== c.id))}
              style={{
                padding: 3,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--text3)',
                display: 'flex',
                flexShrink: 0
              }}>
              
                  <X size={13} />
                </button>
            }
            </div>
            {rationaleMode === 'per-option' &&
          <div
            style={{
              padding: '8px 12px 10px',
              borderTop: '1px solid var(--border)',
              background: 'var(--surface)'
            }}>
            
                <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: c.correct ? '#15803d' : 'var(--text3)',
                marginBottom: 5
              }}>
              
                  {c.correct ?
              'Why this is correct' :
              'Why this is a distractor'}
                </div>
                <textarea
              value={c.rationale}
              onChange={(e) =>
              onChange(
                choices.map((x) =>
                x.id === c.id ?
                {
                  ...x,
                  rationale: e.target.value
                } :
                x
                )
              )
              }
              placeholder="Explain this option for students..."
              rows={2}
              style={{
                width: '100%',
                fontSize: 13,
                lineHeight: 1.55,
                color: 'var(--foreground)',
                background: 'var(--card)',
                border: '1px solid var(--border-control)',
                borderRadius: 6,
                padding: '7px 10px',
                outline: 'none',
                resize: 'none',
                fontFamily: 'var(--font-ui)',
                boxSizing: 'border-box'
              }} />
            
              </div>
          }
          </div>
        )}
      </div>
      <button
        onClick={() =>
        onChange([
        ...choices,
        {
          id: mkId(),
          text: '',
          correct: false,
          rationale: ''
        }]
        )
        }
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 8,
          padding: '6px 12px',
          fontSize: 13,
          color: 'var(--text3)',
          background: 'transparent',
          border: '1px dashed var(--border-control)',
          borderRadius: 6,
          cursor: 'pointer',
          fontFamily: 'var(--font-ui)'
        }}
        onMouseEnter={(e) =>
        e.currentTarget.style.background = 'var(--surface2)'
        }
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
        
        <Plus size={13} />
        Add option
      </button>
      {rationaleMode === 'shared' &&
      <div
        style={{
          marginTop: 14,
          padding: '12px 14px',
          borderRadius: 8,
          background: 'var(--surface)',
          border: '1px solid var(--border)'
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
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text2)',
              flex: 1
            }}>
            
              Explanation / Rationale
            </span>
            <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 6,
              background: 'oklch(0.38 0.10 286)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500
            }}>
            
              <Sparkles size={11} />
              Generate with Leo
            </button>
          </div>
          <textarea
          value={sharedRationale}
          onChange={(e) => setSharedRationale(e.target.value)}
          placeholder="Explain why the correct answer is correct and why the distractors are incorrect. This shows to students after submission."
          rows={3}
          style={{
            width: '100%',
            fontSize: 14,
            lineHeight: 1.6,
            color: 'var(--foreground)',
            background: 'var(--card)',
            border: '1px solid var(--border-control)',
            borderRadius: 6,
            padding: '8px 12px',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'var(--font-ui)',
            boxSizing: 'border-box'
          }} />
        
        </div>
      }
    </div>);

}
// ─── RUBRIC BUILDER (for Essay, and all other types in advanced mode) ───────────────────────────────────────────────────────
function RubricBuilder({
  rubric,
  onChange











}: {rubric: {id: string;criterion: string;}[];onChange: (r: {id: string;criterion: string;}[]) => void;}) {
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 32px',
          gap: 6,
          marginBottom: 6,
          padding: '0 0 4px'
        }}>
        
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text3)'
          }}>
          
          Scoring Criterion
        </span>
        <span />
      </div>
      {rubric.map((row) =>
      <div
        key={row.id}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 32px',
          gap: 6,
          alignItems: 'center',
          marginBottom: 6
        }}>
        
          <input
          value={row.criterion}
          onChange={(e) =>
          onChange(
            rubric.map((r) =>
            r.id === row.id ?
            {
              ...r,
              criterion: e.target.value
            } :
            r
            )
          )
          }
          placeholder="e.g. Clinical reasoning"
          style={{
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid var(--border-control)',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'var(--font-ui)',
            color: 'var(--foreground)'
          }} />
        
          {rubric.length > 1 &&
        <button
          onClick={() => onChange(rubric.filter((r) => r.id !== row.id))}
          style={{
            padding: 5,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#991b1b',
            display: 'flex',
            borderRadius: 4
          }}>
          
              <Trash2 size={13} />
            </button>
        }
        </div>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 4
        }}>
        
        <button
          onClick={() =>
          onChange([
          ...rubric,
          {
            id: mkId(),
            criterion: ''
          }]
          )
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 12px',
            fontSize: 13,
            color: 'var(--text3)',
            background: 'transparent',
            border: '1px dashed var(--border-control)',
            borderRadius: 6,
            cursor: 'pointer'
          }}
          onMouseEnter={(e) =>
          e.currentTarget.style.background = 'var(--surface2)'
          }
          onMouseLeave={(e) =>
          e.currentTarget.style.background = 'transparent'
          }>
          
          <Plus size={13} />
          Add criterion
        </button>
        <span
          style={{
            fontSize: 11,
            color: 'var(--muted-foreground)',
            fontStyle: 'italic'
          }}>
          
          Points assigned during exam assembly
        </span>
      </div>
    </div>);

}
// ─── FILL BLANK BUILDER ───────────────────────────────────────────────────────────────
function FillBlankBuilder({
  blanks,
  onChange













}: {blanks: {id: string;answer: string;caseSensitive: boolean;}[];onChange: (b: {id: string;answer: string;caseSensitive: boolean;}[]) => void;}) {
  return (
    <div>
      <div
        style={{
          padding: '10px 12px',
          borderRadius: 8,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          marginBottom: 10,
          fontSize: 13,
          color: 'var(--text3)',
          lineHeight: 1.5
        }}>
        
        <strong
          style={{
            color: 'var(--text2)'
          }}>
          
          How it works:
        </strong>{' '}
        Use{' '}
        <code
          style={{
            background: 'var(--surface2)',
            padding: '1px 5px',
            borderRadius: 3,
            fontSize: 12,
            color: 'var(--brand)'
          }}>
          
          ___
        </code>{' '}
        in your stem to mark blanks. Define the accepted answer(s) for each
        blank below. Students type their answers.
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
        
        {blanks.map((b, i) =>
        <div
          key={b.id}
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid var(--border-control)',
            background: 'var(--card)'
          }}>
          
            <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text3)',
              marginBottom: 6
            }}>
            
              Blank {i + 1}
            </div>
            <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center'
            }}>
            
              <input
              value={b.answer}
              onChange={(e) =>
              onChange(
                blanks.map((x) =>
                x.id === b.id ?
                {
                  ...x,
                  answer: e.target.value
                } :
                x
                )
              )
              }
              placeholder="Accepted answer(s), comma-separated"
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 6,
                border: '1px solid var(--border-control)',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'var(--font-ui)',
                color: 'var(--foreground)'
              }} />
            
              <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 13,
                color: 'var(--text2)',
                cursor: 'pointer',
                flexShrink: 0
              }}>
              
                <input
                type="checkbox"
                checked={b.caseSensitive}
                onChange={(e) =>
                onChange(
                  blanks.map((x) =>
                  x.id === b.id ?
                  {
                    ...x,
                    caseSensitive: e.target.checked
                  } :
                  x
                  )
                )
                }
                style={{
                  width: 14,
                  height: 14,
                  cursor: 'pointer'
                }} />
              
                Case-sensitive
              </label>
              {blanks.length > 1 &&
            <button
              onClick={() => onChange(blanks.filter((x) => x.id !== b.id))}
              style={{
                padding: 5,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#991b1b',
                display: 'flex',
                borderRadius: 4
              }}>
              
                  <Trash2 size={13} />
                </button>
            }
            </div>
          </div>
        )}
      </div>
      <button
        onClick={() =>
        onChange([
        ...blanks,
        {
          id: mkId(),
          answer: '',
          caseSensitive: false
        }]
        )
        }
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          marginTop: 8,
          padding: '6px 12px',
          fontSize: 13,
          color: 'var(--text3)',
          background: 'transparent',
          border: '1px dashed var(--border-control)',
          borderRadius: 6,
          cursor: 'pointer'
        }}
        onMouseEnter={(e) =>
        e.currentTarget.style.background = 'var(--surface2)'
        }
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
        
        <Plus size={13} />
        Add blank
      </button>
    </div>);

}
// ─── MATCHING BUILDER ───────────────────────────────────────────────────────────────
function MatchingBuilder({
  pairs,
  onChange













}: {pairs: {id: string;left: string;right: string;}[];onChange: (p: {id: string;left: string;right: string;}[]) => void;}) {
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 32px 1fr 32px',
          gap: 8,
          marginBottom: 6
        }}>
        
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text3)'
          }}>
          
          Premise (left)
        </div>
        <div />
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text3)'
          }}>
          
          Response (right)
        </div>
        <div />
      </div>
      {pairs.map((p, i) =>
      <div
        key={p.id}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 32px 1fr 32px',
          gap: 8,
          alignItems: 'center',
          marginBottom: 8
        }}>
        
          <input
          value={p.left}
          onChange={(e) =>
          onChange(
            pairs.map((x) =>
            x.id === p.id ?
            {
              ...x,
              left: e.target.value
            } :
            x
            )
          )
          }
          placeholder={`Premise ${i + 1}`}
          style={{
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid var(--border-control)',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'var(--font-ui)',
            color: 'var(--foreground)'
          }} />
        
          <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text3)'
          }}>
          
            <ArrowRight size={14} />
          </div>
          <input
          value={p.right}
          onChange={(e) =>
          onChange(
            pairs.map((x) =>
            x.id === p.id ?
            {
              ...x,
              right: e.target.value
            } :
            x
            )
          )
          }
          placeholder={`Response ${i + 1}`}
          style={{
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid var(--border-control)',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'var(--font-ui)',
            background: '#f0fdf4',
            borderColor: '#bbf7d0',
            color: 'var(--foreground)'
          }} />
        
          {pairs.length > 2 &&
        <button
          onClick={() => onChange(pairs.filter((x) => x.id !== p.id))}
          style={{
            padding: 5,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#991b1b',
            display: 'flex',
            borderRadius: 4,
            justifyContent: 'center'
          }}>
          
              <Trash2 size={13} />
            </button>
        }
        </div>
      )}
      <button
        onClick={() =>
        onChange([
        ...pairs,
        {
          id: mkId(),
          left: '',
          right: ''
        }]
        )
        }
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '6px 12px',
          fontSize: 13,
          color: 'var(--text3)',
          background: 'transparent',
          border: '1px dashed var(--border-control)',
          borderRadius: 6,
          cursor: 'pointer'
        }}
        onMouseEnter={(e) =>
        e.currentTarget.style.background = 'var(--surface2)'
        }
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
        
        <Plus size={13} />
        Add pair
      </button>
    </div>);

}
// ─── ORDERING BUILDER ───────────────────────────────────────────────────────────────
function OrderingBuilder({
  items,
  onChange











}: {items: {id: string;text: string;}[];onChange: (i: {id: string;text: string;}[]) => void;}) {
  return (
    <div>
      <p
        style={{
          fontSize: 13,
          color: 'var(--text3)',
          marginBottom: 10,
          lineHeight: 1.5
        }}>
        
        Enter steps in the{' '}
        <strong
          style={{
            color: 'var(--text2)'
          }}>
          
          correct order
        </strong>
        . Students will see them shuffled.
      </p>
      {items.map((item, i) =>
      <div
        key={item.id}
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          marginBottom: 8
        }}>
        
          <div
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'var(--brand)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0
          }}>
          
            {i + 1}
          </div>
          <GripVertical
          size={14}
          style={{
            color: 'var(--text3)',
            cursor: 'grab',
            flexShrink: 0,
            opacity: 0.5
          }} />
        
          <input
          value={item.text}
          onChange={(e) =>
          onChange(
            items.map((x) =>
            x.id === item.id ?
            {
              ...x,
              text: e.target.value
            } :
            x
            )
          )
          }
          placeholder={`Step ${i + 1}`}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid var(--border-control)',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'var(--font-ui)',
            color: 'var(--foreground)'
          }} />
        
          {items.length > 2 &&
        <button
          onClick={() => onChange(items.filter((x) => x.id !== item.id))}
          style={{
            padding: 5,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#991b1b',
            display: 'flex',
            borderRadius: 4
          }}>
          
              <Trash2 size={13} />
            </button>
        }
        </div>
      )}
      <button
        onClick={() =>
        onChange([
        ...items,
        {
          id: mkId(),
          text: ''
        }]
        )
        }
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '6px 12px',
          fontSize: 13,
          color: 'var(--text3)',
          background: 'transparent',
          border: '1px dashed var(--border-control)',
          borderRadius: 6,
          cursor: 'pointer'
        }}
        onMouseEnter={(e) =>
        e.currentTarget.style.background = 'var(--surface2)'
        }
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
        
        <Plus size={13} />
        Add step
      </button>
    </div>);

}
// ─── FOLDER PICKER ───────────────────────────────────────────────────────────────
const FOLDER_OPTIONS = [
{
  id: 'cv-pharm',
  label: 'CV Pharmacology',
  group: 'My Folders'
},
{
  id: 'renal',
  label: 'Renal',
  group: 'My Folders'
},
{
  id: 'anatomy-all',
  label: 'Clinical Anatomy',
  group: 'My Folders'
},
{
  id: 'shared-nursing',
  label: 'Nursing Dept Bank',
  group: 'Shared With Me'
}];

function FolderSelect({
  value,
  onChange



}: {value: string;onChange: (v: string, label: string) => void;}) {
  const [open, setOpen] = useState(false);
  const selected = FOLDER_OPTIONS.find((f) => f.id === value);
  const groups = [...new Set(FOLDER_OPTIONS.map((f) => f.group))];
  return (
    <div
      style={{
        position: 'relative'
      }}>
      
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '9px 12px',
          borderRadius: 8,
          border: '1px solid var(--border-control)',
          background: 'var(--card)',
          cursor: 'pointer',
          textAlign: 'left'
        }}>
        
        <Folder
          size={14}
          style={{
            color: 'var(--text3)',
            flexShrink: 0
          }} />
        
        <span
          style={{
            flex: 1,
            fontSize: 14,
            color: selected ? 'var(--foreground)' : 'var(--text3)',
            fontWeight: selected ? 500 : 400
          }}>
          
          {selected?.label || 'Select a folder'}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: 'var(--text3)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform .15s'
          }} />
        
      </button>
      {open &&
      <>
          <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9991
          }} />
        
          <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
            zIndex: 9992,
            overflow: 'hidden'
          }}>
          
            {groups.map((g) =>
          <div key={g}>
                <div
              style={{
                padding: '6px 12px 3px',
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text3)',
                background: 'var(--surface)'
              }}>
              
                  {g}
                </div>
                {FOLDER_OPTIONS.filter((f) => f.group === g).map((f) =>
            <button
              key={f.id}
              onClick={() => {
                onChange(f.id, f.label);
                setOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '9px 12px',
                background:
                f.id === value ? 'var(--brand-tint)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                color:
                f.id === value ? 'var(--brand)' : 'var(--foreground)',
                textAlign: 'left'
              }}
              onMouseEnter={(e) =>
              e.currentTarget.style.background = 'var(--surface2)'
              }
              onMouseLeave={(e) =>
              e.currentTarget.style.background =
              f.id === value ? 'var(--brand-tint)' : 'transparent'
              }>
              
                    <Folder
                size={13}
                style={{
                  color: f.id === value ? 'var(--brand)' : 'var(--text3)'
                }} />
              
                    {f.label}
                    {f.id === value &&
              <Check
                size={13}
                style={{
                  marginLeft: 'auto',
                  color: 'var(--brand)'
                }} />

              }
                  </button>
            )}
              </div>
          )}
          </div>
        </>
      }
    </div>);

}
// ─── COLLABORATOR DROPDOWN ────────────────────────────────────────────────────
const PEOPLE = [
{
  id: 'dk',
  name: 'Dr. Kim',
  initials: 'DK'
},
{
  id: 'dn',
  name: 'Dr. Nguyen',
  initials: 'DN'
},
{
  id: 'dc',
  name: 'Dr. Chen',
  initials: 'DC'
}];

function CollabDropdown({
  selected,
  onChange



}: {selected: string[];onChange: (v: string[]) => void;}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const filtered = PEOPLE.filter(
    (p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) &&
    !selected.includes(p.id)
  );
  return (
    <div
      style={{
        position: 'relative'
      }}>
      
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
          minHeight: 40,
          padding: '6px 10px',
          borderRadius: 8,
          border: '1px solid var(--border-control)',
          background: 'var(--card)',
          cursor: 'pointer'
        }}>
        
        {selected.map((id) => {
          const p = PEOPLE.find((x) => x.id === id)!;
          return (
            <span
              key={id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 500,
                background: 'var(--brand-tint)',
                color: 'var(--brand)'
              }}>
              
              {p.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(selected.filter((x) => x !== id));
                }}
                style={{
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--brand)',
                  display: 'flex'
                }}>
                
                <X size={11} />
              </button>
            </span>);

        })}
        <span
          style={{
            fontSize: 14,
            color: 'var(--text3)',
            flex: 1
          }}>
          
          Add collaborator...
        </span>
        <Users
          size={14}
          style={{
            color: 'var(--text3)',
            flexShrink: 0
          }} />
        
      </div>
      {open &&
      <>
          <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9991
          }} />
        
          <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
            zIndex: 9992,
            overflow: 'hidden'
          }}>
          
            <div
            style={{
              padding: 8
            }}>
            
              <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people..."
              autoFocus
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: 6,
                border: '1px solid var(--border-control)',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'var(--font-ui)'
              }} />
            
            </div>
            {filtered.map((p) =>
          <button
            key={p.id}
            onClick={() => {
              onChange([...selected, p.id]);
              setQuery('');
              setOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '9px 12px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              color: 'var(--foreground)',
              textAlign: 'left'
            }}
            onMouseEnter={(e) =>
            e.currentTarget.style.background = 'var(--surface2)'
            }
            onMouseLeave={(e) =>
            e.currentTarget.style.background = 'transparent'
            }>
            
                <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--brand-tint)',
                color: 'var(--brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0
              }}>
              
                  {p.initials}
                </div>
                {p.name}
              </button>
          )}
            {filtered.length === 0 &&
          <div
            style={{
              padding: '10px 14px',
              fontSize: 13,
              color: 'var(--text3)'
            }}>
            
                No people found
              </div>
          }
            <div
            style={{
              borderTop: '1px solid var(--border)',
              padding: '8px 12px'
            }}>
            
              <input
              placeholder="Invite by email address"
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: 6,
                border: '1px solid var(--border-control)',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'var(--font-ui)',
                color: 'var(--foreground)'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setOpen(false);
              }} />
            
            </div>
          </div>
        </>
      }
    </div>);

}
// ─── MAIN MODAL ───────────────────────────────────────────────────────────────
export function NewQuestionModal({
  onClose,
  onSave



}: {onClose: () => void;onSave?: (q: any) => void;}) {
  const [type, setType] = useState<QType>('MCQ');
  const [stem, setStem] = useState('');
  const [stemMedia, setStemMedia] = useState<
    {
      kind: string;
      alt: string;
    }[]>(
    []);
  const [choices, setChoices] = useState<
    {
      id: string;
      text: string;
      correct: boolean;
      rationale: string;
    }[]>(
    [
    {
      id: mkId(),
      text: '',
      correct: false,
      rationale: ''
    },
    {
      id: mkId(),
      text: '',
      correct: false,
      rationale: ''
    },
    {
      id: mkId(),
      text: '',
      correct: false,
      rationale: ''
    },
    {
      id: mkId(),
      text: '',
      correct: false,
      rationale: ''
    }]
  );
  const [tfAnswer, setTfAnswer] = useState<boolean | null>(null);
  const [pairs, setPairs] = useState([
  {
    id: mkId(),
    left: '',
    right: ''
  },
  {
    id: mkId(),
    left: '',
    right: ''
  },
  {
    id: mkId(),
    left: '',
    right: ''
  }]
  );
  const [orderItems, setOrderItems] = useState([
  {
    id: mkId(),
    text: ''
  },
  {
    id: mkId(),
    text: ''
  },
  {
    id: mkId(),
    text: ''
  }]
  );
  const [blanks, setBlanks] = useState([
  {
    id: mkId(),
    answer: '',
    caseSensitive: false
  }]
  );
  const [wordLimit, setWordLimit] = useState(300);
  const [rubric, setRubric] = useState([
  {
    id: mkId(),
    criterion: 'Clinical reasoning'
  },
  {
    id: mkId(),
    criterion: 'Evidence-based justification'
  }]
  );
  const [blooms, setBlooms] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState('');
  const [tags, setTags] = useState('');
  const [folderId, setFolderId] = useState('cv-pharm');
  const [folderLabel, setFolderLabel] = useState('CV Pharmacology');
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [curriculumMap, setCurriculumMap] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitMode, setSubmitMode] = useState(false);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);
  const missingAlt = stemMedia.some((m) => !m.alt.trim());
  const hasStem = stem.trim().length > 0;
  const hasAnswer = ((): boolean => {
    if (type === 'MCQ' || type === 'MSQ')
    return choices.some((c) => c.correct && c.text.trim().length > 0);
    if (type === 'TF') return tfAnswer !== null;
    if (type === 'Matching')
    return pairs.some((p) => p.left.trim() && p.right.trim());
    if (type === 'Ordering')
    return orderItems.some((x) => x.text.trim().length > 0);
    if (type === 'Essay') return rubric.length > 0;
    if (type === 'Fill blank')
    return blanks.some((b) => b.answer.trim().length > 0);
    return false;
  })();
  const canSave = hasStem && !missingAlt;
  const canSubmit =
  hasStem && hasAnswer && !missingAlt && !!blooms && !!difficulty;
  const steps = [
  {
    label: 'Stem',
    done: hasStem
  },
  {
    label: 'Answer',
    done: hasAnswer
  },
  {
    label: "Bloom's",
    done: !!blooms
  },
  {
    label: 'Difficulty',
    done: !!difficulty
  },
  {
    label: 'Folder',
    done: !!folderId
  }];

  const doneCount = steps.filter((s) => s.done).length;
  const handleSave = async (submit: boolean) => {
    if (!hasStem) return;
    if (missingAlt) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onSave?.({
      id: 'Q-' + Date.now(),
      stem,
      type,
      status: submit ? 'In Review' : 'Draft',
      blooms,
      difficulty,
      topic,
      folder: folderId
    });
    setSaving(false);
    onClose();
  };
  const isMCQ = type === 'MCQ' || type === 'MSQ';
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px 20px',
        background: 'rgba(0,0,0,0.45)'
      }}>
      
      <div
        style={{
          width: '100%',
          maxWidth: 860,
          maxHeight: 'calc(100vh - 80px)',
          background: 'var(--card)',
          borderRadius: 14,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
          overflow: 'hidden'
        }}>
        
        {/* HEADER */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
            background: 'var(--surface)'
          }}>
          
          <div
            style={{
              flex: 1
            }}>
            
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--foreground)',
                margin: 0,
                lineHeight: 1.2
              }}>
              
              New Question
            </h2>
            <p
              style={{
                fontSize: 13,
                color: 'var(--text3)',
                margin: '2px 0 0'
              }}>
              
              in{' '}
              <strong
                style={{
                  color: 'var(--brand)',
                  fontWeight: 500
                }}>
                
                {folderLabel}
              </strong>
            </p>
          </div>
          {/* Step progress */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
            
            {steps.map((s, i) =>
            <div
              key={s.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
              
                <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: s.done ? '#16a34a' : 'var(--surface2)',
                  border:
                  '1.5px solid ' + (
                  s.done ? '#16a34a' : 'var(--border-control)'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                
                  {s.done ?
                <Check
                  size={10}
                  style={{
                    color: '#fff'
                  }} /> :


                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: 'var(--text3)'
                  }}>
                  
                      {i + 1}
                    </span>
                }
                </div>
                <span
                style={{
                  fontSize: 12,
                  color: s.done ? '#15803d' : 'var(--text3)',
                  fontWeight: s.done ? 600 : 400
                }}>
                
                  {s.label}
                </span>
                {i < steps.length - 1 &&
              <ChevronRight
                size={11}
                style={{
                  color: 'var(--text3)',
                  opacity: 0.5
                }} />

              }
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 6,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--text3)',
              display: 'flex',
              borderRadius: 6,
              marginLeft: 4
            }}
            onMouseEnter={(e) =>
            e.currentTarget.style.background = 'var(--surface2)'
            }
            onMouseLeave={(e) =>
            e.currentTarget.style.background = 'transparent'
            }>
            
            <X size={18} />
          </button>
        </div>
        {/* BODY */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
            minHeight: 0
          }}>
          
          {/* LEFT — main form */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              minWidth: 0
            }}>
            
            {/* 1. Question type */}
            <Section step={1} title="Question type" done={true}>
              <TypeDropdown value={type} onChange={setType} locked={false} />
            </Section>
            {/* 2. Stem */}
            <Section step={2} title="Question stem" done={hasStem}>
              <div
                style={{
                  border: '1px solid var(--border-control)',
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: 'var(--card)'
                }}>
                
                {/* Mini toolbar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    padding: '5px 8px',
                    background: 'var(--surface)',
                    borderBottom: '1px solid var(--border)'
                  }}>
                  
                  {[
                  {
                    icon: Bold,
                    t: 'Bold'
                  },
                  {
                    icon: Italic,
                    t: 'Italic'
                  }].
                  map((b) =>
                  <button
                    key={b.t}
                    title={b.t}
                    style={{
                      padding: '4px 6px',
                      border: 'none',
                      background: 'transparent',
                      borderRadius: 4,
                      cursor: 'pointer',
                      color: 'var(--text3)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) =>
                    e.currentTarget.style.background = 'var(--surface2)'
                    }
                    onMouseLeave={(e) =>
                    e.currentTarget.style.background = 'transparent'
                    }>
                    
                      <b.icon size={13} />
                    </button>
                  )}
                  <div
                    style={{
                      width: 1,
                      height: 14,
                      background: 'var(--border)',
                      margin: '0 4px'
                    }} />
                  
                  <button
                    title="Math"
                    style={{
                      padding: '4px 6px',
                      border: 'none',
                      background: 'transparent',
                      borderRadius: 4,
                      cursor: 'pointer',
                      color: 'var(--text3)',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                    
                    <Hash size={13} />
                  </button>
                  <button
                    title="Link"
                    style={{
                      padding: '4px 6px',
                      border: 'none',
                      background: 'transparent',
                      borderRadius: 4,
                      cursor: 'pointer',
                      color: 'var(--text3)',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                    
                    <Link2 size={13} />
                  </button>
                  <div
                    style={{
                      width: 1,
                      height: 14,
                      background: 'var(--border)',
                      margin: '0 4px'
                    }} />
                  
                  {[
                  {
                    icon: Image,
                    kind: 'image'
                  },
                  {
                    icon: Video,
                    kind: 'video'
                  }].
                  map((m) =>
                  <button
                    key={m.kind}
                    title={m.kind}
                    onClick={() =>
                    setStemMedia((prev) => [
                    ...prev,
                    {
                      kind: m.kind,
                      alt: ''
                    }]
                    )
                    }
                    style={{
                      padding: '4px 6px',
                      border: 'none',
                      background: 'transparent',
                      borderRadius: 4,
                      cursor: 'pointer',
                      color: 'var(--text3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3
                    }}
                    onMouseEnter={(e) =>
                    e.currentTarget.style.background = 'var(--surface2)'
                    }
                    onMouseLeave={(e) =>
                    e.currentTarget.style.background = 'transparent'
                    }>
                    
                      <m.icon size={13} />
                      <span
                      style={{
                        fontSize: 12
                      }}>
                      
                        Add {m.kind}
                      </span>
                    </button>
                  )}
                  <div
                    style={{
                      flex: 1
                    }} />
                  
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '3px 8px',
                      borderRadius: 5,
                      background: 'oklch(0.38 0.10 286)',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 500
                    }}>
                    
                    <Sparkles size={11} />
                    Leo
                  </button>
                </div>
                <textarea
                  value={stem}
                  onChange={(e) => setStem(e.target.value)}
                  placeholder="Write the question stem here. Be specific about the clinical context."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: 'none',
                    fontSize: 15,
                    fontFamily: 'var(--font-ui)',
                    resize: 'vertical',
                    outline: 'none',
                    lineHeight: 1.65,
                    color: 'var(--foreground)',
                    boxSizing: 'border-box'
                  }} />
                
              </div>
              {/* Media alt text fields */}
              {stemMedia.length > 0 &&
              <div
                style={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}>
                
                  {stemMedia.map((m, i) => {
                  const ok = m.alt.trim().length > 0;
                  return (
                    <div
                      key={i}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1.5px solid ' + (ok ? '#16a34a' : '#f59e0b'),
                        background: ok ?
                        'rgba(22,163,74,0.04)' :
                        'rgba(245,158,11,0.04)'
                      }}>
                      
                        <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 6
                        }}>
                        
                          <span
                          style={{
                            fontSize: 13,
                            color: ok ? '#15803d' : '#92400e',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}>
                          
                            {ok ?
                          <Check size={13} /> :

                          <AlertTriangle size={13} />
                          }
                            {ok ?
                          'Alt text saved' :
                          'Alt text required (ADA Title II)'}
                          </span>
                          <button
                          onClick={() =>
                          setStemMedia((prev) =>
                          prev.filter((_, j) => j !== i)
                          )
                          }
                          style={{
                            marginLeft: 'auto',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            color: 'var(--text3)'
                          }}>
                          
                            <X size={12} />
                          </button>
                        </div>
                        <input
                        value={m.alt}
                        onChange={(e) =>
                        setStemMedia((prev) =>
                        prev.map((x, j) =>
                        j === i ?
                        {
                          ...x,
                          alt: e.target.value
                        } :
                        x
                        )
                        )
                        }
                        placeholder="Describe this image for screen readers..."
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          borderRadius: 6,
                          fontSize: 13,
                          background: 'var(--card)',
                          border: '1px solid ' + (ok ? '#16a34a' : '#f59e0b'),
                          color: 'var(--foreground)',
                          outline: 'none',
                          fontFamily: 'var(--font-ui)',
                          boxSizing: 'border-box'
                        }} />
                      
                      </div>);

                })}
                </div>
              }
            </Section>
            {/* 3. Answer */}
            <Section step={3} title="Answer configuration" done={hasAnswer}>
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: 8,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)'
                }}>
                
                {isMCQ &&
                <ChoiceBuilder
                  multi={type === 'MSQ'}
                  choices={choices}
                  onChange={setChoices} />

                }
                {type === 'TF' &&
                <div
                  style={{
                    display: 'flex',
                    gap: 10
                  }}>
                  
                    {([true, false] as const).map((v) =>
                  <button
                    key={String(v)}
                    onClick={() => setTfAnswer(v)}
                    style={{
                      flex: 1,
                      padding: '16px',
                      borderRadius: 8,
                      border:
                      '2px solid ' + (
                      tfAnswer === v ?
                      v ?
                      '#16a34a' :
                      '#dc2626' :
                      'var(--border-control)'),
                      background:
                      tfAnswer === v ?
                      v ?
                      '#f0fdf4' :
                      '#fef2f2' :
                      'var(--card)',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}>
                    
                        <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color:
                        tfAnswer === v ?
                        v ?
                        '#15803d' :
                        '#991b1b' :
                        'var(--text3)'
                      }}>
                      
                          {v ? 'True' : 'False'}
                        </div>
                        <div
                      style={{
                        fontSize: 12,
                        color: 'var(--text3)',
                        marginTop: 3
                      }}>
                      
                          {v ?
                      'Statement is correct' :
                      'Statement is incorrect'}
                        </div>
                      </button>
                  )}
                  </div>
                }
                {type === 'Matching' &&
                <MatchingBuilder pairs={pairs} onChange={setPairs} />
                }
                {type === 'Ordering' &&
                <OrderingBuilder
                  items={orderItems}
                  onChange={setOrderItems} />

                }
                {type === 'Fill blank' &&
                <FillBlankBuilder blanks={blanks} onChange={setBlanks} />
                }
                {type === 'Essay' &&
                <div>
                    <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'center',
                      marginBottom: 14
                    }}>
                    
                      <label
                      style={{
                        fontSize: 14,
                        color: 'var(--text2)',
                        fontWeight: 500
                      }}>
                      
                        Word limit
                      </label>
                      <input
                      type="number"
                      value={wordLimit}
                      onChange={(e) =>
                      setWordLimit(parseInt(e.target.value) || 300)
                      }
                      style={{
                        width: 80,
                        padding: '7px 10px',
                        borderRadius: 6,
                        border: '1px solid var(--border-control)',
                        fontSize: 14,
                        outline: 'none',
                        fontFamily: 'var(--font-ui)',
                        color: 'var(--foreground)'
                      }} />
                    
                      <span
                      style={{
                        fontSize: 13,
                        color: 'var(--text3)'
                      }}>
                      
                        words
                      </span>
                    </div>
                    <div
                    style={{
                      marginBottom: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--text2)'
                    }}>
                    
                      Scoring rubric
                    </div>
                    <RubricBuilder rubric={rubric} onChange={setRubric} />
                  </div>
                }
                {type === 'Hotspot' &&
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: 'var(--text3)',
                    fontSize: 14,
                    lineHeight: 1.6
                  }}>
                  
                    <Image
                    size={28}
                    style={{
                      opacity: 0.3,
                      margin: '0 auto 10px',
                      display: 'block'
                    }} />
                  
                    <div
                    style={{
                      fontWeight: 500,
                      color: 'var(--text2)',
                      marginBottom: 6
                    }}>
                    
                      Upload a diagram or anatomical image
                    </div>
                    <div>
                      Students will click the correct region on the image.
                    </div>
                    <button
                    style={{
                      marginTop: 12,
                      padding: '8px 16px',
                      borderRadius: 6,
                      border: '1px solid var(--border-control)',
                      background: 'var(--card)',
                      fontSize: 14,
                      cursor: 'pointer',
                      color: 'var(--text2)',
                      fontFamily: 'var(--font-ui)'
                    }}>
                    
                      Upload image
                    </button>
                  </div>
                }
                {type === 'Case Study' &&
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: 'var(--text3)',
                    fontSize: 14,
                    lineHeight: 1.6
                  }}>
                  
                    <FileText
                    size={28}
                    style={{
                      opacity: 0.3,
                      margin: '0 auto 10px',
                      display: 'block'
                    }} />
                  
                    <div
                    style={{
                      fontWeight: 500,
                      color: 'var(--text2)',
                      marginBottom: 6
                    }}>
                    
                      Case Study editor
                    </div>
                    <div>
                      Write a clinical scenario, then add sub-questions below
                      it.
                    </div>
                    <button
                    style={{
                      marginTop: 12,
                      padding: '8px 16px',
                      borderRadius: 6,
                      border: '1px solid var(--border-control)',
                      background: 'var(--card)',
                      fontSize: 14,
                      cursor: 'pointer',
                      color: 'var(--text2)',
                      fontFamily: 'var(--font-ui)'
                    }}>
                    
                      Open case editor
                    </button>
                  </div>
                }
              </div>
            </Section>
            {/* 4. Bloom's + Difficulty */}
            <Section
              step={4}
              title="Bloom's level & difficulty"
              done={!!blooms && !!difficulty}>
              
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 14
                }}>
                
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--text2)',
                      marginBottom: 8
                    }}>
                    
                    Bloom's Taxonomy level
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 5
                    }}>
                    
                    {BLOOMS.map((b) =>
                    <button
                      key={b}
                      onClick={() => setBlooms(blooms === b ? '' : b)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 99,
                        fontSize: 13,
                        fontWeight: blooms === b ? 600 : 400,
                        border:
                        '1.5px solid ' + (
                        blooms === b ?
                        'var(--brand)' :
                        'var(--border-control)'),
                        background:
                        blooms === b ? 'var(--brand-tint)' : 'var(--card)',
                        color: blooms === b ? 'var(--brand)' : 'var(--text2)',
                        cursor: 'pointer'
                      }}>
                      
                        {b}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--text2)',
                      marginBottom: 8
                    }}>
                    
                    Difficulty
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: 6
                    }}>
                    
                    {DIFFS.map((d) =>
                    <button
                      key={d}
                      onClick={() => setDifficulty(difficulty === d ? '' : d)}
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: difficulty === d ? 700 : 400,
                        border:
                        '1.5px solid ' + (
                        difficulty === d ?
                        DIFF_COLOR[d] :
                        'var(--border-control)'),
                        background:
                        difficulty === d ? DIFF_BG[d] : 'var(--card)',
                        color:
                        difficulty === d ? DIFF_COLOR[d] : 'var(--text2)',
                        cursor: 'pointer'
                      }}>
                      
                        {d}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: 14
                }}>
                
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--text2)',
                    marginBottom: 8
                  }}>
                  
                  Topic
                </div>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-control)',
                    fontSize: 14,
                    outline: 'none',
                    background: 'var(--card)',
                    color: topic ? 'var(--foreground)' : 'var(--text3)',
                    fontFamily: 'var(--font-ui)',
                    cursor: 'pointer'
                  }}>
                  
                  <option value="">Select a topic...</option>
                  {TOPICS.map((t) =>
                  <option key={t} value={t}>
                      {t}
                    </option>
                  )}
                </select>
              </div>
            </Section>
            {/* 5. Save location */}
            <Section step={5} title="Save to folder" done={!!folderId}>
              <FolderSelect
                value={folderId}
                onChange={(id, label) => {
                  setFolderId(id);
                  setFolderLabel(label);
                }} />
              
            </Section>
            {/* Optional: collaborators + curriculum */}
            <div
              style={{
                marginTop: 4,
                borderTop: '1px solid var(--border)',
                paddingTop: 16
              }}>
              
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text2)',
                  marginBottom: 10
                }}>
                
                Optional settings
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}>
                
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--text3)',
                      marginBottom: 6
                    }}>
                    
                    Collaborators
                  </div>
                  <CollabDropdown
                    selected={collaborators}
                    onChange={setCollaborators} />
                  
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--text3)',
                      marginBottom: 6
                    }}>
                    
                    Curriculum / Competency mapping
                  </div>
                  <select
                    value={curriculumMap}
                    onChange={(e) => setCurriculumMap(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border-control)',
                      fontSize: 14,
                      outline: 'none',
                      background: 'var(--card)',
                      color: curriculumMap ?
                      'var(--foreground)' :
                      'var(--text3)',
                      fontFamily: 'var(--font-ui)',
                      cursor: 'pointer'
                    }}>
                    
                    <option value="">No mapping</option>
                    <option value="capte-1a">CAPTE Standard 1A</option>
                    <option value="capte-3b">CAPTE Standard 3B</option>
                    <option value="acote-b1">ACOTE Standard B.1</option>
                    <option value="custom">Custom competency...</option>
                  </select>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--text3)',
                      marginBottom: 6
                    }}>
                    
                    Tags
                  </div>
                  <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. USMLE, EOR, Cardiology (comma separated)"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border-control)',
                      fontSize: 14,
                      outline: 'none',
                      fontFamily: 'var(--font-ui)',
                      color: 'var(--foreground)',
                      boxSizing: 'border-box'
                    }} />
                  
                </div>
              </div>
            </div>
          </div>
          {/* RIGHT — Leo suggestions panel */}
          <div
            style={{
              width: 220,
              flexShrink: 0,
              borderLeft: '1px solid var(--border)',
              background: 'var(--surface)',
              overflowY: 'auto',
              padding: '16px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14
            }}>
            
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--text2)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
              
              <Sparkles
                size={14}
                style={{
                  color: 'var(--brand)'
                }} />
              
              Leo suggestions
            </div>
            {hasStem &&
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                background: 'var(--card)',
                border: '1px solid var(--border)'
              }}>
              
                <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text3)',
                  marginBottom: 5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                
                  Suggested metadata
                </div>
                <div
                style={{
                  fontSize: 13,
                  color: 'var(--text2)',
                  lineHeight: 1.55
                }}>
                
                  Based on your stem, try:
                  <br />
                  <strong>Bloom's:</strong> Apply
                  <br />
                  <strong>Difficulty:</strong> Medium
                  <br />
                  <strong>Topic:</strong> Pharmacology
                </div>
                <button
                onClick={() => {
                  setBlooms('Apply');
                  setDifficulty('Medium');
                  setTopic('Pharmacology');
                }}
                style={{
                  marginTop: 8,
                  width: '100%',
                  padding: '6px',
                  borderRadius: 6,
                  background: 'var(--brand-tint)',
                  color: 'var(--brand)',
                  border: '1px solid var(--brand-border)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                
                  Apply suggestions
                </button>
              </div>
            }
            {!hasStem &&
            <div
              style={{
                fontSize: 13,
                color: 'var(--text3)',
                lineHeight: 1.6
              }}>
              
                Start typing your question stem and Leo will suggest Bloom's
                level, difficulty, and topic.
              </div>
            }
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                background: 'var(--card)',
                border: '1px solid var(--border)'
              }}>
              
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text3)',
                  marginBottom: 5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                
                Distractor quality
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text3)',
                  lineHeight: 1.55
                }}>
                
                Add your options and Leo will flag non-functional distractors.
              </div>
            </div>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                background: 'var(--card)',
                border: '1px solid var(--border)'
              }}>
              
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text3)',
                  marginBottom: 5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                
                Similar questions
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text3)',
                  lineHeight: 1.55
                }}>
                
                Leo will check for duplicate or near-duplicate questions in your
                bank.
              </div>
            </div>
          </div>
        </div>
        {/* FOOTER */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
            background: 'var(--surface)'
          }}>
          
          {/* Validation status */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
            
            {!hasStem &&
            <span
              style={{
                fontSize: 13,
                color: 'var(--text3)',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
              
                <Info size={13} />
                Write a stem to save
              </span>
            }
            {hasStem && !hasAnswer &&
            <span
              style={{
                fontSize: 13,
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
              
                <AlertCircle size={13} />
                Add an answer to submit
              </span>
            }
            {missingAlt &&
            <span
              style={{
                fontSize: 13,
                color: '#991b1b',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
              
                <AlertTriangle size={13} />
                Alt text required for images
              </span>
            }
            {canSubmit &&
            <span
              style={{
                fontSize: 13,
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
              
                <Check size={13} />
                Ready to submit
              </span>
            }
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '9px 16px',
              borderRadius: 8,
              background: 'transparent',
              border: '1px solid var(--border-control)',
              fontSize: 14,
              cursor: 'pointer',
              color: 'var(--text2)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 500
            }}>
            
            Cancel
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving || !canSave}
            style={{
              padding: '9px 16px',
              borderRadius: 8,
              background: 'transparent',
              border: '1px solid var(--border-control)',
              fontSize: 14,
              fontWeight: 500,
              cursor: canSave && !saving ? 'pointer' : 'not-allowed',
              opacity: canSave ? 1 : 0.4,
              color: 'var(--text2)',
              fontFamily: 'var(--font-ui)',
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}>
            
            <Save size={14} />
            {saving && !submitMode ? 'Saving...' : 'Save as draft'}
          </button>
          <button
            onClick={() => {
              setSubmitMode(true);
              handleSave(true);
            }}
            disabled={saving || !canSubmit}
            style={{
              padding: '9px 20px',
              borderRadius: 8,
              background: canSubmit ? 'var(--foreground)' : 'var(--surface2)',
              color: canSubmit ? 'var(--card)' : 'var(--text3)',
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              cursor: canSubmit && !saving ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font-ui)',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              boxShadow: canSubmit ? '0 1px 3px rgba(0,0,0,0.12)' : undefined
            }}>
            
            <Send size={14} />
            {saving && submitMode ? 'Submitting...' : 'Submit for review'}
          </button>
        </div>
      </div>
    </div>);

}