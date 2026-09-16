import React, { useEffect, useRef, useState } from 'react';
import { LandmarkExtractor } from '../ml/landmarkExtractor';
import { CameraPermissionStatus, ExtractedFrameLandmarks } from '../ml/types';
import { drawLandmarksOnCanvas } from '../utils/drawingUtils';

interface WebcamLandmarkViewerProps {
  onLandmarksExtracted?: (landmarks: ExtractedFrameLandmarks) => void;
}

export const WebcamLandmarkViewer: React.FC<WebcamLandmarkViewerProps> = ({ onLandmarksExtracted }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const extractorRef = useRef<LandmarkExtractor | null>(null);

  const [permissionStatus, setPermissionStatus] = useState<CameraPermissionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fps, setFps] = useState<number>(0);
  const [activeLandmarks, setActiveLandmarks] = useState<{
    pose: boolean;
    leftHand: boolean;
    rightHand: boolean;
    face: boolean;
  }>({
    pose: false,
    leftHand: false,
    rightHand: false,
    face: false,
  });

  const frameCountRef = useRef<number>(0);
  const lastFpsCheckRef = useRef<number>(Date.now());

  const startCamera = async () => {
    setPermissionStatus('requesting');
    setErrorMessage(null);

    try {
      // 1. Request camera media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, frameRate: { ideal: 30 } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // 2. Initialize Landmark Extractor
      const extractor = new LandmarkExtractor();
      extractorRef.current = extractor;

      extractor.setOnFrameCallback((landmarks) => {
        // Calculate FPS
        frameCountRef.current += 1;
        const now = Date.now();
        if (now - lastFpsCheckRef.current >= 1000) {
          setFps(frameCountRef.current);
          frameCountRef.current = 0;
          lastFpsCheckRef.current = now;
        }

        // Update active landmark detection indicators
        setActiveLandmarks({
          pose: Boolean(landmarks.poseLandmarks && landmarks.poseLandmarks.length > 0),
          leftHand: Boolean(landmarks.leftHandLandmarks && landmarks.leftHandLandmarks.length > 0),
          rightHand: Boolean(landmarks.rightHandLandmarks && landmarks.rightHandLandmarks.length > 0),
          face: Boolean(landmarks.faceLandmarks && landmarks.faceLandmarks.length > 0),
        });

        // Draw landmarks on canvas overlay
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            drawLandmarksOnCanvas(
              ctx,
              canvasRef.current.width,
              canvasRef.current.height,
              landmarks.poseLandmarks,
              landmarks.leftHandLandmarks,
              landmarks.rightHandLandmarks,
              landmarks.faceLandmarks
            );
          }
        }

        // Pass to parent modular listener (for sequence buffering in future milestones)
        if (onLandmarksExtracted) {
          onLandmarksExtracted(landmarks);
        }
      });

      if (videoRef.current) {
        await extractor.start(videoRef.current);
      }

      setPermissionStatus('active');
    } catch (err: any) {
      console.error('Camera Access / Landmark Extraction Error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionStatus('denied');
        setErrorMessage('Camera access was denied. Please grant camera permission in your browser settings to use SignBridge AI.');
      } else {
        setPermissionStatus('error');
        setErrorMessage(err.message || 'Failed to initialize video camera device.');
      }
    }
  };

  const stopCamera = () => {
    if (extractorRef.current) {
      extractorRef.current.stop();
      extractorRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setPermissionStatus('idle');
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
      {/* Video / Canvas Container */}
      <div
        style={{
          position: 'relative',
          width: '640px',
          height: '480px',
          backgroundColor: '#111827',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <video
          ref={videoRef}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)', // Mirrored selfie view
            display: permissionStatus === 'active' ? 'block' : 'none',
          }}
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: 'scaleX(-1)', // Mirrored overlay to match video
            pointerEvents: 'none',
            display: permissionStatus === 'active' ? 'block' : 'none',
          }}
        />

        {/* Permission Requesting State */}
        {permissionStatus === 'requesting' && (
          <div style={{ color: '#E5E7EB', textAlign: 'center', padding: '1rem' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Requesting Camera Access...</p>
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Please approve the browser permission prompt.</p>
          </div>
        )}

        {/* Initial Idle State */}
        {permissionStatus === 'idle' && (
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <p style={{ color: '#9CA3AF', marginBottom: '1rem' }}>Camera feed is currently inactive.</p>
            <button
              onClick={startCamera}
              style={{
                backgroundColor: '#4F46E5',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Start Webcam Feed
            </button>
          </div>
        )}

        {/* Permission Denied or Device Error State */}
        {(permissionStatus === 'denied' || permissionStatus === 'error') && (
          <div
            style={{
              backgroundColor: '#7F1D1D',
              color: '#FEE2E2',
              padding: '1.5rem',
              margin: '1rem',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>⚠️ Camera Access Error</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{errorMessage}</p>
            <button
              onClick={startCamera}
              style={{
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                border: '1px solid #FCA5A5',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              Retry Camera Access
            </button>
          </div>
        )}
      </div>

      {/* Telemetry & Detection Status Bar */}
      {permissionStatus === 'active' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '640px',
            backgroundColor: '#1F2937',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#E5E7EB',
          }}
        >
          <div>
            <strong style={{ color: '#9CA3AF' }}>Stream FPS:</strong> {fps}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>
              Pose: <strong style={{ color: activeLandmarks.pose ? '#10B981' : '#EF4444' }}>{activeLandmarks.pose ? 'DETECTED' : 'NONE'}</strong>
            </span>
            <span>
              Left Hand: <strong style={{ color: activeLandmarks.leftHand ? '#10B981' : '#EF4444' }}>{activeLandmarks.leftHand ? 'DETECTED' : 'NONE'}</strong>
            </span>
            <span>
              Right Hand: <strong style={{ color: activeLandmarks.rightHand ? '#10B981' : '#EF4444' }}>{activeLandmarks.rightHand ? 'DETECTED' : 'NONE'}</strong>
            </span>
            <span>
              Face: <strong style={{ color: activeLandmarks.face ? '#10B981' : '#EF4444' }}>{activeLandmarks.face ? 'DETECTED' : 'NONE'}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
