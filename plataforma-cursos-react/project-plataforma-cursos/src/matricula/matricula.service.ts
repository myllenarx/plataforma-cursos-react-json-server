import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';

@Injectable()
export class MatriculaService {
  constructor(private prisma: PrismaService) {}

  create(createMatriculaDto: CreateMatriculaDto) {
    return this.prisma.matricula.create({
      data: createMatriculaDto,
    });
  }

  findAll() {
    return this.prisma.matricula.findMany({
      include: {
        usuario: true,
        curso: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.matricula.findUnique({
      where: { ID_Matricula: id },
      include: {
        usuario: true,
        curso: true,
      },
    });
  }

  update(id: number, updateMatriculaDto: UpdateMatriculaDto) {
    return this.prisma.matricula.update({
      where: { ID_Matricula: id },
      data: updateMatriculaDto,
    });
  }

  remove(id: number) {
    return this.prisma.matricula.delete({
      where: { ID_Matricula: id },
    });
  }
}
