
import { apiRequest } from './api';

export type Notification = {
    ID_Notificacao: number;
    ID_Usuario: number;
    EventoId: string;
    Titulo: string;
    Mensagem: string;
    Lida: boolean;
    DataCriacao: string;
};

export async function getNotifications(
    token: string,
): Promise<Notification[]> {
    return apiRequest<Notification[]>('/notificacoes', {
        method: 'GET',
        token,
    });
}

export async function markNotificationAsRead(
    notificationId: number,
    token: string,
): Promise<Notification> {
    return apiRequest<Notification>(
        `/notificacoes/${notificationId}/lida`,
        {
            method: 'PATCH',
            token,
        },
    );
}
