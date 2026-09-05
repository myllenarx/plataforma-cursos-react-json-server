import api from "./api"

export type Matricula = {
  id: string
  idUsuario: string
  idCurso: string
  dataMatricula: string
  dataConclusao?: string | null
}

export const getMatriculas = () =>
  api.get<Matricula[]>("/matriculas")

export const createMatricula = (
  data: Omit<Matricula, "id">
) =>
  api.post<Matricula>("/matriculas", data)

export const updateMatricula = (
  id: string,
  data: Partial<Matricula>
) =>
  api.patch<Matricula>(
    `/matriculas/${id}`,
    data
  )

export const deleteMatricula = (id: string) =>
  api.delete(`/matriculas/${id}`)