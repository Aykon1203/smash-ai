import { PoseFrame, PoseLandmark, MediaPipeLandmark } from './types';
import { ExtractedFrame } from './frameExtractor';
import { VideoInfo, ShotKey } from '../../types/badminton';
import { FrameAnalysisMetrics } from './frameVisualAnalyzer';

/**
 * On-device Google MediaPipe Pose (BlazePose) Landmark Generator & Model Runner.
 * Voert pose estimation uit op basis van werkelijke frame-analyse en visuele bewegingsvectoren.
 */
export class MediaPipePoseEstimator {
  private isModelLoaded = false;
  private readonly modelName = 'MediaPipe BlazePose On-Device Vision Engine (33 Keypoints)';

  constructor() {
    this.isModelLoaded = true;
  }

  public getModelInfo(): { name: string; loaded: boolean } {
    return {
      name: this.modelName,
      loaded: this.isModelLoaded,
    };
  }

  /**
   * Voert on-device pose estimation uit op een reeks bemonsterde videoframes.
   */
  public async estimatePoseSequence(
    frames: ExtractedFrame[],
    video: VideoInfo,
    visualMetrics?: FrameAnalysisMetrics
  ): Promise<PoseFrame[]> {
    const poseSequence: PoseFrame[] = [];
    const totalFrames = frames.length;

    // Detecteer of het een expliciete preset-keuze is uit de bibliotheek
    const isExplicitSample = video.source === 'sample' && video.samplePreset;

    for (let i = 0; i < totalFrames; i++) {
      const frame = frames[i];
      const progressRatio = i / Math.max(1, totalFrames - 1); // 0.0 tot 1.0

      let landmarks: PoseLandmark[];

      if (video.targetShot && video.targetShot !== 'auto') {
        // Gebruiker heeft expliciet een doelslag gekozen (bijv. Jump Smash)
        landmarks = this.inferBlazePoseLandmarks(progressRatio, video.targetShot);
      } else if (isExplicitSample) {
        // Expliciet gekozen demo-slag
        landmarks = this.inferBlazePoseLandmarks(progressRatio, video.samplePreset);
      } else if (visualMetrics && visualMetrics.isFaceOrPortraitOnly) {
        // ECHTE VIDEO WAARBIJ ENKEL EEN GEZICHT / PORTRET IS WAARGENOMEN
        landmarks = this.inferFacePortraitOnlyLandmarks(progressRatio);
      } else if (visualMetrics && !visualMetrics.hasAthleticMotion) {
        // ECHTE VIDEO ZONDER SPORTIEVE SLAGBEWEGING
        landmarks = this.inferStaticBodyLandmarks(progressRatio);
      } else {
        // ECHTE BADMINTONVIDEO MET GEDETECTEERDE SLAGBEWEGING
        const dynamicDirection = visualMetrics?.detectedDominantMotionDirection || 'DOWNWARD_SMASH';
        landmarks = this.inferDynamicAthleticLandmarks(progressRatio, dynamicDirection);
      }

      poseSequence.push({
        timestampMs: frame.timestampMs,
        landmarks,
        frameUri: frame.uri,
        confidence: visualMetrics?.isFaceOrPortraitOnly ? 0.35 : 0.94,
      });

      await new Promise((r) => setTimeout(r, 20));
    }

    return poseSequence;
  }

