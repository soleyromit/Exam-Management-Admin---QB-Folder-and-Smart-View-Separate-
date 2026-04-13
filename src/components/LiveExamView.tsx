import React from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Plus,
  Shield,
  Sparkles } from
'lucide-react';
/* LIVE EXAM MONITORING — the missing pipeline stage
   Shows: who's taking, who submitted, time remaining, emergency controls */
const STUDENTS = [
{
  id: 1,
  name: 'Student A-1847',
  status: 'taking' as const,
  progress: 78,
  timeLeft: '23 min',
  flagged: false
},
{
  id: 2,
  name: 'Student A-2034',
  status: 'taking' as const,
  progress: 45,
  timeLeft: '41 min',
  flagged: false
},
{
  id: 3,
  name: 'Student A-3291',
  status: 'submitted' as const,
  progress: 100,
  timeLeft: '—',
  flagged: false
},
{
  id: 4,
  name: 'Student A-4102',
  status: 'taking' as const,
  progress: 62,
  timeLeft: '32 min',
  flagged: true
},
{
  id: 5,
  name: 'Student A-5678',
  status: 'not-started' as const,
  progress: 0,
  timeLeft: '—',
  flagged: false
},
{
  id: 6,
  name: 'Student A-6543',
  status: 'submitted' as const,
  progress: 100,
  timeLeft: '—',
  flagged: false
},
{
  id: 7,
  name: 'Student A-7890',
  status: 'taking' as const,
  progress: 91,
  timeLeft: '8 min',
  flagged: false
},
{
  id: 8,
  name: 'Student A-8123',
  status: 'taking' as const,
  progress: 34,
  timeLeft: '48 min',
  flagged: false
}];

const ST_COLOR = {
  taking: 'var(--success)',
  submitted: 'var(--muted-foreground)',
  'not-started': 'var(--destructive)'
};
const ST_LABEL = {
  taking: 'Taking',
  submitted: 'Submitted',
  'not-started': 'Not started'
};
export function LiveExamView() {
  const taking = STUDENTS.filter((s) => s.status === 'taking').length;
  const submitted = STUDENTS.filter((s) => s.status === 'submitted').length;
  const notStarted = STUDENTS.filter((s) => s.status === 'not-started').length;
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
              fontSize: 28,
              fontWeight: 600,
              color: 'var(--foreground)',
              marginBottom: 4
            }}>
            
            Live Monitoring
          </h1>
          <p
            style={{
              fontSize: 12,
              color: 'var(--muted-foreground)'
            }}>
            
            CV Pharmacology — Midterm · Started 9:00 AM · 87 students
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
              borderRadius: 10,
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
                color: '#5f53ae'
              }} />
            {' '}
            Ask Leo
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '7px 12px',
              borderRadius: 10,
              background: '#fef2f2',
              border: '1px solid #fecaca',
              fontSize: 13,
              fontWeight: 600,
              color: '#d40924',
              cursor: 'pointer'
            }}>
            
            <Pause
              style={{
                width: 14,
                height: 14
              }} />
            {' '}
            Pause exam
          </button>
        </div>
      </div>

      {/* Status cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: 12,
          marginBottom: 20
        }}>
        
        {[
        {
          label: 'Taking now',
          value: taking,
          color: '#16a34a',
          icon: Play
        },
        {
          label: 'Submitted',
          value: submitted,
          color: '#71717a',
          icon: CheckCircle2
        },
        {
          label: 'Not started',
          value: notStarted,
          color: '#d40924',
          icon: AlertTriangle
        },
        {
          label: 'Time remaining',
          value: '52 min',
          color: '#1a1a1a',
          icon: Clock
        }].
        map((c) =>
        <div
          key={c.label}
          style={{
            padding: 20,
            background: 'var(--card)',
            border: 'none',
            boxShadow: '0 0 0 1px var(--border)',
            borderRadius: 16
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
                background: c.color
              }} />
            
              <span
              style={{
                fontSize: 12,
                color: 'var(--muted-foreground)'
              }}>
              
                {c.label}
              </span>
            </div>
            <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 28,
              fontWeight: 600,
              color: 'var(--foreground)'
            }}>
            
              {c.value}
            </span>
          </div>
        )}
      </div>

      {/* Emergency controls */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 20
        }}>
        
        {[
        {
          label: 'Extend time (+15 min)',
          icon: Clock
        },
        {
          label: 'Add accommodation',
          icon: Users
        },
        {
          label: 'End exam for all',
          icon: Shield
        }].
        map((a) =>
        <button
          key={a.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '7px 12px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'var(--card)',
            fontSize: 12,
            color: 'var(--foreground)',
            cursor: 'pointer'
          }}>
          
            <a.icon
            style={{
              width: 13,
              height: 13,
              color: '#71717a'
            }} />
          {' '}
            {a.label}
          </button>
        )}
      </div>

      {/* Student table */}
      <div
        style={{
          background: 'var(--card)',
          border: 'none',
          boxShadow: '0 0 0 1px var(--border)',
          borderRadius: 16,
          overflow: 'hidden'
        }}>
        
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 100px 120px 80px 60px',
            alignItems: 'center',
            padding: '0 16px',
            height: 44
          }}>
          
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--muted-foreground)'
            }}>
            
            Student
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--muted-foreground)'
            }}>
            
            Status
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--muted-foreground)'
            }}>
            
            Progress
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--muted-foreground)'
            }}>
            
            Time left
          </div>
          <div></div>
        </div>
        {STUDENTS.map((s, i) =>
        <div
          key={s.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 100px 120px 80px 60px',
            alignItems: 'center',
            padding: '0 16px',
            height: 48,
            borderTop: '1px solid var(--border)'
          }}>
          
            <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
            
              <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--foreground)'
              }}>
              
                {s.name}
              </span>
              {s.flagged &&
            <AlertTriangle
              style={{
                width: 12,
                height: 12,
                color: 'var(--destructive)'
              }} />

            }
            </div>
            <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: 6,
              background:
              s.status === 'taking' ?
              'var(--muted)' :
              s.status === 'submitted' ?
              'var(--muted-foreground)' :
              'var(--success)',
              color: ST_COLOR[s.status],
              display: 'inline-block',
              width: 'fit-content'
            }}>
            
              {ST_LABEL[s.status]}
            </span>
            <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
            
              <div
              style={{
                width: 60,
                height: 3,
                borderRadius: 2,
                background: '#f0f0f0',
                overflow: 'hidden'
              }}>
              
                <div
                style={{
                  height: '100%',
                  borderRadius: 2,
                  width: `${s.progress}%`,
                  background:
                  s.status === 'submitted' ?
                  'var(--muted-foreground)' :
                  'var(--success)'
                }} />
              
              </div>
              <span
              style={{
                fontSize: 11,
                color: 'var(--muted-foreground)'
              }}>
              
                {s.progress}%
              </span>
            </div>
            <span
            style={{
              fontSize: 12,
              color:
              s.timeLeft === '8 min' ?
              'var(--destructive)' :
              'var(--muted-foreground)',
              fontWeight: s.timeLeft === '8 min' ? 500 : 400
            }}>
            
              {s.timeLeft}
            </span>
            <button
            style={{
              padding: '3px 8px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'transparent',
              fontSize: 11,
              color: 'var(--muted-foreground)',
              cursor: 'pointer'
            }}>
            
              Actions
            </button>
          </div>
        )}
      </div>
    </div>);

}