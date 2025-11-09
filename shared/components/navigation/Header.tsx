import type { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChevronLeftIcon from '@/assets/images/chevron-left.svg';
import Colors from '@/shared/constants/Colors';
import { useColorScheme } from '@/shared/hooks/useColorScheme';

type HeaderButtonConfig = {
  icon: FC<SvgProps>;
  onPress?: () => void;
};

export type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightButton?: HeaderButtonConfig;
  hideDivider?: boolean;
};

const Header: FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightButton,
  hideDivider = false,
}) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    }
  };

  const LeftIcon = showBackButton ? ChevronLeftIcon : null;
  const RightIcon = rightButton?.icon ?? null;

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingTop: insets.top,
          backgroundColor: palette.background,
          borderBottomWidth: hideDivider ? 0 : StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.side}>
          {LeftIcon ? (
            <Pressable hitSlop={8} onPress={handleBackPress} style={styles.iconButton}>
              <LeftIcon width={24} height={24} color={palette.text} />
            </Pressable>
          ) : null}
        </View>
        <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
        <View style={styles.side}>
          {RightIcon ? (
            <Pressable hitSlop={8} onPress={rightButton?.onPress} style={styles.iconButton}>
              <RightIcon width={24} height={24} color={palette.text} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  side: {
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;