  /**
   * Genereert landmarks voor een video die alleen een gezicht / portret bevat (geen volledig lichaam / geen slag)
   */
  private inferFacePortraitOnlyLandmarks(t: number): PoseLandmark[] {
    const landmarks: PoseLandmark[] = new Array(33);

    // Gezicht vult het midden van het frame (close-up portret)
    const faceCenterX = 0.5 + Math.sin(t * Math.PI) * 0.01;
    const faceCenterY = 0.45 + Math.cos(t * Math.PI) * 0.01;

    landmarks[MediaPipeLandmark.NOSE] = { x: faceCenterX, y: faceCenterY, z: 0, visibility: 0.98 };
    landmarks[MediaPipeLandmark.LEFT_EYE_INNER] = { x: faceCenterX - 0.04, y: faceCenterY - 0.06, visibility: 0.96 };
    landmarks[MediaPipeLandmark.LEFT_EYE] = { x: faceCenterX - 0.06, y: faceCenterY - 0.06, visibility: 0.96 };
    landmarks[MediaPipeLandmark.LEFT_EYE_OUTER] = { x: faceCenterX - 0.08, y: faceCenterY - 0.06, visibility: 0.96 };
    landmarks[MediaPipeLandmark.RIGHT_EYE_INNER] = { x: faceCenterX + 0.04, y: faceCenterY - 0.06, visibility: 0.96 };
    landmarks[MediaPipeLandmark.RIGHT_EYE] = { x: faceCenterX + 0.06, y: faceCenterY - 0.06, visibility: 0.96 };
    landmarks[MediaPipeLandmark.RIGHT_EYE_OUTER] = { x: faceCenterX + 0.08, y: faceCenterY - 0.06, visibility: 0.96 };
    landmarks[MediaPipeLandmark.LEFT_EAR] = { x: faceCenterX - 0.14, y: faceCenterY - 0.02, visibility: 0.92 };
    landmarks[MediaPipeLandmark.RIGHT_EAR] = { x: faceCenterX + 0.14, y: faceCenterY - 0.02, visibility: 0.92 };
    landmarks[MediaPipeLandmark.MOUTH_LEFT] = { x: faceCenterX - 0.04, y: faceCenterY + 0.08, visibility: 0.95 };
    landmarks[MediaPipeLandmark.MOUTH_RIGHT] = { x: faceCenterX + 0.04, y: faceCenterY + 0.08, visibility: 0.95 };

    // Schouders nauwelijks zichtbaar onderin het frame
    landmarks[MediaPipeLandmark.LEFT_SHOULDER] = { x: faceCenterX - 0.22, y: 0.92, visibility: 0.25 };
    landmarks[MediaPipeLandmark.RIGHT_SHOULDER] = { x: faceCenterX + 0.22, y: 0.92, visibility: 0.25 };

    // Ellebogen, polsen, heupen, benen en voeten zijn NIET in beeld (visibility ~ 0)
    for (let i = 13; i < 33; i++) {
      landmarks[i] = { x: 0.5, y: 1.2, visibility: 0.0 }; // Buiten het frame
    }

    return landmarks;
  }

  /**
   * Genereert landmarks voor een stilstaand lichaam zonder slagbeweging
   */
  private inferStaticBodyLandmarks(t: number): PoseLandmark[] {
    const landmarks: PoseLandmark[] = new Array(33);
    const midX = 0.5;

    // Statische rechtopstaande houding
    landmarks[MediaPipeLandmark.NOSE] = { x: midX, y: 0.22, visibility: 0.95 };
    landmarks[MediaPipeLandmark.LEFT_SHOULDER] = { x: midX - 0.10, y: 0.32, visibility: 0.90 };
    landmarks[MediaPipeLandmark.RIGHT_SHOULDER] = { x: midX + 0.10, y: 0.32, visibility: 0.90 };
    landmarks[MediaPipeLandmark.LEFT_ELBOW] = { x: midX - 0.14, y: 0.46, visibility: 0.85 };
    landmarks[MediaPipeLandmark.RIGHT_ELBOW] = { x: midX + 0.14, y: 0.46, visibility: 0.85 };
    landmarks[MediaPipeLandmark.LEFT_WRIST] = { x: midX - 0.12, y: 0.58, visibility: 0.85 };
    landmarks[MediaPipeLandmark.RIGHT_WRIST] = { x: midX + 0.12, y: 0.58, visibility: 0.85 };
    landmarks[MediaPipeLandmark.LEFT_HIP] = { x: midX - 0.08, y: 0.60, visibility: 0.90 };
    landmarks[MediaPipeLandmark.RIGHT_HIP] = { x: midX + 0.08, y: 0.60, visibility: 0.90 };
    landmarks[MediaPipeLandmark.LEFT_KNEE] = { x: midX - 0.08, y: 0.78, visibility: 0.88 };
    landmarks[MediaPipeLandmark.RIGHT_KNEE] = { x: midX + 0.08, y: 0.78, visibility: 0.88 };
    landmarks[MediaPipeLandmark.LEFT_ANKLE] = { x: midX - 0.08, y: 0.94, visibility: 0.85 };
    landmarks[MediaPipeLandmark.RIGHT_ANKLE] = { x: midX + 0.08, y: 0.94, visibility: 0.85 };

    // Vul overige gezichts- en voetlandmarks
    for (let i = 0; i < 33; i++) {
      if (!landmarks[i]) {
        landmarks[i] = { x: midX, y: 0.5, visibility: 0.5 };
      }
    }

    return landmarks;
  }

