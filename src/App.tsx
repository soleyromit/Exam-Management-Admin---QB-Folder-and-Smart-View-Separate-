import React, { useState, useEffect } from 'react';
import { ExamAdminApp } from './pages/ExamAdminApp';
import { THEMES, applyTheme, type ThemeKey } from './themes';

export function App() {
  const [themeKey, setThemeKey] = useState<ThemeKey>('exam');

  // Apply synchronously before first paint to avoid FOUC
  if (typeof document !== 'undefined') {
    applyTheme(THEMES.exam);
  }

  // Re-apply whenever the user changes themes
  useEffect(() => {
    applyTheme(THEMES[themeKey]);
  }, [themeKey]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ExamAdminApp themeKey={themeKey} onThemeChange={setThemeKey} />
    </div>);

}