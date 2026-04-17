import { DEFAULT_CRITERIA } from './QBModals';
import type { SmartCriteria } from './QBModals';

// ── Types ─────────────────────────────────────────────────────────────────────────────

export type QStatus = 'Draft' | 'Saved';
export type QType = 'MCQ' | 'Fill blank' | 'Hotspot' | 'Ordering' | 'Matching';
export type QDiff = 'Easy' | 'Medium' | 'Hard';
export type QBlooms =
'Remember' |
'Understand' |
'Apply' |
'Analyze' |
'Evaluate' |
'Create';

export type AccessLevel = 'view' | 'edit';
export type TrustLevel = 'junior' | 'mid' | 'senior';

export interface Question {
  id: string;
  code: string;
  version: number;
  age: string;
  title: string;
  type: QType;
  status: QStatus;
  difficulty: QDiff;
  blooms: QBlooms;
  folder: string;
  tags: string[];
  usage: number;
  pbis: number | null;
  pbisDir: 'up' | 'down' | 'flat' | null;
  collaborator?: string;
  creator?: string;
  lastEditedBy?: string;
  usedInSections?: string[];
}

export interface FolderNode {
  id: string;
  name: string;
  parentId: string | null;
  count: number;
  locked?: boolean;
  isCourse?: boolean;
  isLifetimeRepo?: boolean;
  isCourseOffering?: boolean;
  courseYear?: string;
  section?: string;
  isPrivateSpace?: boolean;
  isQuestionSet?: boolean;
  ownerPersonaId?: string;
  collaborators?: string[];
  workspaceMembers?: {name: string;role: 'admin' | 'faculty' | 'external';}[];
}

export interface SVItem {
  id: string;
  name: string;
  count: number;
  isDefault?: boolean;
  autoUpdate: boolean;
  criteria: SmartCriteria;
  personal?: boolean;
  isAdminView?: boolean;
  author?: string;
}

export interface FacultyAccessRecord {
  folderIds: string[];
  accessLevels: Record<string, AccessLevel>;
}

// ─────────────────────────────────────────────────────────────────────────────────
// QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────────

