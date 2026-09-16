# SignBridge AI — Scoped Healthcare Reception ISL Vocabulary

To maintain high sequence classification accuracy, real-time performance, and domain utility, **SignBridge AI** explicitly restricts its target vocabulary to a scoped set of **10 Indian Sign Language (ISL) healthcare reception gestures/phrases**.

---

## Target Healthcare Reception Gesture Classes

| Class ID | Target Phrase / Meaning | Category | Clinical / Reception Context |
| :--- | :--- | :--- | :--- |
| `GREETING_HELLO` | "Hello / Namaste / Welcome" | Reception Intake | Initial patient greeting at hospital desk |
| `PATIENT_REGISTRATION` | "Patient Registration / New File" | Reception Intake | Directing new patients to registration desk |
| `DOCTOR_AVAILABILITY` | "Doctor Available / Appointment" | OPD | Inquiry about doctor schedule or availability |
| `OPD_LOCATION` | "Outpatient Department (OPD)" | Directional Guidance | Wayfinding to specialty clinics / OPD |
| `EMERGENCY_DEPT` | "Emergency / Casualty Room" | Triage | Urgent referral to casualty/emergency care |
| `PHARMACY_LOCATION` | "Pharmacy / Medicines" | Auxiliary Services | Direction to hospital pharmacy counter |
| `BILLING_COUNTER` | "Billing / Payment / Cashier" | Administrative | Directing patient to payment/discharge desk |
| `WHEELCHAIR_REQUEST` | "Need Wheelchair / Mobility Support" | Accessibility | Requesting mobility assistance for patient |
| `PAIN_SYMPTOM` | "Pain / Unwell / Chest-head pain" | Triage Inquiry | Basic symptom indication for intake staff |
| `THANK_YOU` | "Thank You / Assistance Completed" | Closing Interaction | Polite sign-off at reception desk |

---

## Technical Specifications
- **Input Representation**: 30-frame sequence window of 1,629-dimensional normalized landmark feature vectors (`[1, 30, 1629]`).
- **Target Model Architecture**: Bi-LSTM / GRU temporal sequence classifier outputting a 10-class Softmax probability distribution.
