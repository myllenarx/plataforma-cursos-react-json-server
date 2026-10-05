import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';
import { PerfilUsuario } from '../generated/prisma/enums';

type UsuarioAutenticado = {
  usuarioId: number;
  email: string;
  perfil: PerfilUsuario;
};

@Injectable()
export class AssinaturaService {
  constructor(private prisma: PrismaService) { }

  private readonly usuarioPublico = {
    ID_Usuario: true,
    name: true,
    email: true,
    perfil: true,
    date: true,
  };

  async create(
    createAssinaturaDto: CreateAssinaturaDto,
    usuario: UsuarioAutenticado,
  ) {
    const ID_Usuario =
      usuario.perfil === PerfilUsuario.ALUNO
        ? usuario.usuarioId
        : createAssinaturaDto.ID_Usuario;

    const plano = await this.prisma.plano.findUnique({
      where: {
        ID_Plano: createAssinaturaDto.ID_Plano,
      },
    });

    if (!plano) {
      throw new NotFoundException('Plano não encontrado');
    }

    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: {
        ID_Usuario,
      },
    });

    if (!usuarioExistente) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const assinaturaAtiva = await this.prisma.assinatura.findFirst({
      where: {
        ID_Usuario,
        DataFim: {
          gte: new Date(),
        },
      },
    });

    if (assinaturaAtiva) {
      throw new ConflictException(
        'O usuário já possui uma assinatura ativa',
      );
    }

    const dataInicio = new Date();

    if (Number.isNaN(dataInicio.getTime())) {
      throw new BadRequestException('Data de início inválida');
    }

    const dataFim = new Date(dataInicio);
    dataFim.setMonth(
      dataFim.getMonth() + plano.DuracaoMeses,
    );

    return this.prisma.assinatura.create({
      data: {
        ID_Usuario,
        ID_Plano: plano.ID_Plano,
        DataInicio: dataInicio,
        DataFim: dataFim,
      },
      include: {
        usuario: {
          select: this.usuarioPublico,
        },
        plano: true,
        pagamentos: true,
      },
    });
  }

  findAll(usuario: UsuarioAutenticado) {
    return this.prisma.assinatura.findMany({
      where:
        usuario.perfil === PerfilUsuario.ALUNO
          ? {
            ID_Usuario: usuario.usuarioId,
          }
          : undefined,
      include: {
        usuario: {
          select: this.usuarioPublico,
        },
        plano: true,
        pagamentos: true,
      },
      orderBy: {
        DataInicio: 'desc',
      },
    });
  }

  async findOne(
    id: number,
    usuario: UsuarioAutenticado,
  ) {
    const assinatura =
      await this.prisma.assinatura.findUnique({
        where: {
          ID_Assinatura: id,
        },
        include: {
          usuario: {
            select: this.usuarioPublico,
          },
          plano: true,
          pagamentos: true,
        },
      });

    if (!assinatura) {
      throw new NotFoundException(
        'Assinatura não encontrada',
      );
    }

    if (
      usuario.perfil === PerfilUsuario.ALUNO &&
      assinatura.ID_Usuario !== usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta assinatura',
      );
    }

    return assinatura;
  }

  async update(
    id: number,
    updateAssinaturaDto: UpdateAssinaturaDto,
  ) {
    const assinatura =
      await this.prisma.assinatura.findUnique({
        where: {
          ID_Assinatura: id,
        },
      });

    if (!assinatura) {
      throw new NotFoundException(
        'Assinatura não encontrada',
      );
    }

    return this.prisma.assinatura.update({
      where: {
        ID_Assinatura: id,
      },
      data: updateAssinaturaDto,
      include: {
        usuario: {
          select: this.usuarioPublico,
        },
        plano: true,
        pagamentos: true,
      },
    });
  }

  async remove(id: number) {
    const assinatura =
      await this.prisma.assinatura.findUnique({
        where: {
          ID_Assinatura: id,
        },
        include: {
          pagamentos: true,
        },
      });

    if (!assinatura) {
      throw new NotFoundException(
        'Assinatura não encontrada',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.pagamento.deleteMany({
        where: {
          ID_Assinatura: id,
        },
      });

      return tx.assinatura.delete({
        where: {
          ID_Assinatura: id,
        },
      });
    });
  }
}