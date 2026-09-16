# SignBridge AI — Milestone M2.2 Verified Dataset & Data Pipeline Architecture

## 1. Dataset Source & Licensing

- **Dataset Name**: **INCLUDE** (Indian Sign Language Dataset from IISc / IIT Madras / AI4Bharat)
- **License / Access Terms**: Publicly available open academic dataset (ACM MM 2020 publication; AI4Bharat dataset card tagged CC BY 4.0 / Open Academic Research).
- **Access & Reuse Guidelines**: Designated for non-commercial academic research, open evaluation, and educational benchmarking in Sign Language Recognition (SLR). Users must attribute Sridhar et al. (ACM MM 2020) and respect the privacy and dignity of deaf community signers. Commercial application deployment requires direct license verification with AI4Bharat dataset maintainers.
- **Scope Alignment**: Selected a 15-class verified subset representing healthcare reception intake, directional guidance, and basic symptom inquiries.
- **Disclaimer**: SignBridge AI is a domain-scoped healthcare reception prototype. It is **NOT** a general-purpose or universal ISL translator. Unsupported signs outside these 15 verified classes are **not recognized**.

---

## 2. Scoped Healthcare Reception Vocabulary & Dataset Splits (15 Verified Classes)

| # | Class ID | INCLUDE Gloss Name | Total Samples | Train | Val | Test | Reception Context |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| 1 | `GREETING_HELLO` | Hello | 21 | - | - | - | Initial patient greeting at reception |
| 2 | `DOCTOR` | Doctor | 14 | - | - | - | Inquiring about doctor availability |
| 3 | `HOSPITAL` | Hospital | 20 | - | - | - | Hospital setting reference |
| 4 | `PHARMACY_MEDICINE` | Medicine | 14 | - | - | - | Pharmacy/medication guidance |
| 5 | `PATIENT` | Patient | 14 | - | - | - | Patient registration/file reference |
| 6 | `PAIN_SYMPTOM` | sick | 21 | - | - | - | Basic symptom indication |
| 7 | `BILLING_PAYMENT` | Bill | 14 | - | - | - | Directing patient to cashier/billing |
| 8 | `LOCATION_WHERE` | Location | 22 | - | - | - | Directional/department inquiry |
| 9 | `TIME_WHEN` | Time | 15 | - | - | - | Schedule/waiting time inquiry |
| 10 | `TODAY` | Today | 14 | - | - | - | Appointment timing (Today) |
| 11 | `TOMORROW` | Tomorrow | 14 | - | - | - | Appointment timing (Tomorrow) |
| 12 | `MORNING` | Morning | 14 | - | - | - | Time of day reference (Morning) |
| 13 | `AFTERNOON` | Afternoon | 14 | - | - | - | Time of day reference (Afternoon) |
| 14 | `PRONOUN_I` | I | 21 | - | - | - | Self-referral / Patient pronoun |
| 15 | `PRONOUN_YOU` | you | 21 | - | - | - | Address / Staff pronoun |
| **Total** | **15 Classes** | **15 Glosses** | **253** | **192** | **20** | **41** | **Healthcare Reception Scope** |

---

## 3. Data Pipeline & Preprocessing Specifications

```
Raw ISL Video (.mp4)
       │
       ▼
MediaPipe Holistic Extraction (Pose 33, Left Hand 21, Right Hand 21, Face 468)
       │
       ▼
Relative Origin Normalization & Zero-Padding
       │
       ▼
Frame Feature Vector (1,629 float32 values)
       │
       ▼
30-Frame Sliding Window Tensor Matrix [30, 1629] (48,870 float32 values)
```

### Feature Dimension Breakdown (1,629 features / frame)
- **Pose Landmarks**: 33 keypoints × 3 (x, y, z) = 99 features. Normalized relative to shoulder midpoint origin `((x11+x12)/2, (y11+y12)/2, (z11+z12)/2)`.
- **Left Hand Landmarks**: 21 keypoints × 3 (x, y, z) = 63 features. Normalized relative to left wrist origin `(x0, y0, z0)`.
- **Right Hand Landmarks**: 21 keypoints × 3 (x, y, z) = 63 features. Normalized relative to right wrist origin `(x0, y0, z0)`.
- **Face Landmarks**: 468 keypoints × 3 (x, y, z) = 1404 features. Normalized relative to nose tip origin `(x1, y1, z1)`.

---

## 4. Signer-Aware Data Splitting Strategy (Data Leakage Prevention)

To prevent data leakage, samples are partitioned using `SignerAwareSplitter`:
- **Train Set**: **192 samples**
- **Validation Set**: **20 samples**
- **Test Set**: **41 samples**
- **Total Dataset Size**: **253 samples**

> [!IMPORTANT]
> **Data Leakage Guarantee:**
> Samples from any given `signer_id` exist strictly in one split set. No individual signer is split across training and validation/testing sets.

---

## 5. Known Limitations & Next Steps

1. **Environmental Variance**: Studio-recorded dataset clips feature controlled lighting; dynamic reception desk environments may introduce noise (addressed via online landmark normalization).
2. **Model Training Status**: Milestone M2.2 configures the verified dataset pipeline foundation. Model training (LSTM / GRU) will be conducted upon local feature dataset extraction.
