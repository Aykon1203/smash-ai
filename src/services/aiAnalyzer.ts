import { ShotAnalysis, VideoInfo, AnalysisStage, ShotPresetOption } from '../types/badminton';
import { extractVideoFrames } from './poseEstimation/frameExtractor';
import { analyzeRealVideoFrames } from './poseEstimation/frameVisualAnalyzer';
import { globalMediaPipePose } from './poseEstimation/mediaPipeModel';
import { extractBiomechanicalMetrics } from './poseEstimation/kinematics';
import { classifyShotFromBiometrics, generateShotDetails } from './poseEstimation/shotClassifier';
import { ShotKey } from '../types/badminton';

/**
 * Herclassificeert een bestaande analyse naar een ander slagtype indien de gebruiker dit aanpast
 */
export function reclassifyAnalysis(analysis: ShotAnalysis, newShotKey: ShotKey): ShotAnalysis {
  const isBackhand = newShotKey.startsWith('backhand_');
  const isJump = newShotKey === 'jump_smash';
  const speed = newShotKey === 'jump_smash' ? 348 : newShotKey === 'forehand_smash' ? 320 : newShotKey === 'backhand_smash' ? 265 : newShotKey === 'slice_drop' || newShotKey === 'backhand_drop' ? 115 : 240;
  const angle = newShotKey === 'jump_smash' ? 21.2 : newShotKey === 'forehand_smash' ? 18.4 : newShotKey.includes('drop') ? 28.5 : 8.5;

  const biometrics = {
    maxElbowExtensionDeg: 168,
    shoulderElevationDeg: 155,
    torsoRotationDeg: isBackhand ? 58 : 36,
    jumpApexM: isJump ? 0.28 : 0.06,
    wristPeakSpeedKmh: speed,
    impactAngleDeg: angle,
    landingKneeFlexionDeg: 145,
    recoveryDelaySec: 0.31,
    isBackhand,
    contactHeightEstM: isJump ? 2.92 : 2.76,
    kineticChainScore: 91,
    impactFrameIndex: 2,
  };

  const classification = generateShotDetails(newShotKey, biometrics);

  return {
    ...analysis,
    shotKey: classification.shotKey,
    shotName: classification.shotName,
    shotCategory: classification.shotCategory,
    score: classification.score,
    tagline: classification.tagline,
    metrics: {
      speedKmh: speed,
      contactHeightM: biometrics.contactHeightEstM,
      impactAngleDeg: angle,
      kineticChainEfficiency: 91,
    },
    goodPoints: classification.goodPoints,
    badPoints: classification.badPoints,
    coachTips: classification.coachTips,
  };
}

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
    title: 'Frames & Visuele Inhoud Bemonsteren',
    description: 'Video-frames extraheren en analyseren op lichaamsaanwezigheid...',
    durationMs: 700,
  },
  {
    title: 'Google MediaPipe Pose Inspectie',
    description: 'On-device BlazePose 33-punts skelet- en bewegingsanalyse uitvoeren...',
    durationMs: 950,
  },
  {
    title: 'Kinematica & Slagvectoren Meten',
    description: 'Gewrichtshoeken, elleboogstrekking, sprongapex en zwaaisnelheid berekenen...',
    durationMs: 850,
  },
  {
    title: 'AI Biomechanisch Rapport Genereren',
    description: 'Slagclassificatie, sterke punten en feedback formuleren...',
    durationMs: 650,
  },
];

/**
 * Hoofd AI-service pipeline:
 * 1. Extraheert videoframes via expo-video-thumbnails
 * 2. Analyseert echte pixel- en bewegingsdelta's via analyzeRealVideoFrames
 * 3. Voert on-device Google MediaPipe Pose inference uit via globalMediaPipePose
 * 4. Berekent kinematische hoeken en vectoren via kinematics.ts
 * 5. Classificeert de slag en genereert dynamische feedback via shotClassifier.ts
 */
export async function analyzeBadmintonVideo(
  video: VideoInfo,
  onProgress?: (progress: number, stageIndex: number) => void
): Promise<ShotAnalysis> {
  // STAP 1: Video Frames Extraheren & Visueel Bemonsteren (0% -> 25%)
  if (onProgress) onProgress(5, 0);
  const frames = await extractVideoFrames(video, 6);
  if (onProgress) onProgress(15, 0);

  // Analyseer de werkelijke beeldinhoud van de frames (detecteert bijv. gezicht vs lichaam)
  const visualMetrics = await analyzeRealVideoFrames(frames, video.name);
  if (onProgress) onProgress(25, 0);

  // STAP 2: On-device MediaPipe Pose Inference (25% -> 55%)
  if (onProgress) onProgress(30, 1);
  const poseSequence = await globalMediaPipePose.estimatePoseSequence(frames, video, visualMetrics);
  if (onProgress) onProgress(55, 1);

  // STAP 3: Kinematica & Gewrichtshoeken Berekenen (55% -> 80%)
  if (onProgress) onProgress(65, 2);
  const biometrics = extractBiomechanicalMetrics(poseSequence, visualMetrics);
  if (onProgress) onProgress(80, 2);

  // STAP 4: Slag Classificeren & Biomechanische Feedback Genereren (80% -> 100%)
  if (onProgress) onProgress(90, 3);
  const classification = classifyShotFromBiometrics(biometrics, video, visualMetrics);
  await new Promise((r) => setTimeout(r, 150));
  if (onProgress) onProgress(100, 3);

  // Als de video ongeldig is (bijv. enkel een gezicht), zet dan de juiste waarden
  const speed = classification.isInvalidVideo ? 0 : biometrics.wristPeakSpeedKmh;
  const height = classification.isInvalidVideo ? 0 : biometrics.contactHeightEstM;
  const angle = classification.isInvalidVideo ? 0 : biometrics.impactAngleDeg;
  const efficiency = classification.isInvalidVideo ? 0 : biometrics.kineticChainScore;

  return {
    id: `smash-${Date.now()}`,
    shotKey: classification.shotKey,
    shotName: classification.shotName,
    shotCategory: classification.shotCategory,
    score: classification.score,
    tagline: classification.tagline,
    metrics: {
      speedKmh: speed,
      contactHeightM: height,
      impactAngleDeg: angle,
      kineticChainEfficiency: efficiency,
    },
    goodPoints: classification.goodPoints,
    badPoints: classification.badPoints,
    coachTips: classification.coachTips,
    analyzedAt: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
    video,
    isInvalidVideo: classification.isInvalidVideo,
  };
}
