'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext.jsx';
import { authApi } from '../api/auth.js';
import { decodeJwtPayload } from '../utils/auth.js';
import { getCookie, setCookie, deleteCookie } from '../utils/cookies.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');

    if (accessToken && refreshToken) {
      setToken({ accessToken, refreshToken });
      const payload = decodeJwtPayload(accessToken);
      if (payload) {
        setUser({ id: payload.id });
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const { accessToken, refreshToken } = await authApi.login(
        username,
        password,
      );

      setCookie('accessToken', accessToken, {
        maxAge: 60 * 60,
        path: '/',
        sameSite: 'lax',
        secure: window.location.protocol === 'https:',
      });
      setCookie('refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: 'lax',
        secure: window.location.protocol === 'https:',
      });

      const payload = decodeJwtPayload(accessToken);
      setToken({ accessToken, refreshToken });
      setUser(payload ? { id: payload.id } : { username });

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
      const refreshToken = getCookie('refreshToken');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
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
