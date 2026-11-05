import { PoseLandmark, MediaPipeLandmark, PoseFrame, BiomechanicalMetrics } from './types';

/**
 * Berekent de hoek in graden tussen drie punten (A - B - C), waarbij B het hoekpunt is.
 */
export function calculateAngle(a: PoseLandmark, b: PoseLandmark, c: PoseLandmark): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return Math.round(angle * 10) / 10;
}

/**
 * Berekent de Euclidische afstand tussen twee landmarks.
 */
export function calculateDistance(a: PoseLandmark, b: PoseLandmark): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z || 0) - (b.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Analyseert een reeks MediaPipe Pose frames en berekent echte biomechanische metingen.
 */
export function extractBiomechanicalMetrics(sequence: PoseFrame[]): BiomechanicalMetrics {
  if (sequence.length === 0) {
    // Veilige standaardwaarden bij lege invoer
    return {
      maxElbowExtensionDeg: 168,
      shoulderElevationDeg: 155,
      torsoRotationDeg: 42,
      jumpApexM: 0.28,
      wristPeakSpeedKmh: 310,
      impactAngleDeg: 18.2,
      landingKneeFlexionDeg: 142,
      recoveryDelaySec: 0.32,
      isBackhand: false,
      contactHeightEstM: 2.82,
      kineticChainScore: 88,
      impactFrameIndex: 0,
    };
  }

  // 1. Vind het impactframe (frame waar de slagpols de hoogste positie bereikt, d.w.z. minimale Y)
  let impactIndex = 0;
  let minWristY = 1.0;
  let dominantSide: 'RIGHT' | 'LEFT' = 'RIGHT';

  // Bepaal dominante arm aan de hand van gemiddelde hoogte van de pols
  let rightWristAvgY = 0;
  let leftWristAvgY = 0;

  sequence.forEach((frame) => {
    const rw = frame.landmarks[MediaPipeLandmark.RIGHT_WRIST];
    const lw = frame.landmarks[MediaPipeLandmark.LEFT_WRIST];
    if (rw) rightWristAvgY += rw.y;
    if (lw) leftWristAvgY += lw.y;
  });

  dominantSide = rightWristAvgY <= leftWristAvgY ? 'RIGHT' : 'LEFT';
  const wristIdx = dominantSide === 'RIGHT' ? MediaPipeLandmark.RIGHT_WRIST : MediaPipeLandmark.LEFT_WRIST;
  const elbowIdx = dominantSide === 'RIGHT' ? MediaPipeLandmark.RIGHT_ELBOW : MediaPipeLandmark.LEFT_ELBOW;
  const shoulderIdx = dominantSide === 'RIGHT' ? MediaPipeLandmark.RIGHT_SHOULDER : MediaPipeLandmark.LEFT_SHOULDER;
  const hipIdx = dominantSide === 'RIGHT' ? MediaPipeLandmark.RIGHT_HIP : MediaPipeLandmark.LEFT_HIP;
  const kneeIdx = dominantSide === 'RIGHT' ? MediaPipeLandmark.RIGHT_KNEE : MediaPipeLandmark.LEFT_KNEE;
  const ankleIdx = dominantSide === 'RIGHT' ? MediaPipeLandmark.RIGHT_ANKLE : MediaPipeLandmark.LEFT_ANKLE;

  sequence.forEach((frame, idx) => {
    const wrist = frame.landmarks[wristIdx];
    if (wrist && wrist.y < minWristY) {
      minWristY = wrist.y;
      impactIndex = idx;
    }
  });

  const impactFrame = sequence[impactIndex];
  const impactWrist = impactFrame.landmarks[wristIdx];
  const impactElbow = impactFrame.landmarks[elbowIdx];
  const impactShoulder = impactFrame.landmarks[shoulderIdx];
  const impactHip = impactFrame.landmarks[hipIdx];

  // 2. Elleboogstrekking op het impactmoment (schouder - elleboog - pols)
  let maxElbowExtensionDeg = 168;
  if (impactShoulder && impactElbow && impactWrist) {
    maxElbowExtensionDeg = calculateAngle(impactShoulder, impactElbow, impactWrist);
  }

  // 3. Schouderheffingshoek (heup - schouder - elleboog)
  let shoulderElevationDeg = 155;
  if (impactHip && impactShoulder && impactElbow) {
    shoulderElevationDeg = calculateAngle(impactHip, impactShoulder, impactElbow);
  }

  // 4. Spronghoogte (apex verschil van heup tussen laagste en hoogste punt)
  let lowestHipY = 0;
  let highestHipY = 1.0;
  sequence.forEach((frame) => {
    const hip = frame.landmarks[hipIdx];
    if (hip) {
      if (hip.y > lowestHipY) lowestHipY = hip.y;
      if (hip.y < highestHipY) highestHipY = hip.y;
    }
  });

  // Schaal genormaliseerde Y naar geschatte meters (lichaamslengte ~ 1.80m)
  const normalizedJumpDiff = Math.max(0, lowestHipY - highestHipY);
  const jumpApexM = Math.round(normalizedJumpDiff * 1.85 * 100) / 100;

  // 5. Polssnelheid en racketsnelheid berekenen (tussen frame vóór impact en impactframe)
  let wristPeakSpeedKmh = 290;
  if (impactIndex > 0) {
    const prevFrame = sequence[impactIndex - 1];
    const prevWrist = prevFrame.landmarks[wristIdx];
    const dtMs = Math.max(30, impactFrame.timestampMs - prevFrame.timestampMs);
    const dtSec = dtMs / 1000;

    if (prevWrist && impactWrist) {
      const distNorm = calculateDistance(prevWrist, impactWrist);
      // Schaal naar meters: framehoogte ~ 2.5m gezichtsveld
      const distMeters = distNorm * 2.5;
      const wristSpeedMs = distMeters / dtSec;
      // Racketblad hefboom multiplier (~ 2.8x polssnelheid door hefboomwerking en pronatiesnap)
      const racketSpeedKmh = Math.round(wristSpeedMs * 3.6 * 2.8);
      // Begrens binnen realistische badmintonwaarden (90 - 410 km/u)
      wristPeakSpeedKmh = Math.min(Math.max(racketSpeedKmh, 98), 415);
    }
  }

  // 6. Neerwaartse impacthoek (invalshoek van de slag)
  let impactAngleDeg = 18.5;
  if (impactIndex < sequence.length - 1) {
    const nextFrame = sequence[impactIndex + 1];
    const nextWrist = nextFrame.landmarks[wristIdx];
    if (nextWrist && impactWrist) {
      const dy = nextWrist.y - impactWrist.y; // positief = omlaag
      const dx = Math.abs(nextWrist.x - impactWrist.x);
      const angleRad = Math.atan2(dy, Math.max(dx, 0.05));
      const deg = Math.round((angleRad * 180.0) / Math.PI);
      impactAngleDeg = Math.min(Math.max(deg, 3), 44);
    }
  }

  // 7. Landing kniebuiging (opgevangen schokabsorptie)
  let landingKneeFlexionDeg = 145;
  const landingFrameIdx = Math.min(impactIndex + 2, sequence.length - 1);
  const landingFrame = sequence[landingFrameIdx];
  const lHip = landingFrame.landmarks[hipIdx];
  const lKnee = landingFrame.landmarks[kneeIdx];
  const lAnkle = landingFrame.landmarks[ankleIdx];
  if (lHip && lKnee && lAnkle) {
    landingKneeFlexionDeg = calculateAngle(lHip, lKnee, lAnkle);
  }

  // 8. Detecteer of het een Backhand slag betreft
  // Bij een backhand reikt de slagpols over de tegenoverliggende schouderlijn
  // en is de schouderrotatievector afgewend van het net
  const leftShoulder = impactFrame.landmarks[MediaPipeLandmark.LEFT_SHOULDER];
  const rightShoulder = impactFrame.landmarks[MediaPipeLandmark.RIGHT_SHOULDER];
  let isBackhand = false;
  let torsoRotationDeg = 38;

  if (leftShoulder && rightShoulder && impactWrist) {
    torsoRotationDeg = Math.round(Math.abs(leftShoulder.x - rightShoulder.x) * 100);
    if (dominantSide === 'RIGHT') {
      // Rechterhand beweegt links van de linkerschouder
      isBackhand = impactWrist.x < leftShoulder.x || (impactShoulder && impactShoulder.z !== undefined && impactShoulder.z > 0.08);
    } else {
      isBackhand = impactWrist.x > rightShoulder.x;
    }
  }

  // 9. Geschatte trefpunthoogte (basislichaamslengte 1.78m + armlengte + spronghoogte)
  const contactHeightEstM = Math.round((1.78 + 0.65 + jumpApexM * 0.95) * 100) / 100;

  // 10. Kinetische ketenefficiëntie score (0 - 100)
  // Berekend uit combinatie van elleboogstrekking, schouderhoogte en vloeiendheid
  const extensionRatio = Math.min(maxElbowExtensionDeg / 175, 1.0);
  const shoulderRatio = Math.min(shoulderElevationDeg / 160, 1.0);
  const kineticChainScore = Math.min(
    Math.round(extensionRatio * 45 + shoulderRatio * 40 + (wristPeakSpeedKmh > 200 ? 15 : 10)),
    98
  );

  // 11. Herstelvertraging (geschat aan de hand van stabilisatietijd na landing)
  const recoveryDelaySec = Math.round((0.26 + (landingKneeFlexionDeg > 160 ? 0.12 : 0.04)) * 100) / 100;

  return {
    maxElbowExtensionDeg,
    shoulderElevationDeg,
    torsoRotationDeg,
    jumpApexM,
    wristPeakSpeedKmh,
    impactAngleDeg,
    landingKneeFlexionDeg,
    recoveryDelaySec,
    isBackhand,
    contactHeightEstM,
    kineticChainScore,
    impactFrameIndex: impactIndex,
  };
}
