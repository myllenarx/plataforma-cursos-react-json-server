import api from "./api"

export type Trilha = {
  id: string
  titulo: string
  descricao: string
  cursos: string[]
}

export const getTrilhas = () =>
  api.get<Trilha[]>("/trilhas")

export const createTrilha = (
  data: Omit<Trilha, "id">
) =>
  api.post<Trilha>("/trilhas", data)

export const updateTrilha = (
  id: string,
  data: Partial<Trilha>
) =>
  api.patch<Trilha>(
    `/trilhas/${id}`,
    data
  )

export const deleteTrilha = (
  id: string
) =>
  api.delete(`/trilhas/${id}`)