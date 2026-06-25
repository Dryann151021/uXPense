/* global clients */

self.addEventListener('push', (event) => {
  const fallback = {
    title: 'uXPense Reminder',
    body: 'Jangan lupa catat pengeluaran hari ini.',
    icon: '/favicon.png',
    badge: '/favicon.png',
    url: '/expense',
  };

  const data = event.data ? event.data.json() : fallback;
  const title = data.title || fallback.title;
  const options = {
    body: data.body || fallback.body,
    icon: data.icon || fallback.icon,
    badge: data.badge || fallback.badge,
    data: {
      url: data.url || fallback.url,
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || '/',
    self.location.origin,
  ).href;

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        const focusedClient = clientList.find(
          (client) => client.url === targetUrl,
        );

        if (focusedClient) {
          return focusedClient.focus();
        }

        return clients.openWindow(targetUrl);
      }),
  );
});
