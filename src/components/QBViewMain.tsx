import React from 'react';
import { QBViewTop } from './QBViewTop';
import { QBViewBottom } from './QBViewBottom';

export function QBViewMain(p: any) {
  const { bdr } = p;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden', background: 'white' }}>
      <QBViewTop {...p} />
      <QBViewBottom {...p} />
    </div>);

}