import { apiRequest } from './api';
import type { Curso, Trilha } from '../types/catalog';
export const catalogApi = {
  cursos: (token: string) => apiRequest<Curso[]>('/cursos', { token }),
  curso: (token: string, id: number) => apiRequest<Curso | null>(`/cursos/${id}`, { token }),
  trilhas: (token: string) => apiRequest<Trilha[]>('/trilha', { token }),
  trilha: (token: string, id: number) => apiRequest<Trilha>(`/trilha/${id}`, { token }),
};
