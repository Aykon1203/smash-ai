import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../constants/theme';

interface FeedbackCardProps {
  type: 'good' | 'bad';
  title: string;
  subtitle: string;
  items: string[];
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  type,
  title,
  subtitle,
  items,
}) => {
  const isGood = type === 'good';
  const accentColor = isGood ? Colors.success : Colors.warning;
  const bgColor = isGood ? Colors.successBg : Colors.warningBg;
  const borderColor = isGood ? Colors.successBorder : Colors.warningBorder;
  const iconName: keyof typeof Ionicons.glyphMap = isGood
    ? 'checkmark-circle'
    : 'alert-circle';

  return (
    <View style={[styles.container, { borderColor }]}>
      <View style={[styles.header, { backgroundColor: bgColor }]}>
        <View style={[styles.iconBadge, { backgroundColor: accentColor }]}>
          <Ionicons
            name={iconName}
            size={18}
            color={Colors.background}
          />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <View style={styles.list}>
        {items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={[styles.bullet, { backgroundColor: accentColor }]} />
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    gap: 12,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  list: {
    padding: Spacing.md,
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  itemText: {
    flex: 1,
    color: Colors.text,
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '400',
  },
});
