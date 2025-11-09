import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type BadgeVariant = 'fresh' | 'warning' | 'added' | 'category';

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

const COLORS: Record<BadgeVariant, { background: string; text: string }> = {
  fresh: {
    background: '#5CD27A',
    text: '#FFFFFF',
  },
  warning: {
    background: '#FF7474',
    text: '#FFFFFF',
  },
  added: {
    background: '#111111',
    text: '#FFFFFF',
  },
  category: {
    background: '#FFF7E9',
    text: '#FFAE2C',
  },
};

export function Badge({ label, variant = 'fresh' }: BadgeProps) {
  const palette = COLORS[variant];

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
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
});


