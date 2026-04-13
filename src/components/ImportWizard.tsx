import React, { useState } from 'react';
import { X, Upload, FileText, Table2, BookOpen, Sparkles, BarChart2, ChevronRight, Folder, Check, AlertCircle, ArrowRight, Zap, Lock, RefreshCw, Plus, ChevronDown, FolderOpen, Info, Tag, User } from 'lucide-react';

type ImportMethod = 'examsoft' | 'excel' | 'word' | 'banks' | 'ai-paste';
type WizardStep = 1 | 2 | 3 | 4;

interface FolderNode {id: string;name: string;parentId: string | null;count: number;}
interface SVItem {id: string;name: string;autoUpdate: boolean;criteria: {category?: string;tags?: string[];difficulties?: string[];};}

export interface ImportQ {
  id: string;code: string;title: string;type: string;difficulty: 'Easy' | 'Medium' | 'Hard';category: string;tags: string[];
  matchedFolderIds: string[];
}

interface ImportWizardModalProps {
  isOpen: boolean;onClose: () => void;
  folders: FolderNode[];
  folderRules: Record<string, SVItem[]>;
  onImport: (questions: ImportQ[], assignments: Record<string, string[]>) => void;
}

const MOCK_QUESTIONS: ImportQ[] = [
{ id: 'imp-1', code: 'PHARM-101', title: 'Which antibiotic class inhibits cell wall synthesis by binding PBPs?', type: 'MCQ', difficulty: 'Medium', category: 'Pharmacology', tags: ['antibiotics', 'mechanism'], matchedFolderIds: [] },
{ id: 'imp-2', code: 'PHARM-102', title: 'A patient on warfarin starts fluconazole. Describe the interaction mechanism.', type: 'MCQ', difficulty: 'Hard', category: 'Pharmacology', tags: ['drug-interaction', 'warfarin'], matchedFolderIds: [] },
{ id: 'imp-3', code: 'CARD-051', title: 'Identify the myocardial territory affected on this 12-lead ECG.', type: 'Hotspot', difficulty: 'Hard', category: 'Cardiology', tags: ['ECG', 'MI'], matchedFolderIds: [] },
{ id: 'imp-4', code: 'CARD-052', title: 'Calculate ejection fraction: EDV=120mL, ESV=50mL.', type: 'Fill blank', difficulty: 'Medium', category: 'Cardiology', tags: ['calculation'], matchedFolderIds: [] },
{ id: 'imp-5', code: 'NEUR-021', title: 'Which cranial nerve carries the afferent limb of the corneal reflex?', type: 'MCQ', difficulty: 'Easy', category: 'Neurology', tags: ['cranial nerves'], matchedFolderIds: [] },
{ id: 'imp-6', code: 'NEUR-022', title: '45yo with thunderclap headache, blood in CT cisterns. Next step?', type: 'MCQ', difficulty: 'Hard', category: 'Neurology', tags: ['emergency', 'SAH'], matchedFolderIds: [] },
{ id: 'imp-7', code: 'RENAL-031', title: 'Interpret: pH 7.28, pCO2 38, HCO3 18 in a diabetic patient.', type: 'MCQ', difficulty: 'Hard', category: 'Renal', tags: ['ABG', 'acid-base'], matchedFolderIds: [] },
{ id: 'imp-8', code: 'RENAL-032', title: 'Which diuretic inhibits the NaK2Cl cotransporter in the loop of Henle?', type: 'MCQ', difficulty: 'Easy', category: 'Renal', tags: ['diuretics', 'mechanism'], matchedFolderIds: [] },
{ id: 'imp-9', code: 'ANAT-031', title: 'Identify the labeled cardiac structure on this MRI cross-section.', type: 'Hotspot', difficulty: 'Medium', category: 'Anatomy', tags: ['imaging', 'anatomy'], matchedFolderIds: [] }];


type IconComponent = React.FC<{size?: number;strokeWidth?: number;style?: React.CSSProperties;}>;

