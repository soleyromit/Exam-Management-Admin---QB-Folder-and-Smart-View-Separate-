import React, { useState } from 'react';
import type { Question } from './QBData';

// ── RequestEditModal ─────────────────────────────────────────────────────────────
export function RequestEditModal({ requestEditId, questions, onClose

}: {requestEditId: string;questions: {id: string;title?: string;}[];onClose: () => void;}) {
  const [reason, setReason] = useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: 14, padding: 24, width: 380, boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fa-regular fa-key" style={{ fontSize: 16, color: '#7c3aed' }} />
          </span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>View-Only Access</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>You don't have edit access to this question</div>
          </div>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#475569', marginBottom: 14, lineHeight: 1.5, borderLeft: '3px solid #e2e8f0' }}>
          {(questions.find((q) => q.id === requestEditId)?.title || '').slice(0, 90)}
          {(questions.find((q) => q.id === requestEditId)?.title || '').length > 90 ? '…' : ''}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 2 }}>How would you like to proceed?</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 8, background: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <i className="fa-regular fa-paper-plane" style={{ fontSize: 13, color: '#0284c7', marginTop: 1, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#0369a1' }}>Request Edit Access</div>
              <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4, marginTop: 2 }}>Notify the question owner to grant you editing rights</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 8, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <i className="fa-regular fa-copy" style={{ fontSize: 13, color: '#16a34a', marginTop: 1, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#166534' }}>Duplicate as Personal Copy</div>
              <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4, marginTop: 2 }}>Create your own editable version scoped only to your courses</div>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Reason for edit request <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span></div>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Found a factual error in option C…" style={{ width: '100%', borderRadius: 8, border: '1px solid #e2e8f0', padding: '8px 10px', fontSize: 12, resize: 'none', height: 60, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 12, cursor: 'pointer', color: '#475569' }}>Cancel</button>
          <button onClick={onClose} style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #bbf7d0', background: '#f0fdf4', fontSize: 12, cursor: 'pointer', color: '#166534', fontWeight: 600 }}>Duplicate Copy</button>
          <button onClick={onClose} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#7c3aed', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Request Access</button>
        </div>
      </div>
    </div>);

}

// ── EditImpactWarningModal ─────────────────────────────────────────────────────────────
export function EditImpactWarningModal({ editImpactQ, onClose, onEditAnyway

}: {editImpactQ: Question;onClose: () => void;onEditAnyway: () => void;}) {
  const tags = (editImpactQ.tags || []).map((t) => t.toLowerCase());
  const affectedCourseMap: Record<string, string> = {
    'phar101': 'Phar 101 (2026 batch)',
    'biol201': 'Biol 201 (2026 batch)',
    'skel101': 'Skel 101 (2026 batch)'
  };
  // Build affected courses from course-code tags (exclude the faculty's own courses)
  const facultyCourses = ['phar101', 'biol201'];
  const affectedCourses = tags.
  filter((t) => Object.keys(affectedCourseMap).includes(t)).
  map((t) => affectedCourseMap[t]);
  if (affectedCourses.length === 0) affectedCourses.push('Phar 101 (2026 batch)', 'Skel 101 (2026 batch)');

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: 14, padding: 24, width: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fa-regular fa-triangle-exclamation" style={{ fontSize: 16, color: '#d97706' }} />
          </span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Heads up — cross-course question</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>This edit will affect other courses</div>
          </div>
        </div>
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 12px', fontSize: 12, marginBottom: 14 }}>
          <div style={{ fontWeight: 600, color: '#92400e', marginBottom: 6 }}>Affected courses:</div>
          {affectedCourses.map((course, i) =>
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#78350f', fontSize: 12, marginBottom: i < affectedCourses.length - 1 ? 4 : 0 }}>
              <i className="fa-regular fa-graduation-cap" style={{ fontSize: 11, color: '#d97706', flexShrink: 0 }} />
              {course}
            </div>
          )}
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#475569', marginBottom: 16 }}>
          <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>Choose how to proceed:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <i className="fa-regular fa-pen" style={{ fontSize: 11, color: '#d97706', marginTop: 2, flexShrink: 0 }} />
              <span><strong>Edit directly</strong> — changes apply to all tagged courses simultaneously</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <i className="fa-regular fa-copy" style={{ fontSize: 11, color: '#2563eb', marginTop: 2, flexShrink: 0 }} />
              <span><strong>Save as Copy</strong> — create a version scoped only to your assigned courses</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 12, cursor: 'pointer', color: '#475569' }}>Cancel</button>
          <button onClick={onClose} style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #bfdbfe', background: '#eff6ff', fontSize: 12, cursor: 'pointer', color: '#1d4ed8', fontWeight: 600 }}>Save as Copy</button>
          <button onClick={() => {onEditAnyway();onClose();}} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#d97706', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Edit Anyway</button>
        </div>
      </div>
    </div>);

}

