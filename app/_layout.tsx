import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { isOnboardingCompleted } from '@features/onboarding/services/onboarding.storage';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import '@/shared/utils/notifications'; // 알림 핸들러 초기화

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  // 앱 최초 실행 시 로그인 플로우부터 시작
  initialRouteName: 'auth',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <RootLayoutNav />
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  // 온보딩 완료 여부 확인 후 적절한 화면으로 이동
  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await isOnboardingCompleted();
      if (completed) {
        // 온보딩 완료 시 로그인 화면으로
        router.replace('/auth/login');
      } else {
        // 온보딩 미완료 시 온보딩 화면으로
        router.replace('/onboarding');
      }
      setIsInitialized(true);
    };

    checkOnboarding();
  }, [router]);

  // 알림 탭했을 때 홈 탭으로 이동
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(() => {
      // 어떤 알림이든 탭하면 홈 탭으로 이동
      router.replace('/(tabs)');
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add" options={{ headerShown: false }} />
        <Stack.Screen name="ingredients" options={{ headerShown: false }} />
        <Stack.Screen name="recipes" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
