import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import type { FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SvgProps } from 'react-native-svg';

import CameraIcon from '@/assets/images/icons/camera.svg';
import HomeIcon from '@/assets/images/icons/home.svg';
import PlusIcon from '@/assets/images/icons/plus.svg';
import RecipeIcon from '@/assets/images/icons/recipe.svg';
import SearchIcon from '@/assets/images/icons/search.svg';
import SettingIcon from '@/assets/images/icons/setting.svg';
import Colors from '@/shared/constants/Colors';
import { useColorScheme } from '@/shared/hooks/useColorScheme';

type RouteKey = 'index' | 'recipes' | 'settings';

const ROUTE_ICON: Record<RouteKey, FC<SvgProps>> = {
  index: (props) => <HomeIcon {...props} />,
  recipes: (props) => <RecipeIcon {...props} />,
  settings: (props) => <SettingIcon {...props} />,
};

// 갤러리 아이콘 (산과 태양이 있는 풍경)
function GalleryIcon(props: SvgProps) {
  const size = typeof props.width === 'number' ? props.width : 24;
  const color = props.color || '#FFFFFF';
  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      {/* 프레임 */}
      <View
        style={{
          width: '100%',
          height: '100%',
          borderWidth: 2,
          borderColor: color,
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: 'transparent',
        }}
      >
        {/* 태양 */}
        <View
          style={{
            width: 5,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: color,
            position: 'absolute',
            top: 3,
            right: 3,
          }}
        />
        {/* 산 1 (왼쪽) */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 0,
            height: 0,
            borderLeftWidth: 7,
            borderRightWidth: 7,
            borderBottomWidth: 10,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: color,
          }}
        />
        {/* 산 2 (오른쪽) */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 5,
            width: 0,
            height: 0,
            borderLeftWidth: 6,
            borderRightWidth: 6,
            borderBottomWidth: 8,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: color,
          }}
        />
      </View>
    </View>
  );
}

type FloatingAction = {
  key: string;
  label: string;
  route: string;
  angleDeg: number;
  icon: FC<SvgProps>;
  tint: string;
};

const ACTIONS: FloatingAction[] = [
  { key: 'camera', label: '카메라로 추가하기', route: '/add/camera', angleDeg: 330, icon: CameraIcon, tint: '#FFAE2C' },
  { key: 'search', label: '재료 검색해서 추가하기', route: '/add/select', angleDeg: 210, icon: SearchIcon, tint: '#FFAE2C' },
];

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = useState(false);
  const widthAnim = useRef(new Animated.Value(56)).current; // 초기값: 원형 버튼 크기
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const iconOpacityAnim = useRef(new Animated.Value(0)).current;

  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  const isHomeTab = useMemo(() => {
    const activeRoute = state.routes[state.index];
    return activeRoute?.name === 'index';
  }, [state.index, state.routes]);

  const routes = useMemo(() => {
    const filtered = state.routes.filter((route) =>
      (['index', 'recipes', 'settings'] as RouteKey[]).includes(route.name as RouteKey)
    );
    // 홈 탭을 가운데로 오도록 순서 조정: 레시피, 홈, 설정
    const order = ['recipes', 'index', 'settings'] as RouteKey[];
    return order
      .map((name) => filtered.find((route) => route.name === name))
      .filter((route): route is typeof filtered[0] => route !== undefined);
  }, [state.routes]);

  useEffect(() => {
    if (menuVisible) {
      Animated.parallel([
        Animated.spring(widthAnim, {
          toValue: 200, // 확장된 너비
          useNativeDriver: false, // width는 native driver 사용 불가
          tension: 50,
          friction: 7,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(iconOpacityAnim, {
          toValue: 1,
          duration: 200,
          delay: 150, // 약간의 딜레이 후 아이콘 나타남
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(widthAnim, {
          toValue: 56,
          useNativeDriver: false,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(iconOpacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [menuVisible, widthAnim, rotateAnim, iconOpacityAnim]);

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleCameraPress = () => {
    // 라우팅을 먼저 시작하고, 메뉴는 다음 틱에서 닫기
    router.push('/add/camera' as never);
    setTimeout(() => {
      closeMenu();
    }, 0);
  };

  const handleSearchPress = () => {
    // 라우팅을 먼저 시작하고, 메뉴는 다음 틱에서 닫기
    router.push('/add/select' as never);
    setTimeout(() => {
    closeMenu();
    }, 0);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <>
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={[styles.container, { backgroundColor: palette.background }]}>
        {routes.map((route) => {
          const isFocused = state.index === state.routes.indexOf(route);
          const IconComponent = ROUTE_ICON[route.name as RouteKey];
            const color = isFocused ? '#FFAE2C' : palette.tabIconDefault;

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
                <IconComponent width={32} height={32} color={color} />
            </Pressable>
          );
        })}

          {isHomeTab && (
        <View style={styles.fabContainer}>
              <Pressable onPress={toggleMenu} style={styles.fabPressable}>
                <Animated.View
                  style={[
                    styles.fab,
                    {
                      width: widthAnim,
                    },
                  ]}
                >
                  {/* 왼쪽: 카메라 아이콘 */}
                  <Animated.View
                    style={[
                      styles.fabSideIcon,
                      {
                        opacity: iconOpacityAnim,
                      },
                    ]}
                    pointerEvents={menuVisible ? 'auto' : 'none'}
                  >
                    <Pressable style={styles.fabIconButton} onPress={handleCameraPress}>
                      <CameraIcon width={24} height={24} color="#FFFFFF" />
                    </Pressable>
                  </Animated.View>

                  {/* 중앙: + 아이콘 (회전하여 X처럼 보임) */}
                  <View style={styles.fabIconContainer}>
                    <Animated.View
                      style={{
                        transform: [{ rotate: rotateInterpolate }],
                      }}
                    >
                      <PlusIcon width={26} height={26} color="#FFFFFF" />
                    </Animated.View>
                  </View>

                  {/* 오른쪽: 검색 아이콘 */}
                  <Animated.View
                    style={[
                      styles.fabSideIcon,
                      {
                        opacity: iconOpacityAnim,
                      },
                    ]}
                    pointerEvents={menuVisible ? 'auto' : 'none'}
                  >
                    <Pressable style={styles.fabIconButton} onPress={handleSearchPress}>
                      <SearchIcon width={23} height={23} color="#FFFFFF" />
                </Pressable>
              </Animated.View>
                </Animated.View>
            </Pressable>
            </View>
          )}
        </View>
      </View>

      {/* 백드롭 - 화면 다른 곳 클릭 시 닫기 */}
      {menuVisible && (
        <Pressable
          style={styles.backdrop}
          onPress={closeMenu}
        />
      )}
    </>
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
    paddingHorizontal: 40,
    minHeight: 40,
    width: '100%',
  },
  tabButton: {
    padding: 12,
  },
  fabContainer: {
    position: 'absolute',
    top: -70,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  fab: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFAE2C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    overflow: 'hidden',
    gap: 20,
  },
  fabPressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabSideIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
  },
  fabIconContainer: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
  },
  fabIconButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 997,
  },
});





