import axios from 'axios';
import { readStorageItem, writeStorageItem, removeStorageItem } from '../utils/storage.js';

const BASE_URL = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan access token
client.interceptors.request.use(
  (config) => {
    const token = readStorageItem('accessToken', null);
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor untuk handle refresh token jika expired
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = readStorageItem('refreshToken', null);
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.put(`${BASE_URL}/authentications`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;
        writeStorageItem('accessToken', accessToken);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        removeStorageItem('accessToken');
        removeStorageItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default client;
