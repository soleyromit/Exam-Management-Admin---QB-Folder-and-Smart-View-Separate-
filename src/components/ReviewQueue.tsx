import React, { useState } from 'react'
import {
  CheckCircle2,
  X,
  ChevronRight,
  Clock,
  Sparkles,
  AlertCircle,
  MessageSquare,
  Eye,
  Plus,
  MoreHorizontal,
  ExternalLink,
  GitBranch,
  ArrowRight,
} from 'lucide-react'
/* ══ REVIEW QUEUE — Question-as-project: each pending review is an open PR ══
   Mental model: Reviewing a question = reviewing a pull request.
   The queue shows what's blocking (exams that can't publish) vs what's routine.
   Each item: WHAT (the question) / WHY (who submitted, what exam, how long ago) / DO (approve, reject, view)
   Graph nav: click Q-ID to open in QB, click exam name to open exam */
const REVIEWS = [
  {
    id: 'Q-1845',
    stem: 'A 58-year-old male presents with exertional chest pain, diaphoresis...',
    type: 'MCQ',
    submitter: 'Dr. Nguyen',
    exam: 'CV Pharm Midterm',
    submitted: '2 days ago',
    blooms: 'Analyze',
    comments: 2,
    blocking: true,
  },
  {
    id: 'Q-1839',
    stem: 'Which class of antihypertensives is contraindicated in bilateral renal artery stenosis?',
    type: 'MCQ',
    submitter: 'Dr. Lee',
    exam: 'CV Pharm Midterm',
    submitted: '3 days ago',
    blooms: 'Remember',
    comments: 0,
    blocking: true,
  },
  {
    id: 'Q-1838',
    stem: 'Match each diuretic to its primary site of action within the nephron.',
    type: 'Matching',
    submitter: 'Dr. Kim',
    exam: 'CV Pharm Midterm',
    submitted: '3 days ago',
    blooms: 'Understand',
    comments: 1,
    blocking: true,
  },
  {
    id: 'Q-1836',
    stem: 'A 72-year-old female on digoxin presents with visual disturbances and nausea...',
    type: 'MCQ',
    submitter: 'Dr. Nguyen',
    exam: 'CV Pharm Midterm',
    submitted: '4 days ago',
    blooms: 'Apply',
    comments: 3,
    blocking: true,
  },
  {
    id: 'Q-1833',
    stem: 'Describe the mechanism by which loop diuretics cause hypokalemia.',
    type: 'Short Answer',
    submitter: 'Dr. Lee',
    exam: 'Pathophys Midterm',
    submitted: '5 days ago',
    blooms: 'Analyze',
    comments: 0,
    blocking: false,
  },
  {
    id: 'Q-1831',
    stem: 'Identify the rhythm shown on the ECG strip and describe the appropriate initial management.',
    type: 'MCQ',
    submitter: 'Dr. Chen',
    exam: 'Clinical Med EOR',
    submitted: '6 days ago',
    blooms: 'Analyze',
    comments: 1,
    blocking: false,
  },
  {
    id: 'Q-1829',
    stem: 'Which statin has the highest potency for LDL reduction on a per-milligram basis?',
    type: 'MCQ',
    submitter: 'Dr. Patel',
    exam: 'CV Pharm Midterm',
    submitted: '1 week ago',
    blooms: 'Remember',
    comments: 0,
    blocking: false,
  },
]
export function ReviewQueue() {
  const [approved, setApproved] = useState<string[]>([])
  const blocking = REVIEWS.filter((r) => r.blocking && !approved.includes(r.id))
  const other = REVIEWS.filter((r) => !r.blocking && !approved.includes(r.id))
  const approvedItems = REVIEWS.filter((r) => approved.includes(r.id))
  function Row({
    r,
    showApprove,
  }: {
    r: (typeof REVIEWS)[0]
    showApprove: boolean
  }) {
    const isApproved = approved.includes(r.id)
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          cursor: 'pointer',
          opacity: isApproved ? 0.6 : 1,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background =
            'var(--interactive-hover-row, var(--accent))')
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 2,
            }}
          >
            {/* Graph nav: Q-ID links to question bank */}
            <span
              style={{
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                color: 'var(--brand)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {r.id}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--foreground)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {r.stem}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: 'var(--muted-foreground)',
            }}
          >
            <span>{r.submitter}</span>
            <span>·</span>
            <span>{r.submitted}</span>
            <span>·</span>
            {/* Graph nav: exam name links to exam detail */}
            <span
              style={{
                color: 'var(--brand)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {r.exam} <ExternalLink style={{ width: 9, height: 9 }} />
            </span>
            <span>·</span>
            <span>{r.type}</span>
            {r.comments > 0 && (
              <>
                <span>·</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <MessageSquare style={{ width: 10, height: 10 }} />{' '}
                  {r.comments}
                </span>
              </>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {isApproved ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                background: '#f0fdf4',
                color: '#15803d',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              <CheckCircle2 style={{ width: 12, height: 12 }} /> Approved
            </div>
          ) : showApprove ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setApproved([...approved, r.id])
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
                fontSize: 12,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <CheckCircle2 style={{ width: 12, height: 12 }} /> Approve
            </button>
          ) : null}
          <button
            style={{
              padding: '5px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              border: '1px solid var(--border)',
              cursor: 'pointer',
            }}
          >
            <Eye
              style={{
                width: 13,
                height: 13,
                color: 'var(--muted-foreground)',
              }}
            />
          </button>
          <button
            style={{
              padding: '5px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              border: '1px solid var(--border)',
              cursor: 'pointer',
            }}
          >
            <MoreHorizontal
              style={{
                width: 13,
                height: 13,
                color: 'var(--muted-foreground)',
              }}
            />
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="flex-1 overflow-y-auto">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-display, 28px)',
              fontWeight: 600,
              color: 'var(--foreground)',
              marginBottom: 4,
            }}
          >
            Review Queue
          </h1>
          <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
            {REVIEWS.length - approved.length} questions pending ·{' '}
            {blocking.length} blocking the April 17 exam
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
            cursor: 'pointer',
          }}
        >
          <Sparkles style={{ width: 14, height: 14, color: 'var(--brand)' }} />{' '}
          Ask Leo
        </button>
      </div>

      {/* AI insight — Why these reviews matter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          padding: '20px',
          background: 'var(--card)',
          border: 'none',
          boxShadow: 'var(--card-ring, 0 0 0 1px rgba(0,0,0,0.08))',
          borderRadius: 16,
          marginBottom: 20,
          position: 'relative',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#fef9c3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AlertCircle
            style={{ width: 16, height: 16, color: 'var(--warning)' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--foreground)',
              marginBottom: 3,
            }}
          >
            {blocking.length} reviews blocking April 17 publish
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'var(--muted-foreground)',
              lineHeight: 1.5,
            }}
          >
            The CV Pharm Midterm can't pass the publish gate until all questions
            are approved. Approving these {blocking.length} items would unblock
            the exam.
          </div>
        </div>
        <button
          style={{
            position: 'absolute',
            bottom: 12,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            color: 'var(--muted-foreground)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Sparkles style={{ width: 11, height: 11, color: 'var(--brand)' }} />{' '}
          Ask Leo
        </button>
      </div>

      {/* Blocking section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 8,
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--destructive)',
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--destructive)',
          }}
        />
        Blocking publish · {blocking.length}
      </div>
      <div
        style={{
          background: 'var(--card)',
          border: 'none',
          boxShadow: 'var(--card-ring, 0 0 0 1px rgba(0,0,0,0.08))',
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 20,
        }}
      >
        {blocking.map((r, i) => (
          <Row key={r.id} r={r} showApprove />
        ))}
      </div>

      {/* Other section */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--muted-foreground)',
          marginBottom: 8,
        }}
      >
        Other reviews · {other.length}
      </div>
      <div
        style={{
          background: 'var(--card)',
          border: 'none',
          boxShadow: 'var(--card-ring, 0 0 0 1px rgba(0,0,0,0.08))',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        {other.map((r, i) => (
          <Row key={r.id} r={r} showApprove={true} />
        ))}
      </div>

      {/* Approved section */}
      {approvedItems.length > 0 && (
        <>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--muted-foreground)',
              marginBottom: 8,
              marginTop: 20,
            }}
          >
            Recently approved · {approvedItems.length}
          </div>
          <div
            style={{
              background: 'var(--card)',
              border: 'none',
              boxShadow: 'var(--card-ring, 0 0 0 1px rgba(0,0,0,0.08))',
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            {approvedItems.map((r, i) => (
              <Row key={r.id} r={r} showApprove={false} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
function MoreHorizontal(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  )
}
