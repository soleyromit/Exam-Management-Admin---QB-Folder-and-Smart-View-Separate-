import React, { useState } from 'react';

export interface FieldFilters {[field: string]: string[];}

const FIELDS = [
{ key: 'folder', label: 'Folder', faIcon: 'folder' },
{ key: 'type', label: 'Question Type', faIcon: 'circle-question' },
{ key: 'status', label: 'Status', faIcon: 'circle-dot' },
{ key: 'difficulty', label: 'Difficulty', faIcon: 'gauge' },
{ key: 'blooms', label: "Bloom's Level", faIcon: 'brain' },
{ key: 'tags', label: 'Tags', faIcon: 'tag' },
{ key: 'collaborator', label: 'Question Author', faIcon: 'users' }];


const QUICK_TEMPLATES = [
{ label: 'Hard', faIcon: 'fire', filters: { difficulty: ['Hard'] } },
{ label: 'Draft', faIcon: 'pencil', filters: { status: ['Draft'] } },
{ label: 'Active', faIcon: 'circle-check', filters: { status: ['Active', 'Approved'] } },
{ label: 'High Yield', faIcon: 'star', filters: { tags: ['high-yield'] } },
{ label: 'MCQ', faIcon: 'list-check', filters: { type: ['MCQ'] } },
{ label: 'Clinical', faIcon: 'stethoscope', filters: { tags: ['clinical'] } }];


function Sheet({ onClose, children, width = 320 }: {onClose: () => void;children: React.ReactNode;width?: number;}) {
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.18)', zIndex: 400 }} onClick={onClose} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width,
        background: 'var(--card)',
        borderLeft: '1px solid var(--border)',
        zIndex: 401, display: 'flex', flexDirection: 'column',
        boxShadow: '-16px 0 48px rgba(0,0,0,0.10)'
      }}>
        {children}
      </div>
    </>);

}

function SheetHeader({ title, sub, onBack, onClose }: {title: string;sub?: string;onBack?: () => void;onClose: () => void;}) {
  return (
    <div style={{
      padding: '14px 16px',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 8,
      flexShrink: 0,
      background: 'var(--surface)'
    }}>
      {onBack &&
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: '4px', borderRadius: 6, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <i className="fa-regular fa-chevron-left" style={{ fontSize: 14, lineHeight: 1 }} />
        </button>
      }
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 1 }}>{sub}</div>}
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: '4px', borderRadius: 6, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <i className="fa-regular fa-xmark" style={{ fontSize: 14, lineHeight: 1 }} />
      </button>
    </div>);

}

