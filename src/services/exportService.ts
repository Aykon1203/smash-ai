import { Share, Alert } from 'react-native';
import { ShotAnalysis } from '../types/badminton';

/**
 * Genereert een duidelijk en gestructureerd tekstrapport geschikt voor trainers en spelers.
 */
export function formatAnalysisReport(analysis: ShotAnalysis): string {
  const goodList = analysis.goodPoints.map((pt, i) => `  ${i + 1}. [GOED] ${pt}`).join('\n');
  const badList = analysis.badPoints.map((pt, i) => `  ${i + 1}. [AANDACHTSPUNT] ${pt}`).join('\n');
  const coachTips = analysis.coachTips.map((tip) => `  • ${tip}`).join('\n');

  return `🏸 SMASHAI BADMINTON SLAGRAPPORT 🏸
----------------------------------------
Slagtype: ${analysis.shotName} (${analysis.shotCategory})
Techniekscore: ${analysis.score}/100
Tijdstip Analyse: ${analysis.analyzedAt}
Samenvatting: ${analysis.tagline}

BELANGRIJKSTE METRIEKEN:
- Geschatte Smashsnelheid: ${analysis.metrics.speedKmh} km/u
- Raakpunthoogte: ${analysis.metrics.contactHeightM} m
- Neerwaartse Impacthoek: ${analysis.metrics.impactAngleDeg}°
- Kinetische Ketenefficiëntie: ${analysis.metrics.kineticChainEfficiency}%

STERKE PUNTEN (GOEDE TECHNIEK):
${goodList}

VERBETERPUNTEN (AANDACHTSPUNTEN):
${badList}

AANBEVOLEN OEFENINGEN & COACHINGSTIPS:
${coachTips}
----------------------------------------
Gegenereerd door SmashAI - AI Badminton Techniek Coach`;
}

/**
 * Exporteert en deelt het badminton feedbackrapport via het systeemdeelmenu
 */
export async function exportFeedback(analysis: ShotAnalysis): Promise<boolean> {
  try {
    const report = formatAnalysisReport(analysis);
    const result = await Share.share(
      {
        title: `SmashAI Feedback - ${analysis.shotName}`,
        message: report,
      },
      {
        dialogTitle: `SmashAI Feedback Exporteren (${analysis.shotName})`,
        subject: `SmashAI Feedback - ${analysis.shotName}`,
      }
    );

    if (result.action === Share.sharedAction) {
      return true;
    }
    return false;
  } catch (error: any) {
    console.error('Fout bij exporteren van feedback:', error);
    Alert.alert('Feedback Exporteren', 'Kon het deelmenu niet openen. Probeer het opnieuw.');
    return false;
  }
}
