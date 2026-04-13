import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  FileText,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Activity,
  ArrowRight,
  ExternalLink } from
'lucide-react';
/* ══ MY COURSES — Course as a container in the graph ══
   Mental model: A course connects to question banks (via tags), exams (via pipeline),
   and students. This page is the faculty's "home base" — shows their courses
   with the current state of each exam pipeline and question bank within.
   
   Each course card: WHAT (course identity) / WHY (next exam + pipeline stage) / DO (quick actions)
   Graph nav: click course → opens QB filtered to that course, or exam pipeline for that course */
const COURSES = [
{
  id: 1,
  name: 'CV Pharmacology',
  code: 'PHARM-501',
  students: 87,
  exams: [
  {
    name: 'Midterm',
    date: 'Apr 17',
    stage: 'Review',
    readiness: 92,
    blocker: '2 images need alt text'
  },
  {
    name: 'Final',
    date: 'Jun 8',
    stage: 'Draft',
    readiness: 5,
    blocker: 'Not started'
  }],

  questions: 145,
  flagged: 3
},
{
  id: 2,
  name: 'Clinical Anatomy',
  code: 'ANAT-402',
  students: 92,
  exams: [
  {
    name: 'Quiz 3',
    date: 'Apr 24',
    stage: 'Building',
    readiness: 65,
    blocker: '12 questions in review'
  }],

  questions: 98,
  flagged: 1
},
{
  id: 3,
  name: 'Pathophysiology I',
  code: 'PATH-301',
  students: 78,
  exams: [
  {
    name: 'Midterm',
    date: 'May 2',
    stage: 'Draft',
    readiness: 30,
    blocker: '5 blueprint cells empty'
  }],

  questions: 112,
  flagged: 0
},
{
  id: 4,
  name: 'Clinical Medicine II',
  code: 'CMED-602',
  students: 65,
  exams: [
  {
    name: 'EOR 4',
    date: 'May 15',
    stage: 'Draft',
    readiness: 10,
    blocker: 'Not started'
  }],

  questions: 203,
  flagged: 4
}];

const STAGE_FG: Record<string, string> = {
  Review: 'var(--warning)',
  Building: 'var(--chart-1)',
  Draft: 'var(--muted-foreground)',
  Live: 'var(--success)',
  Complete: 'var(--muted-foreground)'
};
const STAGE_BG: Record<string, string> = {
  Review: '#fefce8',
  Building: '#eff6ff',
  Draft: 'var(--muted)',
  Live: '#f0fdf4',
  Complete: 'var(--muted)'
};
export function MyCoursesView({
  onOpenExam


}: {onOpenExam?: (name?: string) => void;}) {
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };
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
            
            My Courses
          </h1>
          <p
            style={{
              fontSize: 12,
              color: 'var(--muted-foreground)'
            }}>
            
            Spring 2026 · 4 active courses
          </p>
        </div>
        <button
          onClick={onOpenExam}
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
          New exam
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12
        }}>
        
        {COURSES.map((c) =>
        <div
          key={c.id}
          style={{
            background: 'var(--card)',
            borderRadius: 16,
            padding: 20,
            boxShadow: 'var(--card-ring, 0 0 0 1px rgba(0,0,0,0.08))'
          }}>
          
            {/* WHAT: course identity */}
            <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 12
            }}>
            
              <div>
                <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  marginBottom: 2
                }}>
                
                  {c.name}
                </div>
                <div
                style={{
                  fontSize: 12,
                  color: 'var(--muted-foreground)'
                }}>
                
                  {c.code} · {c.students} students
                </div>
              </div>
              <ArrowRight
              style={{
                width: 14,
                height: 14,
                color: 'var(--muted-foreground)'
              }} />
            
            </div>

            {/* WHY: exam pipeline status for this course */}
            {c.exams.map((ex, ei) =>
          <button
            key={ei}
            onClick={() => onOpenExam?.(`${c.name} — ${ex.name} 2026`)}
            onMouseEnter={(e) =>
            e.currentTarget.style.background = 'var(--accent)'
            }
            onMouseLeave={(e) =>
            e.currentTarget.style.background = 'var(--muted)'
            }
            title={`Open ${ex.name} pipeline`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              textAlign: 'left',
              padding: '10px 12px',
              marginBottom: 6,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--muted)',
              border: 'none',
              cursor: 'pointer'
            }}>
            
                <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 4
              }}>
              
                  <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--foreground)'
                }}>
                
                    {ex.name}
                  </span>
                  <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                
                    <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '1px 6px',
                    borderRadius: 3,
                    background: STAGE_BG[ex.stage] || 'var(--muted)',
                    color: STAGE_FG[ex.stage] || 'var(--muted-foreground)'
                  }}>
                  
                      {ex.stage}
                    </span>
                    <span
                  style={{
                    fontSize: 12,
                    color: 'var(--muted-foreground)'
                  }}>
                  
                      {ex.date}
                    </span>
                  </div>
                </div>
                <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 3
              }}>
              
                  <div
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  background: 'var(--border)',
                  overflow: 'hidden'
                }}>
                
                    <div
                  style={{
                    height: '100%',
                    borderRadius: 2,
                    width: `${ex.readiness}%`,
                    background:
                    ex.readiness > 80 ?
                    '#16a34a' :
                    ex.readiness > 50 ?
                    '#ca8a04' :
                    'var(--destructive)'
                  }} />
                
                  </div>
                  <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color:
                  ex.readiness > 80 ?
                  '#16a34a' :
                  ex.readiness > 50 ?
                  '#ca8a04' :
                  'var(--destructive)'
                }}>
                
                    {ex.readiness}%
                  </span>
                </div>
                <div
              style={{
                fontSize: 11,
                color:
                ex.readiness >= 80 ?
                'var(--warning)' :
                'var(--destructive)'
              }}>
              
                  {ex.blocker}
                </div>
              </button>
          )}

            {/* DO: quick links (graph navigation) */}
            <div
            style={{
              display: 'flex',
              gap: 6,
              marginTop: 'auto',
              paddingTop: 10
            }}>
            
              {/* Graph nav: opens QB filtered to this course */}
              <button
              onClick={() =>
              showToast(`Opening Question Bank for ${c.name}...`)
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                border: '1px solid var(--border)',
                fontSize: 12,
                color: 'var(--foreground)',
                cursor: 'pointer'
              }}>
              
                <BookOpen
                style={{
                  width: 12,
                  height: 12
                }} />
              {' '}
                {c.questions} questions
                {c.flagged > 0 &&
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--destructive)'
                }}>
                
                    {c.flagged} flagged
                  </span>
              }
              </button>
              <button
              onClick={() => showToast(`Opening Analytics for ${c.name}...`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                border: '1px solid var(--border)',
                fontSize: 12,
                color: 'var(--foreground)',
                cursor: 'pointer'
              }}>
              
                <Activity
                style={{
                  width: 12,
                  height: 12
                }} />
              {' '}
                Analytics
              </button>
            </div>
          </div>
        )}
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