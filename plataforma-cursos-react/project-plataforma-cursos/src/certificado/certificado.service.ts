import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';

@Injectable()
export class CertificadoService {
  constructor(private prisma: PrismaService) {}

  create(createCertificadoDto: CreateCertificadoDto) {
    return this.prisma.certificado.create({
      data: createCertificadoDto,
      include: {
        usuario: true,
        curso: true,
        trilha: true,
      },
    });
  }

  findAll() {
    return this.prisma.certificado.findMany({
      include: {
        usuario: true,
        curso: true,
        trilha: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.certificado.findUnique({
      where: {
        ID_Certificado: id,
      },
      include: {
        usuario: true,
        curso: true,
        trilha: true,
      },
    });
  }

  update(id: number, updateCertificadoDto: UpdateCertificadoDto) {
    return this.prisma.certificado.update({
      where: {
        ID_Certificado: id,
      },
      data: updateCertificadoDto,
      include: {
        usuario: true,
        curso: true,
        trilha: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.certificado.delete({
      where: {
        ID_Certificado: id,
      },
    });
  }
}
