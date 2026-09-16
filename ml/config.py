"""
SignBridge AI - Pipeline Configuration
Milestone M2.1: Dataset & Data Pipeline Foundation
"""

import os
from pathlib import Path

# Feature & Sequence Constraints (M1.2 Compatible)
SEQUENCE_LENGTH = 30  # 30 frames per sequence window
POSE_LANDMARKS_COUNT = 33 * 3  # 99 floats
LEFT_HAND_LANDMARKS_COUNT = 21 * 3  # 63 floats
RIGHT_HAND_LANDMARKS_COUNT = 21 * 3  # 63 floats
FACE_LANDMARKS_COUNT = 468 * 3  # 1404 floats

FEATURE_DIM = POSE_LANDMARKS_COUNT + LEFT_HAND_LANDMARKS_COUNT + RIGHT_HAND_LANDMARKS_COUNT + FACE_LANDMARKS_COUNT  # 1629 floats per frame
TOTAL_TENSOR_SIZE = SEQUENCE_LENGTH * FEATURE_DIM  # 48,870 floats total

# Dataset Splitting Ratios (Signer-Aware)
TRAIN_RATIO = 0.70
VAL_RATIO = 0.15
TEST_RATIO = 0.15

RANDOM_SEED = 42

# Directory Paths
BASE_DIR = Path(__file__).resolve().parent.parent
ASSETS_RAW_DIR = BASE_DIR / "assets" / "raw"
ASSETS_PROCESSED_DIR = BASE_DIR / "assets" / "processed"
MODEL_SAVE_DIR = BASE_DIR / "ml" / "models"
