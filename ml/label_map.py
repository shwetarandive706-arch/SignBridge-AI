"""
SignBridge AI - Scoped Healthcare Reception Vocabulary & Label Mapping
Milestone M2.1: Dataset & Data Pipeline Foundation
"""

HEALTHCARE_20_VOCABULARY = [
    "GREETING_HELLO",
    "PATIENT_REGISTRATION",
    "DOCTOR",
    "HOSPITAL",
    "EMERGENCY",
    "PHARMACY_MEDICINE",
    "BILLING_PAYMENT",
    "WHEELCHAIR",
    "PAIN_SYMPTOM",
    "THANK_YOU",
    "HELP_ASSISTANCE",
    "PLEASE",
    "FEVER",
    "BLOOD_TEST",
    "LOCATION_WHERE",
    "TIME_WHEN",
    "YES",
    "NO",
    "WATER",
    "WAIT"
]

# Bi-directional label mappings
LABEL_TO_INDEX = {label: idx for idx, label in enumerate(HEALTHCARE_20_VOCABULARY)}
INDEX_TO_LABEL = {idx: label for idx, label in enumerate(HEALTHCARE_20_VOCABULARY)}

NUM_CLASSES = len(HEALTHCARE_20_VOCABULARY)


def encode_label(label_name: str) -> int:
    """Converts string label name to integer index."""
    if label_name not in LABEL_TO_INDEX:
        raise ValueError(f"Label '{label_name}' is not in the scoped 20-class healthcare reception vocabulary.")
    return LABEL_TO_INDEX[label_name]


def decode_index(index: int) -> str:
    """Converts integer index back to string label name."""
    if index not in INDEX_TO_LABEL:
        raise ValueError(f"Index {index} is out of bounds for {NUM_CLASSES}-class vocabulary.")
    return INDEX_TO_LABEL[index]
