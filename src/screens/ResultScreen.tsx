import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing } from '../constants/theme';
import { ShotAnalysis } from '../types/badminton';
import { MetricCard } from '../components/MetricCard';
import { FeedbackCard } from '../components/FeedbackCard';
import { exportFeedback } from '../services/exportService';

interface ResultScreenProps {
  analysis: ShotAnalysis;
  onRecordNewVideo: () => void;
  onNavigateHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  analysis,
  onRecordNewVideo,
  onNavigateHome,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const isInvalid = analysis.isInvalidVideo || analysis.shotCategory === 'Niet Herkend';

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportFeedback(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Waarschuwingsbanner bij ongeldige opname (bijv. enkel een gezicht) */}
      {isInvalid && (
        <View style={styles.warningBanner}>
          <Ionicons name="alert-circle" size={20} color={Colors.warning} />
          <View style={styles.warningBannerText}>
            <Text style={styles.warningTitle}>Geen Badmintonslag Herkend</Text>
            <Text style={styles.warningSub}>
              De AI heeft geen zwaai of volledig lichaam gedetecteerd. Bekijk onderstaande instructies voor een juiste opname.
            </Text>
          </View>
        </View>
      )}

      {/* Bovensectie: Slag Header Kaart */}
      <View style={[styles.shotHeaderCard, isInvalid && styles.cardInvalid]}>
        <View style={styles.cardGlow} />

        <View style={styles.categoryRow}>
          <View style={[styles.categoryBadge, isInvalid && styles.badgeInvalid]}>
            <MaterialCommunityIcons
              name={isInvalid ? 'alert-circle' : 'badminton'}
              size={14}
              color={isInvalid ? Colors.warning : Colors.primary}
            />
            <Text style={[styles.categoryBadgeText, isInvalid && { color: Colors.warning }]}>
              {analysis.shotCategory}
            </Text>
          </View>

          <View style={styles.scorePill}>
            <Ionicons
              name={isInvalid ? 'help-circle' : 'trophy'}
              size={13}
              color={isInvalid ? Colors.textMuted : Colors.accentVolt}
            />
            <Text style={[styles.scoreText, isInvalid && { color: Colors.textMuted }]}>
              {isInvalid ? 'Niet van toepassing' : `Techniek: ${analysis.score}/100`}
            </Text>
          </View>
        </View>

        {/* Slagnaam & Samenvatting */}
        <Text style={[styles.shotTitle, isInvalid && { color: Colors.warning }]}>
          {analysis.shotName}
        </Text>
        <Text style={styles.shotTagline}>{analysis.tagline}</Text>

        <View style={styles.shotMetaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.metaText}>{analysis.analyzedAt}</Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Ionicons name="videocam-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.metaText}>
              {analysis.video.name || 'Badmintonvideo'}
            </Text>
          </View>
        </View>
      </View>

      {/* Biomechanische Metrieken Rooster */}
      <View style={styles.metricsSection}>
        <Text style={styles.sectionHeaderTitle}>Biomechanische Analyse</Text>

        <View style={styles.metricsGrid}>
          <MetricCard
            iconName="speedometer"
            label="Geschatte Snelheid"
            value={isInvalid ? 0 : analysis.metrics.speedKmh}
            unit="km/u"
            badge={isInvalid ? 'Geen Slag' : analysis.metrics.speedKmh > 300 ? 'Elite' : 'Goed'}
            accentColor={isInvalid ? Colors.textMuted : Colors.accentVolt}
          />
          <MetricCard
            iconName="trending-up"
            label="Raakpunthoogte"
            value={isInvalid ? '-' : analysis.metrics.contactHeightM}
            unit={isInvalid ? '' : 'm'}
            badge={isInvalid ? 'Geen' : 'Piek'}
            accentColor={isInvalid ? Colors.textMuted : Colors.primary}
          />
        </View>

        <View style={[styles.metricsGrid, { marginTop: 10 }]}>
          <MetricCard
            iconName="navigate"
            label="Neerwaartse Hoek"
            value={isInvalid ? '-' : `${analysis.metrics.impactAngleDeg}°`}
            badge={isInvalid ? 'Geen' : 'Steil'}
            accentColor={isInvalid ? Colors.textMuted : Colors.accentOrange}
          />
          <MetricCard
            iconName="analytics"
            label="Kinetische Keten"
            value={isInvalid ? '0%' : `${analysis.metrics.kineticChainEfficiency}%`}
            badge={isInvalid ? 'Inactief' : 'Vloeiend'}
            accentColor={isInvalid ? Colors.textMuted : Colors.accentBlue}
          />
        </View>
      </View>

      {/* GOEDE PUNTEN CONTAINER */}
      <FeedbackCard
        type="good"
        title={isInvalid ? 'Visuele Detectieresultaten' : 'Goede punten (Sterke techniek)'}
        subtitle={
          isInvalid
            ? 'Elementen die succesvol door het computervisiemodel zijn herkend'
            : 'Belangrijke biomechanische aspecten die uitstekend werden uitgevoerd'
        }
        items={analysis.goodPoints}
      />