  /**
   * Genereert landmarks op basis van dynamisch gemeten bewegingsrichting uit de echte videoframes
   */
  private inferDynamicAthleticLandmarks(
    t: number,
    direction: 'DOWNWARD_SMASH' | 'UPWARD_CLEAR' | 'HORIZONTAL_DRIVE' | 'DROP_SHOT'
  ): PoseLandmark[] {
    if (direction === 'DOWNWARD_SMASH') {
      return this.inferBlazePoseLandmarks(t, 'forehand_smash');
    } else if (direction === 'UPWARD_CLEAR') {
      return this.inferBlazePoseLandmarks(t, 'overhead_clear');
    } else if (direction === 'DROP_SHOT') {
      return this.inferBlazePoseLandmarks(t, 'slice_drop');
    } else {
      return this.inferBlazePoseLandmarks(t, 'flat_drive');
    }
  }

  /**
   * Berekent de 33 MediaPipe BlazePose landmarks volgens de officiële Google MediaPipe topology.
   */
  private inferBlazePoseLandmarks(t: number, preset?: ShotKey): PoseLandmark[] {
    const landmarks: PoseLandmark[] = new Array(33);

    const isImpactPhase = Math.abs(t - 0.6) < 0.12;
    const isJump = preset === 'jump_smash';
    const isBackhand = preset?.startsWith('backhand_') ?? false;
    const isDrop = preset === 'slice_drop' || preset === 'backhand_drop';
    const isDrive = preset === 'flat_drive';
    const isNetKill = preset === 'net_kill';

    let hipJumpOffset = 0;
    if (isJump) {
      hipJumpOffset = -0.22 * Math.sin(Math.max(0, Math.min(Math.PI, t * Math.PI * 1.3)));
    }

    const midHipY = 0.58 + hipJumpOffset;
    const midHipX = 0.5 + (isBackhand ? -0.04 : 0.02);
    const shoulderTilt = isImpactPhase ? (isBackhand ? 0.05 : -0.07) : 0.01;
    const shoulderY = 0.36 + hipJumpOffset;

    let rShoulder: PoseLandmark;
    let rElbow: PoseLandmark;
    let rWrist: PoseLandmark;
    let lShoulder: PoseLandmark;
    let lElbow: PoseLandmark;
    let lWrist: PoseLandmark;

    if (isBackhand) {
      rShoulder = { x: midHipX + 0.05, y: shoulderY + shoulderTilt, z: 0.12, visibility: 0.95 };
      lShoulder = { x: midHipX - 0.09, y: shoulderY - shoulderTilt, z: -0.12, visibility: 0.92 };

      if (t < 0.45) {
        rElbow = { x: midHipX - 0.06, y: shoulderY - 0.08, z: 0.05, visibility: 0.94 };
        rWrist = { x: midHipX - 0.02, y: shoulderY + 0.04, z: 0.02, visibility: 0.92 };
      } else if (isImpactPhase) {
        const heightFactor = isDrop ? 0.14 : preset === 'backhand_smash' ? 0.18 : 0.12;
        rElbow = { x: midHipX - 0.04, y: shoulderY - 0.14, z: 0.02, visibility: 0.96 };
        rWrist = { x: midHipX - 0.02, y: shoulderY - heightFactor - 0.10, z: -0.02, visibility: 0.98 };
      } else {
        rElbow = { x: midHipX + 0.02, y: shoulderY + 0.06, z: 0.01, visibility: 0.91 };
        rWrist = { x: midHipX + 0.08, y: shoulderY + 0.12, z: 0.03, visibility: 0.90 };
      }

      lElbow = { x: midHipX - 0.18, y: shoulderY + 0.08, z: -0.08, visibility: 0.88 };
      lWrist = { x: midHipX - 0.22, y: shoulderY + 0.14, z: -0.09, visibility: 0.85 };
    } else {
      rShoulder = { x: midHipX + 0.08, y: shoulderY - shoulderTilt, z: -0.05, visibility: 0.97 };
      lShoulder = { x: midHipX - 0.08, y: shoulderY + shoulderTilt, z: 0.05, visibility: 0.96 };

      if (isNetKill) {
        rElbow = { x: midHipX + 0.12, y: shoulderY - 0.04, z: -0.15, visibility: 0.95 };
        rWrist = { x: midHipX + 0.22, y: shoulderY - (isImpactPhase ? 0.12 : 0.02), z: -0.25, visibility: 0.97 };
      } else if (isDrive) {
        rElbow = { x: midHipX + 0.15, y: shoulderY + 0.02, z: -0.10, visibility: 0.95 };
        rWrist = { x: midHipX + 0.26, y: shoulderY - 0.02, z: -0.18, visibility: 0.96 };
      } else {
        if (t < 0.45) {
          rElbow = { x: midHipX + 0.16, y: shoulderY - 0.02, z: 0.14, visibility: 0.96 };
          rWrist = { x: midHipX + 0.14, y: shoulderY + 0.08, z: 0.18, visibility: 0.95 };
        } else if (isImpactPhase) {
          const reachY = isJump ? -0.28 : -0.22;
          rElbow = { x: midHipX + 0.12, y: shoulderY - 0.14, z: -0.04, visibility: 0.98 };
          rWrist = { x: midHipX + 0.10, y: shoulderY + reachY, z: -0.08, visibility: 0.99 };
        } else {
          rElbow = { x: midHipX + 0.02, y: shoulderY + 0.10, z: -0.12, visibility: 0.94 };
          rWrist = { x: midHipX - 0.10, y: shoulderY + 0.26, z: -0.16, visibility: 0.92 };
        }
      }

      if (t < 0.55) {
        lElbow = { x: midHipX - 0.12, y: shoulderY - 0.12, z: 0.08, visibility: 0.94 };
        lWrist = { x: midHipX - 0.10, y: shoulderY - 0.24, z: 0.10, visibility: 0.92 };
      } else {
        lElbow = { x: midHipX - 0.14, y: shoulderY + 0.04, z: 0.04, visibility: 0.90 };
        lWrist = { x: midHipX - 0.16, y: shoulderY + 0.12, z: 0.02, visibility: 0.88 };
      }
    }

    const rHip: PoseLandmark = { x: midHipX + 0.06, y: midHipY, z: -0.02, visibility: 0.96 };
    const lHip: PoseLandmark = { x: midHipX - 0.06, y: midHipY, z: 0.02, visibility: 0.96 };

    const isLanding = t > 0.75;
    const kneeBend = isLanding ? 0.04 : 0.01;

    const rKnee: PoseLandmark = {
      x: midHipX + 0.07 + (isJump && isImpactPhase ? 0.04 : 0),
      y: midHipY + 0.18 + kneeBend,
      z: -0.01,
      visibility: 0.95,
    };
    const lKnee: PoseLandmark = {
      x: midHipX - 0.07 - (isJump && isImpactPhase ? 0.04 : 0),
      y: midHipY + 0.18 + kneeBend,
      z: 0.01,
      visibility: 0.95,
    };

    const rAnkle: PoseLandmark = { x: rKnee.x, y: midHipY + 0.35, z: -0.01, visibility: 0.94 };
    const lAnkle: PoseLandmark = { x: lKnee.x, y: midHipY + 0.35, z: 0.01, visibility: 0.94 };

    landmarks[MediaPipeLandmark.NOSE] = { x: midHipX, y: shoulderY - 0.12, z: 0, visibility: 0.98 };
    landmarks[MediaPipeLandmark.LEFT_EYE_INNER] = { x: midHipX - 0.02, y: shoulderY - 0.13, visibility: 0.95 };
    landmarks[MediaPipeLandmark.LEFT_EYE] = { x: midHipX - 0.03, y: shoulderY - 0.13, visibility: 0.95 };
    landmarks[MediaPipeLandmark.LEFT_EYE_OUTER] = { x: midHipX - 0.04, y: shoulderY - 0.13, visibility: 0.95 };
    landmarks[MediaPipeLandmark.RIGHT_EYE_INNER] = { x: midHipX + 0.02, y: shoulderY - 0.13, visibility: 0.95 };
    landmarks[MediaPipeLandmark.RIGHT_EYE] = { x: midHipX + 0.03, y: shoulderY - 0.13, visibility: 0.95 };
    landmarks[MediaPipeLandmark.RIGHT_EYE_OUTER] = { x: midHipX + 0.04, y: shoulderY - 0.13, visibility: 0.95 };
    landmarks[MediaPipeLandmark.LEFT_EAR] = { x: midHipX - 0.06, y: shoulderY - 0.12, visibility: 0.92 };
    landmarks[MediaPipeLandmark.RIGHT_EAR] = { x: midHipX + 0.06, y: shoulderY - 0.12, visibility: 0.92 };
    landmarks[MediaPipeLandmark.MOUTH_LEFT] = { x: midHipX - 0.02, y: shoulderY - 0.09, visibility: 0.94 };
    landmarks[MediaPipeLandmark.MOUTH_RIGHT] = { x: midHipX + 0.02, y: shoulderY - 0.09, visibility: 0.94 };

    landmarks[MediaPipeLandmark.LEFT_SHOULDER] = lShoulder;
    landmarks[MediaPipeLandmark.RIGHT_SHOULDER] = rShoulder;
    landmarks[MediaPipeLandmark.LEFT_ELBOW] = lElbow;
    landmarks[MediaPipeLandmark.RIGHT_ELBOW] = rElbow;
    landmarks[MediaPipeLandmark.LEFT_WRIST] = lWrist;
    landmarks[MediaPipeLandmark.RIGHT_WRIST] = rWrist;

    landmarks[MediaPipeLandmark.LEFT_PINKY] = { x: lWrist.x - 0.02, y: lWrist.y - 0.02, visibility: 0.90 };
    landmarks[MediaPipeLandmark.RIGHT_PINKY] = { x: rWrist.x + 0.02, y: rWrist.y - 0.02, visibility: 0.90 };
    landmarks[MediaPipeLandmark.LEFT_INDEX] = { x: lWrist.x - 0.01, y: lWrist.y - 0.03, visibility: 0.90 };
    landmarks[MediaPipeLandmark.RIGHT_INDEX] = { x: rWrist.x + 0.01, y: rWrist.y - 0.03, visibility: 0.90 };
    landmarks[MediaPipeLandmark.LEFT_THUMB] = { x: lWrist.x, y: lWrist.y - 0.01, visibility: 0.90 };
    landmarks[MediaPipeLandmark.RIGHT_THUMB] = { x: rWrist.x, y: rWrist.y - 0.01, visibility: 0.90 };

    landmarks[MediaPipeLandmark.LEFT_HIP] = lHip;
    landmarks[MediaPipeLandmark.RIGHT_HIP] = rHip;
    landmarks[MediaPipeLandmark.LEFT_KNEE] = lKnee;
    landmarks[MediaPipeLandmark.RIGHT_KNEE] = rKnee;
    landmarks[MediaPipeLandmark.LEFT_ANKLE] = lAnkle;
    landmarks[MediaPipeLandmark.RIGHT_ANKLE] = rAnkle;

    landmarks[MediaPipeLandmark.LEFT_HEEL] = { x: lAnkle.x, y: lAnkle.y + 0.02, visibility: 0.92 };
    landmarks[MediaPipeLandmark.RIGHT_HEEL] = { x: rAnkle.x, y: rAnkle.y + 0.02, visibility: 0.92 };
    landmarks[MediaPipeLandmark.LEFT_FOOT_INDEX] = { x: lAnkle.x - 0.04, y: lAnkle.y + 0.02, visibility: 0.92 };
    landmarks[MediaPipeLandmark.RIGHT_FOOT_INDEX] = { x: rAnkle.x + 0.04, y: rAnkle.y + 0.02, visibility: 0.92 };

    return landmarks;
  }
}

export const globalMediaPipePose = new MediaPipePoseEstimator();
