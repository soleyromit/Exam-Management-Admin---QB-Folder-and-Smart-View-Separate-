import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell } from
'recharts';
import {
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Flag,
  Plus,
  Users,
  Shield } from
'lucide-react';

const BLOOM = [
{ l: 'Remember', v: 15 },
{ l: 'Understand', v: 20 },
{ l: 'Apply', v: 30 },
{ l: 'Analyze', v: 20 },
{ l: 'Evaluate', v: 10 },
{ l: 'Create', v: 5 }];


const QB_STATUS = [
{ name: 'Active', value: 412 },
{ name: 'Ready', value: 318 },
{ name: 'In Review', value: 204 },
{ name: 'Draft', value: 657 },
{ name: 'Approved', value: 189 },
{ name: 'Flagged', value: 67 }];

const QB_STATUS_COLORS = ['#16a34a', '#2563eb', '#d97706', '#94a3b8', '#7c3aed', '#dc2626'];

const QB_BY_FOLDER = [
{ name: 'Pharmacology', v: 487 },
{ name: 'Cardiology', v: 312 },
{ name: 'Neurology', v: 241 },
{ name: 'Physiology', v: 198 },
{ name: 'Anatomy', v: 176 },
{ name: 'Pathology', v: 143 },
{ name: 'Biochem', v: 112 },
{ name: 'Other', v: 178 }];


const ADMIN_ACTIVITY = [
{ text: 'Q-1842 approved by Dr. Patel', time: '12 min ago', icon: CheckCircle2 },
{ text: 'CV Pharm Midterm passed publish gate', time: '1 hr ago', icon: CheckCircle2 },
{ text: 'Q-1203 auto-flagged — negative PBis', time: '2 hrs ago', icon: Flag },
{ text: '143 questions imported from ExamSoft', time: '5 hrs ago', icon: BookOpen },
{ text: 'Dr. Kim submitted 8 new Cardiology Qs', time: '6 hrs ago', icon: CheckCircle2 }];


const FACULTY_ACTIVITY = [
{ text: 'Your Q-1842 was approved by Dr. Patel', time: '12 min ago', icon: CheckCircle2 },
{ text: 'Q-1099 flagged for your review', time: '3 hrs ago', icon: Flag },
{ text: 'CV Pharm Midterm ready for your review', time: '5 hrs ago', icon: CheckCircle2 },
{ text: 'Bloom\u2019s gap detected in your Qs', time: '1d ago', icon: AlertCircle }];


const MY_QB_STATUS = [
{ name: 'Active', value: 34 },
{ name: 'Ready', value: 28 },
{ name: 'In Review', value: 12 },
{ name: 'Draft', value: 41 },
{ name: 'Flagged', value: 3 }];


const TT = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 12,
  color: 'var(--foreground)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
};
const AX = { fontSize: 11, fill: 'var(--muted-foreground)' };

function Spark({ c }: {c: string;}) {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
      <path d="M1 8L4 5L7 6.5L13 2" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>);

}

function RolePill({ label, active, onClick }: {label: string;active: boolean;onClick: () => void;}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: active ? 700 : 500,
        border: '1px solid var(--border)',
        background: active ? 'var(--brand)' : 'transparent',
        color: active ? 'var(--brand-foreground)' : 'var(--muted-foreground)',
        cursor: 'pointer', transition: 'all 0.15s'
      }}>
      
      {label === 'Admin' ? <Shield size={11} /> : <Users size={11} />}
      {label}
    </button>);

}

