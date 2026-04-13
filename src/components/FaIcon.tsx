import React, { useState } from 'react';

/**
 * Ic — inline Font Awesome icon
 * Uses fa-regular by default, fa-solid when active=true
 */
export function Ic({
  n, size = 13, active = false, style = {}, className = ''






}: {n: string;size?: number;active?: boolean;style?: React.CSSProperties;className?: string;}) {
  return (
    <i
      className={`${active ? 'fa-solid' : 'fa-regular'} fa-${n} ${className}`}
      style={{ fontSize: size, lineHeight: 1, display: 'inline-block', ...style }} />);


}

/**
 * IcBtn — icon button with fa-regular → fa-solid on hover/active
 */
export function IcBtn({
  n, onClick, size = 13, style = {}, btnStyle = {},
  title = '', color, activeColor, danger = false, active = false











}: {n: string;onClick?: (e: React.MouseEvent) => void;size?: number;style?: React.CSSProperties;btnStyle?: React.CSSProperties;title?: string;color?: string;activeColor?: string;danger?: boolean;active?: boolean;}) {
  const [hov, setHov] = useState(false);
  const col = danger ?
  '#ef4444' :
  hov || active ?
  activeColor || 'var(--brand)' :
  color || 'var(--muted-foreground)';
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        borderRadius: 4,
        ...btnStyle
      }}>
      
      <i
        className={`${hov || active ? 'fa-solid' : 'fa-regular'} fa-${n}`}
        style={{ fontSize: size, lineHeight: 1, color: col, ...style }} />
      
    </button>);

}