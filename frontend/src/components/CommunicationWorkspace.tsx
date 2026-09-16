import React, { useEffect, useRef, useState } from 'react';
import { WebcamLandmarkViewer } from './WebcamLandmarkViewer';
import { SequenceCollector, SequenceCollectorMetrics } from '../ml/sequenceCollector';
import { UnattachedInferenceEngine } from '../ml/inferenceEngine';
import { ExtractedFrameLandmarks, ModelPredictionResult } from '../ml/types';

export const CommunicationWorkspace: React.FC = () => {
  const collectorRef = useRef<SequenceCollector>(new SequenceCollector(30));
  const engineRef = useRef<UnattachedInferenceEngine>(new UnattachedInferenceEngine());

  const [totalFramesExtracted, setTotalFramesExtracted] = useState<number>(0);
  const [lastFrameTime, setLastFrameTime] = useState<string>('No frames extracted yet');
  const [collectorMetrics, setCollectorMetrics] = useState<SequenceCollectorMetrics>({
    bufferCount: 0,
    maxCapacity: 30,
    fillPercentage: 0,
    sequencesProducedCount: 0,
    lastSequenceTimestamp: null,
  });
  const [lastPredictionResult, setLastPredictionResult] = useState<ModelPredictionResult | null>(null);

  useEffect(() => {
    const collector = collectorRef.current;
    const engine = engineRef.current;

    collector.setOnSequenceCallback(async (sequence) => {
      // Execute inference boundary check
      const result = await engine.predict(sequence);
      setLastPredictionResult(result);
      setCollectorMetrics(collector.getMetrics());
    });
  }, []);

  const handleLandmarksExtracted = (landmarks: ExtractedFrameLandmarks) => {
    setTotalFramesExtracted((prev) => prev + 1);
    setLastFrameTime(new Date(landmarks.timestamp).toLocaleTimeString());

    // Feed frame to sequence collector
    collectorRef.current.addFrame(landmarks);
    setCollectorMetrics(collectorRef.current.getMetrics());
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
            Scenario: Patient Intake & Reception Inquiry | Sequence Collection Pipeline (M1.2)
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
            M1.2 Sequence Pipeline Active
          </span>
        </div>
      </header>

      {/* Main Vision & Telemetry Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <WebcamLandmarkViewer onLandmarksExtracted={handleLandmarksExtracted} />

        {/* Sequence Collector & ML Tensor Diagnostic Panel */}
        <div
          style={{
            width: '100%',
            maxWidth: '640px',
            backgroundColor: '#111827',
            border: '1px solid #374151',
            borderRadius: '8px',
            padding: '1.25rem',
            color: '#D1D5DB',
            fontSize: '0.875rem',
          }}
        >
          <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#9CA3AF', fontSize: '0.95rem' }}>
            Sequence Collection & Tensor Preprocessing Diagnostics
          </h4>

          {/* Buffer Progress Bar */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '0.25rem' }}>
              <span>Sequence Window Buffer ({collectorMetrics.bufferCount} / {collectorMetrics.maxCapacity} frames)</span>
              <span>{collectorMetrics.fillPercentage}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#374151', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${collectorMetrics.fillPercentage}%`,
                  height: '100%',
                  backgroundColor: collectorMetrics.fillPercentage === 100 ? '#10B981' : '#6366F1',
                  transition: 'width 0.1s ease',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <span style={{ color: '#6B7280' }}>Frames Extracted:</span>{' '}
              <strong style={{ color: '#F9FAFB' }}>{totalFramesExtracted}</strong>
            </div>
            <div>
              <span style={{ color: '#6B7280' }}>Last Frame Time:</span>{' '}
              <strong style={{ color: '#F9FAFB' }}>{lastFrameTime}</strong>
            </div>
            <div>
              <span style={{ color: '#6B7280' }}>Sequences Windowed:</span>{' '}
              <strong style={{ color: '#F9FAFB' }}>{collectorMetrics.sequencesProducedCount}</strong>
            </div>
            <div>
              <span style={{ color: '#6B7280' }}>Preprocessed Tensor Shape:</span>{' '}
              <strong style={{ color: '#38BDF8' }}>[1, 30, 1629]</strong>
            </div>
          </div>

          {/* Inference Engine Status Box */}
          <div style={{ backgroundColor: '#1E293B', padding: '0.85rem 1rem', borderRadius: '6px', borderLeft: '3px solid #F59E0B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#F59E0B', fontSize: '0.8rem' }}>INFERENCE ENGINE STATUS</span>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{engineRef.current.getStatus().modelName}</span>
            </div>
            <p style={{ margin: '0.4rem 0 0 0', color: '#CBD5E1', fontSize: '0.825rem', lineHeight: 1.4 }}>
              {lastPredictionResult ? lastPredictionResult.message : engineRef.current.getStatus().message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
