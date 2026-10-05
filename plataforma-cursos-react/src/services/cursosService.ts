import api from "./api"

export type NivelCurso =
  | "INICIANTE"
  | "INTERMEDIARIO"
  | "AVANCADO"

export type TipoConteudo =
  | "VIDEO"
  | "TEXTO"
  | "QUIZ"

export type Aula = {
  id: string
  titulo: string
  tipoConteudo: TipoConteudo
  urlConteudo: string
  duracaoMinutos: number | null
  ordem: number
}

export type Modulo = {
  id: string
  titulo: string
  ordem: number
  aulas: Aula[]
}

export type Curso = {
  id: string
  nome: string
  descricao: string
  idInstrutor: string
  nomeInstrutor: string
  idCategoria: string | null
  nivel: NivelCurso
  dataPublicacao: string | null
  totalAulas: number
  totalHoras: number
  modulos: Modulo[]
}

export type CreateCursoData = {
  nome: string
  descricao?: string
  idInstrutor: string
  idCategoria: string
  nivel: NivelCurso
  dataPublicacao?: string | null
  totalAulas: number
  totalHoras: number
}

export type UpdateCursoData =
  Partial<CreateCursoData>

type AulaBackend = {
  ID_Aula: number
  ID_Modulo: number
  Titulo: string
  TipoConteudo: TipoConteudo
  URL_Conteudo?: string | null
  DuracaoMinutos?: number | null
  Ordem: number
}

type ModuloBackend = {
  ID_Modulo: number
  ID_Curso: number
  Titulo: string
  Ordem: number
  aulas?: AulaBackend[]
}

type CursoBackend = {
  ID_Curso: number
  Titulo: string
  Descricao?: string | null
  ID_Instrutor: number
  ID_Categoria: number
  Nivel: NivelCurso
  DataPublicacao?: string | null
  TotalAulas: number
  TotalHoras: number | string

  instrutor?: {
    ID_Usuario: number
    name: string
  }

  modulos?: ModuloBackend[]
}

function converterCurso(
  curso: CursoBackend
): Curso {
  return {
    id: String(curso.ID_Curso),
    nome: curso.Titulo,
    descricao: curso.Descricao ?? "",
    idInstrutor: String(curso.ID_Instrutor),
    nomeInstrutor:
      curso.instrutor?.name ?? "Instrutor",
    idCategoria: String(curso.ID_Categoria),
    nivel: curso.Nivel,
    dataPublicacao:
      curso.DataPublicacao ?? null,
    totalAulas: curso.TotalAulas,
    totalHoras: Number(curso.TotalHoras),

    modulos:
      curso.modulos?.map((modulo) => ({
        id: String(modulo.ID_Modulo),
        titulo: modulo.Titulo,
        ordem: modulo.Ordem,

        aulas:
          modulo.aulas?.map((aula) => ({
            id: String(aula.ID_Aula),
            titulo: aula.Titulo,
            tipoConteudo:
              aula.TipoConteudo,
            urlConteudo:
              aula.URL_Conteudo ?? "",
            duracaoMinutos:
              aula.DuracaoMinutos ?? null,
            ordem: aula.Ordem,
          })) ?? [],
      })) ?? [],
  }
}

function converterDadosCurso(
  data: CreateCursoData | UpdateCursoData
) {
  const resultado: Record<string, unknown> = {}

  if (data.nome !== undefined) {
    resultado.Titulo = data.nome
  }

  if (data.descricao !== undefined) {
    resultado.Descricao = data.descricao
  }

  if (data.idInstrutor !== undefined) {
    resultado.ID_Instrutor =
      Number(data.idInstrutor)
  }

  if (data.idCategoria !== undefined) {
    resultado.ID_Categoria =
      Number(data.idCategoria)
  }

  if (data.nivel !== undefined) {
    resultado.Nivel = data.nivel
  }

  if (data.dataPublicacao !== undefined) {
    resultado.DataPublicacao =
      data.dataPublicacao || undefined
  }

  if (data.totalAulas !== undefined) {
    resultado.TotalAulas =
      Number(data.totalAulas)
  }

  if (data.totalHoras !== undefined) {
    resultado.TotalHoras =
      Number(data.totalHoras)
  }

  return resultado
}

export const getCursos = async () => {
  const response =
    await api.get<CursoBackend[]>("/cursos")

  return {
    ...response,
    data: response.data.map(converterCurso),
  }
}

export const createCurso = async (
  data: CreateCursoData
) => {
  const response =
    await api.post<CursoBackend>(
      "/cursos",
      converterDadosCurso(data)
    )

  return {
    ...response,
    data: converterCurso(response.data),
  }
}

export const updateCurso = async (
  id: string,
  data: UpdateCursoData
) => {
  const response =
    await api.patch<CursoBackend>(
      `/cursos/${id}`,
      converterDadosCurso(data)
    )

  return {
    ...response,
    data: converterCurso(response.data),
  }
}

export const deleteCurso = (
  id: string
) =>
  api.delete(`/cursos/${id}`)