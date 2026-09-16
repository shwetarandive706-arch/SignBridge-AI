# SignBridge AI — Milestone M2.1 Dataset & Data Pipeline Architecture

## 1. Dataset Source & Licensing

- **Dataset Name**: **INCLUDE** (Indian Sign Language Dataset from IISc / IIT Madras / AI4Bharat)
- **License / Access Terms**: Publicly available open academic dataset (ACM MM 2020 publication; AI4Bharat dataset card tagged CC BY 4.0 / Open Academic Research).
- **Access & Reuse Guidelines**: Designated for non-commercial academic research, open evaluation, and educational benchmarking in Sign Language Recognition (SLR). Users must attribute Sridhar et al. (ACM MM 2020) and respect the privacy and dignity of deaf community signers. Commercial application deployment requires direct license verification with AI4Bharat dataset maintainers.
- **Scope Alignment**: Selected a 20-class subset representing healthcare reception intake, directional guidance, and basic emergency/symptom requests.

---

## 2. Scoped Healthcare Reception Vocabulary (20 Classes)

| Class ID | Target Phrase / Sign Meaning | Clinical / Reception Context |
| :--- | :--- | :--- |
| `GREETING_HELLO` | "Hello / Namaste" | Initial patient greeting at reception |
| `PATIENT_REGISTRATION` | "Patient Registration / Form" | Directing new patient to intake desk |
| `DOCTOR` | "Doctor" | Inquiring about doctor availability |
| `HOSPITAL` | "Hospital" | General healthcare setting reference |
| `EMERGENCY` | "Emergency / Casualty" | Urgent triage referral |
| `PHARMACY_MEDICINE` | "Pharmacy / Medicine" | Directing patient to pharmacy counter |
| `BILLING_PAYMENT` | "Billing / Payment" | Directing patient to cashier |
| `WHEELCHAIR` | "Wheelchair / Mobility Support" | Mobility assistance request |
| `PAIN_SYMPTOM` | "Pain / Unwell" | Symptom indication |
| `THANK_YOU` | "Thank You" | Reception interaction sign-off |
| `HELP_ASSISTANCE` | "Help / Assistance" | General patient help request |
| `PLEASE` | "Please" | Polite inquiry modifier |
| `FEVER` | "Fever / High Temperature" | Symptom triage |
| `BLOOD_TEST` | "Blood Test / Lab" | Directing patient to diagnostic lab |
| `LOCATION_WHERE` | "Where / Location" | Directional inquiry |
| `TIME_WHEN` | "When / Time" | Schedule inquiry |
| `YES` | "Yes / Affirmative" | Intake confirmation |
| `NO` | "No / Negative" | Intake negation |
| `WATER` | "Water" | Basic comfort request |
| `WAIT` | "Wait / Please Sit" | Reception queue guidance |

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
- **Train Set**: **70%** of signers.
- **Validation Set**: **15%** of signers.
- **Test Set**: **15%** of signers.

> [!IMPORTANT]
> **Data Leakage Guarantee:**
> Samples from any given `signer_id` exist strictly in one split set. No individual signer is split across training and validation/testing sets.

---

## 5. Known Limitations & Next Steps

1. **Environmental Variance**: Studio-recorded dataset clips feature controlled lighting; dynamic reception desk environments may introduce noise (addressed via online landmark normalization).
2. **Model Training Status**: Milestone M2.1 builds the verified data pipeline foundation. Model training (LSTM / GRU) will be conducted in **Milestone M2.2**.
