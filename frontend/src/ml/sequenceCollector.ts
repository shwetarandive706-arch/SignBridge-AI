import { LandmarkPreprocessor } from './preprocessor';
import { ExtractedFrameLandmarks, PreprocessedSequence, SEQUENCE_CONFIG } from './types';

export interface SequenceCollectorMetrics {
  bufferCount: number;
  maxCapacity: number;
  fillPercentage: number;
  sequencesProducedCount: number;
  lastSequenceTimestamp: number | null;
}

export class SequenceCollector {
  private buffer: ExtractedFrameLandmarks[] = [];
  private maxCapacity: number;
  private onSequenceCallback: ((sequence: PreprocessedSequence) => void) | null = null;
  private sequencesProducedCount: number = 0;
  private lastSequenceTimestamp: number | null = null;

  constructor(capacity: number = SEQUENCE_CONFIG.SEQUENCE_LENGTH) {
    this.maxCapacity = capacity;
  }

  public setOnSequenceCallback(callback: (sequence: PreprocessedSequence) => void): void {
    this.onSequenceCallback = callback;
  }

  /**
   * Pushes a new frame into the sliding window buffer.
   * When buffer reaches capacity (30 frames), preprocesses the sequence and triggers callback.
   */
  public addFrame(frame: ExtractedFrameLandmarks): void {
    this.buffer.push(frame);

    // Keep buffer bounded to maxCapacity (sliding window)
    if (this.buffer.length > this.maxCapacity) {
      this.buffer.shift();
    }

    // Trigger sequence completion when full window is accumulated
    if (this.buffer.length === this.maxCapacity) {
      const preprocessed = LandmarkPreprocessor.preprocessSequence(this.buffer);
      this.sequencesProducedCount += 1;
      this.lastSequenceTimestamp = preprocessed.timestamp;

      if (this.onSequenceCallback) {
        this.onSequenceCallback(preprocessed);
      }
    }
  }

  public getMetrics(): SequenceCollectorMetrics {
    return {
      bufferCount: this.buffer.length,
      maxCapacity: this.maxCapacity,
      fillPercentage: Math.round((this.buffer.length / this.maxCapacity) * 100),
      sequencesProducedCount: this.sequencesProducedCount,
      lastSequenceTimestamp: this.lastSequenceTimestamp,
    };
  }

  public reset(): void {
    this.buffer = [];
    this.sequencesProducedCount = 0;
    this.lastSequenceTimestamp = null;
  }
}
