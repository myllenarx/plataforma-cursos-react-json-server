import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { PerfilUsuario } from '../generated/prisma/enums';

type UsuarioAutenticado = {
  usuarioId: number;
  email: string;
  perfil: PerfilUsuario;
};

@Injectable()
export class AvaliacaoService {
  constructor(private prisma: PrismaService) { }

  private readonly usuarioPublico = {
    ID_Usuario: true,
    name: true,
    email: true,
    perfil: true,
    date: true,
  };

  private readonly includeAvaliacao = {
    usuario: {
      select: this.usuarioPublico,
    },
    curso: {
      select: {
        ID_Curso: true,
        Titulo: true,
        Descricao: true,
        ID_Instrutor: true,
        ID_Categoria: true,
        Nivel: true,
        DataPublicacao: true,
        TotalAulas: true,
        TotalHoras: true,
      },
    },
  };

  async create(
    dto: CreateAvaliacaoDto,
    usuario: UsuarioAutenticado,
  ) {
    const ID_Usuario =
      usuario.perfil === PerfilUsuario.ALUNO
        ? usuario.usuarioId
        : dto.ID_Usuario;

    const curso = await this.prisma.curso.findUnique({
      where: {
        ID_Curso: dto.ID_Curso,
      },
    });

    if (!curso) {
      throw new NotFoundException('Curso não encontrado');
    }

    const matricula =
      await this.prisma.matricula.findFirst({
        where: {
          ID_Usuario,
          ID_Curso: dto.ID_Curso,
        },
      });

    if (!matricula) {
      throw new BadRequestException(
        'O usuário precisa estar matriculado no curso para avaliá-lo',
      );
    }

    const existente =
      await this.prisma.avaliacao.findFirst({
        where: {
          ID_Usuario,
          ID_Curso: dto.ID_Curso,
        },
      });

    if (existente) {
      throw new ConflictException(
        'Este curso já foi avaliado por este usuário',
      );
    }

    return this.prisma.avaliacao.create({
      data: {
        ID_Usuario,
        ID_Curso: dto.ID_Curso,
        Nota: dto.Nota,
        Comentario: dto.Comentario,
      },
      include: this.includeAvaliacao,
    });
  }

  findAll(usuario: UsuarioAutenticado) {
    let where = {};

    if (usuario.perfil === PerfilUsuario.ALUNO) {
      where = {
        ID_Usuario: usuario.usuarioId,
      };
    }

    if (
      usuario.perfil === PerfilUsuario.PROFESSOR
    ) {
      where = {
        curso: {
          ID_Instrutor: usuario.usuarioId,
        },
      };
    }

    return this.prisma.avaliacao.findMany({
      where,
      include: this.includeAvaliacao,
      orderBy: {
        DataAvaliacao: 'desc',
      },
    });
  }

  async findOne(
    id: number,
    usuario: UsuarioAutenticado,
  ) {
    const avaliacao =
      await this.prisma.avaliacao.findUnique({
        where: {
          ID_Avaliacao: id,
        },
        include: this.includeAvaliacao,
      });

    if (!avaliacao) {
      throw new NotFoundException(
        'Avaliação não encontrada',
      );
    }

    if (
      usuario.perfil === PerfilUsuario.ALUNO &&
      avaliacao.ID_Usuario !== usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta avaliação',
      );
    }

    if (
      usuario.perfil === PerfilUsuario.PROFESSOR &&
      avaliacao.curso.ID_Instrutor !==
      usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta avaliação',
      );
    }

    return avaliacao;
  }

  async update(
    id: number,
    dto: UpdateAvaliacaoDto,
    usuario: UsuarioAutenticado,
  ) {
    const avaliacao =
      await this.prisma.avaliacao.findUnique({
        where: {
          ID_Avaliacao: id,
        },
      });

    if (!avaliacao) {
      throw new NotFoundException(
        'Avaliação não encontrada',
      );
    }

    if (
      usuario.perfil === PerfilUsuario.ALUNO &&
      avaliacao.ID_Usuario !== usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para alterar esta avaliação',
      );
    }

    /*
     * A avaliação continua vinculada ao usuário
     * e ao curso originais.
     * No PATCH alteramos apenas nota/comentário.
     */
    return this.prisma.avaliacao.update({
      where: {
        ID_Avaliacao: id,
      },
      data: {
        ...(dto.Nota !== undefined
          ? { Nota: dto.Nota }
          : {}),
        ...(dto.Comentario !== undefined
          ? { Comentario: dto.Comentario }
          : {}),
      },
      include: this.includeAvaliacao,
    });
  }

  async remove(
    id: number,
    usuario: UsuarioAutenticado,
  ) {
    const avaliacao =
      await this.prisma.avaliacao.findUnique({
        where: {
          ID_Avaliacao: id,
        },
      });

    if (!avaliacao) {
      throw new NotFoundException(
        'Avaliação não encontrada',
      );
    }

    if (
      usuario.perfil === PerfilUsuario.ALUNO &&
      avaliacao.ID_Usuario !== usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para remover esta avaliação',
      );
    }

    return this.prisma.avaliacao.delete({
      where: {
        ID_Avaliacao: id,
      },
    });
  }
}