import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CarrotFaceIcon from '@/assets/images/character/carrot-face.svg';
import ChevronRightIcon from '@/assets/images/icons/chevron-right.svg';
import Header from '@/shared/components/navigation/Header';
import {
  registerForPushNotificationsAsync,
  sendD3ExpiryNotificationsFromApi,
} from '@/shared/utils/notifications';

type ToggleSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

function ToggleSwitch({ value, onValueChange }: ToggleSwitchProps) {
  return (
    <Pressable
      style={[styles.toggleSwitch, value && styles.toggleSwitchActive]}
      onPress={() => onValueChange(!value)}
    >
      <View style={[styles.toggleSwitchThumb, value && styles.toggleSwitchThumbActive]} />
    </Pressable>
  );
}

type MenuItemProps = {
  icon: string;
  text: string;
  value?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  danger?: boolean;
};

function MenuItem({ icon, text, value, onPress, rightComponent, danger }: MenuItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemPressed,
        danger && styles.menuItemDanger,
      ]}
      onPress={onPress}
    >
      <View style={styles.menuLeft}>
        <Text style={[styles.menuText, danger && styles.menuTextDanger]}>{text}</Text>
      </View>
      <View style={styles.menuRight}>
        {value && <Text style={styles.menuValue}>{value}</Text>}
        {rightComponent}
        {!rightComponent && <ChevronRightIcon width={20} height={20} color="#999" />}
      </View>
    </Pressable>
  );
}

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
};

function ConfirmModal({
  visible,
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.modalOverlay} onPress={onCancel}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.modalButtons}>
            <Pressable style={styles.modalButtonCancel} onPress={onCancel}>
              <Text style={styles.modalButtonCancelText}>취소</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButtonConfirm, danger && styles.modalButtonDanger]}
              onPress={onConfirm}
            >
              <Text style={styles.modalButtonConfirmText}>{confirmText}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const [pushNotification, setPushNotification] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(false);
    // TODO: 실제 인증 상태/토큰 초기화 로직 추가
    router.replace('/auth/login');
  };

  const handleTestNotification = async () => {
    // 권한 확인 및 요청 (로컬 알림만 사용하므로 푸시 토큰 불필요)
    const result = await registerForPushNotificationsAsync(false);
    if (!result) {
      Alert.alert(
        '알림 권한 필요',
        '알림을 받으려면 권한이 필요합니다. 설정에서 알림 권한을 허용해주세요.',
      );
      return;
    }

    // D-3 남은 재료들에 대한 소비기한 알림 전송
    try {
      const count = await sendD3ExpiryNotificationsFromApi();
      if (count > 0) {
        Alert.alert('D-3 알림 전송', `D-3 남은 재료 ${count}개에 대한 알림을 전송했습니다.`);
      } else {
        Alert.alert('D-3 알림 없음', '현재 D-3 남은 재료가 없습니다.');
      }
    } catch (error) {
      console.error('D-3 알림 전송 실패:', error);
      Alert.alert('알림 전송 실패', 'D-3 알림 전송 중 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <Header title="설정" hideDivider />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 프로필 섹션 */}
        <Pressable style={styles.profileSection} onPress={() => Alert.alert('프로필 편집', '프로필 편집 페이지로 이동합니다')}>
          <View style={styles.profileImage}>
            <CarrotFaceIcon width={64} height={64} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>사용자 이름</Text>
            <Text style={styles.profileEmail}>user@example.com</Text>
          </View>
          <ChevronRightIcon width={20} height={20} color="#999" />
        </Pressable>

        {/* 알림 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림</Text>
          <MenuItem
            icon="🔔"
            text="푸시 알림"
            rightComponent={<ToggleSwitch value={pushNotification} onValueChange={setPushNotification} />}
          />
          <MenuItem
            icon="⏰"
            text="유통기한 알림"
            value="D-3일"
            onPress={() => Alert.alert('유통기한 알림', '유통기한 알림 설정 페이지로 이동합니다')}
          />
          <MenuItem
            icon="🧪"
            text="알림 테스트"
            onPress={handleTestNotification}
          />
        </View>

        {/* 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>
          <MenuItem
            icon="📢"
            text="공지사항"
            onPress={() => Alert.alert('공지사항', '공지사항 페이지로 이동합니다')}
          />
          <MenuItem
            icon="❓"
            text="자주 묻는 질문"
            onPress={() => Alert.alert('FAQ', 'FAQ 페이지로 이동합니다')}
          />
          <MenuItem
            icon="💬"
            text="문의하기"
            onPress={() => Alert.alert('문의하기', '문의하기 페이지로 이동합니다')}
          />
          <MenuItem
            icon="📄"
            text="이용약관"
            onPress={() => Alert.alert('이용약관', '이용약관 페이지로 이동합니다')}
          />
          <MenuItem
            icon="🔒"
            text="개인정보 처리방침"
            onPress={() => Alert.alert('개인정보 처리방침', '개인정보 처리방침 페이지로 이동합니다')}
          />
        </View>

        {/* 계정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정</Text>
          <MenuItem
            icon="🚪"
            text="로그아웃"
            onPress={() => setLogoutModalVisible(true)}
          />
        </View>

        {/* 앱 버전 */}
        <Text style={styles.appVersion}>냉장고 레시피 v1.0.0</Text>
      </ScrollView>

      {/* 로그아웃 모달 */}
      <ConfirmModal
        visible={logoutModalVisible}
        title="로그아웃"
        message="정말 로그아웃 하시겠어요?"
        confirmText="로그아웃"
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    backgroundColor: '#ffffff',
    padding: 24,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
    marginHorizontal: 24,
    borderRadius: 16,
  },
  sectionTitle: {
    padding: 16,
    paddingBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  menuItem: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemPressed: {
    backgroundColor: '#F5F5F5',
  },
  menuItemDanger: {
    // danger 스타일은 텍스트 색상으로만 적용
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    fontSize: 20,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  menuTextDanger: {
    color: '#F44336',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#999',
  },
  arrowIcon: {
    fontSize: 20,
    color: '#999',
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#FFAE2C',
  },
  toggleSwitchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  toggleSwitchThumbActive: {
    transform: [{ translateX: 20 }],
  },
  appVersion: {
    textAlign: 'center',
    padding: 24,
    color: '#999',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22.5,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonCancel: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  modalButtonConfirm: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFAE2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonDanger: {
    backgroundColor: '#F44336',
  },
  modalButtonConfirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
});
