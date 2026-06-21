'use client';

import { useState, useCallback, useEffect } from 'react';
import { AuthContext } from './AuthContext.jsx';
import { authApi } from '../api/auth.js';
import { usersApi } from '../api/users.js';
import { decodeJwtPayload } from '../utils/auth.js';
import { readStorageItem, writeStorageItem, removeStorageItem } from '../utils/storage.js';

const initialAccessToken = readStorageItem('accessToken', null);
const initialRefreshToken = readStorageItem('refreshToken', null);
const initialToken =
  initialAccessToken && initialRefreshToken
    ? { accessToken: initialAccessToken, refreshToken: initialRefreshToken }
    : null;
const initialUser = (() => {
  if (!initialAccessToken) return null;
  const payload = decodeJwtPayload(initialAccessToken);
  return payload ? { id: payload.id } : null;
})();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(initialToken);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch full user profile after initial load if user id is available
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id && !user?.username) {
        try {
          const res = await usersApi.getById(user.id);
          const profile = res.user || res;
          setUser((prev) => ({
            ...prev,
            username: profile.username,
            fullname: profile.fullname,
          }));
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
        }
      }
    };
    fetchUserProfile();
  }, [user?.id, user?.username]);

  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const { accessToken, refreshToken } = await authApi.login(
        username,
        password,
      );

      writeStorageItem('accessToken', accessToken);
      writeStorageItem('refreshToken', refreshToken);

      const payload = decodeJwtPayload(accessToken);
      setToken({ accessToken, refreshToken });

      // Set basic user from payload, full profile will be fetched by useEffect
      const basicUser = payload ? { id: payload.id } : { username };
      setUser(basicUser);

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Login gagal';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username, fullname, password) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.register(username, fullname, password);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Register gagal';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const refreshToken = readStorageItem('refreshToken', null);
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      removeStorageItem('accessToken');
      removeStorageItem('refreshToken');
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
