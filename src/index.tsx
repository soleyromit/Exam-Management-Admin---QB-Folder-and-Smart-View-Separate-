import React, { createElement } from 'react';
import './index.css';
import { render } from 'react-dom';
import { App } from './App'
// Font Awesome Pro Kit
;(function () {
  var s = document.createElement('script');
  s.src = 'https://kit.fontawesome.com/d9bd5774e0.js';
  s.crossOrigin = 'anonymous';
  document.head.appendChild(s);
})();
render(<App />, document.getElementById('root'));