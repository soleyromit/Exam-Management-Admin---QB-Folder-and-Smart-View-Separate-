import { DEFAULT_CRITERIA } from './QBModals';
import type { SmartCriteria } from './QBModals';

// ── Types ──────────────────────────────────────────────────────────────────

export type QStatus =
'Active' |
'Ready' |
'In Review' |
'Draft' |
'Flagged' |
'Approved' |
'Locked';

export type QType = 'MCQ' | 'Fill blank' | 'Hotspot' | 'Ordering' | 'Matching';
export type QDiff = 'Easy' | 'Medium' | 'Hard';
export type QBlooms =
'Remember' |
'Understand' |
'Apply' |
'Analyze' |
'Evaluate' |
'Create';

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
}

export interface FolderNode {
  id: string;
  name: string;
  parentId: string | null;
  count: number;
  locked?: boolean;
}

export interface SVItem {
  id: string;
  name: string;
  count: number;
  isDefault?: boolean;
  autoUpdate: boolean;
  criteria: SmartCriteria;
}

// ── Sample questions ───────────────────────────────────────────────────────

export const QS: Question[] = [
{
  id: 'q1', code: 'ANAT-021', version: 1, age: '2d ago',
  title: 'Identify the coronary artery on the diagram that supplies the inferior wall of the heart.',
  type: 'Hotspot', status: 'Approved', difficulty: 'Medium', blooms: 'Remember',
  folder: 'Anatomy', tags: ['anatomy', 'cardiology', 'high-yield'], usage: 0, pbis: null, pbisDir: null,
  collaborator: 'Dr. Patel'
},
{
  id: 'q2', code: 'ANAT-022', version: 1, age: '2w ago',
  title: 'Complete: The drug that selectively inhibits COX-2 is associated with increased risk of __ events.',
  type: 'Fill blank', status: 'Draft', difficulty: 'Easy', blooms: 'Remember',
  folder: 'Pharmacology', tags: ['pharmacology', 'NSAIDs'], usage: 0, pbis: null, pbisDir: null,
  collaborator: 'Dr. Chen'
},
{
  id: 'q3', code: 'CRD-045', version: 3, age: '3d ago',
  title: 'A 58yo male with exertional chest pain. ECG shows ST elevation in II, III, aVF. Which artery is occluded?',
  type: 'MCQ', status: 'In Review', difficulty: 'Hard', blooms: 'Analyze',
  folder: 'Cardiology', tags: ['cardiology', 'high-yield', 'clinical'], usage: 1, pbis: 0.52, pbisDir: 'up',
  collaborator: 'Dr. Ramirez'
},
{
  id: 'q4', code: 'CRD-046', version: 2, age: '5d ago',
  title: 'Calculate the corrected QT interval for a patient with QT=440ms and HR=50bpm.',
  type: 'Fill blank', status: 'Locked', difficulty: 'Hard', blooms: 'Apply',
  folder: 'Cardiology', tags: ['cardiology', 'clinical'], usage: 6, pbis: 0.44, pbisDir: 'up',
  collaborator: 'Dr. Lee'
},
{
  id: 'q5', code: 'NEUR-011', version: 1, age: '6h ago',
  title: 'A patient presents with unilateral facial droop, arm weakness, and aphasia. Which cerebral artery is most likely occluded?',
  type: 'MCQ', status: 'Active', difficulty: 'Hard', blooms: 'Analyze',
  folder: 'Neurology', tags: ['neurology', 'stroke', 'high-yield'], usage: 1, pbis: 0.47, pbisDir: 'up',
  collaborator: 'Dr. Patel'
},
{
  id: 'q6', code: 'NEUR-012', version: 1, age: '2d ago',
  title: 'Which finding on MRI best differentiates MS plaques from small vessel ischemic disease?',
  type: 'MCQ', status: 'Draft', difficulty: 'Hard', blooms: 'Analyze',
  folder: 'Neurology', tags: ['neurology', 'imaging'], usage: 0, pbis: null, pbisDir: null,
  collaborator: 'Dr. Kim'
},
{
  id: 'q7', code: 'PHR-101', version: 3, age: '2h ago',
  title: 'Which beta-blocker is cardioselective and preferred in reactive airway disease?',
  type: 'MCQ', status: 'Active', difficulty: 'Medium', blooms: 'Apply',
  folder: 'Pharmacology', tags: ['pharmacology', 'cardiology', 'high-yield'], usage: 4, pbis: 0.41, pbisDir: 'up',
  collaborator: 'Dr. Chen'
},
{
  id: 'q8', code: 'PHR-102', version: 1, age: '1w ago',
  title: 'Mechanism of action of loop diuretics and their effect on serum electrolytes.',
  type: 'MCQ', status: 'Ready', difficulty: 'Medium', blooms: 'Understand',
  folder: 'Pharmacology', tags: ['pharmacology', 'renal'], usage: 2, pbis: 0.38, pbisDir: 'flat',
  collaborator: 'Dr. Ramirez'
},
{
  id: 'q9', code: 'PHR-103', version: 1, age: '3w ago',
  title: 'Which ACE inhibitor is a prodrug and must be converted to its active form in the liver?',
  type: 'MCQ', status: 'Approved', difficulty: 'Easy', blooms: 'Remember',
  folder: 'Pharmacology', tags: ['pharmacology', 'clinical'], usage: 3, pbis: 0.29, pbisDir: 'down',
  collaborator: 'Dr. Lee'
},
{
  id: 'q10', code: 'PHYS-031', version: 1, age: '4d ago',
  title: 'Describe the Frank-Starling mechanism and its relationship to preload and cardiac output.',
  type: 'Fill blank', status: 'In Review', difficulty: 'Medium', blooms: 'Understand',
  folder: 'Physiology', tags: ['physiology', 'cardiology'], usage: 0, pbis: null, pbisDir: null,
  collaborator: 'Dr. Kim'
},
{
  id: 'q11', code: 'PHYS-032', version: 2, age: '1d ago',
  title: 'At what point on the oxygen-hemoglobin dissociation curve does a rightward shift most clinically matter?',
  type: 'MCQ', status: 'Active', difficulty: 'Hard', blooms: 'Analyze',
  folder: 'Physiology', tags: ['physiology', 'high-yield', 'clinical'], usage: 5, pbis: 0.51, pbisDir: 'up',
  collaborator: 'Dr. Patel'
},
{
  id: 'q12', code: 'ANAT-030', version: 1, age: '5d ago',
  title: 'Which nerve is at risk during anterior approach to the hip replacement?',
  type: 'MCQ', status: 'Flagged', difficulty: 'Medium', blooms: 'Remember',
  folder: 'Anatomy', tags: ['anatomy', 'orthopedics'], usage: 1, pbis: 0.18, pbisDir: 'down',
  collaborator: 'Dr. Ramirez'
},
{
  id: 'q13', code: 'CRD-050', version: 1, age: '1w ago',
  title: 'A patient on warfarin has an INR of 7.2 with no bleeding. What is the most appropriate management?',
  type: 'MCQ', status: 'Draft', difficulty: 'Hard', blooms: 'Evaluate',
  folder: 'Cardiology', tags: ['cardiology', 'anticoagulation', 'clinical'], usage: 0, pbis: null, pbisDir: null,
  collaborator: 'Dr. Lee'
},
{
  id: 'q14', code: 'NEUR-015', version: 1, age: '3d ago',
  title: 'Differentiate upper vs lower motor neuron lesions based on physical examination findings.',
  type: 'Ordering', status: 'Ready', difficulty: 'Medium', blooms: 'Analyze',
  folder: 'Neurology', tags: ['neurology', 'clinical'], usage: 0, pbis: null, pbisDir: null,
  collaborator: 'Dr. Kim'
},
{
  id: 'q15', code: 'PHR-110', version: 1, age: '6d ago',
  title: 'Rank the following antihypertensives by first-line preference in a diabetic patient with CKD.',
  type: 'Ordering', status: 'Active', difficulty: 'Hard', blooms: 'Evaluate',
  folder: 'Pharmacology', tags: ['pharmacology', 'clinical', 'high-yield'], usage: 2, pbis: 0.44, pbisDir: 'up',
  collaborator: 'Dr. Chen'
}];


