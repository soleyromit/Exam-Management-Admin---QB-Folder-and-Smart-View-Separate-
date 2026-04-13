import React, { useState } from 'react';
import type { Role } from '../types';
import { THEMES, type ThemeKey, type ThemeConfig } from '../themes';

function FaIcon({ className, style }: {className: string;style?: React.CSSProperties;}) {
  return <i className={className} aria-hidden="true" style={{ fontSize: 14, ...style }} />;
}

const FG = 'var(--foreground)';
const MFG = 'var(--muted-foreground)';

const ROLES: {id: Role;label: string;short: string;accent: string;faIcon: string;desc: string;}[] = [
{ id: 'dept-head', label: 'Admin', short: 'A', accent: 'var(--brand)', faIcon: 'fa-light fa-shield-halved', desc: 'Full institution access' },
{ id: 'faculty', label: 'Faculty', short: 'F', accent: 'var(--brand)', faIcon: 'fa-light fa-graduation-cap', desc: 'Scoped to assigned courses' }];


type NavItem = {id: string;label: string;faIcon: string;};
const NAV: NavItem[] = [
{ id: 'home', label: 'Dashboard', faIcon: 'fa-light fa-house' },
{ id: 'question-bank', label: 'Question Bank', faIcon: 'fa-light fa-book-open' }];


function toSolid(icon: string) {
  return icon.replace('fa-light', 'fa-solid');
}

