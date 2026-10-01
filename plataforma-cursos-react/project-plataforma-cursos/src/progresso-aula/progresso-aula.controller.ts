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

import { ProgressoAulaService } from './progresso-aula.service';
import { CreateProgressoAulaDto } from './dto/create-progresso-aula.dto';
import { UpdateProgressoAulaDto } from './dto/update-progresso-aula.dto';

@ApiTags('progressos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('progressos')
export class ProgressoAulaController {
  constructor(private readonly progressoAulaService: ProgressoAulaService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar o progresso de uma aula' })
  create(@Body() createProgressoAulaDto: CreateProgressoAulaDto) {
    return this.progressoAulaService.create(createProgressoAulaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os progressos' })
  findAll() {
    return this.progressoAulaService.findAll();
  }

  @Get(':idUsuario/:idAula')
  @ApiOperation({ summary: 'Buscar o progresso de uma aula' })
  findOne(
    @Param('idUsuario') idUsuario: string,
    @Param('idAula') idAula: string,
  ) {
    return this.progressoAulaService.findOne(+idUsuario, +idAula);
  }

  @Patch(':idUsuario/:idAula')
  @ApiOperation({ summary: 'Atualizar o progresso de uma aula' })
  update(
    @Param('idUsuario') idUsuario: string,
    @Param('idAula') idAula: string,
    @Body() updateProgressoAulaDto: UpdateProgressoAulaDto,
  ) {
    return this.progressoAulaService.update(
      +idUsuario,
      +idAula,
      updateProgressoAulaDto,
    );
  }

  @Delete(':idUsuario/:idAula')
  @ApiOperation({ summary: 'Remover o progresso de uma aula' })
  remove(
    @Param('idUsuario') idUsuario: string,
    @Param('idAula') idAula: string,
  ) {
    return this.progressoAulaService.remove(+idUsuario, +idAula);
  }
}