// ── Folder / view seed data ────────────────────────────────────────────────

export const INIT_ASSIGNMENTS: Record<string, string[]> = {
  'f-pharm': ['q1', 'q2', 'q7', 'q8', 'q15'],
  'f-cardio': ['q3', 'q4', 'q13'],
  'f-renal': ['q9', 'q14'],
  'f-c1': ['q5', 'q6'],
  'f-c2': ['q10', 'q11'],
  'f-courses': ['q12'],
  'f-audit': ['q3', 'q4']
};

export const INIT_AUDIT_VER: Record<string, Record<string, number>> = {
  'f-audit': { q3: 1, q4: 1 }
};

export const INIT_FOLDERS: FolderNode[] = [
{ id: 'f-pharm', name: 'PHAR 101 — Pharmacology', parentId: null, count: 7 },
{ id: 'f-cardio', name: 'Cardiology', parentId: 'f-pharm', count: 3 },
{ id: 'f-renal', name: 'Renal', parentId: 'f-pharm', count: 2 },
{ id: 'f-courses', name: 'BIOL 201 — My Courses', parentId: null, count: 2 },
{ id: 'f-c1', name: 'Course 1', parentId: 'f-courses', count: 2 },
{ id: 'f-c2', name: 'Course 2', parentId: 'f-courses', count: 2 },
{ id: 'f-audit', name: '2024 Cardiology Audit', parentId: null, count: 2, locked: true }];


export const INIT_VIEWS: SVItem[] = [
{
  id: 'sv-disc', name: 'Low Discrimination', count: 2, isDefault: true, autoUpdate: true,
  criteria: { ...DEFAULT_CRITERIA, pbis: 'very-low' }
},
{
  id: 'sv-never', name: 'Never Used', count: 6, isDefault: true, autoUpdate: true,
  criteria: { ...DEFAULT_CRITERIA, usage: 'never' }
},
{
  id: 'sv-hard', name: 'High Difficulty', count: 7, isDefault: true, autoUpdate: true,
  criteria: { ...DEFAULT_CRITERIA, difficulties: ['Hard'] }
},
{
  id: 'sv-pharm', name: 'Active — Pharm', count: 5, isDefault: false, autoUpdate: false,
  criteria: { ...DEFAULT_CRITERIA, autoUpdate: false }
}];


// ── Badge colour configs ───────────────────────────────────────────────────

export const S_CFG: Record<QStatus, {dot: string;text: string;bg: string;}> = {
  Active: { dot: '#16a34a', text: '#15803d', bg: '#dcfce7' },
  Ready: { dot: '#2563eb', text: '#1d4ed8', bg: '#dbeafe' },
  'In Review': { dot: '#d97706', text: '#a16207', bg: '#fef3c7' },
  Draft: { dot: '#94a3b8', text: '#475569', bg: '#f1f5f9' },
  Flagged: { dot: '#dc2626', text: '#b91c1c', bg: '#fee2e2' },
  Approved: { dot: '#7c3aed', text: '#6d28d9', bg: '#ede9fe' },
  Locked: { dot: '#9ca3af', text: '#6b7280', bg: '#f8fafc' }
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