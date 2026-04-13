import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Link2,
  Bell,
  Globe,
  Database,
  CheckCircle2,
  ChevronRight } from
'lucide-react';
/* ══ SETTINGS — Vercel settings pattern: sidebar + content area ══
   Clean, no cards-in-cards. Each section is a simple list of rows.
   Toggle pattern: localhost switch with var(--brand) active color */
type Tab =
'general' |
'roles' |
'integrations' |
'notifications' |
'accessibility' |
'data';
const TABS: {
  id: Tab;
  label: string;
  icon: React.ElementType;
}[] = [
{
  id: 'general',
  label: 'General',
  icon: Settings
},
{
  id: 'roles',
  label: 'Roles & Permissions',
  icon: Shield
},
{
  id: 'integrations',
  label: 'LMS Integrations',
  icon: Link2
},
{
  id: 'notifications',
  label: 'Notifications',
  icon: Bell
},
{
  id: 'accessibility',
  label: 'Accessibility',
  icon: Globe
},
{
  id: 'data',
  label: 'Data & Export',
  icon: Database
}];

const INTEGRATIONS = [
{
  name: 'Canvas LMS',
  status: 'connected' as const,
  protocol: 'LTI 1.3',
  sync: '2 hrs ago',
  courses: 12
},
{
  name: 'Respondus LockDown',
  status: 'connected' as const,
  protocol: 'API',
  sync: '1 day ago',
  courses: null
},
{
  name: 'Exxat Prism',
  status: 'connected' as const,
  protocol: 'Native',
  sync: 'Real-time',
  courses: null
},
{
  name: 'Blackboard Ultra',
  status: 'available' as const,
  protocol: 'LTI 1.3',
  sync: null,
  courses: 0
},
{
  name: 'D2L Brightspace',
  status: 'available' as const,
  protocol: 'LTI 1.3',
  sync: null,
  courses: 0
}];

const ROLES = [
{
  role: 'Department Head',
  users: 3,
  perms: [
  'Full access',
  'Approve questions',
  'Publish exams',
  'View all analytics'],

  color: 'var(--destructive)'
},
{
  role: 'Faculty',
  users: 24,
  perms: ['Create questions', 'Build exams', 'Grade', 'Course analytics'],
  color: 'var(--brand)'
},
{
  role: 'Contributor',
  users: 8,
  perms: ['Add questions to assigned sections', 'View own questions'],
  color: 'var(--chart-2)'
},
{
  role: 'Reviewer',
  users: 6,
  perms: ['Review & approve assigned questions', 'Comment on drafts'],
  color: 'var(--warning)'
}];

