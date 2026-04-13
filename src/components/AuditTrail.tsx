import React, { useState } from 'react';
import { ShieldCheck, Download, AlertTriangle } from 'lucide-react';
const AUDIT_LOG = [{
  time: '2026-04-17 09:02:14',
  user: 'Dr. Gupta',
  role: 'Faculty',
  action: 'Accessed question',
  item: 'PHR-103',
  campus: 'Long Island',
  examWindow: true
}, {
  time: '2026-04-17 09:01:48',
  user: 'Dr. Sharma',
  role: 'Contributor',
  action: 'Viewed question',
  item: 'CRD-021',
  campus: 'Long Island',
  examWindow: true
}, {
  time: '2026-04-16 14:33:01',
  user: 'Dr. Khan',
  role: 'Reviewer',
  action: 'Approved question',
  item: 'PHR-102',
  campus: 'Manhattan',
  examWindow: false
}, {
  time: '2026-04-16 11:20:44',
  user: 'Admin-LI',
  role: 'Inst. Admin',
  action: 'Exported question bank',
  item: 'CV Pharm folder',
  campus: 'Long Island',
  examWindow: false
}, {
  time: '2026-04-15 16:05:29',
  user: 'Dr. Gupta',
  role: 'Faculty',
  action: 'Edited question stem',
  item: 'PHR-104',
  campus: 'Long Island',
  examWindow: false
}, {
  time: '2026-04-15 10:44:11',
  user: 'Dr. Sharma',
  role: 'Contributor',
  action: 'Created question',
  item: 'NEU-011',
  campus: 'Long Island',
  examWindow: false
}, {
  time: '2026-04-14 09:17:55',
  user: 'Dr. Patel',
  role: 'Faculty',
  action: 'Shared question to campus',
  item: 'CRD-021 → Manhattan',
  campus: 'Long Island',
  examWindow: false
}];
export function AuditTrail() {
  const [filter, setFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const examWindowEntries = AUDIT_LOG.filter((l) => l.examWindow);
  const filtered = AUDIT_LOG.filter((l) => (!filter || l.user.toLowerCase().includes(filter.toLowerCase()) || l.item.toLowerCase().includes(filter.toLowerCase())) && (actionFilter === 'All' || l.action.includes(actionFilter)));
  return <div className="flex-1 overflow-auto p-5" style={{
    background: 'var(--surface2)'
  }}>
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{
            color: 'var(--text)',
            fontFamily: 'var(--font-heading)'
          }}>
              Audit trail
            </h1>
            <p className="text-sm" style={{
            color: 'var(--text2)'
          }}>
              Who accessed the question bank · what was touched · when — Ed
              Razenbach + Dr. T requirement
            </p>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text2)'
        }}>
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Exam-window alert */}
        {examWindowEntries.length > 0 && <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{
        background: 'rgba(239,68,68,0.06)',
        border: '1px solid rgba(239,68,68,0.2)'
      }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{
          color: '#EF4444'
        }} />
            <div>
              <div className="text-sm font-semibold" style={{
            color: 'var(--text)'
          }}>
                {examWindowEntries.length} question
                {examWindowEntries.length > 1 ? 's' : ''} accessed during active
                exam window
              </div>
              <div className="text-xs mt-0.5" style={{
            color: 'var(--text3)'
          }}>
                These accesses occurred while the Apr 17 exam was live. Review
                for potential security concern.
              </div>
            </div>
          </div>}

        {/* Filters */}
        <div className="flex items-center gap-2">
          <input type="search" placeholder="Search by user or question ID…" value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 text-sm rounded-lg flex-1" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          outline: 'none',
          maxWidth: 280
        }} />
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="px-3 py-2 text-sm rounded-lg" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          outline: 'none'
        }}>
            {['All', 'Accessed', 'Edited', 'Approved', 'Exported', 'Created', 'Shared'].map((a) => <option key={a}>{a}</option>)}
          </select>
          <select className="px-3 py-2 text-sm rounded-lg" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          outline: 'none'
        }}>
            <option>All campuses</option>
            <option>Long Island</option>
            <option>Manhattan</option>
          </select>
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{
          color: 'var(--text2)'
        }}>
            <input type="checkbox" style={{
            accentColor: 'var(--brand)'
          }} />
            Exam window only
          </label>
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden" style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)'
      }}>
          <table className="w-full">
            <thead>
              <tr style={{
              borderBottom: '1px solid var(--border)',
              background: 'var(--surface2)'
            }}>
                {['Timestamp', 'User', 'Role', 'Action', 'Item / Question', 'Campus', ''].map((h) => <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{
                color: 'var(--text3)'
              }}>
                    {h}
                  </th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => <tr key={i} style={{
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
              background: entry.examWindow ? 'rgba(239,68,68,0.04)' : 'transparent',
              borderLeft: entry.examWindow ? '3px solid #EF4444' : '3px solid transparent'
            }}>
                  <td className="px-4 py-3 text-xs mono" style={{
                color: 'var(--text3)'
              }}>
                    {entry.time}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{
                color: 'var(--text)'
              }}>
                    {entry.user}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded" style={{
                  background: 'var(--surface3)',
                  color: 'var(--text2)'
                }}>
                      {entry.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{
                color: 'var(--text2)'
              }}>
                    {entry.action}
                  </td>
                  <td className="px-4 py-3 text-xs mono font-semibold" style={{
                color: 'var(--brand)'
              }}>
                    {entry.item}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{
                color: 'var(--text3)'
              }}>
                    {entry.campus}
                  </td>
                  <td className="px-4 py-3">
                    {entry.examWindow && <span className="text-xs px-2 py-0.5 rounded-full" style={{
                  background: 'rgba(239,68,68,0.1)',
                  color: '#EF4444'
                }}>
                        Exam window
                      </span>}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>

        <p className="text-xs" style={{
        color: 'var(--text3)'
      }}>
          Audit log updates within seconds of each action. Retention: 24 months.
          Sourced from Ed Razenbach + Dr. T (Touro) requirements: "who is in
          there, what was touched, a detailed audit analysis."
        </p>
      </div>
    </div>;
}