import React, { useEffect, useMemo, useState, useRef, Fragment } from 'react';
import { QBView } from './QBView';
import { ImportWizardModal } from './ImportWizard';
import { NewQuestionModal } from './NewQuestionModal';
import { QuestionRowPanel } from './QuestionRowPanel';
import type { QRowData } from './QuestionRowPanel';
import {
  CreateSmartViewModal,
  EditSmartViewModal,
  ArchiveConfirmModal,
  DeleteConfirmModal,
  ShareFolderModal,
  AddToFolderModal,
  DEFAULT_CRITERIA } from
'./QBModals';
import type { SmartCriteria } from './QBModals';
import { FilterSheet } from './QBFilterSheet';
import type { FieldFilters } from './QBFilterSheet';
import { QS, INIT_FOLDERS, INIT_VIEWS, INIT_ASSIGNMENTS } from './QBData';
import type { Question, FolderNode, SVItem } from './QBData';
import { StatusBadge, TypeBadge, DiffBadge, PBisCell } from './QBHelpers';
import { ShareQuestionModal } from './ShareQuestionModal';
import type { Role } from '../types';
import {
  CourseBadge,
  PersonalBadge,
  FacultyAccessBanner,
  FacultyOnboardingBanner,
  CreatorCell,
  InlineFolderInput,
  TreeGuides } from
'./QBInlineHelpers';
import {
  RequestEditModal,
  EditImpactWarningModal,
  CollaborateModal,
  SectionOverlapModal,
  CrossDeptBlockModal } from
'./QBFacultyModals';
import { AdminFolderRow, FacultyFolderRow } from './QBFolderRows';
import type { FolderRowCtx } from './QBFolderRows';
import { QBQuestionRow, QB_GRID } from './QBQuestionRow';
import type { QRowCtx } from './QBQuestionRow';
import { AssignCoursesModal } from './QBAssignModal';
import type { FacultyAccessMap } from './QBAssignModal';
// Phase 3 — trust levels added to each persona
const PERSONAS = [
{
  id: 'admin',
  name: 'Admin',
  role: 'dept-head' as const,
  initials: 'AD',
  color: '#7c3aed',
  trustLevel: 'senior' as const
},
{
  id: 'dr-patel',
  name: 'Dr. Patel',
  role: 'faculty' as const,
  initials: 'AP',
  color: '#0891b2',
  trustLevel: 'senior' as const
},
{
  id: 'dr-chen',
  name: 'Dr. Chen',
  role: 'faculty' as const,
  initials: 'SC',
  color: '#059669',
  trustLevel: 'senior' as const
},
{
  id: 'dr-lee',
  name: 'Dr. Lee',
  role: 'faculty' as const,
  initials: 'PL',
  color: '#d97706',
  trustLevel: 'mid' as const
},
{
  id: 'dr-ramirez',
  name: 'Dr. Ramirez',
  role: 'faculty' as const,
  initials: 'MR',
  color: '#dc2626',
  trustLevel: 'mid' as const
},
{
  id: 'dr-kim',
  name: 'Dr. Kim',
  role: 'faculty' as const,
  initials: 'JK',
  color: '#0f766e',
  trustLevel: 'junior' as const
},
{
  id: 'dr-wells',
  name: 'Dr. Wells',
  role: 'faculty' as const,
  initials: 'DW',
  color: '#64748b',
  trustLevel: 'junior' as const
}];

