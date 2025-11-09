import type { ForwardedRef } from 'react';
import React, { forwardRef, useMemo } from 'react';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import SearchIcon from '@/assets/images/search.svg';
import Colors from '@/shared/constants/Colors';
import { useColorScheme } from '@/shared/hooks/useColorScheme';

export type SearchBarProps = {
  containerStyle?: StyleProp<ViewStyle>;
  onPressIcon?: () => void;
} & Omit<TextInputProps, 'style' | 'placeholderTextColor'>;

const SearchBar = forwardRef<TextInput, SearchBarProps>(function SearchBar(
  { placeholder = '검색', containerStyle, onPressIcon, editable = true, ...rest },
  ref: ForwardedRef<TextInput>,
) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  const colors = useMemo(
    () =>
      colorScheme === 'dark'
        ? {
            background: '#1f1f1f',
            text: palette.text,
            placeholder: '#8c8c8c',
            icon: '#9e9e9e',
          }
        : {
            background: '#f1f1f1',
            text: '#212121',
            placeholder: '#9e9e9e',
            icon: '#757575',
          },
    [colorScheme, palette.text],
  );

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: colors.background, opacity: pressed && !editable ? 0.95 : 1 },
        containerStyle,
      ]}
      disabled={editable}
      onPress={onPressIcon}
      accessibilityRole={editable ? undefined : 'button'}
    >
      <TextInput
        ref={ref}
        style={[styles.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        editable={editable}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />
      <Pressable
        style={styles.iconButton}
        onPress={onPressIcon}
        hitSlop={6}
        accessibilityRole="button"
      >
        <SearchIcon width={20} height={20} color={colors.icon} />
      </Pressable>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  iconButton: {
    marginLeft: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchBar;



