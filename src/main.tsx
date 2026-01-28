import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ValentinePage from './pages/ValentinePage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ValentinePage />
  </StrictMode>
);
