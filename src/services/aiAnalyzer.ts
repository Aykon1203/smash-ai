import { ShotAnalysis, VideoInfo, AnalysisStage, ShotKey, ShotPresetOption } from '../types/badminton';

export const SHOT_PRESETS: ShotPresetOption[] = [
  {
    key: 'jump_smash',
    name: 'Jump Smash',
    category: 'Smash',
    icon: 'flash',
    badge: 'Power & Angle',
    description: 'Explosive vertical leap with steep downward trajectory',
  },
  {
    key: 'backhand_smash',
    name: 'Backhand Smash',
    category: 'Smash',
    icon: 'rocket',
    badge: 'Deceptive & Lethal',
    description: 'Rare attacking backhand weapon with fast forearm supination',
  },
  {
    key: 'backhand_clear',
    name: 'Backhand Clear',
    category: 'Clear',
    icon: 'arrow-up-circle',
    badge: 'Baseline Defense',
    description: 'High defensive or attacking clear from deep rear backhand corner',
  },
  {
    key: 'backhand_drop',
    name: 'Backhand Drop',
    category: 'Drop',
    icon: 'water',
    badge: 'Touch & Disguise',
    description: 'Soft sliced drop shot tumbling tight over the net tape',
  },
  {
    key: 'forehand_smash',
    name: 'Forehand Smash',
    category: 'Smash',
    icon: 'flame',
    badge: 'Pure Velocity',
    description: 'Classic heavy baseline smash with forearm pronation',
  },
  {
    key: 'overhead_clear',
    name: 'Overhead Clear',
    category: 'Clear',
    icon: 'cloud-upload',
    badge: 'Court Control',
    description: 'High arching shuttle trajectory pushing opponent deep to the rear',
  },
  {
    key: 'slice_drop',
    name: 'Slice Drop Shot',
    category: 'Drop',
    icon: 'leaf',
    badge: 'Angle & Finesse',
    description: 'Fast cross-court slice with steep dip into front court',
  },
  {
    key: 'flat_drive',
    name: 'Flat Drive',
    category: 'Drive',
    icon: 'speedometer',
    badge: 'Doubles Tempo',
    description: 'Rapid horizontal exchange skimming just above net height',
  },
];

export const ANALYSIS_STAGES: AnalysisStage[] = [
  {
    title: 'Extracting Shuttlecock Trajectory',
    description: 'Tracking 60fps flight path, release velocity & apex...',
    durationMs: 800,
  },
  {
    title: 'Mapping Player Biomechanics',
    description: 'Evaluating elbow elevation, shoulder tilt & hip turn...',
    durationMs: 1000,
  },
  {
    title: 'Measuring Impact Mechanics',
    description: 'Calculating racket face angle, wrist snap & contact point...',
    durationMs: 950,
  },
  {
    title: 'Synthesizing AI Feedback',
    description: 'Generating strengths, technical faults & coaching drills...',
    durationMs: 750,
  },
];

