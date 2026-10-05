import api from "./api"

export type Plano = {
    id: string
    nome: string
    descricao: string
    preco: number
    duracaoMeses: number
}

export type CreatePlanoData = {
    nome: string
    descricao?: string
    preco: number
    duracaoMeses: number
}

type PlanoBackend = {
    ID_Plano: number
    Nome: string
    Descricao?: string | null
    Preco: number | string
    DuracaoMeses: number
}

function converterPlano(plano: PlanoBackend): Plano {
    return {
        id: String(plano.ID_Plano),
        nome: plano.Nome,
        descricao: plano.Descricao ?? "",
        preco: Number(plano.Preco),
        duracaoMeses: plano.DuracaoMeses,
    }
}

export const getPlanos = async () => {
    const response =
        await api.get<PlanoBackend[]>("/planos")

    return {
        ...response,
        data: response.data.map(converterPlano),
    }
}

export const createPlano = async (
    data: CreatePlanoData,
) => {
    const response = await api.post<PlanoBackend>(
        "/planos",
        {
            Nome: data.nome,
            Descricao: data.descricao,
            Preco: Number(data.preco),
            DuracaoMeses: Number(data.duracaoMeses),
        },
    )

    return {
        ...response,
        data: converterPlano(response.data),
    }
}

export const updatePlano = async (
    id: string,
    data: Partial<CreatePlanoData>,
) => {
    const dados: Record<string, unknown> = {}

    if (data.nome !== undefined) {
        dados.Nome = data.nome
    }

    if (data.descricao !== undefined) {
        dados.Descricao = data.descricao
    }

    if (data.preco !== undefined) {
        dados.Preco = Number(data.preco)
    }

    if (data.duracaoMeses !== undefined) {
        dados.DuracaoMeses = Number(data.duracaoMeses)
    }

    const response = await api.patch<PlanoBackend>(
        `/planos/${id}`,
        dados,
    )

    return {
        ...response,
        data: converterPlano(response.data),
    }
}

export const deletePlano = (id: string) =>
    api.delete(`/planos/${id}`)