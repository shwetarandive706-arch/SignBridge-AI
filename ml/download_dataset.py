"""
SignBridge AI - Selective Dataset Download Script
Milestone M2.3: INCLUDE Dataset Acquisition & Manifest

Downloads ONLY the 253 verified video files specified in ml/manifest.json
into the local assets/raw/ folder.
"""

import json
import os
import urllib.request
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MANIFEST_PATH = BASE_DIR / "ml" / "manifest.json"
RAW_DATA_DIR = BASE_DIR / "assets" / "raw"


def download_dataset():
    if not MANIFEST_PATH.exists():
        print(f"Error: Manifest file not found at {MANIFEST_PATH}")
        return

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    print(f"Loaded manifest with {len(manifest)} video entries.")
    
    downloaded_count = 0
    skipped_count = 0
    failed_count = 0

    for idx, item in enumerate(manifest, 1):
        rel_path = item["video_path"]
        target_file = BASE_DIR / rel_path
        url = item["download_url"]

        # Ensure parent category/gloss directory exists
        target_file.parent.mkdir(parents=True, exist_ok=True)

        if target_file.exists() and target_file.stat().st_size > 0:
            skipped_count += 1
            continue

        print(f"[{idx}/{len(manifest)}] Downloading {item['gloss']} ({item['sample_id']})...")
        try:
            # Download file from direct Zenodo / HuggingFace URL
            urllib.request.urlretrieve(url, target_file)
            downloaded_count += 1
        except Exception as e:
            print(f"  --> Failed to download {url}: {e}")
            failed_count += 1

    print("\n==================================================")
    print("  SignBridge AI - Dataset Download Summary        ")
    print("==================================================")
    print(f"Total Manifest Entries : {len(manifest)}")
    print(f"Downloaded Files       : {downloaded_count}")
    print(f"Already Present        : {skipped_count}")
    print(f"Failed Downloads       : {failed_count}")
    print("==================================================")


if __name__ == "__main__":
    download_dataset()
