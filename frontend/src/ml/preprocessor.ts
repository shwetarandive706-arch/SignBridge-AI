import {
  ExtractedFrameLandmarks,
  FEATURE_DIMENSIONS,
  NormalizedLandmark,
  PreprocessedSequence,
  SEQUENCE_CONFIG,
} from './types';

export class LandmarkPreprocessor {
  /**
   * Preprocesses a single frame of raw MediaPipe Holistic landmarks into a 1629-dimensional Float32Array feature vector.
   */
  public static preprocessFrame(frame: ExtractedFrameLandmarks): Float32Array {
    const vector = new Float32Array(FEATURE_DIMENSIONS.TOTAL_PER_FRAME);
    let offset = 0;

    // 1. Pose Landmarks (99 values)
    if (frame.poseLandmarks && frame.poseLandmarks.length >= 33) {
      // Use midpoint of shoulders (index 11 and 12) as origin for pose normalization
      const leftShoulder = frame.poseLandmarks[11];
      const rightShoulder = frame.poseLandmarks[12];
      const originX = (leftShoulder.x + rightShoulder.x) / 2;
      const originY = (leftShoulder.y + rightShoulder.y) / 2;
      const originZ = (leftShoulder.z + rightShoulder.z) / 2;

      for (let i = 0; i < 33; i++) {
        const lm = frame.poseLandmarks[i];
        vector[offset++] = lm.x - originX;
        vector[offset++] = lm.y - originY;
        vector[offset++] = lm.z - originZ;
      }
    } else {
      offset += FEATURE_DIMENSIONS.POSE_LANDMARKS; // Zero-fill
    }

    // 2. Left Hand Landmarks (63 values)
    if (frame.leftHandLandmarks && frame.leftHandLandmarks.length >= 21) {
      // Use wrist (index 0) as origin for left hand normalization
      const wrist = frame.leftHandLandmarks[0];
      for (let i = 0; i < 21; i++) {
        const lm = frame.leftHandLandmarks[i];
        vector[offset++] = lm.x - wrist.x;
        vector[offset++] = lm.y - wrist.y;
        vector[offset++] = lm.z - wrist.z;
      }
    } else {
      offset += FEATURE_DIMENSIONS.LEFT_HAND_LANDMARKS; // Zero-fill
    }

    // 3. Right Hand Landmarks (63 values)
    if (frame.rightHandLandmarks && frame.rightHandLandmarks.length >= 21) {
      // Use wrist (index 0) as origin for right hand normalization
      const wrist = frame.rightHandLandmarks[0];
      for (let i = 0; i < 21; i++) {
        const lm = frame.rightHandLandmarks[i];
        vector[offset++] = lm.x - wrist.x;
        vector[offset++] = lm.y - wrist.y;
        vector[offset++] = lm.z - wrist.z;
      }
    } else {
      offset += FEATURE_DIMENSIONS.RIGHT_HAND_LANDMARKS; // Zero-fill
    }

    // 4. Face Landmarks (1404 values)
    if (frame.faceLandmarks && frame.faceLandmarks.length >= 468) {
      // Use nose tip (index 1) as origin for face normalization
      const noseTip = frame.faceLandmarks[1];
      for (let i = 0; i < 468; i++) {
        const lm = frame.faceLandmarks[i];
        vector[offset++] = lm.x - noseTip.x;
        vector[offset++] = lm.y - noseTip.y;
        vector[offset++] = lm.z - noseTip.z;
      }
    } else {
      offset += FEATURE_DIMENSIONS.FACE_LANDMARKS; // Zero-fill
    }

    return vector;
  }

  /**
   * Preprocesses a window of frames (default 30) into a PreprocessedSequence containing a 48,870 float buffer.
   */
  public static preprocessSequence(sequence: ExtractedFrameLandmarks[]): PreprocessedSequence {
    const sequenceLength = SEQUENCE_CONFIG.SEQUENCE_LENGTH;
    const featureDim = SEQUENCE_CONFIG.FEATURE_DIM;
    const buffer = new Float32Array(SEQUENCE_CONFIG.TOTAL_TENSOR_SIZE);

    // Fill sequence buffer; pad with zero-vectors if sequence length is less than expected window
    for (let i = 0; i < sequenceLength; i++) {
      if (i < sequence.length) {
        const frameVector = this.preprocessFrame(sequence[i]);
        buffer.set(frameVector, i * featureDim);
      }
    }

    return {
      timestamp: Date.now(),
      sequenceLength,
      featureDim,
      data: buffer,
    };
  }
}
