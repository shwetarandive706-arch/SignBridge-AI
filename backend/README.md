# SignBridge AI Backend

Minimal FastAPI application providing REST API endpoints for the SignBridge AI healthcare reception prototype.

## Running locally

```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