export function Sidebar({
  role, onRoleChange,
  collapsed, onToggleCollapse,
  activePage, onNavigate,
  themeKey, onThemeChange,
  qbLeftOpen, onToggleQBLeft











}: {role: Role;onRoleChange: (r: Role) => void;collapsed: boolean;onToggleCollapse: () => void;activePage?: string;onNavigate?: (page: string) => void;themeKey?: ThemeKey;onThemeChange?: (k: ThemeKey) => void;qbLeftOpen?: boolean;onToggleQBLeft?: () => void;}) {
  const [roleDropOpen, setRoleDropOpen] = useState(false);
  const current = ROLES.find((r) => r.id === role) ?? ROLES[0];
  const isFacultyRole = role === 'faculty';

  return (
    <aside
      style={{
        width: collapsed ? 52 : 240,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        background: 'var(--sidebar)',
        borderRight: 'none',
        transition: 'width 0.15s ease',
        overflow: 'hidden',
        position: 'relative'
      }}>
      
      {/* Logo row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 10px', height: 52, flexShrink: 0,
        borderBottom: '1px solid var(--sidebar-border)'
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0, overflow: 'hidden' }}>
          <img
            src="/Exxat_Prism.svg"
            alt="Exxat"
            style={{
              height: 22,
              width: collapsed ? 28 : 'auto',
              maxWidth: collapsed ? 28 : 130,
              objectFit: 'contain',
              objectPosition: 'left center',
              transition: 'width 0.15s ease, max-width 0.15s ease',
              flexShrink: 0
            }} />
          
        </div>
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand' : 'Collapse'}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, flexShrink: 0, color: MFG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          <FaIcon className={collapsed ? 'fa-light fa-chevron-right' : 'fa-light fa-chevron-left'} />
        </button>
      </div>

      {/* Institution row */}
      {!collapsed &&
      <button style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
        width: '100%', textAlign: 'left', background: 'transparent', border: 'none',
        cursor: 'pointer', borderBottom: '1px solid var(--sidebar-border)', flexShrink: 0
      }}>
          <div style={{
          width: 24, height: 24, borderRadius: '50%', background: 'var(--sidebar-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
            <FaIcon className="fa-light fa-graduation-cap" style={{ color: MFG }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: FG }}>Touro University</div>
            <div style={{ fontSize: 11, color: MFG }}>PA Studies</div>
          </div>
          <FaIcon className="fa-light fa-chevron-right" style={{ color: MFG }} />
        </button>
      }

      {/* Role selector */}
      <div style={{
        padding: collapsed ? '6px 4px' : '6px 8px',
        borderBottom: '1px solid var(--sidebar-border)',
        flexShrink: 0,
        position: 'relative'
      }}>
        {!collapsed &&
        <div style={{ fontSize: 10, fontWeight: 700, color: MFG, textTransform: 'uppercase', letterSpacing: '0.06em', paddingLeft: 4, marginBottom: 4 }}>
            Viewing as
          </div>
        }
        <button
          onClick={() => setRoleDropOpen(!roleDropOpen)}
          title={collapsed ? current.label : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: collapsed ? '5px 4px' : '6px 8px',
            borderRadius: 8,
            background: roleDropOpen ? 'var(--sidebar-accent)' : 'transparent',
            border: `1px solid ${roleDropOpen ? 'var(--brand)' : 'var(--sidebar-border)'}`,
            cursor: 'pointer', textAlign: 'left',
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'all 0.1s'
          }}>
          
          <div style={{
            width: collapsed ? 26 : 28, height: collapsed ? 26 : 28,
            borderRadius: 7,
            background: current.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <FaIcon className={current.faIcon} style={{ color: '#fff', fontSize: 12 }} />
          </div>
          {!collapsed &&
          <>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: FG, lineHeight: 1.3 }}>{current.label}</div>
                <div style={{ fontSize: 10, color: MFG, lineHeight: 1.2 }}>{current.desc}</div>
              </div>
              <FaIcon
              className={`fa-light ${roleDropOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}
              style={{ color: MFG, fontSize: 10, flexShrink: 0 }} />
            
            </>
          }
        </button>
        {roleDropOpen &&
        <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setRoleDropOpen(false)} />
            <div style={{
            position: 'absolute', top: '100%', left: 8, right: 8, marginTop: 4,
            background: 'var(--card)', borderRadius: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.07)',
            zIndex: 50, overflow: 'hidden', minWidth: 196
          }}>
              <div style={{ padding: '7px 10px', fontSize: 10, fontWeight: 700, color: MFG, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--muted)' }}>
                Switch role
              </div>
              {ROLES.map((r) =>
            <button
              key={r.id}
              onClick={() => {onRoleChange(r.id);setRoleDropOpen(false);}}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                width: '100%', padding: '8px 10px',
                background: r.id === role ? 'var(--muted)' : 'transparent',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.1s'
              }}
              onMouseEnter={(e) => {if (r.id !== role) e.currentTarget.style.background = 'var(--accent)';}}
              onMouseLeave={(e) => {if (r.id !== role) e.currentTarget.style.background = 'transparent';}}>
              
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: r.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaIcon className={r.faIcon} style={{ color: '#fff', fontSize: 11 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: FG, lineHeight: 1.3 }}>{r.label}</div>
                    <div style={{ fontSize: 10, color: MFG, lineHeight: 1.2 }}>{r.desc}</div>
                  </div>
                  {r.id === role && <FaIcon className="fa-solid fa-circle-check" style={{ color: 'var(--brand)', fontSize: 12, flexShrink: 0 }} />}
                </button>
            )}
              <div style={{ padding: '7px 10px', borderTop: '1px solid var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <FaIcon className="fa-light fa-circle-info" style={{ color: MFG, fontSize: 11, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: MFG }}>
                  {isFacultyRole ? 'Faculty view: scoped to assigned courses' : 'Admin view: full institution access'}
                </span>
              </div>
            </div>
          </>
        }
      </div>

      {/* Main nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '6px 8px' }}>
        {NAV.map((item) => {
          const isActive = activePage === item.id;
          const iconClass = isActive ? toSolid(item.faIcon) : item.faIcon;
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onNavigate?.(item.id)}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate?.(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: collapsed ? '0' : '0 10px',
                height: 36, borderRadius: 7,
                fontSize: 13, fontWeight: isActive ? 600 : 400, color: FG,
                background: isActive ? 'var(--sidebar-accent)' : 'transparent',
                cursor: 'pointer', textAlign: 'left',
                justifyContent: collapsed ? 'center' : 'flex-start',
                transition: 'background 0.1s', outline: 'none', marginBottom: 1
              }}
              onMouseEnter={(e) => {(e.currentTarget as HTMLDivElement).style.background = 'var(--sidebar-accent)';}}
              onMouseLeave={(e) => {if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent';}}>
              
              <FaIcon className={iconClass} style={{ flexShrink: 0, color: isActive ? 'var(--brand)' : FG }} />
              {!collapsed && <span style={{ flex: 1, fontSize: 13, color: FG }}>{item.label}</span>}
            </div>);

        })}
      </nav>

      {/* Bottom: theme + user */}
      <div style={{ padding: 8, flexShrink: 0, borderTop: '1px solid var(--sidebar-border)' }}>
        <div style={{ marginBottom: 4 }}>
          {!collapsed ?
          <>
              <div style={{ fontSize: 10, fontWeight: 600, color: MFG, textTransform: 'uppercase', letterSpacing: '0.06em', paddingLeft: 2, marginBottom: 6 }}>Product Theme</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {themeKey && <div style={{ width: 10, height: 10, borderRadius: '50%', background: THEMES[themeKey].swatch, flexShrink: 0, boxShadow: '0 0 0 1.5px rgba(0,0,0,0.15)' }} />}
                <select
                value={themeKey || 'exam'}
                onChange={(e) => onThemeChange?.(e.target.value as ThemeKey)}
                style={{ flex: 1, fontSize: 12, color: FG, background: 'var(--sidebar-accent)', border: '1px solid var(--sidebar-border)', borderRadius: 6, padding: '3px 6px', cursor: 'pointer', fontFamily: 'inherit', outline: 'none' }}>
                
                  {(Object.entries(THEMES) as [ThemeKey, ThemeConfig][]).map(([key, t]) =>
                <option key={key} value={key}>{t.label}</option>
                )}
                </select>
              </div>
            </> :

          themeKey &&
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: THEMES[themeKey].swatch, boxShadow: '0 0 0 2px rgba(0,0,0,0.15)', margin: '2px auto' }} />
              </div>

          }
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: collapsed ? '5px 0' : '6px 8px', borderRadius: 8, justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: current.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {current.short}
          </div>
          {!collapsed &&
          <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: FG }}>Dr. Patel</div>
              <div style={{ fontSize: 11, color: MFG }}>patel@touro.edu</div>
            </div>
          }
        </div>
      </div>
    </aside>);

}