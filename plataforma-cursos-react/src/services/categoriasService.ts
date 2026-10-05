import api from "./api"

export type Categoria = {
  id: string
  nome: string
  descricao?: string
}

type CategoriaBackend = {
  ID_Categoria: number
  Nome: string
  Descricao?: string | null
}

function converterCategoria(categoria: CategoriaBackend): Categoria {
  return {
    id: String(categoria.ID_Categoria),
    nome: categoria.Nome,
    descricao: categoria.Descricao ?? ""
  }
}

export const getCategorias = async () => {
  const response = await api.get<CategoriaBackend[]>("/categorias")

  return {
    ...response,
    data: response.data.map(converterCategoria)
  }
}

export const createCategoria = async (
  data: Omit<Categoria, "id">
) => {
  const response = await api.post<CategoriaBackend>("/categorias", {
    Nome: data.nome,
    Descricao: data.descricao
  })

  return {
    ...response,
    data: converterCategoria(response.data)
  }
}

export const updateCategoria = async (
  id: string,
  data: Partial<Categoria>
) => {
  const dadosBackend: {
    Nome?: string
    Descricao?: string
  } = {}

  if (data.nome !== undefined) {
    dadosBackend.Nome = data.nome
  }

  if (data.descricao !== undefined) {
    dadosBackend.Descricao = data.descricao
  }

  const response = await api.patch<CategoriaBackend>(
    `/categorias/${id}`,
    dadosBackend
  )

  return {
    ...response,
    data: converterCategoria(response.data)
  }
}

export const deleteCategoria = (id: string) =>
  api.delete(`/categorias/${id}`)