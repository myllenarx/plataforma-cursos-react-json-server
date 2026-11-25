import { apiRequest } from './api';
import type { Matricula } from '../types/enrollment';

// O ID é extraído apenas para atender ao DTO; o servidor identifica o aluno
// pelo JWT e ignora o ID enviado pelo cliente quando o perfil é ALUNO.
export function usuarioIdDoToken(token: string): number {
  const part = token.split('.')[1];
  if (!part) throw new Error('Sessão inválida. Entre novamente.');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const input = part.replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, '');
  let bits = 0, buffer = 0, result = '';
  for (const char of input) {
    const digit = chars.indexOf(char);
    if (digit < 0) throw new Error('Token inválido. Entre novamente.');
    buffer = (buffer << 6) | digit;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      result += String.fromCharCode((buffer >> bits) & 255);
    }
  }
  try {
    const id = JSON.parse(result).sub;
    if (!Number.isInteger(id) || id <= 0) throw new Error();
    return id;
  } catch { throw new Error('Não foi possível identificar o usuário. Entre novamente.'); }
}

export const enrollmentApi = {
  minhas: (token: string) => apiRequest<Matricula[]>('/matriculas', { token }),
  matricular: (token: string, cursoId: number) => apiRequest<Matricula>('/matriculas', {
    token,
    method: 'POST',
    body: { ID_Usuario: usuarioIdDoToken(token), ID_Curso: cursoId },
  }),
};
