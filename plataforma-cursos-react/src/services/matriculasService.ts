import api from "./api"

export type Matricula = {
  id: string
  idUsuario: string
  idCurso: string
  dataMatricula: string
  dataConclusao: string | null
}

export type CreateMatriculaData = {
  idUsuario: string
  idCurso: string
  dataConclusao?: string | null
}

export type UpdateMatriculaData = {
  dataConclusao?: string | null
}

type MatriculaBackend = {
  ID_Matricula: number
  ID_Usuario: number
  ID_Curso: number
  DataMatricula: string
  DataConclusao?: string | null
}

function converterMatricula(
  matricula: MatriculaBackend
): Matricula {
  return {
    id: String(matricula.ID_Matricula),
    idUsuario: String(matricula.ID_Usuario),
    idCurso: String(matricula.ID_Curso),
    dataMatricula: matricula.DataMatricula,
    dataConclusao: matricula.DataConclusao ?? null,
  }
}

export const getMatriculas = async () => {
  const response =
    await api.get<MatriculaBackend[]>("/matriculas")

  return {
    ...response,
    data: response.data.map(converterMatricula),
  }
}

export const createMatricula = async (
  data: CreateMatriculaData
) => {
  const response =
    await api.post<MatriculaBackend>("/matriculas", {
      ID_Usuario: Number(data.idUsuario),
      ID_Curso: Number(data.idCurso),
      DataConclusao: data.dataConclusao ?? undefined,
    })

  return {
    ...response,
    data: converterMatricula(response.data),
  }
}

export const updateMatricula = async (
  id: string,
  data: UpdateMatriculaData
) => {
  const response =
    await api.patch<MatriculaBackend>(
      `/matriculas/${id}`,
      {
        DataConclusao:
          data.dataConclusao ?? null,
      }
    )

  return {
    ...response,
    data: converterMatricula(response.data),
  }
}

export const deleteMatricula = (id: string) =>
  api.delete(`/matriculas/${id}`)