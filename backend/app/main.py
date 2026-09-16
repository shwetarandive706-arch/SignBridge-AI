from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
