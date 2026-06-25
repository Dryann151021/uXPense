export const isPushNotificationSupported = () =>
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window;

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export const registerPushServiceWorker = async () => {
  if (!isPushNotificationSupported()) {
    return null;
  }

  return navigator.serviceWorker.register('/sw.js');
};

export const subscribeBrowserToPush = async (publicKey) => {
  const registration = await registerPushServiceWorker();

  if (!registration) {
    return null;
  }

  const existingSubscription =
    await registration.pushManager.getSubscription();

  if (existingSubscription) {
    return existingSubscription;
  }

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });
};

export const getCurrentPushSubscription = async () => {
  const registration = await registerPushServiceWorker();

  if (!registration) {
    return null;
  }

  return registration.pushManager.getSubscription();
};
