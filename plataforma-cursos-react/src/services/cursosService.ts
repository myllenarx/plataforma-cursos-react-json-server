import api from "./api"

export const getCursos = () => api.get("/cursos")

export const createCurso = (data: any) => api.post("/cursos", data)

export const updateCurso = (id: number, data: any) =>
  api.put(`/cursos/${id}`, data)

export const deleteCurso = (id: number) =>
  api.delete(`/cursos/${id}`)