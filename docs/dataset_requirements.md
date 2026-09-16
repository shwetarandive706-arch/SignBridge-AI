# SignBridge AI — ISL Dataset Sourcing & Specification Requirements

To train the real temporal sequence model (LSTM / GRU) without fabricating data or using unsourced/unlicensed media, this document outlines the dataset requirements for SignBridge AI.

---

## 1. Dataset Scope & Requirements

### A. Volume & Class Balance
- **Target Vocabulary**: 10 Healthcare Reception Classes (defined in `docs/vocabulary.md`).
- **Samples per Class**: Minimum **50 to 100 video sequences** per class (total dataset size: 500 – 1,000 recorded video clips).
- **Signer Diversity**: Minimum **5 to 10 distinct deaf/hard-of-hearing ISL signers** to ensure generalization across hand shapes, signing speed, and bodily proportions.

### B. Recording Specifications
- **Video Format**: 1080p / 720p @ 30 FPS.
- **Lighting & Background**: Controlled healthcare reception indoor lighting, uncluttered background, full upper body visibility (head, shoulders, arms, hands).
- **Duration**: 1.0 to 2.5 seconds per gesture execution.

---

## 2. Licensing & Ethics Standards

> [!IMPORTANT]
> **Data Integrity Directive:**
> - All ISL video data must be sourced with explicit consent from native ISL signers or deaf community partners.
> - Open-source ISL datasets must be checked for permissive open research licenses (e.g. Creative Commons BY-4.0).
> - Web-scraped or unsourced media clips without explicit copyright clearance **MUST NOT** be included in the dataset.

---

## 3. Preprocessing Pipeline Output Format

Recorded videos will be processed through the `LandmarkExtractor` pipeline to generate `.npy` feature matrices:
- **Matrix Shape**: `(N_samples, 30, 1629)`
- **Data Type**: `float32`
- **Features Breakdown**:
  - Pose: 99 features (33 keypoints x 3)
  - Left Hand: 63 features (21 keypoints x 3)
  - Right Hand: 63 features (21 keypoints x 3)
  - Face Mesh: 1404 features (468 keypoints x 3)
