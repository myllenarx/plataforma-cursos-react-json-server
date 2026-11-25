import { apiRequest } from './api';

export async function login(email: string, password: string): Promise<string> {
  const result = await apiRequest<{ access_token: string }>('/auth/login', {
    method: 'POST', body: { email, password },
  });
  if (!result.access_token) throw new Error('A API não retornou o token de acesso.');
  return result.access_token;
}

export async function register(name: string, email: string, password: string): Promise<void> {
  await apiRequest('/users', { method: 'POST', body: { name, email, password } });
}
