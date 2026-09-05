import api from "./api"

export const getCursos = () =>
  api.get("/cursos")

export const createCurso = (data: any) =>
  api.post("/cursos", data)

export const updateCurso = (
  id: string,
  data: any
) =>
  api.put(`/cursos/${id}`, data)

export const deleteCurso = (id: string) =>
  api.delete(`/cursos/${id}`)