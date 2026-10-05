import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrilhaDto } from './dto/create-trilha.dto';
import { UpdateTrilhaDto } from './dto/update-trilha.dto';

@Injectable()
export class TrilhaService {
  constructor(private prisma: PrismaService) { }

  create(createTrilhaDto: CreateTrilhaDto) {
    return this.prisma.trilha.create({
      data: createTrilhaDto,
      include: {
        categoria: true,
        cursos: {
          orderBy: {
            Ordem: 'asc',
          },
          include: {
            curso: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.trilha.findMany({
      include: {
        categoria: true,
        cursos: {
          orderBy: {
            Ordem: 'asc',
          },
          include: {
            curso: true,
          },
        },
      },
      orderBy: {
        ID_Trilha: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const trilha = await this.prisma.trilha.findUnique({
      where: {
        ID_Trilha: id,
      },
      include: {
        categoria: true,
        cursos: {
          orderBy: {
            Ordem: 'asc',
          },
          include: {
            curso: true,
          },
        },
        certificados: true,
      },
    });

    if (!trilha) {
      throw new NotFoundException('Trilha não encontrada');
    }

    return trilha;
  }

  async update(
    id: number,
    updateTrilhaDto: UpdateTrilhaDto,
  ) {
    const trilha = await this.prisma.trilha.findUnique({
      where: {
        ID_Trilha: id,
      },
    });

    if (!trilha) {
      throw new NotFoundException('Trilha não encontrada');
    }

    return this.prisma.trilha.update({
      where: {
        ID_Trilha: id,
      },
      data: updateTrilhaDto,
      include: {
        categoria: true,
        cursos: {
          orderBy: {
            Ordem: 'asc',
          },
          include: {
            curso: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const trilha = await this.prisma.trilha.findUnique({
      where: {
        ID_Trilha: id,
      },
    });

    if (!trilha) {
      throw new NotFoundException('Trilha não encontrada');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.trilhaCurso.deleteMany({
        where: {
          ID_Trilha: id,
        },
      });

      return tx.trilha.delete({
        where: {
          ID_Trilha: id,
        },
      });
    });
  }
}