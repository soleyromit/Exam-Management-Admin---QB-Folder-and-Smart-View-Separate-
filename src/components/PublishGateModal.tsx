import React from 'react';
import { X, Check, AlertTriangle, Lock } from 'lucide-react';
export interface PublishGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
}
export function PublishGateModal({
  isOpen,
  onClose,
  onPublish
}: PublishGateModalProps) {
  if (!isOpen) return null;
  const items = [{
    type: 'critical',
    ok: false,
    label: '2 images missing alt text',
    action: 'Fix now',
    detail: 'Q3 (hotspot) · Q32 (EKG strip) — screen readers and TTS cannot interpret these questions without alt text.'
  }, {
    type: 'critical',
    ok: false,
    label: '1 video question missing captions',
    action: 'Add captions',
    detail: 'Q41 (Audio-based) — WCAG 1.2.1 requires captions for all pre-recorded audio content.'
  }, {
    type: 'ok',
    ok: true,
    label: 'All 42 questions have complete Bloom\'s tags',
    action: null,
    detail: null
  }, {
    type: 'ok',
    ok: true,
    label: 'LockDown browser configured',
    action: null,
    detail: null
  }, {
    type: 'warn',
    ok: null,
    label: '1 student has no accommodation profile (Priya Patel)',
    action: 'Apply profile',
    detail: 'Will use default 1.0× time multiplier. Assign a profile if this student has documented accommodations.'
  }, {
    type: 'warn',
    ok: null,
    label: 'Question randomization enabled — verify section order',
    action: 'Review',
    detail: null
  }];
  const criticalCount = items.filter((i) => i.type === 'critical').length;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
    background: 'rgba(0,0,0,0.6)'
  }}>
      <div className="w-full overflow-hidden rounded-2xl" style={{
      maxWidth: 580,
      background: 'var(--surface)',
      boxShadow: '0 24px 80px rgba(0,0,0,0.4)'
    }}>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4" style={{
        borderBottom: '1px solid var(--border)'
      }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
            background: criticalCount > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'
          }}>
              {criticalCount > 0 ? <Lock className="w-5 h-5" style={{
              color: '#EF4444'
            }} /> : <Check className="w-5 h-5" style={{
              color: '#10B981'
            }} />}
            </div>
            <div>
              <h2 className="text-base font-semibold" style={{
              color: 'var(--text)'
            }}>Accessibility publish gate</h2>
              <p className="text-sm" style={{
              color: 'var(--text3)'
            }}>
                {criticalCount > 0 ? `${criticalCount} critical issues must be resolved before publishing` : 'All checks passed — ready to publish'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
          color: 'var(--text3)'
        }}><X className="w-5 h-5" /></button>
        </div>

        {/* Checklist */}
        <div className="px-6 py-4 space-y-2.5" style={{
        maxHeight: 360,
        overflowY: 'auto'
      }}>
          {items.map((item, i) => <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl" style={{
          background: item.type === 'critical' ? 'rgba(239,68,68,0.06)' : item.type === 'ok' ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)',
          border: `1px solid ${item.type === 'critical' ? 'rgba(239,68,68,0.2)' : item.type === 'ok' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`
        }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
            background: item.type === 'critical' ? '#EF4444' : item.type === 'ok' ? '#10B981' : '#F59E0B'
          }}>
                {item.type === 'ok' ? <Check className="w-3 h-3 text-white" /> : <AlertTriangle className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {item.type === 'critical' && <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mr-2" style={{
                  background: '#EF4444',
                  color: 'white'
                }}>Critical</span>}
                    <span className="text-sm font-medium" style={{
                  color: 'var(--text)'
                }}>{item.label}</span>
                  </div>
                  {item.action && <button className="text-xs font-medium flex-shrink-0" style={{
                color: item.type === 'critical' ? '#EF4444' : '#F59E0B',
                textDecoration: 'underline'
              }}>{item.action} →</button>}
                </div>
                {item.detail && <p className="text-xs mt-1" style={{
              color: 'var(--text3)'
            }}>{item.detail}</p>}
              </div>
            </div>)}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4" style={{
        borderTop: '1px solid var(--border)'
      }}>
          <span className="text-sm" style={{
          color: 'var(--text3)'
        }}>
            {criticalCount > 0 ? `Resolve ${criticalCount} critical items to enable publish` : 'All systems go'}
          </span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg" style={{
            background: 'var(--surface3)',
            border: '1px solid var(--border)',
            color: 'var(--text2)'
          }}>Cancel</button>
            <button onClick={onPublish} disabled={criticalCount > 0} className="px-4 py-2 text-sm rounded-lg font-medium text-white transition-all" style={{
            background: criticalCount > 0 ? 'var(--border2)' : 'var(--brand)',
            cursor: criticalCount > 0 ? 'not-allowed' : 'pointer'
          }}>
              {criticalCount > 0 ? 'Fix issues first' : 'Publish assessment'}
            </button>
          </div>
        </div>
      </div>
    </div>;
}