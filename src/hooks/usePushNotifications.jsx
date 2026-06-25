import { useCallback, useEffect, useState } from 'react';
import { notificationsApi } from '../api/notifications.js';
import {
  getCurrentPushSubscription,
  isPushNotificationSupported,
  subscribeBrowserToPush,
} from '../utils/push-notifications.js';

export function usePushNotifications() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkSubscription = async () => {
      if (!isPushNotificationSupported()) {
        setStatus('unsupported');
        return;
      }

      if (Notification.permission === 'denied') {
        setStatus('denied');
        return;
      }

      const subscription = await getCurrentPushSubscription();
      setStatus(subscription ? 'enabled' : 'idle');
    };

    checkSubscription();
  }, []);

  const enablePushNotifications = useCallback(async () => {
    if (!isPushNotificationSupported()) {
      setStatus('unsupported');
      setMessage('Browser ini belum mendukung push notification.');
      return { success: false };
    }

    setStatus('loading');
    setMessage('');

    try {
      const permission =
        Notification.permission === 'default'
          ? await Notification.requestPermission()
          : Notification.permission;

      if (permission !== 'granted') {
        setStatus('denied');
        setMessage('Izin notifikasi belum diberikan.');
        return { success: false };
      }

      const publicKey = await notificationsApi.getVapidPublicKey();
      const subscription = await subscribeBrowserToPush(publicKey);

      if (!subscription) {
        setStatus('unsupported');
        setMessage('Service worker tidak tersedia.');
        return { success: false };
      }

      await notificationsApi.subscribe(subscription.toJSON());

      setStatus('enabled');
      setMessage('Reminder jam 9 malam berhasil diaktifkan.');
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Gagal mengaktifkan notifikasi.';

      setStatus('error');
      setMessage(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const disablePushNotifications = useCallback(async () => {
    setStatus('loading');
    setMessage('');

    try {
      const subscription = await getCurrentPushSubscription();

      if (subscription) {
        await notificationsApi.unsubscribe(subscription.endpoint);
        await subscription.unsubscribe();
      }

      setStatus('idle');
      setMessage('Notifikasi berhasil dinonaktifkan.');
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Gagal menonaktifkan notifikasi.';

      setStatus('error');
      setMessage(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    status,
    message,
    isEnabled: status === 'enabled',
    isLoading: status === 'loading',
    enablePushNotifications,
    disablePushNotifications,
  };
}
