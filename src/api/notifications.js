import client from './client.js';

export const notificationsApi = {
  getVapidPublicKey: async () => {
    const response = await client.get('/notifications/vapid-public-key');
    return response.data.data.publicKey;
  },

  subscribe: async (subscription) => {
    const response = await client.post('/notifications/subscriptions', {
      subscription,
    });
    return response.data.data;
  },

  unsubscribe: async (endpoint) => {
    const response = await client.delete('/notifications/subscriptions', {
      data: { endpoint },
    });
    return response.data.data;
  },
};
