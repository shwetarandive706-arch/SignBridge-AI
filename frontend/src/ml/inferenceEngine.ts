import {
  ModelInputTensor,
  ModelInferenceStatus,
  ModelPredictionResult,
  PreprocessedSequence,
} from './types';

export interface InferenceEngine {
  predict(sequence: PreprocessedSequence): Promise<ModelPredictionResult>;
  getStatus(): { status: ModelInferenceStatus; message: string; modelName?: string };
}

/**
 * UnattachedInferenceEngine
 * Default unattached engine for M1.2. Explicitly informs caller that no trained model binary exists.
 */
export class UnattachedInferenceEngine implements InferenceEngine {
  public async predict(sequence: PreprocessedSequence): Promise<ModelPredictionResult> {
    return {
      status: 'unattached',
      message: 'No trained model attached. Tensor pipeline ready [1, 30, 1629]. Model training scheduled for dataset phase (M2).',
      timestamp: sequence.timestamp,
    };
  }

  public getStatus() {
    return {
      status: 'unattached' as ModelInferenceStatus,
      message: 'Inference engine boundary initialized. Awaiting trained LSTM/GRU model weights.',
      modelName: 'SignBridge_LSTM_v0 (Unattached)',
    };
  }
}

/**
 * BackendInferenceEngineClient
 * HTTP client boundary that posts ModelInputTensor payloads to the FastAPI backend service.
 */
export class BackendInferenceEngineClient implements InferenceEngine {
  private backendUrl: string;

  constructor(backendUrl: string = 'http://127.0.0.1:8000') {
    this.backendUrl = backendUrl;
  }

  public async predict(sequence: PreprocessedSequence): Promise<ModelPredictionResult> {
    const tensorPayload: ModelInputTensor = {
      shape: [1, sequence.sequenceLength, sequence.featureDim],
      data: Array.from(sequence.data),
      timestamp: sequence.timestamp,
    };

    try {
      const response = await fetch(`${this.backendUrl}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tensorPayload),
      });

      if (!response.ok) {
        throw new Error(`Backend HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ModelPredictionResult = await response.json();
      return result;
    } catch (err: any) {
      return {
        status: 'error',
        message: `Backend inference request failed: ${err.message || err}`,
        timestamp: sequence.timestamp,
      };
    }
  }

  public getStatus() {
    return {
      status: 'unattached' as ModelInferenceStatus,
      message: `Client configured for backend target ${this.backendUrl}/api/predict`,
      modelName: 'FastAPI_SignBridge_Client',
    };
  }
}
