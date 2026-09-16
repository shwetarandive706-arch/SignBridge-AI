# SignBridge AI — Scoped Healthcare Reception ISL Vocabulary (15 Verified INCLUDE Classes)

To maintain high sequence classification accuracy, real-time performance, and domain utility, **SignBridge AI** explicitly restricts its target vocabulary to a verified set of **15 Indian Sign Language (ISL) healthcare reception gestures/phrases** present in the authoritative INCLUDE dataset taxonomy.

> [!IMPORTANT]
> **Scope Notice:**
> - SignBridge AI is a domain-scoped prototype for healthcare reception intake scenarios.
> - **SignBridge AI is NOT a general-purpose or universal ISL translator.**
> - Unsupported signs outside these 15 verified classes are **NOT recognized** by the system.

---

## Target Healthcare Reception Gesture Classes & Dataset Statistics

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

## Technical Specifications
- **Input Representation**: 30-frame sequence window of 1,629-dimensional normalized landmark feature vectors (`[1, 30, 1629]`).
- **Target Model Architecture**: Bi-LSTM / GRU temporal sequence classifier outputting a 15-class Softmax probability distribution.
