import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
import { PerfilUsuario } from '../generated/prisma/enums';

type UsuarioAutenticado = {
  usuarioId: number;
  email: string;
  perfil: PerfilUsuario;
};

@Injectable()
export class PagamentoService {
  constructor(private prisma: PrismaService) { }

  async create(
    createPagamentoDto: CreatePagamentoDto,
    usuario: UsuarioAutenticado,
  ) {
    const assinatura = await this.prisma.assinatura.findUnique({
      where: {
        ID_Assinatura: createPagamentoDto.ID_Assinatura,
      },
    });

    if (!assinatura) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    if (
      usuario.perfil === PerfilUsuario.ALUNO &&
      assinatura.ID_Usuario !== usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não pode registrar pagamento para esta assinatura',
      );
    }

    return this.prisma.pagamento.create({
      data: createPagamentoDto,
      include: {
        assinatura: true,
      },
    });
  }

  findAll(usuario: UsuarioAutenticado) {
    return this.prisma.pagamento.findMany({
      where:
        usuario.perfil === PerfilUsuario.ALUNO
          ? {
            assinatura: {
              ID_Usuario: usuario.usuarioId,
            },
          }
          : undefined,
      include: {
        assinatura: {
          include: {
            usuario: {
              select: {
                ID_Usuario: true,
                name: true,
                email: true,
                perfil: true,
                date: true,
              },
            },
            plano: true,
          },
        },
      },
    });
  }

  async findOne(id: number, usuario: UsuarioAutenticado) {
    const pagamento = await this.prisma.pagamento.findUnique({
      where: {
        ID_Pagamento: id,
      },
      include: {
        assinatura: {
          include: {
            usuario: {
              select: {
                ID_Usuario: true,
                name: true,
                email: true,
                perfil: true,
                date: true,
              },
            },
            plano: true,
          },
        },
      },
    });

    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    if (
      usuario.perfil === PerfilUsuario.ALUNO &&
      pagamento.assinatura.ID_Usuario !== usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este pagamento',
      );
    }

    return pagamento;
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