export const QS: Question[] = [

// ── Phar 101 · Fall 2026 workspace ───────────────────────────────────────────────

{
  id: 'q1', code: 'PHR26-001', version: 2, age: '1d ago',
  title: 'Which beta-1 selective adrenergic blocker is preferred in patients with concurrent reactive airway disease?',
  type: 'MCQ', status: 'Saved', difficulty: 'Easy', blooms: 'Remember',
  folder: 'Phar 101 (2026 batch)', tags: ['phar101'], usage: 5, pbis: 0.48, pbisDir: 'up',
  creator: 'Dr. Patel', collaborator: 'Dr. Patel', lastEditedBy: 'Dr. Patel',
  usedInSections: ['Section A', 'Section B']
},
{
  id: 'q2', code: 'PHR26-002', version: 1, age: '3d ago',
  title: 'A patient on warfarin presents with an INR of 8.2 and no active bleeding. The most appropriate next step is ___.',
  type: 'Fill blank', status: 'Saved', difficulty: 'Hard', blooms: 'Evaluate',
  folder: 'Phar 101 (2026 batch)', tags: ['phar101'], usage: 0, pbis: null, pbisDir: null,
  creator: 'Dr. Patel', collaborator: 'Dr. Lee', lastEditedBy: 'Dr. Lee',
  usedInSections: ['Section A']
},
{
  id: 'q3', code: 'PHR26-003', version: 1, age: '2d ago',
  title: 'Outline the mechanism by which ACE inhibitors reduce cardiac afterload in systolic heart failure.',
  type: 'MCQ', status: 'Draft', difficulty: 'Medium', blooms: 'Understand',
  folder: 'Phar 101 (2026 batch)', tags: ['phar101'], usage: 0, pbis: null, pbisDir: null,
  creator: 'Dr. Patel', collaborator: 'Dr. Patel', lastEditedBy: 'Dr. Patel'
},
{
  id: 'q4', code: 'PHR26-004', version: 1, age: '5d ago',
  title: 'A 65-year-old with hypertension and stage 3 CKD. Which antihypertensive class provides renal protection?',
  type: 'MCQ', status: 'Saved', difficulty: 'Medium', blooms: 'Apply',
  folder: 'Phar 101 (2026 batch)', tags: ['phar101'], usage: 3, pbis: 0.41, pbisDir: 'up',
  creator: 'Dr. Lee', collaborator: 'Dr. Lee', lastEditedBy: 'Dr. Lee',
  usedInSections: ['Section B']
},
{
  id: 'q5', code: 'PHR26-005', version: 2, age: '4d ago',
  title: 'Identify the atrioventricular node on the cardiac conduction system diagram.',
  type: 'Hotspot', status: 'Saved', difficulty: 'Easy', blooms: 'Remember',
  folder: 'Phar 101 (2026 batch)', tags: ['phar101'], usage: 4, pbis: 0.36, pbisDir: 'flat',
  creator: 'Dr. Ramirez', collaborator: 'Dr. Ramirez', lastEditedBy: 'Dr. Ramirez',
  usedInSections: ['Section A']
},
{
  id: 'q6', code: 'PHR26-006', version: 3, age: '1w ago',
  title: 'Rank the following antihypertensive classes in order of first-line preference for isolated systolic hypertension in a 70-year-old.',
  type: 'Ordering', status: 'Saved', difficulty: 'Hard', blooms: 'Evaluate',
  folder: 'Phar 101 (2026 batch)', tags: ['phar101'], usage: 2, pbis: 0.44, pbisDir: 'up',
  creator: 'Dr. Patel', collaborator: 'Dr. Chen', lastEditedBy: 'Dr. Chen',
  usedInSections: ['Section A', 'Section B']
},
{
  id: 'q7', code: 'PHR26-007', version: 1, age: '6d ago',
  title: 'Amiodarone-induced thyrotoxicosis: which of the following mechanisms best explains Type II toxicosis?',
  type: 'MCQ', status: 'Saved', difficulty: 'Hard', blooms: 'Analyze',
  folder: 'Phar 101 (2026 batch)', tags: ['phar101'], usage: 1, pbis: 0.29, pbisDir: 'down',
  creator: 'Dr. Lee', collaborator: 'Dr. Lee', lastEditedBy: 'Dr. Lee',
  usedInSections: ['Section B']
},
{
  id: 'qX1', code: 'PHR26-X01', version: 1, age: '1w ago',
  title: 'Compare bisphosphonates vs. denosumab for pharmacological management of postmenopausal osteoporosis.',
  type: 'MCQ', status: 'Saved', difficulty: 'Hard', blooms: 'Evaluate',
  folder: 'Phar 101 (2026 batch)', tags: ['phar101', 'skel101'], usage: 2, pbis: 0.38, pbisDir: 'flat',
  creator: 'Dr. Patel', collaborator: 'Dr. Ramirez', lastEditedBy: 'Dr. Ramirez'
},

// ── Biol 201 · Fall 2026 workspace ───────────────────────────────────────────────

{
  id: 'q10', code: 'BIO26-001', version: 1, age: '6h ago',
  title: 'At which point on the O₂-Hb dissociation curve does a rightward shift most significantly affect peripheral tissue oxygen delivery?',
  type: 'MCQ', status: 'Saved', difficulty: 'Hard', blooms: 'Analyze',
  folder: 'Biol 201 (2026 batch)', tags: ['biol201'], usage: 1, pbis: 0.47, pbisDir: 'up',
  creator: 'Dr. Patel', collaborator: 'Dr. Patel', lastEditedBy: 'Dr. Patel',
  usedInSections: ['Section A']
},
{
  id: 'q11', code: 'BIO26-002', version: 2, age: '2d ago',
  title: 'Describe the Frank-Starling mechanism and explain how an increase in preload affects stroke volume.',
  type: 'Fill blank', status: 'Saved', difficulty: 'Medium', blooms: 'Understand',
  folder: 'Biol 201 (2026 batch)', tags: ['biol201'], usage: 3, pbis: 0.42, pbisDir: 'up',
  creator: 'Dr. Chen', collaborator: 'Dr. Chen', lastEditedBy: 'Dr. Chen',
  usedInSections: ['Section A', 'Section B']
},
{
  id: 'q12', code: 'BIO26-003', version: 1, age: '4d ago',
  title: 'A patient presents with sudden unilateral facial droop, arm weakness, and expressive aphasia. Which cerebral vessel is most likely occluded?',
  type: 'MCQ', status: 'Saved', difficulty: 'Hard', blooms: 'Analyze',
  folder: 'Biol 201 (2026 batch)', tags: ['biol201'], usage: 0, pbis: null, pbisDir: null,
  creator: 'Dr. Kim', collaborator: 'Dr. Kim', lastEditedBy: 'Dr. Kim',
  usedInSections: ['Section A']
},
{
  id: 'q13', code: 'BIO26-004', version: 1, age: '3d ago',
  title: 'Compare Type I vs Type II alveolar cells: structure, function, and role in ARDS pathophysiology.',
  type: 'MCQ', status: 'Draft', difficulty: 'Hard', blooms: 'Analyze',
  folder: 'Biol 201 (2026 batch)', tags: ['biol201'], usage: 0, pbis: null, pbisDir: null,
  creator: 'Dr. Chen', collaborator: 'Dr. Patel', lastEditedBy: 'Dr. Patel'
},
{
  id: 'q14', code: 'BIO26-005', version: 1, age: '5d ago',
  title: 'Which MRI finding best differentiates MS plaques from small vessel ischemic disease in periventricular white matter?',
  type: 'MCQ', status: 'Saved', difficulty: 'Hard', blooms: 'Analyze',
  folder: 'Biol 201 (2026 batch)', tags: ['biol201'], usage: 2, pbis: 0.39, pbisDir: 'up',
  creator: 'Dr. Kim', collaborator: 'Dr. Kim', lastEditedBy: 'Dr. Kim',
  usedInSections: ['Section A']
},
{
  id: 'q15', code: 'BIO26-006', version: 1, age: '3d ago',
  title: 'Rank the following tissues in order of susceptibility to ischemic injury after 5 minutes of cardiac arrest: neurons, myocytes, hepatocytes, renal tubular cells.',
  type: 'Ordering', status: 'Saved', difficulty: 'Medium', blooms: 'Apply',
  folder: 'Biol 201 (2026 batch)', tags: ['biol201'], usage: 1, pbis: 0.31, pbisDir: 'flat',
  creator: 'Dr. Patel', collaborator: 'Dr. Patel', lastEditedBy: 'Dr. Patel',
  usedInSections: ['Section A']
},

// ── Skel 101 · Fall 2026 workspace ───────────────────────────────────────────────

{
  id: 'q20', code: 'SKL26-001', version: 1, age: '2d ago',
  title: 'Which nerve structure is at highest risk of injury during the anterior approach to total hip replacement?',
  type: 'MCQ', status: 'Saved', difficulty: 'Medium', blooms: 'Remember',
  folder: 'Skel 101 (2026 batch)', tags: ['skel101'], usage: 2, pbis: 0.40, pbisDir: 'flat',
  creator: 'Dr. Ramirez', collaborator: 'Dr. Ramirez', lastEditedBy: 'Dr. Ramirez',
  usedInSections: ['Section A']
},
{
  id: 'q21', code: 'SKL26-002', version: 2, age: '5d ago',
  title: 'Match each fracture type (greenstick, comminuted, spiral, stress) with its most common mechanism of injury.',
  type: 'Matching', status: 'Saved', difficulty: 'Medium', blooms: 'Understand',
  folder: 'Skel 101 (2026 batch)', tags: ['skel101'], usage: 3, pbis: 0.45, pbisDir: 'up',
  creator: 'Dr. Ramirez', collaborator: 'Dr. Wells', lastEditedBy: 'Dr. Wells',
  usedInSections: ['Section A']
},
{
  id: 'q22', code: 'SKL26-003', version: 1, age: '4d ago',
  title: 'Identify the structure labeled "A" on the sagittal MRI of the knee joint at 30° flexion.',
  type: 'Hotspot', status: 'Saved', difficulty: 'Medium', blooms: 'Remember',
  folder: 'Skel 101 (2026 batch)', tags: ['skel101'], usage: 0, pbis: null, pbisDir: null,
  creator: 'Dr. Chen', collaborator: 'Dr. Chen', lastEditedBy: 'Dr. Chen',
  usedInSections: ['Section A']
},
{
  id: 'q23', code: 'SKL26-004', version: 1, age: '1d ago',
  title: 'Explain the blood supply to the femoral head and why displaced femoral neck fractures commonly lead to avascular necrosis.',
  type: 'MCQ', status: 'Draft', difficulty: 'Hard', blooms: 'Understand',
  folder: 'Skel 101 (2026 batch)', tags: ['skel101'], usage: 0, pbis: null, pbisDir: null,
  creator: 'Dr. Ramirez', collaborator: 'Dr. Ramirez', lastEditedBy: 'Dr. Ramirez'
},
{
  id: 'q24', code: 'SKL26-005', version: 1, age: '1w ago',
  title: 'Which rotator cuff muscle is the primary dynamic stabilizer of the glenohumeral joint during overhead abduction?',
  type: 'MCQ', status: 'Saved', difficulty: 'Easy', blooms: 'Remember',
  folder: 'Skel 101 (2026 batch)', tags: ['skel101'], usage: 4, pbis: 0.33, pbisDir: 'flat',
  creator: 'Dr. Kim', collaborator: 'Dr. Kim', lastEditedBy: 'Dr. Kim'
}];


