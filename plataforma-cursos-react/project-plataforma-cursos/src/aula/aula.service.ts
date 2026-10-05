import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { PerfilUsuario } from '../generated/prisma/enums';

type UsuarioAutenticado = {
  usuarioId: number;
  email: string;
  perfil: PerfilUsuario;
};

@Injectable()
export class AulaService {
  constructor(private prisma: PrismaService) { }

  async create(
    createAulaDto: CreateAulaDto,
    usuario: UsuarioAutenticado,
  ) {
    const modulo = await this.prisma.modulo.findUnique({
      where: { ID_Modulo: createAulaDto.ID_Modulo },
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
        'Você não tem permissão para criar aulas neste módulo',
      );
    }

    return this.prisma.aula.create({
      data: createAulaDto,
    });
  }

  findAll() {
    return this.prisma.aula.findMany({
      include: {
        modulo: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.aula.findUnique({
      where: { ID_Aula: id },
      include: {
        modulo: true,
        progresso: true,
      },
    });
  }

  async update(
    id: number,
    updateAulaDto: UpdateAulaDto,
    usuario: UsuarioAutenticado,
  ) {
    const aula = await this.prisma.aula.findUnique({
      where: { ID_Aula: id },
      include: {
        modulo: {
          include: {
            curso: true,
          },
        },
      },
    });

    if (!aula) {
      throw new NotFoundException('Aula não encontrada');
    }

    if (
      usuario.perfil === PerfilUsuario.PROFESSOR &&
      aula.modulo.curso.ID_Instrutor !== usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para alterar esta aula',
      );
    }

    if (
      usuario.perfil === PerfilUsuario.PROFESSOR &&
      updateAulaDto.ID_Modulo !== undefined
    ) {
      const novoModulo = await this.prisma.modulo.findUnique({
        where: { ID_Modulo: updateAulaDto.ID_Modulo },
        include: { curso: true },
      });

      if (!novoModulo) {
        throw new NotFoundException('Módulo não encontrado');
      }

      if (novoModulo.curso.ID_Instrutor !== usuario.usuarioId) {
        throw new ForbiddenException(
          'Você não pode mover a aula para um módulo de outro professor',
        );
      }
    }

    return this.prisma.aula.update({
      where: { ID_Aula: id },
      data: updateAulaDto,
    });
  }

  async remove(id: number, usuario: UsuarioAutenticado) {
    const aula = await this.prisma.aula.findUnique({
      where: { ID_Aula: id },
      include: {
        modulo: {
          include: {
            curso: true,
          },
        },
      },
    });

    if (!aula) {
      throw new NotFoundException('Aula não encontrada');
    }

    if (
      usuario.perfil === PerfilUsuario.PROFESSOR &&
      aula.modulo.curso.ID_Instrutor !== usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para remover esta aula',
      );
    }

    return this.prisma.aula.delete({
      where: { ID_Aula: id },
    });
  }
}