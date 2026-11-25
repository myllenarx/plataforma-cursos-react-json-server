import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as loginApi } from '../services/auth';

const KEY = 'plataforma_cursos_token';

type AuthState = {
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    SecureStore.getItemAsync(KEY)
      .then(saved => { if (active) setToken(saved); })
      .catch(() => { if (active) setToken(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function signIn(email: string, password: string) {
    const nextToken = await loginApi(email, password);
    await SecureStore.setItemAsync(KEY, nextToken);
    setToken(nextToken);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync(KEY);
    setToken(null);
  }

  return <AuthContext.Provider value={{ token, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
