export type Aula = { ID_Aula: number; ID_Modulo: number; Titulo: string; TipoConteudo: 'VIDEO' | 'TEXTO' | 'QUIZ'; URL_Conteudo: string | null; DuracaoMinutos: number | null; Ordem: number };
export type Modulo = { ID_Modulo: number; ID_Curso: number; Titulo: string; Ordem: number; aulas: Aula[] };
export type Curso = { ID_Curso: number; Titulo: string; Descricao: string | null; Nivel: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO'; TotalAulas: number; TotalHoras: string | number; categoria?: { Nome: string }; instrutor?: { name: string }; modulos: Modulo[] };
export type Trilha = { ID_Trilha: number; Titulo: string; Descricao: string | null; categoria?: { Nome: string }; cursos: { ID_Curso: number; Ordem: number; curso: Curso }[] };
