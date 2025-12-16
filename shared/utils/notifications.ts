import { AlertItem, AlertsGroupedResponse, fetchAlerts } from '@features/alerts/services/alerts.api';
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
export async function sendTestNotification(title: string = '테스트 알림', body: string = '알림이 정상적으로 작동합니다!') {
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

/**
 * 알림 API(/alerts)를 통해 받은 데이터 중
 * D-3(디데이 3일 남은) 알림들에 대해 로컬 알림을 전송합니다.
 *
 * 반환값: 실제로 전송 시도한 알림 개수
 */
export async function sendD3ExpiryNotificationsFromApi(): Promise<number> {
  let data: AlertsGroupedResponse;
  try {
    data = await fetchAlerts();
  } catch (error) {
    console.error('알림 API 조회 실패:', error);
    return 0;
  }

  const groups = data.groups || {};
  const d3Items: AlertItem[] = groups['D-3'] || [];

  // 이미 전송된(is_sent=true) 알림은 제외하고, days_remaining이 3인 항목만 선택
  const targets = d3Items.filter(
    (item) => item.is_sent === false && item.days_remaining === 3,
  );

  if (targets.length === 0) {
    return 0;
  }

  await Promise.all(
    targets.map((item) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: `D-3 알림: ${item.material_name}`,
          body: `${item.material_name}의 유통기한이 3일 남았어요. (만료일 ${item.expiration_date})`,
          sound: true,
          data: {
            alert_id: item.alert_id,
            material_id: item.material_id,
            d_day_label: item.d_day_label,
          },
        },
        // 일단은 "지금" 바로 알림 노출
        trigger: null,
      }),
    ),
  );

  return targets.length;
}


