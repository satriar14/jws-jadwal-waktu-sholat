import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import reportWebVitals from './reportWebVitals';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

const root = ReactDOM.createRoot(rootEl);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

try {
  reportWebVitals();
} catch (_) {
  // ignore if web-vitals fails
}