const METHODS: Array<{id: ImportMethod;label: string;desc: string;icon: IconComponent;badge: string | null;color: string;disabled?: boolean;}> = [
{ id: 'examsoft', label: 'ExamSoft', desc: 'Import from ExamSoft item analysis + assessment results CSV exports', icon: BarChart2, badge: 'Requires 2 files', color: '#3b82f6' },
{ id: 'excel', label: 'Excel / CSV', desc: 'Bulk import from a spreadsheet with custom column mapping', icon: Table2, badge: null, color: '#16a34a' },
{ id: 'word', label: 'Word / PDF', desc: 'Extract questions from Word or PDF documents using AI normalization', icon: FileText, badge: 'AI-powered', color: '#7c3aed' },
{ id: 'banks', label: 'Published Banks', desc: 'Import from licensed banks: Ascend Learning, Wolters Kluwer, and others', icon: BookOpen, badge: 'Coming soon', color: '#94a3b8', disabled: true },
{ id: 'ai-paste', label: 'AI Paste', desc: 'Paste raw question text — AI structures and normalizes each item', icon: Sparkles, badge: 'AI-powered', color: '#d97706' }];


const DIFF_COLOR: Record<string, {bg: string;text: string;}> = {
  Easy: { bg: '#dcfce7', text: '#16a34a' },
  Medium: { bg: '#fef3c7', text: '#a16207' },
  Hard: { bg: '#fee2e2', text: '#b91c1c' }
};

function matchQuestionsToFolders(questions: ImportQ[], folders: FolderNode[], folderRules: Record<string, SVItem[]>): ImportQ[] {
  return questions.map((q) => {
    const matched: string[] = [];
    folders.forEach((f) => {
      const rules = (folderRules[f.id] || []).filter((r) => r.autoUpdate);
      const passesRule = rules.some((r) => {
        const catMatch = !r.criteria.category || r.criteria.category.toLowerCase() === q.category.toLowerCase();
        const tagMatch = !r.criteria.tags?.length || r.criteria.tags.some((t) => q.tags.includes(t));
        const diffMatch = !r.criteria.difficulties?.length || r.criteria.difficulties.includes(q.difficulty);
        return catMatch && tagMatch && diffMatch;
      });
      const nameMatch = f.name.toLowerCase() === q.category.toLowerCase() ||
      q.category.toLowerCase().includes(f.name.toLowerCase());
      if (passesRule || nameMatch) matched.push(f.id);
    });
    return { ...q, matchedFolderIds: matched };
  });
}

