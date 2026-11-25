import { apiRequest } from './api';
import { usuarioIdDoToken } from './enrollment';
import type { Plano, Assinatura, Pagamento } from '../types/billing';

export const billingApi = {
  planos: (token: string) => apiRequest<Plano[]>('/planos', { token }),
  assinaturas: (token: string) => apiRequest<Assinatura[]>('/assinaturas', { token }),
  pagamentos: (token: string) => apiRequest<Pagamento[]>('/pagamentos', { token }),
  assinar: (token: string, planoId: number) => apiRequest<Assinatura>('/assinaturas', {
    token, method: 'POST',
    body: { ID_Usuario: usuarioIdDoToken(token), ID_Plano: planoId, DataInicio: new Date().toISOString(), DataFim: new Date().toISOString() },
  }),
  registrarPagamento: (token: string, assinatura: Assinatura, metodo: Pagamento['MetodoPagamento']) => {
    const preco = Number(assinatura.plano.Preco);
    if (!Number.isFinite(preco) || preco < 0) throw new Error('Valor do plano inválido.');
    const id = `SIM-MOBILE-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    return apiRequest<Pagamento>('/pagamentos', {
      token, method: 'POST',
      body: {
        ID_Assinatura: assinatura.ID_Assinatura,
        ValorPago: preco,
        DataPagamento: new Date().toISOString(),
        MetodoPagamento: metodo,
        Id_Transacao_Gateway: id,
      },
    });
  },
};
