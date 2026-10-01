import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgressoAulaDto } from './dto/create-progresso-aula.dto';
import { UpdateProgressoAulaDto } from './dto/update-progresso-aula.dto';

@Injectable()
export class ProgressoAulaService {
  constructor(private prisma: PrismaService) {}

  create(createProgressoAulaDto: CreateProgressoAulaDto) {
    return this.prisma.progressoAula.create({
      data: createProgressoAulaDto,
    });
  }

  findAll() {
    return this.prisma.progressoAula.findMany({
      include: {
        usuario: true,
        aula: true,
      },
    });
  }

  findOne(idUsuario: number, idAula: number) {
    return this.prisma.progressoAula.findUnique({
      where: {
        ID_Usuario_ID_Aula: {
          ID_Usuario: idUsuario,
          ID_Aula: idAula,
        },
      },
      include: {
        usuario: true,
        aula: true,
      },
    });
  }

  update(
    idUsuario: number,
    idAula: number,
    updateProgressoAulaDto: UpdateProgressoAulaDto,
  ) {
    return this.prisma.progressoAula.update({
      where: {
        ID_Usuario_ID_Aula: {
          ID_Usuario: idUsuario,
          ID_Aula: idAula,
        },
      },
      data: updateProgressoAulaDto,
    });
  }

  remove(idUsuario: number, idAula: number) {
    return this.prisma.progressoAula.delete({
      where: {
        ID_Usuario_ID_Aula: {
          ID_Usuario: idUsuario,
          ID_Aula: idAula,
        },
      },
    });
  }
}
