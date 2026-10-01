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

@ApiTags('trilhas-cursos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('trilhas-cursos')
export class TrilhaCursoController {
  constructor(private readonly trilhaCursoService: TrilhaCursoService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar um curso a uma trilha' })
  create(@Body() createTrilhaCursoDto: CreateTrilhaCursoDto) {
    return this.trilhaCursoService.create(createTrilhaCursoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar os cursos associados às trilhas' })
  findAll() {
    return this.trilhaCursoService.findAll();
  }

  @Get(':idTrilha/:idCurso')
  @ApiOperation({ summary: 'Buscar um curso específico de uma trilha' })
  findOne(
    @Param('idTrilha') idTrilha: string,
    @Param('idCurso') idCurso: string,
  ) {
    return this.trilhaCursoService.findOne(+idTrilha, +idCurso);
  }

  @Patch(':idTrilha/:idCurso')
  @ApiOperation({ summary: 'Alterar a ordem de um curso na trilha' })
  update(
    @Param('idTrilha') idTrilha: string,
    @Param('idCurso') idCurso: string,
    @Body() updateTrilhaCursoDto: UpdateTrilhaCursoDto,
  ) {
    return this.trilhaCursoService.update(
      +idTrilha,
      +idCurso,
      updateTrilhaCursoDto,
    );
  }

  @Delete(':idTrilha/:idCurso')
  @ApiOperation({ summary: 'Remover um curso de uma trilha' })
  remove(
    @Param('idTrilha') idTrilha: string,
    @Param('idCurso') idCurso: string,
  ) {
    return this.trilhaCursoService.remove(+idTrilha, +idCurso);
  }
}
