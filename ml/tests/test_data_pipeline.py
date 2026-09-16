"""
SignBridge AI - Pipeline Unit Test Suite
Milestone M2.1: Dataset & Data Pipeline Foundation
"""

import sys
from pathlib import Path
import numpy as np

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from ml.config import FEATURE_DIM, SEQUENCE_LENGTH, TOTAL_TENSOR_SIZE
from ml.label_map import HEALTHCARE_20_VOCABULARY, encode_label, decode_index
from ml.preprocessing.preprocessor import PythonLandmarkPreprocessor
from ml.sequence_generator import SequenceGenerator
from ml.split_data import SignerAwareSplitter
from ml.dataset_loader import ISLSequenceDataset


def test_label_mapping():
    print("[TEST] 1. Label Mapping Verification...")
    assert len(HEALTHCARE_20_VOCABULARY) == 20, "Vocabulary size must be 20."
    for idx, label in enumerate(HEALTHCARE_20_VOCABULARY):
        assert encode_label(label) == idx, f"Encoding failed for {label}"
        assert decode_index(idx) == label, f"Decoding failed for index {idx}"
    print("  --> Label mapping PASSED (20/20 bi-directional mappings verified).")


def test_frame_preprocessor():
    print("[TEST] 2. Frame Preprocessor Dimension & Normalization Verification...")
    sample_frame = {
        "poseLandmarks": [{"x": 0.5 + i*0.01, "y": 0.5 + i*0.01, "z": 0.0} for i in range(33)],
        "leftHandLandmarks": [{"x": 0.2 + i*0.01, "y": 0.2 + i*0.01, "z": 0.0} for i in range(21)],
        "rightHandLandmarks": None,  # Test zero-padding for missing right hand
        "faceLandmarks": [{"x": 0.4 + i*0.001, "y": 0.4 + i*0.001, "z": 0.0} for i in range(468)]
    }

    vec = PythonLandmarkPreprocessor.preprocess_frame(sample_frame)
    assert isinstance(vec, np.ndarray), "Output must be a NumPy array."
    assert vec.dtype == np.float32, "Output dtype must be float32."
    assert vec.shape == (1629,), f"Vector length must be 1629, got {vec.shape}"

    # Verify right hand zero-padding (indices 99 + 63 = 162 to 162 + 63 = 225)
    right_hand_slice = vec[99 + 63 : 99 + 63 + 63]
    assert np.all(right_hand_slice == 0.0), "Missing right hand landmarks must be zero-padded."

    print("  --> Frame preprocessor PASSED (1,629 features verified, zero-padding verified).")


def test_sequence_generator():
    print("[TEST] 3. Sequence Generator & Tensor Shape Verification...")
    raw_frames = [
        {
            "poseLandmarks": [{"x": 0.5, "y": 0.5, "z": 0.0} for _ in range(33)],
            "leftHandLandmarks": None,
            "rightHandLandmarks": None,
            "faceLandmarks": None
        }
        for _ in range(45)  # 45 frames input
    ]

    tensor = SequenceGenerator.process_frames_to_tensor(raw_frames)
    assert tensor.shape == (30, 1629), f"Expected tensor shape (30, 1629), got {tensor.shape}"
    assert tensor.size == 48870, f"Expected total tensor size 48,870, got {tensor.size}"

    print("  --> Sequence generator PASSED (Shape (30, 1629) & 48,870 tensor size verified).")


def test_signer_aware_splitter():
    print("[TEST] 4. Signer-Aware Data Splitter & Leakage Prevention...")
    samples = []
    # Create 100 samples from 10 distinct signers (S1 to S10)
    for i in range(100):
        signer_id = f"signer_{(i % 10) + 1}"
        samples.append({
            "sample_id": f"sample_{i}",
            "signer_id": signer_id,
            "label": HEALTHCARE_20_VOCABULARY[i % 20]
        })

    train_s, val_s, test_s = SignerAwareSplitter.split_by_signer(samples)

    train_signers = set(s["signer_id"] for s in train_s)
    val_signers = set(s["signer_id"] for s in val_s)
    test_signers = set(s["signer_id"] for s in test_s)

    # Verify zero signer overlap across sets
    assert train_signers.isdisjoint(val_signers), "Data Leakage! Train and Val share signers."
    assert train_signers.isdisjoint(test_signers), "Data Leakage! Train and Test share signers."
    assert val_signers.isdisjoint(test_signers), "Data Leakage! Val and Test share signers."

    print(f"  --> Signer splitter PASSED (Signer breakdown: Train={len(train_signers)}, Val={len(val_signers)}, Test={len(test_signers)} with 0 leakage).")


def test_dataset_loader():
    print("[TEST] 5. PyTorch Dataset Loader Verification...")
    seq1 = np.zeros((30, 1629), dtype=np.float32)
    seq2 = np.ones((30, 1629), dtype=np.float32)
    labels = [0, 1]

    dataset = ISLSequenceDataset([seq1, seq2], labels)
    assert len(dataset) == 2, "Dataset length must be 2."

    s0, l0 = dataset[0]
    assert s0.shape == (30, 1629) and l0 == 0
    
    batch_s, batch_l = dataset.get_batch([0, 1])
    assert batch_s.shape == (2, 30, 1629)
    assert np.array_equal(batch_l, np.array([0, 1]))

    print("  --> Dataset loader PASSED (Batched shape (2, 30, 1629) verified).")


def run_all_tests():
    print("==================================================")
    print("  SignBridge AI - Milestone M2.1 Pipeline Tests  ")
    print("==================================================")
    test_label_mapping()
    test_frame_preprocessor()
    test_sequence_generator()
    test_signer_aware_splitter()
    test_dataset_loader()
    print("==================================================")
    print("  ALL M2.1 DATA PIPELINE TESTS PASSED CLEANLY!   ")
    print("==================================================")


if __name__ == "__main__":
    run_all_tests()
