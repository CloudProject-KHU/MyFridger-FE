import type { FC } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, StyleSheet, Text } from "react-native";

import Colors from "@/shared/constants/Colors";
import { useColorScheme } from "@/shared/hooks/useColorScheme";

type ActionButtonTone = "primary" | "destructive";

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
  tone = "primary",
  disabled = false,
  fullWidth = true,
  style,
  labelStyle,
  subLabelStyle,
}) => {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? "light"];

  const toneColors = getToneColors(tone, palette);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        {
          backgroundColor: disabled
            ? toneColors.disabledBackground
            : toneColors.background,
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

type Palette = (typeof Colors)["light"];

function getToneColors(tone: ActionButtonTone, palette: Palette) {
  switch (tone) {
    case "primary":
      return {
        background: "#FFAE2C",
        text: "#FFFFFF",
        subText: "#FFFFFF",
        border: "transparent",
        disabledBackground: "#FFEFD4",
        disabledText: "#D4BE9F",
      };
    case "destructive":
      return {
        background: "#fdecea",
        text: "#c62828",
        subText: "#c62828",
        border: "transparent",
        disabledBackground: "#f9d6d4",
        disabledText: "#d97a7a",
      };
    default:
      return {
        background: "#FFAE2C",
        text: "#FFFFFF",
        subText: "#FFFFFF",
        border: "transparent",
        disabledBackground: "#FFAE2C",
        disabledText: "#D4BE9F",
      };
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  label: {
    fontSize: 17,
    fontWeight: "700",
  },
  subLabel: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "400",
  },
});

export default ActionButton;
