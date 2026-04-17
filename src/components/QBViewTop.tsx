import React, { useState, Fragment } from 'react';
import type { SVItem, FolderNode, Question } from './QBData';
const TRUST_CFG: Record<
  'junior' | 'mid' | 'senior',
  {
    color: string;
    bg: string;
  }> =
{
  junior: {
    color: '#64748b',
    bg: '#f1f5f9'
  },
  mid: {
    color: '#2563eb',
    bg: '#dbeafe'
  },
  senior: {
    color: '#059669',
    bg: '#dcfce7'
  }
};
const S_DOT: Record<string, string> = {
  Saved: '#0d9488',
  Draft: '#94a3b8'
};
const PERSONA_COLORS: Record<string, string> = {
  'Dr. Patel': '#0891b2',
  'Dr. Chen': '#059669',
  'Dr. Lee': '#d97706',
  'Dr. Ramirez': '#dc2626',
  'Dr. Kim': '#0f766e',
  'Dr. Wells': '#64748b',
  Admin: '#7c3aed'
};
function FolderPicker({
  folders,
  selected,
  onSelect




}: {folders: FolderNode[];selected: string | null;onSelect: (id: string) => void;}) {
  const [exp, setExp] = useState<Set<string>>(
    new Set(['f-phar101', 'f-biol201', 'f-skel101'])
  );
  const roots = folders.filter(
    (f) => !f.parentId && !f.isPrivateSpace && !f.isQuestionSet
  );
  const renderNode = (f: FolderNode, depth = 0): React.ReactNode => {
    const ch = folders.filter(
      (c) => c.parentId === f.id && !c.isPrivateSpace && !c.isQuestionSet
    );
    const isExp = exp.has(f.id);
    const isSel = selected === f.id;
    return (
      <div key={f.id}>
        <div
          onClick={() => onSelect(f.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: `5px 8px 5px ${8 + depth * 14}px`,
            borderRadius: 6,
            cursor: 'pointer',
            marginBottom: 1,
            background: isSel ?
            'color-mix(in oklch,#7c3aed 10%,white)' :
            'transparent',
            border: isSel ? '1px solid #c4b5fd' : '1px solid transparent'
          }}
          onMouseEnter={(e) => {
            if (!isSel)
            (e.currentTarget as HTMLDivElement).style.background = '#f8fafc';
          }}
          onMouseLeave={(e) => {
            if (!isSel)
            (e.currentTarget as HTMLDivElement).style.background =
            'transparent';
          }}>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExp((p) => {
                const n = new Set(p);
                n.has(f.id) ? n.delete(f.id) : n.add(f.id);
                return n;
              });
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: ch.length ? 'pointer' : 'default',
              color: '#94a3b8',
              width: 14,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            
            {ch.length > 0 &&
            <i
              className={`fa-regular fa-chevron-${isExp ? 'down' : 'right'}`}
              style={{
                fontSize: 9
              }} />

            }
          </button>
          <i
            className={`fa-solid fa-${depth === 0 ? 'graduation-cap' : depth === 1 ? 'calendar' : 'folder'}`}
            style={{
              fontSize: 11,
              color: isSel ? '#7c3aed' : '#64748b',
              flexShrink: 0
            }} />
          
          <span
            style={{
              fontSize: 12,
              fontWeight: isSel ? 600 : 400,
              color: isSel ? '#6d28d9' : '#1e293b',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
            
            {f.name}
          </span>
          {isSel &&
          <i
            className="fa-solid fa-check"
            style={{
              fontSize: 10,
              color: '#7c3aed',
              flexShrink: 0
            }} />

          }
        </div>
        {isExp && ch.map((c) => renderNode(c, depth + 1))}
      </div>);

  };
  return <div>{roots.map((f) => renderNode(f))}</div>;
}
// ─── Unified Smart Populate modal (Promote Drafts + Auto-collect) ─────────────
function SmartPopulateModal({
  isOpen,
  onClose,
  questions,
  folders,
  CURRENT_USER,
  setQuestions,
  personaTrustLevels,
  selectedFolder,
  handleAutoCollect










}: {isOpen: boolean;onClose: () => void;questions: Question[];folders: FolderNode[];CURRENT_USER: string;setQuestions: React.Dispatch<React.SetStateAction<any[]>>;personaTrustLevels: Record<string, 'junior' | 'mid' | 'senior'>;selectedFolder: string | null;handleAutoCollect: (folderId: string) => void;}) {
  const [mode, setMode] = useState<'promote' | 'collect'>('promote');
  // ── Promote mode state ──
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedQIds, setSelectedQIds] = useState<Set<string>>(new Set());
  const [targetFolderId, setTargetFolderId] = useState<string | null>(
    selectedFolder || null
  );
  const [done, setDone] = useState(false);
  // ── Collect mode state ──
  const [acStatus, setAcStatus] = useState<string[]>(['Approved']);
  const [acDifficulty, setAcDifficulty] = useState<string[]>([]);
  const [acType, setAcType] = useState<string[]>([]);
  const [acTags, setAcTags] = useState<string[]>([]);
  const [acFolder, setAcFolder] = useState<string | null>(
    selectedFolder || null
  );
  const [acDone, setAcDone] = useState(false);
  if (!isOpen) return null;
  const fg = '#1e293b',
    mfg = '#64748b',
    bdr = '#e2e8f0';
  // Promote: my private drafts
  const candidates = questions.filter(
    (q) =>
    (q.tags || []).includes('private') && (
    q.creator === CURRENT_USER || q.collaborator === CURRENT_USER)
  );
  const targetFolder = targetFolderId ?
  folders.find((f) => f.id === targetFolderId) :
  null;
  const selectedList = candidates.filter((q) => selectedQIds.has(q.id));
  const allTags = [...new Set(questions.flatMap((q) => q.tags || []))].
  filter((t) => t !== 'private').
  sort();
  // Collect: filter all questions by criteria
  const acMatching = questions.filter((q) => {
    if (acStatus.length && !acStatus.includes(q.status || '')) return false;
    if (acDifficulty.length && !acDifficulty.includes(q.difficulty || ''))
    return false;
    if (acType.length && !acType.includes(q.type || '')) return false;
    if (acTags.length && !acTags.some((t) => (q.tags || []).includes(t)))
    return false;
    return true;
  });
  const acTargetFolder = acFolder ?
  folders.find((f) => f.id === acFolder) :
  null;
  const toggleChip = (
  arr: string[],
  setArr: (v: string[]) => void,
  val: string) =>
  setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  const ChipGroup = ({
    label,
    options,
    selected: sel,
    onChange





  }: {label: string;options: string[];selected: string[];onChange: (v: string[]) => void;}) =>
  <div
    style={{
      marginBottom: 14
    }}>
    
      <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: mfg,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.07em',
        marginBottom: 6
      }}>
      
        {label}
      </div>
      <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6
      }}>
      
        {options.map((o) => {
        const on = sel.includes(o);
        return (
          <button
            key={o}
            onClick={() => toggleChip(sel, onChange, o)}
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              border: `1px solid ${on ? 'transparent' : bdr}`,
              background: on ? '#7c3aed' : 'white',
              color: on ? 'white' : '#475569',
              fontSize: 12,
              fontWeight: on ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.1s'
            }}>
            
              {o}
            </button>);

      })}
      </div>
    </div>;

  const handleToggle = (id: string) =>
  setSelectedQIds((prev) => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const handleSelectAll = () =>
  setSelectedQIds(
    selectedQIds.size === candidates.length ?
    new Set() :
    new Set(candidates.map((q) => q.id))
  );
  const handlePromote = () => {
    setQuestions((prev) =>
    prev.map((q) =>
    selectedQIds.has(q.id) ?
    {
      ...q,
      tags: (q.tags || []).filter((t: string) => t !== 'private'),
      status: 'In Review'
    } :
    q
    )
    );
    setDone(true);
  };
  const handleCollect = () => {
    if (acFolder) {
      handleAutoCollect(acFolder);
      setAcDone(true);
    }
  };
  const handleClose = () => {
    setMode('promote');
    setStep(1);
    setSelectedQIds(new Set());
    setTargetFolderId(selectedFolder || null);
    setDone(false);
    setAcStatus(['Approved']);
    setAcDifficulty([]);
    setAcType([]);
    setAcTags([]);
    setAcFolder(selectedFolder || null);
    setAcDone(false);
    onClose();
  };
  const STEPS = ['Select Questions', 'Choose Target', 'Review & Promote'];
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
      onClick={handleClose}>
      
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 16,
          width: 560,
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column'
        }}>
        
        {/* Header */}
        <div
          style={{
            padding: '20px 24px 0',
            borderBottom: `1px solid ${bdr}`,
            flexShrink: 0
          }}>
          
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 14
            }}>
            
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg,#ede9fe,#dbeafe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
              
              <i
                className="fa-regular fa-sparkles"
                style={{
                  fontSize: 18,
                  color: '#7c3aed'
                }} />
              
            </div>
            <div
              style={{
                flex: 1
              }}>
              
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: fg
                }}>
                
                Smart Populate
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: mfg,
                  marginTop: 1
                }}>
                
                {mode === 'promote' ?
                'Promote private drafts into the shared course pool' :
                'Auto-collect questions matching criteria into a folder'}
              </div>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                padding: 4,
                borderRadius: 6,
                display: 'flex'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = fg}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
              
              <i
                className="fa-regular fa-xmark"
                style={{
                  fontSize: 16
                }} />
              
            </button>
          </div>

          {/* Mode toggle tabs */}
          {!done && !acDone &&
          <div
            style={{
              display: 'flex',
              gap: 0,
              marginBottom: 0
            }}>
            
              {(
            [
            ['promote', 'sparkles', 'Promote Drafts'],
            ['collect', 'bolt', 'Auto-collect']] as
            const).
            map(([m, icon, label]) =>
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '9px 12px',
                background: 'none',
                border: 'none',
                borderBottom:
                mode === m ?
                '2px solid #7c3aed' :
                '2px solid transparent',
                color: mode === m ? '#7c3aed' : mfg,
                fontSize: 13,
                fontWeight: mode === m ? 600 : 400,
                cursor: 'pointer',
                transition: 'all .12s'
              }}>
              
                  <i
                className={`fa-regular fa-${icon}`}
                style={{
                  fontSize: 12
                }} />
              {' '}
                  {label}
                </button>
            )}
            </div>
          }

          {/* Promote: step indicator */}
          {mode === 'promote' && !done &&
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              padding: '12px 0 14px'
            }}>
            
              {STEPS.map((s, i) => {
              const n = i + 1;
              const isActive = step === n;
              const isDone = step > n;
              return (
                <Fragment key={i}>
                    <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      cursor: isDone ? 'pointer' : 'default'
                    }}
                    onClick={() => {
                      if (isDone) setStep(n as 1 | 2 | 3);
                    }}>
                    
                      <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: isDone ?
                        '#7c3aed' :
                        isActive ?
                        '#ede9fe' :
                        '#f1f5f9',
                        border: `2px solid ${isDone ? '#7c3aed' : isActive ? '#7c3aed' : '#e2e8f0'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                      
                        {isDone ?
                      <i
                        className="fa-solid fa-check"
                        style={{
                          fontSize: 9,
                          color: 'white'
                        }} /> :


                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: isActive ? '#7c3aed' : '#94a3b8'
                        }}>
                        
                            {n}
                          </span>
                      }
                      </div>
                      <span
                      style={{
                        fontSize: 12,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ?
                        '#7c3aed' :
                        isDone ?
                        '#475569' :
                        '#94a3b8',
                        whiteSpace: 'nowrap'
                      }}>
                      
                        {s}
                      </span>
                    </div>
                    {i < 2 &&
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: step > n + 1 ? '#7c3aed' : '#e2e8f0',
                      margin: '0 8px',
                      minWidth: 20
                    }} />

                  }
                  </Fragment>);

            })}
            </div>
          }
          {(mode === 'collect' || done || acDone) &&
          <div
            style={{
              height: 14
            }} />

          }
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px'
          }}>
          
          {/* ── PROMOTE MODE ── */}
          {mode === 'promote' && (
          done ?
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              padding: '24px 0',
              textAlign: 'center'
            }}>
            
                <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              
                  <i
                className="fa-solid fa-circle-check"
                style={{
                  fontSize: 28,
                  color: '#16a34a'
                }} />
              
                </div>
                <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: fg
              }}>
              
                  Successfully promoted!
                </div>
                <div
              style={{
                fontSize: 13,
                color: mfg,
                lineHeight: 1.6,
                maxWidth: 360
              }}>
              
                  <strong>{selectedList.length}</strong> question
                  {selectedList.length !== 1 ? 's were' : ' was'} moved to{' '}
                  <strong>In Review</strong> status.
                  {targetFolder &&
              <>
                      {' '}
                      Now visible in <strong>{targetFolder.name}</strong>.
                    </>
              }
                </div>
                <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                marginTop: 8,
                width: '100%',
                maxWidth: 360
              }}>
              
                  {selectedList.map((q) =>
              <div
                key={q.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  background: '#f0fdf4',
                  borderRadius: 8,
                  border: '1px solid #bbf7d0'
                }}>
                
                      <i
                  className="fa-solid fa-circle-check"
                  style={{
                    fontSize: 12,
                    color: '#16a34a',
                    flexShrink: 0
                  }} />
                
                      <span
                  style={{
                    fontSize: 12,
                    color: '#166534',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                  
                        {q.title.replace('Draft: ', '')}
                      </span>
                    </div>
              )}
                </div>
              </div> :
          step === 1 ?
          <>
                <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12
              }}>
              
                  <div>
                    <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: fg
                  }}>
                  
                      Your private drafts
                    </div>
                    <div
                  style={{
                    fontSize: 12,
                    color: mfg,
                    marginTop: 1
                  }}>
                  
                      Select questions ready to share with the course pool
                    </div>
                  </div>
                  {candidates.length > 0 &&
              <button
                onClick={handleSelectAll}
                style={{
                  fontSize: 12,
                  color: '#7c3aed',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  padding: '4px 8px',
                  borderRadius: 6
                }}
                onMouseEnter={(e) =>
                e.currentTarget.style.background = '#f5f3ff'
                }
                onMouseLeave={(e) =>
                e.currentTarget.style.background = 'none'
                }>
                
                      {selectedQIds.size === candidates.length ?
                'Deselect all' :
                'Select all'}
                    </button>
              }
                </div>
                {candidates.length === 0 ?
            <div
              style={{
                textAlign: 'center',
                padding: '32px 0',
                color: mfg
              }}>
              
                    <i
                className="fa-regular fa-folder-open"
                style={{
                  fontSize: 28,
                  marginBottom: 10,
                  display: 'block',
                  color: '#cbd5e1'
                }} />
              
                    <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#475569'
                }}>
                
                      No private drafts found
                    </div>
                    <div
                style={{
                  fontSize: 12,
                  marginTop: 4
                }}>
                
                      Questions in your Private Space will appear here
                    </div>
                  </div> :

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}>
              
                    {candidates.map((q) => {
                const isSel = selectedQIds.has(q.id);
                const trust = personaTrustLevels[q.creator || ''] as
                'junior' |
                'mid' |
                'senior' |
                undefined;
                const tc = trust ? TRUST_CFG[trust] : null;
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggle(q.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      transition: 'all 0.1s',
                      background: isSel ? '#f5f3ff' : 'white',
                      border: isSel ?
                      '1px solid #c4b5fd' :
                      `1px solid ${bdr}`
                    }}
                    onMouseEnter={(e) => {
                      if (!isSel)
                      (
                      e.currentTarget as HTMLDivElement).
                      style.background = '#fafafa';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSel)
                      (
                      e.currentTarget as HTMLDivElement).
                      style.background = 'white';
                    }}>
                    
                          <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        border: `2px solid ${isSel ? '#7c3aed' : '#cbd5e1'}`,
                        background: isSel ? '#7c3aed' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 1
                      }}>
                      
                            {isSel &&
                      <i
                        className="fa-solid fa-check"
                        style={{
                          fontSize: 9,
                          color: 'white'
                        }} />

                      }
                          </div>
                          <div
                      style={{
                        flex: 1,
                        minWidth: 0
                      }}>
                      
                            <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: fg,
                          lineHeight: 1.4,
                          marginBottom: 5,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                        
                              {q.title.replace('Draft: ', '')}
                            </div>
                            <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          flexWrap: 'wrap'
                        }}>
                        
                              <span
                          style={{
                            fontSize: 10,
                            padding: '1px 6px',
                            borderRadius: 10,
                            background: S_DOT[q.status] + '22',
                            color: S_DOT[q.status],
                            fontWeight: 600
                          }}>
                          
                                {q.status}
                              </span>
                              <span
                          style={{
                            fontSize: 10,
                            padding: '1px 6px',
                            borderRadius: 10,
                            background: '#f1f5f9',
                            color: '#475569',
                            fontWeight: 500
                          }}>
                          
                                {q.difficulty}
                              </span>
                              <span
                          style={{
                            fontSize: 10,
                            padding: '1px 6px',
                            borderRadius: 10,
                            background: '#f1f5f9',
                            color: '#475569',
                            fontWeight: 500
                          }}>
                          
                                {q.type}
                              </span>
                              {tc &&
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: 3,
                            background: tc.bg,
                            color: tc.color,
                            letterSpacing: '0.04em'
                          }}>
                          
                                  {trust?.toUpperCase()}
                                </span>
                        }
                              <span
                          style={{
                            fontSize: 10,
                            color: '#94a3b8',
                            marginLeft: 'auto'
                          }}>
                          
                                {q.code}
                              </span>
                            </div>
                          </div>
                        </div>);

              })}
                  </div>
            }
              </> :
          step === 2 ?
          <>
                <div
              style={{
                marginBottom: 12
              }}>
              
                  <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: fg
                }}>
                
                    Choose target folder
                  </div>
                  <div
                style={{
                  fontSize: 12,
                  color: mfg,
                  marginTop: 1
                }}>
                
                    Select where promoted questions will be visible
                  </div>
                </div>
                <FolderPicker
              folders={folders}
              selected={targetFolderId}
              onSelect={setTargetFolderId} />
            
              </> :

          <>
                <div
              style={{
                marginBottom: 16
              }}>
              
                  <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: fg
                }}>
                
                    Review before promoting
                  </div>
                  <div
                style={{
                  fontSize: 12,
                  color: mfg,
                  marginTop: 1
                }}>
                
                    Promoted questions will be moved to{' '}
                    <strong>In Review</strong> status for admin approval
                  </div>
                </div>
                <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}>
              
                  <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8
                }}>
                
                    <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: '#f5f3ff',
                    border: '1px solid #ede9fe'
                  }}>
                  
                      <div
                    style={{
                      fontSize: 11,
                      color: '#7c3aed',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: 4
                    }}>
                    
                        Questions
                      </div>
                      <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: '#6d28d9'
                    }}>
                    
                        {selectedList.length}
                      </div>
                      <div
                    style={{
                      fontSize: 11,
                      color: '#7c3aed'
                    }}>
                    
                        selected for promotion
                      </div>
                    </div>
                    <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: '#fefce8',
                    border: '1px solid #fef08a'
                  }}>
                  
                      <div
                    style={{
                      fontSize: 11,
                      color: '#d97706',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: 4
                    }}>
                    
                        Target
                      </div>
                      <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#92400e',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                    
                        {targetFolder?.name ?? 'Any folder'}
                      </div>
                      <div
                    style={{
                      fontSize: 11,
                      color: '#d97706',
                      marginTop: 2
                    }}>
                    
                        destination folder
                      </div>
                    </div>
                  </div>
                  <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0'
                }}>
                
                    <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#166534',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: 8
                  }}>
                  
                      What will happen
                    </div>
                    {[
                {
                  icon: 'tag',
                  text: 'Questions moved to In Review status'
                },
                {
                  icon: 'eye',
                  text: 'Visible to dept. admin for approval'
                },
                {
                  icon: 'lock-open',
                  text: 'Removed from your Private Space'
                },
                {
                  icon: 'bell',
                  text: 'Admin notified for quality review'
                }].
                map((row, i) =>
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: i < 3 ? 6 : 0
                  }}>
                  
                        <i
                    className={`fa-regular fa-${row.icon}`}
                    style={{
                      fontSize: 11,
                      color: '#16a34a',
                      width: 14,
                      textAlign: 'center'
                    }} />
                  
                        <span
                    style={{
                      fontSize: 12,
                      color: '#166534'
                    }}>
                    
                          {row.text}
                        </span>
                      </div>
                )}
                  </div>
                  <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: mfg,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  marginTop: 4,
                  marginBottom: 4
                }}>
                
                    Selected Questions
                  </div>
                  {selectedList.map((q) =>
              <div
                key={q.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'white',
                  border: `1px solid ${bdr}`
                }}>
                
                      <i
                  className="fa-regular fa-file-lines"
                  style={{
                    fontSize: 12,
                    color: '#94a3b8',
                    flexShrink: 0
                  }} />
                
                      <span
                  style={{
                    fontSize: 12,
                    color: fg,
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                  
                        {q.title.replace('Draft: ', '')}
                      </span>
                      <span
                  style={{
                    fontSize: 10,
                    color: '#94a3b8',
                    flexShrink: 0
                  }}>
                  
                        {q.code}
                      </span>
                    </div>
              )}
                </div>
              </>)
          }

          {/* ── COLLECT MODE ── */}
          {mode === 'collect' && (
          acDone ?
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              padding: '24px 0',
              textAlign: 'center'
            }}>
            
                <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#fefce8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              
                  <i
                className="fa-solid fa-bolt"
                style={{
                  fontSize: 28,
                  color: '#d97706'
                }} />
              
                </div>
                <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: fg
              }}>
              
                  Questions collected!
                </div>
                <div
              style={{
                fontSize: 13,
                color: mfg,
                lineHeight: 1.6,
                maxWidth: 360
              }}>
              
                  <strong>{acMatching.length}</strong> matching question
                  {acMatching.length !== 1 ? 's were' : ' was'} added to{' '}
                  <strong>{acTargetFolder?.name ?? 'the folder'}</strong>.
                </div>
              </div> :

          <>
                <div
              style={{
                marginBottom: 16
              }}>
              
                  <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: fg
                }}>
                
                    Filter criteria
                  </div>
                  <div
                style={{
                  fontSize: 12,
                  color: mfg,
                  marginTop: 1
                }}>
                
                    Questions matching ALL selected criteria will be collected
                  </div>
                </div>
                <ChipGroup
              label="Status"
              options={[
              'Approved',
              'Active',
              'Ready',
              'In Review',
              'Draft',
              'Flagged']
              }
              selected={acStatus}
              onChange={setAcStatus} />
            
                <ChipGroup
              label="Difficulty"
              options={['Easy', 'Medium', 'Hard']}
              selected={acDifficulty}
              onChange={setAcDifficulty} />
            
                <ChipGroup
              label="Question type"
              options={[
              'MCQ',
              'Fill blank',
              'Hotspot',
              'Ordering',
              'Matching']
              }
              selected={acType}
              onChange={setAcType} />
            
                {allTags.length > 0 &&
            <ChipGroup
              label="Tags / Course codes"
              options={allTags}
              selected={acTags}
              onChange={setAcTags} />

            }
                <div
              style={{
                marginTop: 4,
                marginBottom: 12
              }}>
              
                  <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: fg,
                  marginBottom: 8
                }}>
                
                    Target folder
                  </div>
                  <FolderPicker
                folders={folders}
                selected={acFolder}
                onSelect={setAcFolder} />
              
                </div>
              </>)
          }
        </div>

        {/* Footer */}
        {mode === 'promote' && !done &&
        <div
          style={{
            borderTop: `1px solid ${bdr}`,
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            background: '#f8fafc'
          }}>
          
            <div>
              {step > 1 &&
            <button
              onClick={() => setStep((s) => s - 1 as 1 | 2 | 3)}
              style={{
                padding: '7px 14px',
                borderRadius: 7,
                border: `1px solid ${bdr}`,
                background: 'white',
                color: '#475569',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
              
                  <i
                className="fa-regular fa-arrow-left"
                style={{
                  fontSize: 11
                }} />
              {' '}
                  Back
                </button>
            }
            </div>
            <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center'
            }}>
            
              {step === 1 &&
            <span
              style={{
                fontSize: 12,
                color: mfg
              }}>
              
                  {selectedQIds.size} of {candidates.length} selected
                </span>
            }
              <button
              onClick={handleClose}
              style={{
                padding: '7px 14px',
                borderRadius: 7,
                border: `1px solid ${bdr}`,
                background: 'white',
                color: '#475569',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500
              }}>
              
                Cancel
              </button>
              {step < 3 ?
            <button
              onClick={() => setStep((s) => s + 1 as 1 | 2 | 3)}
              disabled={step === 1 && selectedQIds.size === 0}
              style={{
                padding: '7px 16px',
                borderRadius: 7,
                border: 'none',
                background:
                step === 1 && selectedQIds.size === 0 ?
                '#e2e8f0' :
                '#7c3aed',
                color:
                step === 1 && selectedQIds.size === 0 ?
                '#94a3b8' :
                'white',
                cursor:
                step === 1 && selectedQIds.size === 0 ?
                'not-allowed' :
                'pointer',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
              
                  Continue{' '}
                  <i
                className="fa-regular fa-arrow-right"
                style={{
                  fontSize: 11
                }} />
              
                </button> :

            <button
              onClick={handlePromote}
              disabled={selectedList.length === 0}
              style={{
                padding: '7px 16px',
                borderRadius: 7,
                border: 'none',
                background:
                selectedList.length === 0 ? '#e2e8f0' : '#7c3aed',
                color: selectedList.length === 0 ? '#94a3b8' : 'white',
                cursor:
                selectedList.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
              
                  <i
                className="fa-regular fa-sparkles"
                style={{
                  fontSize: 11
                }} />
              {' '}
                  Promote {selectedList.length} Question
                  {selectedList.length !== 1 ? 's' : ''}
                </button>
            }
            </div>
          </div>
        }
        {mode === 'promote' && done &&
        <div
          style={{
            borderTop: `1px solid ${bdr}`,
            padding: '14px 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            flexShrink: 0,
            background: '#f8fafc'
          }}>
          
            <button
            onClick={handleClose}
            style={{
              padding: '7px 20px',
              borderRadius: 7,
              border: 'none',
              background: '#7c3aed',
              color: 'white',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600
            }}>
            
              Done
            </button>
          </div>
        }
        {mode === 'collect' && !acDone &&
        <div
          style={{
            borderTop: `1px solid ${bdr}`,
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            background: '#f8fafc'
          }}>
          
            <div>
              <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: acMatching.length > 0 ? '#7c3aed' : '#94a3b8'
              }}>
              
                {acMatching.length}
              </span>
              <span
              style={{
                fontSize: 13,
                color: mfg,
                marginLeft: 5
              }}>
              
                question{acMatching.length !== 1 ? 's' : ''} match your criteria
              </span>
            </div>
            <div
            style={{
              display: 'flex',
              gap: 8
            }}>
            
              <button
              onClick={handleClose}
              style={{
                padding: '7px 14px',
                borderRadius: 7,
                border: `1px solid ${bdr}`,
                background: 'white',
                color: '#475569',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500
              }}>
              
                Cancel
              </button>
              <button
              onClick={handleCollect}
              disabled={!acFolder || acMatching.length === 0}
              style={{
                padding: '7px 16px',
                borderRadius: 7,
                border: 'none',
                background:
                acFolder && acMatching.length > 0 ? '#7c3aed' : '#e2e8f0',
                color:
                acFolder && acMatching.length > 0 ? 'white' : '#94a3b8',
                cursor:
                acFolder && acMatching.length > 0 ?
                'pointer' :
                'not-allowed',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
              
                <i
                className="fa-solid fa-bolt"
                style={{
                  fontSize: 11
                }} />
              {' '}
                Collect into folder
              </button>
            </div>
          </div>
        }
        {mode === 'collect' && acDone &&
        <div
          style={{
            borderTop: `1px solid ${bdr}`,
            padding: '14px 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            flexShrink: 0,
            background: '#f8fafc'
          }}>
          
            <button
            onClick={handleClose}
            style={{
              padding: '7px 20px',
              borderRadius: 7,
              border: 'none',
              background: '#7c3aed',
              color: 'white',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600
            }}>
            
              Done
            </button>
          </div>
        }
      </div>
    </div>);

}
// ─────────────────────────────────────────────────────────────────────────────
export function QBViewTop(p: any) {
  const {
    br,
    bdr,
    fg,
    mfg,
    activeTabId,
    setActiveTabId,
    hoverTabId,
    setHoverTabId,
    visibleTabs,
    hiddenTabs,
    activeIsHidden,
    headerMenuOpen,
    setHeaderMenuOpen,
    headerMenuPos,
    setHeaderMenuPos,
    isFaculty,
    isAdmin,
    selectedFolder,
    folders,
    tabBarWrapRef,
    overflowOpen,
    setOverflowOpen,
    renamingTabId,
    renamingTabName,
    setRenamingTabId,
    setRenamingTabName,
    saveTabRename,
    chevronHoverId,
    setChevronHoverId,
    tabCtxMenu,
    views,
    createSVOpen,
    setCreateSVOpen,
    setNewQuestionOpen,
    setAdminAssignOpen,
    selectedFolderIsLifetimeRepo,
    setExportOpen,
    availableSemesters,
    facultyStatusFilterMap,
    CURRENT_USER,
    setFacultyStatusFilterMap,
    filteredQuestions,
    handleDeleteTab,
    setTabCtxMenu,
    setEditSV,
    moveTab,
    setViews,
    questions,
    setQuestions,
    personaTrustLevels,
    handleAutoCollect,
    setImportOpen
  } = p;
  const [splitOpen, setSplitOpen] = useState(false);
  const [smartPopOpen, setSmartPopOpen] = useState(false);
  const [chevronTooltipPos, setChevronTooltipPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  // "My Questions" count: questions by current user, excluding private-tagged
  const myQuestionsCount = (questions || []).filter(
    (q: Question) =>
    q.creator === CURRENT_USER && !(q.tags || []).includes('private')
  ).length;
  const selFolder = selectedFolder ?
  folders.find((f: any) => f.id === selectedFolder) :
  null;
  const isCourseOffering = selFolder?.isCourseOffering === true;
  const workspaceMembers = selFolder?.workspaceMembers ?? [];
  return (
    <>
      <div
        style={{
          padding: '10px 16px 8px',
          borderBottom: `1px solid ${bdr}`,
          background: 'white',
          flexShrink: 0
        }}>
        
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12
          }}>
          
          <div
            style={{
              flex: 1,
              minWidth: 0
            }}>
            
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: fg,
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
              
              {selectedFolder ?
              folders.find((f: any) => f.id === selectedFolder)?.name ||
              'Question Bank' :
              'Question Bank'}
              {selectedFolder &&
              folders.find((f: any) => f.id === selectedFolder)?.locked &&
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '1px 7px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  background: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fde68a',
                  flexShrink: 0
                }}>
                
                    <i
                  className="fa-solid fa-lock"
                  style={{
                    fontSize: 9
                  }} />
                {' '}
                    Locked
                  </span>
              }
              {selectedFolder &&
              folders.find((f: any) => f.id === selectedFolder)?.
              isPrivateSpace &&
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '1px 7px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  background: '#fdf4ff',
                  color: '#a21caf',
                  border: '1px solid #f0abfc',
                  flexShrink: 0
                }}>
                
                    <i
                  className="fa-solid fa-lock-keyhole"
                  style={{
                    fontSize: 9
                  }} />
                {' '}
                    Private Space
                  </span>
              }
              {selectedFolder &&
              folders.find((f: any) => f.id === selectedFolder)?.
              isQuestionSet &&
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '1px 7px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  background: '#dbeafe',
                  color: '#1d4ed8',
                  border: '1px solid #93c5fd',
                  flexShrink: 0
                }}>
                
                    <i
                  className="fa-solid fa-rectangle-list"
                  style={{
                    fontSize: 9
                  }} />
                {' '}
                    Question Set
                  </span>
              }
              {isCourseOffering &&
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '1px 7px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  background: '#ccfbf1',
                  color: '#0f766e',
                  border: '1px solid #99f6e4',
                  flexShrink: 0
                }}>
                
                  <i
                  className="fa-solid fa-calendar"
                  style={{
                    fontSize: 9
                  }} />
                {' '}
                  Course Offering
                </span>
              }
            </h1>
            <p
              style={{
                margin: '3px 0 0',
                fontSize: 13,
                color: mfg,
                lineHeight: 1
              }}>
              
              {filteredQuestions.length} question
              {filteredQuestions.length !== 1 ? 's' : ''} · Last updated now
            </p>
            {isCourseOffering && workspaceMembers.length > 0 &&
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 4,
                flexWrap: 'wrap'
              }}>
              
                {workspaceMembers.slice(0, 4).map(
                (
                m: {
                  name: string;
                  role: string;
                },
                i: number) =>
                {
                  const initials = m.name.
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
                  '#0f766e',
                  '#64748b',
                  '#7c3aed'];

                  const color = colors[i % colors.length];
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                      
                        <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: color + '18',
                          color,
                          fontSize: 8,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                        
                          {initials}
                        </div>
                        <span
                        style={{
                          fontSize: 12,
                          color: '#475569'
                        }}>
                        
                          {m.name}
                        </span>
                        {m.role === 'external' &&
                      <span
                        style={{
                          fontSize: 10,
                          padding: '0px 5px',
                          borderRadius: 4,
                          background: '#f1f5f9',
                          color: '#94a3b8',
                          fontWeight: 500
                        }}>
                        
                            View only
                          </span>
                      }
                      </div>);

                }
              )}
                {workspaceMembers.length > 4 &&
              <span
                style={{
                  fontSize: 12,
                  color: '#94a3b8',
                  fontWeight: 500
                }}>
                
                    +{workspaceMembers.length - 4} more
                  </span>
              }
              </div>
            }
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
              paddingTop: 2
            }}>
            
            {/* Split Write button */}
            <div
              style={{
                position: 'relative'
              }}>
              
              <div
                style={{
                  display: 'flex',
                  borderRadius: 7,
                  overflow: 'hidden',
                  border: '1.5px solid #111'
                }}>
                
                <button
                  onClick={() => setNewQuestionOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '6px 13px',
                    background: '#111',
                    color: 'white',
                    border: 'none',
                    borderRight: '1px solid rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600
                  }}
                  onMouseEnter={(e) =>
                  (e.currentTarget as HTMLButtonElement).style.background =
                  '#333'
                  }
                  onMouseLeave={(e) =>
                  (e.currentTarget as HTMLButtonElement).style.background =
                  '#111'
                  }>
                  
                  <i
                    className="fa-regular fa-pen"
                    style={{
                      fontSize: 12,
                      lineHeight: 1
                    }} />
                  {' '}
                  Write
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSplitOpen((o) => !o);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 26,
                    background: '#111',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.75)',
                    padding: 0
                  }}
                  onMouseEnter={(e) =>
                  (e.currentTarget as HTMLButtonElement).style.background =
                  '#333'
                  }
                  onMouseLeave={(e) =>
                  (e.currentTarget as HTMLButtonElement).style.background =
                  '#111'
                  }>
                  
                  <i
                    className="fa-light fa-chevron-down"
                    style={{
                      fontSize: 9,
                      lineHeight: 1
                    }} />
                  
                </button>
              </div>
              {splitOpen &&
              <>
                  <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9998
                  }}
                  onClick={() => setSplitOpen(false)} />
                
                  <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 4px)',
                    zIndex: 9999,
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
                    minWidth: 250,
                    overflow: 'hidden',
                    padding: '4px 0'
                  }}>
                  
                    <div
                    style={{
                      padding: '5px 14px 4px',
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em'
                    }}>
                    
                      Add question
                    </div>
                    <button
                    onClick={() => {
                      setNewQuestionOpen(true);
                      setSplitOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 14px',
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#1e293b',
                      fontSize: 13,
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) =>
                    e.currentTarget.style.background = '#f8fafc'
                    }
                    onMouseLeave={(e) =>
                    e.currentTarget.style.background = 'none'
                    }>
                    
                      <i
                      className="fa-regular fa-pen"
                      style={{
                        fontSize: 13,
                        color: '#475569',
                        width: 16,
                        textAlign: 'center'
                      }} />
                    
                      <div
                      style={{
                        flex: 1
                      }}>
                      
                        <div
                        style={{
                          fontWeight: 600
                        }}>
                        
                          Write
                        </div>
                        <div
                        style={{
                          fontSize: 11,
                          color: '#94a3b8',
                          marginTop: 1
                        }}>
                        
                          Start with a blank question editor
                        </div>
                      </div>
                    </button>
                    <button
                    onClick={() => {
                      setSmartPopOpen(true);
                      setSplitOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 14px',
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#1e293b',
                      fontSize: 13,
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) =>
                    e.currentTarget.style.background = '#f8fafc'
                    }
                    onMouseLeave={(e) =>
                    e.currentTarget.style.background = 'none'
                    }>
                    
                      <i
                      className="fa-regular fa-sparkles"
                      style={{
                        fontSize: 13,
                        color: '#7c3aed',
                        width: 16,
                        textAlign: 'center'
                      }} />
                    
                      <div
                      style={{
                        flex: 1
                      }}>
                      
                        <div
                        style={{
                          fontWeight: 600
                        }}>
                        
                          Smart Populate
                        </div>
                        <div
                        style={{
                          fontSize: 11,
                          color: '#94a3b8',
                          marginTop: 1
                        }}>
                        
                          Promote drafts or auto-collect questions
                        </div>
                      </div>
                      <span
                      style={{
                        fontSize: 10,
                        padding: '1px 5px',
                        borderRadius: 4,
                        background: '#ede9fe',
                        color: '#6d28d9',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                      
                        AI
                      </span>
                    </button>
                    <div
                    style={{
                      borderTop: '1px solid #f1f5f9',
                      margin: '3px 0'
                    }} />
                  
                    <button
                    onClick={() => {
                      setImportOpen(true);
                      setSplitOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 14px',
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#1e293b',
                      fontSize: 13,
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) =>
                    e.currentTarget.style.background = '#f8fafc'
                    }
                    onMouseLeave={(e) =>
                    e.currentTarget.style.background = 'none'
                    }>
                    
                      <i
                      className="fa-regular fa-arrow-up-from-bracket"
                      style={{
                        fontSize: 13,
                        color: '#475569',
                        width: 16,
                        textAlign: 'center'
                      }} />
                    
                      <div
                      style={{
                        flex: 1
                      }}>
                      
                        <div
                        style={{
                          fontWeight: 600
                        }}>
                        
                          Import
                        </div>
                        <div
                        style={{
                          fontSize: 11,
                          color: '#94a3b8',
                          marginTop: 1
                        }}>
                        
                          Upload CSV or QTI file
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              }
            </div>

            <SmartPopulateModal
              isOpen={smartPopOpen}
              onClose={() => setSmartPopOpen(false)}
              questions={questions || []}
              folders={folders || []}
              CURRENT_USER={CURRENT_USER || ''}
              setQuestions={setQuestions || (() => {})}
              personaTrustLevels={personaTrustLevels || {}}
              selectedFolder={selectedFolder}
              handleAutoCollect={handleAutoCollect || (() => {})} />
            

            <button
              onClick={(e) => {
                e.stopPropagation();
                const r = e.currentTarget.getBoundingClientRect();
                setHeaderMenuPos({
                  x: r.right,
                  y: r.bottom
                });
                setHeaderMenuOpen((v: boolean) => !v);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 7,
                border: `1px solid ${bdr}`,
                background: headerMenuOpen ? 'var(--accent)' : 'white',
                cursor: 'pointer',
                color: mfg,
                padding: 0
              }}
              onMouseEnter={(e) =>
              e.currentTarget.style.background = 'var(--accent)'
              }
              onMouseLeave={(e) =>
              e.currentTarget.style.background = headerMenuOpen ?
              'var(--accent)' :
              'white'
              }>
              
              <i
                className="fa-regular fa-ellipsis"
                style={{
                  fontSize: 13
                }} />
              
            </button>
          </div>
        </div>
      </div>

      {/* Header 3-dot dropdown */}
      {headerMenuOpen && headerMenuPos &&
      <>
          <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998
          }}
          onClick={() => setHeaderMenuOpen(false)} />
        
          <div
          style={{
            position: 'fixed',
            top: headerMenuPos.y + 4,
            right: window.innerWidth - headerMenuPos.x,
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            minWidth: 200,
            zIndex: 99999,
            overflow: 'hidden',
            padding: '4px 0'
          }}>
          
            {isAdmin &&
          <>
                <button
              onClick={() => {
                setAdminAssignOpen(true);
                setHeaderMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '8px 14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#1e293b',
                fontSize: 13,
                textAlign: 'left'
              }}
              onMouseEnter={(e) =>
              e.currentTarget.style.background = '#f8fafc'
              }
              onMouseLeave={(e) =>
              e.currentTarget.style.background = 'none'
              }>
              
                  <i
                className="fa-regular fa-user-plus"
                style={{
                  fontSize: 13,
                  color: '#475569',
                  width: 16,
                  textAlign: 'center'
                }} />
              {' '}
                  Assign Faculty
                </button>
                <div
              style={{
                borderTop: '1px solid #f1f5f9',
                margin: '3px 0'
              }} />
            
              </>
          }
            <button
            onClick={() => {
              setImportOpen(true);
              setHeaderMenuOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '8px 14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#1e293b',
              fontSize: 13,
              textAlign: 'left'
            }}
            onMouseEnter={(e) =>
            e.currentTarget.style.background = '#f8fafc'
            }
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
            
              <i
              className="fa-regular fa-arrow-up-from-bracket"
              style={{
                fontSize: 13,
                color: '#475569',
                width: 16,
                textAlign: 'center'
              }} />
            {' '}
              Import Questions
            </button>
            <button
            onClick={() => {
              setExportOpen(true);
              setHeaderMenuOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '8px 14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#1e293b',
              fontSize: 13,
              textAlign: 'left'
            }}
            onMouseEnter={(e) =>
            e.currentTarget.style.background = '#f8fafc'
            }
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
            
              <i
              className="fa-regular fa-arrow-down-to-bracket"
              style={{
                fontSize: 13,
                color: '#475569',
                width: 16,
                textAlign: 'center'
              }} />
            {' '}
              Export Questions
            </button>
            <div
            style={{
              borderTop: '1px solid #f1f5f9',
              margin: '3px 0'
            }} />
          
            <button
            onClick={() => setHeaderMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '8px 14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#1e293b',
              fontSize: 13,
              textAlign: 'left'
            }}
            onMouseEnter={(e) =>
            e.currentTarget.style.background = '#f8fafc'
            }
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
            
              <i
              className="fa-regular fa-gear"
              style={{
                fontSize: 13,
                color: '#475569',
                width: 16,
                textAlign: 'center'
              }} />
            {' '}
              Settings
            </button>
          </div>
        </>
      }

      {/* Search / Filter / Bookmark toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 16px',
          borderBottom: `1px solid ${bdr}`,
          background: 'white',
          flexShrink: 0
        }}>
        
        {/* Search input */}
        <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
          <i
            className="fa-regular fa-magnifying-glass"
            style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              fontSize: 12, color: mfg, pointerEvents: 'none'
            }} />
          
          <input
            type="text"
            placeholder="Search questions..."
            value={p.searchText || ''}
            onChange={(e) => p.setSearchText?.(e.target.value)}
            onFocus={() => p.setSearchOpen?.(true)}
            style={{
              width: '100%', padding: '6px 10px 6px 32px',
              border: `1px solid ${bdr}`, borderRadius: 8,
              fontSize: 12, color: fg, background: '#f8fafc',
              outline: 'none', boxSizing: 'border-box'
            }} />
          
        </div>

        {/* Filter */}
        <button
          onClick={() => p.setFilterSheetOpen?.(true)}
          title="Filters"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 10px', borderRadius: 7,
            border: `1px solid ${bdr}`, background: 'white',
            cursor: 'pointer', fontSize: 12, color: fg
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent,#f1f5f9)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
          
          <i className="fa-regular fa-filter" style={{ fontSize: 12, color: mfg }} />
          Filter
        </button>

        {/* Bookmark / Shortlist */}
        <button
          onClick={() => p.setShowOnlyShortlisted?.((v: boolean) => !v)}
          title={p.showOnlyShortlisted ? 'Show all' : 'Shortlisted only'}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, borderRadius: 7,
            border: `1px solid ${p.showOnlyShortlisted ? br : bdr}`,
            background: p.showOnlyShortlisted ? `color-mix(in oklch,${br} 8%,white)` : 'white',
            cursor: 'pointer', color: p.showOnlyShortlisted ? br : mfg
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent,#f1f5f9)'}
          onMouseLeave={(e) => e.currentTarget.style.background = p.showOnlyShortlisted ? `color-mix(in oklch,${br} 8%,white)` : 'white'}>
          
          <i className={p.showOnlyShortlisted ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'} style={{ fontSize: 13 }} />
        </button>

        {/* Question count */}
        <span style={{ fontSize: 12, color: mfg, marginLeft: 4, whiteSpace: 'nowrap' }}>
          {(p.filteredQuestions || []).length} result{(p.filteredQuestions || []).length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Fixed chevron tooltip */}
      {chevronHoverId && chevronTooltipPos &&
      <div
        style={{
          position: 'fixed',
          top: chevronTooltipPos.y,
          left: chevronTooltipPos.x,
          transform: 'translateX(-50%)',
          background: '#0f172a',
          color: 'white',
          fontSize: 11,
          fontWeight: 500,
          padding: '5px 10px',
          borderRadius: 6,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 99999,
          letterSpacing: '0.01em',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
        
          View settings
          <div
          style={{
            position: 'absolute',
            top: -4,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderBottom: '4px solid #0f172a'
          }} />
        
        </div>
      }
    </>);

}