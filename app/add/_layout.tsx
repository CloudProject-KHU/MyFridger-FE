import { Stack } from 'expo-router';

import Header from '@shared/components/navigation/Header';

export default function AddLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="select"
        options={{
          header: ({ navigation }) => (
            <Header
              title="재료 추가하기"
              showBackButton
              onBackPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="form"
        options={{
          header: ({ navigation }) => (
            <Header
              title="재료 직접 추가하기"
              showBackButton
              onBackPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="camera"
        options={{
          header: ({ navigation }) => (
            <Header
              title="카메라로 추가하기"
              showBackButton
              onBackPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
            />
          ),
        }}
      />
    </Stack>
  );
}