// ── Folder → question assignments ──────────────────────────────────────────────────────────────────

export const INIT_ASSIGNMENTS: Record<string, string[]> = {
  'f-phar101': ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'qX1'],
  'f-phar-2026': ['q1', 'q2', 'q5', 'q6'],
  'f-phar-u1': ['q1', 'q2'],
  'f-phar-abs': ['q1'],
  'f-phar-oral': ['q1'],
  'f-phar-iv': ['q2'],
  'f-phar-dist': ['q5'],
  'f-phar-u2': ['q6'],
  'f-biol201': ['q10', 'q11', 'q12', 'q13', 'q14', 'q15'],
  'f-biol-2026': ['q10', 'q11', 'q12', 'q14', 'q15'],
  'f-biol-u1': ['q10', 'q11'],
  'f-biol-mem': ['q10', 'q11'],
  'f-biol-act': ['q10'],
  'f-biol-pas': ['q11'],
  'f-skel101': ['q20', 'q21', 'q22', 'q23', 'q24'],
  'f-skel-sec-a': ['q20', 'q21', 'q22'],
  'f-phar-qset1': ['q1', 'q6'],
  'f-phar-qset2': ['q2', 'q7', 'qX1'],
  'f-biol-qset1': ['q10', 'q12']
};

// ── Folder nodes ──────────────────────────────────────────────────────────────────────────────

