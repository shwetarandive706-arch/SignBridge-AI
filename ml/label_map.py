"""
SignBridge AI - Scoped Healthcare Reception Vocabulary & Label Mapping (15 Verified INCLUDE Classes)
Milestone M2.2: Verified INCLUDE Dataset Integration
"""

HEALTHCARE_15_VOCABULARY = [
    "GREETING_HELLO",
    "DOCTOR",
    "HOSPITAL",
    "PHARMACY_MEDICINE",
    "PATIENT",
    "PAIN_SYMPTOM",
    "BILLING_PAYMENT",
    "LOCATION_WHERE",
    "TIME_WHEN",
    "TODAY",
    "TOMORROW",
    "MORNING",
    "AFTERNOON",
    "PRONOUN_I",
    "PRONOUN_YOU"
]

# Gloss mappings to verified INCLUDE dataset class names
GLOSS_MAP = {
    "GREETING_HELLO": "Hello",
    "DOCTOR": "Doctor",
    "HOSPITAL": "Hospital",
    "PHARMACY_MEDICINE": "Medicine",
    "PATIENT": "Patient",
    "PAIN_SYMPTOM": "sick",
    "BILLING_PAYMENT": "Bill",
    "LOCATION_WHERE": "Location",
    "TIME_WHEN": "Time",
    "TODAY": "Today",
    "TOMORROW": "Tomorrow",
    "MORNING": "Morning",
    "AFTERNOON": "Afternoon",
    "PRONOUN_I": "I",
    "PRONOUN_YOU": "you"
}

# Bi-directional label mappings
LABEL_TO_INDEX = {label: idx for idx, label in enumerate(HEALTHCARE_15_VOCABULARY)}
INDEX_TO_LABEL = {idx: label for idx, label in enumerate(HEALTHCARE_15_VOCABULARY)}

NUM_CLASSES = len(HEALTHCARE_15_VOCABULARY)


def encode_label(label_name: str) -> int:
    """Converts string label name to integer index."""
    if label_name not in LABEL_TO_INDEX:
        raise ValueError(f"Label '{label_name}' is not in the verified 15-class healthcare reception vocabulary.")
    return LABEL_TO_INDEX[label_name]


def decode_index(index: int) -> str:
    """Converts integer index back to string label name."""
    if index not in INDEX_TO_LABEL:
        raise ValueError(f"Index {index} is out of bounds for {NUM_CLASSES}-class vocabulary.")
    return INDEX_TO_LABEL[index]
