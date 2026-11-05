import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../constants/theme';
import { VideoInfo, ShotAnalysis } from '../types/badminton';
import { analyzeBadmintonVideo, ANALYSIS_STAGES } from '../services/aiAnalyzer';

interface LoadingScreenProps {
  video: VideoInfo;
  onAnalysisComplete: (result: ShotAnalysis) => void;
  onCancel: () => void;
}

const BADMINTON_FEITEN = [
  'Badminton is de snelste racketsport ter wereld, met geregistreerde smashes van meer dan 490 km/u!',
  'Een jump smash levert een tot 20% steilere neerwaartse invalshoek op dan een staande smash.',
  'Topspelers genereren 80% van hun smashkracht via onderarmpronatie en polssnap.',
  'Bij een backhand clear drukt de duim krachtig op het brede facet van de handgreep.',
  'Lin Dan en Lee Chong Wei stonden in 40 internationale finales tegenover elkaar.',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  video,
  onAnalysisComplete,
  onCancel,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  // Animaties
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Shuttlecock pulsatie- & rotatie-effecten
  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinLoop.start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % BADMINTON_FEITEN.length);
    }, 2800);

    return () => {
      spinLoop.stop();
      pulseLoop.stop();
      clearInterval(tipInterval);
    };
  }, []);

  // Voer de AI-slaganalyse uit
  useEffect(() => {
    let isMounted = true;

    async function runAnalysis() {
      try {
        const result = await analyzeBadmintonVideo(video, (p, stageIdx) => {
          if (!isMounted) return;
          setProgress(p);
          setCurrentStageIndex(stageIdx);
          Animated.timing(progressAnim, {
            toValue: p,
            duration: 120,
            useNativeDriver: false,
          }).start();
        });

        if (isMounted) {
          setTimeout(() => {
            if (isMounted) {
              onAnalysisComplete(result);
            }
          }, 350);
        }
      } catch (err) {
        console.error('Analysefout:', err);
      }
    }

    runAnalysis();

    return () => {
      isMounted = false;
    };
  }, [video]);

  const spinInterpolation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Achtergrond gloed */}
      <View style={styles.radialGlow} />

      {/* Videobron indicator */}
      <View style={styles.sourceBadge}>
        <Ionicons
          name={video.source === 'camera' ? 'videocam' : video.source === 'upload' ? 'folder' : 'flash'}
          size={14}
          color={Colors.primary}
        />
        <Text style={styles.sourceText} numberOfLines={1}>
          {video.name || 'Badmintonvideo'}
        </Text>
      </View>

      {/* Geanimeerde Shuttlecock Hub */}
      <View style={styles.shuttlecockContainer}>
        <View style={styles.outerOrbit}>
          <Animated.View
            style={[
              styles.shuttleWrapper,
              {
                transform: [
                  { rotate: spinInterpolation },
                  { scale: pulseAnim },
                ],
              },
            ]}
          >
            <View style={styles.shuttlecockCircle}>
              <MaterialCommunityIcons name="badminton" size={48} color={Colors.primary} />
            </View>
          </Animated.View>
        </View>

        <Text style={styles.progressPercent}>{progress}%</Text>
        <Text style={styles.loadingHeading}>Badmintonslag Analyseren</Text>
        <Text style={styles.loadingSubheading}>
          {ANALYSIS_STAGES[currentStageIndex]?.description || 'Slagmechanica wordt verwerkt...'}
        </Text>
      </View>

      {/* Voortgangsbalk */}
      <View style={styles.progressBarWrapper}>
        <View style={styles.progressBarTrack}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>

      {/* AI Analysestappen Checklist */}
      <View style={styles.stagesCard}>
        {ANALYSIS_STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex || progress === 100;
          const isCurrent = idx === currentStageIndex && progress < 100;

          return (
            <View key={idx} style={styles.stageRow}>
              <View
                style={[
                  styles.stageIndicator,
                  isDone && styles.stageDone,
                  isCurrent && styles.stageCurrent,
                ]}
              >
                {isDone ? (
                  <Ionicons name="checkmark" size={14} color={Colors.background} />
                ) : isCurrent ? (
                  <View style={styles.stageCurrentDot} />
                ) : (
                  <Text style={styles.stageNumber}>{idx + 1}</Text>
                )}
              </View>

              <View style={styles.stageTextContainer}>
                <Text
                  style={[
                    styles.stageTitle,
                    (isDone || isCurrent) && styles.stageTitleActive,
                  ]}
                >
                  {stage.title}
                </Text>
                <Text style={styles.stageDescription}>{stage.description}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Badminton Weetje / Tip */}
      <View style={styles.factCard}>
        <View style={styles.factHeader}>
          <Ionicons name="sparkles" size={16} color={Colors.accentVolt} />
          <Text style={styles.factLabel}>BADMINTON PRO-TIP</Text>
        </View>
        <Text style={styles.factText}>{BADMINTON_FEITEN[tipIndex]}</Text>
      </View>

      {/* Annuleren knop */}
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelText}>Analyse annuleren</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radialGlow: {
    position: 'absolute',
    top: 60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.primaryGlow,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: '85%',
  },
  sourceText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  shuttlecockContainer: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  outerOrbit: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  shuttleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shuttlecockCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceCard,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    color: Colors.primaryLight,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  loadingHeading: {
    color: Colors.text,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 4,
  },
  loadingSubheading: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: Spacing.md,
    minHeight: 36,
  },
  progressBarWrapper: {
    width: '100%',
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surfaceLight,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  stagesCard: {
    width: '100%',
    backgroundColor: Colors.surfaceCard,
    borderRadius: 16,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stageIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stageCurrent: {
    borderColor: Colors.accentVolt,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
  },
  stageCurrentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentVolt,
  },
  stageNumber: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  stageTextContainer: {
    flex: 1,
  },
  stageTitle: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  stageTitleActive: {
    color: Colors.text,
  },
  stageDescription: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  factCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.sm + 4,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  factLabel: {
    color: Colors.accentVolt,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  factText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  cancelButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  cancelText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
});
