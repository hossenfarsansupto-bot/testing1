import React from 'react';
import ReactDOM from 'react-dom/client';
import { StoryProvider } from './engine/storyState';
import { AppContent } from './App';
import './styles/index.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <StoryProvider>
        <AppContent />
      </StoryProvider>
    </React.StrictMode>
  );
}
