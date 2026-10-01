import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';

@Injectable()
export class AvaliacaoService {
  constructor(private prisma: PrismaService) {}

  create(createAvaliacaoDto: CreateAvaliacaoDto) {
    return this.prisma.avaliacao.create({
      data: createAvaliacaoDto,
    });
  }

  findAll() {
    return this.prisma.avaliacao.findMany({
      include: {
        usuario: true,
        curso: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.avaliacao.findUnique({
      where: {
        ID_Avaliacao: id,
      },
      include: {
        usuario: true,
        curso: true,
      },
    });
  }

  update(id: number, updateAvaliacaoDto: UpdateAvaliacaoDto) {
    return this.prisma.avaliacao.update({
      where: {
        ID_Avaliacao: id,
      },
      data: updateAvaliacaoDto,
    });
  }

  remove(id: number) {
    return this.prisma.avaliacao.delete({
      where: {
        ID_Avaliacao: id,
      },
    });
  }
}
