import React, { useState, useRef, Fragment } from 'react';
import { ImportWizardModal } from './ImportWizard';
import { NewQuestionModal } from './NewQuestionModal';
import { QuestionRowPanel } from './QuestionRowPanel';
import {
  CreateSmartViewModal,
  EditSmartViewModal,
  ArchiveConfirmModal,
  DeleteConfirmModal,
  ShareFolderModal,
  AddToFolderModal } from
'./QBModals';
import { FilterSheet } from './QBFilterSheet';
import { ShareQuestionModal } from './ShareQuestionModal';
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
import { StatusBadge, TypeBadge, DiffBadge, PBisCell } from './QBHelpers';
import type { Question, FolderNode, SVItem } from './QBData';
import { QBViewMain } from './QBViewMain';
import { QBViewModals } from './QBViewModals';
function ReviewViewModal({
  isOpen,
  onClose,
  tabId,
  views,
  questions,
  fg,
  bdr,
  mfg,
  br
}: any) {
  if (!isOpen || !tabId) return null;
  const sv = views.find((v: any) => v.id === tabId);
  const name =
  sv?.name ?? (
  tabId === 'qa-all' ?
  'All Questions' :
  tabId === 'qa-my' ?
  'My Questions' :
  tabId);
  let filtered = [...questions].filter(
    (q: any) => !(q.tags || []).includes('private')
  );
  if (sv?.criteria) {
    const c = sv.criteria;
    if (c.difficulties?.length)
    filtered = filtered.filter((q: any) =>
    c.difficulties.includes(q.difficulty || '')
    );
    if (c.types?.length)
    filtered = filtered.filter((q: any) => c.types.includes(q.type || ''));
    if (c.tags?.length)
    filtered = filtered.filter((q: any) =>
    c.tags.some((t: string) => (q.tags || []).includes(t))
    );
  }
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)'
      }}
      onClick={onClose}>
      
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 14,
          padding: 0,
          width: 680,
          maxHeight: '86vh',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.22)',
          display: 'flex',
          flexDirection: 'column'
        }}>
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '18px 24px 14px',
            borderBottom: `1px solid ${bdr}`
          }}>
          
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: `color-mix(in oklch,${br} 10%,white)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
            
            <i
              className="fa-regular fa-clipboard-list"
              style={{
                fontSize: 14,
                color: br
              }} />
            
          </div>
          <div
            style={{
              flex: 1
            }}>
            
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: fg
              }}>
              
              Review View: {name}
            </div>
            <div
              style={{
                fontSize: 12,
                color: mfg,
                marginTop: 1
              }}>
              
              {filtered.length} question{filtered.length !== 1 ? 's' : ''} in
              this view
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: mfg,
              padding: 4,
              display: 'flex',
              borderRadius: 6
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = fg}
            onMouseLeave={(e) => e.currentTarget.style.color = mfg}>
            
            <i
              className="fa-regular fa-xmark"
              style={{
                fontSize: 16
              }} />
            
          </button>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: 'auto'
          }}>
          
          {filtered.length === 0 ?
          <div
            style={{
              padding: '40px 24px',
              textAlign: 'center',
              color: mfg
            }}>
            
              <i
              className="fa-regular fa-inbox"
              style={{
                fontSize: 28,
                marginBottom: 12,
                display: 'block',
                opacity: 0.4
              }} />
            
              <div
              style={{
                fontSize: 13
              }}>
              
                No questions in this view
              </div>
            </div> :

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
            
              <thead>
                <tr
                style={{
                  background: '#f8fafc'
                }}>
                
                  {['#', 'Question', 'Status', 'Difficulty', 'Creator'].map(
                  (h, i) =>
                  <th
                    key={i}
                    style={{
                      padding: '8px 14px',
                      textAlign: 'left',
                      fontSize: 10,
                      fontWeight: 700,
                      color: mfg,
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      borderBottom: `1px solid ${bdr}`,
                      whiteSpace: 'nowrap'
                    }}>
                    
                        {h}
                      </th>

                )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((q: any, i: number) =>
              <tr
                key={q.id}
                style={{
                  borderBottom: `1px solid ${bdr}`
                }}
                onMouseEnter={(e) =>
                (
                e.currentTarget as HTMLTableRowElement).
                style.background = '#f8fafc'
                }
                onMouseLeave={(e) =>
                (
                e.currentTarget as HTMLTableRowElement).
                style.background = 'white'
                }>
                
                    <td
                  style={{
                    padding: '8px 14px',
                    fontSize: 11,
                    color: mfg,
                    fontWeight: 600
                  }}>
                  
                      {i + 1}
                    </td>
                    <td
                  style={{
                    padding: '8px 14px',
                    maxWidth: 260
                  }}>
                  
                      <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: fg,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                    
                        {q.title}
                      </div>
                      <div
                    style={{
                      fontSize: 10,
                      color: mfg,
                      marginTop: 1,
                      fontFamily: 'var(--font-mono)'
                    }}>
                    
                        {q.code}
                      </div>
                    </td>
                    <td
                  style={{
                    padding: '8px 14px'
                  }}>
                  
                      <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: 5,
                      background:
                      q.status === 'Saved' ?
                      '#ccfbf1' :
                      '#f1f5f9',
                      color:
                      q.status === 'Saved' ?
                      '#0f766e' :
                      '#475569'
                    }}>
                    
                        {q.status}
                      </span>
                    </td>
                    <td
                  style={{
                    padding: '8px 14px'
                  }}>
                  
                      <span
                    style={{
                      fontSize: 11,
                      padding: '2px 7px',
                      borderRadius: 5,
                      background: '#f1f5f9',
                      color: '#475569',
                      fontWeight: 500
                    }}>
                    
                        {q.difficulty ?? '—'}
                      </span>
                    </td>
                    <td
                  style={{
                    padding: '8px 14px',
                    fontSize: 12,
                    color: fg
                  }}>
                  
                      {q.creator || q.collaborator || '—'}
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          }
        </div>
        <div
          style={{
            borderTop: `1px solid ${bdr}`,
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            background: '#f8fafc'
          }}>
          
          <button
            onClick={onClose}
            style={{
              padding: '7px 18px',
              borderRadius: 7,
              border: `1px solid ${bdr}`,
              background: 'white',
              color: fg,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500
            }}>
            
            Close
          </button>
        </div>
      </div>
    </div>);

}
// ── CaretTooltip — consistent tooltip with arrow pointer ──
// Uses position:fixed computed from element rect so overflow:hidden parents don't clip it.
function CaretTooltip({
  text,
  children,
  side = 'top'




}: {text: string;children: React.ReactNode;side?: 'top' | 'bottom' | 'left' | 'right';}) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const handleEnter = (e: React.MouseEvent<HTMLSpanElement>) =>
  setRect(e.currentTarget.getBoundingClientRect());
  const handleLeave = () => setRect(null);
  const bubbleStyle: React.CSSProperties = rect ?
  {
    position: 'fixed',
    zIndex: 99999,
    background: 'var(--foreground)',
    color: 'white',
    fontSize: 11,
    fontWeight: 500,
    padding: '5px 9px',
    borderRadius: 6,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.22)',
    ...(side === 'top' ?
    {
      left: rect.left + rect.width / 2,
      top: rect.top - 8,
      transform: 'translateX(-50%) translateY(-100%)'
    } :
    {}),
    ...(side === 'bottom' ?
    {
      left: rect.left + rect.width / 2,
      top: rect.bottom + 8,
      transform: 'translateX(-50%)'
    } :
    {}),
    ...(side === 'left' ?
    {
      left: rect.left - 8,
      top: rect.top + rect.height / 2,
      transform: 'translateX(-100%) translateY(-50%)'
    } :
    {}),
    ...(side === 'right' ?
    {
      left: rect.right + 8,
      top: rect.top + rect.height / 2,
      transform: 'translateY(-50%)'
    } :
    {})
  } :
  {};
  const caretStyle: React.CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
    ...(side === 'top' ?
    {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: '5px solid var(--foreground)'
    } :
    {}),
    ...(side === 'bottom' ?
    {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderBottom: '5px solid var(--foreground)'
    } :
    {}),
    ...(side === 'left' ?
    {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      borderTop: '5px solid transparent',
      borderBottom: '5px solid transparent',
      borderLeft: '5px solid var(--foreground)'
    } :
    {}),
    ...(side === 'right' ?
    {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      borderTop: '5px solid transparent',
      borderBottom: '5px solid transparent',
      borderRight: '5px solid var(--foreground)'
    } :
    {})
  };
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center'
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}>
      
      {children}
      {rect &&
      <span style={bubbleStyle}>
          {text}
          <span style={caretStyle} />
        </span>
      }
    </span>);

}
export function QBView(p: any) {
  const [reviewViewOpen, setReviewViewOpen] = useState(false);
  const [reviewViewTabId, setReviewViewTabId] = useState<string | null>(null);
  const {
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
    inlineFolderIsQSet,
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
    liveFolderCounts,
    liveViewCounts
  } = p;
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        background: 'white',
        position: 'relative',
        flexDirection: 'column'
      }}
      onClick={() => {
        setFolderMenuId(null);
        setRowMenuId(null);
        setRowMenuPos(null);
        setVersionPopoverId(null);
        setVersionMenuPos(null);
        setTabCtxMenu(null);
        setOverflowOpen(false);
        setFilterFieldOpen(false);
        setPersonaMenuOpen(false);
        setMoreOptionsOpen(false);
      }}>
      
      {renderHeader()}

      <div
        style={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          background: 'white'
        }}>
        
        {/* ── LEFT SIDEBAR ── */}
        {leftOpen &&
        <div
          style={{
            width: 248,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            background: 'white',
            overflow: 'hidden',
            borderRight: `1px solid ${bdr}`
          }}>
          
            <div
            style={{
              padding: '0 12px',
              height: 40,
              borderBottom: `1px solid ${bdr}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}>
            
              <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: mfg,
                textTransform: 'uppercase',
                letterSpacing: '0.07em'
              }}>
              
                Library
              </span>
            </div>

            {/* All Questions */}
            <div
            style={{
              padding: '6px 8px',
              borderBottom: `1px solid ${bdr}`,
              flexShrink: 0
            }}>
            
              {[
            {
              id: 'qa-all',
              label: 'All Questions',
              faIcon: 'book-open',
              count: questions.filter(
                (q: any) => !(q.tags || []).includes('private')
              ).length
            }].
            map((item: any) => {
              const isA = activeTabId === item.id && !selectedFolder;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedFolder(null);
                    setActiveTabId(item.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '7px 8px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    marginBottom: 1,
                    background: isA ?
                    `color-mix(in oklch,${br} 8%,white)` :
                    'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isA)
                    e.currentTarget.style.background = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isA) e.currentTarget.style.background = 'transparent';
                  }}>
                  
                    <i
                    className={`${isA ? 'fa-solid' : 'fa-regular'} fa-${item.faIcon}`}
                    style={{
                      fontSize: 13,
                      color: isA ? br : mfg,
                      lineHeight: 1
                    }} />
                  
                    <span
                    style={{
                      flex: 1,
                      fontSize: 12,
                      fontWeight: isA ? 600 : 400,
                      color: isA ? br : fg
                    }}>
                    
                      {item.label}
                    </span>
                    <span
                    style={{
                      fontSize: 11,
                      color: mfg
                    }}>
                    
                      {item.count}
                    </span>
                  </div>);

            })}
              {/* My Questions — persistent quick-access below All Questions */}
              {(() => {
              const isA = activeTabId === 'qa-my' && !selectedFolder;
              const count = p.myQuestionsCount ?? 0;
              return (
                <div
                  onClick={() => {
                    setSelectedFolder(null);
                    setActiveTabId('qa-my');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '7px 8px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    marginBottom: 1,
                    background: isA ?
                    `color-mix(in oklch,${br} 8%,white)` :
                    'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isA)
                    (e.currentTarget as HTMLDivElement).style.background =
                    'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isA)
                    (e.currentTarget as HTMLDivElement).style.background =
                    'transparent';
                  }}>
                  
                    <i
                    className={`${isA ? 'fa-solid' : 'fa-regular'} fa-user`}
                    style={{
                      fontSize: 13,
                      color: isA ? br : mfg,
                      lineHeight: 1
                    }} />
                  
                    <span
                    style={{
                      flex: 1,
                      fontSize: 12,
                      fontWeight: isA ? 600 : 400,
                      color: isA ? br : fg
                    }}>
                    
                      My Questions
                    </span>
                    <span
                    style={{
                      fontSize: 11,
                      color: mfg
                    }}>
                    
                      {count}
                    </span>
                  </div>);

            })()}
            </div>

            <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '6px 8px'
            }}>
            

              {/* Question Sets section */}
              {rootQSetFolders && rootQSetFolders.length > 0 &&
            <>
                  <div
                style={{
                  padding: '6px 8px 5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                
                    <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    color: mfg
                  }}>
                  
                      Question Sets
                    </span>
                  </div>
                  {rootQSetFolders.map((f: any) => {
                const isA = selectedFolder === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => {
                      setSelectedFolder(f.id);
                      setActiveTabId('qa-all');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 8px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      marginBottom: 2,
                      background: isA ?
                      `color-mix(in oklch,#2563eb 10%,white)` :
                      'transparent',
                      borderLeft: isA ?
                      '3px solid #2563eb' :
                      '3px solid transparent',
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isA)
                      (
                      e.currentTarget as HTMLDivElement).
                      style.background = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isA)
                      (
                      e.currentTarget as HTMLDivElement).
                      style.background = 'transparent';
                    }}>
                    
                        <i
                      className="fa-regular fa-rectangle-list"
                      style={{
                        fontSize: 12,
                        color: isA ? '#2563eb' : '#64748b',
                        lineHeight: 1,
                        flexShrink: 0
                      }} />
                    
                        <span
                      style={{
                        flex: 1,
                        fontSize: 12,
                        fontWeight: isA ? 600 : 400,
                        color: isA ? '#1d4ed8' : fg,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                      
                          {f.name}
                        </span>
                        {f.collaborators?.length > 0 &&
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: 2
                      }}
                      title={`Collaborators: ${f.collaborators.join(', ')}`}>
                      
                            {f.collaborators.
                      slice(0, 3).
                      map((name: string, ci: number) => {
                        const initials = name.
                        split(' ').
                        map((w: string) => w[0]).
                        join('').
                        slice(0, 2).
                        toUpperCase();
                        const colors = [
                        '#0891b2',
                        '#059669',
                        '#d97706',
                        '#dc2626',
                        '#0f766e'];

                        return (
                          <div
                            key={ci}
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              background: colors[ci % colors.length],
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1.5px solid white',
                              marginLeft: ci > 0 ? -5 : 0,
                              flexShrink: 0
                            }}>
                            
                                    <span
                              style={{
                                fontSize: 7,
                                fontWeight: 700,
                                color: 'white'
                              }}>
                              
                                      {initials}
                                    </span>
                                  </div>);

                      })}
                            {f.collaborators.length > 3 &&
                      <span
                        style={{
                          fontSize: 9,
                          color: mfg,
                          marginLeft: 3
                        }}>
                        
                                +{f.collaborators.length - 3}
                              </span>
                      }
                          </div>
                    }
                        <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        padding: '1px 4px',
                        borderRadius: 3,
                        background: '#dbeafe',
                        color: '#1d4ed8',
                        flexShrink: 0
                      }}>
                      
                          SET
                        </span>
                        <span
                      style={{
                        fontSize: 11,
                        color: isA ? '#1d4ed8' : mfg,
                        marginLeft: 2
                      }}>
                      
                          {liveFolderCounts && f.id in liveFolderCounts ? liveFolderCounts[f.id] : f.count}
                        </span>
                      </div>);

              })}
                  <div
                style={{
                  borderTop: `1px solid ${bdr}`,
                  margin: '6px 0'
                }} />
              
                </>
            }

              {/* Folders / Question Banks section */}
              <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px 5px'
              }}>
              
                <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  color: mfg
                }}>
                
                  Folders
                </span>
                {(isAdmin || isFaculty) &&
              <button
                onClick={() => {
                  setInlineFolderParentId(null);
                  setInlineFolderName('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: mfg,
                  padding: 2,
                  borderRadius: 4,
                  display: 'flex'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = fg}
                onMouseLeave={(e) => e.currentTarget.style.color = mfg}>
                
                    <CaretTooltip text="New folder" side="top">
                      <i
                    className="fa-regular fa-plus"
                    style={{
                      fontSize: 12,
                      lineHeight: 1
                    }} />
                  
                    </CaretTooltip>
                  </button>
              }
              </div>
              {isAdmin || isFaculty ?
            <>
                  {/* Inline input appears immediately below section header when + is clicked */}
                  <InlineFolderInput
                parentId={null}
                depth={0}
                activePid={inlineFolderParentId}
                name={inlineFolderName}
                onSetName={setInlineFolderName}
                onConfirm={handleInlineFolderCreate}
                onCancel={cancelInlineFolder}
                inputRef={inlineInputRef}
                br={inlineFolderIsQSet ? '#2563eb' : br}
                fg={fg}
                mfg={mfg} />
              
                  {rootQBFolders.map((f: any) =>
              <AdminFolderRow key={f.id} f={f} ctx={folderRowCtx} />
              )}
                  {rootCourseFolders.length > 0 &&
              <>
                      <div
                  style={{
                    borderTop: `1px solid ${bdr}`,
                    margin: '6px 0'
                  }} />
                
                      <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '2px 8px 6px'
                  }}>
                  
                        <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      color: mfg
                    }}>
                    
                          Courses
                        </span>
                        <button
                    onClick={() => {
                      setInlineFolderParentId(COURSE_CREATE_SENTINEL);
                      setInlineFolderName('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: mfg,
                      padding: 2,
                      borderRadius: 4,
                      display: 'flex'
                    }}
                    onMouseEnter={(e) =>
                    e.currentTarget.style.color = fg
                    }
                    onMouseLeave={(e) =>
                    e.currentTarget.style.color = mfg
                    }>
                    
                          <CaretTooltip text="New Course" side="top">
                            <i
                        className="fa-regular fa-plus"
                        style={{
                          fontSize: 12,
                          lineHeight: 1
                        }} />
                      
                          </CaretTooltip>
                        </button>
                      </div>
                      {/* Courses inline input appears right below the Courses header */}
                      <InlineFolderInput
                  parentId={COURSE_CREATE_SENTINEL}
                  depth={0}
                  activePid={inlineFolderParentId}
                  name={inlineFolderName}
                  onSetName={setInlineFolderName}
                  onConfirm={handleInlineFolderCreate}
                  onCancel={cancelInlineFolder}
                  inputRef={inlineInputRef}
                  br={br}
                  fg={fg}
                  mfg={mfg} />
                
                      {rootCourseFolders.map((f: any) =>
                <AdminFolderRow key={f.id} f={f} ctx={folderRowCtx} />
                )}
                    </>
              }
                </> :
            isFaculty && facultyAccessibleFolderIds.size === 0 ?
            <div
              style={{
                padding: '24px 12px',
                textAlign: 'center',
                color: mfg,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6
              }}>
              
                  <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'var(--surface)',
                  border: `1px solid ${bdr}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 4
                }}>
                
                    <i
                  className="fa-regular fa-folder-open"
                  style={{
                    fontSize: 20,
                    color: mfg,
                    opacity: 0.4
                  }} />
                
                  </div>
                  <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: fg
                }}>
                
                    No folders yet
                  </div>
                  <div
                style={{
                  fontSize: 12,
                  color: mfg,
                  lineHeight: 1.5,
                  maxWidth: 160
                }}>
                
                    Your department admin hasn't shared any folders with you.
                  </div>
                </div> :

            rootQBFolders.
            filter((f: any) => facultyAccessibleFolderIds.has(f.id)).
            map((f: any) =>
            <FacultyFolderRow key={f.id} f={f} ctx={folderRowCtx} />
            )
            }

            </div>
          </div>
        }
        <QBViewMain {...p} />
      </div>

      {/* ── BULK ACTION BAR ── */}
      {selected.size > 0 &&
      <div
        style={{
          position: 'absolute',
          bottom: 44,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--foreground)',
          color: 'white',
          borderRadius: 10,
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          boxShadow: '0 4px 24px rgba(0,0,0,0.22)',
          zIndex: 50,
          userSelect: 'none'
        }}>
        
          <span
          style={{
            fontWeight: 600,
            fontSize: 12,
            marginRight: 8,
            color: 'rgba(255,255,255,0.65)'
          }}>
          
            {selected.size} selected
          </span>
          {(isFaculty ?
        [
        allSelectedPinned ?
        {
          icon: 'thumbtack',
          label: 'Unfix',
          action: () => {
            selected.forEach((id: string) =>
            setPinnedQIds((prev: Set<string>) => {
              const n = new Set(prev);
              n.delete(id);
              return n;
            })
            );
          }
        } :
        {
          icon: 'thumbtack',
          label: 'Fix',
          action: () => {
            selected.forEach((id: string) =>
            setPinnedQIds((prev: Set<string>) => {
              const n = new Set(prev);
              n.add(id);
              return n;
            })
            );
          }
        },
        {
          icon: 'flag',
          label: 'Flag',
          action: () => {}
        },
        {
          icon: 'copy',
          label: 'Save as Copy',
          action: () => {}
        }] :

        [
        allSelectedPinned ?
        {
          icon: 'thumbtack',
          label: 'Unfix',
          action: () => {
            selected.forEach((id: string) =>
            setPinnedQIds((prev: Set<string>) => {
              const n = new Set(prev);
              n.delete(id);
              return n;
            })
            );
          }
        } :
        {
          icon: 'thumbtack',
          label: 'Fix',
          action: () => {
            selected.forEach((id: string) =>
            setPinnedQIds((prev: Set<string>) => {
              const n = new Set(prev);
              n.add(id);
              return n;
            })
            );
          }
        },
        {
          icon: 'folder-plus',
          label: 'Add to Folder',
          action: () => setAddToFolderOpen(true)
        },
        {
          icon: 'flag',
          label: 'Flag',
          action: () => {}
        },
        ...(isSenior && activeTabId === 'sv-pending' ?
        [
        {
          icon: 'circle-check',
          label: 'Approve',
          action: () => {
            setQuestions((prev: any[]) =>
            prev.map((q: any) =>
            [...selected].includes(q.id) ?
            {
              ...q,
              status: 'Approved'
            } :
            q
            )
            );
            setSelected(new Set());
          },
          success: true
        }] :

        []),
        {
          icon: 'circle-check',
          label: 'Reviewed',
          action: () => {}
        },
        {
          icon: 'box-archive',
          label: 'Archive',
          action: () => {}
        },
        {
          icon: 'trash-can',
          label: 'Delete',
          action: () => {},
          danger: true
        }]).

        map((item: any, i: number) =>
        <button
          key={i}
          onClick={item.action}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 10px',
            borderRadius: 6,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: (item as any).danger ?
            '#fca5a5' :
            (item as any).success ?
            '#86efac' :
            'white',
            fontSize: 12
          }}
          onMouseEnter={(e) =>
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
          }
          onMouseLeave={(e) =>
          e.currentTarget.style.background = 'transparent'
          }>
          
              <i
            className={`fa-regular fa-${item.icon}`}
            style={{
              fontSize: 13,
              lineHeight: 1,
              transform:
              item.icon === 'thumbtack' ? 'rotate(45deg)' : 'none'
            }} />
          
              {item.label}
            </button>
        )}
          <button
          onClick={() => setSelected(new Set())}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.55)',
            padding: 4,
            borderRadius: 4,
            display: 'flex',
            marginLeft: 4
          }}>
          
            <i
            className="fa-regular fa-xmark"
            style={{
              fontSize: 14,
              lineHeight: 1
            }} />
          
          </button>
        </div>
      }

      {/* ── TAB CONTEXT MENU ── */}
      {tabCtxMenu &&
      <>
          <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998
          }}
          onClick={() => setTabCtxMenu(null)} />
        
          <div
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            left: tabCtxMenu.x,
            top: tabCtxMenu.y,
            zIndex: 9999,
            background: 'var(--card)',
            border: `1px solid ${bdr}`,
            borderRadius: 8,
            boxShadow: '0 4px 20px rgba(0,0,0,0.13)',
            minWidth: 200,
            overflow: 'hidden',
            paddingTop: 4,
            paddingBottom: 4
          }}>
          
            {(() => {
            const sv = views.find((v: any) => v.id === tabCtxMenu.id);
            const idx = views.findIndex((v: any) => v.id === tabCtxMenu.id);
            const canLeft = idx > 0,
              canRight = idx < views.length - 1;
            const isAdminView = sv?.isAdminView === true;
            const viewTypeLabel = sv?.autoUpdate ? 'Smart view' : 'Table view';
            const menuItems: (
            {
              icon: string;
              label: string;
              action: () => void;
              danger?: boolean;
              locked?: boolean;
            } |
            'divider' |
            'header')[] =
            [
            'header' as const,
            isAdminView ?
            {
              icon: 'lock',
              label: 'Rename (admin view)',
              action: () => {},
              locked: true
            } :
            {
              icon: 'pen',
              label: 'Rename',
              action: () => {
                setRenamingTabId(tabCtxMenu.id);
                setRenamingTabName(sv?.name || '');
                setTabCtxMenu(null);
              }
            },
            isAdminView ?
            {
              icon: 'lock',
              label: 'Edit criteria (admin view)',
              action: () => {},
              locked: true
            } :
            {
              icon: 'sliders',
              label: 'Edit criteria',
              action: () => {
                if (sv) setEditSV(sv);
                setTabCtxMenu(null);
              }
            },
            ...(canLeft || canRight ? ['divider' as const] : []),
            ...(canLeft ?
            [
            {
              icon: 'arrow-left',
              label: 'Move left',
              action: () => moveTab(tabCtxMenu.id, -1)
            } as const] :

            []),
            ...(canRight ?
            [
            {
              icon: 'arrow-right',
              label: 'Move right',
              action: () => moveTab(tabCtxMenu.id, +1)
            } as const] :

            []),
            ...(canLeft || canRight ? ['divider' as const] : []),
            {
              icon: 'copy',
              label: 'Duplicate',
              action: () => {
                if (sv) {
                  const ns: SVItem = {
                    ...sv,
                    id: `sv-dup-${Date.now()}`,
                    name: `${sv.name} (copy)`,
                    personal: isFaculty
                  };
                  setViews((p: any) => {
                    const i = p.findIndex((v: any) => v.id === sv.id);
                    const r = [...p];
                    r.splice(i + 1, 0, ns);
                    return r;
                  });
                }
                setTabCtxMenu(null);
              }
            },
            {
              icon: 'clipboard-list',
              label: 'Review view',
              action: () => {
                setReviewViewOpen(true);
                setReviewViewTabId(tabCtxMenu.id);
                setTabCtxMenu(null);
              }
            },
            'divider',
            isAdminView ?
            {
              icon: 'lock',
              label: 'Remove (admin view)',
              action: () => {},
              locked: true,
              danger: false
            } :
            {
              icon: 'trash-can',
              label: 'Remove view',
              action: () => {
                handleDeleteTab(tabCtxMenu.id);
                setTabCtxMenu(null);
              },
              danger: true
            }];

            return menuItems.map((item, i) => {
              if (item === 'header')
              return (
                <div
                  key={i}
                  style={{
                    padding: '5px 12px 6px',
                    fontSize: 11,
                    color: mfg,
                    borderBottom: `1px solid ${bdr}`,
                    marginBottom: 2
                  }}>
                  
                      View: {viewTypeLabel}
                    </div>);

              if (item === 'divider')
              return (
                <div
                  key={i}
                  style={{
                    borderTop: `1px solid ${bdr}`,
                    margin: '4px 0'
                  }} />);


              const it = item as {
                icon: string;
                label: string;
                action: () => void;
                danger?: boolean;
                locked?: boolean;
              };
              const col = it.locked ? '#94a3b8' : it.danger ? '#ef4444' : fg;
              const icol = it.locked ? '#94a3b8' : it.danger ? '#ef4444' : mfg;
              return (
                <button
                  key={i}
                  onClick={it.locked ? undefined : it.action}
                  title={
                  it.locked ?
                  'Set by department admin — cannot be modified' :
                  undefined
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '7px 14px',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: it.locked ? 'not-allowed' : 'pointer',
                    color: col,
                    fontSize: 12,
                    textAlign: 'left',
                    opacity: it.locked ? 0.55 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!it.locked)
                    e.currentTarget.style.background = 'var(--accent)';
                  }}
                  onMouseLeave={(e) =>
                  e.currentTarget.style.background = 'none'
                  }>
                  
                    <i
                    className={`fa-light fa-${it.icon}`}
                    style={{
                      fontSize: 12,
                      color: icol,
                      lineHeight: 1
                    }} />
                  
                    {it.label}
                  </button>);

            });
          })()}
          </div>
        </>
      }

      <ReviewViewModal
        isOpen={reviewViewOpen}
        onClose={() => setReviewViewOpen(false)}
        tabId={reviewViewTabId}
        views={views}
        questions={questions}
        fg={fg}
        bdr={bdr}
        mfg={mfg}
        br={br} />
      

      <QBViewModals {...p} />

      <FilterSheet
        isOpen={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        filters={fieldFilters}
        onFiltersChange={setFieldFilters}
        allValues={allValues}
        onSaveAsView={handleSaveAsView}
        onCreateView={() => setCreateSVOpen(true)}
        smartViews={views.map((v: any) => ({
          id: v.id,
          name: v.name,
          count: liveViewCounts && v.id in liveViewCounts ? liveViewCounts[v.id] : v.count
        }))}
        onSelectView={(id: string) => {
          setActiveTabId(id);
          setFilterSheetOpen(false);
        }} />
      
    </div>);

}