
import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

export interface EventoBoasVindas {
    usuarioId: number;
    nome: string;
    email: string;
    mensagem: string;
}

@Injectable()
export class KafkaService
    implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(KafkaService.name);

    private readonly kafka = new Kafka({
        clientId: 'plataforma-cursos-api',
        brokers: ['localhost:9092'],
    });

    private readonly producer: Producer =
        this.kafka.producer();

    async onModuleInit(): Promise<void> {
        await this.producer.connect();
        this.logger.log('Produtor Kafka conectado');
    }

    async publicarBoasVindas(
        evento: EventoBoasVindas,
    ): Promise<void> {
        await this.producer.send({
            topic: 'usuario.boas-vindas',
            messages: [
                {
                    key: String(evento.usuarioId),
                    value: JSON.stringify(evento),
                },
            ],
        });

        this.logger.log(
            `Evento de boas-vindas publicado para o usuário ${evento.usuarioId}`,
        );
    }

    async onModuleDestroy(): Promise<void> {
        await this.producer.disconnect();
    }
}
