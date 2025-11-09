import type { FC } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, Text } from 'react-native';

import Colors from '@/shared/constants/Colors';
import { useColorScheme } from '@/shared/hooks/useColorScheme';

type ActionButtonTone = 'primary' | 'secondary' | 'destructive';

export type ActionButtonProps = {
  label: string;
  subLabel?: string;
  onPress?: () => void;
  tone?: ActionButtonTone;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  subLabelStyle?: StyleProp<TextStyle>;
};

const ActionButton: FC<ActionButtonProps> = ({
  label,
  subLabel,
  onPress,
  tone = 'secondary',
  disabled = false,
  fullWidth = true,
  style,
  labelStyle,
  subLabelStyle,
}) => {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  const toneColors = getToneColors(tone, palette);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        {
          backgroundColor: disabled ? toneColors.disabledBackground : toneColors.background,
          borderColor: toneColors.border,
          opacity: pressed && !disabled ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: disabled ? toneColors.disabledText : toneColors.text },
          labelStyle,
        ]}
      >
        {label}
      </Text>
      {subLabel ? (
        <Text
          style={[
            styles.subLabel,
            { color: disabled ? toneColors.disabledText : toneColors.subText },
            subLabelStyle,
          ]}
        >
          {subLabel}
        </Text>
      ) : null}
    </Pressable>
  );
};

type Palette = (typeof Colors)['light'];

function getToneColors(tone: ActionButtonTone, palette: Palette) {
  switch (tone) {
    case 'primary':
      return {
        background: palette.tint,
        text: palette.background,
        subText: palette.background,
        border: 'transparent',
        disabledBackground: '#9ec5e6',
        disabledText: '#f5f9ff',
      };
    case 'destructive':
      return {
        background: '#fdecea',
        text: '#c62828',
        subText: '#c62828',
        border: 'transparent',
        disabledBackground: '#f9d6d4',
        disabledText: '#d97a7a',
      };
    case 'secondary':
    default:
      return {
        background: '#e0e0e0',
        text: '#212121',
        subText: '#424242',
        border: 'transparent',
        disabledBackground: '#cfcfcf',
        disabledText: '#9e9e9e',
      };
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    height: 48,
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  subLabel: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '400',
  },
});

export default ActionButton;



