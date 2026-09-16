import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from ml.manifest_generator import generate_manifest

if __name__ == "__main__":
    entries = generate_manifest()
    print(f"Manifest generation complete. Total entries: {len(entries)}")