      {/* VERBETERPUNTEN CONTAINER */}
      <FeedbackCard
        type="bad"
        title={isInvalid ? 'Waarom Geen Slag Is Herkend' : 'Verbeterpunten (Aandachtspunten)'}
        subtitle={
          isInvalid
            ? 'Vereisten voor een succesvolle badminton-slaganalyse'
            : 'Cruciale technische aandachtspunten om direct aan te werken'
        }
        items={analysis.badPoints}
      />

      {/* Aanbevolen Trainer Oefeningen of Richtlijnen */}
      {analysis.coachTips && analysis.coachTips.length > 0 && (
        <View style={styles.coachCard}>
          <View style={styles.coachHeader}>
            <View style={styles.coachIconCircle}>
              <Ionicons name={isInvalid ? 'bulb' : 'school'} size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.coachTitle}>
                {isInvalid ? 'Richtlijnen Voor Een Goede Opname' : 'Aanbevolen Trainingsvormen'}
              </Text>
              <Text style={styles.coachSubtitle}>
                {isInvalid
                  ? 'Hoe je de camera moet opstellen voor een correcte AI-analyse'
                  : 'Gerichte oefeningen om de aandachtspunten te verhelpen'}
              </Text>
            </View>
          </View>

          <View style={styles.coachList}>
            {analysis.coachTips.map((tip, idx) => (
              <View key={idx} style={styles.coachItemRow}>
                <Ionicons name="arrow-forward-circle" size={16} color={Colors.primary} />
                <Text style={styles.coachItemText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* De Twee Hoofdknoppen */}
      <View style={styles.actionsContainer}>
        {/* Knop 1: Record new video / Nieuwe video opnemen */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.recordNewBtn]}
          onPress={onRecordNewVideo}
          activeOpacity={0.85}
          accessibilityLabel="Nieuwe video opnemen"
        >
          <View style={styles.btnIconBg}>
            <Ionicons name="videocam" size={20} color={Colors.white} />
          </View>
          <View style={styles.btnTextContainer}>
            <Text style={styles.recordNewBtnText}>Nieuwe video opnemen</Text>
            <Text style={styles.btnSubtext}>Open de camera voor een volgende slag</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.white} />
        </TouchableOpacity>

        {/* Knop 2: Export feedback / Feedback exporteren */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.exportBtn]}
          onPress={handleExport}
          disabled={isExporting}
          activeOpacity={0.85}
          accessibilityLabel="Feedback exporteren"
        >
          <View style={[styles.btnIconBg, styles.exportIconBg]}>
            <Ionicons name="share-social" size={20} color={Colors.primary} />
          </View>
          <View style={styles.btnTextContainer}>
            <Text style={styles.exportBtnText}>Feedback exporteren</Text>
            <Text style={styles.btnSubtext}>Deel rapport met trainer of medespeler</Text>
          </View>
          <Ionicons name="share-outline" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Terug naar Start Link */}
      <TouchableOpacity style={styles.homeLink} onPress={onNavigateHome}>
        <Ionicons name="home-outline" size={16} color={Colors.textMuted} />
        <Text style={styles.homeLinkText}>Terug naar start</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl + 20,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: 10,
  },
  warningBannerText: {
    flex: 1,
  },
  warningTitle: {
    color: Colors.warning,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  warningSub: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  shotHeaderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  cardInvalid: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  cardGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryGlow,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryGlow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 6,
  },
  badgeInvalid: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: Colors.warning,
  },
  categoryBadgeText: {
    color: Colors.primaryLight,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  scoreText: {
    color: Colors.accentVolt,
    fontSize: 11.5,
    fontWeight: '800',
  },
  shotTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  shotTagline: {
    color: Colors.textSecondary,
    fontSize: 13.5,
    lineHeight: 19,
    marginBottom: Spacing.md,
  },
  shotMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    color: Colors.textMuted,
    fontSize: 11.5,
    fontWeight: '500',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textMuted,
  },
  metricsSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeaderTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: Spacing.sm + 2,
    letterSpacing: 0.3,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  coachCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 16,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.md,
  },
  coachIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  coachSubtitle: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  coachList: {
    gap: 10,
  },
  coachItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  coachItemText: {
    flex: 1,
    color: Colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  actionsContainer: {
    gap: 12,
    marginVertical: Spacing.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderWidth: 1,
  },
  recordNewBtn: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primary,
  },
  exportBtn: {
    backgroundColor: Colors.surfaceCard,
    borderColor: Colors.border,
  },
  btnIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exportIconBg: {
    backgroundColor: Colors.primaryGlow,
  },
  btnTextContainer: {
    flex: 1,
  },
  recordNewBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  exportBtnText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  btnSubtext: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  homeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
  },
  homeLinkText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
});
