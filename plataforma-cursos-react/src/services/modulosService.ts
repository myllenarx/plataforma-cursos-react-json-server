import api from "./api"

export type CreateModuloData = {
    idCurso: string
    titulo: string
    ordem: number
}

export type UpdateModuloData = {
    titulo?: string
    ordem?: number
}

export const createModulo = (
    data: CreateModuloData
) =>
    api.post("/modulos", {
        ID_Curso: Number(data.idCurso),
        Titulo: data.titulo,
        Ordem: data.ordem,
    })

export const updateModulo = (
    id: string,
    data: UpdateModuloData
) => {
    const dadosBackend: Record<
        string,
        unknown
    > = {}

    if (data.titulo !== undefined) {
        dadosBackend.Titulo = data.titulo
    }

    if (data.ordem !== undefined) {
        dadosBackend.Ordem = data.ordem
    }

    return api.patch(
        `/modulos/${id}`,
        dadosBackend
    )
}

export const deleteModulo = (
    id: string
) =>
    api.delete(`/modulos/${id}`)