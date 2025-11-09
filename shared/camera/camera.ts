import { Camera } from 'expo-camera';

export type CameraPermissionStatus = {
  granted: boolean;
  canAskAgain: boolean;
};

export async function requestCameraPermissionsAsync(): Promise<CameraPermissionStatus> {
  const { status, canAskAgain, granted } = await Camera.requestCameraPermissionsAsync();
  return {
    granted: status === 'granted' || granted,
    canAskAgain,
  };
}
