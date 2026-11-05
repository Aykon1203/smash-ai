import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../constants/theme';
import { ScreenType } from '../types/badminton';

interface HeaderProps {
  currentScreen: ScreenType;
  onBackToHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onBackToHome }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {currentScreen !== 'Home' && onBackToHome && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackToHome}
            accessibilityLabel="Back to Home"
          >
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </TouchableOpacity>
        )}
        <View style={styles.brandContainer}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="badminton" size={24} color={Colors.primary} />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>Smash</Text>
              <Text style={styles.brandTitleAI}>AI</Text>
            </View>
            <Text style={styles.brandSubtitle}>Badminton Shot Analyzer</Text>
          </View>
        </View>
      </View>

      <View style={styles.badgeContainer}>
        <View
          style={[
            styles.statusDot,
            currentScreen === 'Result'
              ? styles.dotResult
              : currentScreen === 'Loading'
              ? styles.dotLoading
              : styles.dotHome,
          ]}
        />
        <Text style={styles.statusText}>{currentScreen}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandTitleAI: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotHome: {
    backgroundColor: Colors.primary,
  },
  dotLoading: {
    backgroundColor: Colors.accentVolt,
  },
  dotResult: {
    backgroundColor: Colors.primaryLight,
  },
  statusText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
