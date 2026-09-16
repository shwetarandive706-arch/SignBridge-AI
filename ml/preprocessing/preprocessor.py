"""
SignBridge AI - Landmark Preprocessor Module (Python)
Milestone M2.1: Dataset & Data Pipeline Foundation
Strictly preserves M1.2 specification: 1629 features per frame, 30-frame sequence window.
"""

from typing import Dict, List, Optional, Any
import numpy as np
from ml.config import FEATURE_DIM, SEQUENCE_LENGTH, TOTAL_TENSOR_SIZE


class PythonLandmarkPreprocessor:

    @staticmethod
    def preprocess_frame(frame_landmarks: Dict[str, Any]) -> np.ndarray:
        """
        Preprocesses a single frame of raw MediaPipe Holistic landmarks into a 1,629-dimensional NumPy float32 vector.
        
        frame_landmarks expects dict structure:
          {
            "poseLandmarks": [{"x": float, "y": float, "z": float}, ...], # 33 points
            "leftHandLandmarks": [{"x": float, "y": float, "z": float}, ...], # 21 points
            "rightHandLandmarks": [{"x": float, "y": float, "z": float}, ...], # 21 points
            "faceLandmarks": [{"x": float, "y": float, "z": float}, ...] # 468 points
          }
        """
        vector = np.zeros(FEATURE_DIM, dtype=np.float32)
        offset = 0

        # 1. Pose Landmarks (99 values)
        pose_lms = frame_landmarks.get("poseLandmarks")
        if pose_lms and len(pose_lms) >= 33:
            left_shoulder = pose_lms[11]
            right_shoulder = pose_lms[12]
            origin_x = (left_shoulder["x"] + right_shoulder["x"]) / 2.0
            origin_y = (left_shoulder["y"] + right_shoulder["y"]) / 2.0
            origin_z = (left_shoulder["z"] + right_shoulder["z"]) / 2.0

            for i in range(33):
                lm = pose_lms[i]
                vector[offset] = lm["x"] - origin_x
                vector[offset + 1] = lm["y"] - origin_y
                vector[offset + 2] = lm["z"] - origin_z
                offset += 3
        else:
            offset += 99

        # 2. Left Hand Landmarks (63 values)
        lh_lms = frame_landmarks.get("leftHandLandmarks")
        if lh_lms and len(lh_lms) >= 21:
            wrist = lh_lms[0]
            for i in range(21):
                lm = lh_lms[i]
                vector[offset] = lm["x"] - wrist["x"]
                vector[offset + 1] = lm["y"] - wrist["y"]
                vector[offset + 2] = lm["z"] - wrist["z"]
                offset += 3
        else:
            offset += 63

        # 3. Right Hand Landmarks (63 values)
        rh_lms = frame_landmarks.get("rightHandLandmarks")
        if rh_lms and len(rh_lms) >= 21:
            wrist = rh_lms[0]
            for i in range(21):
                lm = rh_lms[i]
                vector[offset] = lm["x"] - wrist["x"]
                vector[offset + 1] = lm["y"] - wrist["y"]
                vector[offset + 2] = lm["z"] - wrist["z"]
                offset += 3
        else:
            offset += 63

        # 4. Face Landmarks (1404 values)
        face_lms = frame_landmarks.get("faceLandmarks")
        if face_lms and len(face_lms) >= 468:
            nose_tip = face_lms[1]
            for i in range(468):
                lm = face_lms[i]
                vector[offset] = lm["x"] - nose_tip["x"]
                vector[offset + 1] = lm["y"] - nose_tip["y"]
                vector[offset + 2] = lm["z"] - nose_tip["z"]
                offset += 3
        else:
            offset += 1404

        return vector

    @classmethod
    def preprocess_sequence(cls, sequence_frames: List[Dict[str, Any]]) -> np.ndarray:
        """
        Preprocesses a list of frame landmark dicts into a fixed (30, 1629) float32 NumPy matrix.
        Pads or truncates to exactly SEQUENCE_LENGTH (30) frames.
        """
        matrix = np.zeros((SEQUENCE_LENGTH, FEATURE_DIM), dtype=np.float32)

        for i in range(min(len(sequence_frames), SEQUENCE_LENGTH)):
            matrix[i] = cls.preprocess_frame(sequence_frames[i])

        return matrix
