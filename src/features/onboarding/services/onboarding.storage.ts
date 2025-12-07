/**
 * 온보딩 완료 여부 저장
 */

import { createMemoryStorage } from '@shared/libs/storage/mmkv';

const storage = createMemoryStorage('onboarding');

const ONBOARDING_COMPLETED_KEY = 'completed';

export async function isOnboardingCompleted(): Promise<boolean> {
  return storage.get<boolean>(ONBOARDING_COMPLETED_KEY) ?? false;
}

export async function setOnboardingCompleted(completed: boolean = true): Promise<void> {
  storage.set(ONBOARDING_COMPLETED_KEY, completed);
}

