import { useEffect } from 'react';

const KIT_URL = 'https://kit.fontawesome.com/d9bd5774e0.js';
let loaded = false;

export function useFontAwesomeKit() {
  useEffect(() => {
    if (loaded) return;
    if (document.querySelector(`script[src="${KIT_URL}"]`)) {
      loaded = true;
      return;
    }
    const script = document.createElement('script');
    script.src = KIT_URL;
    script.crossOrigin = 'anonymous';
    script.async = true;
    document.head.appendChild(script);
    loaded = true;
  }, []);
}