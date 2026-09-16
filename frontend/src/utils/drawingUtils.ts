import { NormalizedLandmark } from '../ml/types';

const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [9, 10], [10, 11], [11, 12],
  // Ring
  [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm Base
  [5, 9], [9, 13], [13, 17]
];

const POSE_CONNECTIONS = [
  [11, 12], // Shoulders
  [11, 13], [13, 15], // Left Arm
  [12, 14], [14, 16], // Right Arm
  [11, 23], [12, 24], [23, 24], // Torso
];

export function drawLandmarksOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  poseLandmarks: NormalizedLandmark[] | null,
  leftHandLandmarks: NormalizedLandmark[] | null,
  rightHandLandmarks: NormalizedLandmark[] | null,
  faceLandmarks: NormalizedLandmark[] | null
): void {
  ctx.clearRect(0, 0, width, height);

  // 1. Draw Pose Landmarks & Connections
  if (poseLandmarks) {
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 3;
    for (const [start, end] of POSE_CONNECTIONS) {
      const p1 = poseLandmarks[start];
      const p2 = poseLandmarks[end];
      if (p1 && p2 && (p1.visibility ?? 1) > 0.4 && (p2.visibility ?? 1) > 0.4) {
        ctx.beginPath();
        ctx.moveTo(p1.x * width, p1.y * height);
        ctx.lineTo(p2.x * width, p2.y * height);
        ctx.stroke();
      }
    }

    ctx.fillStyle = '#FF4081';
    for (const lm of poseLandmarks) {
      if ((lm.visibility ?? 1) > 0.4) {
        ctx.beginPath();
        ctx.arc(lm.x * width, lm.y * height, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  // 2. Draw Left Hand
  if (leftHandLandmarks) {
    drawHand(ctx, leftHandLandmarks, width, height, '#00FF66', '#00B0FF');
  }

  // 3. Draw Right Hand
  if (rightHandLandmarks) {
    drawHand(ctx, rightHandLandmarks, width, height, '#FFB300', '#FF3D00');
  }

  // 4. Draw Face Landmarks (Subtle dots)
  if (faceLandmarks) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < faceLandmarks.length; i += 3) { // Sample every 3rd point for performance
      const lm = faceLandmarks[i];
      ctx.beginPath();
      ctx.arc(lm.x * width, lm.y * height, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

function drawHand(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  width: number,
  height: number,
  lineColor: string,
  pointColor: string
): void {
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;

  for (const [start, end] of HAND_CONNECTIONS) {
    const p1 = landmarks[start];
    const p2 = landmarks[end];
    if (p1 && p2) {
      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.stroke();
    }
  }

  ctx.fillStyle = pointColor;
  for (const lm of landmarks) {
    ctx.beginPath();
    ctx.arc(lm.x * width, lm.y * height, 3, 0, 2 * Math.PI);
    ctx.fill();
  }
}
