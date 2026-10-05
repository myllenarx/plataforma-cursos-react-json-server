import api from "./api"

export type Progresso = {
  idUsuario: string
  idAula: string
  dataConclusao: string | null
  status: string
}

export type CreateProgressoData = {
  idUsuario: string
  idAula: string
  dataConclusao?: string | null
  status: string
}

type ProgressoBackend = {
  ID_Usuario: number
  ID_Aula: number
  DataConclusao: string | null
  Status: string
}

function converterProgresso(
  progresso: ProgressoBackend
): Progresso {
  return {
    idUsuario: String(progresso.ID_Usuario),
    idAula: String(progresso.ID_Aula),
    dataConclusao: progresso.DataConclusao,
    status: progresso.Status,
  }
}

export const getProgressos = async () => {
  const response =
    await api.get<ProgressoBackend[]>("/progressos")

  return {
    ...response,
    data: response.data.map(converterProgresso),
  }
}

export const createProgresso = async (
  data: CreateProgressoData
) => {
  const response =
    await api.post<ProgressoBackend>(
      "/progressos",
      {
        ID_Usuario: Number(data.idUsuario),
        ID_Aula: Number(data.idAula),
        DataConclusao:
          data.dataConclusao ?? null,
        Status: data.status,
      }
    )

  return {
    ...response,
    data: converterProgresso(response.data),
  }
}

export const deleteProgresso = (
  idUsuario: string,
  idAula: string
) =>
  api.delete(
    `/progressos/${idUsuario}/${idAula}`
  )