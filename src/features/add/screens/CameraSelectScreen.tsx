import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { requestCameraPermissionsAsync } from '@shared/camera/camera';

export default function CameraSelectScreen() {
  const handleOpenCamera = async () => {
    await requestCameraPermissionsAsync();
    // TODO: 카메라 화면 구현
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>카메라로 재료를 촬영하여 빠르게 추가하세요.</Text>
      <Button title="카메라 열기" onPress={handleOpenCamera} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
    gap: 24,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
});
