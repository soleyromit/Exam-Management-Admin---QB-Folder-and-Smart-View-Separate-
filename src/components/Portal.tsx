import ReactDOM from 'react-dom';
import React from 'react';

/**
 * Renders children directly on document.body via a React portal.
 * Use this for any fixed-position overlay (dropdowns, context menus, popovers)
 * to escape stacking contexts created by ancestor opacity/transform/filter.
 */
export function Portal({ children }: {children: React.ReactNode;}) {
  return ReactDOM.createPortal(children, document.body);
}