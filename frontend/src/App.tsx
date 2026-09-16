import React, { useState } from 'react';
import { CommunicationWorkspace } from './components/CommunicationWorkspace';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'workspace' | 'about'>('workspace');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', color: '#F8FAFC' }}>
      {/* Global Navigation Header */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          backgroundColor: '#1E293B',
          borderBottom: '1px solid #334155',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#6366F1' }}>SignBridge AI</h1>
          <span style={{ fontSize: '0.75rem', backgroundColor: '#334155', color: '#94A3B8', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            Healthcare Reception ISL Prototype
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setCurrentView('workspace')}
            style={{
              backgroundColor: currentView === 'workspace' ? '#4F46E5' : 'transparent',
              color: currentView === 'workspace' ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Communication Workspace
          </button>
          <button
            onClick={() => setCurrentView('about')}
            style={{
              backgroundColor: currentView === 'about' ? '#4F46E5' : 'transparent',
              color: currentView === 'about' ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Scope & Architecture
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ padding: '2rem 1rem' }}>
        {currentView === 'workspace' ? (
          <CommunicationWorkspace />
        ) : (
          <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#1E293B', padding: '2rem', borderRadius: '10px' }}>
            <h2 style={{ marginTop: 0, color: '#F1F5F9' }}>Project Scope Notice</h2>
            <p style={{ color: '#CBD5E1', lineHeight: 1.6 }}>
              SignBridge AI is an accessibility-focused communication prototype specifically scoped for a <strong>healthcare reception scenario</strong> (patient intake, hospital check-in, directional guidance, basic symptom inquiry).
            </p>
            <p style={{ color: '#F59E0B', fontWeight: 600 }}>
              Notice: SignBridge AI is NOT a general-purpose or universal ISL translator.
            </p>
            <hr style={{ borderColor: '#334155', margin: '1.5rem 0' }} />
            <h3 style={{ color: '#F1F5F9' }}>Current Milestone: M1.1</h3>
            <ul style={{ color: '#94A3B8', lineHeight: 1.8 }}>
              <li>Webcam video stream integration with browser permission lifecycle</li>
              <li>Real-time MediaPipe Holistic landmark extraction (33 Pose, 21 Left Hand, 21 Right Hand, Face mesh)</li>
              <li>HTML5 Canvas overlay visualization</li>
              <li>Decoupled modular architecture for sequence classifier integration in M1.2+</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
