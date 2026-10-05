import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { PerfilUsuario } from '../generated/prisma/enums';

type UsuarioAutenticado = {
  usuarioId: number;
  email: string;
  perfil: PerfilUsuario;
};

@Injectable()
export class CursoService {
  constructor(private prisma: PrismaService) { }

  create(
    createCursoDto: CreateCursoDto,
    usuario: UsuarioAutenticado,
  ) {
    const ID_Instrutor =
      usuario.perfil === PerfilUsuario.PROFESSOR
        ? usuario.usuarioId
        : createCursoDto.ID_Instrutor;

    return this.prisma.curso.create({
      data: {
        ...createCursoDto,
        ID_Instrutor,
      },
      include: {
        instrutor: {
          select: {
            ID_Usuario: true,
            name: true,
            email: true,
            perfil: true,
            date: true,
          },
        },
        categoria: true,
        modulos: {
          orderBy: {
            Ordem: 'asc',
          },
          include: {
            aulas: {
              orderBy: {
                Ordem: 'asc',
              },
            },
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.curso.findMany({
      include: {
        instrutor: {
          select: {
            ID_Usuario: true,
            name: true,
            email: true,
            perfil: true,
            date: true,
          },
        },
        categoria: true,
        modulos: {
          orderBy: {
            Ordem: 'asc',
          },
          include: {
            aulas: {
              orderBy: {
                Ordem: 'asc',
              },
            },
          },
        },
      },
      orderBy: {
        ID_Curso: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.curso.findUnique({
      where: {
        ID_Curso: id,
      },
      include: {
        instrutor: {
          select: {
            ID_Usuario: true,
            name: true,
            email: true,
            perfil: true,
            date: true,
          },
        },
        categoria: true,
        modulos: {
          orderBy: {
            Ordem: 'asc',
          },
          include: {
            aulas: {
              orderBy: {
                Ordem: 'asc',
              },
            },
          },
        },
      },
    });
  }

  async update(
    id: number,
    updateCursoDto: UpdateCursoDto,
    usuario: UsuarioAutenticado,
  ) {
    const curso = await this.prisma.curso.findUnique({
      where: {
        ID_Curso: id,
      },
    });

    if (!curso) {
      throw new NotFoundException('Curso não encontrado');
    }

    if (
      usuario.perfil === PerfilUsuario.PROFESSOR &&
      curso.ID_Instrutor !== usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para alterar este curso',
      );
    }

    const dadosAtualizacao = {
      ...updateCursoDto,
    };

    if (usuario.perfil === PerfilUsuario.PROFESSOR) {
      dadosAtualizacao.ID_Instrutor =
        usuario.usuarioId;
    }

    return this.prisma.curso.update({
      where: {
        ID_Curso: id,
      },
      data: dadosAtualizacao,
      include: {
        instrutor: {
          select: {
            ID_Usuario: true,
            name: true,
            email: true,
            perfil: true,
            date: true,
          },
        },
        categoria: true,
        modulos: {
          orderBy: {
            Ordem: 'asc',
          },
          include: {
            aulas: {
              orderBy: {
                Ordem: 'asc',
              },
            },
          },
        },
      },
    });
  }

  async remove(
    id: number,
    usuario: UsuarioAutenticado,
  ) {
    const curso = await this.prisma.curso.findUnique({
      where: {
        ID_Curso: id,
      },
    });

    if (!curso) {
      throw new NotFoundException('Curso não encontrado');
    }

    if (
      usuario.perfil === PerfilUsuario.PROFESSOR &&
      curso.ID_Instrutor !== usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para remover este curso',
      );
    }

    return this.prisma.curso.delete({
      where: {
        ID_Curso: id,
      },
    });
  }
}