export const INIT_FOLDERS: FolderNode[] = [
// ── Phar 101 ───────────────────────────────────────────────────────────────────────
{
  id: 'f-phar101', name: 'Phar 101', parentId: null, count: 8,
  isCourse: true, isLifetimeRepo: true
},
{
  id: 'f-phar-2026', name: 'Fall 2026', parentId: 'f-phar101', count: 4,
  isCourseOffering: true,
  workspaceMembers: [
  { name: 'Admin', role: 'admin' },
  { name: 'Dr. Patel', role: 'faculty' },
  { name: 'Dr. Lee', role: 'faculty' },
  { name: 'Dr. Chen', role: 'faculty' },
  { name: 'Dr. Ramirez', role: 'faculty' },
  { name: 'Dr. Wells', role: 'external' }]

},
{ id: 'f-phar-u1', name: 'Unit 1: Pharmacokinetics', parentId: 'f-phar-2026', count: 3 },
{ id: 'f-phar-abs', name: 'Absorption', parentId: 'f-phar-u1', count: 2 },
{ id: 'f-phar-oral', name: 'Oral Absorption', parentId: 'f-phar-abs', count: 1 },
{ id: 'f-phar-iv', name: 'IV Administration', parentId: 'f-phar-abs', count: 1 },
{ id: 'f-phar-dist', name: 'Distribution', parentId: 'f-phar-u1', count: 1 },
{ id: 'f-phar-u2', name: 'Unit 2: Pharmacodynamics', parentId: 'f-phar-2026', count: 1 },
{ id: 'f-phar-qset1', name: 'Cardio Exam Set', parentId: 'f-phar-2026', count: 2, isQuestionSet: true, collaborators: ['Dr. Patel', 'Dr. Chen'] },
{ id: 'f-phar-qset2', name: 'Midterm Prep Set', parentId: 'f-phar-2026', count: 3, isQuestionSet: true, collaborators: ['Dr. Lee', 'Dr. Ramirez'] },

// ── Biol 201 ───────────────────────────────────────────────────────────────────────
{
  id: 'f-biol201', name: 'Biol 201', parentId: null, count: 6,
  isCourse: true, isLifetimeRepo: true
},
{
  id: 'f-biol-2026', name: 'Fall 2026', parentId: 'f-biol201', count: 5,
  isCourseOffering: true,
  workspaceMembers: [
  { name: 'Admin', role: 'admin' },
  { name: 'Dr. Chen', role: 'faculty' },
  { name: 'Dr. Kim', role: 'faculty' },
  { name: 'Dr. Patel', role: 'faculty' }]

},
{ id: 'f-biol-u1', name: 'Unit 1: Cell Biology', parentId: 'f-biol-2026', count: 2 },
{ id: 'f-biol-mem', name: 'Membrane Transport', parentId: 'f-biol-u1', count: 2 },
{ id: 'f-biol-act', name: 'Active Transport', parentId: 'f-biol-mem', count: 1 },
{ id: 'f-biol-pas', name: 'Passive Diffusion', parentId: 'f-biol-mem', count: 1 },
{ id: 'f-biol-qset1', name: 'Neuro Exam Set', parentId: 'f-biol-2026', count: 2, isQuestionSet: true, collaborators: ['Dr. Chen', 'Dr. Kim'] },

// ── Skel 101 ───────────────────────────────────────────────────────────────────────
{
  id: 'f-skel101', name: 'Skel 101', parentId: null, count: 5,
  isCourse: true, isLifetimeRepo: true
},
{
  id: 'f-skel-sec-a', name: 'Fall 2026', parentId: 'f-skel101', count: 3,
  isCourseOffering: true,
  workspaceMembers: [
  { name: 'Admin', role: 'admin' },
  { name: 'Dr. Ramirez', role: 'faculty' },
  { name: 'Dr. Wells', role: 'faculty' }]

}];


