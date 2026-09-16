# SignBridge AI — System Architecture

## Overview
SignBridge AI is designed with a decoupled architecture enabling real-time visual landmark streaming, sequence classification, and dynamic response presentation.

```
┌─────────────────┐       WebSocket / REST       ┌─────────────────┐
│ React Frontend  │ <──────────────────────────> │ FastAPI Backend │
│ (TypeScript)    │                              │ (Python 3.10+)  │
└────────┬────────┘                              └────────┬────────┘
         │                                                │
         │ Video Stream / Keypoints                       │ Sequence Inference
         ▼                                                ▼
┌─────────────────┐                              ┌─────────────────┐
│ MediaPipe       │                              │ PyTorch / TF    │
│ Extraction      │                              │ LSTM/GRU Model  │
└─────────────────┘                              └─────────────────┘
```

## Modular Breakdown

1. **Frontend (`/frontend`)**: React + TypeScript client providing healthcare reception UI, camera controls, gesture translation view, and accessibility text-to-speech output.
2. **Backend (`/backend`)**: Python FastAPI backend service handling session state, model serving endpoints, and system health monitoring.
3. **ML Pipeline (`/ml`)**: MediaPipe landmark extraction, feature normalization, and temporal sequence classification models (LSTM / GRU).
4. **Assets (`/assets`)**: Structured storage for verified ISL video samples and extracted numerical landmark data.
