import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type BadgeVariant = 'fresh' | 'medium' | 'warning' | 'category' | 'tag' | 'have' | 'need';

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

const COLORS: Record<BadgeVariant, { background: string; text: string }> = {
  fresh: {
    background: '#61BC39', // 초록: 8일 이상
    text: '#FFFFFF',
  },
  medium: {
    background: '#FFAE2C', // 주황: 4~7일
    text: '#FFFFFF',
  },
  warning: {
    background: '#FF7474', // 빨강: 3일 이하
    text: '#FFFFFF',
  },
  category: {
    background: '#FFF7E9',
    text: '#FFAE2C',
  },
  tag: {
    background: '#F5F5F5',
    text: '#666666',
  },
  have: {
    background: '#E8F5E9', // 연한 녹색: 보유
    text: '#4CAF50',
  },
  need: {
    background: '#FFEBEE', // 연한 빨간색: 필요
    text: '#F44336',
  },
};

export function Badge({ label, variant = 'fresh' }: BadgeProps) {
  const palette = COLORS[variant];

  return (
    <View style={[
      styles.container,
      { backgroundColor: palette.background },
      variant === 'tag' && styles.tagContainer,
      (variant === 'have' || variant === 'need') && styles.statusContainer
    ]}>
      <Text style={[
        styles.label,
        { color: palette.text },
        variant === 'tag' && styles.tagLabel,
        (variant === 'have' || variant === 'need') && styles.statusLabel
      ]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  tagContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagLabel: {
    fontSize: 13,
    fontWeight: '400',
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});


