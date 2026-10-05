import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';
import { PerfilUsuario } from '../generated/prisma/enums';

type UsuarioAutenticado = {
  usuarioId: number;
  email: string;
  perfil: PerfilUsuario;
};

@Injectable()
export class ModuloService {
  constructor(private prisma: PrismaService) { }

  async create(
    createModuloDto: CreateModuloDto,
    usuario: UsuarioAutenticado,
  ) {
    const curso = await this.prisma.curso.findUnique({
      where: { ID_Curso: createModuloDto.ID_Curso },
    });

    if (!curso) {
      throw new NotFoundException('Curso não encontrado');
    }

    if (
      usuario.perfil === PerfilUsuario.PROFESSOR &&
      curso.ID_Instrutor !== usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para criar módulos neste curso',
      );
    }

    return this.prisma.modulo.create({
      data: createModuloDto,
    });
  }

  findAll() {
    return this.prisma.modulo.findMany({
      include: {
        curso: true,
        aulas: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.modulo.findUnique({
      where: { ID_Modulo: id },
      include: {
        curso: true,
        aulas: true,
      },
    });
  }

  async update(
    id: number,
    updateModuloDto: UpdateModuloDto,
    usuario: UsuarioAutenticado,
  ) {
    const modulo = await this.prisma.modulo.findUnique({
      where: { ID_Modulo: id },
      include: { curso: true },
    });

    if (!modulo) {
      throw new NotFoundException('Módulo não encontrado');
    }

    if (
      usuario.perfil === PerfilUsuario.PROFESSOR &&
      modulo.curso.ID_Instrutor !== usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para alterar este módulo',
      );
    }

    if (
      usuario.perfil === PerfilUsuario.PROFESSOR &&
      updateModuloDto.ID_Curso !== undefined
    ) {
      const novoCurso = await this.prisma.curso.findUnique({
        where: { ID_Curso: updateModuloDto.ID_Curso },
      });

      if (!novoCurso) {
        throw new NotFoundException('Curso não encontrado');
      }

      if (novoCurso.ID_Instrutor !== usuario.usuarioId) {
        throw new ForbiddenException(
          'Você não pode mover o módulo para um curso de outro professor',
        );
      }
    }

    return this.prisma.modulo.update({
      where: { ID_Modulo: id },
      data: updateModuloDto,
    });
  }

  async remove(id: number, usuario: UsuarioAutenticado) {
    const modulo = await this.prisma.modulo.findUnique({
      where: { ID_Modulo: id },
      include: { curso: true },
    });

    if (!modulo) {
      throw new NotFoundException('Módulo não encontrado');
    }

    if (
      usuario.perfil === PerfilUsuario.PROFESSOR &&
      modulo.curso.ID_Instrutor !== usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para remover este módulo',
      );
    }

    return this.prisma.modulo.delete({
      where: { ID_Modulo: id },
    });
  }
}