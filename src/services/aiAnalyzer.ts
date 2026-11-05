import { ShotAnalysis, VideoInfo, AnalysisStage, ShotPresetOption } from '../types/badminton';
import { extractVideoFrames } from './poseEstimation/frameExtractor';
import { globalMediaPipePose } from './poseEstimation/mediaPipeModel';
import { extractBiomechanicalMetrics } from './poseEstimation/kinematics';
import { classifyShotFromBiometrics } from './poseEstimation/shotClassifier';

export const SHOT_PRESETS: ShotPresetOption[] = [
  {
    key: 'jump_smash',
    name: 'Jump Smash',
    category: 'Smash',
    icon: 'flash',
    badge: 'Kracht & Hoek',
    description: 'Explosieve verticale sprong met steile neerwaartse baan',
  },
  {
    key: 'backhand_smash',
    name: 'Backhand Smash',
    category: 'Smash',
    icon: 'rocket',
    badge: 'Verrassend & Dodelijk',
    description: 'Zeldzaam aanvallend wapen met snelle onderarmsupinatie',
  },
  {
    key: 'backhand_clear',
    name: 'Backhand Clear',
    category: 'Clear',
    icon: 'arrow-up-circle',
    badge: 'Achterveld Herstel',
    description: 'Hoge verdedigende of aanvallende clear vanuit de verre achterhoek',
  },
  {
    key: 'backhand_drop',
    name: 'Backhand Drop',
    category: 'Drop',
    icon: 'water',
    badge: 'Gevoel & Vermomming',
    description: 'Zacht gesneden dropshot die strak over de netrand tuimelt',
  },
  {
    key: 'forehand_smash',
    name: 'Forehand Smash',
    category: 'Smash',
    icon: 'flame',
    badge: 'Pure Snelheid',
    description: 'Klassieke harde smash met krachtige onderarmpronatie',
  },
  {
    key: 'overhead_clear',
    name: 'Overhead Clear',
    category: 'Clear',
    icon: 'cloud-upload',
    badge: 'Baancontrole',
    description: 'Hoge boogbal die de tegenstander diep naar de baseline drijft',
  },
  {
    key: 'slice_drop',
    name: 'Slice Dropshot',
    category: 'Drop',
    icon: 'leaf',
    badge: 'Scherpe Hoek',
    description: 'Snelle cross-court slice met een plotselinge duik voorin',
  },
  {
    key: 'flat_drive',
    name: 'Vlakke Drive',
    category: 'Drive',
    icon: 'speedometer',
    badge: 'Dubbelspel Tempo',
    description: 'Snelle vlakke slagwisseling rakelings over het net',
  },
  {
    key: 'net_kill',
    name: 'Net Kill / Tap',
    category: 'Netslag',
    icon: 'flash-outline',
    badge: 'Direct Punt',
    description: 'Bliksemsnelle tik op een net boven de netband opduikende shuttle',
  },
];

export const ANALYSIS_STAGES: AnalysisStage[] = [
  {
    title: 'Frames & Shuttlebaan Extraheren',
    description: 'Video-frames bemonsteren en vluchtbaan scannen via expo-video-thumbnails...',
    durationMs: 700,
  },
  {
    title: 'Google MediaPipe Pose Inschakelen',
    description: 'On-device BlazePose 33-punts skeletdetectie uitvoeren op video-opname...',
    durationMs: 950,
  },
  {
    title: 'Kinematica & Impact Meten',
    description: 'Gewrichtshoeken, elleboogstrekking, sprongapex en polssnelheid berekenen...',
    durationMs: 850,
  },
  {
    title: 'AI Biomechanisch Rapport Genereren',
    description: 'Sterke punten, technische aandachtspunten en trainingstips formuleren...',
    durationMs: 650,
  },
];

/**
 * Hoofd AI-service pipeline:
 * 1. Extraheert videoframes via expo-video-thumbnails
 * 2. Voert on-device Google MediaPipe Pose (BlazePose 33 keypoints) inference uit
 * 3. Berekent kinematische hoeken en vectoren via kinematics.ts
 * 4. Classificeert de slag en genereert dynamische feedback via shotClassifier.ts
 */
export async function analyzeBadmintonVideo(
  video: VideoInfo,
  onProgress?: (progress: number, stageIndex: number) => void
): Promise<ShotAnalysis> {
  // STAP 1: Video Frames Extraheren (0% -> 25%)
  if (onProgress) onProgress(5, 0);
  const frames = await extractVideoFrames(video, 6);
  if (onProgress) onProgress(25, 0);

  // STAP 2: On-device MediaPipe Pose Inference (25% -> 55%)
  if (onProgress) onProgress(30, 1);
  const poseSequence = await globalMediaPipePose.estimatePoseSequence(frames, video);
  if (onProgress) onProgress(55, 1);

  // STAP 3: Kinematica & Gewrichtshoeken Berekenen (55% -> 80%)
  if (onProgress) onProgress(65, 2);
  const biometrics = extractBiomechanicalMetrics(poseSequence);
  if (onProgress) onProgress(80, 2);

  // STAP 4: Slag Classificeren & Biomechanische Feedback Genereren (80% -> 100%)
  if (onProgress) onProgress(90, 3);
  const classification = classifyShotFromBiometrics(biometrics, video);
  await new Promise((r) => setTimeout(r, 150));
  if (onProgress) onProgress(100, 3);

  return {
    id: `smash-${Date.now()}`,
    shotKey: classification.shotKey,
    shotName: classification.shotName,
    shotCategory: classification.shotCategory,
    score: classification.score,
    tagline: classification.tagline,
    metrics: {
      speedKmh: biometrics.wristPeakSpeedKmh,
      contactHeightM: biometrics.contactHeightEstM,
      impactAngleDeg: biometrics.impactAngleDeg,
      kineticChainEfficiency: biometrics.kineticChainScore,
    },
    goodPoints: classification.goodPoints,
    badPoints: classification.badPoints,
    coachTips: classification.coachTips,
    analyzedAt: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
    video,
  };
}
