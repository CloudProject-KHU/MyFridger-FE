import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/shared/components/navigation/Header';
import { useSettingsStore } from '@features/settings/state/settings.store';

export default function SettingsScreen() {
  const router = useRouter();
  const { notificationsEnabled, toggleNotifications } = useSettingsStore();

  const handleBackPress = React.useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <Header title="설정" showBackButton onBackPress={handleBackPress} hideDivider />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>알림 받기</Text>
          <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
        </View>
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
});
