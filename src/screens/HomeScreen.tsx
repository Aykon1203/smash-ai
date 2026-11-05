import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing } from '../constants/theme';
import { VideoInfo, ShotKey } from '../types/badminton';
import { SHOT_PRESETS } from '../services/aiAnalyzer';

interface HomeScreenProps {
  onStartAnalysis: (video: VideoInfo) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartAnalysis }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<ShotKey>('jump_smash');

  /**
   * Launch native camera to record badminton video
   */
  const handleRecordVideo = async () => {
    try {
      setIsProcessing(true);
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Camera Permission Required',
          'SmashAI requires camera access so you can record your badminton strokes for AI analysis.',
          [{ text: 'OK' }]
        );
        setIsProcessing(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 30,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onStartAnalysis({
          uri: asset.uri,
          name: asset.fileName || 'Recorded Badminton Shot',
          duration: asset.duration || 5,
          source: 'camera',
          samplePreset: selectedPreset,
        });
      }
    } catch (error: any) {
      console.error('Camera error:', error);
      Alert.alert('Camera Error', 'Could not access camera. You can also try selecting a demo shot below.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Upload video from device library
   */
  const handleUploadVideo = async () => {
    try {
      setIsProcessing(true);
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Photo Library Access Required',
          'SmashAI requires photo library access to upload your badminton video.',
          [{ text: 'OK' }]
        );
        setIsProcessing(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onStartAnalysis({
          uri: asset.uri,
          name: asset.fileName || 'Uploaded Badminton Shot',
          duration: asset.duration || 5,
          source: 'upload',
          samplePreset: selectedPreset,
        });
      }
    } catch (error: any) {
      console.error('Picker error:', error);
      Alert.alert('Upload Error', 'Could not open video library.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Direct trigger for sample badminton shot preset
   */
  const handleSelectSamplePreset = (presetKey: ShotKey) => {
    setSelectedPreset(presetKey);
    const preset = SHOT_PRESETS.find((p) => p.key === presetKey);
    onStartAnalysis({
      uri: `mock://badminton/${presetKey}.mp4`,
      name: `${preset?.name || presetKey} Demo Video`,
      duration: 4,
      source: 'sample',
      samplePreset: presetKey,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Intro */}
      <View style={styles.heroSection}>
        <View style={styles.categoryBadge}>
          <MaterialCommunityIcons name="badminton" size={14} color={Colors.primary} />
          <Text style={styles.categoryBadgeText}>AI BADMINTON VISION LAB</Text>
        </View>
        <Text style={styles.heroTitle}>Master Your Badminton Strokes</Text>
        <Text style={styles.heroDescription}>
          Capture your swing, let the AI calculate racket velocity, impact angle, and receive instant biomechanical feedback.
        </Text>
      </View>

      {/* Main Video Capture / Upload Container */}
      <View style={styles.mainContainer}>
        <View style={styles.containerGlow} />

        <View style={styles.containerHeader}>
          <View style={styles.containerIconCircle}>
            <MaterialCommunityIcons name="badminton" size={26} color={Colors.primary} />
          </View>
          <View style={styles.containerHeaderText}>
            <Text style={styles.containerTitle}>Shot Video Input</Text>
            <Text style={styles.containerSubtitle}>
              Record fresh footage or upload an existing badminton clip
            </Text>
          </View>
        </View>

        {isProcessing ? (
          <View style={styles.processingWrapper}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.processingText}>Preparing video...</Text>
          </View>
        ) : (
          <View style={styles.actionButtonsRow}>
            {/* Record Camera Button */}
            <TouchableOpacity
              style={[styles.actionButton, styles.recordButton]}
              onPress={handleRecordVideo}
              activeOpacity={0.85}
              accessibilityLabel="Record badminton video"
            >
              <View style={styles.recordIconRing}>
                <Ionicons name="videocam" size={24} color={Colors.white} />
              </View>
              <Text style={styles.actionButtonTitle}>Record Video</Text>
              <Text style={styles.actionButtonDesc}>Open camera for swing</Text>
              <View style={styles.activeTag}>
                <Text style={styles.activeTagText}>Camera</Text>
              </View>
            </TouchableOpacity>

            {/* Upload Video Button */}
            <TouchableOpacity
              style={[styles.actionButton, styles.uploadButton]}
              onPress={handleUploadVideo}
              activeOpacity={0.85}
              accessibilityLabel="Upload badminton video"
            >
              <View style={styles.uploadIconRing}>
                <Ionicons name="cloud-upload" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.actionButtonTitle}>Upload Video</Text>
              <Text style={styles.actionButtonDesc}>Select from gallery</Text>
              <View style={[styles.activeTag, styles.uploadTag]}>
                <Text style={[styles.activeTagText, styles.uploadTagText]}>Gallery</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.shuttlecockNotice}>
          <Ionicons name="information-circle" size={16} color={Colors.textMuted} />
          <Text style={styles.shuttlecockNoticeText}>
            For best accuracy, capture the player hitting the shuttlecock in full frame.
          </Text>
        </View>
      </View>

      {/* Badminton Shot Presets Library */}
      <View style={styles.presetsSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="flash" size={18} color={Colors.accentVolt} />
            <Text style={styles.sectionTitle}>Analyze Specific Shot Types</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Jump smash, backhand smash, backhand drop, clear & more
          </Text>
        </View>

        <View style={styles.presetsGrid}>
          {SHOT_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.key;
            return (
              <TouchableOpacity
                key={preset.key}
                style={[
                  styles.presetCard,
                  isSelected && styles.presetCardActive,
                ]}
                onPress={() => handleSelectSamplePreset(preset.key)}
                activeOpacity={0.75}
              >
                <View style={styles.presetTopRow}>
                  <View
                    style={[
                      styles.presetIconBox,
                      isSelected && styles.presetIconBoxActive,
                    ]}
                  >
                    <Ionicons
                      name={preset.icon as any}
                      size={18}
                      color={isSelected ? Colors.white : Colors.primary}
                    />
                  </View>
                  <View style={styles.presetBadge}>
                    <Text style={styles.presetBadgeText}>{preset.category}</Text>
                  </View>
                </View>

                <Text style={styles.presetName}>{preset.name}</Text>
                <Text style={styles.presetDesc} numberOfLines={2}>
                  {preset.description}
                </Text>

                <View style={styles.presetAnalyzeButton}>
                  <Text style={styles.presetAnalyzeText}>Analyze Shot</Text>
                  <Ionicons name="arrow-forward" size={12} color={Colors.primary} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Recording Tips & Guidelines Card */}
      <View style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <Ionicons name="bulb-outline" size={20} color={Colors.accentVolt} />
          <Text style={styles.tipsTitle}>Tips For Peak AI Accuracy</Text>
        </View>
        <View style={styles.tipsList}>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>1.</Text>
            <Text style={styles.tipText}>
              <Text style={styles.tipHighlight}>Side Court View:</Text> Position phone 3 to 4 meters away at roughly shoulder height.
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>2.</Text>
            <Text style={styles.tipText}>
              <Text style={styles.tipHighlight}>Full Body in Frame:</Text> Capture both feet during jump takeoff and full racket follow-through.
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>3.</Text>
            <Text style={styles.tipText}>
              <Text style={styles.tipHighlight}>Clean Impact:</Text> Film at 60fps or standard speed with good court lighting.
            </Text>
          </View>
        </View>
      </View>
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
    paddingBottom: Spacing.xxl,
  },
  heroSection: {
    marginBottom: Spacing.lg,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryGlow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 6,
    marginBottom: Spacing.sm,
  },
  categoryBadgeText: {
    color: Colors.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 6,
  },
  heroDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  mainContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  containerGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primaryGlow,
  },
  containerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.md,
  },
  containerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  containerHeaderText: {
    flex: 1,
  },
  containerTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  containerSubtitle: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  processingWrapper: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  processingText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  recordButton: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primary,
  },
  uploadButton: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
  },
  recordIconRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadIconRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  actionButtonDesc: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTag: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
  },
  activeTagText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  uploadTag: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  uploadTagText: {
    color: Colors.primaryLight,
  },
  shuttlecockNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  shuttlecockNoticeText: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: 11.5,
    lineHeight: 16,
  },
  presetsSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetCard: {
    width: '48.5%',
    backgroundColor: Colors.surfaceCard,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  presetTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  presetIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetIconBoxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  presetBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: Colors.surfaceLight,
  },
  presetBadgeText: {
    color: Colors.textSecondary,
    fontSize: 9.5,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  presetName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  presetDesc: {
    color: Colors.textMuted,
    fontSize: 11,
    lineHeight: 15,
    minHeight: 30,
    marginBottom: 8,
  },
  presetAnalyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  presetAnalyzeText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  tipsCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 16,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  tipsTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  tipBullet: {
    color: Colors.accentVolt,
    fontSize: 12,
    fontWeight: '700',
  },
  tipText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  tipHighlight: {
    color: Colors.text,
    fontWeight: '700',
  },
});
