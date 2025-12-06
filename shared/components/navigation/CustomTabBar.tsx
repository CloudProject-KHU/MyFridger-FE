import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SvgProps } from 'react-native-svg';

import CameraIcon from '@/assets/images/camera.svg';
import HomeIcon from '@/assets/images/home.svg';
import PlusIcon from '@/assets/images/plus.svg';
import RecipeIcon from '@/assets/images/recipe.svg';
import SearchIcon from '@/assets/images/search.svg';
import SettingIcon from '@/assets/images/setting.svg';
import Colors from '@/shared/constants/Colors';
import { useColorScheme } from '@/shared/hooks/useColorScheme';

type RouteKey = 'index' | 'recipes' | 'settings';

const ROUTE_ICON: Record<RouteKey, FC<SvgProps>> = {
  index: (props) => <HomeIcon {...props} />,
  recipes: (props) => <RecipeIcon {...props} />,
  settings: (props) => <SettingIcon {...props} />,
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
  const [modalVisible, setModalVisible] = useState(false);

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

  const toggleMenu = () => {
    setModalVisible((prev) => !prev);
  };

  const closeMenu = () => {
    setModalVisible(false);
  };

  const handleActionPress = (route: string) => {
    // 라우팅을 먼저 시작하고, 모달은 백그라운드에서 닫히도록
    router.push(route as never);
    // 다음 틱에서 모달 닫기 (라우팅이 블로킹되지 않도록)
    setTimeout(() => {
      setModalVisible(false);
    }, 0);
  };

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
                <View style={styles.fab}>
                  <PlusIcon width={22} height={22} color="#FFFFFF" />
                  <Text style={styles.fabText}>재료 추가</Text>
                </View>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeMenu}>
        <View style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalActions}>
              {ACTIONS.map((action) => (
                <TouchableOpacity
                  key={action.key}
                  style={styles.modalActionButton}
                  onPress={() => handleActionPress(action.route)}
                >
                  <View style={styles.modalActionIcon}>
                    <action.icon width={24} height={24} color={action.tint} />
                  </View>
                  <Text style={styles.modalActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
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
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#FFAE2C',
  },
  fabPressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  modalHandle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#DBDBDB',
    marginBottom: 20,
  },
  modalActions: {
    gap: 0,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 20,
    paddingHorizontal: 0,
  },
  modalActionIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#36383E',
  },
});

