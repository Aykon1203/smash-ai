export type ScreenType = 'Home' | 'Loading' | 'Result';

export type VideoSource = 'camera' | 'upload' | 'sample';

export interface VideoInfo {
  uri: string;
  name?: string;
  duration?: number;
  source: VideoSource;
  samplePreset?: ShotKey;
  thumbnailUri?: string;
}

export type ShotCategory = 'Smash' | 'Clear' | 'Drop' | 'Drive' | 'Net Shot';

export type ShotKey = 
  | 'jump_smash'
  | 'backhand_smash'
  | 'backhand_clear'
  | 'backhand_drop'
  | 'forehand_smash'
  | 'overhead_clear'
  | 'slice_drop'
  | 'net_kill'
  | 'flat_drive';

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
  badge?: 'High' | 'Elite' | 'Good' | 'Needs Work';
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
}

export interface AnalysisStage {
  title: string;
  description: string;
  durationMs: number;
}