export function ExamDashboard({
  onOpenExam,
  onNavigate



}: {onOpenExam?: (name?: string) => void;onNavigate?: (page: string) => void;}) {
  const [role, setRole] = useState<'admin' | 'faculty'>('admin');
  const isAdmin = role === 'admin';

  // ─── ADMIN KPIs ──────────────────────────────────────────────────────────────
  const adminKPIs = [
  {
    label: 'Reviews Blocking Publish',
    value: '7',
    delta: '-2',
    color: 'var(--warning)',
    context: '4 blocking April 17 Midterm. 3 from Cardiology import — Dr. Kim is reviewer.',
    action: 'Open queue',
    target: 'review-queue',
    secondary: 'Nudge Dr. Kim'
  },
  {
    label: 'Next Exam: Apr 17',
    value: '92%',
    delta: 'ready',
    color: 'var(--success)',
    context: 'CV Pharm Midterm — 50 questions. Publish gate: 2 items remaining.',
    action: 'Fix & publish',
    target: 'exams',
    secondary: null
  },
  {
    label: 'Question Bank Health',
    value: '1,847',
    delta: '+142',
    color: 'var(--brand)',
    context: "8 flagged (negative PBis). 142 imported missing Bloom\u2019s tags.",
    action: 'Review flagged',
    target: 'question-bank',
    secondary: 'AI tagging'
  }];


  // ─── FACULTY KPIs ────────────────────────────────────────────────────────────
  const facultyKPIs = [
  {
    label: 'My Questions',
    value: '118',
    delta: '+8 this month',
    color: 'var(--brand)',
    context: '41 drafts, 12 in review, 34 active. 3 flagged for low PBis.',
    action: 'View my questions',
    target: 'question-bank',
    secondary: null
  },
  {
    label: 'Pending My Review',
    value: '4',
    delta: 'action needed',
    color: 'var(--warning)',
    context: '2 questions from colleagues need your sign-off before April 17 Midterm.',
    action: 'Review now',
    target: 'review-queue',
    secondary: null
  },
  {
    label: 'My Next Exam',
    value: 'Apr 17',
    delta: '11 days',
    color: 'var(--success)',
    context: 'CV Pharm Midterm — 50 questions selected. 2 publish gate items remain.',
    action: 'Open exam',
    target: 'exams',
    secondary: null
  }];


  const kpis = isAdmin ? adminKPIs : facultyKPIs;

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto', fontFamily: 'var(--font-ui)' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 26,
            color: 'var(--foreground)', margin: 0, lineHeight: 1.2
          }}>
            {isAdmin ? 'Program Dashboard' : 'My Dashboard'}
          </h1>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4 }}>
            {isAdmin ?
            'Program-wide view \u2014 exam health, question bank, review queue' :
            'Your questions, exams, and review items'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Role toggle (demo) */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: 3, borderRadius: 24, border: '1px solid var(--border)',
            background: 'var(--muted)'
          }}>
            <RolePill label="Admin" active={isAdmin} onClick={() => setRole('admin')} />
            <RolePill label="Faculty" active={!isAdmin} onClick={() => setRole('faculty')} />
          </div>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '7px 12px', borderRadius: 10, border: '1px solid var(--border)',
              background: 'transparent', fontSize: 13, color: 'var(--foreground)', cursor: 'pointer'
            }}>
            
            <Sparkles style={{ width: 14, height: 14, color: 'var(--brand)' }} /> Ask Leo
          </button>
          <button
            onClick={() => onNavigate?.('exam-list')}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '7px 14px', borderRadius: 10, background: 'var(--primary)',
              fontSize: 13, fontWeight: 600, color: 'var(--primary-foreground)',
              cursor: 'pointer', border: 'none'
            }}>
            
            <Plus style={{ width: 14, height: 14 }} />
            {isAdmin ? 'New exam' : 'New question'}
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        {kpis.map((c, i) =>
        <div
          key={i}
          style={{
            padding: 20, background: 'var(--card)', boxShadow: '0 0 0 1px var(--border)',
            borderRadius: 16, display: 'flex', flexDirection: 'column', transition: 'background 0.2s'
          }}
          onMouseEnter={(e) =>
          c.target === 'exams' && (e.currentTarget.style.background = 'var(--accent)')
          }
          onMouseLeave={(e) =>
          c.target === 'exams' && (e.currentTarget.style.background = 'var(--card)')
          }>
          
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.color }} />
                <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{c.label}</span>
              </div>
              <ArrowRight style={{ width: 13, height: 13, color: 'var(--border)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
              <span style={{
              fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 600,
              color: 'var(--foreground)', lineHeight: 1
            }}>{c.value}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: c.color }}>
                <Spark c={c.color} /> {c.delta}
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--foreground)', lineHeight: 1.5, marginBottom: 10, flex: 1 }}>
              {c.context}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
              onClick={() => c.target === 'exams' ? onOpenExam?.('CV Pharm Midterm 2026') : onNavigate?.(c.target)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '5px 10px', borderRadius: 6, background: 'var(--primary)',
                color: 'var(--primary-foreground)', fontSize: 12, fontWeight: 500,
                border: 'none', cursor: 'pointer'
              }}>
              
                {c.action} <ChevronRight style={{ width: 11, height: 11 }} />
              </button>
              {c.secondary &&
            <button style={{
              padding: '5px 10px', borderRadius: 6, background: 'transparent',
              color: 'var(--muted-foreground)', fontSize: 12,
              border: '1px solid var(--border)', cursor: 'pointer'
            }}>{c.secondary}</button>
            }
            </div>
          </div>
        )}
      </div>

      {/* AI INSIGHT */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12, padding: 20,
        background: 'var(--card)', boxShadow: '0 0 0 1px var(--border)',
        borderRadius: 16, marginBottom: 20, position: 'relative'
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: '#fef9c3',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <AlertCircle style={{ width: 16, height: 16, color: 'var(--warning)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 3 }}>
            {isAdmin ?
            'Blueprint gap in Neurologic' :
            'Your Bloom\u2019s coverage skews toward Remember & Apply'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
            {isAdmin ?
            'The NCCPA blueprint needs 2 more Neuro questions, and 3 existing Neuro questions have negative PBis. Replacing the flagged items would close both gaps at once.' :
            '28 of your 118 questions target only the two lowest Bloom\u2019s levels. Adding Analyze and Evaluate questions in Pharmacology would balance your contribution to the bank.'}
          </div>
        </div>
        <button style={{
          position: 'absolute', bottom: 12, right: 16,
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 12, color: 'var(--muted-foreground)',
          background: 'transparent', border: 'none', cursor: 'pointer'
        }}>
          <Sparkles style={{ width: 11, height: 11, color: 'var(--brand)' }} /> Ask Leo
        </button>
      </div>

      {/* STATS */}
      <div style={{
        background: 'var(--card)', boxShadow: '0 0 0 1px var(--border)',
        borderRadius: 16, padding: 16, marginBottom: 20
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.06em', color: 'var(--muted-foreground)', marginBottom: 12
        }}>At a glance</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {(isAdmin ? [
          { label: 'Active exams', value: '1', sub: 'CV Pharm Midterm' },
          { label: 'Questions in bank', value: '1,847', sub: '8 flagged' },
          { label: 'Review queue', value: '7', sub: 'Blocking publish' },
          { label: 'Blueprint coverage', value: '94%', sub: '2 gaps detected' }] :
          [
          { label: 'My questions', value: '118', sub: '41 in draft' },
          { label: 'In review', value: '12', sub: 'Awaiting approval' },
          { label: 'Pending my review', value: '4', sub: 'Action needed' },
          { label: 'My smart views', value: '6', sub: '3 auto-updating' }]).
          map((s, i) =>
          <div key={i} style={{
            background: 'var(--muted)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '12px 14px'
          }}>
              <div style={{
              fontSize: 22, fontWeight: 700, color: 'var(--foreground)',
              fontFamily: 'var(--font-heading)', lineHeight: 1, marginBottom: 4
            }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground)', marginBottom: 2 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{s.sub}</div>
            </div>
          )}
        </div>
      </div>

      {/* ANALYTICS ROW */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isAdmin ? '1fr 1fr 240px' : '1fr 240px',
        gap: 12, marginBottom: 20
      }}>
        {/* Admin: Question bank by folder | Faculty: My questions by status */}
        <div style={{
          background: 'var(--card)', boxShadow: '0 0 0 1px var(--border)',
          borderRadius: 16, padding: 20
        }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>
            {isAdmin ? 'Questions by Folder' : 'My Questions by Status'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 12 }}>
            {isAdmin ? '1,847 questions across all course folders' : '118 questions across all my folders'}
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer>
              <BarChart data={isAdmin ? QB_BY_FOLDER : MY_QB_STATUS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" horizontal={false} />
                <XAxis type="number" tick={AX} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ ...AX, width: 70 }} axisLine={false} tickLine={false} width={72} />
                <Tooltip contentStyle={TT} />
                <Bar dataKey="v" fill="var(--brand)" fillOpacity={0.75} radius={[0, 4, 4, 0]} name="Questions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Admin only: Question bank status breakdown */}
        {isAdmin &&
        <div style={{
          background: 'var(--card)', boxShadow: '0 0 0 1px var(--border)',
          borderRadius: 16, padding: 20
        }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>
              Bank Status Breakdown
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 12 }}>
              Questions by workflow state
            </div>
            <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PieChart width={200} height={160}>
                <Pie data={QB_STATUS} cx={100} cy={75} innerRadius={42} outerRadius={68} dataKey="value" paddingAngle={2}>
                  {QB_STATUS.map((_, idx) =>
                <Cell key={idx} fill={QB_STATUS_COLORS[idx]} />
                )}
                </Pie>
                <Tooltip contentStyle={TT} formatter={(v, n) => [v, n]} />
              </PieChart>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 4 }}>
              {QB_STATUS.map((s, idx) =>
            <span key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--muted-foreground)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: QB_STATUS_COLORS[idx], flexShrink: 0 }} />
                  {s.name}
                </span>
            )}
            </div>
          </div>
        }

        {/* Bloom's Distribution — both roles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            background: 'var(--card)', boxShadow: '0 0 0 1px var(--border)',
            borderRadius: 16, padding: 16, flex: 1
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', marginBottom: 8 }}>
              {isAdmin ? "Bank Bloom's Coverage" : "My Bloom's Coverage"}
            </div>
            {BLOOM.map((b) =>
            <div key={b.l} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: 'var(--muted-foreground)', width: 52, textAlign: 'right' }}>{b.l}</span>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--muted)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 2, width: `${b.v * 2.5}%`, background: 'var(--brand)', opacity: 0.6 }} />
                </div>
                <span style={{ fontSize: 10, color: 'var(--muted-foreground)', width: 24 }}>{b.v}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ACTIVITY */}
      <div style={{
        background: 'var(--card)', boxShadow: '0 0 0 1px var(--border)',
        borderRadius: 16, padding: 20
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>
            {isAdmin ? 'Program Activity' : 'My Recent Activity'}
          </span>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px',
            borderRadius: 6, border: '1px solid var(--border)', background: 'transparent',
            fontSize: 12, color: 'var(--muted-foreground)', cursor: 'pointer'
          }}>
            <Sparkles style={{ width: 11, height: 11, color: 'var(--brand)' }} /> Ask Leo
          </button>
        </div>
        {(isAdmin ? ADMIN_ACTIVITY : FACULTY_ACTIVITY).map((a, i) => {
          const Ic = a.icon;
          const isAlert = a.icon === Flag || a.icon === AlertCircle;
          const list = isAdmin ? ADMIN_ACTIVITY : FACULTY_ACTIVITY;
          return (
            <div key={i} style={{
              display: 'flex', gap: 8, padding: '7px 0',
              borderBottom: i < list.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <Ic style={{
                width: 13, height: 13, marginTop: 2, flexShrink: 0,
                color: isAlert ? 'var(--warning)' : 'var(--success)'
              }} />
              <span style={{ flex: 1, fontSize: 13, color: 'var(--foreground)' }}>{a.text}</span>
              <span style={{ fontSize: 11, color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{a.time}</span>
            </div>);

        })}
      </div>
    </div>);

}