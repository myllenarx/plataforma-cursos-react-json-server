import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProgressoAulaService } from './progresso-aula.service';
import { CreateProgressoAulaDto } from './dto/create-progresso-aula.dto';
import { UpdateProgressoAulaDto } from './dto/update-progresso-aula.dto';

import { PerfilUsuario } from '../generated/prisma/enums';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';

type RequestAutenticada = {
  user: {
    usuarioId: number;
    email: string;
    perfil: PerfilUsuario;
  };
};

@ApiTags('progressos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('progressos')
export class ProgressoAulaController {
  constructor(private readonly progressoAulaService: ProgressoAulaService) { }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ALUNO, PerfilUsuario.ADMIN)
  @Post()
  create(
    @Body() dto: CreateProgressoAulaDto,
    @Req() req: RequestAutenticada,
  ) {
    return this.progressoAulaService.create(dto, req.user);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ALUNO, PerfilUsuario.ADMIN)
  @Get()
  findAll(@Req() req: RequestAutenticada) {
    return this.progressoAulaService.findAll(req.user);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ALUNO, PerfilUsuario.ADMIN)
  @Get(':idUsuario/:idAula')
  findOne(
    @Param('idUsuario') idUsuario: string,
    @Param('idAula') idAula: string,
    @Req() req: RequestAutenticada,
  ) {
    return this.progressoAulaService.findOne(
      +idUsuario,
      +idAula,
      req.user,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ALUNO, PerfilUsuario.ADMIN)
  @Patch(':idUsuario/:idAula')
  update(
    @Param('idUsuario') idUsuario: string,
    @Param('idAula') idAula: string,
    @Body() dto: UpdateProgressoAulaDto,
    @Req() req: RequestAutenticada,
  ) {
    return this.progressoAulaService.update(
      +idUsuario,
      +idAula,
      dto,
      req.user,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Delete(':idUsuario/:idAula')
  remove(
    @Param('idUsuario') idUsuario: string,
    @Param('idAula') idAula: string,
  ) {
    return this.progressoAulaService.remove(+idUsuario, +idAula);
  }
}