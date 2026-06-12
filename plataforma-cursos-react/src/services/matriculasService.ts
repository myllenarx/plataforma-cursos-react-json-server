import api from "./api"

export const getMatriculas = () =>
  api.get("/matriculas")

export const createMatricula = (data: any) =>
  api.post("/matriculas", data)

export const deleteMatricula = (id: number) =>
  api.delete(`/matriculas/${id}`)