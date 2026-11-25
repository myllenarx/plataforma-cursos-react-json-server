import type { Curso } from './catalog';
export type Matricula = {
  ID_Matricula: number;
  ID_Usuario: number;
  ID_Curso: number;
  DataMatricula: string;
  DataConclusao: string | null;
  curso: Curso;
};