// ── Smart Views ────────────────────────────────────────────────────────────────────────────

export const INIT_VIEWS: SVItem[] = [
{
  id: 'sv-disc', name: 'Low Discrimination', count: 3, isDefault: true, autoUpdate: true,
  criteria: { ...DEFAULT_CRITERIA, pbis: 'very-low' }, personal: false, isAdminView: true
},
{
  id: 'sv-never', name: 'Never Used', count: 7, isDefault: true, autoUpdate: true,
  criteria: { ...DEFAULT_CRITERIA, usage: 'never' }, personal: false, isAdminView: true
},
{
  id: 'sv-hard', name: 'High Difficulty', count: 9, isDefault: true, autoUpdate: true,
  criteria: { ...DEFAULT_CRITERIA, difficulties: ['Hard'] }, personal: false, isAdminView: true
},
{
  id: 'sv-saved', name: 'All Saved', count: 19, isDefault: false, autoUpdate: true,
  criteria: { ...DEFAULT_CRITERIA, autoUpdate: true }, personal: false
},
{
  id: 'sv-my-hard', name: 'My Hard Questions', count: 4, isDefault: false, autoUpdate: true,
  criteria: { ...DEFAULT_CRITERIA, difficulties: ['Hard'], autoUpdate: true }, personal: true
}];


// ── Badge colour configs ───────────────────────────────────────────────────────────────────────────

export const S_CFG: Record<QStatus, {dot: string;text: string;bg: string;}> = {
  Saved: { dot: '#0d9488', text: '#0f766e', bg: '#ccfbf1' },
  Draft: { dot: '#94a3b8', text: '#475569', bg: '#f1f5f9' }
};

export const T_CFG: Record<QType, {bg: string;color: string;}> = {
  MCQ: { bg: '#dbeafe', color: '#1d4ed8' },
  'Fill blank': { bg: '#f1f5f9', color: '#475569' },
  Hotspot: { bg: '#ede9fe', color: '#6d28d9' },
  Ordering: { bg: '#d1fae5', color: '#065f46' },
  Matching: { bg: '#fef3c7', color: '#92400e' }
};

export const D_CFG: Record<QDiff, {bg: string;color: string;}> = {
  Easy: { bg: '#dcfce7', color: '#15803d' },
  Medium: { bg: '#fef9c3', color: '#a16207' },
  Hard: { bg: '#fee2e2', color: '#b91c1c' }
};