import React, { useState } from 'react';
import {
  Plus,
  Search,
  ChevronRight,
  Clock,
  CheckCircle2,
  Play,
  PenTool,
  FileText,
  Activity,
  Lock,
  Sparkles,
  AlertCircle,
  Settings2 } from
'lucide-react';
/* EXAM LIST VIEW — All exams as a list (localhost Placements pattern)
   This is the missing page. Faculty need to see ALL their exams and create new ones.
   Each exam row shows: name, course, stage, date, students, readiness.
   Clicking opens the exam detail (PhaseShell). */
type Stage =
'draft' |
'building' |
'review' |
'published' |
'live' |
'grading' |
'complete';
const ST: Record<
  Stage,
  {
    label: string;
    bg: string;
    fg: string;
  }> =
{
  draft: {
    label: 'Draft',
    bg: 'var(--muted)',
    fg: 'var(--muted-foreground)'
  },
  building: {
    label: 'Building',
    bg: '#eff6ff',
    fg: 'var(--chart-1)'
  },
  review: {
    label: 'Review',
    bg: '#fefce8',
    fg: 'var(--warning)'
  },
  published: {
    label: 'Published',
    bg: '#f0edf9',
    fg: 'var(--brand)'
  },
  live: {
    label: 'Live',
    bg: '#f0fdf4',
    fg: 'var(--success)'
  },
  grading: {
    label: 'Grading',
    bg: '#fefce8',
    fg: 'var(--warning)'
  },
  complete: {
    label: 'Complete',
    bg: 'var(--muted)',
    fg: 'var(--muted-foreground)'
  }
};
const EXAMS = [
{
  id: 1,
  name: 'CV Pharmacology — Midterm',
  course: 'PHARM-501',
  date: 'Apr 17',
  students: 87,
  questions: 50,
  stage: 'review' as Stage,
  readiness: 92,
  blocker: '2 images need alt text'
},
{
  id: 2,
  name: 'Clinical Anatomy — Quiz 3',
  course: 'ANAT-402',
  date: 'Apr 24',
  students: 92,
  questions: 30,
  stage: 'building' as Stage,
  readiness: 65,
  blocker: '12 questions in review'
},
{
  id: 3,
  name: 'Pathophysiology — Midterm',
  course: 'PATH-301',
  date: 'May 2',
  students: 78,
  questions: 75,
  stage: 'draft' as Stage,
  readiness: 30,
  blocker: '5 blueprint cells empty'
},
{
  id: 4,
  name: 'Clinical Medicine — EOR 4',
  course: 'CMED-602',
  date: 'May 15',
  students: 65,
  questions: 100,
  stage: 'draft' as Stage,
  readiness: 10,
  blocker: 'Not started'
},
{
  id: 5,
  name: 'CV Pharmacology — Quiz 2',
  course: 'PHARM-501',
  date: 'Mar 28',
  students: 87,
  questions: 25,
  stage: 'grading' as Stage,
  readiness: 100,
  blocker: '23 need manual review'
},
{
  id: 6,
  name: 'Clinical Anatomy — Quiz 2',
  course: 'ANAT-402',
  date: 'Mar 15',
  students: 92,
  questions: 20,
  stage: 'complete' as Stage,
  readiness: 100,
  blocker: null
}];

