from pathlib import Path
from typing import List, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="SignBridge AI API",
    description="Backend API service for SignBridge AI - Healthcare Reception ISL Prototype",
    version="0.1.0"
)

# Enable CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ModelInputTensorPayload(BaseModel):
    shape: List[int]  # e.g., [1, 30, 1629]
    data: List[float]  # Flattened float array of length 48,870
    timestamp: int


class ModelPredictionResponse(BaseModel):
    status: str
    message: str
    label: Optional[str] = None
    confidence: Optional[float] = None
    timestamp: int


@app.get("/")
def read_root():
    return {
        "service": "SignBridge AI Backend",
        "version": "0.1.0",
        "scope": "Healthcare Reception ISL Prototype",
        "status": "running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "SignBridge AI Backend"
    }


@app.post("/api/predict", response_model=ModelPredictionResponse)
def predict_sequence(payload: ModelInputTensorPayload):
    model_dir = Path(__file__).resolve().parent.parent.parent / "ml" / "models"
    onnx_path = model_dir / "signbridge_lstm.onnx"
    pt_path = model_dir / "signbridge_lstm.pt"

    # Check if a trained model checkpoint exists
    if not (onnx_path.exists() or pt_path.exists()):
        return ModelPredictionResponse(
            status="unattached",
            message=f"Received tensor payload shape {payload.shape}. No trained model file found at {onnx_path.name}. Real model training required in dataset milestone.",
            label=None,
            confidence=None,
            timestamp=payload.timestamp
        )

    # Real inference execution boundary placeholder for when model weights are provided
    return ModelPredictionResponse(
        status="error",
        message="Model weights detected but inference runner not compiled.",
        timestamp=payload.timestamp
    )
