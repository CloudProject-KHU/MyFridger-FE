import React from 'react';
import { StyleSheet, View } from 'react-native';

type CircleBadgeVariant = 'fresh' | 'medium' | 'warning';

type CircleBadgeProps = {
  variant?: CircleBadgeVariant;
  size?: number;
};

const COLORS: Record<CircleBadgeVariant, string> = {
  fresh: '#5CD27A', // 초록: 8일 이상
  medium: '#FFAE2C', // 주황: 4~7일
  warning: '#FF7474', // 빨강: 3일 이하
};

export function CircleBadge({ variant = 'fresh', size = 8 }: CircleBadgeProps) {
  return (
    <View
      style={[
        styles.circle,
        { backgroundColor: COLORS[variant], width: size, height: size },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: 999,
  },
});

