import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

const STEPS = ['하루', '일주일', '한 달'] as const;

type Step = (typeof STEPS)[number];

type DurationStepButtonProps = {
  value: Step;
  onChange: (next: Step) => void;
};

export function DurationStepButton({ value, onChange }: DurationStepButtonProps) {
  const handlePress = React.useCallback(() => {
    const currentIndex = STEPS.indexOf(value);
    const nextStep = STEPS[(currentIndex + 1) % STEPS.length];

    onChange(nextStep);
  }, [value, onChange]);

  return (
    <Pressable style={styles.button} onPress={handlePress}>
      <Text style={styles.label}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 999,
  },
  label: {
    fontSize: 13,
    color: '#1C1C1E',
  },
});


