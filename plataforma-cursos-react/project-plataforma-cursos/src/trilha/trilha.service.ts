import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrilhaDto } from './dto/create-trilha.dto';
import { UpdateTrilhaDto } from './dto/update-trilha.dto';

@Injectable()
export class TrilhaService {
  constructor(private prisma: PrismaService) {}

  create(createTrilhaDto: CreateTrilhaDto) {
    return this.prisma.trilha.create({
      data: createTrilhaDto,
    });
  }

  findAll() {
    return this.prisma.trilha.findMany({
      include: {
        categoria: true,
        cursos: {
          include: {
            curso: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.trilha.findUnique({
      where: {
        ID_Trilha: id,
      },
      include: {
        categoria: true,
        cursos: {
          include: {
            curso: true,
          },
        },
        certificados: true,
      },
    });
  }

  update(id: number, updateTrilhaDto: UpdateTrilhaDto) {
    return this.prisma.trilha.update({
      where: {
        ID_Trilha: id,
      },
      data: updateTrilhaDto,
    });
  }

  remove(id: number) {
    return this.prisma.trilha.delete({
      where: {
        ID_Trilha: id,
      },
    });
  }
}
