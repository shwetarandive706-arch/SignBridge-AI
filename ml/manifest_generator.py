"""
SignBridge AI - INCLUDE Official Dataset Manifest Generator
Milestone M2.3: INCLUDE Dataset Acquisition & Manifest
Generates ml/manifest.json strictly from the official INCLUDE path files:
  - include_official/train_test_paths/include_train.txt
  - include_official/train_test_paths/include_val.txt
  - include_official/train_test_paths/include_test.txt
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OFFICIAL_PATHS_DIR = BASE_DIR / "include_official" / "train_test_paths"
MANIFEST_PATH = BASE_DIR / "ml" / "manifest.json"

# Verified 15 Official INCLUDE Class Paths to Semantic Metadata
OFFICIAL_CLASS_MAPPING = {
    "Greetings/48. Hello": {"class_id": "GREETING_HELLO", "gloss": "Hello", "category": "Greetings"},
    "Jobs/87. Doctor": {"class_id": "DOCTOR", "gloss": "Doctor", "category": "Jobs"},
    "Places/30. Hospital": {"class_id": "HOSPITAL", "gloss": "Hospital", "category": "Places"},
    "Society/3. Medicine": {"class_id": "PHARMACY_MEDICINE", "gloss": "Medicine", "category": "Society"},
    "Jobs/88. Patient": {"class_id": "PATIENT", "gloss": "Patient", "category": "Jobs"},
    "Adjectives/98. sick": {"class_id": "PAIN_SYMPTOM", "gloss": "sick", "category": "Adjectives"},
    "Society/5. Bill": {"class_id": "BILLING_PAYMENT", "gloss": "Bill", "category": "Society"},
    "Places/36. Location": {"class_id": "LOCATION_WHERE", "gloss": "Location", "category": "Places"},
    "Days_and_Time/86. Time": {"class_id": "TIME_WHEN", "gloss": "Time", "category": "Days_and_Time"},
    "Days_and_Time/73. Today": {"class_id": "TODAY", "gloss": "Today", "category": "Days_and_Time"},
    "Days_and_Time/74. Tomorrow": {"class_id": "TOMORROW", "gloss": "Tomorrow", "category": "Days_and_Time"},
    "Days_and_Time/82. Morning": {"class_id": "MORNING", "gloss": "Morning", "category": "Days_and_Time"},
    "Days_and_Time/83. Afternoon": {"class_id": "AFTERNOON", "gloss": "Afternoon", "category": "Days_and_Time"},
    "Pronouns/40. I": {"class_id": "PRONOUN_I", "gloss": "I", "category": "Pronouns"},
    "Pronouns/41. you": {"class_id": "PRONOUN_YOU", "gloss": "you", "category": "Pronouns"},
}


def parse_split_file(file_path: Path, split_name: str):
    entries = []
    if not file_path.exists():
        raise FileNotFoundError(f"Official split file not found: {file_path}")

    with open(file_path, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f if line.strip()]

    for line in lines:
        parts = line.split("/")
        if len(parts) < 3:
            continue
        
        folder_prefix = f"{parts[0]}/{parts[1]}"
        if folder_prefix in OFFICIAL_CLASS_MAPPING:
            meta = OFFICIAL_CLASS_MAPPING[folder_prefix]
            filename = parts[-1]
            filename_stem = Path(filename).stem
            sample_id = f"INCLUDE_{meta['gloss']}_{split_name}_{filename_stem}"

            entry = {
                "sample_id": sample_id,
                "class_id": meta["class_id"],
                "gloss": meta["gloss"],
                "category": meta["category"],
                "split": split_name,
                "video_path": line,
                "signer_id": None,      # Signer metadata unavailable in official path text files
                "download_url": None     # Per-video direct download URLs unresolved from Zenodo category archives
            }
            entries.append(entry)

    return entries


def generate_manifest():
    train_entries = parse_split_file(OFFICIAL_PATHS_DIR / "include_train.txt", "train")
    val_entries = parse_split_file(OFFICIAL_PATHS_DIR / "include_val.txt", "val")
    test_entries = parse_split_file(OFFICIAL_PATHS_DIR / "include_test.txt", "test")

    all_entries = train_entries + val_entries + test_entries

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(all_entries, f, indent=2)

    return all_entries


if __name__ == "__main__":
    entries = generate_manifest()
    print(f"Generated manifest at {MANIFEST_PATH}")
    print(f"Total entries: {len(entries)}")