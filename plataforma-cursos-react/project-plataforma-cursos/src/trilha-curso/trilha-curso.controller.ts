import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TrilhaCursoService } from './trilha-curso.service';
import { CreateTrilhaCursoDto } from './dto/create-trilha-curso.dto';
import { UpdateTrilhaCursoDto } from './dto/update-trilha-curso.dto';

import { PerfilUsuario } from '../generated/prisma/enums';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('trilhas-cursos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('trilhas-cursos')
export class TrilhaCursoController {
  constructor(private readonly trilhaCursoService: TrilhaCursoService) { }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Adicionar um curso a uma trilha' })
  create(@Body() dto: CreateTrilhaCursoDto) {
    return this.trilhaCursoService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar os cursos associados às trilhas' })
  findAll() {
    return this.trilhaCursoService.findAll();
  }

  @Get(':idTrilha/:idCurso')
  findOne(
    @Param('idTrilha') idTrilha: string,
    @Param('idCurso') idCurso: string,
  ) {
    return this.trilhaCursoService.findOne(+idTrilha, +idCurso);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Patch(':idTrilha/:idCurso')
  update(
    @Param('idTrilha') idTrilha: string,
    @Param('idCurso') idCurso: string,
    @Body() dto: UpdateTrilhaCursoDto,
  ) {
    return this.trilhaCursoService.update(+idTrilha, +idCurso, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Delete(':idTrilha/:idCurso')
  remove(
    @Param('idTrilha') idTrilha: string,
    @Param('idCurso') idCurso: string,
  ) {
    return this.trilhaCursoService.remove(+idTrilha, +idCurso);
  }
}