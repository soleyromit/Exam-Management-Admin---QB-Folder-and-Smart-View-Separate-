import React from 'react';

export function CourseBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '1px 7px',
      borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: '#f5f3ff', color: '#7c3aed', border: '1px solid #e9d5ff'
    }}>
      <i className="fa-regular fa-graduation-cap" style={{ fontSize: 9 }} /> Course
    </span>);

}

export function PersonalBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '1px 7px',
      borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe'
    }}>
      <i className="fa-regular fa-user" style={{ fontSize: 9 }} /> Personal
    </span>);

}

// ── Faculty access banner (shown once a folder is selected) ───────────────────────
export function FacultyAccessBanner({ courseNames }: {courseNames: string[];}) {
  if (courseNames.length === 0) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '7px 16px',
      background: '#f0f9ff', borderBottom: '1px solid #bae6fd', flexShrink: 0
    }}>
      <i className="fa-regular fa-circle-info" style={{ fontSize: 13, color: '#0369a1', flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: '#0369a1', lineHeight: 1.5 }}>
        <strong>Faculty view</strong> — You can browse approved questions, create questions
        for your courses, and request edit access to existing ones.{' '}
        Assigned courses:{' '}
        {courseNames.map((c, i) =>
        <span key={c}>
            <strong>{c}</strong>{i < courseNames.length - 1 ? ', ' : ''}
          </span>
        )}
      </span>
    </div>);

}

// ── Faculty onboarding/empty state ───────────────────────────────────────────
export function FacultyOnboardingBanner({ courses }: {courses: string[];}) {
  const noCoursesYet = courses.length === 0;

  if (noCoursesYet) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 32px', gap: 0,
        background: 'white'
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: 'linear-gradient(135deg,#f3f4f6 0%,#e5e7eb 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20
        }}>
          <i className="fa-regular fa-hourglass-half" style={{ fontSize: 26, color: '#9ca3af' }} />
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#111827', textAlign: 'center' }}>
          No courses assigned yet
        </h2>
        <p style={{ margin: '0 0 24px', fontSize: 14, color: '#6b7280', textAlign: 'center', maxWidth: 380, lineHeight: 1.6 }}>
          Your department head hasn't assigned you any courses yet.
          Once they do, your course folders and questions will appear here.
        </p>
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: '12px 16px', borderRadius: 10,
          background: '#fffbeb', border: '1px solid #fde68a',
          maxWidth: 400, width: '100%'
        }}>
          <i className="fa-regular fa-bell" style={{ fontSize: 13, color: '#92400e', marginTop: 1, flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>
            <strong>What to expect:</strong> Your admin will assign course folders to your account.
            You'll see your courses here as soon as they're assigned.
          </div>
        </div>
      </div>);

  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 32px', gap: 0,
      background: 'white'
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: 'linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20
      }}>
        <i className="fa-regular fa-graduation-cap" style={{ fontSize: 26, color: '#7c3aed' }} />
      </div>
      <h2 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#111827', textAlign: 'center' }}>
        Select a course to begin
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: 14, color: '#6b7280', textAlign: 'center', maxWidth: 380, lineHeight: 1.6 }}>
        You have {courses.length} course{courses.length !== 1 ? 's' : ''} assigned.
        Pick one from the sidebar to see its questions.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 24, maxWidth: 440 }}>
        {courses.map((c) =>
        <span key={c} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 20,
          background: '#f5f3ff', border: '1px solid #ddd6fe',
          color: '#6d28d9', fontSize: 13, fontWeight: 600
        }}>
            <i className="fa-regular fa-graduation-cap" style={{ fontSize: 11 }} />
            {c}
          </span>
        )}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 14px', borderRadius: 9,
        background: '#f9fafb', border: '1px solid #e5e7eb',
        maxWidth: 380, width: '100%'
      }}>
        <i className="fa-regular fa-sidebar" style={{ fontSize: 12, color: '#6b7280', flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>
          Use the <strong>Library panel</strong> on the left to select a course folder.
        </span>
      </div>
    </div>);

}

