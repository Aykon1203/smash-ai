export type ScreenType = 'Home' | 'Loading' | 'Result';

export type VideoSource = 'camera' | 'upload' | 'sample';

export interface VideoInfo {
  uri: string;
  name?: string;
  duration?: number;
  source: VideoSource;
  samplePreset?: ShotKey;
  targetShot?: ShotKey | 'auto';
  thumbnailUri?: string;
}

export type ShotCategory = 'Smash' | 'Clear' | 'Drop' | 'Drive' | 'Netslag' | 'Niet Herkend';

export type ShotKey = 
  | 'jump_smash'
  | 'backhand_smash'
  | 'backhand_clear'
  | 'backhand_drop'
  | 'forehand_smash'
  | 'overhead_clear'
  | 'slice_drop'
  | 'net_kill'
  | 'flat_drive'
  | 'invalid_face_only'
  | 'invalid_no_swing';

export interface ShotPresetOption {
  key: ShotKey;
  name: string;
  category: ShotCategory;
  icon: string;
  badge: string;
  description: string;
}

export interface AnalysisMetric {
  label: string;
  value: string;
  subtext?: string;
  badge?: 'Hoog' | 'Elite' | 'Goed' | 'Verbetering';
}

export interface ShotAnalysis {
  id: string;
  shotKey: ShotKey;
  shotName: string;
  shotCategory: ShotCategory;
  score: number; // 0 - 100
  tagline: string;
  metrics: {
    speedKmh: number;
    contactHeightM: number;
    impactAngleDeg: number;
    kineticChainEfficiency: number;
  };
  goodPoints: string[];
  badPoints: string[];
  coachTips: string[];
  analyzedAt: string;
  video: VideoInfo;
  isInvalidVideo?: boolean;
}

export interface AnalysisStage {
  title: string;
  description: string;
  durationMs: number;
}
