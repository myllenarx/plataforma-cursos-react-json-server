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

import { AulaService } from './aula.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

import { PerfilUsuario } from '../generated/prisma/enums';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';

type UsuarioAutenticado = {
  usuarioId: number;
  email: string;
  perfil: PerfilUsuario;
};

type RequestAutenticada = {
  user: UsuarioAutenticado;
};

@ApiTags('aulas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('aulas')
export class AulaController {
  constructor(private readonly aulaService: AulaService) { }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.PROFESSOR, PerfilUsuario.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Criar uma nova aula' })
  create(
    @Body() createAulaDto: CreateAulaDto,
    @Req() req: RequestAutenticada,
  ) {
    return this.aulaService.create(createAulaDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as aulas' })
  findAll() {
    return this.aulaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma aula pelo ID' })
  findOne(@Param('id') id: string) {
    return this.aulaService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.PROFESSOR, PerfilUsuario.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma aula' })
  update(
    @Param('id') id: string,
    @Body() updateAulaDto: UpdateAulaDto,
    @Req() req: RequestAutenticada,
  ) {
    return this.aulaService.update(+id, updateAulaDto, req.user);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.PROFESSOR, PerfilUsuario.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma aula' })
  remove(
    @Param('id') id: string,
    @Req() req: RequestAutenticada,
  ) {
    return this.aulaService.remove(+id, req.user);
  }
}