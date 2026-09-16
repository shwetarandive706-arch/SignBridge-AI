"""
SignBridge AI - Manifest Unit Test Suite
Milestone M2.3: INCLUDE Dataset Acquisition & Manifest
Validates manifest schema, counts, and 15 locked class mappings strictly.
"""

import json
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(BASE_DIR))

from ml.label_map import HEALTHCARE_15_VOCABULARY, GLOSS_MAP
from ml.manifest_generator import generate_manifest

MANIFEST_PATH = BASE_DIR / "ml" / "manifest.json"


def test_manifest_generation_and_counts():
    print("[TEST] 1. Manifest Generation & Split Count Verification...")
    manifest = generate_manifest()
    
    total_count = len(manifest)
    assert total_count == 253, f"Expected 253 total manifest entries, got {total_count}"

    splits = {"train": 0, "val": 0, "test": 0}
    for item in manifest:
        splits[item["split"]] += 1

    assert splits["train"] == 192, f"Expected 192 train samples, got {splits['train']}"
    assert splits["val"] == 20, f"Expected 20 val samples, got {splits['val']}"
    assert splits["test"] == 41, f"Expected 41 test samples, got {splits['test']}"

    print(f"  --> Manifest split counts PASSED (Train={splits['train']}, Val={splits['val']}, Test={splits['test']}, Total={total_count}).")


def test_manifest_uniqueness():
    print("[TEST] 2. Manifest Path & Sample ID Uniqueness Verification...")
    manifest = generate_manifest()

    video_paths = [item["video_path"] for item in manifest]
    sample_ids = [item["sample_id"] for item in manifest]

    assert len(video_paths) == len(set(video_paths)), "Duplicate video_path values found in manifest!"
    assert len(sample_ids) == len(set(sample_ids)), "Duplicate sample_id values found in manifest!"

    print("  --> Uniqueness check PASSED (Zero duplicate video_path or sample_id entries).")


def test_manifest_vocabulary_alignment():
    print("[TEST] 3. Manifest Vocabulary Alignment (15 Locked Classes)...")
    manifest = generate_manifest()
    
    allowed_class_ids = set(HEALTHCARE_15_VOCABULARY)
    allowed_glosses = set(GLOSS_MAP.values())

    for item in manifest:
        assert item["class_id"] in allowed_class_ids, f"Invalid class_id: {item['class_id']}"
        assert item["gloss"] in allowed_glosses, f"Invalid gloss: {item['gloss']}"

    distinct_classes = set(item["class_id"] for item in manifest)
    assert len(distinct_classes) == 15, f"Expected 15 distinct classes, got {len(distinct_classes)}"

    print("  --> Manifest vocabulary alignment PASSED (100% of 253 entries map to the 15 locked classes).")


def test_manifest_schema_fields():
    print("[TEST] 4. Manifest Schema Fields Verification...")
    manifest = generate_manifest()
    
    required_fields = ["sample_id", "class_id", "gloss", "category", "split", "video_path"]
    schema_keys = ["sample_id", "class_id", "gloss", "category", "split", "video_path", "signer_id", "download_url"]

    for idx, item in enumerate(manifest):
        for key in schema_keys:
            assert key in item, f"Missing schema key '{key}' in item index {idx}"

        for req_field in required_fields:
            val = item[req_field]
            assert val is not None and isinstance(val, str) and len(val.strip()) > 0, (
                f"Required field '{req_field}' is missing or empty at index {idx}"
            )

    print("  --> Manifest schema verification PASSED (Required non-empty fields & nullable keys verified).")


def run_all_manifest_tests():
    print("==================================================")
    print("  SignBridge AI - Milestone M2.3 Manifest Tests   ")
    print("==================================================")
    test_manifest_generation_and_counts()
    test_manifest_uniqueness()
    test_manifest_vocabulary_alignment()
    test_manifest_schema_fields()
    print("==================================================")
    print("  ALL M2.3 MANIFEST TESTS PASSED CLEANLY!         ")
    print("==================================================")


if __name__ == "__main__":
    run_all_manifest_tests()
