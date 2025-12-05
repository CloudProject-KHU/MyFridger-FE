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
import EditIcon from '@/assets/images/edit.svg';
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
  { key: 'search', label: '재료 검색', route: '/add/select', angleDeg: 210, icon: SearchIcon, tint: '#FFAE2C' },
  { key: 'form', label: '직접 입력', route: '/add/form', angleDeg: 270, icon: EditIcon, tint: '#FFAE2C' },
  { key: 'camera', label: '카메라', route: '/add/camera', angleDeg: 330, icon: CameraIcon, tint: '#FFAE2C' },
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
    // 모달을 즉시 닫고 라우팅 시작 (애니메이션 대기 없이)
    setModalVisible(false);
    router.push(route as never);
  };

  return (
    <>
      <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
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

          {isHomeTab && (
            <View style={styles.fabContainer}>
              <Pressable onPress={toggleMenu} style={styles.fabPressable}>
                <View style={styles.fab}>
                  <PlusIcon width={28} height={28} color="#FFFFFF" />
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
            <Text style={styles.modalTitle}>재료 추가하기</Text>
            <View style={styles.modalActions}>
              {ACTIONS.map((action) => (
                <TouchableOpacity
                  key={action.key}
                  style={styles.modalActionButton}
                  onPress={() => handleActionPress(action.route)}
                >
                  <View style={[styles.modalActionIcon, { backgroundColor: action.tint }]}>
                    <action.icon width={24} height={24} color="#FFFFFF" />
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
    paddingHorizontal: 36,
    minHeight: 40,
    width: '100%',
  },
  tabButton: {
    padding: 12,
  },
  fabContainer: {
    position: 'absolute',
    top: -80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFAE2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPressable: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalActions: {
    gap: 16,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  modalActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },
});

