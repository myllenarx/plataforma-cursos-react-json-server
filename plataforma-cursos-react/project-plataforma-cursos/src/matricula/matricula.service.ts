import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { PerfilUsuario } from '../generated/prisma/enums';

type UsuarioAutenticado = {
  usuarioId: number;
  email: string;
  perfil: PerfilUsuario;
};

@Injectable()
export class MatriculaService {
  constructor(private prisma: PrismaService) { }

  private readonly usuarioPublico = {
    ID_Usuario: true,
    name: true,
    email: true,
    perfil: true,
    date: true,
  };

  async create(
    dto: CreateMatriculaDto,
    usuario: UsuarioAutenticado,
  ) {
    const ID_Usuario =
      usuario.perfil ===
        PerfilUsuario.ALUNO
        ? usuario.usuarioId
        : dto.ID_Usuario;

    const existente =
      await this.prisma.matricula.findFirst({
        where: {
          ID_Usuario,
          ID_Curso: dto.ID_Curso,
        },
      });

    if (existente) {
      throw new ConflictException(
        'O usuário já está matriculado neste curso',
      );
    }

    const curso =
      await this.prisma.curso.findUnique({
        where: {
          ID_Curso: dto.ID_Curso,
        },
      });

    if (!curso) {
      throw new NotFoundException(
        'Curso não encontrado',
      );
    }

    const usuarioExiste =
      await this.prisma.usuario.findUnique({
        where: {
          ID_Usuario,
        },
      });

    if (!usuarioExiste) {
      throw new NotFoundException(
        'Usuário não encontrado',
      );
    }

    return this.prisma.matricula.create({
      data: {
        ID_Usuario,
        ID_Curso: dto.ID_Curso,
      },

      include: {
        usuario: {
          select: this.usuarioPublico,
        },

        curso: true,
      },
    });
  }

  findAll(
    usuario: UsuarioAutenticado,
  ) {
    return this.prisma.matricula.findMany({
      where:
        usuario.perfil ===
          PerfilUsuario.ALUNO
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
      },

      orderBy: {
        DataMatricula: 'desc',
      },
    });
  }

  async findOne(
    id: number,
    usuario: UsuarioAutenticado,
  ) {
    const matricula =
      await this.prisma.matricula.findUnique({
        where: {
          ID_Matricula: id,
        },

        include: {
          usuario: {
            select:
              this.usuarioPublico,
          },

          curso: true,
        },
      });

    if (!matricula) {
      throw new NotFoundException(
        'Matrícula não encontrada',
      );
    }

    if (
      usuario.perfil ===
      PerfilUsuario.ALUNO &&
      matricula.ID_Usuario !==
      usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta matrícula',
      );
    }

    return matricula;
  }

  async update(
    id: number,
    dto: UpdateMatriculaDto,
  ) {
    const matricula =
      await this.prisma.matricula.findUnique({
        where: {
          ID_Matricula: id,
        },
      });

    if (!matricula) {
      throw new NotFoundException(
        'Matrícula não encontrada',
      );
    }

    return this.prisma.matricula.update({
      where: {
        ID_Matricula: id,
      },

      data: dto,

      include: {
        usuario: {
          select: this.usuarioPublico,
        },

        curso: true,
      },
    });
  }

  async remove(id: number) {
    const matricula =
      await this.prisma.matricula.findUnique({
        where: {
          ID_Matricula: id,
        },
      });

    if (!matricula) {
      throw new NotFoundException(
        'Matrícula não encontrada',
      );
    }

    return this.prisma.matricula.delete({
      where: {
        ID_Matricula: id,
      },
    });
  }
}