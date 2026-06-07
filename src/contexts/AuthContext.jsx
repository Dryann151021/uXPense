'use client';

import { createContext } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  userId: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});
