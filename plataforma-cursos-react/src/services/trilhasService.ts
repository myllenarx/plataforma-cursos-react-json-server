import api from "./api"

export const getTrilhas = () =>
  api.get("/trilhas")

export const createTrilha = (data: any) =>
  api.post("/trilhas", data)

export const updateTrilha = (id: string, data: any) =>
  api.put(`/trilhas/${id}`, data)

export const deleteTrilha = (id: string) =>
  api.delete(`/trilhas/${id}`)