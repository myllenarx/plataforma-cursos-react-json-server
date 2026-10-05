import api from "./api"

export type CursoTrilha = {
  idCurso: string
  nomeCurso: string
  ordem: number
}

export type Trilha = {
  id: string
  titulo: string
  descricao: string
  idCategoria: string
  nomeCategoria: string
  cursos: CursoTrilha[]
}

export type CreateTrilhaData = {
  titulo: string
  descricao?: string
  idCategoria: string
}

export type UpdateTrilhaData =
  Partial<CreateTrilhaData>

type TrilhaBackend = {
  ID_Trilha: number
  Titulo: string
  Descricao?: string | null
  ID_Categoria: number

  categoria?: {
    ID_Categoria: number
    Nome: string
  }

  cursos?: {
    ID_Trilha: number
    ID_Curso: number
    Ordem: number

    curso: {
      ID_Curso: number
      Titulo: string
    }
  }[]
}

function converterTrilha(
  trilha: TrilhaBackend
): Trilha {
  return {
    id: String(trilha.ID_Trilha),
    titulo: trilha.Titulo,
    descricao: trilha.Descricao ?? "",
    idCategoria: String(
      trilha.ID_Categoria
    ),
    nomeCategoria:
      trilha.categoria?.Nome ??
      "Categoria não encontrada",

    cursos:
      trilha.cursos
        ?.map((item) => ({
          idCurso: String(
            item.ID_Curso
          ),
          nomeCurso:
            item.curso?.Titulo ??
            "Curso não encontrado",
          ordem: item.Ordem,
        }))
        .sort(
          (a, b) => a.ordem - b.ordem
        ) ?? [],
  }
}

function converterDadosTrilha(
  data:
    | CreateTrilhaData
    | UpdateTrilhaData
) {
  const resultado: Record<
    string,
    unknown
  > = {}

  if (data.titulo !== undefined) {
    resultado.Titulo = data.titulo
  }

  if (data.descricao !== undefined) {
    resultado.Descricao =
      data.descricao
  }

  if (data.idCategoria !== undefined) {
    resultado.ID_Categoria = Number(
      data.idCategoria
    )
  }

  return resultado
}

export const getTrilhas = async () => {
  const response =
    await api.get<TrilhaBackend[]>(
      "/trilha"
    )

  return {
    ...response,
    data: response.data.map(
      converterTrilha
    ),
  }
}

export const createTrilha = async (
  data: CreateTrilhaData
) => {
  const response =
    await api.post<TrilhaBackend>(
      "/trilha",
      converterDadosTrilha(data)
    )

  return {
    ...response,
    data: converterTrilha(
      response.data
    ),
  }
}

export const updateTrilha = async (
  id: string,
  data: UpdateTrilhaData
) => {
  const response =
    await api.patch<TrilhaBackend>(
      `/trilha/${id}`,
      converterDadosTrilha(data)
    )

  return {
    ...response,
    data: converterTrilha(
      response.data
    ),
  }
}

export const deleteTrilha = (
  id: string
) => api.delete(`/trilha/${id}`)