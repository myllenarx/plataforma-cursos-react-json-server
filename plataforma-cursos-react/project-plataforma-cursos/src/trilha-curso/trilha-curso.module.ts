import { Module } from '@nestjs/common';
import { TrilhaCursoService } from './trilha-curso.service';
import { TrilhaCursoController } from './trilha-curso.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrilhaCursoController],
  providers: [TrilhaCursoService],
})
export class TrilhaCursoModule {}
