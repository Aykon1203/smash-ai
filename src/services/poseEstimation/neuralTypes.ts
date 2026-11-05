export interface Keypoint {
  name: string;
  x: number; // 0.0 - 1.0 of pixel coordinaat
  y: number; // 0.0 - 1.0 of pixel coordinaat
  score: number; // 0.0 - 1.0 betrouwbaarheid van het neurale netwerk
}

export interface NeuralPoseResult {
  keypoints: Keypoint[];
  score: number; // algemene score van de pose
  timestampMs: number;
  frameIndex: number;
}

export interface VisionModelStatus {
  isLoaded: boolean;
  modelName: string;
  backend: 'movenet_neural_webgl' | 'gemini_multimodal_vision' | 'mediapipe_vision';
  activeEngine: string;
}
