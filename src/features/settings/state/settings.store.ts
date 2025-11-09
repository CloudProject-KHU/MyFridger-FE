import React from 'react';

type SettingsStore = {
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
};

export function useSettingsStore(): SettingsStore {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

  const toggleNotifications = React.useCallback(() => {
    setNotificationsEnabled((prev) => !prev);
  }, []);

  return {
    notificationsEnabled,
    toggleNotifications,
  };
}
