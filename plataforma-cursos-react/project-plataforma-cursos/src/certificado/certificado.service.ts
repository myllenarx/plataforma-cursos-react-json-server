import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';
import { PerfilUsuario } from '../generated/prisma/enums';

type UsuarioAutenticado = {
  usuarioId: number;
  email: string;
  perfil: PerfilUsuario;
};

@Injectable()
export class CertificadoService {
  constructor(private prisma: PrismaService) { }

  private readonly usuarioPublico = {
    ID_Usuario: true,
    name: true,
    email: true,
    perfil: true,
    date: true,
  };

  private gerarCodigo() {
    return `CERT-${randomUUID()
      .replace(/-/g, '')
      .slice(0, 12)
      .toUpperCase()}`;
  }

  async create(
    dto: CreateCertificadoDto,
  ) {
    const matricula =
      await this.prisma.matricula.findFirst({
        where: {
          ID_Usuario: dto.ID_Usuario,
          ID_Curso: dto.ID_Curso,
        },
      });

    if (!matricula) {
      throw new BadRequestException(
        'O usuário não está matriculado neste curso',
      );
    }

    if (!matricula.DataConclusao) {
      throw new BadRequestException(
        'O curso ainda não foi concluído pelo usuário',
      );
    }

    const existente =
      await this.prisma.certificado.findFirst({
        where: {
          ID_Usuario: dto.ID_Usuario,
          ID_Curso: dto.ID_Curso,
        },
      });

    if (existente) {
      throw new ConflictException(
        'Já existe um certificado emitido para este usuário neste curso',
      );
    }

    if (dto.ID_Trilha) {
      const trilha =
        await this.prisma.trilha.findUnique({
          where: {
            ID_Trilha: dto.ID_Trilha,
          },
        });

      if (!trilha) {
        throw new NotFoundException(
          'Trilha não encontrada',
        );
      }
    }

    let codigo = this.gerarCodigo();

    while (
      await this.prisma.certificado.findUnique({
        where: {
          CodigoVerificacao: codigo,
        },
      })
    ) {
      codigo = this.gerarCodigo();
    }

    return this.prisma.certificado.create({
      data: {
        ID_Usuario: dto.ID_Usuario,
        ID_Curso: dto.ID_Curso,
        ID_Trilha: dto.ID_Trilha,
        CodigoVerificacao: codigo,
      },

      include: {
        usuario: {
          select: this.usuarioPublico,
        },
        curso: true,
        trilha: true,
      },
    });
  }

  findAll(
    usuario: UsuarioAutenticado,
  ) {
    return this.prisma.certificado.findMany({
      where:
        usuario.perfil === PerfilUsuario.ALUNO
          ? {
            ID_Usuario:
              usuario.usuarioId,
          }
          : undefined,

      include: {
        usuario: {
          select: this.usuarioPublico,
        },
        curso: true,
        trilha: true,
      },

      orderBy: {
        DataEmissao: 'desc',
      },
    });
  }

  async findOne(
    id: number,
    usuario: UsuarioAutenticado,
  ) {
    const certificado =
      await this.prisma.certificado.findUnique({
        where: {
          ID_Certificado: id,
        },

        include: {
          usuario: {
            select:
              this.usuarioPublico,
          },
          curso: true,
          trilha: true,
        },
      });

    if (!certificado) {
      throw new NotFoundException(
        'Certificado não encontrado',
      );
    }

    if (
      usuario.perfil ===
      PerfilUsuario.ALUNO &&
      certificado.ID_Usuario !==
      usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este certificado',
      );
    }

    return certificado;
  }

  async update(
    id: number,
    dto: UpdateCertificadoDto,
  ) {
    const certificado =
      await this.prisma.certificado.findUnique({
        where: {
          ID_Certificado: id,
        },
      });

    if (!certificado) {
      throw new NotFoundException(
        'Certificado não encontrado',
      );
    }

    return this.prisma.certificado.update({
      where: {
        ID_Certificado: id,
      },

      data: dto,

      include: {
        usuario: {
          select: this.usuarioPublico,
        },
        curso: true,
        trilha: true,
      },
    });
  }

  async remove(id: number) {
    const certificado =
      await this.prisma.certificado.findUnique({
        where: {
          ID_Certificado: id,
        },
      });

    if (!certificado) {
      throw new NotFoundException(
        'Certificado não encontrado',
      );
    }

    return this.prisma.certificado.delete({
      where: {
        ID_Certificado: id,
      },
    });
  }
}