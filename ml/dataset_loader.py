"""
SignBridge AI - Dataset Loader & PyTorch Dataset Interface
Milestone M2.1: Dataset & Data Pipeline Foundation
"""

from typing import Dict, List, Tuple, Any, Optional
import numpy as np
from ml.config import SEQUENCE_LENGTH, FEATURE_DIM
from ml.label_map import encode_label


class ISLSequenceDataset:
    """
    In-memory dataset loader for SignBridge AI sequences.
    Holds (N, 30, 1629) float32 matrices and integer label targets.
    Fully compatible with standard PyTorch Dataset / DataLoader wrappers.
    """

    def __init__(self, sequences: List[np.ndarray], labels: List[int]):
        assert len(sequences) == len(labels), "Number of sequences must match number of labels."
        
        self.sequences = sequences
        self.labels = labels

        # Validate tensor shapes
        for idx, seq in enumerate(self.sequences):
            if seq.shape != (SEQUENCE_LENGTH, FEATURE_DIM):
                raise ValueError(
                    f"Sample at index {idx} has invalid shape {seq.shape}. Expected ({SEQUENCE_LENGTH}, {FEATURE_DIM})."
                )

    def __len__(self) -> int:
        return len(self.sequences)

    def __getitem__(self, idx: int) -> Tuple[np.ndarray, int]:
        return self.sequences[idx], self.labels[idx]

    def get_batch(self, batch_indices: List[int]) -> Tuple[np.ndarray, np.ndarray]:
        """
        Creates a batched NumPy array representation of shape (Batch_Size, 30, 1629).
        """
        batch_seqs = np.array([self.sequences[i] for i in batch_indices], dtype=np.float32)
        batch_labels = np.array([self.labels[i] for i in batch_indices], dtype=np.int64)
        return batch_seqs, batch_labels
