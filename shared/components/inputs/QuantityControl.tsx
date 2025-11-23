import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type QuantityControlProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  style?: any;
};

export default function QuantityControl({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  style,
}: QuantityControlProps) {
  const handleDecrease = () => {
    if (!disabled && value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (!disabled && (!max || value < max)) {
      onChange(value + 1);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable
        onPress={handleDecrease}
        disabled={disabled || value <= min}
        style={[styles.button, (disabled || value <= min) && styles.buttonDisabled]}
      >
        <Text style={[styles.buttonText, (disabled || value <= min) && styles.buttonTextDisabled]}>
          −
        </Text>
      </Pressable>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
      </View>
      <Pressable
        onPress={handleIncrease}
        disabled={disabled || (max !== undefined && value >= max)}
        style={[
          styles.button,
          (disabled || (max !== undefined && value >= max)) && styles.buttonDisabled,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            (disabled || (max !== undefined && value >= max)) && styles.buttonTextDisabled,
          ]}
        >
          +
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    fontSize: 16,
    color: '#666',
  },
  buttonTextDisabled: {
    color: '#999',
  },
  valueContainer: {
    minWidth: 32,
    alignItems: 'center',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

