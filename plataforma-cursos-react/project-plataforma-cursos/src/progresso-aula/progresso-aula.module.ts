import { Module } from '@nestjs/common';
import { ProgressoAulaService } from './progresso-aula.service';
import { ProgressoAulaController } from './progresso-aula.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProgressoAulaController],
  providers: [ProgressoAulaService],
})
export class ProgressoAulaModule {}