const TABS = [
'All',
'Draft',
'Building',
'Review',
'Live',
'Grading',
'Complete'] as
const;
export function ExamListView({
  onOpenExam,
  onNewExam



}: {onOpenExam?: (name?: string) => void;onNewExam?: () => void;}) {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [search, setSearch] = useState('');
  const filtered = EXAMS.filter((e) => {
    if (activeTab !== 'All' && e.stage !== activeTab.toLowerCase()) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()))
    return false;
    return true;
  });
  return (
    <div className="flex-1 overflow-y-auto pt-[0px] pb-[0px]">
      {/* Header */}
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
            
            All Exams
          </h1>
          <p
            style={{
              fontSize: 12,
              color: 'var(--muted-foreground)'
            }}>
            
            {EXAMS.length} exams · Spring 2026
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
                color: 'var(--brand)'
              }} />
            {' '}
            Ask Leo
          </button>
          <button
            onClick={onNewExam}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '7px 14px',
              borderRadius: 10,
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
      </div>

      {/* View tabs — localhost pattern */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          borderBottom: '1px solid #e4e4e7',
          marginBottom: 8
        }}>
        
        {TABS.map((t) => {
          const count =
          t === 'All' ?
          EXAMS.length :
          EXAMS.filter((e) => e.stage === t.toLowerCase()).length;
          if (count === 0 && t !== 'All') return null;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: activeTab === t ? 500 : 400,
                color:
                activeTab === t ?
                'var(--foreground)' :
                'var(--muted-foreground)',
                borderBottom:
                activeTab === t ?
                '2px solid var(--foreground)' :
                '2px solid transparent',
                background: 'transparent',
                border: 'none',
                borderBottomStyle: 'solid',
                cursor: 'pointer',
                marginBottom: -1
              }}>
              
              {t}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '1px 6px',
                  borderRadius: 10,
                  background:
                  activeTab === t ? 'var(--foreground)' : 'var(--muted)',
                  color:
                  activeTab === t ?
                  'var(--primary-foreground)' :
                  'var(--muted-foreground)'
                }}>
                
                {count}
              </span>
            </button>);

        })}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '8px 14px',
            fontSize: 13,
            color: 'var(--muted-foreground)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}>
          
          <Plus
            style={{
              width: 13,
              height: 13
            }} />
          {' '}
          Add view
        </button>
      </div>

      {/* Filter + search */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          padding: '6px 0'
        }}>
        
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 10px',
            fontSize: 12,
            color: 'var(--muted-foreground)',
            background: 'transparent',
            border: '1px dashed var(--border-control)',
            borderRadius: 6,
            cursor: 'pointer'
          }}>
          
          <Plus
            style={{
              width: 12,
              height: 12
            }} />
          {' '}
          Add filter
        </button>
        <div
          style={{
            position: 'relative'
          }}>
          
          <Search
            style={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 13,
              height: 13,
              color: 'var(--muted-foreground)'
            }} />
          
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exams..."
            style={{
              paddingLeft: 28,
              paddingRight: 10,
              height: 32,
              width: 200,
              borderRadius: 6,
              border: '1px solid var(--border)',
              fontSize: 12,
              color: 'var(--foreground)',
              background: 'var(--card)',
              outline: 'none'
            }} />
          
        </div>
      </div>

      {/* Table */}
      <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 100px 80px 80px 70px 50px',
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
            
            Exam
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--muted-foreground)'
            }}>
            
            Stage
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--muted-foreground)'
            }}>
            
            Date
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--muted-foreground)'
            }}>
            
            Students
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--muted-foreground)'
            }}>
            
            Ready
          </div>
          <div></div>
        </div>
        {filtered.map((e, i) => {
          const st = ST[e.stage];
          return (
            <button
              key={e.id}
              onClick={() => onOpenExam?.(e.name)}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 100px 80px 80px 70px 50px',
                alignItems: 'center',
                width: '100%',
                padding: '0 16px',
                height: 56,
                textAlign: 'left',
                background: 'transparent',
                border: 'none',
                borderTop: '1px solid var(--border)',
                cursor: 'pointer'
              }}
              onMouseEnter={(ev) =>
              ev.currentTarget.style.background = '#fafafa'
              }
              onMouseLeave={(ev) =>
              ev.currentTarget.style.background = 'transparent'
              }>
              
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--foreground)'
                  }}>
                  
                  {e.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--muted-foreground)'
                  }}>
                  
                  {e.course} · {e.questions} questions
                  {e.blocker ? ` · ${e.blocker}` : ''}
                </div>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: st.bg,
                  color: st.fg,
                  display: 'inline-block',
                  width: 'fit-content'
                }}>
                
                {st.label}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--muted-foreground)'
                }}>
                
                {e.date}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--muted-foreground)'
                }}>
                
                {e.students}
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                
                <div
                  style={{
                    width: 40,
                    height: 3,
                    borderRadius: 2,
                    background: '#f0f0f0',
                    overflow: 'hidden'
                  }}>
                  
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 2,
                      width: `${e.readiness}%`,
                      background:
                      e.readiness > 80 ?
                      'var(--success)' :
                      e.readiness > 50 ?
                      'var(--warning)' :
                      'var(--destructive)'
                    }} />
                  
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: 'var(--muted-foreground)'
                  }}>
                  
                  {e.readiness}%
                </span>
              </div>
              <ChevronRight
                style={{
                  width: 14,
                  height: 14,
                  color: 'var(--border)'
                }} />
              
            </button>);

        })}
      </div>
    </div>);

}