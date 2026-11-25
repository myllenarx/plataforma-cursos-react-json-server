
import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { KafkaService } from './kafka.service';
import { KafkaConsumerService } from './kafka-consumer.service';

@Global()
@Module({
    imports: [PrismaModule],
    providers: [
        KafkaService,
        KafkaConsumerService,
    ],
    exports: [KafkaService],
})
export class KafkaModule { }
