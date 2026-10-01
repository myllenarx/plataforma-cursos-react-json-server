import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

@Injectable()
export class AulaService {
  constructor(private prisma: PrismaService) {}

  create(createAulaDto: CreateAulaDto) {
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

  update(id: number, updateAulaDto: UpdateAulaDto) {
    return this.prisma.aula.update({
      where: { ID_Aula: id },
      data: updateAulaDto,
    });
  }

  remove(id: number) {
    return this.prisma.aula.delete({
      where: { ID_Aula: id },
    });
  }
}
