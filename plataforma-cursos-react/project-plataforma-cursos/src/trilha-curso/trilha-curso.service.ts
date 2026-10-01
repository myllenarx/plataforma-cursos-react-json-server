import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrilhaCursoDto } from './dto/create-trilha-curso.dto';
import { UpdateTrilhaCursoDto } from './dto/update-trilha-curso.dto';

@Injectable()
export class TrilhaCursoService {
  constructor(private prisma: PrismaService) {}

  create(createTrilhaCursoDto: CreateTrilhaCursoDto) {
    return this.prisma.trilhaCurso.create({
      data: createTrilhaCursoDto,
    });
  }

  findAll() {
    return this.prisma.trilhaCurso.findMany({
      include: {
        trilha: true,
        curso: true,
      },
    });
  }

  findOne(idTrilha: number, idCurso: number) {
    return this.prisma.trilhaCurso.findUnique({
      where: {
        ID_Trilha_ID_Curso: {
          ID_Trilha: idTrilha,
          ID_Curso: idCurso,
        },
      },
      include: {
        trilha: true,
        curso: true,
      },
    });
  }

  update(
    idTrilha: number,
    idCurso: number,
    updateTrilhaCursoDto: UpdateTrilhaCursoDto,
  ) {
    return this.prisma.trilhaCurso.update({
      where: {
        ID_Trilha_ID_Curso: {
          ID_Trilha: idTrilha,
          ID_Curso: idCurso,
        },
      },
      data: updateTrilhaCursoDto,
    });
  }

  remove(idTrilha: number, idCurso: number) {
    return this.prisma.trilhaCurso.delete({
      where: {
        ID_Trilha_ID_Curso: {
          ID_Trilha: idTrilha,
          ID_Curso: idCurso,
        },
      },
    });
  }
}
