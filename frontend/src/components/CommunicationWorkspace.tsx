import React, { useState } from 'react';
import { WebcamLandmarkViewer } from './WebcamLandmarkViewer';
import { ExtractedFrameLandmarks } from '../ml/types';

export const CommunicationWorkspace: React.FC = () => {
  const [totalFramesExtracted, setTotalFramesExtracted] = useState<number>(0);
  const [lastFrameTime, setLastFrameTime] = useState<string>('No frames extracted yet');

  const handleLandmarksExtracted = (landmarks: ExtractedFrameLandmarks) => {
    setTotalFramesExtracted((prev) => prev + 1);
    setLastFrameTime(new Date(landmarks.timestamp).toLocaleTimeString());
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      {/* Workspace Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#1E1B4B',
          padding: '1.25rem 1.5rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          borderLeft: '4px solid #6366F1',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.35rem', color: '#F3F4F6' }}>
            Healthcare Reception Workspace
          </h2>
          <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.875rem', color: '#C7D2FE' }}>
            Scenario: Patient Intake & Reception Inquiry | Real-Time Landmark Stream (M1.1)
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              backgroundColor: '#312E81',
              color: '#818CF8',
              padding: '0.35rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            M1.1 Landmark Extraction Active
          </span>
        </div>
      </header>

      {/* Main Vision Slice Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <WebcamLandmarkViewer onLandmarksExtracted={handleLandmarksExtracted} />

        {/* Modular Stream Diagnostic Telemetry Box */}
        <div
          style={{
            width: '100%',
            maxWidth: '640px',
            backgroundColor: '#111827',
            border: '1px solid #374151',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            color: '#D1D5DB',
            fontSize: '0.875rem',
          }}
        >
          <h4 style={{ marginTop: 0, marginBottom: '0.75rem', color: '#9CA3AF', fontSize: '0.9rem' }}>
            Modular ML Pipeline Telemetry
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <span style={{ color: '#6B7280' }}>Total Frames Processed:</span>{' '}
              <strong style={{ color: '#F9FAFB' }}>{totalFramesExtracted}</strong>
            </div>
            <div>
              <span style={{ color: '#6B7280' }}>Last Extracted Frame:</span>{' '}
              <strong style={{ color: '#F9FAFB' }}>{lastFrameTime}</strong>
            </div>
            <div>
              <span style={{ color: '#6B7280' }}>Extractor Engine:</span>{' '}
              <strong style={{ color: '#10B981' }}>MediaPipe Holistic v0.5</strong>
            </div>
            <div>
              <span style={{ color: '#6B7280' }}>Classifier Status:</span>{' '}
              <strong style={{ color: '#F59E0B' }}>Unattached (M1.2+ Pending)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
