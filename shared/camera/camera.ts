export type CameraPermissionStatus = {
  granted: boolean;
};

export async function requestCameraPermissionsAsync(): Promise<CameraPermissionStatus> {
  // TODO: expo-camera 연동 예정
  return { granted: true };
}
