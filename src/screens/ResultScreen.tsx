import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
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
      {/* Top Shot Header Banner */}
      <View style={styles.shotHeaderCard}>
        <View style={styles.cardGlow} />

        <View style={styles.categoryRow}>
          <View style={styles.categoryBadge}>
            <MaterialCommunityIcons name="badminton" size={14} color={Colors.primary} />
            <Text style={styles.categoryBadgeText}>{analysis.shotCategory}</Text>
          </View>

          <View style={styles.scorePill}>
            <Ionicons name="trophy" size={13} color={Colors.accentVolt} />
            <Text style={styles.scoreText}>Technique: {analysis.score}/100</Text>
          </View>
        </View>

        {/* Shot Name (Prominently displayed) */}
        <Text style={styles.shotTitle}>{analysis.shotName}</Text>
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
              {analysis.video.name || 'Badminton Video'}
            </Text>
          </View>
        </View>
      </View>

      {/* Biomechanical Metric Tiles */}
      <View style={styles.metricsSection}>
        <Text style={styles.sectionHeaderTitle}>Biomechanical Analysis</Text>

        <View style={styles.metricsGrid}>
          <MetricCard
            iconName="speedometer"
            label="Estimated Speed"
            value={analysis.metrics.speedKmh}
            unit="km/h"
            badge={analysis.metrics.speedKmh > 300 ? 'Elite' : 'Solid'}
            accentColor={Colors.accentVolt}
          />
          <MetricCard
            iconName="trending-up"
            label="Contact Height"
            value={analysis.metrics.contactHeightM}
            unit="m"
            badge="Peak"
            accentColor={Colors.primary}
          />
        </View>

        <View style={[styles.metricsGrid, { marginTop: 10 }]}>
          <MetricCard
            iconName="navigate"
            label="Downward Angle"
            value={`${analysis.metrics.impactAngleDeg}°`}
            badge="Steep"
            accentColor={Colors.accentOrange}
          />
          <MetricCard
            iconName="analytics"
            label="Kinetic Chain"
            value={`${analysis.metrics.kineticChainEfficiency}%`}
            badge="Fluid"
            accentColor={Colors.accentBlue}
          />
        </View>
      </View>

      {/* GOOD POINTS CONTAINER */}
      <FeedbackCard
        type="good"
        title="Good Points (Technique Strengths)"
        subtitle="Key biomechanical elements executed effectively"
        items={analysis.goodPoints}
      />

      {/* BAD POINTS CONTAINER */}
      <FeedbackCard
        type="bad"
        title="Bad Points (Areas for Improvement)"
        subtitle="Critical technical flaws detected to eliminate"
        items={analysis.badPoints}
      />

      {/* Coach Drills & Recommendations */}
      {analysis.coachTips && analysis.coachTips.length > 0 && (
        <View style={styles.coachCard}>
          <View style={styles.coachHeader}>
            <View style={styles.coachIconCircle}>
              <Ionicons name="school" size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.coachTitle}>Recommended Coach Drills</Text>
              <Text style={styles.coachSubtitle}>Targeted training to fix detected bad points</Text>
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

      {/* Mandatory Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* Button 1: Record new video */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.recordNewBtn]}
          onPress={onRecordNewVideo}
          activeOpacity={0.85}
          accessibilityLabel="Record new video"
        >
          <View style={styles.btnIconBg}>
            <Ionicons name="videocam" size={20} color={Colors.white} />
          </View>
          <View style={styles.btnTextContainer}>
            <Text style={styles.recordNewBtnText}>Record new video</Text>
            <Text style={styles.btnSubtext}>Open camera for another shot</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.white} />
        </TouchableOpacity>

        {/* Button 2: Export feedback */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.exportBtn]}
          onPress={handleExport}
          disabled={isExporting}
          activeOpacity={0.85}
          accessibilityLabel="Export feedback"
        >
          <View style={[styles.btnIconBg, styles.exportIconBg]}>
            <Ionicons name="share-social" size={20} color={Colors.primary} />
          </View>
          <View style={styles.btnTextContainer}>
            <Text style={styles.exportBtnText}>Export feedback</Text>
            <Text style={styles.btnSubtext}>Share full report with coach or player</Text>
          </View>
          <Ionicons name="share-outline" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Back to Home Link */}
      <TouchableOpacity style={styles.homeLink} onPress={onNavigateHome}>
        <Ionicons name="home-outline" size={16} color={Colors.textMuted} />
        <Text style={styles.homeLinkText}>Return to Home</Text>
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
