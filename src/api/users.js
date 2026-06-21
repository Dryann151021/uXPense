import client from './client.js';

export const usersApi = {
  getMe: async () => {
    const response = await client.get('/users');
    return response.data.data;
  },

  getAll: async () => {
    const response = await client.get('/users');
    return response.data.data;
  },

  getById: async (id) => {
    const response = await client.get(`/users/${id}`);
    return response.data.data;
  },

  getStreak: async (id) => {
    const response = await client.get(`/users/${id}/streak`);
    return response.data.data.streak;
  },
};
