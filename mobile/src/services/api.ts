const baseURL = process.env.EXPO_PUBLIC_API_URL;

export type ApiError = Error & { status?: number };

export async function apiRequest<T>(
  path: string,
  options: { method?: 'GET' | 'POST' | 'PATCH'; body?: unknown; token?: string } = {},
): Promise<T> {
  if (!baseURL) {
    throw new Error('Configure EXPO_PUBLIC_API_URL no arquivo mobile/.env');
  }

  let response: Response;
  try {
    response = await fetch(`${baseURL.replace(/\/$/, '')}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
    });
  } catch {
    throw new Error('Não foi possível acessar a API. Confira o endereço e a rede Wi-Fi.');
  }

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data && typeof data === 'object' && 'message' in data
      ? (data as { message: unknown }).message : undefined;
    const error = new Error(Array.isArray(message) ? message.join('; ') : typeof message === 'string' ? message : `Erro HTTP ${response.status}`) as ApiError;
    error.status = response.status;
    throw error;
  }
  return data as T;
}
