import client from './client.js';

export const authApi = {
  login: async (username, password) => {
    const response = await client.post('/authentications', {
      username,
      password,
    });
    return response.data.data;
  },

  register: async (username, fullname, password) => {
    const response = await client.post('/users', {
      username,
      fullname,
      password,
    });
    return response.data.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await client.put('/authentications', {
      refreshToken,
    });
    return response.data.data;
  },

  logout: async (refreshToken) => {
    const response = await client.delete('/authentications', {
      data: { refreshToken },
    });
    return response.data;
  },
};
