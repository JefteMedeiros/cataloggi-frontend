import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { initSync } from './lib/sync';

async function bootstrap() {
  if (import.meta.env.DEV) {
    await import('./mocks/api');
  }
  initSync();
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();
