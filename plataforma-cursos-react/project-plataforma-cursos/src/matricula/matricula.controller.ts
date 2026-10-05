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

import { MatriculaService } from './matricula.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';

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

@ApiTags('matriculas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('matriculas')
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) { }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ALUNO, PerfilUsuario.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Criar uma nova matrícula' })
  create(
    @Body() dto: CreateMatriculaDto,
    @Req() req: RequestAutenticada,
  ) {
    return this.matriculaService.create(dto, req.user);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ALUNO, PerfilUsuario.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Listar matrículas permitidas ao usuário' })
  findAll(@Req() req: RequestAutenticada) {
    return this.matriculaService.findAll(req.user);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ALUNO, PerfilUsuario.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestAutenticada) {
    return this.matriculaService.findOne(+id, req.user);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMatriculaDto) {
    return this.matriculaService.update(+id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matriculaService.remove(+id);
  }
}