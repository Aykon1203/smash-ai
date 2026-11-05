import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../constants/theme';

interface MetricCardProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  unit?: string;
  badge?: string;
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  iconName,
  label,
  value,
  unit,
  badge,
  accentColor = Colors.primary,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.iconWrapper, { backgroundColor: `${accentColor}18` }]}>
          <Ionicons name={iconName} size={18} color={accentColor} />
        </View>
        {badge && (
          <View style={[styles.badge, { borderColor: `${accentColor}40` }]}>
            <Text style={[styles.badgeText, { color: accentColor }]}>{badge}</Text>
          </View>
        )}
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.valueText}>{value}</Text>
        {unit && <Text style={styles.unitText}>{unit}</Text>}
      </View>

      <Text style={styles.labelText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    backgroundColor: Colors.surfaceCard,
    borderRadius: 14,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: Colors.surface,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  valueText: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  unitText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  labelText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