function Toggle({ on, onClick }: {on: boolean;onClick?: () => void;}) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: on ? 'var(--brand)' : 'var(--border-control)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.15s',
        flexShrink: 0
      }}>
      
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: 'var(--card)',
          position: 'absolute',
          top: 2,
          left: on ? 18 : 2,
          transition: 'left 0.15s',
          boxShadow: '0 1px 2px rgba(0,0,0,0.15)'
        }} />
      
    </div>);

}
export function SettingsPage() {
  const [tab, setTab] = useState<Tab>('general');
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    'Require peer review before publish': true,
    'Auto-flag negative PBis questions': true,
    'Enable AI features': true,
    'Question submitted for review': true,
    'Question approved or rejected': true,
    'Exam published': true,
    'Student submissions complete': false,
    'Grading deadline approaching': true,
    'Item flagged (negative PBis)': true,
    'LMS grade sync failure': true,
    'Text-to-speech available by default': true,
    'On-screen keyboard available': false,
    'High contrast mode available': true,
    'Calculator available by default': false,
    'Focus mode available': true,
    'Alt text required on all images': true,
    'Captions required on all media': true,
    'Publish gate enforcement': true
  });
  const handleToggle = (key: string) => {
    setToggles((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  return (
    <div className="flex-1 overflow-y-auto">
      <div
        style={{
          display: 'flex',
          minHeight: 'calc(100vh - 100px)'
        }}>
        
        {/* Sidebar */}
        <div
          style={{
            width: 200,
            flexShrink: 0,
            padding: 12,
            borderRight: '1px solid var(--border)',
            background: 'var(--card)'
          }}>
          
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--muted-foreground)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '4px 8px',
              marginBottom: 4
            }}>
            
            Settings
          </div>
          {TABS.map((t) =>
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '7px 10px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: tab === t.id ? 500 : 400,
              color:
              tab === t.id ?
              'var(--foreground)' :
              'var(--muted-foreground)',
              background: tab === t.id ? 'var(--accent)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              marginBottom: 2
            }}>
            
              <t.icon
              style={{
                width: 14,
                height: 14
              }} />
            {' '}
              {t.label}
            </button>
          )}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto'
          }}>
          
          {tab === 'general' &&
          <div>
              <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--foreground)',
                marginBottom: 4
              }}>
              
                General
              </h2>
              <p
              style={{
                fontSize: 12,
                color: 'var(--muted-foreground)',
                marginBottom: 16
              }}>
              
                Institution-level settings for exam management.
              </p>
              {[
            {
              label: 'Institution name',
              value: 'Touro University',
              type: 'text'
            },
            {
              label: 'Default exam duration',
              value: '90 minutes',
              type: 'text'
            },
            {
              label: 'Question bank sharing',
              value: 'Cross-department',
              type: 'text'
            },
            {
              label: 'Require peer review before publish',
              type: 'toggle'
            },
            {
              label: 'Auto-flag negative PBis questions',
              type: 'toggle'
            },
            {
              label: 'Enable AI features',
              type: 'toggle'
            },
            {
              label: 'Student result visibility',
              value: 'After faculty release',
              type: 'text'
            }].
            map((s, i) =>
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid var(--border)'
              }}>
              
                  <span
                style={{
                  fontSize: 13,
                  color: 'var(--foreground)'
                }}>
                
                    {s.label}
                  </span>
                  {s.type === 'toggle' ?
              <Toggle
                on={toggles[s.label]}
                onClick={() => handleToggle(s.label)} /> :


              <span
                style={{
                  fontSize: 12,
                  color: 'var(--muted-foreground)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--muted)',
                  border: '1px solid var(--border)'
                }}>
                
                      {s.value as string}
                    </span>
              }
                </div>
            )}
            </div>
          }

          {tab === 'integrations' &&
          <div>
              <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--foreground)',
                marginBottom: 4
              }}>
              
                LMS Integrations
              </h2>
              <p
              style={{
                fontSize: 12,
                color: 'var(--muted-foreground)',
                marginBottom: 16
              }}>
              
                Connect to your LMS for grade sync and single sign-on via LTI.
              </p>
              {INTEGRATIONS.map((int, i) =>
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 0',
                borderBottom: '1px solid var(--border)'
              }}>
              
                  <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--foreground)',
                  flexShrink: 0
                }}>
                
                    {int.name[0]}
                  </div>
                  <div
                style={{
                  flex: 1
                }}>
                
                    <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                  
                      <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--foreground)'
                    }}>
                    
                        {int.name}
                      </span>
                      <span
                    style={{
                      fontSize: 10,
                      padding: '1px 5px',
                      borderRadius: 3,
                      background: 'var(--muted)',
                      color: 'var(--muted-foreground)'
                    }}>
                    
                        {int.protocol}
                      </span>
                    </div>
                    {int.status === 'connected' &&
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--muted-foreground)'
                  }}>
                  
                        Last sync: {int.sync}
                        {int.courses !== null ?
                  ` · ${int.courses} courses` :
                  ''}
                      </div>
                }
                  </div>
                  {int.status === 'connected' ?
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                
                      <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    fontSize: 11,
                    color: '#15803d'
                  }}>
                  
                        <CheckCircle2
                    style={{
                      width: 12,
                      height: 12
                    }} />
                  {' '}
                        Connected
                      </span>
                      <button
                  style={{
                    fontSize: 11,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer'
                  }}>
                  
                        Configure
                      </button>
                    </div> :

              <button
                style={{
                  fontSize: 11,
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500
                }}>
                
                      Connect
                    </button>
              }
                </div>
            )}
            </div>
          }

          {tab === 'roles' &&
          <div>
              <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--foreground)',
                marginBottom: 4
              }}>
              
                Roles & Permissions
              </h2>
              <p
              style={{
                fontSize: 12,
                color: 'var(--muted-foreground)',
                marginBottom: 16
              }}>
              
                What each role can see and do in exam management.
              </p>
              {ROLES.map((r, i) =>
            <div
              key={i}
              style={{
                padding: '14px 0',
                borderBottom: '1px solid var(--border)'
              }}>
              
                  <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6
                }}>
                
                    <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                  
                      <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: r.color
                    }} />
                  
                      <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--foreground)'
                    }}>
                    
                        {r.role}
                      </span>
                      <span
                    style={{
                      fontSize: 11,
                      color: 'var(--muted-foreground)'
                    }}>
                    
                        {r.users} users
                      </span>
                    </div>
                    <button
                  style={{
                    fontSize: 11,
                    color: 'var(--brand)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}>
                  
                      Edit
                    </button>
                  </div>
                  <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 4
                }}>
                
                    {r.perms.map((p) =>
                <span
                  key={p}
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 3,
                    background: 'var(--muted)',
                    color: 'var(--muted-foreground)'
                  }}>
                  
                        {p}
                      </span>
                )}
                  </div>
                </div>
            )}
            </div>
          }

          {tab === 'notifications' &&
          <div>
              <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--foreground)',
                marginBottom: 4
              }}>
              
                Notifications
              </h2>
              <p
              style={{
                fontSize: 12,
                color: 'var(--muted-foreground)',
                marginBottom: 16
              }}>
              
                When and how you receive alerts.
              </p>
              {[
            {
              label: 'Question submitted for review'
            },
            {
              label: 'Question approved or rejected'
            },
            {
              label: 'Exam published'
            },
            {
              label: 'Student submissions complete'
            },
            {
              label: 'Grading deadline approaching'
            },
            {
              label: 'Item flagged (negative PBis)'
            },
            {
              label: 'LMS grade sync failure'
            }].
            map((n, i) =>
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid var(--border)'
              }}>
              
                  <span
                style={{
                  fontSize: 13,
                  color: 'var(--foreground)'
                }}>
                
                    {n.label}
                  </span>
                  <Toggle
                on={toggles[n.label]}
                onClick={() => handleToggle(n.label)} />
              
                </div>
            )}
            </div>
          }

          {tab === 'accessibility' &&
          <div>
              <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--foreground)',
                marginBottom: 4
              }}>
              
                Accessibility Defaults
              </h2>
              <p
              style={{
                fontSize: 12,
                color: 'var(--muted-foreground)',
                marginBottom: 16
              }}>
              
                Institution-wide defaults. Individual exams can override.
              </p>
              {[
            {
              label: 'Text-to-speech available by default'
            },
            {
              label: 'On-screen keyboard available'
            },
            {
              label: 'High contrast mode available'
            },
            {
              label: 'Calculator available by default'
            },
            {
              label: 'Focus mode available'
            },
            {
              label: 'Alt text required on all images'
            },
            {
              label: 'Captions required on all media'
            },
            {
              label: 'Publish gate enforcement'
            }].
            map((n, i) =>
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid var(--border)'
              }}>
              
                  <span
                style={{
                  fontSize: 13,
                  color: 'var(--foreground)'
                }}>
                
                    {n.label}
                  </span>
                  <Toggle
                on={toggles[n.label]}
                onClick={() => handleToggle(n.label)} />
              
                </div>
            )}
            </div>
          }

          {tab === 'data' &&
          <div>
              <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--foreground)',
                marginBottom: 4
              }}>
              
                Data & Export
              </h2>
              <p
              style={{
                fontSize: 12,
                color: 'var(--muted-foreground)',
                marginBottom: 16
              }}>
              
                Export data for accreditation or backup.
              </p>
              {[
            {
              label: 'Export question bank',
              desc: 'All questions with tags, stats, and history',
              format: 'CSV / QTI 2.1'
            },
            {
              label: 'Export exam results',
              desc: 'Scores, item analysis, distributions',
              format: 'CSV / Excel'
            },
            {
              label: 'Accreditation report',
              desc: 'Curriculum mapping, coverage, performance',
              format: 'PDF / Excel'
            },
            {
              label: 'Audit trail',
              desc: 'Complete log of all actions',
              format: 'CSV'
            },
            {
              label: 'Full backup',
              desc: 'Questions, exams, results, config',
              format: 'ZIP'
            }].
            map((e, i) =>
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: '1px solid var(--border)'
              }}>
              
                  <div>
                    <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--foreground)'
                  }}>
                  
                      {e.label}
                    </div>
                    <div
                  style={{
                    fontSize: 11,
                    color: 'var(--muted-foreground)'
                  }}>
                  
                      {e.desc}
                    </div>
                  </div>
                  <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                
                    <span
                  style={{
                    fontSize: 11,
                    color: 'var(--muted-foreground)'
                  }}>
                  
                      {e.format}
                    </span>
                    <button
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    fontSize: 11,
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer'
                  }}>
                  
                      Export
                    </button>
                  </div>
                </div>
            )}
            </div>
          }
        </div>
      </div>
    </div>);

}