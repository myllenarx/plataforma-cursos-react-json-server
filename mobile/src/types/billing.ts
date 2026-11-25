export type Plano = { ID_Plano: number; Nome: string; Descricao?: string | null; Preco: string | number; DuracaoMeses: number };
export type Pagamento = { ID_Pagamento: number; ID_Assinatura: number; ValorPago: string | number; DataPagamento: string; MetodoPagamento: 'PIX' | 'CARTAO' | 'BOLETO'; Id_Transacao_Gateway: string };
export type Assinatura = { ID_Assinatura: number; ID_Usuario: number; ID_Plano: number; DataInicio: string; DataFim: string; plano: Plano; pagamentos: Pagamento[] };
