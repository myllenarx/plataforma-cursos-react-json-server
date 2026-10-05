import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProgressoAulaDto } from './dto/create-progresso-aula.dto';
import { UpdateProgressoAulaDto } from './dto/update-progresso-aula.dto';
import {
  PerfilUsuario,
  StatusProgresso,
} from '../generated/prisma/enums';

type UsuarioAutenticado = {
  usuarioId: number;
  email: string;
  perfil: PerfilUsuario;
};

@Injectable()
export class ProgressoAulaService {
  constructor(private prisma: PrismaService) { }

  private readonly usuarioPublico = {
    ID_Usuario: true,
    name: true,
    email: true,
    perfil: true,
    date: true,
  };

  private async verificarMatricula(
    idUsuario: number,
    idAula: number,
  ) {
    const aula = await this.prisma.aula.findUnique({
      where: {
        ID_Aula: idAula,
      },
      include: {
        modulo: true,
      },
    });

    if (!aula) {
      throw new NotFoundException(
        'Aula não encontrada',
      );
    }

    const matricula =
      await this.prisma.matricula.findFirst({
        where: {
          ID_Usuario: idUsuario,
          ID_Curso: aula.modulo.ID_Curso,
        },
      });

    if (!matricula) {
      throw new BadRequestException(
        'O usuário não está matriculado no curso desta aula',
      );
    }

    return {
      aula,
      matricula,
    };
  }

  private async atualizarConclusaoCurso(
    idUsuario: number,
    idCurso: number,
  ) {
    const aulas =
      await this.prisma.aula.findMany({
        where: {
          modulo: {
            ID_Curso: idCurso,
          },
        },
        select: {
          ID_Aula: true,
        },
      });

    if (aulas.length === 0) {
      return;
    }

    const idsAulas = aulas.map(
      (aula) => aula.ID_Aula,
    );

    const concluidas =
      await this.prisma.progressoAula.count({
        where: {
          ID_Usuario: idUsuario,
          ID_Aula: {
            in: idsAulas,
          },
          Status: StatusProgresso.CONCLUIDO,
        },
      });

    if (concluidas !== aulas.length) {
      return;
    }

    const matricula =
      await this.prisma.matricula.findFirst({
        where: {
          ID_Usuario: idUsuario,
          ID_Curso: idCurso,
        },
      });

    if (
      matricula &&
      !matricula.DataConclusao
    ) {
      await this.prisma.matricula.update({
        where: {
          ID_Matricula:
            matricula.ID_Matricula,
        },
        data: {
          DataConclusao: new Date(),
        },
      });
    }
  }

  async create(
    dto: CreateProgressoAulaDto,
    usuario: UsuarioAutenticado,
  ) {
    const ID_Usuario =
      usuario.perfil ===
        PerfilUsuario.ALUNO
        ? usuario.usuarioId
        : dto.ID_Usuario;

    const { aula } =
      await this.verificarMatricula(
        ID_Usuario,
        dto.ID_Aula,
      );

    const progressoExistente =
      await this.prisma.progressoAula.findUnique({
        where: {
          ID_Usuario_ID_Aula: {
            ID_Usuario,
            ID_Aula: dto.ID_Aula,
          },
        },
      });

    let progresso;

    if (progressoExistente) {
      progresso =
        await this.prisma.progressoAula.update({
          where: {
            ID_Usuario_ID_Aula: {
              ID_Usuario,
              ID_Aula: dto.ID_Aula,
            },
          },
          data: {
            Status: dto.Status,
            DataConclusao:
              dto.DataConclusao
                ? new Date(
                  dto.DataConclusao,
                )
                : new Date(),
          },
        });
    } else {
      progresso =
        await this.prisma.progressoAula.create({
          data: {
            ID_Usuario,
            ID_Aula: dto.ID_Aula,
            Status: dto.Status,
            DataConclusao:
              dto.DataConclusao
                ? new Date(
                  dto.DataConclusao,
                )
                : new Date(),
          },
        });
    }

    await this.atualizarConclusaoCurso(
      ID_Usuario,
      aula.modulo.ID_Curso,
    );

    return progresso;
  }

  findAll(
    usuario: UsuarioAutenticado,
  ) {
    return this.prisma.progressoAula.findMany({
      where:
        usuario.perfil ===
          PerfilUsuario.ALUNO
          ? {
            ID_Usuario:
              usuario.usuarioId,
          }
          : undefined,

      include: {
        usuario: {
          select: this.usuarioPublico,
        },

        aula: {
          include: {
            modulo: true,
          },
        },
      },

      orderBy: [
        {
          ID_Usuario: 'asc',
        },
        {
          ID_Aula: 'asc',
        },
      ],
    });
  }

  async findOne(
    idUsuario: number,
    idAula: number,
    usuario: UsuarioAutenticado,
  ) {
    if (
      usuario.perfil ===
      PerfilUsuario.ALUNO &&
      idUsuario !== usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este progresso',
      );
    }

    const progresso =
      await this.prisma.progressoAula.findUnique({
        where: {
          ID_Usuario_ID_Aula: {
            ID_Usuario: idUsuario,
            ID_Aula: idAula,
          },
        },

        include: {
          usuario: {
            select:
              this.usuarioPublico,
          },

          aula: {
            include: {
              modulo: true,
            },
          },
        },
      });

    if (!progresso) {
      throw new NotFoundException(
        'Progresso não encontrado',
      );
    }

    return progresso;
  }

  async update(
    idUsuario: number,
    idAula: number,
    dto: UpdateProgressoAulaDto,
    usuario: UsuarioAutenticado,
  ) {
    if (
      usuario.perfil ===
      PerfilUsuario.ALUNO &&
      idUsuario !== usuario.usuarioId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para alterar este progresso',
      );
    }

    const { aula } =
      await this.verificarMatricula(
        idUsuario,
        idAula,
      );

    const progresso =
      await this.prisma.progressoAula.update({
        where: {
          ID_Usuario_ID_Aula: {
            ID_Usuario: idUsuario,
            ID_Aula: idAula,
          },
        },

        data: {
          Status: dto.Status,
          DataConclusao:
            dto.DataConclusao
              ? new Date(
                dto.DataConclusao,
              )
              : undefined,
        },
      });

    await this.atualizarConclusaoCurso(
      idUsuario,
      aula.modulo.ID_Curso,
    );

    return progresso;
  }

  remove(
    idUsuario: number,
    idAula: number,
  ) {
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