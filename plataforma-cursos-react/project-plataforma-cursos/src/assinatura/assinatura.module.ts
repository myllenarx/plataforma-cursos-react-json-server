import { Module } from '@nestjs/common';
import { AssinaturaService } from './assinatura.service';
import { AssinaturaController } from './assinatura.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AssinaturaController],
  providers: [AssinaturaService],
})
export class AssinaturaModule {}
