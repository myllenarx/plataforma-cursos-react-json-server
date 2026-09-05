import api from "./api"

export type Categoria = {
  id: string
  nome: string
  descricao?: string
}

export const getCategorias = () =>
  api.get<Categoria[]>("/categorias")

export const createCategoria = (
  data: Omit<Categoria, "id">
) =>
  api.post<Categoria>("/categorias", data)

export const updateCategoria = (
  id: string,
  data: Partial<Categoria>
) =>
  api.patch<Categoria>(
    `/categorias/${id}`,
    data
  )

export const deleteCategoria = (
  id: string
) =>
  api.delete(`/categorias/${id}`)