const DETAILED_SHOT_DATABASE: Record<ShotKey, Omit<ShotAnalysis, 'id' | 'analyzedAt' | 'video'>> = {
  jump_smash: {
    shotKey: 'jump_smash',
    shotName: 'Explosive Jump Smash',
    shotCategory: 'Smash',
    score: 92,
    tagline: 'High-altitude contact with devastating downward penetration',
    metrics: {
      speedKmh: 365,
      contactHeightM: 2.96,
      impactAngleDeg: 21.3,
      kineticChainEfficiency: 94,
    },
    goodPoints: [
      'Outstanding vertical leap: contact reached at 2.96m peak elevation.',
      'Scissor kick footwork perfectly timed with forearm pronation & wrist snap.',
      'Shoulder and hip uncoiling produced massive racket head speed (365 km/h).',
      'Contact point was firmly in front of the body, creating an aggressive steep angle.',
    ],
    badPoints: [
      'Non-racket balance arm dropped prematurely during the jump peak, leaking torque.',
      'Landing impact absorbed heavily on stiff right heel instead of knees and forefoot.',
      'Recovery split-step back to center court lagged by 0.32s post-landing.',
      'Racket face was 3° slightly open, reducing sideline pinpoint accuracy.',
    ],
    coachTips: [
      'Incorporate plyometric box jumps with racket shadow swings to cushion landings.',
      'Keep your non-racket arm pointing at the shuttle until the split second of rotation.',
      'Practice rapid scissor-kick multi-shuttle feeding drills for instant center recovery.',
    ],
  },

  backhand_smash: {
    shotKey: 'backhand_smash',
    shotName: 'Taufik-Style Backhand Smash',
    shotCategory: 'Smash',
    score: 87,
    tagline: 'Surprise attacking winner executed from deep backhand court',
    metrics: {
      speedKmh: 268,
      contactHeightM: 2.58,
      impactAngleDeg: 16.8,
      kineticChainEfficiency: 90,
    },
    goodPoints: [
      'Textbook backhand bevel grip: thumb pressure exerted cleanly along the racket ridge.',
      'High elbow lead with delayed wrist supination creating explosive whip effect.',
      'Total element of surprise: opponent anticipated a defensive clear.',
      'Clean shuttle impact on the racket sweet spot without frame vibration.',
    ],
    badPoints: [
      'Contact taken slightly behind the torso line rather than at 10 o’clock in front.',
      'Body over-rotated away from court during follow-through, briefly losing sight of opponent.',
      'High physical risk: shoulder joint absorbed excessive deceleration torque.',
    ],
    coachTips: [
      'Ensure you hit the shuttlecock when it is slightly forward of your hitting shoulder.',
      'Allow the racket head to rebound naturally into a ready position rather than forcing an abrupt brake.',
    ],
  },

  backhand_clear: {
    shotKey: 'backhand_clear',
    shotName: 'Overhead Backhand Clear',
    shotCategory: 'Clear',
    score: 85,
    tagline: 'Deep baseline recovery clear relieving backhand court pressure',
    metrics: {
      speedKmh: 232,
      contactHeightM: 2.64,
      impactAngleDeg: 9.5,
      kineticChainEfficiency: 86,
    },
    goodPoints: [
      'Right foot stepped deeply into the rear-left corner, establishing a solid stable hitting base.',
      'Thumb bevel grip allowed relaxed preparation followed by sharp thumb push on impact.',
      'Shuttle flight achieved great height and reached opponent baseline tramlines.',
    ],
    badPoints: [
      'Torso turned back toward the net a fraction too early before shuttle contact.',
      'Elbow dropped 8cm below optimal height during backswing takeback.',
      'Grip tension was too stiff throughout the preparation, limiting whip elasticity.',
    ],
    coachTips: [
      'Keep your back turned fully toward the net until the exact instant of shuttle contact.',
      'Loose fingers on the racket grip until the final 5 milliseconds of thumb snap.',
      'Practice resistance band backhand supination exercises to build forearm power.',
    ],
  },

  backhand_drop: {
    shotKey: 'backhand_drop',
    shotName: 'Deceptive Backhand Drop',
    shotCategory: 'Drop',
    score: 90,
    tagline: 'Soft sliced drop shot tumbling tightly over the front tape',
    metrics: {
      speedKmh: 104,
      contactHeightM: 2.52,
      impactAngleDeg: 29.4,
      kineticChainEfficiency: 88,
    },
    goodPoints: [
      'Exceptional deception: preparation fully simulated a deep backhand clear.',
      'Smooth sliced contact across the skirt feathers producing rapid shuttle deceleration.',
      'Shuttle cleared the net by just 6cm with steep descending trajectory.',
    ],
    badPoints: [
      'Swing speed slowed down noticeably right before contact, giving away intent.',
      'Follow-through frozen stiffly rather than fluidly resetting for the next shot.',
      'Slow front push-off: failed to immediately hunt for the net response.',
    ],
    coachTips: [
      'Maintain identical full arm swing speed and rely solely on slicing angle to slow the shuttle.',
      'Immediately take an aggressive lunging forward step following the backhand drop.',
    ],
  },

  forehand_smash: {
    shotKey: 'forehand_smash',
    shotName: 'Steep Forehand Smash',
    shotCategory: 'Smash',
    score: 89,
    tagline: 'Heavy flat smash with powerful forearm pronation',
    metrics: {
      speedKmh: 342,
      contactHeightM: 2.78,
      impactAngleDeg: 18.6,
      kineticChainEfficiency: 91,
    },
    goodPoints: [
      'Fluid kinetic chain transfer from rear foot drive through hip rotation to racket head.',
      'Violent forearm pronation generated crisp shuttle detonation sound.',
      'Solid chest opening with non-racket arm tracking the shuttle cock.',
    ],
    badPoints: [
      'Contact was 10cm lower than maximum arm reach, sacrificing 2° of downward steepness.',
      'Racket follow-through wrapped horizontally around waist instead of downward past opposite hip.',
    ],
    coachTips: [
      'Reach up with a high elbow to take the shuttle at the highest comfortable peak.',
      'Direct follow-through across to your opposite knee to ensure downward trajectory.',
    ],
  },

  overhead_clear: {
    shotKey: 'overhead_clear',
    shotName: 'Attacking Overhead Clear',
    shotCategory: 'Clear',
    score: 86,
    tagline: 'High trajectory clearing into the rear baseline corners',
    metrics: {
      speedKmh: 248,
      contactHeightM: 2.82,
      impactAngleDeg: 8.8,
      kineticChainEfficiency: 87,
    },
    goodPoints: [
      'Full upward arm extension utilizing maximum lever length of the racket.',
      'High contact point directly over the dominant shoulder.',
      'Shuttle consistently landed within 20cm of the back boundary line.',
    ],
    badPoints: [
      'Player leaned backwards on impact, causing slight loss of forward balance.',
      'Grip stayed in hammer grip rather than relaxed V-shape, dampening power efficiency.',
    ],
    coachTips: [
      'Keep core engaged and transfer weight forward onto your non-dominant foot.',
      'Ensure a relaxed grip until the contact instant to generate effortless baseline depth.',
    ],
  },

  slice_drop: {
    shotKey: 'slice_drop',
    shotName: 'Cross-Court Slice Drop',
    shotCategory: 'Drop',
    score: 93,
    tagline: 'Razor-thin net margin with misleading body angle',
    metrics: {
      speedKmh: 118,
      contactHeightM: 2.74,
      impactAngleDeg: 27.5,
      kineticChainEfficiency: 92,
    },
    goodPoints: [
      'Superb racket angle slice cutting across the cork at 45° angle.',
      'Body shape perfectly feigned a straight down-the-line smash.',
      'Shuttle fell rapidly inside the service box line with sharp descent.',
    ],
    badPoints: [
      'Racket face turned inwards slightly too early, allowing keen eyes to read the cross.',
      'Recovery step forward into the net kill zone was hesitant by 0.2s.',
    ],
    coachTips: [
      'Practice reverse-slice drops alongside standard slice to keep opponents from guessing.',
      'Shadow drill: immediately pounce forward toward the net tape upon hitting the drop.',
    ],
  },

  flat_drive: {
    shotKey: 'flat_drive',
    shotName: 'Fast Flat Drive',
    shotCategory: 'Drive',
    score: 84,
    tagline: 'Laser-fast midcourt drive countering doubles pressure',
    metrics: {
      speedKmh: 205,
      contactHeightM: 1.68,
      impactAngleDeg: 3.4,
      kineticChainEfficiency: 85,
    },
    goodPoints: [
      'Short compact backswing enabling ultra-fast recovery in rapid exchanges.',
      'Sharp finger power squeeze at contact providing brisk acceleration.',
      'Low, balanced athletic ready posture.',
    ],
    badPoints: [
      'Shuttle clearance was occasionally 30cm high, inviting an opponent counter-interception.',
      'Racket head dipped below wrist level between consecutive shots.',
    ],
    coachTips: [
      'Keep the racket head permanently above wrist level in the mid-court drive zone.',
      'Drive the shuttle downward towards the opponent’s hip or racket shoulder.',
    ],
  },

  net_kill: {
    shotKey: 'net_kill',
    shotName: 'Explosive Net Kill / Tap',
    shotCategory: 'Net Shot',
    score: 94,
    tagline: 'Lightning-quick tap on high net tumbling shuttlecock',
    metrics: {
      speedKmh: 178,
      contactHeightM: 1.58,
      impactAngleDeg: 42.1,
      kineticChainEfficiency: 95,
    },
    goodPoints: [
      'Zero backswing tap preventing net touch faults while keeping speed immense.',
      'Anticipated the tumbling shuttle above the tape at earliest possible split-second.',
      'Crisp wrist and finger twitch flicked the shuttle straight down to the floor.',
    ],
    badPoints: [
      'Follow-through brush almost brushed the net cord—margin was less than 2cm.',
      'Body momentum rushed forward too aggressively risking loss of balance.',
    ],
    coachTips: [
      'Use a windshield wiper motion across the net to prevent racket frame from touching the cord.',
      'Brake with your lead lunging foot to keep head upright and balanced.',
    ],
  },
};

