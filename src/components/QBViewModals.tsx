import React from 'react';
import { ImportWizardModal } from './ImportWizard';
import { NewQuestionModal } from './NewQuestionModal';
import { QuestionRowPanel } from './QuestionRowPanel';
import { CreateSmartViewModal, EditSmartViewModal, ArchiveConfirmModal, DeleteConfirmModal, ShareFolderModal, AddToFolderModal } from './QBModals';
import { ShareQuestionModal } from './ShareQuestionModal';
import { RequestEditModal, EditImpactWarningModal, CollaborateModal, SectionOverlapModal, CrossDeptBlockModal } from './QBFacultyModals';
import { AssignCoursesModal } from './QBAssignModal';

export function QBViewModals(p: any) {
  const {
    rowPanel, setRowPanel, toQRowData, isFaculty, isAdmin, CURRENT_USER, onEditQuestion,
    newQuestionOpen, setNewQuestionOpen, importOpen, setImportOpen, folders,
    createSVOpen, setCreateSVOpen, handleCreateSV, editSV, setEditSV,
    archiveFolder, setArchiveFolder, setFolders, deleteItem, setDeleteItem,
    setAssignments, shareTarget, setShareTarget, PERSONAS, facultyAssignments,
    setFacultyAssignments, facultyAccessMap, setFacultyAccessMap,
    facultyStatusFilterMap, setFacultyStatusFilterMap, addToFolderOpen,
    setAddToFolderOpen, selectedQForFolder, assignedFolderIds,
    shareQId, setShareQId, requestEditId, setRequestEditId, editImpactQ,
    setEditImpactQ, collaborateOpen, setCollaborateOpen, questionAccessMap,
    setQuestionAccessMap, sectionOverlapQ, setSectionOverlapQ, shortlistedQIds,
    setShortlistedQIds, crossDeptBlockQ, setCrossDeptBlockQ, adminAssignOpen,
    setAdminAssignOpen, questions, selectedFolder, views, setViews,
    activeTabId, setActiveTabId, allValues, selected,
    transferCourseOnly, setTransferCourseOnly, setSelected, br, bdr, fg, mfg
  } = p;

  return (
    <>
      {/* ── RIGHT DETAIL PANEL ── */}
      {rowPanel &&
      <QuestionRowPanel
        q={toQRowData(rowPanel)}
        onClose={() => setRowPanel(null)}
        canEdit={isAdmin || rowPanel.creator === CURRENT_USER}
        onEdit={() => {
          if (isAdmin || rowPanel.creator === CURRENT_USER) {onEditQuestion?.();}
          setRowPanel(null);
        }} />

      }

      {/* ── MODALS ── */}
      {newQuestionOpen && <NewQuestionModal onClose={() => setNewQuestionOpen(false)} onSave={() => setNewQuestionOpen(false)} />}
      {importOpen && isAdmin && <ImportWizardModal isOpen={importOpen} onClose={() => setImportOpen(false)} folders={folders} folderRules={{}} onImport={(_qs, _assigns) => setImportOpen(false)} />}
      <CreateSmartViewModal isOpen={createSVOpen} onClose={() => setCreateSVOpen(false)} onCreate={handleCreateSV} availableTags={allValues?.tags ?? []} />
      {editSV &&
      <EditSmartViewModal
        isOpen
        onClose={() => setEditSV(null)}
        initialName={editSV.name}
        initialCriteria={editSV.criteria}
        availableTags={allValues?.tags ?? []}
        onSave={(name, criteria) => {
          setViews((prev: any[]) => prev.map((v) => v.id === editSV.id ? { ...v, name, criteria, autoUpdate: criteria.autoUpdate } : v));
          setEditSV(null);
        }} />

      }
      {archiveFolder && isAdmin &&
      <ArchiveConfirmModal
        isOpen
        onClose={() => setArchiveFolder(null)}
        onConfirm={() => {setFolders((prev: any[]) => prev.filter((f) => f.id !== archiveFolder));setArchiveFolder(null);}}
        folderName={folders.find((f: any) => f.id === archiveFolder)?.name || ''} />

      }
      {deleteItem && isAdmin &&
      <DeleteConfirmModal
        isOpen
        onClose={() => setDeleteItem(null)}
        onConfirm={() => {
          if (deleteItem.type === 'folder') setFolders((prev: any[]) => prev.filter((f) => f.id !== deleteItem.id));else
          {
            setViews((prev: any[]) => prev.filter((v) => v.id !== deleteItem.id));
            if (activeTabId === deleteItem.id) setActiveTabId('qa-all');
          }
          setDeleteItem(null);
        }}
        itemName={deleteItem.name}
        itemType={deleteItem.type} />

      }
      {shareTarget && isAdmin &&
      <ShareFolderModal
        isOpen
        onClose={() => setShareTarget(null)}
        folderId={shareTarget.id}
        folderName={shareTarget.name}
        folderType={shareTarget.type}
        allFaculty={PERSONAS.filter((pp: any) => pp.role === 'faculty').map((pp: any) => ({ id: pp.id, name: pp.name, initials: pp.initials, color: pp.color }))}
        facultyAssignments={facultyAssignments}
        facultyAccessMap={facultyAccessMap}
        facultyStatusFilterMap={facultyStatusFilterMap}
        onUpdateAccess={(newAssignments: any, newAccessMap: any, newStatusMap: any) => {
          setFacultyAssignments(newAssignments);
          setFacultyAccessMap(newAccessMap);
          setFacultyStatusFilterMap(newStatusMap);
        }} />

      }
      {addToFolderOpen && isAdmin &&
      <AddToFolderModal
        isOpen
        onClose={() => {setAddToFolderOpen(false);setSelectedQForFolder(null);setTransferCourseOnly(false);}}
        allFolders={transferCourseOnly ? folders.filter((f: any) => f.isCourse) : folders}
        assignedFolderIds={assignedFolderIds}
        questionCount={selected?.size || 1}
        onAdd={(fids: string[]) => {
          setAssignments((prev: any) => {
            const next = { ...prev };
            fids.forEach((fid) => {
              const qids = selectedQForFolder ? [selectedQForFolder] : [...(selected || [])];
              next[fid] = [...new Set([...(next[fid] || []), ...qids])];
            });
            return next;
          });
          setAddToFolderOpen(false);
          setSelected(new Set());
          setSelectedQForFolder(null);
        }} />

      }
      {shareQId && isAdmin &&
      <ShareQuestionModal
        isOpen
        onClose={() => setShareQId(null)}
        questionTitle={questions.find((q: any) => q.id === shareQId)?.title}
        questionId={shareQId}
        allFaculty={PERSONAS.filter((pp: any) => pp.role === 'faculty').map((pp: any) => ({ id: pp.id, name: pp.name, initials: pp.initials, color: pp.color }))}
        questionAccessMap={questionAccessMap}
        onUpdateQuestionAccess={(qId: string, newAccess: any) => {
          setQuestionAccessMap((prev: any) => ({ ...prev, [qId]: newAccess }));
        }} />

      }
      {requestEditId &&
      <RequestEditModal requestEditId={requestEditId} questions={questions} onClose={() => setRequestEditId(null)} />
      }
      {editImpactQ &&
      <EditImpactWarningModal editImpactQ={editImpactQ} onClose={() => setEditImpactQ(null)} onEditAnyway={() => {onEditQuestion?.();setEditImpactQ(null);}} />
      }
      {collaborateOpen && isFaculty &&
      <CollaborateModal onClose={() => setCollaborateOpen(false)} />
      }
      {sectionOverlapQ && isFaculty &&
      <SectionOverlapModal
        question={sectionOverlapQ}
        onClose={() => setSectionOverlapQ(null)}
        onAddAnyway={() => {setShortlistedQIds((prev: Set<string>) => {const n = new Set(prev);n.add(sectionOverlapQ.id);return n;});setSectionOverlapQ(null);}} />

      }
      {crossDeptBlockQ && isFaculty &&
      <CrossDeptBlockModal
        question={crossDeptBlockQ}
        onClose={() => setCrossDeptBlockQ(null)} />

      }
      {adminAssignOpen && isAdmin &&
      <AssignCoursesModal
        isOpen
        onClose={() => setAdminAssignOpen(false)}
        folders={folders.filter((f: any) => f.isCourse && !f.parentId)}
        facultyAssignments={facultyAssignments}
        facultyAccessMap={facultyAccessMap}
        onSave={(newFolderIds: any, newAccessMap: any) => {
          setFacultyAssignments(newFolderIds);
          setFacultyAccessMap(newAccessMap);
          setAdminAssignOpen(false);
        }} />

      }
    </>);

}