// ── SectionOverlapModal ─────────────────────────────────────────────────────────────
export function SectionOverlapModal({ question, onClose, onAddAnyway

}: {question: Question;onClose: () => void;onAddAnyway: () => void;}) {
  const sections = question.usedInSections || [];
  const sectionInB = sections.includes('Section B');
  const sectionInA = sections.includes('Section A');

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: 14, padding: 24, width: 440, boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fa-regular fa-users" style={{ fontSize: 15, color: '#d97706' }} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Cross-Section Overlap Detected</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>This question has been used in another section of Phar 101 (2026 batch)</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, borderRadius: 4, display: 'flex' }}>
            <i className="fa-regular fa-xmark" style={{ fontSize: 14 }} />
          </button>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 8, padding: '9px 12px', fontSize: 12, color: '#475569', marginBottom: 14, lineHeight: 1.5, borderLeft: '3px solid #fbbf24' }}>
          {question.title?.slice(0, 90)}{(question.title?.length || 0) > 90 ? '…' : ''}
        </div>
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '12px', marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 8 }}>Previously used in:</div>
          {sections.map((s, i) =>
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#78350f', marginBottom: i < sections.length - 1 ? 6 : 0 }}>
              <i className="fa-regular fa-calendar-days" style={{ fontSize: 11, color: '#d97706', flexShrink: 0 }} />
              <span style={{ fontWeight: 600 }}>{s}</span>
              <span style={{ color: '#92400e', fontSize: 11 }}>
                {s === 'Section B' ? '— High Achievers Batch' : '— Regular Batch'}
              </span>
            </div>
          )}
          <div style={{ marginTop: 10, fontSize: 11, color: '#92400e', lineHeight: 1.5, borderTop: '1px solid #fde68a', paddingTop: 8 }}>
            <i className="fa-regular fa-circle-info" style={{ marginRight: 5 }} />
            {sectionInB && !sectionInA ?
            'Adding this to Section A (Regular Batch) creates overlap with Section B (High Achievers Batch). The assessment engine will flag this during exam review.' :
            sectionInA && !sectionInB ?
            'Adding this to Section B (High Achievers Batch) creates overlap with Section A (Regular Batch).' :
            'This question has been used in both sections. Adding it again will create overlap.'}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 2 }}>What would you like to do?</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 8, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <i className="fa-regular fa-circle-check" style={{ fontSize: 13, color: '#16a34a', marginTop: 1, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#166534' }}>
                Add to {sectionInA ? 'Section B' : 'Section A'} (with awareness flag)
              </div>
              <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4, marginTop: 2 }}>Question added to your shortlist. Overlap noted for assessment review.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 8, background: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <i className="fa-regular fa-magnifying-glass" style={{ fontSize: 13, color: '#0284c7', marginTop: 1, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#0369a1' }}>Find a Similar Question</div>
              <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4, marginTop: 2 }}>Browse alternative questions covering the same concept.</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 12, cursor: 'pointer', color: '#475569' }}>Cancel</button>
          <button onClick={onClose} style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #bfdbfe', background: '#eff6ff', fontSize: 12, cursor: 'pointer', color: '#1d4ed8', fontWeight: 600 }}>
            <i className="fa-regular fa-magnifying-glass" style={{ marginRight: 5 }} />Find Similar
          </button>
          <button onClick={() => {onAddAnyway();onClose();}} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#059669', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <i className="fa-regular fa-circle-check" style={{ marginRight: 5 }} />Add Anyway
          </button>
        </div>
      </div>
    </div>);

}

// ── CrossDeptBlockModal ─────────────────────────────────────────────────────────────
export function CrossDeptBlockModal({ question, onClose

}: {question: Question;onClose: () => void;}) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: 14, padding: 24, width: 400, boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fa-regular fa-lock" style={{ fontSize: 15, color: '#dc2626' }} />
          </span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Edit Access Restricted</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>This question belongs to a different department</div>
          </div>
        </div>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px', fontSize: 12, color: '#991b1b', marginBottom: 14, lineHeight: 1.55 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Skel 101 — Skeletal Sciences</div>
          This question is owned by the Skeletal Sciences department. Faculty outside that department cannot edit it directly — even with full course history access.
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px', fontSize: 12, color: '#475569', marginBottom: 16 }}>
          <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>What you can do instead:</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
            <i className="fa-regular fa-copy" style={{ fontSize: 11, color: '#2563eb', marginTop: 2, flexShrink: 0 }} />
            <span><strong>Duplicate</strong> — create an editable copy scoped to your courses (Phar 101 (2026 batch) / Biol 201 (2026 batch))</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <i className="fa-regular fa-flag" style={{ fontSize: 11, color: '#d97706', marginTop: 2, flexShrink: 0 }} />
            <span><strong>Flag for review</strong> — notify the question owner about the issue</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 12, cursor: 'pointer', color: '#475569' }}>Close</button>
          <button onClick={onClose} style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #bfdbfe', background: '#eff6ff', fontSize: 12, cursor: 'pointer', color: '#1d4ed8', fontWeight: 600 }}>
            <i className="fa-regular fa-copy" style={{ marginRight: 5 }} />Duplicate to My Courses
          </button>
        </div>
      </div>
    </div>);

}