// ── Creator cell ────────────────────────────────────────────────────────────
export function CreatorCell({ creator, collaborator, currentUser

}: {creator?: string;collaborator?: string;currentUser: string;}) {
  const primary = creator || collaborator || '—';
  const isMe = primary === currentUser;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span style={{ fontSize: 12, color: 'var(--foreground)', fontWeight: isMe ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{primary}</span>
      {collaborator && collaborator !== creator &&
      <span style={{ fontSize: 10, color: 'var(--muted-foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>edited by {collaborator}</span>
      }
    </div>);

}

// ── Tree guide lines ────────────────────────────────────────────────────────────
export function TreeGuides({ depth, isLast }: {depth: number;isLast?: boolean;}) {
  if (depth === 0) return null;

  const INDENT = 16;
  const BASE = 8;
  const guideX = (i: number) => BASE + i * INDENT + 7;

  return (
    <>
      {Array.from({ length: depth - 1 }).map((_, i) =>
      <span
        key={i}
        style={{
          position: 'absolute',
          left: guideX(i),
          top: 0,
          bottom: -1,
          width: 1,
          background: 'var(--border)',
          pointerEvents: 'none'
        }} />

      )}
      <span
        style={{
          position: 'absolute',
          left: guideX(depth - 1),
          top: 0,
          bottom: isLast ? '50%' : -1,
          width: 1,
          background: 'var(--border)',
          pointerEvents: 'none'
        }} />
      
      <span
        style={{
          position: 'absolute',
          left: guideX(depth - 1),
          top: '50%',
          width: BASE + depth * INDENT - guideX(depth - 1) - 1,
          height: 1,
          background: 'var(--border)',
          pointerEvents: 'none',
          transform: 'translateY(-50%)'
        }} />
      
    </>);

}

// ── Inline folder input ───────────────────────────────────────────────────────
export function InlineFolderInput({
  parentId, depth, activePid, name, onSetName, onConfirm, onCancel, inputRef, br, fg, mfg




}: {parentId: string | null;depth: number;activePid: string | null | undefined;name: string;onSetName: (v: string) => void;onConfirm: () => void;onCancel: () => void;inputRef: React.RefObject<HTMLInputElement>;br: string;fg: string;mfg: string;}) {
  if (activePid !== parentId) return null;
  const indent = 8 + depth * 16;
  const isCourseInput = parentId === '__course__';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: `4px 8px 4px ${indent}px` }}>
      <i className={isCourseInput ? 'fa-regular fa-graduation-cap' : 'fa-regular fa-folder'} style={{ fontSize: 12, color: mfg, flexShrink: 0 }} />
      <input
        ref={inputRef}
        value={name}
        onChange={(e) => onSetName(e.target.value)}
        onKeyDown={(e) => {if (e.key === 'Enter') onConfirm();if (e.key === 'Escape') onCancel();}}
        onBlur={onConfirm}
        placeholder={isCourseInput ? 'Course name…' : 'Folder name…'}
        style={{ flex: 1, fontSize: 12, border: 'none', outline: `2px solid ${br}`, borderRadius: 4, padding: '2px 6px', color: fg, background: 'white', minWidth: 0 }} />
      
    </div>);

}

// ── Tooltip with caret ────────────────────────────────────────────────────────
export function Tooltip({ children, label }: {children: React.ReactNode;label: string;}) {
  const [show, setShow] = React.useState(false);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const timerRef = React.useRef<any>(null);
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPos({ x: r.left + r.width / 2, y: r.top });
        timerRef.current = setTimeout(() => setShow(true), 500);
      }}
      onMouseLeave={() => {clearTimeout(timerRef.current);setShow(false);}}>
      
      {children}
      {show &&
      <div style={{ position: 'fixed', left: pos.x, top: pos.y - 6, transform: 'translate(-50%,-100%)', background: '#0f172a', color: 'white', padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap', zIndex: 99999, pointerEvents: 'none', letterSpacing: '0.01em', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
          {label}
          <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #0f172a' }} />
        </div>
      }
    </span>);

}