import api from "./api"
import type { Plano } from "./planosService"

export type Assinatura = {
    id: string
    idUsuario: string
    idPlano: string
    dataInicio: string
    dataFim: string
    usuario: string
    plano: Plano | null
}

type AssinaturaBackend = {
    ID_Assinatura: number
    ID_Usuario: number
    ID_Plano: number
    DataInicio: string
    DataFim: string
    usuario?: {
        name: string
    }
    plano?: {
        ID_Plano: number
        Nome: string
        Descricao?: string | null
        Preco: number | string
        DuracaoMeses: number
    }
}

function converterAssinatura(
    assinatura: AssinaturaBackend,
): Assinatura {
    return {
        id: String(assinatura.ID_Assinatura),
        idUsuario: String(assinatura.ID_Usuario),
        idPlano: String(assinatura.ID_Plano),
        dataInicio: assinatura.DataInicio,
        dataFim: assinatura.DataFim,
        usuario: assinatura.usuario?.name ?? "Usuário",
        plano: assinatura.plano
            ? {
                id: String(assinatura.plano.ID_Plano),
                nome: assinatura.plano.Nome,
                descricao:
                    assinatura.plano.Descricao ?? "",
                preco: Number(assinatura.plano.Preco),
                duracaoMeses:
                    assinatura.plano.DuracaoMeses,
            }
            : null,
    }
}

export const getAssinaturas = async () => {
    const response =
        await api.get<AssinaturaBackend[]>(
            "/assinaturas",
        )

    return {
        ...response,
        data: response.data.map(converterAssinatura),
    }
}

export const createAssinatura = async (
    idUsuario: string,
    idPlano: string,
) => {
    const agora = new Date()

    const response =
        await api.post<AssinaturaBackend>(
            "/assinaturas",
            {
                ID_Usuario: Number(idUsuario),
                ID_Plano: Number(idPlano),

                // O backend é responsável pelo período real.
                // Estes campos permanecem porque o DTO atual os exige.
                DataInicio: agora.toISOString(),
                DataFim: agora.toISOString(),
            },
        )

    return {
        ...response,
        data: converterAssinatura(response.data),
    }
}

export const deleteAssinatura = (id: string) =>
    api.delete(`/assinaturas/${id}`)