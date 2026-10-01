import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';

@Injectable()
export class PagamentoService {
  constructor(private prisma: PrismaService) {}

  create(createPagamentoDto: CreatePagamentoDto) {
    return this.prisma.pagamento.create({
      data: createPagamentoDto,
      include: {
        assinatura: true,
      },
    });
  }

  findAll() {
    return this.prisma.pagamento.findMany({
      include: {
        assinatura: {
          include: {
            usuario: true,
            plano: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.pagamento.findUnique({
      where: {
        ID_Pagamento: id,
      },
      include: {
        assinatura: {
          include: {
            usuario: true,
            plano: true,
          },
        },
      },
    });
  }

  update(id: number, updatePagamentoDto: UpdatePagamentoDto) {
    return this.prisma.pagamento.update({
      where: {
        ID_Pagamento: id,
      },
      data: updatePagamentoDto,
      include: {
        assinatura: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.pagamento.delete({
      where: {
        ID_Pagamento: id,
      },
    });
  }
}
