import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import type { FC } from 'react';
import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SvgProps } from 'react-native-svg';

import CameraIcon from '@/assets/images/camera.svg';
import EditIcon from '@/assets/images/edit.svg';
import HomeIcon from '@/assets/images/home.svg';
import PlusIcon from '@/assets/images/plus.svg';
import RecipeIcon from '@/assets/images/recipe.svg';
import SearchIcon from '@/assets/images/search.svg';
import Colors from '@/shared/constants/Colors';
import { useColorScheme } from '@/shared/hooks/useColorScheme';

type RouteKey = 'index' | 'recipes';

const ROUTE_ICON: Record<RouteKey, FC<SvgProps>> = {
  index: (props) => <HomeIcon {...props} />,
  recipes: (props) => <RecipeIcon {...props} />,
};

type FloatingAction = {
  key: string;
  label: string;
  route: string;
  angleDeg: number;
  icon: FC<SvgProps>;
  tint: string;
};

const ACTIONS: FloatingAction[] = [
  { key: 'search', label: '재료 검색', route: '/add/select', angleDeg: 210, icon: SearchIcon, tint: '#FF8A65' },
  { key: 'form', label: '직접 입력', route: '/add/form', angleDeg: 270, icon: EditIcon, tint: '#BA68C8' },
  { key: 'camera', label: '카메라', route: '/add/camera', angleDeg: 330, icon: CameraIcon, tint: '#64B5F6' },
];

const ACTION_DISTANCE = Platform.select({ ios: 110, default: 100 });

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  const routes = useMemo(
    () => state.routes.filter((route) => (['index', 'recipes'] as RouteKey[]).includes(route.name as RouteKey)),
    [state.routes],
  );

  const toggleMenu = () => {
    const toValue = expanded ? 0 : 1;
    Animated.spring(progress, {
      toValue,
      useNativeDriver: true,
      friction: 6,
    }).start();
    setExpanded((prev) => !prev);
  };

  const closeMenu = () => {
    if (!expanded) return;
    Animated.spring(progress, {
      toValue: 0,
      useNativeDriver: true,
      friction: 6,
    }).start();
    setExpanded(false);
  };

  const handleActionPress = (route: string) => {
    closeMenu();
    router.push(route as never);
  };

  const rotation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {expanded && (
        <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
      )}

      <View style={[styles.container, { backgroundColor: palette.background }]}>
        {routes.map((route) => {
          const isFocused = state.index === state.routes.indexOf(route);
          const IconComponent = ROUTE_ICON[route.name as RouteKey];
          const color = isFocused ? palette.text : palette.tabIconDefault;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tabButton}
            >
              <IconComponent width={28} height={28} color={color} />
            </Pressable>
          );
        })}

        <View style={styles.fabContainer}>
          {ACTIONS.map((action) => {
            const radians = (action.angleDeg * Math.PI) / 180;
            const translateX = Math.cos(radians) * (ACTION_DISTANCE ?? 100);
            const translateY = Math.sin(radians) * (ACTION_DISTANCE ?? 100);

            const animatedStyle = {
              opacity: progress,
              transform: [
                {
                  translateX: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, translateX],
                  }),
                },
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, translateY],
                  }),
                },
                {
                  scale: progress,
                },
              ],
            };

            return (
              <Animated.View key={action.key} style={[styles.actionWrapper, animatedStyle]}>
                <Pressable onPress={() => handleActionPress(action.route)} style={styles.actionButton}>
                  <View style={[styles.actionCircle, { backgroundColor: action.tint }]}>
                    <action.icon width={22} height={22} color="#fff" />
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </Pressable>
              </Animated.View>
            );
          })}

          <Animated.View style={[styles.fab, { transform: [{ rotate: rotation }] }]}>
            <Pressable onPress={toggleMenu} style={styles.fabPressable}>
              <PlusIcon width={28} height={28} color={expanded ? palette.tabIconSelected : palette.text} />
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
    borderRadius: 999,
    minHeight: 70,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  tabButton: {
    padding: 12,
  },
  fabContainer: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPressable: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