export async function analyzeBadmintonVideo(
  video: VideoInfo,
  onProgress?: (progress: number, stageIndex: number) => void
): Promise<ShotAnalysis> {
  const totalDuration = ANALYSIS_STAGES.reduce((sum, stage) => sum + stage.durationMs, 0);
  let elapsed = 0;

  for (let i = 0; i < ANALYSIS_STAGES.length; i++) {
    const stage = ANALYSIS_STAGES[i];
    const stepInterval = 100;
    const steps = Math.floor(stage.durationMs / stepInterval);

    for (let step = 0; step < steps; step++) {
      await new Promise((resolve) => setTimeout(resolve, stepInterval));
      elapsed += stepInterval;
      const progressPercent = Math.min(Math.round((elapsed / totalDuration) * 100), 99);
      if (onProgress) {
        onProgress(progressPercent, i);
      }
    }
  }

  // Complete progress to 100%
  if (onProgress) {
    onProgress(100, ANALYSIS_STAGES.length - 1);
  }

  // Match shot preset or detect
  let selectedKey: ShotKey = 'jump_smash';

  if (video.samplePreset && DETAILED_SHOT_DATABASE[video.samplePreset]) {
    selectedKey = video.samplePreset;
  } else if (video.name) {
    const lower = video.name.toLowerCase();
    if (lower.includes('backhand smash') || lower.includes('backhand-smash')) selectedKey = 'backhand_smash';
    else if (lower.includes('backhand clear') || lower.includes('backhand-clear')) selectedKey = 'backhand_clear';
    else if (lower.includes('backhand drop') || lower.includes('backhand-drop')) selectedKey = 'backhand_drop';
    else if (lower.includes('jump smash') || lower.includes('jump-smash')) selectedKey = 'jump_smash';
    else if (lower.includes('smash')) selectedKey = 'forehand_smash';
    else if (lower.includes('clear')) selectedKey = 'overhead_clear';
    else if (lower.includes('drop')) selectedKey = 'slice_drop';
    else if (lower.includes('drive')) selectedKey = 'flat_drive';
    else if (lower.includes('net') || lower.includes('kill')) selectedKey = 'net_kill';
    else selectedKey = 'jump_smash';
  } else {
    // Variety selection if video recorded fresh
    const keys: ShotKey[] = ['jump_smash', 'backhand_smash', 'backhand_clear', 'backhand_drop', 'forehand_smash', 'slice_drop'];
    selectedKey = keys[Math.floor(Math.random() * keys.length)];
  }

  const base = DETAILED_SHOT_DATABASE[selectedKey];

  return {
    id: `smash-${Date.now()}`,
    shotKey: base.shotKey,
    shotName: base.shotName,
    shotCategory: base.shotCategory,
    score: base.score,
    tagline: base.tagline,
    metrics: { ...base.metrics },
    goodPoints: [...base.goodPoints],
    badPoints: [...base.badPoints],
    coachTips: [...base.coachTips],
    analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    video,
  };
}
