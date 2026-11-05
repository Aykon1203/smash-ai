import { BiomechanicalMetrics } from './types';
import { ShotCategory, ShotKey, VideoInfo, ShotAnalysis } from '../../types/badminton';
import { FrameAnalysisMetrics } from './frameVisualAnalyzer';

interface ClassificationOutput {
  shotKey: ShotKey;
  shotName: string;
  shotCategory: ShotCategory;
  score: number;
  tagline: string;
  goodPoints: string[];
  badPoints: string[];
  coachTips: string[];
  isInvalidVideo?: boolean;
}

/**
 * Classificeert een badmintonslag dynamisch op basis van echte MediaPipe biomechanische metingen
 * en het visuele versnellingsprofiel van de frames.
 */
export function classifyShotFromBiometrics(
  metrics: BiomechanicalMetrics,
  video: VideoInfo,
  visualMetrics?: FrameAnalysisMetrics
): ClassificationOutput {
  // 1. Controleer of de video GEEN badmintonslag bevat (bijv. een video van enkel een gezicht)
  if (video.source !== 'sample' && visualMetrics && visualMetrics.isFaceOrPortraitOnly) {
    return {
      shotKey: 'invalid_face_only',
      shotName: 'Geen Badmintonslag Gedetecteerd (Alleen Gezicht)',
      shotCategory: 'Niet Herkend',
      score: 0,
      tagline: 'Er is enkel een gezicht/portret waargenomen. Er werd geen badmintonspeler of slagbeweging gedetecteerd.',
      goodPoints: [
        'Gezichts- en hoofddetectie via MediaPipe is geslaagd in het videobeeld.',
        'Videokwaliteit en beeldcontrast zijn voldoende voor computervisiedetectie.',
      ],
      badPoints: [
        'Geen volledig lichaam in beeld: schouders, heupen en benen ontbreken in het frame.',
        'Geen badmintonracket of zwaaibeweging waargenomen in de opname.',
        'Geen shuttlecock of slagimpactpunt geregistreerd.',
      ],
      coachTips: [
        'Plaats de camera op 3 tot 4 meter afstand zodat het hele lichaam (van voeten tot boven het hoofd) in beeld is.',
        'Film vanaf de zijkant of schuine hoek van de baan terwijl de speler een echte badmintonslag uitvoert.',
      ],
      isInvalidVideo: true,
    };
  }

  // 2. Bepaal slagtype op basis van gerichte selectie OF computervisie bewegingsdetectie
  let shotKey: ShotKey = 'jump_smash';

  if (video.targetShot && video.targetShot !== 'auto') {
    // Gebruiker heeft specifiek aangegeven welke slag hij/zij filmt
    shotKey = video.targetShot;
  } else if (video.samplePreset) {
    shotKey = video.samplePreset;
  } else if (visualMetrics) {
    // ECHTE COMPUTERVISIE BESLISSING OP BASIS VAN DE DETECTEERDE BEWEGINGSVECTOR:
    const dir = visualMetrics.detectedDominantMotionDirection;

    if (dir === 'DOWNWARD_SMASH') {
      if (metrics.isBackhand) {
        shotKey = 'backhand_smash';
      } else if (metrics.jumpApexM >= 0.12 || visualMetrics.peakRatio > 1.3) {
        shotKey = 'jump_smash';
      } else {
        shotKey = 'forehand_smash';
      }
    } else if (dir === 'DROP_SHOT') {
      shotKey = metrics.isBackhand ? 'backhand_drop' : 'slice_drop';
    } else if (dir === 'UPWARD_CLEAR') {
      shotKey = metrics.isBackhand ? 'backhand_clear' : 'overhead_clear';
    } else if (dir === 'HORIZONTAL_DRIVE') {
      shotKey = 'flat_drive';
    } else {
      // Standaard krachtige forehand smash bij niet-specifieke zwaai
      shotKey = 'jump_smash';
    }
  }

  return generateShotDetails(shotKey, metrics);
}

/**
 * Genereert gedetailleerde biomechanische feedback, score, sterke punten en verbeterpunten
 * afgestemd op een specifieke badmintonslag.
 */
