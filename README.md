# SignBridge AI

> **Accessibility-Focused Indian Sign Language (ISL) Communication Prototype**  
> Developed for **Hack 2 Ignite 2026-27** | **Problem Statement AI-01**

---

## 🎯 Project Scope & Notice

**SignBridge AI** is an accessibility-focused communication prototype specifically scoped for a **healthcare reception scenario** (e.g., patient intake, hospital check-in, directional guidance, basic symptom inquiry).

> [!IMPORTANT]
> **SignBridge AI is NOT a general-purpose or universal ISL translator.**  
> It is designed and evaluated strictly for a defined set of domain-specific Indian Sign Language (ISL) gestures used within healthcare reception workflows.

---

## 📁 Repository Architecture

The repository is structured into modular components:

```
SignBridge-AI/
├── frontend/          # React + TypeScript web interface
├── backend/           # Python FastAPI backend service
├── ml/                # ML pipeline (Landmark extraction, Preprocessing, LSTM/GRU model placeholders)
├── assets/            # Dataset directory structure (Raw clips & processed landmarks)
├── docs/              # Architecture and domain scope documentation
└── README.md          # Project overview & execution guide
```

---

## 🚀 Local Setup & Run Instructions

### Prerequisites
- **Node.js**: v18.x or higher
- **Python**: v3.10 or higher
- **npm** or **yarn**

---

### 1. Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The backend API will be available at: `http://127.0.0.1:8000`  
   Interactive API docs (Swagger): `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup (React + TypeScript)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend application will be available at: `http://localhost:5173`

---

## 📋 Project Status (Milestone M0)

- [x] Project scaffold and directory hierarchy
- [x] Minimal FastAPI backend application
- [x] Clean React + TypeScript frontend template
- [x] ML pipeline & asset directory structure
- [ ] *M1+: Dataset collection, landmark extraction, and model training (Upcoming)*

---

## 📜 License
Developed for Hack 2 Ignite 2026-27.
