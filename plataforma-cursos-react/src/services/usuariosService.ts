import api from "./api"

export type PerfilUsuario =
  | "ALUNO"
  | "PROFESSOR"
  | "ADMIN"

export type Usuario = {
  id: string
  nome: string
  email: string
  perfil: PerfilUsuario
}

export type CreateUsuarioData = {
  nome: string
  email: string
  password: string
  perfil: PerfilUsuario
}

export type UpdateUsuarioData = {
  nome?: string
  email?: string
  password?: string
  perfil?: PerfilUsuario
}

type UsuarioBackend = {
  ID_Usuario: number
  name: string
  email: string
  perfil: PerfilUsuario
}

function converterUsuario(
  usuario: UsuarioBackend
): Usuario {
  return {
    id: String(usuario.ID_Usuario),
    nome: usuario.name,
    email: usuario.email,
    perfil: usuario.perfil,
  }
}

export const getUsuarios = async () => {
  const response =
    await api.get<UsuarioBackend[]>("/users")

  return {
    ...response,
    data: response.data.map(converterUsuario),
  }
}

export const createUsuario = async (
  data: CreateUsuarioData
) => {
  const response =
    await api.post<UsuarioBackend>(
      "/users/admin",
      {
        name: data.nome,
        email: data.email,
        password: data.password,
        perfil: data.perfil,
      }
    )

  return {
    ...response,
    data: converterUsuario(response.data),
  }
}

export const updateUsuario = async (
  id: string,
  data: UpdateUsuarioData
) => {
  const dadosBackend: Record<
    string,
    unknown
  > = {}

  if (data.nome !== undefined) {
    dadosBackend.name = data.nome
  }

  if (data.email !== undefined) {
    dadosBackend.email = data.email
  }

  if (
    data.password !== undefined &&
    data.password !== ""
  ) {
    dadosBackend.password = data.password
  }

  if (data.perfil !== undefined) {
    dadosBackend.perfil = data.perfil
  }

  const response =
    await api.patch<UsuarioBackend>(
      `/users/${id}`,
      dadosBackend
    )

  return {
    ...response,
    data: converterUsuario(response.data),
  }
}

export const deleteUsuario = (
  id: string
) => api.delete(`/users/${id}`)