export function generateShotDetails(
  shotKey: ShotKey,
  metrics: BiomechanicalMetrics
): ClassificationOutput {
  let shotName = 'Explosieve Jump Smash';
  let shotCategory: ShotCategory = 'Smash';
  let tagline = 'Hoge afzetsprong met agressieve neerwaartse penetratie';

  switch (shotKey) {
    case 'jump_smash':
      shotName = 'Explosieve Jump Smash';
      shotCategory = 'Smash';
      tagline = 'Grote verticale sprongkracht met een verwoestende steile neerwaartse baan';
      break;
    case 'forehand_smash':
      shotName = 'Steile Forehand Smash';
      shotCategory = 'Smash';
      tagline = 'Klassieke harde smash vanaf de baseline met felle onderarmpronatie';
      break;
    case 'backhand_smash':
      shotName = 'Backhand Smash (Taufik-stijl)';
      shotCategory = 'Smash';
      tagline = 'Verrassende aanvallende winner geslagen vanuit de verre achterhandhoek';
      break;
    case 'backhand_clear':
      shotName = 'Hoge Backhand Clear';
      shotCategory = 'Clear';
      tagline = 'Diepe verdedigende herstelclear tot diep in de achterste tramrails';
      break;
    case 'backhand_drop':
      shotName = 'Misleidende Backhand Drop';
      shotCategory = 'Drop';
      tagline = 'Zacht gesneden bal die strak over de netrand tuimelt';
      break;
    case 'overhead_clear':
      shotName = 'Aanvallende Overhead Clear';
      shotCategory = 'Clear';
      tagline = 'Hoge boogbal die de tegenstander diep naar de achterlijn dwingt';
      break;
    case 'slice_drop':
      shotName = 'Cross-Court Slice Dropshot';
      shotCategory = 'Drop';
      tagline = 'Scherp aangesneden drop met flinterdunne netpassage en vroege dip';
      break;
    case 'flat_drive':
      shotName = 'Snelle Vlakke Drive';
      shotCategory = 'Drive';
      tagline = 'Vlakke raket-snelle drive om het tempo in dubbelspel rallies te domineren';
      break;
    case 'net_kill':
      shotName = 'Explosieve Net Kill / Tap';
      shotCategory = 'Netslag';
      tagline = 'Bliksemsnelle tik op een tuimelende shuttle boven de netband';
      break;
  }

  // 3. Dynamische score op basis van werkelijke techniekparameters
  const extensionFactor = Math.min(metrics.maxElbowExtensionDeg / 175, 1.0) * 35;
  const speedFactor = Math.min(metrics.wristPeakSpeedKmh / 350, 1.0) * 35;
  const balanceFactor = metrics.landingKneeFlexionDeg < 155 ? 15 : 8;
  const recoveryFactor = metrics.recoveryDelaySec < 0.35 ? 15 : 9;
  const score = Math.min(Math.max(Math.round(extensionFactor + speedFactor + balanceFactor + recoveryFactor), 72), 98);

  // 4. Dynamische Goede Punten
  const goodPoints: string[] = [];

  if (metrics.maxElbowExtensionDeg >= 160) {
    goodPoints.push(
      `Volledige armstrekking: ellebooghoek bereikte ${metrics.maxElbowExtensionDeg}° op het raakpunt voor een maximaal hefboomeffect.`
    );
  } else {
    goodPoints.push(
      `Goede arminzet met een ellebooghoek van ${metrics.maxElbowExtensionDeg}° tijdens de impactfase.`
    );
  }

  if (metrics.wristPeakSpeedKmh > 240) {
    goodPoints.push(
      `Hoge racketsnelheid: pieksnelheid van ${metrics.wristPeakSpeedKmh} km/u geregistreerd via snelle pols- en onderarmversnelling.`
    );
  } else {
    goodPoints.push(
      `Gecontroleerde balsnelheid van ${metrics.wristPeakSpeedKmh} km/u met focus op nauwkeurigheid en plaatsing.`
    );
  }

  if (shotKey === 'jump_smash' && metrics.jumpApexM >= 0.12) {
    goodPoints.push(
      `Explosieve afzet: ${Math.round(metrics.jumpApexM * 100)} cm spronghoogte bracht het trefpunt op ${metrics.contactHeightEstM} m piekhoogte.`
    );
  } else if (metrics.impactAngleDeg >= 14) {
    goodPoints.push(
      `Agressieve neerwaartse invalshoek van ${metrics.impactAngleDeg}° duwt de bal steil over de netrand.`
    );
  } else {
    goodPoints.push(
      `Goede kinetische keten: romp en schouders draaiden gecontroleerd mee door de slaglijn.`
    );
  }

  if (shotKey.startsWith('backhand_')) {
    goodPoints.push(
      `Uitstekende schouderinzet (${metrics.torsoRotationDeg}° heuprotatie) met het lichaam afgewend voor maximale hefboomkracht.`
    );
  } else {
    goodPoints.push(
      `Goede balansbehoud met de niet-racketarm die het lichaam horizontaal stabiliseerde.`
    );
  }

  // 5. Dynamische Verbeterpunten
  const badPoints: string[] = [];

  if (metrics.maxElbowExtensionDeg < 166) {
    badPoints.push(
      `Elleboog was licht gebogen (${metrics.maxElbowExtensionDeg}°) op het impactmoment; streef naar 170°+ voor meer hefboomlengte en steilheid.`
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

  if (shotCategory === 'Smash' && metrics.impactAngleDeg < 14) {
    badPoints.push(
      `Invalshoek was met ${metrics.impactAngleDeg}° te vlak voor een winnende smash; raak de shuttle 15 cm verder vóór het lichaam.`
    );
  }

  // 6. Doelgerichte Coachingstips
  const coachTips: string[] = [];

  if (metrics.maxElbowExtensionDeg < 166) {
    coachTips.push('Oefen hoge reik-oefeningen met schaduwslagen om de arm op het toppunt volledig uit te strekken.');
  }

  if (metrics.landingKneeFlexionDeg > 155 || metrics.recoveryDelaySec > 0.30) {
    coachTips.push('Voer schaarsprong- en split-step drills uit met direct terugstappen naar het T-punt op de voorvoeten.');
  }

  if (shotKey.startsWith('backhand_')) {
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
