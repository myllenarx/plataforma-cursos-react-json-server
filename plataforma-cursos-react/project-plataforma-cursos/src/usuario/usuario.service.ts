import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PerfilUsuario } from '../generated/prisma/enums';

import { Logger } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
@Injectable()
export class UsuarioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kafkaService: KafkaService,
  ) { }

  private readonly logger = new Logger(UsuarioService.name);

  private readonly dadosPublicos = {
    ID_Usuario: true,
    name: true,
    email: true,
    perfil: true,
    date: true,
  };


  async create(
    createUsuarioDto: CreateUsuarioDto,
    perfilPermitido: PerfilUsuario = PerfilUsuario.ALUNO,
  ) {
    const existente = await this.prisma.usuario.findUnique({
      where: {
        email: createUsuarioDto.email,
      },
    });

    if (existente) {
      throw new ConflictException(
        'Já existe um usuário cadastrado com este e-mail',
      );
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(
      createUsuarioDto.password,
      salt,
    );

    const usuario = await this.prisma.usuario.create({
      data: {
        name: createUsuarioDto.name,
        email: createUsuarioDto.email,
        password: hash,
        perfil: perfilPermitido,
      },
      select: this.dadosPublicos,
    });

    if (usuario.perfil === PerfilUsuario.ALUNO) {
      try {
        await this.kafkaService.publicarBoasVindas({
          usuarioId: usuario.ID_Usuario,
          nome: usuario.name,
          email: usuario.email,
          mensagem: `Bem-vindo(a) à Plataforma de Cursos, ${usuario.name}!`,
        });
      } catch (error) {
        this.logger.error(
          `Falha ao publicar boas-vindas para o usuário ${usuario.ID_Usuario}`,
          error instanceof Error ? error.stack : String(error),
        );
      }
    }

    return usuario;
  }


  async createByAdmin(createUsuarioDto: CreateUsuarioDto) {
    return this.create(
      createUsuarioDto,
      createUsuarioDto.perfil ?? PerfilUsuario.ALUNO,
    );
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: {
        email,
      },
    });
  }

  findAll() {
    return this.prisma.usuario.findMany({
      select: this.dadosPublicos,
      orderBy: {
        ID_Usuario: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        ID_Usuario: id,
      },
      select: this.dadosPublicos,
    });

    if (!usuario) {
      throw new NotFoundException(
        'Usuário não encontrado',
      );
    }

    return usuario;
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        ID_Usuario: id,
      },
    });

    if (!usuario) {
      throw new NotFoundException(
        'Usuário não encontrado',
      );
    }

    if (
      updateUsuarioDto.email &&
      updateUsuarioDto.email !== usuario.email
    ) {
      const emailEmUso =
        await this.prisma.usuario.findUnique({
          where: {
            email: updateUsuarioDto.email,
          },
        });

      if (emailEmUso) {
        throw new ConflictException(
          'Já existe um usuário cadastrado com este e-mail',
        );
      }
    }

    let password: string | undefined;

    if (updateUsuarioDto.password) {
      const salt = await bcrypt.genSalt();

      password = await bcrypt.hash(
        updateUsuarioDto.password,
        salt,
      );
    }

    return this.prisma.usuario.update({
      where: {
        ID_Usuario: id,
      },
      data: {
        name: updateUsuarioDto.name,
        email: updateUsuarioDto.email,
        perfil: updateUsuarioDto.perfil,
        ...(password
          ? { password }
          : {}),
      },
      select: this.dadosPublicos,
    });
  }

  async remove(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        ID_Usuario: id,
      },
    });

    if (!usuario) {
      throw new NotFoundException(
        'Usuário não encontrado',
      );
    }

    return this.prisma.usuario.delete({
      where: {
        ID_Usuario: id,
      },
      select: this.dadosPublicos,
    });
  }
}