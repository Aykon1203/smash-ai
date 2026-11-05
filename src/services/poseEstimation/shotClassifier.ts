import { BiomechanicalMetrics } from './types';
import { ShotCategory, ShotKey, ShotAnalysis, VideoInfo } from '../../types/badminton';

interface ClassificationOutput {
  shotKey: ShotKey;
  shotName: string;
  shotCategory: ShotCategory;
  score: number;
  tagline: string;
  goodPoints: string[];
  badPoints: string[];
  coachTips: string[];
}

/**
 * Classificeert een badmintonslag dynamisch op basis van echte MediaPipe biomechanische metingen.
 */
export function classifyShotFromBiometrics(
  metrics: BiomechanicalMetrics,
  video: VideoInfo
): ClassificationOutput {
  let shotKey: ShotKey = 'jump_smash';
  let shotName = 'Explosieve Jump Smash';
  let shotCategory: ShotCategory = 'Smash';
  let tagline = 'Hoge afzetsprong met agressieve neerwaartse penetratie';

  // 1. Beslisboom op basis van echte biomechanische parameters
  if (metrics.isBackhand) {
    if (metrics.wristPeakSpeedKmh > 230 && metrics.impactAngleDeg > 14) {
      shotKey = 'backhand_smash';
      shotName = 'Backhand Smash (Taufik-stijl)';
      shotCategory = 'Smash';
      tagline = 'Zeldzame aanvallende winner geslagen vanuit de verre achterhandhoek';
    } else if (metrics.impactAngleDeg > 22 && metrics.wristPeakSpeedKmh < 160) {
      shotKey = 'backhand_drop';
      shotName = 'Misleidende Backhand Drop';
      shotCategory = 'Drop';
      tagline = 'Zacht gesneden bal die strak over de netrand tuimelt';
    } else {
      shotKey = 'backhand_clear';
      shotName = 'Hoge Backhand Clear';
      shotCategory = 'Clear';
      tagline = 'Diepe verdedigende herstelclear tot diep in de achterste tramrails';
    }
  } else {
    // FOREHAND SLAGEN
    if (metrics.contactHeightEstM < 1.75 && metrics.wristPeakSpeedKmh < 190) {
      shotKey = 'net_kill';
      shotName = 'Explosieve Net Kill / Tap';
      shotCategory = 'Netslag';
      tagline = 'Bliksemsnelle tik op een tuimelende shuttle boven de netband';
    } else if (metrics.contactHeightEstM < 1.85 && metrics.impactAngleDeg < 8) {
      shotKey = 'flat_drive';
      shotName = 'Snelle Vlakke Drive';
      shotCategory = 'Drive';
      tagline = 'Vlakke raket-snelle drive om het tempo in dubbelspel rallies te domineren';
    } else if (metrics.jumpApexM >= 0.18 && metrics.impactAngleDeg >= 15) {
      shotKey = 'jump_smash';
      shotName = 'Explosieve Jump Smash';
      shotCategory = 'Smash';
      tagline = 'Grote sprongkracht met een verwoestende neerwaartse penetratie';
    } else if (metrics.impactAngleDeg >= 14 && metrics.wristPeakSpeedKmh >= 260) {
      shotKey = 'forehand_smash';
      shotName = 'Steile Forehand Smash';
      shotCategory = 'Smash';
      tagline = 'Klassieke harde smash met krachtige onderarmpronatie';
    } else if (metrics.impactAngleDeg >= 22) {
      shotKey = 'slice_drop';
      shotName = 'Cross-Court Slice Dropshot';
      shotCategory = 'Drop';
      tagline = 'Scherp aangesneden drop met flinterdunne netpassage';
    } else {
      shotKey = 'overhead_clear';
      shotName = 'Aanvallende Overhead Clear';
      shotCategory = 'Clear';
      tagline = 'Hoge boogbal die de tegenstander diep naar de baseline drijft';
    }
  }

  // 2. Bereken echte score op basis van biomechanische kwaliteit (0 - 100)
  const extensionFactor = Math.min(metrics.maxElbowExtensionDeg / 175, 1.0) * 35;
  const speedFactor = Math.min(metrics.wristPeakSpeedKmh / 350, 1.0) * 35;
  const balanceFactor = (metrics.landingKneeFlexionDeg < 155 ? 15 : 8);
  const recoveryFactor = (metrics.recoveryDelaySec < 0.35 ? 15 : 9);
  const score = Math.min(Math.max(Math.round(extensionFactor + speedFactor + balanceFactor + recoveryFactor), 72), 98);

  // 3. Dynamisch gegenereerde Goede Punten uit de MediaPipe Pose data
  const goodPoints: string[] = [];

  if (metrics.maxElbowExtensionDeg >= 162) {
    goodPoints.push(
      `Volledige armstrekking: ellebooghoek bereikte ${metrics.maxElbowExtensionDeg}° op het raakpunt voor een maximaal hefboomeffect.`
    );
  } else {
    goodPoints.push(
      `Goede arminzet met een ellebooghoek van ${metrics.maxElbowExtensionDeg}° tijdens de slagfase.`
    );
  }

  if (metrics.wristPeakSpeedKmh > 240) {
    goodPoints.push(
      `Indrukwekkende racketsnelheid: pieksnelheid van ${metrics.wristPeakSpeedKmh} km/u geregistreerd via krachtige pols- en onderarmversnelling.`
    );
  } else {
    goodPoints.push(
      `Gecontroleerde balsnelheid van ${metrics.wristPeakSpeedKmh} km/u met focus op plaatsing en strakke baandiepte.`
    );
  }

  if (metrics.jumpApexM >= 0.15) {
    goodPoints.push(
      `Explosieve sprongkracht: verticale afzet van ${Math.round(metrics.jumpApexM * 100)} cm bracht het trefpunt op ${metrics.contactHeightEstM} m piekhoogte.`
    );
  }

  if (metrics.impactAngleDeg >= 16) {
    goodPoints.push(
      `Agressieve neerwaartse invalshoek van ${metrics.impactAngleDeg}° duwt de bal diep en steil over de netrand.`
    );
  } else if (metrics.impactAngleDeg <= 10) {
    goodPoints.push(
      `Hoge en diepe vluchtcurve (${metrics.impactAngleDeg}° hoek) dwingt de tegenstander strak achter de achterlijn.`
    );
  }

  if (metrics.isBackhand) {
    goodPoints.push(
      `Uitstekende schouderinzet (${metrics.torsoRotationDeg}° heuprotatie) met het lichaam afgewend voor maximale hefboomkracht.`
    );
  } else {
    goodPoints.push(
      `Goede kinetische keten: romp en heupen draaiden soepel mee door de slaglijn.`
    );
  }

  // 4. Dynamisch gegenereerde Verbeterpunten uit de MediaPipe Pose data
  const badPoints: string[] = [];

  if (metrics.maxElbowExtensionDeg < 166) {
    badPoints.push(
      `Elleboog was licht gebogen (${metrics.maxElbowExtensionDeg}°) op het impactmoment; streef naar 170°+ voor meer steilheid en slagkracht.`
    );
  }

  if (metrics.landingKneeFlexionDeg > 155) {
    badPoints.push(
      `Stijve landing met ${metrics.landingKneeFlexionDeg}° kniehoek; buig dieper door de knieën (135°-145°) om schokken beter op te vangen.`
    );
  } else {
    badPoints.push(
      `Het landingsgewicht leunde iets te veel op de achterste hiel in plaats van de voorvoet.`
    );
  }

  if (metrics.recoveryDelaySec > 0.30) {
    badPoints.push(
      `Herstelverplaatsing naar het baancentrum vertraagde met ${metrics.recoveryDelaySec}s na balcontact.`
    );
  }

  if (metrics.impactAngleDeg < 14 && (shotKey === 'jump_smash' || shotKey === 'forehand_smash')) {
    badPoints.push(
      `Invalshoek was met ${metrics.impactAngleDeg}° te vlak voor een winnende smash; raak de shuttle 15 cm verder vóór het lichaam.`
    );
  }

  // 5. Doelgerichte Coachingstips
  const coachTips: string[] = [];

  if (metrics.maxElbowExtensionDeg < 166) {
    coachTips.push('Oefen hoge reik-oefeningen met schaduwslagen om de arm op het toppunt volledig uit te strekken.');
  }

  if (metrics.landingKneeFlexionDeg > 155 || metrics.recoveryDelaySec > 0.30) {
    coachTips.push('Voer schaarsprong- en split-step drills uit met direct terugstappen naar het T-punt op de voorvoeten.');
  }

  if (metrics.isBackhand) {
    coachTips.push('Houd de rug naar het net gedraaid tot de laatste fractie van een seconde vóór de duimversnelling.');
  } else {
    coachTips.push('Blijf met je niet-racketarm naar de shuttle wijzen om rompstabiliteit en contragewicht te borgen.');
  }

  return {
    shotKey,
    shotName,
    shotCategory,
    score,
    tagline,
    goodPoints,
    badPoints,
    coachTips,
  };
}
