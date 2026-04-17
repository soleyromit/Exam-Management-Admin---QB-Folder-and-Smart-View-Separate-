import React, { useEffect, useState, useRef, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { ColumnMenuAction } from './types';
import { useFontAwesomeKit } from './useFontAwesomeKit';
interface ColumnMenuProps {
  columnLabel: string;
  onAction: (action: ColumnMenuAction) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
}
const menuItems: {
  action: ColumnMenuAction;
  label: string;
  icon: string;
  separator?: boolean;
}[] = [
{
  action: 'pin-left',
  label: 'Pin Left',
  icon: 'fa-light fa-arrow-left-to-line'
},
{
  action: 'pin-right',
  label: 'Pin Right',
  icon: 'fa-light fa-arrow-right-to-line',
  separator: true
},
{
  action: 'sort-asc',
  label: 'Sort Ascending',
  icon: 'fa-light fa-arrow-up-short-wide'
},
{
  action: 'sort-desc',
  label: 'Sort Descending',
  icon: 'fa-light fa-arrow-down-wide-short',
  separator: true
},
{
  action: 'wrap-text',
  label: 'Wrap Text',
  icon: 'fa-light fa-text-width',
  separator: true
},
{
  action: 'filter',
  label: 'Filter by this\ncolumn',
  icon: 'fa-light fa-filter'
},
{
  action: 'group',
  label: 'Group by this\nColumn',
  icon: 'fa-light fa-layer-group',
  separator: true
},
{
  action: 'conditional-rule',
  label: 'Add Conditional\nRule',
  icon: 'fa-light fa-palette'
}];

export function ColumnMenu({
  columnLabel,
  onAction,
  onClose,
  anchorRef
}: ColumnMenuProps) {
  useFontAwesomeKit();
  const [search, setSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  }>({
    top: 0,
    left: 0
  });
  // Position the menu relative to the anchor button
  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const menuWidth = 176;
      let left = rect.right - menuWidth;
      // Ensure menu doesn't go off-screen left
      if (left < 8) left = 8;
      // Ensure menu doesn't go off-screen right
      if (left + menuWidth > window.innerWidth - 8) {
        left = window.innerWidth - menuWidth - 8;
      }
      setPosition({
        top: rect.bottom + 4,
        left
      });
    }
  }, [anchorRef]);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    // Use setTimeout to avoid the click that opened the menu from immediately closing it
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);
    document.addEventListener('keydown', handleEscape);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);
  const filteredItems = menuItems.filter((item) =>
  item.label.toLowerCase().replace('\n', ' ').includes(search.toLowerCase())
  );
  const menu =
  <div
    ref={menuRef}
    role="menu"
    style={{
      position: 'fixed',
      top: `${position.top}px`,
      left: `${position.left}px`,
      zIndex: 9999,
      width: '176px',
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E4E4E6',
      boxShadow: '0px 2px 4px -2px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    }}>
    
      {/* Search input — 12px padding, 28px height */}
      <div
      style={{
        padding: '12px 12px 0 12px'
      }}>
      
        <div
        style={{
          position: 'relative',
          width: '152px',
          height: '28px',
          borderRadius: '8px',
          border: '1px solid #939599',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center'
        }}>
        
          <span
          style={{
            position: 'absolute',
            left: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '11px',
            lineHeight: '11px',
            color: '#60636A',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '13.8px'
          }}>
          
            <i className="fa-light fa-magnifying-glass" />
          </span>
          <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${columnLabel}\u2026`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            paddingLeft: '25px',
            paddingRight: '8px',
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: '14px',
            lineHeight: '100%',
            color: '#0A0A0A',
            backgroundColor: 'transparent'
          }} />
        
        </div>
      </div>

      {/* Separator — full width, 1px, #E4E4E6 */}
      <div
      style={{
        height: '1px',
        backgroundColor: '#E4E4E6',
        marginTop: '8px'
      }} />
    

      {/* Menu items — 4px padding */}
      <div
      style={{
        padding: '4px'
      }}>
      
        {filteredItems.map((item, index) =>
      <Fragment key={item.action}>
            <button
          onClick={() => {
            onAction(item.action);
            onClose();
          }}
          role="menuitem"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            width: '168px',
            minHeight: item.label.includes('\n') ? '48px' : '28px',
            paddingLeft: '6px',
            paddingRight: '6px',
            paddingTop: '4px',
            paddingBottom: '4px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: '14px',
            lineHeight: '20px',
            color: '#0A0A0A'
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.backgroundColor =
            'var(--interactive-hover, #f5f5f5)';
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.backgroundColor =
            'transparent';
          }}>
          
              {item.icon ?
          <span
            style={{
              width: '17.5px',
              height: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '14px',
              lineHeight: '14px',
              color: '#0A0A0A'
            }}>
            
                  <i className={item.icon} />
                </span> :

          <span
            style={{
              width: '17.5px',
              flexShrink: 0
            }} />

          }
              <span
            style={{
              whiteSpace: 'pre-line'
            }}>
            
                {item.label}
              </span>
            </button>
            {item.separator && index < filteredItems.length - 1 &&
        <div
          style={{
            height: '1px',
            backgroundColor: '#E4E4E6',
            marginLeft: '-4px',
            marginRight: '-4px',
            marginTop: '4px',
            marginBottom: '4px'
          }} />

        }
          </Fragment>
      )}
      </div>
    </div>;

  return createPortal(menu, document.body);
}