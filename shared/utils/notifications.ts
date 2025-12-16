import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 알림 핸들러 설정 (앱이 포그라운드일 때)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    // SDK 54 타입 정의에 맞춘 추가 필드
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// 권한 요청 함수 (로컬 알림용)
export async function registerForPushNotificationsAsync(requirePushToken: boolean = false) {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('알림 권한이 거부되었습니다.');
    return null;
  }

  // 푸시 토큰이 필요한 경우에만 가져오기 (projectId 필요)
  if (requirePushToken) {
    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('푸시 토큰:', token);
      return token;
    } catch (error) {
      console.warn('푸시 토큰 가져오기 실패 (projectId 필요):', error);
      return null;
    }
  }

  // 로컬 알림만 사용하는 경우 권한만 확인
  return 'granted';
}

// 즉시 알림 보내기 (테스트용)
export async function sendTestNotification(
  title: string = '유통기한 임박 재료가 있어요!',
  body: string = '지금 쓰기 딱 좋은 레시피를 추천해드릴게요 👩‍🍳',
) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        data: { test: true },
      },
      trigger: null, // null이면 즉시
    });
    return true;
  } catch (error) {
    console.error('알림 전송 실패:', error);
    return false;
  }
}

// 몇 초 후 알림 보내기
export async function scheduleNotificationAfterSeconds(
  title: string,
  body: string,
  seconds: number
) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
        repeats: false,
      } as Notifications.TimeIntervalTriggerInput,
    });
    return true;
  } catch (error) {
    console.error('알림 스케줄링 실패:', error);
    return false;
  }
}


