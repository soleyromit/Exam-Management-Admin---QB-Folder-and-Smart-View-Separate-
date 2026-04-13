import React, { useState } from 'react';
import type { Role } from '../types';
import { THEMES, type ThemeKey, type ThemeConfig } from '../themes';
function FaIcon({
  className,
  style



}: {className: string;style?: React.CSSProperties;}) {
  return (
    <i
      className={className}
      aria-hidden="true"
      style={{
        fontSize: 14,
        ...style
      }} />);


}
const FG = 'var(--foreground)';
const MFG = 'var(--muted-foreground)';
const ROLES: {
  id: Role;
  label: string;
  short: string;
  accent: string;
  faIcon: string;
  desc: string;
}[] = [
{
  id: 'dept-head',
  label: 'Dept Head / PD',
  short: 'DH',
  accent: 'var(--destructive)',
  faIcon: 'fa-light fa-shield-halved',
  desc: 'Review, approve, govern'
},
{
  id: 'inst-admin',
  label: 'Institution Admin',
  short: 'IA',
  accent: 'var(--brand)',
  faIcon: 'fa-light fa-eye',
  desc: 'Audit + configure'
},
{
  id: 'outcome-director',
  label: 'Outcome Director',
  short: 'OD',
  accent: 'var(--warning)',
  faIcon: 'fa-light fa-bullseye',
  desc: 'Competency + accreditation'
},
{
  id: 'faculty',
  label: 'Faculty',
  short: 'F',
  accent: 'var(--brand)',
  faIcon: 'fa-light fa-graduation-cap',
  desc: 'Build, publish, score'
},
{
  id: 'contributor',
  label: 'Contributor',
  short: 'C',
  accent: 'var(--chart-2)',
  faIcon: 'fa-light fa-users',
  desc: 'Add questions'
},
{
  id: 'reviewer',
  label: 'Reviewer',
  short: 'R',
  accent: 'var(--success)',
  faIcon: 'fa-light fa-circle-check',
  desc: 'Approve drafts'
}];

type NavItem = {
  id: string;
  label: string;
  faIcon: string;
};
const NAV: NavItem[] = [
{
  id: 'home',
  label: 'Dashboard',
  faIcon: 'fa-light fa-house'
},
{
  id: 'question-bank',
  label: 'Question Bank',
  faIcon: 'fa-light fa-book-open'
}];