export function ImportWizardModal({ isOpen, onClose, folders, folderRules, onImport }: ImportWizardModalProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [method, setMethod] = useState<ImportMethod | null>(null);
  const [uploaded, setUploaded] = useState<Record<string, 'idle' | 'uploading' | 'done'>>({});
  const [processing, setProcessing] = useState(false);
  const [parsedQs, setParsedQs] = useState<ImportQ[]>([]);
  const [manualOverrides, setManualOverrides] = useState<Record<string, string[]>>({});
  const [autoAssign, setAutoAssign] = useState(true);
  const [pasteText, setPasteText] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set<string>(['f-pharm', 'f-courses']));

  const bg = 'var(--background)',fg = 'var(--foreground)',mfg = 'var(--muted-foreground)',bdr = 'var(--border)',br = 'var(--brand)';
  const brfg = 'var(--brand-foreground)';

  const reset = () => {setStep(1);setMethod(null);setUploaded({});setParsedQs([]);setManualOverrides({});setProcessing(false);setPasteText('');};
  const handleClose = () => {reset();onClose();};
  const simulateUpload = (key: string) => {
    setUploaded((u) => ({ ...u, [key]: 'uploading' }));
    setTimeout(() => setUploaded((u) => ({ ...u, [key]: 'done' })), 1200 + Math.random() * 800);
  };
  const processAndAdvance = () => {
    setProcessing(true);
    setTimeout(() => {
      const matched = matchQuestionsToFolders(MOCK_QUESTIONS, folders, folderRules);
      setParsedQs(matched);setProcessing(false);setStep(3);
    }, 1800);
  };
  const step2Ready = (): boolean => {
    if (!method) return false;
    if (method === 'examsoft') return uploaded['item-analysis'] === 'done' && uploaded['assessment-results'] === 'done';
    if (method === 'excel') return uploaded['spreadsheet'] === 'done';
    if (method === 'word') return uploaded['document'] === 'done';
    if (method === 'ai-paste') return pasteText.trim().length > 20;
    return false;
  };
  const getEffectiveFolderIds = (q: ImportQ): string[] => {if (manualOverrides[q.id]) return manualOverrides[q.id];return autoAssign ? q.matchedFolderIds : [];};
  const toggleManualFolder = (qId: string, fId: string, current: string[]) => {
    const next = current.includes(fId) ? current.filter((x) => x !== fId) : [...current, fId];
    setManualOverrides((m) => ({ ...m, [qId]: next }));
  };
  const getFolderName = (fId: string) => folders.find((f) => f.id === fId)?.name || fId;
  const computeAssignments = (): Record<string, string[]> => {
    const result: Record<string, string[]> = {};
    parsedQs.forEach((q) => {
      getEffectiveFolderIds(q).forEach((fId) => {
        if (!result[fId]) result[fId] = [];
        result[fId].push(q.id);
      });
    });
    return result;
  };
  const unassignedQs = parsedQs.filter((q) => getEffectiveFolderIds(q).length === 0);
  const assignedQs = parsedQs.filter((q) => getEffectiveFolderIds(q).length > 0);
  const handleImport = () => {onImport(parsedQs, computeAssignments());handleClose();};

  if (!isOpen) return null;

  const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 };
  const card: React.CSSProperties = { background: bg, borderRadius: 14, width: '100%', maxWidth: 820, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden' };

  const stepLabel = (n: number, label: string) => {
    const done = step > n,active = step === n;
    return (
      <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, background: done ? br : active ? br : 'var(--sidebar-accent)', color: done || active ? brfg : mfg, border: active ? `2px solid ${br}` : '2px solid transparent', transition: 'all 0.2s' }}>
          {done ? <Check size={12} /> : n}
        </div>
        <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? fg : mfg, whiteSpace: 'nowrap' }}>{label}</span>
        {n < 4 && <ChevronRight size={12} style={{ color: 'var(--border)', flexShrink: 0 }} />}
      </div>);

  };

  const renderStep1 = () =>
  <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
      <p style={{ margin: '0 0 20px', fontSize: 13, color: mfg }}>Choose how you want to import questions into the Library.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {METHODS.map((m) => {
        const sel = method === m.id;
        const dis = !!m.disabled;
        const IconComp = m.icon;
        return (
          <button key={m.id} disabled={dis} onClick={() => !dis && setMethod(m.id)}
          style={{ padding: '16px 18px', border: `2px solid ${sel ? br : bdr}`, borderRadius: 10, background: sel ? `color-mix(in oklch,${m.color} 8%,${bg})` : bg, textAlign: 'left', cursor: dis ? 'not-allowed' : 'pointer', opacity: dis ? 0.5 : 1, transition: 'all 0.15s', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ color: m.color, flexShrink: 0, display: 'flex', paddingTop: 2 }}>
                  <IconComp size={22} strokeWidth={1.5} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: fg }}>{m.label}</span>
                    {m.badge && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: dis ? '#f1f5f9' : sel ? `color-mix(in oklch,${m.color} 18%,white)` : '#f1f5f9', color: dis ? mfg : sel ? m.color : mfg, fontWeight: 600 }}>{m.badge}</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: mfg, lineHeight: 1.45 }}>{m.desc}</p>
                </div>
              </div>
              {sel && <div style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: '50%', background: br, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={10} color={brfg} /></div>}
            </button>);

      })}
      </div>
    </div>;


  const FileDropZone = ({ fileKey, label, hint }: {fileKey: string;label: string;hint: string;accept?: string;}) => {
    const state = uploaded[fileKey] || 'idle';
    return (
      <div onClick={() => state === 'idle' && simulateUpload(fileKey)}
      style={{ border: `2px dashed ${state === 'done' ? '#16a34a' : bdr}`, borderRadius: 10, padding: '20px 16px', textAlign: 'center', cursor: state === 'idle' ? 'pointer' : 'default', background: state === 'done' ? '#f0fdf4' : 'var(--sidebar-accent)', transition: 'all 0.2s', marginBottom: 12 }}>
        {state === 'idle' && <><Upload size={22} style={{ color: mfg, marginBottom: 8 }} /><div style={{ fontSize: 13, fontWeight: 600, color: fg, marginBottom: 4 }}>{label}</div><div style={{ fontSize: 11, color: mfg }}>{hint}</div><div style={{ fontSize: 11, color: br, marginTop: 6, fontWeight: 500 }}>Click to browse or drag & drop</div></>}
        {state === 'uploading' && <><div style={{ width: 32, height: 32, border: `3px solid ${br}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} /><div style={{ fontSize: 13, color: mfg }}>Uploading…</div></>}
        {state === 'done' && <><Check size={22} style={{ color: '#16a34a', marginBottom: 6 }} /><div style={{ fontSize: 13, fontWeight: 600, color: '#16a34a' }}>File uploaded</div><div style={{ fontSize: 11, color: mfg }}>{label}</div></>}
      </div>);

  };

  const renderStep2 = () => {
    if (method === 'examsoft') return (
      <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 8, background: '#eff6ff', border: '1px solid #bfdbfe', marginBottom: 20 }}>
          <Info size={15} style={{ color: '#3b82f6', flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12, color: '#1e40af', lineHeight: 1.5 }}>ExamSoft requires <strong>two files</strong> per assessment: the <em>Item Analysis CSV</em> and the <em>Assessment Results CSV</em>. Category mappings are only available in graded (not practice) exams.</div>
        </div>
        <FileDropZone fileKey="item-analysis" label="Item Analysis CSV" hint="Export from ExamSoft → Reports → Item Analysis" />
        <FileDropZone fileKey="assessment-results" label="Assessment Results CSV" hint="Export from ExamSoft → Reports → Assessment Results" />
        <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 8, background: 'var(--sidebar-accent)', border: `1px solid ${bdr}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: fg, marginBottom: 8 }}>Column mapping preview</div>
          {[['Question Text', 'Stem / Title'], ['Category', 'Folder assignment criteria'], ['P-Bis', 'Discrimination index'], ['% Correct', 'Difficulty proxy']].map(([src, dst]) =>
          <div key={src} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 12 }}>
              <span style={{ padding: '2px 8px', borderRadius: 5, background: bg, border: `1px solid ${bdr}`, color: fg, minWidth: 140 }}>{src}</span>
              <ArrowRight size={12} style={{ color: mfg, flexShrink: 0 }} />
              <span style={{ padding: '2px 8px', borderRadius: 5, background: `color-mix(in oklch,${br} 10%,${bg})`, border: `1px solid color-mix(in oklch,${br} 30%,${bdr})`, color: br, flex: 1 }}>{dst}</span>
            </div>
          )}
        </div>
      </div>);

    if (method === 'excel') return (
      <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
        <FileDropZone fileKey="spreadsheet" label="Excel or CSV file" hint="Supports .xlsx, .xls, .csv formats" />
        {uploaded['spreadsheet'] === 'done' &&
        <div style={{ padding: '14px', borderRadius: 8, background: 'var(--sidebar-accent)', border: `1px solid ${bdr}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: fg, marginBottom: 10 }}>Map your columns</div>
            {[['Column A', 'Question Text (stem)'], ['Column B', 'Answer Choices'], ['Column C', 'Correct Answer'], ['Column D', 'Category / Topic'], ['Column E', 'Difficulty'], ['Column F', "Bloom's Level"]].map(([col, field]) =>
          <div key={col} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 12 }}>
                <span style={{ padding: '2px 8px', borderRadius: 5, background: bg, border: `1px solid ${bdr}`, color: fg, width: 80, flexShrink: 0 }}>{col}</span>
                <ArrowRight size={12} style={{ color: mfg, flexShrink: 0 }} />
                <select style={{ flex: 1, padding: '3px 8px', borderRadius: 5, border: `1px solid ${bdr}`, background: bg, color: fg, fontSize: 12, outline: 'none' }}><option>{field}</option><option>— Skip —</option></select>
              </div>
          )}
          </div>
        }
      </div>);

    if (method === 'word') return (
      <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 8, background: '#faf5ff', border: '1px solid #e9d5ff', marginBottom: 20 }}>
          <Sparkles size={15} style={{ color: '#7c3aed', flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12, color: '#4c1d95', lineHeight: 1.5 }}>AI reads your document and extracts questions, answer choices, and metadata automatically.</div>
        </div>
        <FileDropZone fileKey="document" label="Word or PDF document" hint="Supports .docx, .doc, .pdf formats — any layout" />
      </div>);

    if (method === 'ai-paste') return (
      <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 8, background: '#fffbeb', border: '1px solid #fde68a', marginBottom: 16 }}>
          <Sparkles size={15} style={{ color: '#d97706', flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12, color: '#78350f', lineHeight: 1.5 }}>Paste questions in any format. AI will detect question boundaries, answer choices, and metadata.</div>
        </div>
        <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} placeholder={`Paste your questions here...`}
        style={{ width: '100%', minHeight: 280, padding: '12px', border: `1px solid ${bdr}`, borderRadius: 8, fontSize: 12.5, color: fg, background: bg, resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box' }} />
        <div style={{ fontSize: 11, color: mfg, marginTop: 6 }}>{pasteText.trim().length} characters</div>
      </div>);

    return null;
  };

  const renderStep3 = () => {
    const rootFolders = folders.filter((f) => !f.parentId);
    const childFolders = (parentId: string) => folders.filter((f) => f.parentId === parentId);
    const FolderItem = ({ f, depth = 0 }: {f: FolderNode;depth?: number;}) => {
      const rules = folderRules[f.id] || [];
      const dynamicRules = rules.filter((r) => r.autoUpdate);
      const children = childFolders(f.id);
      const isExp = expandedFolders.has(f.id);
      const assignedCount = parsedQs.filter((q) => getEffectiveFolderIds(q).includes(f.id)).length;
      return (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: `5px 6px 5px ${8 + depth * 14}px`, borderRadius: 6, fontSize: 12, color: fg, cursor: children.length ? 'pointer' : 'default' }}
          onClick={() => children.length && setExpandedFolders((s) => {const n = new Set(s);n.has(f.id) ? n.delete(f.id) : n.add(f.id);return n;})}>
            {children.length ? isExp ? <ChevronDown size={11} style={{ color: mfg, flexShrink: 0 }} /> : <ChevronRight size={11} style={{ color: mfg, flexShrink: 0 }} /> : <span style={{ width: 11, flexShrink: 0 }} />}
            {isExp && children.length ? <FolderOpen size={13} style={{ color: '#f59e0b', flexShrink: 0 }} /> : <Folder size={13} style={{ color: '#f59e0b', flexShrink: 0 }} />}
            <span style={{ flex: 1 }}>{f.name}</span>
            {dynamicRules.length > 0 && <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 5, background: `color-mix(in oklch,${br} 12%,white)`, color: br, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}><Zap size={8} />Rules</span>}
            {assignedCount > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: br, marginLeft: 2 }}>{assignedCount}</span>}
          </div>
          {isExp && children.map((child) => <FolderItem key={child.id} f={child} depth={depth + 1} />)}
        </div>);

    };
    return (
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${bdr}`, padding: '16px 0', overflowY: 'auto' }}>
          <div style={{ padding: '0 12px 8px', fontSize: 11, fontWeight: 700, color: mfg, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 5 }}><Folder size={10} />Destination Folders</div>
          <div style={{ padding: '0 6px' }}>{rootFolders.map((f) => <FolderItem key={f.id} f={f} />)}</div>
          <div style={{ padding: '12px 12px 4px', marginTop: 4, borderTop: `1px solid ${bdr}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <div style={{ width: 26, height: 14, borderRadius: 7, background: autoAssign ? br : '#e2e8f0', cursor: 'pointer', flexShrink: 0, position: 'relative', transition: 'background 0.2s' }} onClick={() => setAutoAssign((a) => !a)}>
                <div style={{ position: 'absolute', top: 2, width: 10, height: 10, borderRadius: '50%', background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.2)', left: autoAssign ? 13 : 2, transition: 'left 0.2s' }} />
              </div>
              <span style={{ color: fg, lineHeight: 1.3, fontSize: 11 }}>Auto-assign via criteria rules</span>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: fg }}>{parsedQs.length} questions parsed</div>
            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', alignItems: 'center' }}>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 8, background: '#dcfce7', color: '#16a34a', fontWeight: 600 }}>{assignedQs.length} assigned</span>
              {unassignedQs.length > 0 && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 8, background: '#fef3c7', color: '#a16207', fontWeight: 600 }}>{unassignedQs.length} unassigned</span>}
            </div>
          </div>
          {parsedQs.map((q) => {
            const eff = getEffectiveFolderIds(q);
            const isAuto = !manualOverrides[q.id] && autoAssign;
            return (
              <div key={q.id} style={{ padding: '10px 12px', border: `1px solid ${bdr}`, borderRadius: 8, marginBottom: 8, background: bg }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: mfg, fontFamily: 'monospace' }}>{q.code}</span>
                      <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 4, background: DIFF_COLOR[q.difficulty].bg, color: DIFF_COLOR[q.difficulty].text, fontWeight: 600 }}>{q.difficulty}</span>
                      <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 4, background: 'var(--sidebar-accent)', color: mfg }}>{q.type}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: fg, marginBottom: 6, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.title}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {eff.length === 0 ?
                      <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 5, background: '#fef9c3', color: '#a16207', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}><AlertCircle size={8} />Unassigned</span> :
                      eff.map((fId) =>
                      <span key={fId} style={{ fontSize: 10, padding: '1px 7px', borderRadius: 5, background: `color-mix(in oklch,${br} 12%,white)`, color: br, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer' }} onClick={() => toggleManualFolder(q.id, fId, eff)}>
                          <Folder size={8} />{getFolderName(fId)}{isAuto && <Zap size={7} style={{ opacity: 0.7 }} />}<X size={7} />
                        </span>
                      )}
                      <button onClick={() => setManualOverrides((m) => ({ ...m, [q.id]: eff }))} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 5, border: `1px dashed ${bdr}`, background: 'transparent', color: mfg, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}><Plus size={8} />Add folder</button>
                    </div>
                  </div>
                </div>
              </div>);

          })}
        </div>
      </div>);

  };

  const renderStep4 = () => {
    const assignments = computeAssignments();
    const totalAssigned = assignedQs.length;
    return (
      <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '16px 18px', borderRadius: 10, background: 'var(--sidebar-accent)', border: `1px solid ${bdr}`, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: fg, marginBottom: 12 }}>Import summary</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            {[['Total questions', parsedQs.length, '#3b82f6'], ['Assigned to folders', totalAssigned, '#16a34a'], ['Unassigned', unassignedQs.length, '#d97706']].map(([label, count, color]) =>
            <div key={String(label)} style={{ padding: '12px 14px', borderRadius: 8, background: bg, border: `1px solid ${bdr}`, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: String(color) }}>{count}</div>
                <div style={{ fontSize: 11, color: mfg, marginTop: 2 }}>{label}</div>
              </div>
            )}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: fg, marginBottom: 8 }}>Folder breakdown</div>
          {Object.entries(assignments).map(([fId, qIds]) =>
          <div key={fId} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: `1px solid ${bdr}`, fontSize: 12, color: fg }}>
              <Folder size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{getFolderName(fId)}</span>
              <span style={{ fontWeight: 600, color: br }}>{qIds.length}</span>
            </div>
          )}
          {unassignedQs.length > 0 &&
          <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: '#fffbeb', border: '1px solid #fde68a', fontSize: 12, color: '#78350f', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>{unassignedQs.length} question{unassignedQs.length !== 1 ? 's' : ''} will be imported but not assigned to any folder.</div>
            </div>
          }
        </div>
        <div style={{ fontSize: 11, color: mfg, textAlign: 'center' }}>This will add {parsedQs.length} questions to the Library.</div>
      </div>);

  };

  const stepTitles: Record<WizardStep, string> = { 1: 'Choose import method', 2: 'Configure source', 3: 'Map to folders', 4: 'Review & import' };

  return (
    <div style={overlay} onClick={(e) => {if (e.target === e.currentTarget) handleClose();}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={card}>
        <div style={{ padding: '20px 24px 14px', borderBottom: `1px solid ${bdr}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: fg }}>Import Questions</div>
              <div style={{ fontSize: 12, color: mfg, marginTop: 1 }}>Step {step} of 4 · {stepTitles[step]}</div>
            </div>
            <button onClick={handleClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: mfg, padding: 4, display: 'flex', borderRadius: 6 }}><X size={18} /></button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
            {([1, 2, 3, 4] as WizardStep[]).map((n, i) => stepLabel(n, ['Method', 'Configure', 'Map folders', 'Review'][i]))}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {processing ?
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 }}>
              <div style={{ width: 44, height: 44, border: `4px solid ${br}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: fg }}>Processing your import…</div>
              <div style={{ fontSize: 12, color: mfg, textAlign: 'center', maxWidth: 300 }}>AI is reading and structuring your questions, detecting types, and matching criteria rules.</div>
            </div> :

          <>{step === 1 && renderStep1()}{step === 2 && renderStep2()}{step === 3 && renderStep3()}{step === 4 && renderStep4()}</>
          }
        </div>
        {!processing &&
        <div style={{ padding: '14px 24px', borderTop: `1px solid ${bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: bg }}>
            <button onClick={() => step === 1 ? handleClose() : setStep((s) => s - 1 as WizardStep)} style={{ padding: '7px 16px', border: `1px solid ${bdr}`, borderRadius: 7, background: bg, color: fg, fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>{step === 1 ? 'Cancel' : 'Back'}</button>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {step === 3 && unassignedQs.length > 0 &&
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#a16207', padding: '5px 10px', borderRadius: 6, background: '#fffbeb' }}><AlertCircle size={12} />{unassignedQs.length} unassigned</div>
            }
              <button
              disabled={step === 1 ? !method : step === 2 ? !step2Ready() : false}
              onClick={() => {
                if (step === 1 && method) setStep(2);else
                if (step === 2) processAndAdvance();else
                if (step === 3) setStep(4);else
                if (step === 4) handleImport();
              }}
              style={{ padding: '7px 20px', border: 'none', borderRadius: 7, background: br, color: brfg, fontSize: 13, cursor: step === 1 && !method || step === 2 && !step2Ready() ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: step === 1 && !method || step === 2 && !step2Ready() ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                {step === 4 ? 'Import questions' : step === 2 ? <><Sparkles size={13} />Process & preview</> : 'Continue'}<ChevronRight size={14} />
              </button>
            </div>
          </div>
        }
      </div>
    </div>);

}