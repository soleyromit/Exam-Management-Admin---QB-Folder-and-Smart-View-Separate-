import React, { useState } from 'react';
import { Plus, Search, Sparkles, MoreHorizontal, ArrowUp } from 'lucide-react';
import { QS } from './QBData';
import type { Question } from './QBData';
import { DataTable, StatusBadge } from './DataTable';
import type { Column } from './DataTable';
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
const getQBInitials = (name?: string) => {
  if (!name) return '??';
  return name.
  split(' ').
  map((w) => w[0]).
  join('').
  slice(0, 2).
  toUpperCase();
};
// Helper to get initials from exam name
const getInitials = (name: string) => {
  const words = name.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};
// Map exam stages to StatusBadge props
const mapExamStageToStatus = (
stage: Stage)
: {
  status: 'completed' | 'pending' | 'review' | 'rejected' | 'confirmed';
  label: string;
} => {
  switch (stage) {
    case 'draft':
      return {
        status: 'completed',
        label: 'Draft'
      };
    // Gray
    case 'building':
      return {
        status: 'review',
        label: 'Building'
      };
    // Blue
    case 'review':
      return {
        status: 'pending',
        label: 'Review'
      };
    // Amber
    case 'published':
      return {
        status: 'confirmed',
        label: 'Published'
      };
    // Teal
    case 'live':
      return {
        status: 'confirmed',
        label: 'Live'
      };
    // Teal
    case 'grading':
      return {
        status: 'pending',
        label: 'Grading'
      };
    // Amber
    case 'complete':
      return {
        status: 'completed',
        label: 'Complete'
      };
    // Gray
    default:
      return {
        status: 'completed',
        label: stage
      };
  }
};
// Map QB status to StatusBadge props
const mapQBStatusToStatus = (
status: string)
: {
  status: 'completed' | 'pending' | 'review' | 'rejected' | 'confirmed';
  label: string;
} => {
  switch (status) {
    case 'Active':
    case 'Ready':
    case 'Approved':
      return {
        status: 'confirmed',
        label: status
      };
    case 'In Review':
      return {
        status: 'review',
        label: status
      };
    case 'Draft':
    case 'Locked':
      return {
        status: 'completed',
        label: status
      };
    case 'Flagged':
      return {
        status: 'rejected',
        label: status
      };
    default:
      return {
        status: 'completed',
        label: status
      };
  }
};
export function ExamListView({
  onOpenExam,
  onNewExam



}: {onOpenExam?: (name?: string) => void;onNewExam?: () => void;}) {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [tableView, setTableView] = useState<'exams' | 'questions'>('exams');
  // Pagination state
  const [examPage, setExamPage] = useState(1);
  const [examPageSize, setExamPageSize] = useState(10);
  const [qbPage, setQbPage] = useState(1);
  const [qbPageSize, setQbPageSize] = useState(10);
  const filtered = EXAMS.filter((e) => {
    if (activeTab !== 'All' && e.stage !== activeTab.toLowerCase()) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()))
    return false;
    return true;
  });
  const filteredQuestions = QS.filter((q) => {
    if (search && !q.title.toLowerCase().includes(search.toLowerCase()))
    return false;
    return true;
  });
  // Columns for Exams Table
  const examColumns: Column<(typeof EXAMS)[0]>[] = [
  {
    id: 'checkbox',
    label: '',
    accessor: 'id',
    width: '42px',
    render: () =>
    <input
      type="checkbox"
      onClick={(ev) => ev.stopPropagation()}
      style={{
        width: 16,
        height: 16,
        cursor: 'pointer',
        accentColor: 'var(--primary)'
      }} />


  },
  {
    id: 'exam',
    label: 'Exam',
    accessor: 'name',
    width: '24%',
    sortable: true,
    render: (val, row) =>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer'
      }}
      onClick={() => onOpenExam?.(row.name)}>
      
          <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: '#FAE7F1',
          color: '#970070',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 600,
          flexShrink: 0
        }}>
        
            {getInitials(row.name)}
          </div>
          <div
        style={{
          minWidth: 0
        }}>
        
            <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: '#0A0A0A',
            marginBottom: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
          
              {row.name}
            </div>
            <div
          style={{
            fontSize: 11,
            color: '#60636A'
          }}>
          
              {row.course}
            </div>
          </div>
        </div>

  },
  {
    id: 'course',
    label: 'Course',
    accessor: 'course',
    width: '12%'
  },
  {
    id: 'questions',
    label: 'Questions',
    accessor: 'questions',
    width: '18%',
    render: (val, row) =>
    <div>
          <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: '#0A0A0A',
          marginBottom: 2
        }}>
        
            {row.questions} questions
          </div>
          <div
        style={{
          fontSize: 11,
          color: '#60636A',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
        
            {row.blocker || '—'}
          </div>
        </div>

  },
  {
    id: 'status',
    label: 'Status',
    accessor: 'stage',
    width: '11%',
    render: (val) => {
      const mapped = mapExamStageToStatus(val as Stage);
      return <StatusBadge status={mapped.status} label={mapped.label} />;
    }
  },
  {
    id: 'date',
    label: 'Date',
    accessor: 'date',
    width: '10%'
  },
  {
    id: 'students',
    label: 'Students',
    accessor: 'students',
    width: '8%',
    render: (val) => `${val} std`
  },
  {
    id: 'ready',
    label: 'Ready',
    accessor: 'readiness',
    width: '10%',
    render: (val) => `${val}%`
  },
  {
    id: 'actions',
    label: '',
    accessor: 'id',
    width: '50px',
    align: 'center',
    render: () =>
    <MoreHorizontal
      style={{
        width: 18,
        height: 18,
        color: '#0A0A0A',
        cursor: 'pointer'
      }}
      onClick={(ev) => ev.stopPropagation()} />


  }];

  // Columns for Questions Table
  const qbColumns: Column<Question>[] = [
  {
    id: 'checkbox',
    label: '',
    accessor: 'id',
    width: '42px',
    render: () =>
    <input
      type="checkbox"
      onClick={(ev) => ev.stopPropagation()}
      style={{
        width: 16,
        height: 16,
        cursor: 'pointer',
        accentColor: 'var(--primary)'
      }} />


  },
  {
    id: 'question',
    label: 'Question',
    accessor: 'title',
    width: '22%',
    sortable: true,
    render: (val, row) =>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
      
          <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: '#FAE7F1',
          color: '#970070',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 600,
          flexShrink: 0
        }}>
        
            {getQBInitials(row.creator)}
          </div>
          <div
        style={{
          minWidth: 0
        }}>
        
            <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: '#0A0A0A',
            marginBottom: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
          
              {row.title.length > 50 ?
          row.title.slice(0, 50) + '...' :
          row.title}
            </div>
            <div
          style={{
            fontSize: 11,
            color: '#60636A'
          }}>
          
              {row.code}
            </div>
          </div>
        </div>

  },
  {
    id: 'type',
    label: 'Type',
    accessor: 'type',
    width: '12%'
  },
  {
    id: 'folder',
    label: 'Folder',
    accessor: 'folder',
    width: '16%',
    render: (val, row) =>
    <div>
          <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: '#0A0A0A',
          marginBottom: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
        
            {row.folder}
          </div>
          <div
        style={{
          fontSize: 11,
          color: '#60636A',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
        
            {row.tags.join(', ')}
          </div>
        </div>

  },
  {
    id: 'status',
    label: 'Status',
    accessor: 'status',
    width: '11%',
    render: (val) => {
      const mapped = mapQBStatusToStatus(val as string);
      return <StatusBadge status={mapped.status} label={mapped.label} />;
    }
  },
  {
    id: 'age',
    label: 'Age',
    accessor: 'age',
    width: '9%'
  },
  {
    id: 'difficulty',
    label: 'Difficulty',
    accessor: 'difficulty',
    width: '9%'
  },
  {
    id: 'creator',
    label: 'Creator',
    accessor: 'creator',
    width: '10%',
    render: (val) => val || '—'
  },
  {
    id: 'actions',
    label: '',
    accessor: 'id',
    width: '50px',
    align: 'center',
    render: () =>
    <MoreHorizontal
      style={{
        width: 18,
        height: 18,
        color: '#0A0A0A',
        cursor: 'pointer'
      }}
      onClick={(ev) => ev.stopPropagation()} />


  }];

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
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12
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

          {/* Table view toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              background: '#f4f4f5',
              borderRadius: 8,
              padding: 2
            }}>
            
            <button
              onClick={() => setTableView('exams')}
              style={{
                padding: '4px 12px',
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                background: tableView === 'exams' ? '#ffffff' : 'transparent',
                color: tableView === 'exams' ? '#0A0A0A' : '#60636A',
                boxShadow:
                tableView === 'exams' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
              }}>
              
              Exams
            </button>
            <button
              onClick={() => setTableView('questions')}
              style={{
                padding: '4px 12px',
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                background:
                tableView === 'questions' ? '#ffffff' : 'transparent',
                color: tableView === 'questions' ? '#0A0A0A' : '#60636A',
                boxShadow:
                tableView === 'questions' ?
                '0 1px 2px rgba(0,0,0,0.06)' :
                'none'
              }}>
              
              Questions
            </button>
          </div>
        </div>

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
            placeholder={
            tableView === 'exams' ? 'Search exams...' : 'Search questions...'
            }
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

      {/* Exams Table */}
      {tableView === 'exams' &&
      <div
        style={{
          margin: '0 16px'
        }}>
        
          <DataTable
          columns={examColumns}
          data={filtered}
          currentPage={examPage}
          pageSize={examPageSize}
          totalItems={filtered.length}
          onPageChange={setExamPage}
          onPageSizeChange={setExamPageSize} />
        
        </div>
      }

      {/* Questions Table (QB View) */}
      {tableView === 'questions' &&
      <div
        style={{
          margin: '0 16px'
        }}>
        
          <DataTable
          columns={qbColumns}
          data={filteredQuestions}
          currentPage={qbPage}
          pageSize={qbPageSize}
          totalItems={filteredQuestions.length}
          onPageChange={setQbPage}
          onPageSizeChange={setQbPageSize} />
        
        </div>
      }
    </div>);

}