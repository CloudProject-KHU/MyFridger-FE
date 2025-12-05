import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/shared/components/navigation/Header';
import { useSettingsStore } from '@features/settings/state/settings.store';

export default function SettingsScreen() {
  const router = useRouter();
  const { notificationsEnabled, toggleNotifications } = useSettingsStore();

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <Header title="설정" hideDivider />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>알림 받기</Text>
          <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
        </View>

        <View style={styles.sectionDivider} />

        <Pressable
          style={styles.logoutButton}
          onPress={() => {
            // TODO: 실제 인증 상태/토큰 초기화 로직 추가
            router.replace('/auth/login');
          }}
        >
          <Text style={styles.logoutText}>로그아웃</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 8,
  },
  logoutButton: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#f3f3f5',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff3b30',
  },
});
