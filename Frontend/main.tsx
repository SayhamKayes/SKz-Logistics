import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeSecurityShield } from './services/securityShield';

// Activate Anti-Inspect, Anti-DevTools & Anti-Scraping Protection safely
try {
  initializeSecurityShield();
} catch {}

createRoot(document.getElementById('root')!).render(<App />);
