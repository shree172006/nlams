import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Register Progressive Web App Service Worker for offline capability
if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[NLAMS PWA] Service Worker registered successfully with scope:', registration.scope);
      })
      .catch((error) => {
        console.warn('[NLAMS PWA] Service Worker registration failed:', error);
      });
  });
} else if ('serviceWorker' in navigator) {
  // In development, also register service worker for testing offline survey workflows
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('[NLAMS PWA Dev] Service worker active:', reg.scope))
      .catch((err) => console.log('[NLAMS PWA Dev] SW registration note:', err.message));
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
