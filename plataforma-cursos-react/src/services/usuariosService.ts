import api from "./api"

export const getUsuarios = () => api.get("/usuarios")

export const createUsuario = (data: any) =>
  api.post("/usuarios", data)

export const updateUsuario = (id: number, data: any) =>
  api.put(`/usuarios/${id}`, data)

export const deleteUsuario = (id: number) =>
  api.delete(`/usuarios/${id}`)