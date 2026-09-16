export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface ExtractedFrameLandmarks {
  timestamp: number;
  poseLandmarks: NormalizedLandmark[] | null;
  leftHandLandmarks: NormalizedLandmark[] | null;
  rightHandLandmarks: NormalizedLandmark[] | null;
  faceLandmarks: NormalizedLandmark[] | null;
}

export type CameraPermissionStatus = 'idle' | 'requesting' | 'active' | 'denied' | 'error';

export interface LandmarkExtractorConfig {
  modelComplexity?: 0 | 1 | 2;
  smoothLandmarks?: boolean;
  refineFaceLandmarks?: boolean;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
}
