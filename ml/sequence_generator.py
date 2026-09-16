"""
SignBridge AI - Sequence Generator Module
Milestone M2.1: Dataset & Data Pipeline Foundation
"""

from typing import Dict, List, Any
import numpy as np
from ml.config import SEQUENCE_LENGTH, FEATURE_DIM
from ml.preprocessing.preprocessor import PythonLandmarkPreprocessor


class SequenceGenerator:
    """
    Generates fixed (30, 1629) preprocessed feature tensors from variable-length landmark frame lists.
    """

    @classmethod
    def process_frames_to_tensor(cls, raw_frames: List[Dict[str, Any]]) -> np.ndarray:
        """
        Takes raw frame landmark dictionaries and performs uniform temporal sampling or padding
        to yield an exact (30, 1629) NumPy matrix.
        """
        num_raw = len(raw_frames)

        if num_raw == 0:
            # Empty input fallback: 30 frames of zero vectors
            return np.zeros((SEQUENCE_LENGTH, FEATURE_DIM), dtype=np.float32)

        if num_raw == SEQUENCE_LENGTH:
            sampled_frames = raw_frames
        elif num_raw > SEQUENCE_LENGTH:
            # Uniform temporal sampling down to 30 frames
            indices = np.linspace(0, num_raw - 1, SEQUENCE_LENGTH, dtype=int)
            sampled_frames = [raw_frames[i] for i in indices]
        else:
            # Zero-padding up to 30 frames
            sampled_frames = raw_frames

        # Run through feature preprocessor
        return PythonLandmarkPreprocessor.preprocess_sequence(sampled_frames)
