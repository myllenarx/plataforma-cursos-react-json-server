import api from "./api"

export type Aula = {
  id: string
  titulo: string
}

export type Modulo = {
  id: string
  titulo: string
  aulas: Aula[]
}

export type Curso = {
  id: string
  nome: string
  idCategoria: string | null
  modulos?: Modulo[]
}

export const getCursos = () =>
  api.get<Curso[]>("/cursos")

export const createCurso = (
  data: Omit<Curso, "id">
) =>
  api.post<Curso>("/cursos", data)

export const updateCurso = (
  id: string,
  data: Partial<Curso>
) =>
  api.patch<Curso>(
    `/cursos/${id}`,
    data
  )

export const deleteCurso = (
  id: string
) =>
  api.delete(`/cursos/${id}`)