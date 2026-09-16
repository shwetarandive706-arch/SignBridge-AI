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

// --- Milestone M1.2 & M2.2 Additions ---

export const FEATURE_DIMENSIONS = {
  POSE_LANDMARKS: 33 * 3, // 99 floats
  LEFT_HAND_LANDMARKS: 21 * 3, // 63 floats
  RIGHT_HAND_LANDMARKS: 21 * 3, // 63 floats
  FACE_LANDMARKS: 468 * 3, // 1404 floats
  TOTAL_PER_FRAME: 99 + 63 + 63 + 1404, // 1629 floats
};

export const SEQUENCE_CONFIG = {
  SEQUENCE_LENGTH: 30, // 30 frames per sliding window
  FEATURE_DIM: FEATURE_DIMENSIONS.TOTAL_PER_FRAME, // 1629 features per frame
  TOTAL_TENSOR_SIZE: 30 * FEATURE_DIMENSIONS.TOTAL_PER_FRAME, // 48,870 floats total
};

export type PreprocessedFrame = Float32Array; // Size: 1629

export interface PreprocessedSequence {
  timestamp: number;
  sequenceLength: number; // 30
  featureDim: number; // 1629
  data: Float32Array; // Flattened 48,870 array
}

export interface ModelInputTensor {
  shape: [number, number, number]; // e.g. [1, 30, 1629]
  data: number[];
  timestamp: number;
}

export type ModelInferenceStatus = 'unattached' | 'ready' | 'processing' | 'error';

export interface ModelPredictionResult {
  status: ModelInferenceStatus;
  label?: string;
  confidence?: number;
  probabilities?: Record<string, number>;
  message: string;
  timestamp: number;
}

export const HEALTHCARE_RECEPTION_VOCABULARY = [
  'GREETING_HELLO',
  'DOCTOR',
  'HOSPITAL',
  'PHARMACY_MEDICINE',
  'PATIENT',
  'PAIN_SYMPTOM',
  'BILLING_PAYMENT',
  'LOCATION_WHERE',
  'TIME_WHEN',
  'TODAY',
  'TOMORROW',
  'MORNING',
  'AFTERNOON',
  'PRONOUN_I',
  'PRONOUN_YOU'
] as const;

export type HealthcareGestureClass = typeof HEALTHCARE_RECEPTION_VOCABULARY[number];
