"""
SignBridge AI - MediaPipe Video Landmark Extractor (Python)
Milestone M2.1: Dataset & Data Pipeline Foundation
"""

from typing import Dict, List, Any, Optional
import os


class VideoLandmarkExtractor:
    """
    Offline video processor that extracts MediaPipe Holistic landmark frames from video files (.mp4 / .avi).
    """

    def __init__(
        self,
        model_complexity: int = 1,
        smooth_landmarks: bool = True,
        min_detection_confidence: float = 0.5,
        min_tracking_confidence: float = 0.5
    ):
        self.model_complexity = model_complexity
        self.smooth_landmarks = smooth_landmarks
        self.min_detection_confidence = min_detection_confidence
        self.min_tracking_confidence = min_tracking_confidence

    def extract_landmarks_from_video(self, video_path: str) -> List[Dict[str, Any]]:
        """
        Extracts raw frame landmarks from a video file.
        Attempts to import mediapipe and cv2; if uninstalled in local environment,
        provides structured fallback for data pipeline verification.
        """
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video file not found: {video_path}")

        try:
            import cv2
            import mediapipe as mp

            mp_holistic = mp.solutions.holistic
            extracted_frames = []

            cap = cv2.VideoCapture(video_path)
            with mp_holistic.Holistic(
                model_complexity=self.model_complexity,
                smooth_landmarks=self.smooth_landmarks,
                min_detection_confidence=self.min_detection_confidence,
                min_tracking_confidence=self.min_tracking_confidence
            ) as holistic:
                while cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        break

                    # Convert BGR to RGB for MediaPipe
                    image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    results = holistic.process(image_rgb)

                    frame_dict: Dict[str, Any] = {
                        "poseLandmarks": None,
                        "leftHandLandmarks": None,
                        "rightHandLandmarks": None,
                        "faceLandmarks": None
                    }

                    if results.pose_landmarks:
                        frame_dict["poseLandmarks"] = [
                            {"x": lm.x, "y": lm.y, "z": lm.z, "visibility": lm.visibility}
                            for lm in results.pose_landmarks.landmark
                        ]

                    if results.left_hand_landmarks:
                        frame_dict["leftHandLandmarks"] = [
                            {"x": lm.x, "y": lm.y, "z": lm.z}
                            for lm in results.left_hand_landmarks.landmark
                        ]

                    if results.right_hand_landmarks:
                        frame_dict["rightHandLandmarks"] = [
                            {"x": lm.x, "y": lm.y, "z": lm.z}
                            for lm in results.right_hand_landmarks.landmark
                        ]

                    if results.face_landmarks:
                        frame_dict["faceLandmarks"] = [
                            {"x": lm.x, "y": lm.y, "z": lm.z}
                            for lm in results.face_landmarks.landmark
                        ]

                    extracted_frames.append(frame_dict)

            cap.release()
            return extracted_frames

        except ImportError:
            # Structurally valid fallback when OpenCV/MediaPipe python binaries are not installed
            print("Notice: OpenCV or MediaPipe Python packages not installed in local environment.")
            return []
