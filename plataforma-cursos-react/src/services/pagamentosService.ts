import api from "./api"

export type MetodoPagamento =
    | "PIX"
    | "CARTAO"
    | "BOLETO"

export type Pagamento = {
    id: string
    idAssinatura: string
    valorPago: number
    dataPagamento: string
    metodoPagamento: MetodoPagamento
    idTransacao: string
}

type PagamentoBackend = {
    ID_Pagamento: number
    ID_Assinatura: number
    ValorPago: number | string
    DataPagamento: string
    MetodoPagamento: MetodoPagamento
    Id_Transacao_Gateway: string
}

function converterPagamento(
    pagamento: PagamentoBackend,
): Pagamento {
    return {
        id: String(pagamento.ID_Pagamento),
        idAssinatura: String(
            pagamento.ID_Assinatura,
        ),
        valorPago: Number(pagamento.ValorPago),
        dataPagamento: pagamento.DataPagamento,
        metodoPagamento: pagamento.MetodoPagamento,
        idTransacao:
            pagamento.Id_Transacao_Gateway,
    }
}

export const getPagamentos = async () => {
    const response =
        await api.get<PagamentoBackend[]>(
            "/pagamentos",
        )

    return {
        ...response,
        data: response.data.map(converterPagamento),
    }
}

export const createPagamento = async (
    idAssinatura: string,
    valor: number,
    metodo: MetodoPagamento,
) => {
    const codigo = `SIM-${Date.now()}`

    const response =
        await api.post<PagamentoBackend>(
            "/pagamentos",
            {
                ID_Assinatura: Number(idAssinatura),
                ValorPago: Number(valor),
                DataPagamento: new Date().toISOString(),
                MetodoPagamento: metodo,
                Id_Transacao_Gateway: codigo,
            },
        )

    return {
        ...response,
        data: converterPagamento(response.data),
    }
}

export const deletePagamento = (id: string) =>
    api.delete(`/pagamentos/${id}`)