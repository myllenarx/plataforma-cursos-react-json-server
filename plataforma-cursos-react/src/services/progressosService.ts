import api from "./api"

export type Progresso = {
  id: string
  idUsuario: string
  idCurso: string
  idAula: string
  dataConclusao: string
}

export const getProgressos = () =>
  api.get<Progresso[]>("/progressos")

export const createProgresso = (
  data: Omit<Progresso, "id">
) =>
  api.post<Progresso>("/progressos", data)

export const deleteProgresso = (id: string) =>
  api.delete(`/progressos/${id}`)