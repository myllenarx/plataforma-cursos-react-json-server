
import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import { PrismaService } from '../prisma/prisma.service';
import { EventoBoasVindas } from './kafka.service';

@Injectable()
export class KafkaConsumerService
    implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(
        KafkaConsumerService.name,
    );

    private readonly kafka = new Kafka({
        clientId: 'plataforma-cursos-consumer',
        brokers: ['localhost:9092'],
    });

    private readonly consumer: Consumer =
        this.kafka.consumer({
            groupId: 'plataforma-cursos-notificacoes',
        });

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async onModuleInit(): Promise<void> {
        await this.consumer.connect();

        await this.consumer.subscribe({
            topic: 'usuario.boas-vindas',
            fromBeginning: true,
        });

        await this.consumer.run({
            eachMessage: async ({ message }) => {
                if (!message.value) {
                    this.logger.warn('Mensagem Kafka vazia');
                    return;
                }

                const evento = JSON.parse(
                    message.value.toString(),
                ) as EventoBoasVindas;

                if (
                    !Number.isInteger(evento.usuarioId) ||
                    evento.usuarioId <= 0 ||
                    typeof evento.nome !== 'string' ||
                    typeof evento.mensagem !== 'string'
                ) {
                    throw new Error(
                        'Evento de boas-vindas inválido',
                    );
                }

                const eventoId =
                    `boas-vindas-${evento.usuarioId}`;

                await this.prisma.notificacao.upsert({
                    where: {
                        EventoId: eventoId,
                    },
                    update: {},
                    create: {
                        EventoId: eventoId,
                        ID_Usuario: evento.usuarioId,
                        Titulo: 'Boas-vindas!',
                        Mensagem: evento.mensagem,
                    },
                });

                this.logger.log(
                    `Notificação processada para o usuário ${evento.usuarioId}`,
                );
            },
        });

        this.logger.log('Consumidor Kafka iniciado');
    }

    async onModuleDestroy(): Promise<void> {
        await this.consumer.disconnect();
    }
}

 