import api from "./api"

export type TrilhaCurso = {
    idTrilha: string
    idCurso: string
    ordem: number
}

type TrilhaCursoBackend = {
    ID_Trilha: number
    ID_Curso: number
    Ordem: number
}

function converterTrilhaCurso(
    item: TrilhaCursoBackend
): TrilhaCurso {
    return {
        idTrilha: String(item.ID_Trilha),
        idCurso: String(item.ID_Curso),
        ordem: item.Ordem,
    }
}

export const getTrilhasCursos = async () => {
    const response =
        await api.get<TrilhaCursoBackend[]>(
            "/trilhas-cursos"
        )

    return {
        ...response,
        data: response.data.map(
            converterTrilhaCurso
        ),
    }
}

export const createTrilhaCurso = async (
    idTrilha: string,
    idCurso: string,
    ordem: number
) => {
    const response =
        await api.post<TrilhaCursoBackend>(
            "/trilhas-cursos",
            {
                ID_Trilha: Number(idTrilha),
                ID_Curso: Number(idCurso),
                Ordem: ordem,
            }
        )

    return {
        ...response,
        data: converterTrilhaCurso(
            response.data
        ),
    }
}

export const updateTrilhaCurso = async (
    idTrilha: string,
    idCurso: string,
    ordem: number
) => {
    const response =
        await api.patch<TrilhaCursoBackend>(
            `/trilhas-cursos/${idTrilha}/${idCurso}`,
            {
                Ordem: ordem,
            }
        )

    return {
        ...response,
        data: converterTrilhaCurso(
            response.data
        ),
    }
}

export const deleteTrilhaCurso = (
    idTrilha: string,
    idCurso: string
) =>
    api.delete(
        `/trilhas-cursos/${idTrilha}/${idCurso}`
    )