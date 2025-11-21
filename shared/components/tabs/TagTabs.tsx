import type { FC } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TagTabsOption = {
  label: string;
  value: string;
};

export type TagTabsProps = {
  options: TagTabsOption[];
  activeValue?: string;
  onChange?: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  tabActiveStyle?: StyleProp<ViewStyle>;
  tabLabelStyle?: StyleProp<TextStyle>;
  tabLabelActiveStyle?: StyleProp<TextStyle>;
};

const TagTabs: FC<TagTabsProps> = ({
  options,
  activeValue,
  onChange,
  containerStyle,
  contentStyle,
  tabStyle,
  tabActiveStyle,
  tabLabelStyle,
  tabLabelActiveStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, contentStyle]}
      >
        {options.map((option) => {
          const isActive = option.value === activeValue;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.tab,
                tabStyle,
                isActive && styles.tabActive,
                isActive && tabActiveStyle,
              ]}
              onPress={() => onChange?.(option.value)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabLabel,
                  tabLabelStyle,
                  isActive && styles.tabLabelActive,
                  isActive && tabLabelActiveStyle,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    borderColor: '#111827',
    backgroundColor: '#111827',
  },
  tabLabel: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default TagTabs;

