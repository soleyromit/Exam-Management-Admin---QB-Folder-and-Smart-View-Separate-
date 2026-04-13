import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PhaseShell } from '../components/PhaseShell';
import { QuestionEditor } from '../components/QuestionEditor';
import { PublishGateModal } from '../components/PublishGateModal';
import { FormulaQuestionEditor } from '../components/FormulaQuestionEditor';
import { ExamDashboard } from '../components/ExamDashboard';
import { QuestionBankFull } from '../components/QuestionBankFull';
import { CloneExamModal } from '../components/CloneExamModal';
import { GradingInterface } from '../components/GradingInterface';
import { ExamListView } from '../components/ExamListView';
import { LiveExamView } from '../components/LiveExamView';
import type { Role } from '../types';
import type { ThemeKey } from '../themes';

type Page =
'home' |
'exam-list' |
'exams' |
'question-bank' |
'grading' |
'live-exam';

function PageWrapper({ children }: {children: React.ReactNode;}) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: 'var(--sidebar)' }}>
      <div
        style={{
          background: 'var(--card)',
          borderRadius: 12,
          padding: 24,
          minHeight: '100%',
          boxShadow: '0 0 0 1px var(--border)'
        }}>
        
        {children}
      </div>
    </div>);

}

export function ExamAdminApp({
  forcedRole,
  themeKey,
  onThemeChange




}: {forcedRole?: Role;themeKey?: ThemeKey;onThemeChange?: (k: ThemeKey) => void;}) {
  const [role, setRole] = useState<Role>(forcedRole || 'dept-head');
  const [questionEditorOpen, setQuestionEditorOpen] = useState(false);
  const [formulaEditorOpen, setFormulaEditorOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [cloneModalOpen, setCloneModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activePage, setActivePage] = useState<Page>('question-bank');
  const [examName, setExamName] = useState('CV Pharmacology -- Midterm 2026');
  const [qbLeftOpen, setQbLeftOpen] = useState(true);

  const openExam = (name?: string) => {
    setExamName(name || 'CV Pharmacology -- Midterm 2026');
    setActivePage('exams');
  };

  const handleNavigate = (p: string) => {
    setActivePage(p as Page);
    if (p === 'question-bank') {
      setSidebarCollapsed(true);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--sidebar)' }}>
      <Sidebar
        role={role}
        onRoleChange={(r) => setRole(r)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        activePage={activePage}
        onNavigate={handleNavigate}
        themeKey={themeKey}
        onThemeChange={onThemeChange}
        qbLeftOpen={qbLeftOpen}
        onToggleQBLeft={() => setQbLeftOpen((v) => !v)} />
      

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', background: 'var(--sidebar)' }}>
        {activePage === 'question-bank' &&
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', margin: '8px 8px 8px 8px', borderRadius: 12, background: 'white', boxShadow: '0 0 0 1px var(--border)' }}>
            {/* Pass role + setter so QB can drive role switch from its own header toggle */}
            <QuestionBankFull
            onEditQuestion={() => setQuestionEditorOpen(true)}
            onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
            leftOpen={qbLeftOpen}
            onToggleLeft={() => setQbLeftOpen((v) => !v)}
            role={role}
            onRoleChange={setRole} />
          
          </div>
        }
        {activePage === 'home' &&
        <PageWrapper>
            <ExamDashboard onOpenExam={openExam} onNavigate={setActivePage as any} />
          </PageWrapper>
        }
        {activePage === 'exam-list' &&
        <PageWrapper>
            <ExamListView onOpenExam={openExam} onNewExam={() => setActivePage('exams')} />
          </PageWrapper>
        }
        {activePage === 'exams' &&
        <PageWrapper>
            <PhaseShell
            role={role}
            onOpenQuestionEditor={() => setQuestionEditorOpen(true)}
            onOpenPublishGate={() => setPublishModalOpen(true)}
            onOpenFormulaEditor={() => setFormulaEditorOpen(true)} />
          
          </PageWrapper>
        }
        {activePage === 'grading' && <PageWrapper><GradingInterface /></PageWrapper>}
        {activePage === 'live-exam' && <PageWrapper><LiveExamView /></PageWrapper>}
      </div>

      <QuestionEditor isOpen={questionEditorOpen} onClose={() => setQuestionEditorOpen(false)} />

      {formulaEditorOpen &&
      <div style={{ position: 'fixed', inset: 0, zIndex: 9995, background: 'rgba(0,0,0,0.5)' }}>
          <div style={{ position: 'absolute', insetBlock: 0, right: 0, width: '90vw', maxWidth: 1000 }}>
            <FormulaQuestionEditor onClose={() => setFormulaEditorOpen(false)} />
          </div>
        </div>
      }

      <PublishGateModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onPublish={() => setPublishModalOpen(false)} />
      
      {cloneModalOpen &&
      <CloneExamModal
        onClose={() => setCloneModalOpen(false)}
        onClone={() => {setCloneModalOpen(false);setActivePage('exams');}} />

      }
    </div>);

}