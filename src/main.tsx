
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create the root once and render immediately
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
