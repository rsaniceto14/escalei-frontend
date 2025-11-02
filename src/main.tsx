import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeStatusBar } from './utils/statusBar'
import { BrowserRouter } from 'react-router-dom';

// Initialize status bar for mobile
initializeStatusBar();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
