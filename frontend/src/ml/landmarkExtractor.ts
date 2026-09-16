import { Holistic, Results } from '@mediapipe/holistic';
import { Camera } from '@mediapipe/camera_utils';
import { ExtractedFrameLandmarks, LandmarkExtractorConfig } from './types';

export class LandmarkExtractor {
  private holistic: Holistic | null = null;
  private camera: Camera | null = null;
  private onFrameCallback: ((landmarks: ExtractedFrameLandmarks, rawResults: Results) => void) | null = null;
  private isRunning: boolean = false;

  constructor(config: LandmarkExtractorConfig = {}) {
    const locateFile = (file: string) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1675471629/${file}`;
    };

    try {
      this.holistic = new Holistic({ locateFile });
      this.holistic.setOptions({
        modelComplexity: config.modelComplexity ?? 1,
        smoothLandmarks: config.smoothLandmarks ?? true,
        enableSegmentation: false,
        smoothSegmentation: false,
        refineFaceLandmarks: config.refineFaceLandmarks ?? true,
        minDetectionConfidence: config.minDetectionConfidence ?? 0.5,
        minTrackingConfidence: config.minTrackingConfidence ?? 0.5,
      });

      this.holistic.onResults((results: Results) => {
        if (!this.isRunning) return;

        const extractedFrame: ExtractedFrameLandmarks = {
          timestamp: Date.now(),
          poseLandmarks: results.poseLandmarks ? results.poseLandmarks.map(l => ({ x: l.x, y: l.y, z: l.z, visibility: l.visibility })) : null,
          leftHandLandmarks: results.leftHandLandmarks ? results.leftHandLandmarks.map(l => ({ x: l.x, y: l.y, z: l.z })) : null,
          rightHandLandmarks: results.rightHandLandmarks ? results.rightHandLandmarks.map(l => ({ x: l.x, y: l.y, z: l.z })) : null,
          faceLandmarks: results.faceLandmarks ? results.faceLandmarks.map(l => ({ x: l.x, y: l.y, z: l.z })) : null,
        };

        if (this.onFrameCallback) {
          this.onFrameCallback(extractedFrame, results);
        }
      });
    } catch (err) {
      console.error('Failed to initialize MediaPipe Holistic:', err);
    }
  }

  public setOnFrameCallback(callback: (landmarks: ExtractedFrameLandmarks, rawResults: Results) => void): void {
    this.onFrameCallback = callback;
  }

  public async start(videoElement: HTMLVideoElement): Promise<void> {
    if (!this.holistic) {
      throw new Error('MediaPipe Holistic engine is not initialized.');
    }

    this.isRunning = true;

    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        if (this.isRunning && this.holistic && videoElement.readyState >= 2) {
          await this.holistic.send({ image: videoElement });
        }
      },
      width: 640,
      height: 480,
    });

    await this.camera.start();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
    }
  }

  public close(): void {
    this.stop();
    if (this.holistic) {
      this.holistic.close();
      this.holistic = null;
    }
  }
}
