import api from "./api"

export type Usuario = {
  id: string
  nome: string
  email: string
}

export const getUsuarios = () =>
  api.get<Usuario[]>("/usuarios")

export const createUsuario = (
  data: Omit<Usuario, "id">
) =>
  api.post<Usuario>("/usuarios", data)

export const updateUsuario = (
  id: string,
  data: Partial<Usuario>
) =>
  api.patch<Usuario>(
    `/usuarios/${id}`,
    data
  )

export const deleteUsuario = (id: string) =>
  api.delete(`/usuarios/${id}`)