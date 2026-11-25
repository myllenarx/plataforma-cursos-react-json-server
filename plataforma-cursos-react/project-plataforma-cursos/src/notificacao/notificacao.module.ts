
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificacaoController } from './notificacao.controller';
import { NotificacaoService } from './notificacao.service';

@Module({
    imports: [PrismaModule],
    controllers: [NotificacaoController],
    providers: [NotificacaoService],
})
export class NotificacaoModule { }