function toSolid(icon: string) {
  return icon.replace('fa-light', 'fa-solid');
}
export function Sidebar({
  role,
  onRoleChange,
  collapsed,
  onToggleCollapse,
  activePage,
  onNavigate,
  themeKey,
  onThemeChange,
  qbLeftOpen,
  onToggleQBLeft











}: {role: Role;onRoleChange: (r: Role) => void;collapsed: boolean;onToggleCollapse: () => void;activePage?: string;onNavigate?: (page: string) => void;themeKey?: ThemeKey;onThemeChange?: (k: ThemeKey) => void;qbLeftOpen?: boolean;onToggleQBLeft?: () => void;}) {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const current = ROLES.find((r) => r.id === role)!;
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
      
      {/* ── Logo row ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 10px',
          height: 52,
          flexShrink: 0,
          borderBottom: '1px solid var(--sidebar-border)'
        }}>
        
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
            overflow: 'hidden'
          }}>
          
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
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            borderRadius: 6,
            flexShrink: 0,
            color: MFG,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          
          <FaIcon
            className={
            collapsed ?
            'fa-light fa-chevron-right' :
            'fa-light fa-chevron-left'
            } />
          
        </button>
      </div>

      {/* ── Institution row ── */}
      {!collapsed &&
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          width: '100%',
          textAlign: 'left',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          borderBottom: '1px solid var(--sidebar-border)',
          flexShrink: 0
        }}>
        
          <div
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'var(--sidebar-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
          
            <FaIcon
            className="fa-light fa-graduation-cap"
            style={{
              color: MFG
            }} />
          
          </div>
          <div
          style={{
            flex: 1,
            minWidth: 0
          }}>
          
            <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: FG
            }}>
            
              Touro University
            </div>
            <div
            style={{
              fontSize: 11,
              color: MFG
            }}>
            
              PA Studies
            </div>
          </div>
          <FaIcon
          className="fa-light fa-chevron-right"
          style={{
            color: MFG
          }} />
        
        </button>
      }

      {/* ── Main nav ── */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '6px 8px'
        }}>
        
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
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: collapsed ? '0' : '0 10px',
                height: 36,
                borderRadius: 7,
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: FG,
                background: isActive ? 'var(--sidebar-accent)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                justifyContent: collapsed ? 'center' : 'flex-start',
                transition: 'background 0.1s',
                outline: 'none',
                marginBottom: 1
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.background =
                'var(--sidebar-accent)';
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                (e.currentTarget as HTMLDivElement).style.background =
                'transparent';
              }}>
              
              <FaIcon
                className={iconClass}
                style={{
                  flexShrink: 0,
                  color: isActive ? 'var(--brand)' : FG
                }} />
              
              {!collapsed &&
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: FG
                }}>
                
                  {item.label}
                </span>
              }
            </div>);

        })}
      </nav>

      {/* ── Bottom: Theme + User profile ── */}
      <div
        style={{
          padding: 8,
          flexShrink: 0,
          borderTop: '1px solid var(--sidebar-border)'
        }}>
        
        {/* Theme picker */}
        <div
          style={{
            marginBottom: 8,
            paddingBottom: 8,
            borderBottom: '1px solid var(--sidebar-border)'
          }}>
          
          {!collapsed ?
          <>
              <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: MFG,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                paddingLeft: 2,
                marginBottom: 6
              }}>
              
                Product Theme
              </div>
              <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
              
                {themeKey &&
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: THEMES[themeKey].swatch,
                  flexShrink: 0,
                  boxShadow: '0 0 0 1.5px rgba(0,0,0,0.15)'
                }} />

              }
                <select
                value={themeKey || 'exam'}
                onChange={(e) => onThemeChange?.(e.target.value as ThemeKey)}
                style={{
                  flex: 1,
                  fontSize: 12,
                  color: FG,
                  background: 'var(--sidebar-accent)',
                  border: '1px solid var(--sidebar-border)',
                  borderRadius: 6,
                  padding: '3px 6px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}>
                
                  {(Object.entries(THEMES) as [ThemeKey, ThemeConfig][]).map(
                  ([key, t]) =>
                  <option key={key} value={key}>
                        {t.label}
                      </option>

                )}
                </select>
              </div>
            </> :

          themeKey &&
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: 4
            }}>
            
                <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: THEMES[themeKey].swatch,
                boxShadow: '0 0 0 2px rgba(0,0,0,0.15)',
                margin: '2px auto'
              }} />
            
              </div>

          }
        </div>

        {/* User / role switcher */}
        <div
          style={{
            position: 'relative'
          }}>
          
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            title={collapsed ? current.label : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: collapsed ? '6px 0' : '6px 10px',
              borderRadius: 8,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              justifyContent: collapsed ? 'center' : 'flex-start'
            }}>
            
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: current.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0
              }}>
              
              {current.short}
            </div>
            {!collapsed &&
            <div
              style={{
                flex: 1,
                minWidth: 0
              }}>
              
                <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: FG
                }}>
                
                  {current.label}
                </div>
                <div
                style={{
                  fontSize: 11,
                  color: MFG
                }}>
                
                  {current.desc}
                </div>
              </div>
            }
          </button>

          {roleMenuOpen &&
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              right: 0,
              marginBottom: 4,
              background: 'var(--card)',
              borderRadius: 12,
              boxShadow:
              '0 4px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.08)',
              zIndex: 50,
              overflow: 'hidden'
            }}>
            
              <div
              style={{
                padding: '6px 10px',
                fontSize: 10,
                fontWeight: 600,
                color: MFG,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                borderBottom: '1px solid var(--muted)'
              }}>
              
                Switch role
              </div>
              {ROLES.map((r) =>
            <button
              key={r.id}
              onClick={() => {
                onRoleChange(r.id);
                setRoleMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '8px 10px',
                background: r.id === role ? 'var(--muted)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
              }}>
              
                  <FaIcon
                className={r.faIcon}
                style={{
                  color: MFG
                }} />
              
                  <div
                style={{
                  flex: 1
                }}>
                
                    <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: FG
                  }}>
                  
                      {r.label}
                    </div>
                    <div
                  style={{
                    fontSize: 11,
                    color: MFG
                  }}>
                  
                      {r.desc}
                    </div>
                  </div>
                  {r.id === role &&
              <FaIcon
                className="fa-light fa-circle-check"
                style={{
                  color: 'var(--brand)'
                }} />

              }
                </button>
            )}
            </div>
          }
        </div>
      </div>
    </aside>);

}