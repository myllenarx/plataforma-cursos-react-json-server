import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';

@Injectable()
export class AssinaturaService {
  constructor(private prisma: PrismaService) {}

  create(createAssinaturaDto: CreateAssinaturaDto) {
    return this.prisma.assinatura.create({
      data: createAssinaturaDto,
      include: {
        usuario: true,
        plano: true,
      },
    });
  }

  findAll() {
    return this.prisma.assinatura.findMany({
      include: {
        usuario: true,
        plano: true,
        pagamentos: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.assinatura.findUnique({
      where: {
        ID_Assinatura: id,
      },
      include: {
        usuario: true,
        plano: true,
        pagamentos: true,
      },
    });
  }

  update(id: number, updateAssinaturaDto: UpdateAssinaturaDto) {
    return this.prisma.assinatura.update({
      where: {
        ID_Assinatura: id,
      },
      data: updateAssinaturaDto,
      include: {
        usuario: true,
        plano: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.assinatura.delete({
      where: {
        ID_Assinatura: id,
      },
    });
  }
}
