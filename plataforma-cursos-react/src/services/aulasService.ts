import api from "./api"

export type TipoConteudo =
    | "VIDEO"
    | "TEXTO"
    | "QUIZ"

export type CreateAulaData = {
    idModulo: string
    titulo: string
    tipoConteudo: TipoConteudo
    urlConteudo?: string
    duracaoMinutos?: number
    ordem: number
}

export type UpdateAulaData = {
    titulo?: string
    tipoConteudo?: TipoConteudo
    urlConteudo?: string
    duracaoMinutos?: number
    ordem?: number
}

export const createAula = (
    data: CreateAulaData
) =>
    api.post("/aulas", {
        ID_Modulo: Number(data.idModulo),
        Titulo: data.titulo,
        TipoConteudo: data.tipoConteudo,
        URL_Conteudo:
            data.urlConteudo || undefined,
        DuracaoMinutos:
            data.duracaoMinutos,
        Ordem: data.ordem,
    })

export const updateAula = (
    id: string,
    data: UpdateAulaData
) => {
    const dadosBackend: Record<
        string,
        unknown
    > = {}

    if (data.titulo !== undefined) {
        dadosBackend.Titulo = data.titulo
    }

    if (data.tipoConteudo !== undefined) {
        dadosBackend.TipoConteudo =
            data.tipoConteudo
    }

    if (data.urlConteudo !== undefined) {
        dadosBackend.URL_Conteudo =
            data.urlConteudo || undefined
    }

    if (
        data.duracaoMinutos !== undefined
    ) {
        dadosBackend.DuracaoMinutos =
            data.duracaoMinutos
    }

    if (data.ordem !== undefined) {
        dadosBackend.Ordem = data.ordem
    }

    return api.patch(
        `/aulas/${id}`,
        dadosBackend
    )
}

export const deleteAula = (
    id: string
) =>
    api.delete(`/aulas/${id}`)                                                                                                                                                          