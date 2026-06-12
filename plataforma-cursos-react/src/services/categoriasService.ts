import api from "./api"

export const getCategorias = () => api.get("/categorias")

export const createCategoria = (data: any) =>
  api.post("/categorias", data)

export const updateCategoria = (id: number, data: any) =>
  api.put(`/categorias/${id}`, data)

export const deleteCategoria = (id: number) =>
  api.delete(`/categorias/${id}`)