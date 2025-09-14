import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeStatusBar } from './utils/statusBar'

// Initialize status bar for mobile
initializeStatusBar();

createRoot(document.getElementById("root")!).render(<App />);
