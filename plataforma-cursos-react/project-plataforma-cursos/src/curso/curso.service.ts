import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursoService {
  constructor(private prisma: PrismaService) {}

  create(createCursoDto: CreateCursoDto) {
    return this.prisma.curso.create({
      data: createCursoDto,
    });
  }

  findAll() {
    return this.prisma.curso.findMany({
      include: {
        instrutor: true,
        categoria: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.curso.findUnique({
      where: { ID_Curso: id },
      include: {
        instrutor: true,
        categoria: true,
        modulos: true,
      },
    });
  }

  update(id: number, updateCursoDto: UpdateCursoDto) {
    return this.prisma.curso.update({
      where: { ID_Curso: id },
      data: updateCursoDto,
    });
  }

  remove(id: number) {
    return this.prisma.curso.delete({
      where: { ID_Curso: id },
    });
  }
}
