import api from "./api"

export type Avaliacao = {
    id: string
    idUsuario: string
    idCurso: string
    usuario: string
    curso: string
    nota: number
    comentario: string
    dataAvaliacao: string
}

export type CreateAvaliacaoData = {
    idUsuario: string
    idCurso: string
    nota: number
    comentario?: string
}

export type UpdateAvaliacaoData = {
    nota?: number
    comentario?: string
}

type AvaliacaoBackend = {
    ID_Avaliacao: number
    ID_Usuario: number
    ID_Curso: number
    Nota: number
    Comentario?: string | null
    DataAvaliacao: string
    usuario?: {
        name: string
    }
    curso?: {
        Titulo: string
    }
}

function converterAvaliacao(
    avaliacao: AvaliacaoBackend,
): Avaliacao {
    return {
        id: String(avaliacao.ID_Avaliacao),
        idUsuario: String(avaliacao.ID_Usuario),
        idCurso: String(avaliacao.ID_Curso),
        usuario:
            avaliacao.usuario?.name ?? "Usuário",
        curso:
            avaliacao.curso?.Titulo ?? "Curso",
        nota: avaliacao.Nota,
        comentario:
            avaliacao.Comentario ?? "",
        dataAvaliacao:
            avaliacao.DataAvaliacao,
    }
}

export const getAvaliacoes = async () => {
    const response =
        await api.get<AvaliacaoBackend[]>(
            "/avaliacoes",
        )

    return {
        ...response,
        data: response.data.map(
            converterAvaliacao,
        ),
    }
}

export const createAvaliacao = async (
    data: CreateAvaliacaoData,
) => {
    const response =
        await api.post<AvaliacaoBackend>(
            "/avaliacoes",
            {
                ID_Usuario: Number(data.idUsuario),
                ID_Curso: Number(data.idCurso),
                Nota: Number(data.nota),
                Comentario:
                    data.comentario?.trim() || undefined,
            },
        )

    return {
        ...response,
        data: converterAvaliacao(
            response.data,
        ),
    }
}

export const updateAvaliacao = async (
    id: string,
    data: UpdateAvaliacaoData,
) => {
    const dados: Record<string, unknown> = {}

    if (data.nota !== undefined) {
        dados.Nota = Number(data.nota)
    }

    if (data.comentario !== undefined) {
        dados.Comentario = data.comentario
    }

    const response =
        await api.patch<AvaliacaoBackend>(
            `/avaliacoes/${id}`,
            dados,
        )

    return {
        ...response,
        data: converterAvaliacao(
            response.data,
        ),
    }
}

export const deleteAvaliacao = (
    id: string,
) => api.delete(`/avaliacoes/${id}`)