export function FilterSheet({
  isOpen, onClose,
  filters, onFiltersChange,
  allValues,
  onSaveAsView,
  onCreateView,
  smartViews,
  onSelectView










}: {isOpen: boolean;onClose: () => void;filters: FieldFilters;onFiltersChange: (f: FieldFilters) => void;allValues: Record<string, string[]>;onSaveAsView?: (name: string) => void;onCreateView?: () => void;smartViews?: {id: string;name: string;count: number;}[];onSelectView?: (id: string) => void;}) {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [savingView, setSavingView] = useState(false);
  const [viewName, setViewName] = useState('');

  if (!isOpen) return null;

  const activeCount = Object.values(filters).filter((v) => v && v.length).length;
  const af = FIELDS.find((f) => f.key === activeField);

  const getOptions = (key: string) => allValues[key] || [];

  const toggleVal = (field: string, val: string) => {
    const curr = filters[field] || [];
    const next = curr.includes(val) ? curr.filter((v) => v !== val) : [...curr, val];
    const nf = { ...filters };
    if (next.length) nf[field] = next;else
    delete nf[field];
    onFiltersChange(nf);
  };

  const clearField = (field: string) => {
    const nf = { ...filters };delete nf[field];onFiltersChange(nf);
  };

  const handleSaveView = () => {
    if (!viewName.trim()) return;
    onSaveAsView?.(viewName.trim());
    setSavingView(false);
    setViewName('');
  };

  const TAG_COLORS: Record<string, {bg: string;color: string;}> = {
    'high-yield': { bg: '#fee2e2', color: '#b91c1c' },
    'clinical': { bg: '#dbeafe', color: '#1d4ed8' },
    'cardiology': { bg: '#fce7f3', color: '#be185d' },
    'pharmacology': { bg: '#ede9fe', color: '#6d28d9' },
    'neurology': { bg: '#d1fae5', color: '#065f46' },
    'anatomy': { bg: '#fef3c7', color: '#92400e' },
    'physiology': { bg: '#e0f2fe', color: '#0369a1' },
    'stroke': { bg: '#fee2e2', color: '#b91c1c' },
    'imaging': { bg: '#f3f4f6', color: '#374151' },
    'renal': { bg: '#e0f2fe', color: '#0369a1' },
    'NSAIDs': { bg: '#ede9fe', color: '#6d28d9' },
    'anticoagulation': { bg: '#fef3c7', color: '#92400e' },
    'orthopedics': { bg: '#d1fae5', color: '#065f46' }
  };

  function TagChip({ label, selected }: {label: string;selected: boolean;}) {
    const cfg = TAG_COLORS[label] || { bg: 'var(--muted)', color: 'var(--muted-foreground)' };
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 10px', borderRadius: 20,
        fontSize: 11, fontWeight: 500,
        background: selected ? cfg.bg : 'var(--muted)',
        color: selected ? cfg.color : 'var(--muted-foreground)',
        border: selected ? `1.5px solid ${cfg.color}22` : '1.5px solid transparent',
        transition: 'all .15s'
      }}>
        {label}
      </span>);

  }

  return (
    <Sheet onClose={onClose} width={308}>
      <SheetHeader
        title={activeField ? af!.label : 'Filters'}
        sub={
        activeField ?
        `${(filters[activeField] || []).length} selected` :
        activeCount > 0 ? `${activeCount} filter${activeCount > 1 ? 's' : ''} active` :
        undefined
        }
        onBack={activeField ? () => {setActiveField(null);setSearch('');setSavingView(false);} : undefined}
        onClose={onClose} />
      

      {/* New Smart View — always visible at top */}
      {!activeField && onCreateView &&
      <button
        onClick={() => {onCreateView();onClose();}}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '11px 16px', border: 'none',
          background: 'color-mix(in oklch,var(--brand) 6%,white)',
          cursor: 'pointer', textAlign: 'left',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'color-mix(in oklch,var(--brand) 10%,white)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'color-mix(in oklch,var(--brand) 6%,white)'}>
        
          <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fa-regular fa-plus" style={{ fontSize: 12, color: 'var(--brand-foreground)', lineHeight: 1 }} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand)' }}>New Smart View</div>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 1 }}>Create a view with criteria &amp; tags</div>
          </div>
        </button>
      }

      {/* Quick Templates */}
      {!activeField &&
      <div style={{ padding: '10px 16px 10px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Quick Templates</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {QUICK_TEMPLATES.map((t) =>
          <button key={t.label}
          onClick={() => {onFiltersChange(t.filters as FieldFilters);onClose();}}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: 12, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)', cursor: 'pointer', fontWeight: 400, whiteSpace: 'nowrap' }}
          onMouseEnter={(e) => {e.currentTarget.style.background = 'var(--accent)';e.currentTarget.style.borderColor = 'var(--brand)';e.currentTarget.style.color = 'var(--brand)';}}
          onMouseLeave={(e) => {e.currentTarget.style.background = 'var(--card)';e.currentTarget.style.borderColor = 'var(--border)';e.currentTarget.style.color = 'var(--foreground)';}}>
            
                <i className={`fa-regular fa-${t.faIcon}`} style={{ fontSize: 10, lineHeight: 1 }} />
                {t.label}
              </button>
          )}
          </div>
        </div>
      }

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {!activeField ?
        <div style={{ padding: '4px 0' }}>

            {/* Smart Views list */}
            {smartViews && smartViews.length > 0 &&
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 4, marginBottom: 0 }}>
                <div style={{ padding: '10px 16px 4px', fontSize: 10, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Smart Views
                </div>
                {smartViews.map((sv) =>
            <button
              key={sv.id}
              onClick={() => {onSelectView?.(sv.id);onClose();}}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.background = ''}>
              
                    <i className="fa-regular fa-eye" style={{ fontSize: 12, color: 'var(--muted-foreground)', flexShrink: 0, lineHeight: 1 }} />
                    <span style={{ fontSize: 13, color: 'var(--foreground)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sv.name}</span>
                    {sv.count > 0 &&
              <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 9, background: 'var(--muted)', color: 'var(--muted-foreground)', fontWeight: 600, flexShrink: 0 }}>{sv.count}</span>
              }
                    <i className="fa-regular fa-arrow-right" style={{ fontSize: 11, color: 'var(--muted-foreground)', flexShrink: 0, lineHeight: 1 }} />
                  </button>
            )}
              </div>
          }

            {/* Field filters */}
            <div style={{ padding: '6px 16px 4px', fontSize: 10, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>Filter by field</div>
            {FIELDS.map((f) => {
            const n = (filters[f.key] || []).length;
            return (
              <button
                key={f.key}
                onClick={() => {setActiveField(f.key);setSearch('');setSavingView(false);}}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 16px', border: 'none', background: 'none',
                  cursor: 'pointer', textAlign: 'left',
                  borderBottom: '1px solid var(--border)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'}
                onMouseLeave={(e) => e.currentTarget.style.background = ''}>
                
                  <i className={`fa-regular fa-${f.faIcon}`} style={{ fontSize: 12, color: 'var(--muted-foreground)', flexShrink: 0, lineHeight: 1 }} />
                  <span style={{ fontSize: 13, color: 'var(--foreground)', flex: 1, fontWeight: n > 0 ? 500 : 400 }}>
                    {f.label}
                  </span>
                  {n > 0 &&
                <span style={{
                  fontSize: 10, padding: '2px 7px', borderRadius: 10,
                  background: 'var(--brand)', color: 'var(--brand-foreground)',
                  fontWeight: 700, flexShrink: 0
                }}>{n}</span>
                }
                  <i className="fa-regular fa-chevron-right" style={{ fontSize: 11, color: 'var(--muted-foreground)', flexShrink: 0, lineHeight: 1 }} />
                </button>);

          })}
          </div> :
        activeField === 'tags' ?
        <div style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Select tags</span>
              {(filters['tags'] || []).length > 0 &&
            <button onClick={() => clearField('tags')} style={{ fontSize: 12, color: 'var(--destructive)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, padding: 0 }}>Clear</button>
            }
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {getOptions('tags').filter((v) => v.toLowerCase().includes(search.toLowerCase())).map((val) => {
              const checked = (filters['tags'] || []).includes(val);
              return (
                <button key={val} onClick={() => toggleVal('tags', val)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <TagChip label={val} selected={checked} />
                  </button>);

            })}
            </div>
          </div> :

        <div style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Select options</span>
              {(filters[activeField] || []).length > 0 &&
            <button onClick={() => clearField(activeField)} style={{ fontSize: 12, color: 'var(--destructive)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, padding: 0 }}>Clear</button>
            }
            </div>
            <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 10px', borderRadius: 7,
            border: '1px solid var(--border)',
            background: 'var(--input-background)',
            marginBottom: 10
          }}>
              <i className="fa-regular fa-magnifying-glass" style={{ fontSize: 12, color: 'var(--muted-foreground)', flexShrink: 0, lineHeight: 1 }} />
              <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${af!.label.toLowerCase()}...`}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--foreground)', fontSize: 13, flex: 1, minWidth: 0 }} />
            
            </div>
            {getOptions(activeField).
          filter((v) => v.toLowerCase().includes(search.toLowerCase())).
          map((val) => {
            const checked = (filters[activeField] || []).includes(val);
            return (
              <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', cursor: 'pointer', userSelect: 'none', borderBottom: '1px solid var(--border)' }}>
                    <input type="checkbox" checked={checked} onChange={() => toggleVal(activeField, val)} style={{ accentColor: 'var(--brand)', width: 15, height: 15, cursor: 'pointer', flexShrink: 0 }} />
                    {activeField === 'collaborator' &&
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--brand)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--brand-foreground)', flexShrink: 0 }}>
                        {val.replace('Dr. ', '').replace('Prof. ', '').split(' ').map((n: string) => n[0] || '').join('').slice(0, 2).toUpperCase()}
                      </span>
                }
                    <span style={{ fontSize: 13, color: 'var(--foreground)', flex: 1 }}>{val}</span>
                  </label>);

          })}
            {getOptions(activeField).filter((v) => v.toLowerCase().includes(search.toLowerCase())).length === 0 &&
          <div style={{ padding: '20px 0', textAlign: 'center', fontSize: 13, color: 'var(--muted-foreground)' }}>No options found</div>
          }
          </div>
        }
      </div>

      {/* Bottom actions */}
      <div style={{ borderTop: '1px solid var(--border)', flexShrink: 0, background: 'var(--surface)' }}>
        {activeCount > 0 && !savingView &&
        <div style={{
          padding: '10px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: onSaveAsView && activeCount > 0 ? '1px solid var(--border)' : 'none'
        }}>
            <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
              {activeCount} filter{activeCount > 1 ? 's' : ''} active
            </span>
            <button onClick={() => {onFiltersChange({});setActiveField(null);}} style={{ fontSize: 12, fontWeight: 600, color: 'var(--destructive)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Clear all</button>
          </div>
        }
        {onSaveAsView && activeCount > 0 && (
        savingView ?
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>Name this view</div>
              <input autoFocus value={viewName} onChange={(e) => setViewName(e.target.value)}
          onKeyDown={(e) => {if (e.key === 'Enter') handleSaveView();if (e.key === 'Escape') {setSavingView(false);setViewName('');}}}
          placeholder="e.g. Hard Pharmacology questions"
          style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1.5px solid var(--brand)', background: 'var(--card)', color: 'var(--foreground)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSaveView} disabled={!viewName.trim()} style={{ flex: 1, padding: '7px 0', borderRadius: 6, border: 'none', background: viewName.trim() ? 'var(--brand)' : 'var(--muted)', color: viewName.trim() ? 'var(--brand-foreground)' : 'var(--muted-foreground)', fontWeight: 600, fontSize: 13, cursor: viewName.trim() ? 'pointer' : 'not-allowed' }}>Save view</button>
                <button onClick={() => {setSavingView(false);setViewName('');}} style={{ padding: '7px 14px', borderRadius: 6, border: '1px solid var(--border)', background: 'none', color: 'var(--foreground)', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              </div>
            </div> :

        <button onClick={() => setSavingView(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'}
        onMouseLeave={(e) => e.currentTarget.style.background = ''}>
              <i className="fa-regular fa-bookmark" style={{ fontSize: 13, color: 'var(--brand)', flexShrink: 0, lineHeight: 1 }} />
              <span style={{ fontSize: 13, color: 'var(--brand)', fontWeight: 600 }}>Save filters as Smart View</span>
            </button>)

        }
      </div>
    </Sheet>);

}

export function PropertiesSheet({ isOpen, onClose }: {isOpen: boolean;onClose: () => void;}) {
  if (!isOpen) return null;
  const sections = [
  { label: 'Table view', sub: 'Gridlines', faIcon: 'table-cells' },
  { label: 'Filter', sub: 'No filters active', faIcon: 'sliders' },
  { label: 'Sort', sub: 'Sorted by Question', faIcon: 'arrow-up-arrow-down' },
  { label: 'Group', sub: 'No grouping', faIcon: 'layer-group' },
  { label: 'Columns', sub: 'All columns visible', faIcon: 'table-columns' },
  { label: 'Conditional rules', sub: 'No rules applied', faIcon: 'paintbrush' }];

  const viewTypes = [
  { label: 'Table', faIcon: 'table-cells-large' },
  { label: 'List', faIcon: 'list' },
  { label: 'Board', faIcon: 'table-list' },
  { label: 'Analytics', faIcon: 'chart-bar' }];

  return (
    <Sheet onClose={onClose} width={340}>
      <SheetHeader title="Properties" sub="Library" onClose={onClose} />
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>View type</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
          {viewTypes.map((v, i) =>
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '9px 4px', borderRadius: 8, border: `1.5px solid ${i === 0 ? 'var(--brand)' : 'var(--border)'}`, background: i === 0 ? 'color-mix(in oklch,var(--brand) 8%,white)' : 'transparent', cursor: 'pointer' }}>
              <i className={`${i === 0 ? 'fa-solid' : 'fa-regular'} fa-${v.faIcon}`} style={{ fontSize: 16, color: i === 0 ? 'var(--brand)' : 'var(--muted-foreground)', lineHeight: 1 }} />
              <span style={{ fontSize: 10, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--brand)' : 'var(--muted-foreground)', textAlign: 'center', lineHeight: 1.3 }}>{v.label}</span>
            </div>
          )}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {sections.map((s, i) =>
        <button key={i} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', border: 'none', borderBottom: '1px solid var(--border)', background: 'none', cursor: 'pointer', textAlign: 'left' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'}
        onMouseLeave={(e) => e.currentTarget.style.background = ''}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={`fa-regular fa-${s.faIcon}`} style={{ fontSize: 14, color: 'var(--muted-foreground)', lineHeight: 1 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 1 }}>{s.sub}</div>
            </div>
            <i className="fa-regular fa-chevron-right" style={{ fontSize: 12, color: 'var(--muted-foreground)', flexShrink: 0, lineHeight: 1 }} />
          </button>
        )}
      </div>
    </Sheet>);

}