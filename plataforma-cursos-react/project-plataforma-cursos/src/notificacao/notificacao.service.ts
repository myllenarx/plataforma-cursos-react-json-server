
import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificacaoService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async listarPorUsuario(usuarioId: number) {
        return this.prisma.notificacao.findMany({
            where: {
                ID_Usuario: usuarioId,
            },
            orderBy: {
                DataCriacao: 'desc',
            },
        });
    }

    async marcarComoLida(
        notificacaoId: number,
        usuarioId: number,
    ) {
        const resultado =
            await this.prisma.notificacao.updateMany({
                where: {
                    ID_Notificacao: notificacaoId,
                    ID_Usuario: usuarioId,
                },
                data: {
                    Lida: true,
                },
            });

        if (resultado.count === 0) {
            throw new NotFoundException(
                'Notificação não encontrada.',
            );
        }

        return this.prisma.notificacao.findFirst({
            where: {
                ID_Notificacao: notificacaoId,
                ID_Usuario: usuarioId,
            },
        });
    }
}
