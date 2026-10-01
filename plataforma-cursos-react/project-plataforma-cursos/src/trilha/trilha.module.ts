import { Module } from '@nestjs/common';
import { TrilhaService } from './trilha.service';
import { TrilhaController } from './trilha.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrilhaController],
  providers: [TrilhaService],
})
export class TrilhaModule {}
