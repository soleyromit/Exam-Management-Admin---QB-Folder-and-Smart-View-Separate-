import React, { useState } from 'react';
import type { Role, Phase } from '../types';
import { BuildPhase } from './phases/BuildPhase';
import { PublishPhase } from './phases/PublishPhase';
import { LivePhase } from './phases/LivePhase';
import { PostExamPhase } from './phases/PostExamPhase';
import { MarksWeightage } from './MarksWeightage';
import { CheckCircle2, Clock, Radio, BarChart3, Scale } from 'lucide-react';

// ── PhaseShell v2 ──────────────────────────────────────────────────────
// Added: Marks & Weightage tab between Build and Publish
// Source: marks_weightage_features.md (project attachment)
// Secondary tab row: Marks sits as a sub-section of Build,
// accessible from both Build toolbar and its own tab.
// This follows Arun's principle: design system not mandated,
// speed of delivery over conformity. (791334af)

const PHASES: {
  id: Phase;
  label: string;
  sub: string;
  icon: React.ElementType;
  status: 'done' | 'active' | 'upcoming';
}[] = [{
  id: 'build',
  label: 'Build',
  sub: 'Questions + sections',
  icon: CheckCircle2,
  status: 'done'
}, {
  id: 'marks',
  label: 'Marks',
  sub: 'Weightage + scoring',
  icon: Scale,
  status: 'active'
}, {
  id: 'publish',
  label: 'Publish',
  sub: 'Review + schedule',
  icon: Clock,
  status: 'upcoming'
}, {
  id: 'live',
  label: 'Live exam',
  sub: 'Monitor + support',
  icon: Radio,
  status: 'upcoming'
}, {
  id: 'post-exam',
  label: 'Post-exam',
  sub: 'Score + release',
  icon: BarChart3,
  status: 'upcoming'
}];
const PHASE_ROLES: Record<Phase, Role[]> = {
  build: ['faculty', 'dept-head', 'contributor', 'reviewer', 'inst-admin'],
  marks: ['faculty', 'dept-head', 'inst-admin'],
  publish: ['faculty', 'dept-head', 'inst-admin'],
  live: ['faculty', 'dept-head', 'inst-admin'],
  'post-exam': ['faculty', 'dept-head', 'outcome-director', 'inst-admin'],
  'student-exam': [],
  'pa-dashboard': ['dept-head', 'outcome-director', 'faculty', 'inst-admin']
};
export function PhaseShell({
  role,
  onOpenQuestionEditor,
  onOpenPublishGate,
  onOpenFormulaEditor





}: {role: Role;onOpenQuestionEditor: () => void;onOpenPublishGate: () => void;onOpenFormulaEditor?: () => void;}) {
  const [phase, setPhase] = useState<Phase>('build');
  return <div className="flex-1 flex flex-col overflow-hidden">
      {/* Phase navigator */}
      <div className="flex items-center px-4 flex-shrink-0" style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)'
    }}>
        {PHASES.filter((p) => p.id !== 'student-exam' && p.id !== 'pa-dashboard').map((p, i, arr) => {
        const Icon = p.icon;
        const accessible = PHASE_ROLES[p.id].includes(role);
        const isActive = phase === p.id;
        return <button key={p.id} onClick={() => accessible && setPhase(p.id)} disabled={!accessible} className="flex items-center gap-2.5 px-4 py-3.5 relative transition-colors" style={{
          opacity: accessible ? 1 : 0.35,
          cursor: accessible ? 'pointer' : 'not-allowed',
          borderBottom: `2px solid ${isActive ? 'var(--brand)' : 'transparent'}`,
          marginBottom: -1,
          background: 'none',
          border: 'none'
        }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{
            background: p.status === 'done' ? '#10B981' : isActive ? 'var(--brand)' : 'var(--surface3)',
            color: p.status === 'done' || isActive ? 'white' : 'var(--text3)',
            fontSize: 11
          }}>
                {p.status === 'done' ? <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg> : <span style={{
              fontWeight: 600
            }}>{i + 1}</span>}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium" style={{
              color: isActive ? 'var(--brand)' : accessible ? 'var(--text)' : 'var(--text3)'
            }}>{p.label}</div>
                <div className="text-xs" style={{
              color: 'var(--text3)'
            }}>{p.sub}</div>
              </div>
              {i < arr.length - 1 && <div style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 1,
            height: 20,
            background: 'var(--border)'
          }} />}
            </button>;
      })}
        <div className="ml-auto flex items-center gap-3 text-xs" style={{
        color: 'var(--text3)',
        paddingRight: 8
      }}>
          <span className="px-2 py-1 rounded mono" style={{
          background: 'var(--surface3)'
        }}>Apr 17 · 9:00 AM</span>
          <span className="px-2 py-1 rounded" style={{
          background: 'var(--surface3)'
        }}>90 min</span>
          <span className="px-2 py-1 rounded" style={{
          background: 'var(--surface3)'
        }}>87 students</span>
        </div>
      </div>

      {/* Phase content */}
      <div className="flex-1 overflow-auto">
        {phase === 'build' && <BuildPhase role={role} onOpenQuestionEditor={onOpenQuestionEditor} onOpenFormulaEditor={onOpenFormulaEditor} />}
        {phase === 'marks' && <MarksWeightage />}
        {phase === 'publish' && <PublishPhase role={role} onOpenPublishGate={onOpenPublishGate} />}
        {phase === 'live' && <LivePhase role={role} />}
        {phase === 'post-exam' && <PostExamPhase role={role} />}
      </div>
    </div>;
}