// ── CollaborateModal ─────────────────────────────────────────────────────────────
// 3-level collaboration: question, assessment, course.
// Available to both Admin and Faculty (faculty can collaborate on their own questions).
// Course list includes all 3 courses: Phar 101, Biol 201, Skel 101.

const ALL_FACULTY = [
{ name: 'Dr. Patel', dept: 'Pharmacology', avatar: 'P', color: '#6366f1' },
{ name: 'Dr. Chen', dept: 'Cardiology', avatar: 'C', color: '#0ea5e9' },
{ name: 'Dr. Lee', dept: 'Physiology', avatar: 'L', color: '#10b981' },
{ name: 'Dr. Ramirez', dept: 'Biochemistry', avatar: 'R', color: '#f59e0b' },
{ name: 'Dr. Kim', dept: 'Anatomy', avatar: 'K', color: '#ef4444' }];


export function CollaborateModal({ onClose, currentUser }: {onClose: () => void;currentUser?: string;}) {
  const [level, setLevel] = useState<'question' | 'assessment' | 'course'>('assessment');
  const [questionRef, setQuestionRef] = useState('');
  const [assessmentName, setAssessmentName] = useState('');
  const [section, setSection] = useState('Section A — Regular Batch');
  const [courseRef, setCourseRef] = useState('Phar 101 (2026 batch)');
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit'>('view');
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  const LEVELS = [
  { id: 'question', icon: 'circle-question', label: 'Question Level', desc: 'Co-author or peer-review a specific question' },
  { id: 'assessment', icon: 'file-lines', label: 'Assessment Level', desc: 'Build a shared question set for an exam or quiz' },
  { id: 'course', icon: 'graduation-cap', label: 'Course Level', desc: 'Co-manage the full question bank for a course' }] as
  const;

  const toggleFaculty = (name: string) => {
    setSelectedFaculty((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
  };

  const otherFaculty = ALL_FACULTY.filter((f) => f.name !== (currentUser || 'Dr. Patel'));

  if (sent) return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: 14, padding: 32, width: 380, textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <i className="fa-regular fa-circle-check" style={{ fontSize: 24, color: '#16a34a' }} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Collaboration request sent</div>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.5 }}>
          {selectedFaculty.length > 0 ?
          `${selectedFaculty.join(', ')} will be notified and can accept the collaboration.` :
          'Your collaboration draft has been created.'}
        </div>
        <button onClick={onClose} style={{ padding: '8px 24px', borderRadius: 8, border: 'none', background: '#059669', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Done</button>
      </div>
    </div>);


  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: 14, padding: 24, width: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fa-regular fa-users" style={{ fontSize: 16, color: '#059669' }} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Collaborate</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>Share access at question, assessment, or course level</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, borderRadius: 4, display: 'flex' }}>
            <i className="fa-regular fa-xmark" style={{ fontSize: 14 }} />
          </button>
        </div>

        {/* Level picker */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Collaboration scope</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {LEVELS.map((l) =>
            <button key={l.id} onClick={() => setLevel(l.id)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 8px', borderRadius: 8, cursor: 'pointer',
              border: `1.5px solid ${level === l.id ? '#059669' : '#e2e8f0'}`,
              background: level === l.id ? '#f0fdf4' : 'white',
              transition: 'all 0.1s'
            }}>
              
                <div style={{ width: 28, height: 28, borderRadius: 7, background: level === l.id ? '#dcfce7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`fa-regular fa-${l.icon}`} style={{ fontSize: 13, color: level === l.id ? '#059669' : '#64748b' }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: level === l.id ? '#166534' : '#374151', textAlign: 'center', lineHeight: 1.2 }}>{l.label}</span>
              </button>
            )}
          </div>
          <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 6, background: '#f8fafc', fontSize: 11, color: '#64748b' }}>
            {level === 'question' && 'Co-author or peer-review a specific question — granular, one question at a time.'}
            {level === 'assessment' && 'Share a collection of questions for a joint exam or quiz. Faculty can shortlist and vote on questions.'}
            {level === 'course' && 'Grant another faculty ongoing access to co-manage the entire question bank for a course.'}
          </div>
        </div>

        {/* Level-specific context */}
        {level === 'question' &&
        <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Question reference</div>
            <input value={questionRef} onChange={(e) => setQuestionRef(e.target.value)}
          placeholder="e.g. PHR26-003 — paste question code"
          style={{ width: '100%', borderRadius: 8, border: '1px solid #e2e8f0', padding: '8px 10px', fontSize: 12, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#059669'} onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'} />
          </div>
        }

        {level === 'assessment' &&
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 2 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Assessment name</div>
              <input value={assessmentName} onChange={(e) => setAssessmentName(e.target.value)}
            placeholder="e.g. Phar 101 Midterm 2026"
            style={{ width: '100%', borderRadius: 8, border: '1px solid #e2e8f0', padding: '8px 10px', fontSize: 12, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#059669'} onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Section</div>
              <select value={section} onChange={(e) => setSection(e.target.value)}
            style={{ width: '100%', borderRadius: 8, border: '1px solid #e2e8f0', padding: '8px 10px', fontSize: 12, color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: 'white', cursor: 'pointer' }}>
                <option>Section A — Regular Batch</option>
                <option>Section B — High Achievers Batch</option>
                <option>Both sections</option>
              </select>
            </div>
          </div>
        }

        {level === 'course' &&
        <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Course</div>
            <select value={courseRef} onChange={(e) => setCourseRef(e.target.value)}
          style={{ width: '100%', borderRadius: 8, border: '1px solid #e2e8f0', padding: '8px 10px', fontSize: 12, color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: 'white', cursor: 'pointer' }}>
              <option>Phar 101 (2026 batch)</option>
              <option>Biol 201 (2026 batch)</option>
              <option>Skel 101 (2026 batch)</option>
            </select>
          </div>
        }

        {/* Faculty selector */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Invite co-instructors</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {otherFaculty.map((fm) => {
              const sel = selectedFaculty.includes(fm.name);
              return (
                <div key={fm.name}
                onClick={() => toggleFaculty(fm.name)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                  border: `1.5px solid ${sel ? '#059669' : '#e2e8f0'}`,
                  background: sel ? '#f0fdf4' : 'white',
                  transition: 'all 0.1s'
                }}>
                  
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: fm.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                    {fm.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{fm.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{fm.dept}</div>
                  </div>
                  {sel && <i className="fa-regular fa-circle-check" style={{ fontSize: 14, color: '#059669', flexShrink: 0 }} />}
                </div>);

            })}
          </div>
        </div>

        {/* Access level */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Access level</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['view', 'edit'] as const).map((lv) =>
            <button key={lv} onClick={() => setAccessLevel(lv)}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
              border: `1.5px solid ${accessLevel === lv ? lv === 'edit' ? '#7c3aed' : '#0284c7' : '#e2e8f0'}`,
              background: accessLevel === lv ? lv === 'edit' ? '#faf5ff' : '#f0f9ff' : 'white',
              fontSize: 12, fontWeight: 600,
              color: accessLevel === lv ? lv === 'edit' ? '#6d28d9' : '#0369a1' : '#374151'
            }}>
              
                <i className={`fa-regular ${lv === 'edit' ? 'fa-pen' : 'fa-eye'}`} style={{ fontSize: 11 }} />
                {lv === 'edit' ? 'Can edit' : 'View only'}
              </button>
            )}
          </div>
          <div style={{ marginTop: 5, fontSize: 10, color: '#94a3b8' }}>
            {accessLevel === 'view' ? 'Invited faculty can view and use questions in assessments but cannot modify them.' : 'Invited faculty can edit questions. Edits trigger a version snapshot for review.'}
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Note <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span></div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Please review the pharmacokinetics section questions…"
          style={{ width: '100%', borderRadius: 8, border: '1px solid #e2e8f0', padding: '8px 10px', fontSize: 12, resize: 'none', height: 60, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#059669'} onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'} />
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose}
          style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 12, cursor: 'pointer', color: '#475569' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>Cancel</button>
          <button onClick={() => setSent(true)}
          style={{ padding: '7px 20px', borderRadius: 8, border: 'none', background: '#059669', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#047857'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#059669'}>
            <i className="fa-regular fa-paper-plane" style={{ fontSize: 11 }} />
            Send Invite
          </button>
        </div>
      </div>
    </div>);

}