const FOLDER_TO_COURSE_CODE: Record<string, string> = {
  'f-phar101': 'phar101',
  'f-biol201': 'biol201',
  'f-skel101': 'skel101'
};
const VERSION_HISTORY: Record<
  string,
  {
    v: number;
    label: string;
    date: string;
    author: string;
  }[]> =
{
  q1: [
  {
    v: 2,
    label: 'Revised stem clarity',
    date: 'Apr 2, 2026',
    author: 'Dr. Patel'
  },
  {
    v: 1,
    label: 'Initial creation',
    date: 'Jan 10, 2026',
    author: 'Dr. Patel'
  }],

  q2: [
  {
    v: 2,
    label: 'Co-edit: revised distractors',
    date: 'Feb 20, 2026',
    author: 'Dr. Lee'
  },
  {
    v: 1,
    label: 'Initial creation',
    date: 'Nov 5, 2025',
    author: 'Dr. Patel'
  }],

  q3: [
  {
    v: 1,
    label: 'Initial creation — draft',
    date: 'Dec 1, 2025',
    author: 'Dr. Patel'
  }]

};
export function QuestionBankFull({
  onEditQuestion,
  leftOpen: leftOpenProp,
  onToggleLeft,
  role: roleProp = 'dept-head',
  onRoleChange







}: {onEditQuestion?: () => void;onToggleSidebar?: () => void;leftOpen?: boolean;onToggleLeft?: () => void;role?: Role;onRoleChange?: (r: Role) => void;}) {
  const [_lo, _slo] = useState(true);
  const leftOpen = leftOpenProp !== undefined ? leftOpenProp : _lo;
  const toggleLeft = () => {
    onToggleLeft ? onToggleLeft() : _slo((v) => !v);
  };
  const [activePersonaId, setActivePersonaId] = useState('admin');
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);
  const activePersona =
  PERSONAS.find((p) => p.id === activePersonaId) || PERSONAS[0];
  const CURRENT_USER = activePersona.name;
  const isFaculty = activePersona.role === 'faculty';
  const isAdmin = !isFaculty;
  // Phase 3 — senior = admin OR faculty with senior trust level
  const isSenior = isAdmin || activePersona.trustLevel === 'senior';
  // Phase 1 — questions is now mutable (needed for Promote to Pool)
  const [questions, setQuestions] = useState<Question[]>(QS);
  const [folders, setFolders] = useState<FolderNode[]>(INIT_FOLDERS);
  const [views, setViews] = useState<SVItem[]>(INIT_VIEWS);
  const [assignments, setAssignments] = useState(INIT_ASSIGNMENTS);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set([
    'f-phar101',
    'f-biol201',
    'f-skel101',
    'f-phar-2026',
    'f-biol-2026']
    )
  );
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [folderYearFilter, setFolderYearFilter] = useState<string | null>(null);
  const [facultyStatusFilterMap, setFacultyStatusFilterMap] = useState(
    {} as Record<string, 'approved' | 'all'>
  );
  const [transferCourseOnly, setTransferCourseOnly] = useState(false);
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const [moreOptionsPos, setMoreOptionsPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [headerMenuPos, setHeaderMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [inlineFolderParentId, setInlineFolderParentId] = useState<
    string | null | undefined>(
    undefined);
  const [inlineFolderName, setInlineFolderName] = useState('');
  const [inlineFolderIsQSet, setInlineFolderIsQSet] = useState(false);
  const inlineInputRef = useRef<HTMLInputElement>(null);
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renamingFolderName, setRenamingFolderName] = useState('');
  const [folderMenuId, setFolderMenuId] = useState<string | null>(null);
  const [rowMenuId, setRowMenuId] = useState<string | null>(null);
  const [rowMenuPos, setRowMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [versionPopoverId, setVersionPopoverId] = useState<string | null>(null);
  const [versionMenuPos, setVersionMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [dragFolderId, setDragFolderId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [draggedQId, setDraggedQId] = useState<string | null>(null);
  const [dragQOverFolderId, setDragQOverFolderId] = useState<string | null>(
    null
  );
  const [activeTabId, setActiveTabId] = useState('qa-all');
  const [hoverTabId, setHoverTabId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [fieldFilters, setFieldFilters] = useState<FieldFilters>({});
  const [sortBy] = useState<'title' | 'age' | 'status'>('title');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [requestEditId, setRequestEditId] = useState<string | null>(null);
  const [editImpactQ, setEditImpactQ] = useState<Question | null>(null);
  const [shortlistedQIds, setShortlistedQIds] = useState<Set<string>>(
    new Set(['q1', 'q3'])
  );
  const [showOnlyShortlisted, setShowOnlyShortlisted] = useState(false);
  const [selected, setSelected] = useState(new Set<string>());
  const [rowHoverId, setRowHoverId] = useState<string | null>(null);
  const [pinnedQIds, setPinnedQIds] = useState<Set<string>>(new Set());
  const [tabCtxMenu, setTabCtxMenu] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const [renamingTabId, setRenamingTabId] = useState<string | null>(null);
  const [renamingTabName, setRenamingTabName] = useState('');
  const [rowPanel, setRowPanel] = useState<Question | null>(null);
  const [newQuestionOpen, setNewQuestionOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [createSVOpen, setCreateSVOpen] = useState(false);
  const [editSV, setEditSV] = useState<SVItem | null>(null);
  const [archiveFolder, setArchiveFolder] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<{
    id: string;
    name: string;
    type: 'folder' | 'smart view';
  } | null>(null);
  const [shareTarget, setShareTarget] = useState<{
    id: string;
    name: string;
    type: 'folder' | 'view';
  } | null>(null);
  const [addToFolderOpen, setAddToFolderOpen] = useState(false);
  const [selectedQForFolder, setSelectedQForFolder] = useState<string | null>(
    null
  );
  const [shareQId, setShareQId] = useState<string | null>(null);
  const [collaborateOpen, setCollaborateOpen] = useState(false);
  const [adminAssignOpen, setAdminAssignOpen] = useState(false);
  const [autoCollectedFolderIds, setAutoCollectedFolderIds] = useState<
    Set<string>>(
    new Set());
  const [autoCollectOpen, setAutoCollectOpen] = useState(false);
  const [questionAccessMap, setQuestionAccessMap] = useState(
    {} as Record<string, Record<string, 'view' | 'edit'>>
  );
  const [facultyAssignments, setFacultyAssignments] = useState({
    'Dr. Patel': ['f-phar101', 'f-biol201'],
    'Dr. Chen': ['f-biol201', 'f-skel101'],
    'Dr. Lee': ['f-phar101'],
    'Dr. Ramirez': ['f-phar101', 'f-skel101'],
    'Dr. Kim': ['f-biol201'],
    'Dr. Wells': []
  } as Record<string, string[]>);
  const [facultyAccessMap, setFacultyAccessMap] = useState<FacultyAccessMap>({
    'Dr. Patel': {
      'f-phar101': 'edit',
      'f-biol201': 'view'
    },
    'Dr. Chen': {
      'f-biol201': 'edit',
      'f-skel101': 'view'
    },
    'Dr. Lee': {
      'f-phar101': 'view'
    },
    'Dr. Ramirez': {
      'f-phar101': 'view',
      'f-skel101': 'edit'
    },
    'Dr. Kim': {
      'f-biol201': 'view'
    },
    'Dr. Wells': {}
  });
  const [sectionOverlapQ, setSectionOverlapQ] = useState<Question | null>(null);
  const [crossDeptBlockQ, setCrossDeptBlockQ] = useState<Question | null>(null);
  const tabBarWrapRef = useRef<HTMLDivElement>(null);
  const [overflowIdx, setOverflowIdx] = useState(4);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [chevronHoverId, setChevronHoverId] = useState<string | null>(null);
  const [filterFieldOpen, setFilterFieldOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const FACULTY_COURSES = (facultyAssignments[CURRENT_USER] || []).
  map((fid) => FOLDER_TO_COURSE_CODE[fid]).
  filter(Boolean) as string[];
  useEffect(() => {
    if (inlineFolderParentId !== undefined)
    setTimeout(() => inlineInputRef.current?.focus(), 50);
  }, [inlineFolderParentId]);
  const facultyAccessibleFolderIds = useMemo(() => {
    const myFolderIds = new Set(facultyAssignments[CURRENT_USER] || []);
    const result = new Set<string>();
    folders.forEach((f) => {
      if (myFolderIds.has(f.id)) result.add(f.id);
    });
    folders.forEach((f) => {
      if (f.parentId && myFolderIds.has(f.parentId)) result.add(f.id);
    });
    folders.forEach((f) => {
      if (f.parentId && result.has(f.parentId)) result.add(f.id);
    });
    return result;
  }, [folders, facultyAssignments, activePersonaId]);
  const facultyCourseNames = useMemo(() => {
    const myFolderIds = new Set(facultyAssignments[CURRENT_USER] || []);
    return folders.
    filter((f) => f.isCourse && !f.parentId && myFolderIds.has(f.id)).
    map((f) => f.name);
  }, [folders, facultyAssignments, activePersonaId]);
  const getChildIds = (fid: string): string[] => {
    const ch = folders.filter((f) => f.parentId === fid);
    return [fid, ...ch.flatMap((c) => getChildIds(c.id))];
  };
  const getFolderQIds = (fid: string) => {
    const ids = getChildIds(fid);
    return [...new Set(ids.flatMap((id) => assignments[id] || []))];
  };
  const allValues = useMemo(
    () => ({
      folder: [
      ...new Set(questions.map((q) => q.folder).filter(Boolean))].
      sort() as string[],
      type: [...new Set(questions.map((q) => q.type))].sort() as string[],
      status: [...new Set(questions.map((q) => q.status))].sort() as string[],
      difficulty: ['Easy', 'Medium', 'Hard'] as string[],
      blooms: [
      ...new Set(questions.map((q) => q.blooms).filter(Boolean))].
      sort() as string[],
      tags: [
      ...new Set(questions.flatMap((q) => q.tags || []))].
      sort() as string[],
      collaborator: [
      ...new Set(
        questions.map((q) => q.collaborator).filter((c): c is string => !!c)
      )].
      sort() as string[]
    }),
    [questions]
  );
  // ── Phase 1 visibility helper ─────────────────────────────────────────────
  // Admin: all non-private questions.
  // Faculty: Saved questions + their own Drafts (creator) + questions they collaborate on.
  const computeVisibleQs = (
  qs: Question[],
  user: string,
  isF: boolean)
  : Question[] =>
  qs.filter((q) => {
    if ((q.tags || []).includes('private')) return false;
    if (!isF) return true; // admin sees everything
    return (
      q.status === 'Saved' ||
      q.creator === user ||
      q.collaborator === user);

  });

  // Count of questions visible to the current persona (used for "All Questions" tab)
  const allQuestionsCount = useMemo(
    () => computeVisibleQs(questions, CURRENT_USER, isFaculty).length,
    [questions, isFaculty, CURRENT_USER]
  );

  // Count of questions the current user owns or collaborates on (sidebar My Questions)
  const myQuestionsCount = useMemo(
    () =>
    computeVisibleQs(questions, CURRENT_USER, isFaculty).filter(
      (q) => q.creator === CURRENT_USER || q.collaborator === CURRENT_USER
    ).length,
    [questions, isFaculty, CURRENT_USER]
  );

  // Live folder counts: per-folder question count filtered by current persona visibility.
  // Replaces the stale static f.count from INIT_FOLDERS.
  const liveFolderCounts = useMemo(() => {
    const visibleIds = new Set(
      computeVisibleQs(questions, CURRENT_USER, isFaculty).map((q) => q.id)
    );
    const counts: Record<string, number> = {};
    for (const [fid, qids] of Object.entries(assignments)) {
      counts[fid] = qids.filter((qid) => visibleIds.has(qid)).length;
    }
    folders.forEach((f) => {
      if (!(f.id in counts)) counts[f.id] = 0;
    });
    return counts;
  }, [questions, assignments, folders, isFaculty, CURRENT_USER]);

  // Live smart-view counts: recomputes every view count from its criteria on the
  // current visible question set. Replaces the stale static v.count from INIT_VIEWS.
  const liveViewCounts = useMemo(() => {
    const base = computeVisibleQs(questions, CURRENT_USER, isFaculty);
    const counts: Record<string, number> = {};
    for (const sv of views) {
      if (!sv.autoUpdate) {
        counts[sv.id] = sv.count; // snapshot views keep their stored count
        continue;
      }
      let r = [...base];
      const c = sv.criteria;
      // sv-saved: only show Saved questions
      if (sv.id === 'sv-saved') r = r.filter((q) => q.status === 'Saved');
      // personal views: only the current user's questions
      if (sv.personal)
      r = r.filter(
        (q) => q.creator === CURRENT_USER || q.collaborator === CURRENT_USER
      );
      if (c.difficulties?.length)
      r = r.filter((q) => c.difficulties.includes(q.difficulty || ''));
      if (c.blooms?.length)
      r = r.filter((q) => c.blooms.includes(q.blooms || ''));
      if (c.types?.length) r = r.filter((q) => c.types.includes(q.type || ''));
      if (c.tags?.length)
      r = r.filter((q) => c.tags!.some((t) => (q.tags || []).includes(t)));
      if (c.usage === 'never') r = r.filter((q) => (q.usage ?? 0) === 0);
      if (c.usage === 'low')
      r = r.filter((q) => (q.usage ?? 0) >= 1 && (q.usage ?? 0) <= 2);
      if (c.usage === 'multi') r = r.filter((q) => (q.usage ?? 0) >= 3);
      if (c.pbis === 'low')
      r = r.filter((q) => q.pbis !== null && q.pbis < 0.3);
      if (c.pbis === 'very-low')
      r = r.filter((q) => q.pbis !== null && q.pbis < 0.2);
      if (c.pbis === 'high')
      r = r.filter((q) => q.pbis !== null && q.pbis >= 0.4);
      counts[sv.id] = r.length;
    }
    return counts;
  }, [questions, views, isFaculty, CURRENT_USER]);
  const selectedFolderIsLifetimeRepo = selectedFolder ?
  folders.find((f) => f.id === selectedFolder)?.isLifetimeRepo === true :
  false;
  const showOnboarding =
  isFaculty && !selectedFolder && facultyAccessibleFolderIds.size === 0;
  const newContentFolderIds = autoCollectedFolderIds;
  const filteredQuestions = useMemo(() => {
    if (activeTabId === 'sv-shortlist')
    return questions.filter((q) => shortlistedQIds.has(q.id));
    let r = [...questions];
    r = r.filter((q) => !(q.tags || []).includes('private'));
    if (selectedFolder) {
      const qIds = new Set(getFolderQIds(selectedFolder));
      r = r.filter((q) => qIds.has(q.id));
    }
    if (activeTabId === 'qa-my') {
      r = r.filter(
        (q) => q.collaborator === CURRENT_USER || q.creator === CURRENT_USER
      );
    }
    // Phase 1: sv-pending — review workflow not yet built
    else if (activeTabId === 'sv-pending') {

      /* Phase 2 — review workflow not yet built */} else if (activeTabId !== 'qa-all') {
      const sv = views.find((v) => v.id === activeTabId);
      if (sv) {
        const c = sv.criteria;
        // sv-saved: restrict to Saved status only
        if (sv.id === 'sv-saved') r = r.filter((q) => q.status === 'Saved');
        // personal views: restrict to questions the current user owns or collaborates on
        if (sv.personal)
        r = r.filter(
          (q) =>
          q.creator === CURRENT_USER || q.collaborator === CURRENT_USER
        );
        if (c.difficulties?.length)
        r = r.filter((q) => c.difficulties.includes(q.difficulty || ''));
        if (c.blooms?.length)
        r = r.filter((q) => c.blooms.includes(q.blooms || ''));
        if (c.types?.length) r = r.filter((q) => c.types.includes(q.type || ''));
        if (c.tags?.length)
        r = r.filter((q) => c.tags!.some((t) => (q.tags || []).includes(t)));
        if (c.usage === 'never') r = r.filter((q) => (q.usage ?? 0) === 0);
        if (c.usage === 'low')
        r = r.filter((q) => (q.usage ?? 0) >= 1 && (q.usage ?? 0) <= 2);
        if (c.usage === 'multi') r = r.filter((q) => (q.usage ?? 0) >= 3);
        if (c.pbis === 'low')
        r = r.filter((q) => q.pbis !== null && q.pbis < 0.3);
        if (c.pbis === 'very-low')
        r = r.filter((q) => q.pbis !== null && q.pbis < 0.2);
        if (c.pbis === 'high')
        r = r.filter((q) => q.pbis !== null && q.pbis >= 0.4);
      }
    }
    if (folderYearFilter && selectedFolderIsLifetimeRepo) {
      const inst = folders.find(
        (f) =>
        f.parentId === selectedFolder && f.courseYear === folderYearFilter
      );
      if (inst) {
        const iQIds = new Set(getFolderQIds(inst.id));
        r = r.filter((q) => iQIds.has(q.id));
      }
    }
    if (isFaculty) {
      // Phase 1 faculty visibility:
      //   - All Saved questions in the workspace
      //   - The faculty member's own Drafts (creator)
      //   - Questions they collaborate on (collaborator)
      r = r.filter(
        (q) =>
        q.status === 'Saved' ||
        q.creator === CURRENT_USER ||
        q.collaborator === CURRENT_USER
      );
      // Scope to assigned folder trees when no specific folder is selected.
      // Prevents external/unassigned members (e.g. view-only external examiners)
      // from seeing questions across courses they weren't added to.
      if (!selectedFolder) {
        const myFolderIds = facultyAssignments[CURRENT_USER] || [];
        if (myFolderIds.length > 0) {
          const accessibleQIds = new Set<string>();
          myFolderIds.forEach((fid: string) =>
          getFolderQIds(fid).forEach((id: string) => accessibleQIds.add(id))
          );
          r = r.filter(
            (q) =>
            accessibleQIds.has(q.id) ||
            q.creator === CURRENT_USER ||
            q.collaborator === CURRENT_USER
          );
        } else {
          // No folder assignments (external/view-only member) — only own content
          r = r.filter(
            (q) => q.creator === CURRENT_USER || q.collaborator === CURRENT_USER
          );
        }
      }
    }
    if (searchText.trim()) {
      const s = searchText.toLowerCase();
      r = r.filter(
        (q) =>
        (q.title || '').toLowerCase().includes(s) ||
        (q.code || '').toLowerCase().includes(s)
      );
    }
    Object.entries(fieldFilters).forEach(([field, vals]) => {
      if (!vals || !vals.length) return;
      if (field === 'tags')
      r = r.filter((q) => vals.some((v) => (q.tags || []).includes(v)));else
      r = r.filter((q) => vals.includes((q as any)[field] || ''));
    });
    if (showOnlyShortlisted) r = r.filter((q) => shortlistedQIds.has(q.id));
    return r.sort((a, b) => {
      const aP = pinnedQIds.has(a.id) ? 0 : 1,
        bP = pinnedQIds.has(b.id) ? 0 : 1;
      if (aP !== bP) return aP - bP;
      if (sortBy === 'title')
      return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'age') return (a.age || '').localeCompare(b.age || '');
      return (a.status || '').localeCompare(b.status || '');
    });
  }, [
  questions,
  selectedFolder,
  activeTabId,
  views,
  searchText,
  fieldFilters,
  sortBy,
  assignments,
  folders,
  pinnedQIds,
  folderYearFilter,
  selectedFolderIsLifetimeRepo,
  isFaculty,
  showOnlyShortlisted,
  shortlistedQIds,
  activePersonaId,
  questionAccessMap,
  CURRENT_USER,
  facultyStatusFilterMap,
  facultyAssignments]
  );
  const facultyEditAccessQIds = useMemo(() => {
    if (!isFaculty) return new Set<string>();
    const editFolderIds = new Set(
      Object.entries(facultyAccessMap[CURRENT_USER] || {}).
      filter(([, level]) => level === 'edit').
      map(([fid]) => fid)
    );
    const qIds = new Set<string>();
    editFolderIds.forEach((fid) => {
      getFolderQIds(fid).forEach((id) => qIds.add(id));
    });
    return qIds;
  }, [isFaculty, CURRENT_USER, facultyAccessMap, assignments, folders]);
  const togglePin = (id: string) =>
  setPinnedQIds((prev) => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  useEffect(() => {
    setFolderYearFilter(null);
  }, [selectedFolder]);
  useEffect(() => {
    const el = tabBarWrapRef.current;
    if (!el) return;
    const measure = () => {
      const pills = Array.from(
        el.querySelectorAll<HTMLElement>('[data-tab-pill]')
      );
      if (!pills.length) {
        setOverflowIdx(999);
        return;
      }
      const avail = el.offsetWidth - 96;
      let total = 6,
        idx = 999;
      for (let i = 0; i < pills.length; i++) {
        total += pills[i].offsetWidth + 2;
        if (total > avail - 60 && idx === 999) {
          idx = i;
          break;
        }
      }
      setOverflowIdx(idx);
    };
    const obs = new ResizeObserver(measure);
    obs.observe(el);
    measure();
    return () => obs.disconnect();
  }, [views.length, shortlistedQIds.size]);
  const toggleFolderExpand = (id: string) =>
  setExpandedFolders((prev) => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const COURSE_CREATE_SENTINEL = '__course__';
  const handleInlineFolderCreate = () => {
    const name = inlineFolderName.trim();
    if (!name) {
      setInlineFolderParentId(undefined);
      setInlineFolderName('');
      setInlineFolderIsQSet(false);
      return;
    }
    const newId = `f-${Date.now()}`;
    const isCourseCreate = inlineFolderParentId === COURSE_CREATE_SENTINEL;
    const pid = isCourseCreate ? null : inlineFolderParentId ?? null;
    setFolders((prev) => {
      const nf = {
        id: newId,
        name,
        parentId: pid,
        count: 0,
        ...(isCourseCreate ?
        {
          isCourse: true
        } :
        {}),
        ...(inlineFolderIsQSet ?
        {
          isQuestionSet: true,
          collaborators: []
        } :
        {})
      };
      if (!pid) {
        const li = prev.reduce(
          (li, f, i) => !f.parentId && !f.isCourse ? i : li,
          -1
        );
        if (li === -1) return [...prev, nf];
        const a = [...prev];
        a.splice(li + 1, 0, nf);
        return a;
      } else {
        const li = prev.reduce((li, f, i) => f.parentId === pid ? i : li, -1);
        const a = [...prev];
        if (li === -1) {
          const pi = a.findIndex((f) => f.id === pid);
          a.splice(pi + 1, 0, nf);
        } else {
          a.splice(li + 1, 0, nf);
        }
        return a;
      }
    });
    if (pid) {
      setFacultyAccessMap((prev) => {
        const u = {
          ...prev
        };
        Object.entries(u).forEach(([fn, am]) => {
          if (am[pid]) {
            u[fn] = {
              ...am,
              [newId]: am[pid]
            };
          }
        });
        return u;
      });
      setFacultyAssignments((prev) => {
        const u = {
          ...prev
        };
        Object.entries(u).forEach(([fn, fids]) => {
          if (fids.includes(pid)) {
            u[fn] = [...fids, newId];
          }
        });
        return u;
      });
      setExpandedFolders((prev) => new Set([...prev, pid]));
    }
    setInlineFolderParentId(undefined);
    setInlineFolderName('');
    setInlineFolderIsQSet(false);
  };
  const cancelInlineFolder = () => {
    setInlineFolderParentId(undefined);
    setInlineFolderName('');
    setInlineFolderIsQSet(false);
  };
  const handleFolderRename = (fid: string) => {
    const name = renamingFolderName.trim();
    if (name)
    setFolders((prev) =>
    prev.map((f) =>
    f.id === fid ?
    {
      ...f,
      name
    } :
    f
    )
    );
    setRenamingFolderId(null);
    setRenamingFolderName('');
  };
  const handleReorderFolders = (dragId: string, dropId: string) => {
    const dragF = folders.find((f) => f.id === dragId),
      dropF = folders.find((f) => f.id === dropId);
    if (!dragF || !dropF || dragF.parentId !== dropF.parentId) return;
    setFolders((prev) => {
      const pid = dragF.parentId;
      const sibs = prev.filter((f) => f.parentId === pid),
        oth = prev.filter((f) => f.parentId !== pid);
      const fi = sibs.findIndex((f) => f.id === dragId),
        ti = sibs.findIndex((f) => f.id === dropId);
      if (fi < 0 || ti < 0) return prev;
      const r = [...sibs];
      const [m] = r.splice(fi, 1);
      r.splice(ti, 0, m);
      return [...oth, ...r];
    });
  };
  const handleCreateSV = (name: string, criteria: SmartCriteria) => {
    const sv: SVItem = {
      id: `sv-${Date.now()}`,
      name,
      count: 0,
      isDefault: false,
      autoUpdate: criteria.autoUpdate,
      criteria,
      personal: isFaculty
    };
    setViews((prev) => [...prev, sv]);
    setCreateSVOpen(false);
    setActiveTabId(sv.id);
  };
  const handleSaveAsView = (name: string) => {
    const sv: SVItem = {
      id: `sv-flt-${Date.now()}`,
      name,
      count: filteredQuestions.length,
      isDefault: false,
      autoUpdate: false,
      criteria: {
        ...DEFAULT_CRITERIA,
        autoUpdate: false
      },
      personal: isFaculty
    };
    setViews((prev) => [...prev, sv]);
    setFieldFilters({});
    setFilterSheetOpen(false);
    setActiveTabId(sv.id);
  };
  const removeFilter = (field: string, val: string) => {
    setFieldFilters((prev) => {
      const next = {
        ...prev
      };
      next[field] = (next[field] || []).filter((v) => v !== val);
      if (!next[field].length) delete next[field];
      return next;
    });
  };
  const fieldIcon = (field: string) =>
  (
  {
    type: 'tag',
    status: 'circle-dot',
    difficulty: 'gauge-high',
    blooms: 'brain',
    tags: 'hashtag',
    collaborator: 'user',
    folder: 'folder'
  } as
  Record<string, string>)[field] || 'filter';
  const handleDeleteTab = (id: string) => {
    setViews((prev) => prev.filter((v) => v.id !== id));
    if (activeTabId === id) setActiveTabId('qa-all');
  };
  const saveTabRename = () => {
    if (renamingTabId && renamingTabName.trim())
    setViews((p) =>
    p.map((v) =>
    v.id === renamingTabId ?
    {
      ...v,
      name: renamingTabName.trim()
    } :
    v
    )
    );
    setRenamingTabId(null);
  };
  const moveTab = (id: string, dir: -1 | 1) => {
    setViews((prev) => {
      const idx = prev.findIndex((v) => v.id === id);
      if (idx < 0) return prev;
      const ni = Math.max(0, Math.min(prev.length - 1, idx + dir));
      if (ni === idx) return prev;
      const arr = [...prev];
      const [m] = arr.splice(idx, 1);
      arr.splice(ni, 0, m);
      return arr;
    });
    setTabCtxMenu(null);
  };
  const assignedFolderIds = useMemo(() => {
    const tid =
    selectedQForFolder || (selected.size === 1 ? [...selected][0] : null);
    if (!tid) return [];
    return Object.entries(assignments).
    filter(([, ids]) => ids.includes(tid)).
    map(([fid]) => fid);
  }, [selectedQForFolder, selected, assignments]);
  const toQRowData = (q: Question): QRowData => ({
    id: q.id,
    stem: q.title || '',
    type: q.type || '',
    status: q.status || '',
    blooms: q.blooms || '',
    difficulty: q.difficulty || '',
    topic: q.folder || '',
    owner: q.creator || q.collaborator || 'Faculty',
    pbis: q.pbis ?? null,
    version: q.version || 1,
    folder: q.folder || '',
    tags: q.tags || [],
    usageCount: q.usage ?? 0,
    updatedAt: q.age || '',
    options: []
  });
  const br = 'var(--brand)',
    bdr = 'var(--border)',
    fg = 'var(--foreground)',
    mfg = 'var(--muted-foreground)';
  const rootQBFolders = folders.filter(
    (f) => !f.parentId && !f.isCourse && !f.isPrivateSpace && !f.isQuestionSet
  );
  const rootCourseFolders = folders.filter((f) => !f.parentId && f.isCourse);
  // Phase 2 — Question Set folders for sidebar
  const rootQSetFolders = folders.filter((f) => !f.parentId && f.isQuestionSet);
  const availableSemesters = selectedFolderIsLifetimeRepo ?
  folders.
  filter((f) => f.parentId === selectedFolder && f.courseYear).
  map((f) => f.courseYear as string) :
  [];
  const allSelectedPinned =
  selected.size > 0 && [...selected].every((id) => pinnedQIds.has(id));
  const visibleViews = isFaculty ? views.filter((v) => !v.isAdminView) : views;
  const tabItems = [
  {
    id: 'qa-all',
    name: 'All Questions',
    // Live count: only questions visible to the current persona
    count: allQuestionsCount,
    isSystem: true,
    personal: false,
    isShortlistTab: false,
    isAdminView: false
  }];

  const systemTabs = tabItems.filter((t) => t.isSystem);
  const nonSystemTabs = tabItems.filter((t) => !t.isSystem);
  const maxNonSystem = Math.max(0, overflowIdx - systemTabs.length);
  const visibleNonSystem = nonSystemTabs.slice(0, maxNonSystem);
  const hiddenNonSystem = nonSystemTabs.slice(maxNonSystem);
  const visibleTabs = [...systemTabs, ...visibleNonSystem];
  const hiddenTabs = hiddenNonSystem;
  const activeIsHidden = hiddenTabs.some((t) => t.id === activeTabId);
  const filterFields = [
  {
    field: 'type',
    label: 'Type',
    icon: 'tag'
  },
  {
    field: 'status',
    label: 'Status',
    icon: 'circle-dot'
  },
  {
    field: 'difficulty',
    label: 'Difficulty',
    icon: 'gauge-high'
  },
  {
    field: 'blooms',
    label: "Bloom's Level",
    icon: 'brain'
  },
  {
    field: 'tags',
    label: 'Tags',
    icon: 'hashtag'
  },
  {
    field: 'collaborator',
    label: 'Creator',
    icon: 'user'
  },
  {
    field: 'folder',
    label: 'Folder',
    icon: 'folder'
  }];

  const handleAutoCollect = (folderId: string) => {
    setAutoCollectedFolderIds((prev) => new Set([...prev, folderId]));
  };
  // Phase 3 — trust level map for row rendering
  const personaTrustLevels: Record<string, 'junior' | 'mid' | 'senior'> =
  Object.fromEntries(PERSONAS.map((p) => [p.name, p.trustLevel]));
  const rowCtx: QRowCtx = {
    selected,
    rowMenuId,
    rowMenuPos,
    versionPopoverId,
    versionMenuPos,
    rowHoverId,
    pinnedQIds,
    shortlistedQIds,
    isFaculty,
    isAdmin,
    draggedQId,
    br,
    bdr,
    fg,
    mfg,
    CURRENT_USER,
    FACULTY_COURSES,
    VERSION_HISTORY,
    setSelected,
    setRowMenuId,
    setRowMenuPos,
    setVersionPopoverId,
    setVersionMenuPos,
    setRowHoverId,
    setPinnedQIds,
    setShortlistedQIds,
    setDraggedQId,
    setDragQOverFolderId,
    setRowPanel,
    setEditImpactQ,
    setRequestEditId,
    setAddToFolderOpen,
    setSelectedQForFolder,
    setShareQId,
    togglePin,
    onEditQuestion,
    onCollaborate: () => setCollaborateOpen(true),
    facultyEditAccessQIds,
    onTransferToCourse: (qId: string) => {
      setTransferCourseOnly(true);
      setSelectedQForFolder(qId);
      setSelected(new Set([qId]));
      setAddToFolderOpen(true);
    },
    personaTrustLevels,
    setQuestions
  };
  const folderRowCtx: FolderRowCtx = {
    liveFolderCounts,
    folders,
    expandedFolders,
    selectedFolder,
    renamingFolderId,
    renamingFolderName,
    folderMenuId,
    dragFolderId,
    dragOverFolderId,
    draggedQId,
    dragQOverFolderId,
    inlineFolderParentId,
    inlineFolderName,
    facultyAccessibleFolderIds,
    newContentFolderIds,
    br,
    bdr,
    fg,
    mfg,
    inlineInputRef,
    questions,
    setQuestions,
    assignments,
    setFolders,
    setExpandedFolders,
    setSelectedFolder,
    setFolderMenuId,
    setRenamingFolderId,
    setRenamingFolderName,
    setDragFolderId,
    setDragOverFolderId,
    setDraggedQId,
    setDragQOverFolderId,
    setInlineFolderParentId,
    setInlineFolderName,
    setActiveTabId,
    setAssignments,
    setShareTarget,
    setArchiveFolder,
    setDeleteItem,
    toggleFolderExpand,
    handleFolderRename,
    handleReorderFolders,
    handleInlineFolderCreate,
    cancelInlineFolder,
    inlineFolderIsQSet,
    setInlineFolderIsQSet
  };
  const renderHeader = () =>
  <div
    style={{
      borderBottom: `1px solid ${bdr}`,
      background: 'white',
      flexShrink: 0
    }}>
    
      <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 44,
        padding: '0 16px',
        gap: 8
      }}>
      
        <button
        onClick={toggleLeft}
        title={leftOpen ? 'Close library' : 'Open library'}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: mfg,
          padding: '4px 6px',
          borderRadius: 4,
          display: 'flex',
          flexShrink: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = fg}
        onMouseLeave={(e) => e.currentTarget.style.color = mfg}>
        
          <i
          className="fa-light fa-sidebar"
          style={{
            fontSize: 15,
            lineHeight: 1
          }} />
        
        </button>
        <span
        style={{
          width: 1,
          height: 16,
          background: bdr,
          flexShrink: 0
        }} />
      
        <span
        style={{
          fontSize: 13,
          color: mfg,
          fontWeight: 400
        }}>
        
          Question Bank
        </span>
        {selectedFolder &&
      <>
            <i
          className="fa-regular fa-chevron-right"
          style={{
            fontSize: 10,
            color: mfg,
            flexShrink: 0
          }} />
        
            <span
          style={{
            fontSize: 13,
            color: fg,
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 200
          }}>
          
              {folders.find((f) => f.id === selectedFolder)?.name}
            </span>
          </>
      }
        <div
        style={{
          flex: 1
        }} />
      
        <div
        style={{
          position: 'relative'
        }}>
        
          <button
          onClick={(e) => {
            e.stopPropagation();
            setPersonaMenuOpen((o) => !o);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 8px 4px 4px',
            borderRadius: 8,
            border: `1px solid ${personaMenuOpen ? bdr : 'transparent'}`,
            background: personaMenuOpen ? 'var(--accent)' : 'transparent',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) =>
          e.currentTarget.style.background = 'var(--accent)'
          }
          onMouseLeave={(e) =>
          e.currentTarget.style.background = personaMenuOpen ?
          'var(--accent)' :
          'transparent'
          }>
          
            <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: activePersona.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
            
              <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: 'white',
                letterSpacing: '0.02em'
              }}>
              
                {activePersona.initials}
              </span>
            </div>
            <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: fg
            }}>
            
              {activePersona.name}
            </span>
            <span
            style={{
              fontSize: 9,
              color: mfg,
              padding: '1px 5px',
              borderRadius: 4,
              background: 'var(--surface)',
              fontWeight: 600
            }}>
            
              {activePersona.role === 'dept-head' ? 'Admin' : 'Faculty'}
            </span>
            <i
            className="fa-regular fa-chevron-down"
            style={{
              fontSize: 9,
              color: mfg
            }} />
          
          </button>
          {personaMenuOpen &&
        <>
              <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9997
            }}
            onClick={() => setPersonaMenuOpen(false)} />
          
              <div
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 4px)',
              zIndex: 9999,
              background: 'var(--card)',
              border: `1px solid ${bdr}`,
              borderRadius: 10,
              boxShadow: '0 4px 20px rgba(0,0,0,0.13)',
              minWidth: 240,
              overflow: 'hidden',
              paddingBottom: 4
            }}>
            
                <div
              style={{
                padding: '10px 12px 8px',
                fontSize: 10,
                fontWeight: 700,
                color: mfg,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                borderBottom: `1px solid ${bdr}`,
                marginBottom: 4
              }}>
              
                  Switch persona
                </div>
                {PERSONAS.map((p) => {
              const isActive = p.id === activePersonaId;
              const isWells = p.id === 'dr-wells';
              const tl = p.trustLevel;
              const tlColor =
              tl === 'senior' ?
              '#059669' :
              tl === 'mid' ?
              '#2563eb' :
              '#94a3b8';
              const tlBg =
              tl === 'senior' ?
              '#dcfce7' :
              tl === 'mid' ?
              '#dbeafe' :
              '#f1f5f9';
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePersonaId(p.id);
                    setPersonaMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 12px',
                    width: '100%',
                    background: isActive ?
                    `color-mix(in oklch,${br} 6%,white)` :
                    'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) =>
                  e.currentTarget.style.background = 'var(--accent)'
                  }
                  onMouseLeave={(e) =>
                  e.currentTarget.style.background = isActive ?
                  `color-mix(in oklch,${br} 6%,white)` :
                  'none'
                  }>
                  
                      <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: p.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                    
                        <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: 'white'
                      }}>
                      
                          {p.initials}
                        </span>
                      </div>
                      <div
                    style={{
                      flex: 1,
                      minWidth: 0
                    }}>
                    
                        <div
                      style={{
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 400,
                        color: fg,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                      
                          {p.name}
                          <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: 3,
                          background: tlBg,
                          color: tlColor
                        }}>
                        
                            {tl.toUpperCase()}
                          </span>
                        </div>
                        <div
                      style={{
                        fontSize: 10,
                        color: mfg
                      }}>
                      
                          {p.role === 'dept-head' ?
                      'Department Admin' :
                      'Faculty'}
                          {isWells && !facultyAssignments['Dr. Wells']?.length ?
                      ' · No access yet' :
                      ''}
                        </div>
                      </div>
                      {isActive &&
                  <i
                    className="fa-solid fa-check"
                    style={{
                      fontSize: 10,
                      color: br,
                      flexShrink: 0
                    }} />

                  }
                    </button>);

            })}
                {/* Trust level legend */}
                <div
              style={{
                padding: '8px 12px 4px',
                borderTop: `1px solid ${bdr}`,
                marginTop: 4,
                fontSize: 10,
                color: mfg,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.07em'
              }}>
              
                  Trust Levels
                </div>
                <div
              style={{
                display: 'flex',
                gap: 6,
                padding: '6px 12px 12px'
              }}>
              
                  {[
              {
                l: 'Senior',
                c: '#059669',
                bg: '#dcfce7',
                d: 'Peer-reviewed'
              },
              {
                l: 'Mid',
                c: '#2563eb',
                bg: '#dbeafe',
                d: 'Active contributor'
              },
              {
                l: 'Junior',
                c: '#94a3b8',
                bg: '#f1f5f9',
                d: 'New contributor'
              }].
              map(({ l, c, bg, d }) =>
              <div
                key={l}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '5px 3px',
                  borderRadius: 6,
                  background: bg
                }}>
                
                      <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: c,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                  
                        {l}
                      </div>
                      <div
                  style={{
                    fontSize: 9,
                    color: c,
                    opacity: 0.75,
                    marginTop: 1
                  }}>
                  
                        {d}
                      </div>
                    </div>
              )}
                </div>
              </div>
            </>
        }
        </div>
        <div
        style={{
          width: 8
        }} />
      
        <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 12px',
          borderRadius: 20,
          border: '1.5px solid #e879f9',
          background: 'white',
          color: '#a21caf',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 600,
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.background = '#fdf4ff';
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.background = 'white';
        }}>
        
          <i
          className="fa-regular fa-sparkles"
          style={{
            fontSize: 11,
            lineHeight: 1,
            color: '#e879f9'
          }} />
        {' '}
          Ask Leo
        </button>
      </div>
    </div>;

  const _ctx = {
    liveFolderCounts,
    liveViewCounts,
    COURSE_CREATE_SENTINEL,
    CURRENT_USER,
    activeIsHidden,
    activeTabId,
    addToFolderOpen,
    adminAssignOpen,
    allSelectedPinned,
    allValues,
    archiveFolder,
    assignedFolderIds,
    autoCollectOpen,
    availableSemesters,
    br,
    bdr,
    mfg,
    cancelInlineFolder,
    setInlineFolderIsQSet,
    chevronHoverId,
    collaborateOpen,
    createSVOpen,
    crossDeptBlockQ,
    deleteItem,
    editImpactQ,
    editSV,
    facultyAccessMap,
    facultyAccessibleFolderIds,
    facultyAssignments,
    facultyCourseNames,
    facultyStatusFilterMap,
    fg,
    fieldFilters,
    fieldIcon,
    filterFieldOpen,
    filterFields,
    filterSheetOpen,
    filteredQuestions,
    folderRowCtx,
    folderYearFilter,
    folders,
    handleAutoCollect,
    handleCreateSV,
    handleDeleteTab,
    handleInlineFolderCreate,
    handleSaveAsView,
    headerMenuOpen,
    headerMenuPos,
    hiddenTabs,
    hoverTabId,
    importOpen,
    inlineFolderName,
    inlineFolderParentId,
    inlineInputRef,
    isAdmin,
    isFaculty,
    isSenior,
    leftOpen,
    moreOptionsOpen,
    moreOptionsPos,
    moveTab,
    myQuestionsCount,
    newQuestionOpen,
    overflowOpen,
    questionAccessMap,
    removeFilter,
    renamingTabId,
    renamingTabName,
    renderHeader,
    requestEditId,
    rootCourseFolders,
    rootQBFolders,
    rootQSetFolders,
    rowCtx,
    rowPanel,
    saveTabRename,
    searchOpen,
    searchText,
    sectionOverlapQ,
    selected,
    selectedFolder,
    selectedFolderIsLifetimeRepo,
    selectedQForFolder,
    setActiveTabId,
    setAddToFolderOpen,
    setAdminAssignOpen,
    setArchiveFolder,
    setAssignments,
    setAutoCollectOpen,
    setChevronHoverId,
    setCollaborateOpen,
    setCreateSVOpen,
    setCrossDeptBlockQ,
    setDeleteItem,
    setEditImpactQ,
    setEditSV,
    setExportOpen,
    setFacultyAccessMap,
    setFacultyAssignments,
    setFacultyStatusFilterMap,
    setFieldFilters,
    setFilterFieldOpen,
    setFilterSheetOpen,
    setFolderMenuId,
    setFolderYearFilter,
    setFolders,
    setHeaderMenuOpen,
    setHeaderMenuPos,
    setHoverTabId,
    setImportOpen,
    setInlineFolderName,
    setInlineFolderParentId,
    setMoreOptionsOpen,
    setMoreOptionsPos,
    setNewQuestionOpen,
    setOverflowOpen,
    setPersonaMenuOpen,
    setPinnedQIds,
    setQuestionAccessMap,
    setQuestions,
    setRenamingTabId,
    setRenamingTabName,
    setRequestEditId,
    setRowMenuId,
    setRowMenuPos,
    setRowPanel,
    setSearchOpen,
    setSearchText,
    setSectionOverlapQ,
    setSelected,
    setSelectedFolder,
    setSelectedQForFolder,
    setShareQId,
    setShareTarget,
    setShortlistedQIds,
    setShowOnlyShortlisted,
    setTabCtxMenu,
    setTransferCourseOnly,
    setVersionMenuPos,
    setVersionPopoverId,
    setViews,
    shareQId,
    shareTarget,
    showOnboarding,
    showOnlyShortlisted,
    tabBarWrapRef,
    tabCtxMenu,
    toQRowData,
    transferCourseOnly,
    views,
    visibleTabs,
    questions,
    PERSONAS,
    personaTrustLevels
  };
  return <QBView {..._ctx} />;
}