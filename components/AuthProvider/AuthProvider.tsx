// components/AuthProvider/AuthProvider.tsx
'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { User } from '@/types/user';
import * as clientApi from '@/lib/api/clientApi';

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export const AuthProvider = ({ children, initialUser }: AuthProviderProps) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    } else {
      clientApi
        .checkSession()
        .then(() => {
          return clientApi.getMe();
        })
        .then((user) => {
          if (user) {
            setUser(user);
          } else {
            clearAuth();
          }
        })
        .catch(() => {
          clearAuth();
        });
    }
  }, [initialUser, setUser, clearAuth]);

  return <>{children}</>;
};